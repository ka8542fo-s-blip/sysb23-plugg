// Förgenererat uppläsningsljud med Google Cloud Text-to-Speech (Chirp 3 HD).
// Webbläsaren spelar filen när blockets hash finns i manifestet och läser
// annars med Web Speech (src/lib/useReadAloud.js).
//
//   node scripts/tts-generate.mjs voices
//       listar de svenska Chirp 3 HD-rösterna (voices.list, kostar inget)
//   node scripts/tts-generate.mjs samples <röst> [<röst> …]
//       provstycket med varje röst till tts/samples/<röst>.mp3
//   node scripts/tts-generate.mjs <delkurs> [<kapitel>] [--voice <röst>]
//       kapitlets (eller hela delkursens) block till public/audio/<hash>.mp3
//       och manifest.json
//
// Bara delkurser med ttsAudio i src/data/index.js (Databaser och
// Processorienterad) får ljud. Strategi läses med Web Speech, och skriptet
// vägrar den.
//
// Nyckeln läses ur GOOGLE_TTS_API_KEY i .env.local och skickas i headern
// X-Goog-Api-Key, aldrig i adressen. Den skrivs aldrig ut.
//
// Chirp 3 HD tar ren text (fältet text; SSML är förhandsversion och behövs
// inte). Gränsen är 5 000 byte per anrop, och å, ä och ö tar två byte, så
// långa block delas på meningsgräns under MAX_BYTES och delarna läggs ihop
// till en fil.
//
// Kostnadsspärr: varje anrops tecken loggas per kalendermånad i
// tts/usage.json innan det skickas, och skriptet vägrar fortsätta om
// månadens summa skulle passera MONTHLY_CAP. Filer som redan finns hoppas
// över, så skriptet kan avbrytas och köras igen.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { courses } from "../src/data/index.js";

const ROOT = new URL("..", import.meta.url);
const AUDIO_DIR = new URL("public/audio/", ROOT);
const SAMPLES_DIR = new URL("tts/samples/", ROOT);
const USAGE_FILE = new URL("tts/usage.json", ROOT);
const API = "https://texttospeech.googleapis.com/v1";

export const MONTHLY_CAP = 900_000;
const MAX_BYTES = 4500;
// Samtidiga anrop. Chirp 3 HD tillåter 200 anrop per minut och projekt;
// fyra parallella anrop à 2–3 s håller sig långt under det.
const CONCURRENCY = 4;
const LANGUAGE = "sv-SE";
// Rösten som kapitlen genereras med (vald efter röstprov 2026-10-13);
// --voice går före.
const DEFAULT_VOICE = "sv-SE-Chirp3-HD-Charon";
const CHIRP3_HD = /^sv-SE-Chirp3-HD-[A-Za-z]+$/;

export const SAMPLE_TEXT =
  "En relation är i andra normalformen om inget icke-primärattribut är funktionellt beroende av en äkta delmängd av en candidate key. Ett exempel är lossless join och dependency preservation.";

// ── Nyckel och anrop ─────────────────────────────────────────────────────
function apiKey() {
  const file = new URL(".env.local", ROOT);
  if (!existsSync(file)) throw new Error(".env.local saknas — lägg GOOGLE_TTS_API_KEY där.");
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const match = /^\s*GOOGLE_TTS_API_KEY\s*=\s*(.*?)\s*$/.exec(line);
    if (match) {
      const value = match[1].replace(/^(['"])(.*)\1$/, "$2");
      if (value) return value;
    }
  }
  throw new Error("GOOGLE_TTS_API_KEY saknas i .env.local.");
}

// Felmeddelandet tas ur Googles svar; varken nyckel eller headers skrivs ut.
async function call(path, init = {}) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${API}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": apiKey() },
    });
    if (res.ok) return res.json();
    const body = await res.json().catch(() => null);
    const message = body?.error?.message ?? res.statusText;
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      console.warn(`  HTTP ${res.status} (${message}) — försöker igen om ${attempt * 5} s`);
      await new Promise((r) => setTimeout(r, attempt * 5000));
      continue;
    }
    throw new Error(`Google TTS svarade HTTP ${res.status}: ${message}`);
  }
}

export function assertAudioCourse(courseId) {
  const course = courses.find((c) => c.id === courseId);
  if (!course) throw new Error(`Okänd delkurs: ${courseId}. Avbryter.`);
  if (!course.ttsAudio) {
    throw new Error(`${course.name} ska inte ha förgenererat ljud (ingen ttsAudio i src/data/index.js) — den läses med Web Speech. Avbryter.`);
  }
}

export function assertChirp3HD(voice) {
  if (!CHIRP3_HD.test(voice ?? "")) {
    throw new Error(`"${voice}" är ingen svensk Chirp 3 HD-röst (sv-SE-Chirp3-HD-<namn>). Avbryter.`);
  }
}

// ── Teckenlogg och spärr ─────────────────────────────────────────────────
export const countChars = (text) => [...text].length;
const monthKey = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Stockholm" }).slice(0, 7);

function readUsage() {
  return existsSync(USAGE_FILE) ? JSON.parse(readFileSync(USAGE_FILE, "utf8")) : {};
}

// Bokför anropet innan det skickas, så att ett avbrott aldrig gör loggen för låg.
function reserve(chars) {
  const usage = readUsage();
  const month = monthKey();
  const entry = usage[month] ?? { characters: 0, requests: 0 };
  if (entry.characters + chars > MONTHLY_CAP) {
    throw new Error(
      `Kostnadsspärren: ${month} har ${entry.characters} tecken, och ${chars} till skulle passera ${MONTHLY_CAP}. Avbryter.`,
    );
  }
  usage[month] = { characters: entry.characters + chars, requests: entry.requests + 1 };
  mkdirSync(new URL("tts/", ROOT), { recursive: true });
  writeFileSync(USAGE_FILE, `${JSON.stringify(usage, null, 2)}\n`);
  return usage[month].characters;
}

// ── Uppdelning och syntes ────────────────────────────────────────────────
const bytes = (text) => Buffer.byteLength(text, "utf8");

// Delar texten i bitar under MAX_BYTES: på meningsgräns, och bara om en
// mening ensam är för lång på kommatecken eller ordgräns.
export function splitText(text, max = MAX_BYTES) {
  if (bytes(text) <= max) return [text];
  const pieces = [];
  const pack = (units, joiner) => {
    let current = "";
    for (const unit of units) {
      const candidate = current ? `${current}${joiner}${unit}` : unit;
      if (bytes(candidate) <= max) current = candidate;
      else {
        if (current) pieces.push(current);
        current = unit;
      }
    }
    if (current) pieces.push(current);
  };
  const sentences = text.split(/(?<=[.!?…:;])\s+/);
  const units = sentences.flatMap((s) => {
    if (bytes(s) <= max) return [s];
    const parts = [];
    let current = "";
    for (const word of s.split(/(?<=,)\s+|\s+/)) {
      const candidate = current ? `${current} ${word}` : word;
      if (bytes(candidate) <= max) current = candidate;
      else {
        parts.push(current);
        current = word;
      }
    }
    if (current) parts.push(current);
    return parts;
  });
  pack(units, " ");
  return pieces;
}

// Tar bort en ID3-tagg i början, så att delarna kan läggas ihop till en fil.
function stripId3(buffer) {
  if (buffer.length > 10 && buffer.toString("latin1", 0, 3) === "ID3") {
    const size = ((buffer[6] & 0x7f) << 21) | ((buffer[7] & 0x7f) << 14) | ((buffer[8] & 0x7f) << 7) | (buffer[9] & 0x7f);
    return buffer.subarray(10 + size);
  }
  return buffer;
}

async function synthesize(text, voice) {
  assertChirp3HD(voice);
  const parts = [];
  let sent = 0;
  for (const [i, piece] of splitText(text).entries()) {
    const chars = countChars(piece);
    reserve(chars);
    sent += chars;
    const { audioContent } = await call("/text:synthesize", {
      method: "POST",
      body: JSON.stringify({
        input: { text: piece },
        voice: { languageCode: LANGUAGE, name: voice },
        audioConfig: { audioEncoding: "MP3" },
      }),
    });
    const audio = Buffer.from(audioContent, "base64");
    parts.push(i === 0 ? audio : stripId3(audio));
  }
  return { audio: Buffer.concat(parts), chars: sent, pieces: parts.length };
}

function writeManifest() {
  const hashes = readdirSync(AUDIO_DIR)
    .filter((f) => /^[0-9a-f]{12}\.mp3$/.test(f))
    .map((f) => f.slice(0, 12))
    .sort();
  writeFileSync(new URL("manifest.json", AUDIO_DIR), `${JSON.stringify({ hashes }, null, 2)}\n`);
  return hashes.length;
}

// ── Kommandon ────────────────────────────────────────────────────────────
async function listVoices() {
  const { voices = [] } = await call(`/voices?languageCode=${LANGUAGE}`);
  const chirp = voices.filter((v) => CHIRP3_HD.test(v.name)).sort((a, b) => a.name.localeCompare(b.name));
  for (const v of chirp) console.log(`${v.name}\t${v.ssmlGender}\t${v.naturalSampleRateHertz} Hz`);
  console.log(`${chirp.length} svenska Chirp 3 HD-röster.`);
}

async function samples(voices) {
  if (voices.length === 0) throw new Error("Ange minst en röst.");
  voices.forEach(assertChirp3HD);
  mkdirSync(SAMPLES_DIR, { recursive: true });
  for (const voice of voices) {
    const file = new URL(`${voice}.mp3`, SAMPLES_DIR);
    if (existsSync(file)) {
      console.log(`${voice}: finns redan, hoppar över`);
      continue;
    }
    const { audio, chars } = await synthesize(SAMPLE_TEXT, voice);
    writeFileSync(file, audio);
    console.log(`${voice}: ${chars} tecken, ${audio.length} byte`);
  }
  console.log(`Månadens summa: ${readUsage()[monthKey()]?.characters ?? 0} av ${MONTHLY_CAP} tecken.`);
}

async function generate(courseId, chapterId, voice) {
  assertAudioCourse(courseId);
  assertChirp3HD(voice);
  const { extractChapters } = await import("./tts-extract.mjs");
  const chapters = await extractChapters(courseId, chapterId);
  mkdirSync(AUDIO_DIR, { recursive: true });

  // Varje hash en gång, även när samma text står i flera kapitel
  // ("Kärnan i korthet", "Se upp för").
  const queue = [];
  const seen = new Set();
  let skipped = 0;
  for (const block of chapters.flatMap((c) => c.blocks)) {
    if (seen.has(block.hash)) continue;
    seen.add(block.hash);
    if (existsSync(new URL(`${block.hash}.mp3`, AUDIO_DIR))) skipped++;
    else queue.push(block);
  }
  const queuedChars = queue.reduce((sum, b) => sum + countChars(b.text), 0);
  const scope = chapterId ? `${courseId}/${chapterId}` : `${courseId} (${chapters.length} kapitel)`;
  console.log(`${scope}: ${queue.length} block att generera (${queuedChars} tecken), ${skipped} finns redan.`);

  let sent = 0;
  let made = 0;
  let failure = null;
  // Fyra arbetare tar block ur kön. reserve() är synkron, så spärren
  // räknar rätt även när anropen går parallellt; första felet stoppar alla.
  const worker = async () => {
    while (queue.length > 0 && !failure) {
      const block = queue.shift();
      try {
        const { audio, chars, pieces } = await synthesize(block.text, voice);
        writeFileSync(new URL(`${block.hash}.mp3`, AUDIO_DIR), audio);
        sent += chars;
        made++;
        console.log(`${block.hash}  ${chars} tecken${pieces > 1 ? ` i ${pieces} delar` : ""}  ${audio.length} byte`);
      } catch (error) {
        failure ??= error;
      }
    }
  };
  try {
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    if (failure) throw failure;
  } finally {
    const total = writeManifest();
    console.log(
      `${scope}: ${made} nya filer, ${skipped} fanns redan, ${sent} tecken skickade. ` +
        `Manifestet har ${total} filer. Månadens summa: ${readUsage()[monthKey()]?.characters ?? 0} av ${MONTHLY_CAP}.`,
    );
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const voiceFlag = args.indexOf("--voice");
  const voice = voiceFlag >= 0 ? args.splice(voiceFlag, 2)[1] : DEFAULT_VOICE;
  try {
    if (args[0] === "voices") await listVoices();
    else if (args[0] === "samples") await samples(args.slice(1));
    else if (args.length === 1 || args.length === 2) await generate(args[0], args[1] ?? null, voice);
    else {
      console.error("Användning: voices | samples <röst> … | <delkurs> [<kapitel>] [--voice <röst>]");
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
