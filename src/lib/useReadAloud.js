import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { load, save, KEYS } from "./storage.js";

// Uppläsning med webbläsarens inbyggda talsyntes (Web Speech API) —
// ingen backend, rösterna kommer gratis från systemet/webbläsaren.
// Texten läses stycke för stycke: dels för att markera och skrolla med i
// det som läses, dels för att Chrome tystnar mitt i långa utterances.
// Vilka element som läses bestäms av anroparen via en container-ref;
// allt märkt data-tts-skip hoppas över (menyer, metarader, tips).
//
// Röstkvaliteten varierar per system: Edge har neurala svenska röster,
// macOS/iOS kan ladda ner "förbättrade" röster som dyker upp här. Därför
// föredras naturliga röster automatiskt, och användaren kan välja själv
// (valet sparas per röstnamn).

const HIGHLIGHT_CLASS = "tts-aktuell";
const BLOCK_CLASS = "tts-block";
const BLOCK_SELECTOR = "h1, h2, h3, p, li, blockquote";
export const TTS_RATES = [0.85, 1, 1.15, 1.3, 1.5];

export function ttsSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Blocken i läsordning: element som själva innehåller ett annat kandidat-
// element släpps inte dubbelt — förälderns textContent täcker barnen, så
// endast det yttersta läses (t.ex. li med nästlad lista).
function collectBlocks(container) {
  const all = [...container.querySelectorAll(BLOCK_SELECTOR)];
  const candidates = new Set(all);
  return all.filter((el) => {
    if (el.closest("[data-tts-skip]")) return false;
    let parent = el.parentElement;
    while (parent && parent !== container) {
      if (candidates.has(parent)) return false;
      parent = parent.parentElement;
    }
    return el.textContent.trim().length > 0;
  });
}

export function useReadAloud(containerRef) {
  const [status, setStatus] = useState("idle"); // "idle" | "playing" | "paused"
  const [rate, setRateState] = useState(() => {
    const saved = load(KEYS.ttsRate, 1);
    return TTS_RATES.includes(saved) ? saved : 1;
  });
  const [voiceLists, setVoiceLists] = useState({ total: 0, swedish: [] });
  const [voiceName, setVoiceNameState] = useState(() => load(KEYS.ttsVoice, null));
  const blocksRef = useRef([]);
  const rateRef = useRef(rate);
  const voiceRef = useRef(null);
  const stoppedRef = useRef(true);
  const utteranceRef = useRef(null);

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

  // Vald röst: sparat namn om rösten finns kvar, annars den naturligaste
  // tillgängliga — Edge kallar sina neurala röster "Natural"/"Online",
  // macOS/iOS kallar nedladdade bättre röster "Förbättrad"/"Enhanced"/
  // "Premium" — annars en lokal, annars första bästa svenska.
  const voice = useMemo(() => {
    const sv = voiceLists.swedish;
    return (
      sv.find((v) => v.name === voiceName) ||
      sv.find((v) => /natural|neural|online/i.test(v.name)) ||
      sv.find((v) => /premium/i.test(v.name)) ||
      sv.find((v) => /förbättrad|enhanced/i.test(v.name)) ||
      sv.find((v) => v.localService) ||
      sv[0] ||
      null
    );
  }, [voiceLists, voiceName]);
  useEffect(() => {
    voiceRef.current = voice;
  }, [voice]);

  const clearHighlight = () => {
    for (const el of blocksRef.current) el.classList.remove(HIGHLIGHT_CLASS);
  };

  const stop = useCallback(() => {
    stoppedRef.current = true;
    window.speechSynthesis?.cancel();
    clearHighlight();
    for (const el of blocksRef.current) el.classList.remove(BLOCK_CLASS);
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
    const el = blocks[index];
    el.classList.add(HIGHLIGHT_CLASS);
    el.scrollIntoView({ block: "center", behavior: "smooth" });

    const utterance = new SpeechSynthesisUtterance(el.textContent.trim());
    utterance.lang = "sv-SE";
    if (voiceRef.current) utterance.voice = voiceRef.current;
    utterance.rate = rateRef.current;
    utterance.onend = () => speakBlock(index + 1);
    // cancel() ger error-event i vissa webbläsare — bara ett fel mitt i
    // en pågående uppläsning ska stoppa den.
    utterance.onerror = () => {
      if (!stoppedRef.current) stop();
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  // Hoppa till ett stycke (klick i texten): tysta den pågående utterancens
  // händelser INNAN cancel — de avfyras asynkront och skulle annars tolka
  // hoppet som ett stopp eller läsa vidare på fel ställe.
  function jumpTo(index) {
    if (stoppedRef.current || blocksRef.current.length === 0) return;
    const current = utteranceRef.current;
    if (current) {
      current.onend = null;
      current.onerror = null;
    }
    window.speechSynthesis.cancel();
    // Var uppläsningen pausad måste motorn väckas, annars köas nästa
    // utterance i pausat läge och inget hörs.
    window.speechSynthesis.resume();
    setStatus("playing");
    speakBlock(index);
  }

  const play = useCallback(() => {
    if (!ttsSupported() || !containerRef.current) return;
    window.speechSynthesis.cancel();
    const blocks = collectBlocks(containerRef.current);
    if (blocks.length === 0) return;
    blocksRef.current = blocks;
    for (const el of blocks) el.classList.add(BLOCK_CLASS);
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
      const index = blocksRef.current.findIndex((el) => el.contains(event.target));
      if (index >= 0) jumpTo(index);
    };
    container.addEventListener("click", onClick);
    return () => container.removeEventListener("click", onClick);
  }, [status, containerRef]); // eslint-disable-line react-hooks/exhaustive-deps

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
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
    // Pågående block behåller sin takt; nästa block tar den nya.
  }, []);

  const setVoice = useCallback((name) => {
    setVoiceNameState(name);
    save(KEYS.ttsVoice, name);
    // Pågående block behåller sin röst; nästa block tar den nya.
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
    voices: voiceLists.swedish,
    voice,
    setVoice,
    noSwedishVoice: voiceLists.total > 0 && voiceLists.swedish.length === 0,
  };
}
