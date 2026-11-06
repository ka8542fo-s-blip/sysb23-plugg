// Ändringar i ett textfält som om de skrivits, så att fältets egen
// ångra-historik (Ctrl/Cmd + Z) räknar med dem: att sätta värdet via React
// tömmer historiken. onChange kommer från fältets input-händelse.
export function applyEdit(field, change) {
  field.focus();
  field.setSelectionRange(change.from, change.to);
  const ok = change.insert
    ? document.execCommand("insertText", false, change.insert)
    : document.execCommand("delete");
  if (!ok) field.setRangeText(change.insert, change.from, change.to, "end");
  field.setSelectionRange(change.selStart, change.selEnd);
  if (!ok) field.dispatchEvent(new Event("input", { bubbles: true }));
}

// Hela texten byts, ett steg i ångra-historiken.
export function replaceAll(field, text) {
  if (text === field.value) return;
  applyEdit(field, { from: 0, to: field.value.length, insert: text, selStart: text.length, selEnd: text.length });
}

// Formaterarna ändrar bara blanktecken, så en plats i den gamla texten har
// en motsvarighet i den nya. Har varje rad kvar sitt innehåll följer platsen
// med på samma rad, med samma avstånd från radens första tecken; annars
// (när SQL-formateraren bytt radbrytningar) räknas tecknen som inte är
// blanktecken fram till platsen.
export function mapOffset(before, after, offset) {
  if (offset <= 0) return 0;
  const oldLines = before.split("\n");
  const newLines = after.split("\n");
  if (oldLines.length === newLines.length && oldLines.every((line, i) => line.trim() === newLines[i].trim())) {
    let row = 0;
    let start = 0;
    while (row < oldLines.length - 1 && offset > start + oldLines[row].length) {
      start += oldLines[row].length + 1;
      row++;
    }
    const col = offset - start;
    const oldLead = oldLines[row].length - oldLines[row].trimStart().length;
    const newLead = newLines[row].length - newLines[row].trimStart().length;
    // Längst till vänster före ett indrag: kvar där. Annars samma avstånd från koden.
    const newCol = col === 0 && oldLead > 0 ? 0 : Math.min(newLines[row].length, newLead + Math.max(0, col - oldLead));
    return newLines.slice(0, row).reduce((sum, line) => sum + line.length + 1, 0) + newCol;
  }
  const solid = (ch) => ch !== undefined && !/\s/.test(ch);
  let n = 0;
  for (let i = 0; i < offset; i++) if (solid(before[i])) n++;
  // Direkt efter ett tecken: stanna efter det. Efter blanktecken: före nästa.
  const glued = solid(before[offset - 1]);
  let seen = 0;
  for (let i = 0; i < after.length; i++) {
    if (!solid(after[i])) continue;
    if (!glued && seen === n) return i;
    seen++;
    if (glued && seen === n) return i + 1;
  }
  return after.length;
}

// ⌘K ⌘F: hela rutan formateras i ett steg som går att ångra. Markören och
// markeringen följer med till samma ställe i koden, och var allt markerat
// (⌘A först, som i VS Code) är allt markerat efteråt också.
export function formatField(field, format) {
  const before = field.value;
  const after = format(before);
  if (after === before) return;
  const all = before.length > 0 && field.selectionStart === 0 && field.selectionEnd === before.length;
  const selStart = all ? 0 : mapOffset(before, after, field.selectionStart);
  const selEnd = all ? after.length : mapOffset(before, after, field.selectionEnd);
  applyEdit(field, { from: 0, to: before.length, insert: after, selStart, selEnd });
}
