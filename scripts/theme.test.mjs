// Ljust och mörkt tema. Färgerna bor som RGB-kanaler i index.css och skrivs
// om för data-theme="dark". Testerna låser att varje färg har ett mörkt
// värde, att de mörka kontrasterna håller, att skriptet i index.html gör
// samma sak som lib/theme.js, och att komponenterna inte hårdkodar färger
// som skulle lysa vitt i mörkt läge.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { KEYS } from "../src/lib/storage.js";
import { THEME_CHOICES, THEME_COLOR, normalizeChoice, resolveTheme } from "../src/lib/theme.js";

const css = readFileSync(new URL("../src/index.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const tailwind = readFileSync(new URL("../tailwind.config.js", import.meta.url), "utf8");

function block(selector) {
  const start = css.indexOf(`${selector} {`);
  assert.ok(start >= 0, `${selector} saknas i index.css`);
  return css.slice(start, css.indexOf("\n}", start));
}

function vars(text) {
  const out = {};
  for (const m of text.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

const light = vars(block(":root"));
const dark = vars(block(':root[data-theme="dark"]'));

function rgb(value) {
  if (value.startsWith("#")) return [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16));
  return value.split(/\s+/).map(Number);
}

function contrast(a, b) {
  const lum = (c) => {
    const [r, g, bl] = c.map((v) => {
      const s = v / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

test("varje färgkanal och delkursfärg har ett värde i mörkt läge", () => {
  const themed = Object.keys(light).filter((name) => name.endsWith("-rgb") || name.startsWith("--c-"));
  assert.ok(themed.length >= 20);
  for (const name of themed) assert.ok(dark[name], `${name} saknar mörkt värde`);
  for (const name of Object.keys(dark)) assert.ok(light[name], `${name} finns bara i mörkt läge`);
});

test("Tailwind läser färgerna från kanalerna, så att klasserna byter med temat", () => {
  const used = [...tailwind.matchAll(/var\((--[a-z0-9-]+)\)/g)].map((m) => m[1]);
  assert.ok(used.length >= 15);
  for (const name of used) assert.ok(light[name], `tailwind.config.js använder ${name}, som inte finns i index.css`);
  assert.doesNotMatch(tailwind, /#[0-9a-fA-F]{6}/, "fasta hexfärger i tailwind.config.js byter inte med temat");
});

test("mörka kontraster: text minst 4,5:1 mot sina bakgrunder", () => {
  const c = (fg, bg) => contrast(rgb(dark[fg]), rgb(dark[bg]));
  const pairs = [
    ["--ink-rgb", "--paper-rgb", 7],
    ["--ink-rgb", "--surface-rgb", 7],
    ["--pine-rgb", "--paper-rgb", 4.5],
    ["--pine-rgb", "--surface-rgb", 4.5],
    ["--paper-rgb", "--pine-rgb", 4.5], // text-paper på fylld pine
    ["--on-solid-rgb", "--solid-rgb", 4.5], // text på figurernas stora fyllda ytor
    ["--code-ink-rgb", "--code-rgb", 7], // kodeditorn
    ["--paper-rgb", "--correct-rgb", 4.5],
    ["--paper-rgb", "--wrong-rgb", 4.5],
    ["--brass-text-rgb", "--surface-rgb", 4.5],
    ["--correct-rgb", "--surface-rgb", 4.5],
    ["--correct-rgb", "--correct-bg-rgb", 4.5],
    ["--wrong-rgb", "--surface-rgb", 4.5],
    ["--wrong-rgb", "--wrong-bg-rgb", 4.5],
  ];
  for (const [fg, bg, min] of pairs) assert.ok(c(fg, bg) >= min, `${fg} mot ${bg}: ${c(fg, bg).toFixed(2)} < ${min}`);
  // Delkursfärgerna är prickar och kanter: minst 3:1 mot ytan (grafik).
  for (const name of Object.keys(dark).filter((n) => n.startsWith("--c-"))) {
    const ratio = contrast(rgb(dark[name]), rgb(dark["--surface-rgb"]));
    assert.ok(ratio >= 3, `${name}: ${ratio.toFixed(2)} mot ytan`);
  }
});

test("temavalet: auto följer enheten, ljust och mörkt gäller alltid", () => {
  assert.deepEqual(THEME_CHOICES, ["auto", "ljust", "mork"]);
  assert.equal(resolveTheme("auto", true), "dark");
  assert.equal(resolveTheme("auto", false), "light");
  assert.equal(resolveTheme("mork", false), "dark");
  assert.equal(resolveTheme("ljust", true), "light");
  assert.equal(normalizeChoice("lila"), "auto");
  assert.equal(normalizeChoice(null), "auto");
  assert.equal(resolveTheme(undefined, true), "dark");
});

test("skriptet i index.html läser samma nyckel och sätter samma färger som lib/theme.js", () => {
  assert.match(html, new RegExp(`localStorage\\.getItem\\("sysb23:${KEYS.theme}"\\)`));
  assert.match(html, /choice === "mork" \|\| \(choice !== "ljust" && systemDark\)/);
  assert.match(html, new RegExp(`<meta name="theme-color" content="${THEME_COLOR.light}"`));
  assert.ok(html.includes(`"${THEME_COLOR.dark}"`), "mörk theme-color saknas i index.html");
  // Statusfältets färg är sidans bakgrund i respektive tema.
  const hex = (channels) => `#${rgb(channels).map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  assert.equal(hex(light["--paper-rgb"]), THEME_COLOR.light);
  assert.equal(hex(dark["--paper-rgb"]), THEME_COLOR.dark);
  // Skriptet måste köras före stilarna och appen, annars blinkar sidan vit.
  assert.ok(html.indexOf("data-theme") < html.indexOf("/src/main.jsx"));
});

test("komponenterna hårdkodar inga färger som lyser i mörkt läge", () => {
  const root = new URL("../src/", import.meta.url).pathname;
  const files = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) {
        if (name !== "data") walk(path);
      } else if (/\.jsx?$/.test(name) && !path.endsWith("lib/theme.js")) files.push(path);
    }
  };
  walk(root);
  const banned = [
    [/(?<![\w-])(bg|text|fill|stroke|border|from|to)-(white|black)\b/, "white/black-klass"],
    [/"white"|'white'|, white\)/, "\"white\""],
    [/#[0-9a-fA-F]{6}\b/, "hexfärg"],
    [/rgba?\(\s*\d/, "rgb()-färg med fasta värden"],
  ];
  const hits = [];
  for (const file of files) {
    readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      if (/^\s*\/\//.test(line)) return; // kommentarer får nämna dem
      for (const [re, what] of banned) if (re.test(line)) hits.push(`${file.replace(root, "src/")}:${i + 1} ${what}`);
    });
  }
  assert.deepEqual(hits, []);
});
