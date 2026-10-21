// Kapitelnumreringen i Läs. Ett översiktskapitel (overview: true) står först
// men räknas inte i "Kapitel N av M", så att kapitlen behåller sina nummer.
// Delas av KnowledgeHub och scripts/tts-extract.mjs: rubriken läses upp, och
// texten måste vara densamma i appen och i ljudet.
export function numberedChapterCount(chapters) {
  return chapters.filter((chapter) => !chapter.overview).length;
}
