import { useCallback, useEffect, useRef, useState } from "react";
import { load, save, KEYS } from "./storage.js";

// Uppläsning med webbläsarens inbyggda talsyntes (Web Speech API) —
// ingen backend, rösterna kommer från systemet/webbläsaren. Texten läses
// stycke för stycke: dels för att markera och skrolla med i det som
// läses, dels för att Chrome tystnar mitt i långa utterances. Vilka
// element som läses bestäms av anroparen via en container-ref; allt
// märkt data-tts-skip hoppas över (menyer, metarader, tangentbordstips).

const HIGHLIGHT_CLASS = "tts-aktuell";
const BLOCK_SELECTOR = "h1, h2, h3, p, li, blockquote";
export const TTS_RATES = [0.85, 1, 1.15, 1.3, 1.5];

export function ttsSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function swedishVoice() {
  const voices = window.speechSynthesis.getVoices();
  const sv = voices.filter((v) => v.lang?.toLowerCase().startsWith("sv"));
  return sv.find((v) => v.localService) || sv[0] || null;
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
  const [noSwedishVoice, setNoSwedishVoice] = useState(false);
  const blocksRef = useRef([]);
  const indexRef = useRef(0);
  const rateRef = useRef(rate);
  const stoppedRef = useRef(true);

  const clearHighlight = () => {
    for (const el of blocksRef.current) el.classList.remove(HIGHLIGHT_CLASS);
  };

  const stop = useCallback(() => {
    stoppedRef.current = true;
    window.speechSynthesis?.cancel();
    clearHighlight();
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
    indexRef.current = index;
    clearHighlight();
    const el = blocks[index];
    el.classList.add(HIGHLIGHT_CLASS);
    el.scrollIntoView({ block: "center", behavior: "smooth" });

    const utterance = new SpeechSynthesisUtterance(el.textContent.trim());
    utterance.lang = "sv-SE";
    const voice = swedishVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = rateRef.current;
    utterance.onend = () => speakBlock(index + 1);
    // cancel() ger error-event i vissa webbläsare — bara ett fel mitt i
    // en pågående uppläsning ska stoppa den.
    utterance.onerror = () => {
      if (!stoppedRef.current) stop();
    };
    window.speechSynthesis.speak(utterance);
  }

  const play = useCallback(() => {
    if (!ttsSupported() || !containerRef.current) return;
    window.speechSynthesis.cancel();
    // Chrome laddar röstlistan asynkront; anropet i sig triggar laddningen,
    // och utterance.lang låter motorn välja svensk röst även innan listan
    // är synlig här.
    window.speechSynthesis.getVoices();
    const blocks = collectBlocks(containerRef.current);
    if (blocks.length === 0) return;
    blocksRef.current = blocks;
    stoppedRef.current = false;
    setNoSwedishVoice(
      window.speechSynthesis.getVoices().length > 0 && !swedishVoice(),
    );
    setStatus("playing");
    speakBlock(0);
  }, [containerRef]); // eslint-disable-line react-hooks/exhaustive-deps

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setStatus("playing");
  }, []);

  const setRate = useCallback((value) => {
    rateRef.current = value;
    setRateState(value);
    save(KEYS.ttsRate, value);
    // Pågående block behåller sin takt; nästa block tar den nya.
  }, []);

  return { status, play, pause, resume, stop, rate, setRate, noSwedishVoice };
}
