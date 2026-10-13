// Vilka block uppläsningen läser och vad varje block heter. Samma kod körs i
// webbläsaren (useReadAloud.js) och i scripts/tts-extract.mjs, så att det
// förgenererade ljudet hittas med exakt den text som läses upp.
//
// Ett block är h1–h3, p, li eller blockquote i läskolumnen. Allt inom
// data-tts-skip hoppas över (menyer, metarader, diagram, kodblock), och ett
// block som ligger i ett annat block läses inte dubbelt.

export const BLOCK_SELECTOR = "h1, h2, h3, p, li, blockquote";

// Texten i ett block, utan det som ligger inom data-tts-skip.
export function blockText(el) {
  let text = "";
  for (const node of el.childNodes) {
    if (node.nodeType === 3) text += node.nodeValue;
    else if (node.nodeType === 1 && !node.hasAttribute("data-tts-skip")) text += blockText(node);
  }
  return text;
}

// trim och kollapsade blanksteg — nyckeln och uppläsningen använder samma.
export function normalizeText(text) {
  return text.replace(/\s+/g, " ").trim();
}

// Blocken i läsordning: element som själva innehåller ett annat kandidat-
// element släpps inte dubbelt — förälderns text täcker barnen, så endast
// det yttersta läses (t.ex. li med nästlad lista).
export function collectBlocks(container) {
  const all = [...container.querySelectorAll(BLOCK_SELECTOR)];
  const candidates = new Set(all);
  return all.filter((el) => {
    if (el.closest("[data-tts-skip]")) return false;
    let parent = el.parentElement;
    while (parent && parent !== container) {
      if (candidates.has(parent)) return false;
      parent = parent.parentElement;
    }
    return normalizeText(blockText(el)).length > 0;
  });
}

// SHA-1 i ren JS (synkront, samma i webbläsare och Node). Synkront så att
// det första ljudet kan starta direkt i klickhändelsen — Safari spelar
// annars inte upp ljud som startas efter en await.
function sha1Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const bitLength = bytes.length * 8;
  const padded = new Uint8Array(((bytes.length + 9 + 63) >> 6) << 6);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, Math.floor(bitLength / 2 ** 32));
  view.setUint32(padded.length - 4, bitLength >>> 0);

  let [h0, h1, h2, h3, h4] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  const w = new Uint32Array(80);
  const rotl = (x, n) => (x << n) | (x >>> (32 - n));
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(offset + i * 4);
    for (let i = 16; i < 80; i++) w[i] = rotl(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
    let [a, b, c, d, e] = [h0, h1, h2, h3, h4];
    for (let i = 0; i < 80; i++) {
      let f;
      let k;
      if (i < 20) [f, k] = [(b & c) | (~b & d), 0x5a827999];
      else if (i < 40) [f, k] = [b ^ c ^ d, 0x6ed9eba1];
      else if (i < 60) [f, k] = [(b & c) | (b & d) | (c & d), 0x8f1bbcdc];
      else [f, k] = [b ^ c ^ d, 0xca62c1d6];
      const temp = (rotl(a, 5) + f + e + k + w[i]) >>> 0;
      [e, d, c, b, a] = [d, c, rotl(b, 30) >>> 0, a, temp];
    }
    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
  }
  return [h0, h1, h2, h3, h4].map((h) => h.toString(16).padStart(8, "0")).join("");
}

// Blockets nyckel: de första 12 hextecknen av SHA-1 över den normaliserade
// texten. Ändras texten ändras nyckeln, och blocket läses med Web Speech
// tills ljudet har genererats om.
export function textHash(text) {
  return sha1Hex(normalizeText(text)).slice(0, 12);
}
