import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { load, save, KEYS } from "./storage.js";
import { blockText, collectBlocks, normalizeText, textHash } from "./ttsBlocks.js";

// Uppläsning stycke för stycke: dels för att markera det som läses, dels
// för att Chrome tystnar mitt i långa utterances. Vilka element som läses
// bestäms av anroparen via en container-ref; allt märkt data-tts-skip
// hoppas över (menyer, metarader, tips). Urvalet och blockens nycklar
// ligger i ttsBlocks.js, som scripts/tts-extract.mjs också använder.
//
// Ljudkällan väljs per block i delkurser med förgenererat ljud
// (`ttsAudio` i manifestet, options.audio här): finns blockets hash i
// public/audio/manifest.json spelas filen (Google Chirp 3 HD, se
// scripts/tts-generate.mjs) med <audio>, annars läser webbläsarens
// talsyntes (Web Speech API). Ändras ett stycke får det en ny hash och
// läses med Web Speech tills ljudet har genererats om. Övriga delkurser
// (Strategi) läses helt med Web Speech — även rubriker som "Kärnan i
// korthet", vars hash finns i manifestet.
//
// Web Speech-rösten väljs automatiskt, utan val i gränssnittet: Edge har
// neurala svenska röster, macOS/iOS kan ladda ner "förbättrade" röster,
// och de naturligaste föredras.

const HIGHLIGHT_CLASS = "tts-aktuell";
const BLOCK_CLASS = "tts-block";
export const TTS_RATES = [0.85, 1, 1.15, 1.3, 1.5];

const AUDIO_DIR = `${import.meta.env.BASE_URL}audio/`;

// Manifestet hämtas en gång per sidvisning. Saknas det eller går
// hämtningen fel läses allt med Web Speech.
let manifestPromise = null;
function loadManifest() {
  manifestPromise ??= fetch(`${AUDIO_DIR}manifest.json`, { cache: "no-cache" })
    .then((res) => (res.ok ? res.json() : null))
    .then((json) => new Set(Array.isArray(json?.hashes) ? json.hashes : []))
    .catch(() => new Set());
  return manifestPromise;
}

export function ttsSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function useReadAloud(containerRef, { audio: useFiles = false } = {}) {
  const [status, setStatus] = useState("idle"); // "idle" | "playing" | "paused"
  const [rate, setRateState] = useState(() => {
    const saved = load(KEYS.ttsRate, 1);
    return TTS_RATES.includes(saved) ? saved : 1;
  });
  const [voiceLists, setVoiceLists] = useState({ total: 0, swedish: [] });
  const blocksRef = useRef([]); // [{ el, text, hash }]
  const rateRef = useRef(rate);
  const voiceRef = useRef(null);
  const stoppedRef = useRef(true);
  const utteranceRef = useRef(null);
  const audioRef = useRef(null);
  const prefetchRef = useRef(null);
  const manifestRef = useRef(new Set());
  // "audio" när en fil spelas, "speech" när Web Speech läser.
  const modeRef = useRef("speech");
  // Räknas upp vid varje nytt block, hopp och stopp. Händelser från ett
  // block som inte längre är aktuellt (sena onend, avbrutna play()) ignoreras.
  const seqRef = useRef(0);

  useEffect(() => {
    manifestRef.current = new Set();
    if (!useFiles) return undefined;
    let alive = true;
    loadManifest().then((hashes) => {
      if (alive) manifestRef.current = hashes;
    });
    return () => {
      alive = false;
    };
  }, [useFiles]);

  // Röstlistan laddas asynkront i Chrome — lyssna tills den finns.
  useEffect(() => {
    if (!ttsSupported()) return undefined;
    const update = () => {
      const all = window.speechSynthesis.getVoices();
      setVoiceLists({
        total: all.length,
        swedish: all.filter((v) => v.lang?.toLowerCase().startsWith("sv")),
      });
    };
    update();
    window.speechSynthesis.addEventListener("voiceschanged", update);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", update);
  }, []);

  // Den naturligaste svenska rösten — Edge kallar sina neurala röster
  // "Natural"/"Online", macOS/iOS kallar nedladdade bättre röster
  // "Förbättrad"/"Enhanced"/"Premium" — annars en lokal, annars första
  // bästa svenska.
  const voice = useMemo(() => {
    const sv = voiceLists.swedish;
    return (
      sv.find((v) => /natural|neural|online/i.test(v.name)) ||
      sv.find((v) => /premium/i.test(v.name)) ||
      sv.find((v) => /förbättrad|enhanced/i.test(v.name)) ||
      sv.find((v) => v.localService) ||
      sv[0] ||
      null
    );
  }, [voiceLists]);
  useEffect(() => {
    voiceRef.current = voice;
  }, [voice]);

  const clearHighlight = () => {
    for (const block of blocksRef.current) block.el.classList.remove(HIGHLIGHT_CLASS);
  };

  // Tystar både Web Speech och ljudfilen, utan att deras händelser hinner
  // tolka avbrottet som slut på blocket.
  const silence = () => {
    const utterance = utteranceRef.current;
    if (utterance) {
      utterance.onend = null;
      utterance.onerror = null;
    }
    window.speechSynthesis?.cancel();
    const audio = audioRef.current;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
    }
  };

  const stop = useCallback(() => {
    stoppedRef.current = true;
    seqRef.current++;
    silence();
    clearHighlight();
    for (const block of blocksRef.current) block.el.classList.remove(BLOCK_CLASS);
    blocksRef.current = [];
    setStatus("idle");
  }, []);

  // Kapitelbyte eller avmontering ska aldrig lämna en röst pratande.
  useEffect(() => stop, [stop]);

  function speakBlock(index) {
    const blocks = blocksRef.current;
    if (stoppedRef.current) return;
    if (index >= blocks.length) {
      stop();
      return;
    }
    clearHighlight();
    const seq = ++seqRef.current;
    const block = blocks[index];
    // Ingen autoscroll — läsaren bestämmer själv var på sidan stycket är;
    // markeringen räcker för att hitta det aktuella stycket.
    block.el.classList.add(HIGHLIGHT_CLASS);
    if (manifestRef.current.has(block.hash)) playFile(index, seq);
    else speakWeb(index, seq);
  }

  function speakWeb(index, seq) {
    modeRef.current = "speech";
    const utterance = new SpeechSynthesisUtterance(blocksRef.current[index].text);
    utterance.lang = "sv-SE";
    if (voiceRef.current) utterance.voice = voiceRef.current;
    utterance.rate = rateRef.current;
    utterance.onend = () => {
      if (seq === seqRef.current) speakBlock(index + 1);
    };
    // cancel() ger error-event i vissa webbläsare — bara ett fel mitt i
    // en pågående uppläsning ska stoppa den.
    utterance.onerror = () => {
      if (seq === seqRef.current && !stoppedRef.current) stop();
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function playFile(index, seq) {
    modeRef.current = "audio";
    const audio = (audioRef.current ??= new Audio());
    // Går filen inte att spela (saknas, nätverksfel) läses blocket med
    // Web Speech i stället, och uppläsningen fortsätter.
    const fallback = () => {
      if (seq !== seqRef.current || stoppedRef.current) return;
      audio.onended = null;
      audio.onerror = null;
      speakWeb(index, seq);
    };
    audio.onended = () => {
      if (seq === seqRef.current) speakBlock(index + 1);
    };
    audio.onerror = fallback;
    audio.src = `${AUDIO_DIR}${blocksRef.current[index].hash}.mp3`;
    audio.playbackRate = rateRef.current;
    audio.play().catch(fallback);

    // Nästa fil laddas i förväg, så att det inte blir ett glapp mellan blocken.
    const next = blocksRef.current[index + 1];
    if (next && manifestRef.current.has(next.hash)) {
      const prefetch = (prefetchRef.current ??= new Audio());
      prefetch.preload = "auto";
      prefetch.src = `${AUDIO_DIR}${next.hash}.mp3`;
    }
  }

  // Hoppa till ett stycke (klick i texten): tysta det pågående blocket
  // först — dess händelser avfyras asynkront och skulle annars tolka
  // hoppet som ett stopp eller läsa vidare på fel ställe.
  function jumpTo(index) {
    if (stoppedRef.current || blocksRef.current.length === 0) return;
    seqRef.current++;
    silence();
    // Var uppläsningen pausad måste motorn väckas, annars köas nästa
    // utterance i pausat läge och inget hörs.
    window.speechSynthesis.resume();
    setStatus("playing");
    speakBlock(index);
  }

  const play = useCallback(() => {
    if (!ttsSupported() || !containerRef.current) return;
    window.speechSynthesis.cancel();
    const blocks = collectBlocks(containerRef.current).map((el) => {
      const text = normalizeText(blockText(el));
      return { el, text, hash: textHash(text) };
    });
    if (blocks.length === 0) return;
    blocksRef.current = blocks;
    for (const block of blocks) block.el.classList.add(BLOCK_CLASS);
    stoppedRef.current = false;
    setStatus("playing");
    speakBlock(0);
  }, [containerRef]); // eslint-disable-line react-hooks/exhaustive-deps

  // Under uppläsning är styckena klickbara: klick hoppar dit direkt —
  // läs om, hoppa fram eller tillbaka. Klick på länkar och knappar
  // lämnas ifred, och paus + klick börjar läsa från det klickade stycket.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || status === "idle") return undefined;
    const onClick = (event) => {
      if (event.target.closest("a, button, select, input, label")) return;
      const index = blocksRef.current.findIndex((block) => block.el.contains(event.target));
      if (index >= 0) jumpTo(index);
    };
    container.addEventListener("click", onClick);
    return () => container.removeEventListener("click", onClick);
  }, [status, containerRef]); // eslint-disable-line react-hooks/exhaustive-deps

  const pause = useCallback(() => {
    if (modeRef.current === "audio") audioRef.current?.pause();
    else window.speechSynthesis.pause();
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    if (modeRef.current === "audio") audioRef.current?.play().catch(() => {});
    else window.speechSynthesis.resume();
    setStatus("playing");
  }, []);

  const toggle = useCallback(() => {
    if (status === "playing") pause();
    else if (status === "paused") resume();
  }, [status, pause, resume]);

  const setRate = useCallback((value) => {
    rateRef.current = value;
    setRateState(value);
    save(KEYS.ttsRate, value);
    // En ljudfil byter takt direkt. Ett Web Speech-block behåller sin
    // takt; nästa block tar den nya.
    if (modeRef.current === "audio" && audioRef.current) audioRef.current.playbackRate = value;
  }, []);

  return {
    status,
    play,
    pause,
    resume,
    toggle,
    stop,
    rate,
    setRate,
    noSwedishVoice: voiceLists.total > 0 && voiceLists.swedish.length === 0,
  };
}
