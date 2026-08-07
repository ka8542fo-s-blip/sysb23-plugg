// Kopierar sql.js WASM-filer till public/ före dev och build.
//
// Vite bundlar inte WASM-filen åt oss, och webbläsarbygget av sql.js frågar
// efter sql-wasm-browser.wasm medan Node-bygget frågar efter sql-wasm.wasm.
// Båda kopieras, så att filen finns oavsett vilken entry som väljs.

import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const from = join(root, "node_modules", "sql.js", "dist");
const to = join(root, "public");

const files = ["sql-wasm-browser.wasm", "sql-wasm.wasm"];

await mkdir(to, { recursive: true });
for (const file of files) {
  await copyFile(join(from, file), join(to, file));
  console.log(`kopierad: ${file}`);
}
