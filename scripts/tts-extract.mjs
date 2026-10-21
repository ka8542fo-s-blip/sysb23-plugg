// Plockar ut uppläsningens block per kapitel: renderar den riktiga
// ChapterView (samma markdown-pipeline och komponenter som sajten, via
// Vites SSR) och kör samma urval som webbläsaren (src/lib/ttsBlocks.js) på
// läskolumnen. Diagram och kodblock har data-tts-skip och läses aldrig.
//
//   node scripts/tts-extract.mjs                    alla delkurser
//   node scripts/tts-extract.mjs databaser          alla kapitel i delkursen
//   node scripts/tts-extract.mjs databaser kap7     ett kapitel
//
// Skriver tts/blocks/<delkurs>-<kapitel>.json med { hash, text } per block
// (tts/ committas inte). scripts/tts-generate.mjs använder extractChapters
// direkt, så att ljudet alltid genereras från den aktuella texten.
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { createServer } from "vite";
import { courses } from "../src/data/index.js";
import { blockText, collectBlocks, normalizeText, textHash } from "../src/lib/ttsBlocks.js";

const ROOT = new URL("..", import.meta.url);
const noop = () => {};

// [{ courseId, chapterId, title, blocks: [{ hash, text }] }]
export async function extractChapters(courseId = null, chapterId = null) {
  const selected = courses.filter((c) => (c.chapters?.length ?? 0) > 0 && (!courseId || c.id === courseId));
  if (courseId && selected.length === 0) throw new Error(`Okänd delkurs eller delkurs utan kapitel: ${courseId}`);

  const vite = await createServer({
    root: fileURLToPath(ROOT),
    logLevel: "error",
    appType: "custom",
    server: { middlewareMode: true, hmr: false },
  });
  try {
    const { default: ChapterView } = await vite.ssrLoadModule("/src/components/knowledge/ChapterView.jsx");
    const result = [];
    for (const course of selected) {
      const chapters = course.chapters;
      // Sammanfattningen (BPM) läses i samma vy men är inget kapitel.
      const readingOrder = course.summary ? [course.summary, ...chapters] : chapters;
      readingOrder.forEach((chapter, index) => {
        if (chapterId && chapter.id !== chapterId) return;
        // Samma props som KnowledgeHub ger kapitlet; knapparna läses inte.
        const html = renderToStaticMarkup(
          createElement(ChapterView, {
            chapter,
            number: chapter.summary ? null : chapter.number ?? chapters.indexOf(chapter) + 1,
            total: chapters.length,
            isFirst: index === 0,
            isLast: index === readingOrder.length - 1,
            course,
            isRead: false,
            onToggleRead: noop,
            onOpenTopic: noop,
            onPractice: noop,
            canPractice: true,
            onBack: noop,
            onPrev: noop,
            onNext: noop,
          }),
        );
        const { document } = new JSDOM(`<!doctype html><body>${html}</body>`).window;
        const root = document.querySelector("[data-tts-root]");
        if (!root) throw new Error(`${course.id}/${chapter.id}: hittar inte läskolumnen (data-tts-root)`);
        const blocks = collectBlocks(root).map((el) => {
          const text = normalizeText(blockText(el));
          return { hash: textHash(text), text };
        });
        result.push({ courseId: course.id, chapterId: chapter.id, title: chapter.title, blocks });
      });
    }
    if (chapterId && result.length === 0) throw new Error(`Okänt kapitel: ${courseId}/${chapterId}`);
    return result;
  } finally {
    await vite.close();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [courseId = null, chapterId = null] = process.argv.slice(2);
  const outDir = new URL("tts/blocks/", ROOT);
  mkdirSync(outDir, { recursive: true });
  let totalChars = 0;
  for (const chapter of await extractChapters(courseId, chapterId)) {
    const chars = chapter.blocks.reduce((sum, b) => sum + [...b.text].length, 0);
    totalChars += chars;
    writeFileSync(
      new URL(`${chapter.courseId}-${chapter.chapterId}.json`, outDir),
      `${JSON.stringify(chapter, null, 2)}\n`,
    );
    console.log(`${chapter.courseId}/${chapter.chapterId}: ${chapter.blocks.length} block, ${chars} tecken — ${chapter.title}`);
  }
  console.log(`Totalt ${totalChars} tecken. Blocken ligger i tts/blocks/.`);
}
