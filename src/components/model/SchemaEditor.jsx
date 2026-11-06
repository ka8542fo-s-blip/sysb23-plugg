import { useLayoutEffect, useRef } from "react";
import { chordStep, FORMAT_KEYS, IS_MAC, isSelectAll } from "../../lib/keys.js";
import { formatField } from "../../lib/textEdit.js";

const SUBS = ["₁", "₂", "₃", "₄"];
// På Mac heter Alt-tangenten Option (⌥); händelsen är densamma. Ctrl + siffra
// fungerar också, för den som hellre trycker det.
const MOD_LABEL = IS_MAC ? "⌥ Option" : "Alt";

const DEFAULT_INDENT_AFTER = { "(": 1 };
const CLOSER = { "(": ")", "{": "}", "[": "]" };

// Kodruta för relationsscheman och DDL: mörk yta, radnummer, Tab gör indrag
// (Shift+Tab tar bort), Enter behåller indraget och drar in efter en rad
// som slutar med "(", och små siffror för CK₁/PK₁/FK₂ sätts in med
// knapparna eller Alt + siffra. Esc lämnar fältet.
//
// Tillägg för fliken Java (allt av som standard, så att Modellera är som förut):
//   indentWidth  blanksteg per indrag (2; Java 4)
//   indentAfter  { tecken: antal indrag } efter en rad som slutar med tecknet
//                ({ "(": 1 }; Java { "{": 1, "(": 2 }, som i lösningsförslagen)
//   smartIndent  Tab/Shift+Tab på flera markerade rader drar in/ut alla,
//                Shift+Tab tar bort också ett ofullständigt indrag, ett
//                slutande } eller ) på en tom rad drar ut lika mycket som
//                dess öppnande drog in, Enter mellan { och } lägger
//                slutklammern på egen rad, och Enter efter en rad som
//                stänger en parentes från en tidigare rad utgår från den
//                radens indrag
//   highlight    (text) => noder: syntaxfärgning i ett lager under ett
//                genomskinligt textfält (samma typsnitt, utfyllnad och
//                radhöjd, ingen radbrytning, rullningen synkad)
//   onSubmit     Ctrl/⌘ + Enter anropar den (Rätta)
//   format       (text) => text: ⌘K ⌘F (Ctrl+K Ctrl+F) formaterar hela rutan
//                i ett steg som går att ångra (lib/codeIndent.js)
//   hint         egen tipsrad under rutan
//
// Ett klick i rutans ram (rubrikraden, radnumren) ger textfältet fokus, så
// att ⌘A markerar rutans text och inte hela sidan. Ett radnummer markerar
// sin rad, som i VS Code.
export default function SchemaEditor({
  id,
  value,
  onChange,
  placeholder,
  rows = 16,
  label,
  subscripts = true,
  indentWidth = 2,
  indentAfter = DEFAULT_INDENT_AFTER,
  smartIndent = false,
  highlight = null,
  onSubmit = null,
  format = null,
  hint = null,
}) {
  const ref = useRef(null);
  const layerRef = useRef(null);
  const chord = useRef(null); // när ⌘K trycktes, i väntan på F
  const INDENT = " ".repeat(indentWidth);
  const hintId = id ? `${id}-tips` : undefined;

  function setText(next, selStart, selEnd = selStart) {
    const field = ref.current;
    onChange(next);
    requestAnimationFrame(() => {
      field.focus();
      field.selectionStart = selStart;
      field.selectionEnd = selEnd;
    });
  }

  function replaceSelection(insert, cursorOffset = insert.length) {
    const field = ref.current;
    const { selectionStart: start, selectionEnd: end } = field;
    const next = value.slice(0, start) + insert + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      field.focus();
      field.selectionStart = field.selectionEnd = start + cursorOffset;
    });
  }

  function outdent() {
    const field = ref.current;
    const start = field.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    if (!value.startsWith(INDENT, lineStart)) return;
    onChange(value.slice(0, lineStart) + value.slice(lineStart + INDENT.length));
    requestAnimationFrame(() => {
      field.selectionStart = field.selectionEnd = Math.max(lineStart, start - INDENT.length);
    });
  }

  // smartIndent: raderna som markeringen täcker (en markering som slutar
  // först på en rad tar inte med den raden).
  function selectedLines() {
    const { selectionStart: start, selectionEnd: end } = ref.current;
    const first = value.lastIndexOf("\n", start - 1) + 1;
    const endAt = end > start && value[end - 1] === "\n" ? end - 1 : end;
    let last = value.indexOf("\n", endAt);
    if (last < 0) last = value.length;
    return { start, end, first, last, multi: value.slice(first, last).includes("\n") };
  }

  function shiftLines(direction) {
    const { start, first, last, multi } = selectedLines();
    const block = value.slice(first, last);
    if (!multi) {
      // En rad: Shift+Tab tar bort upp till ett indrag, också ett ofullständigt.
      const remove = Math.min(indentWidth, /^ */.exec(block)[0].length);
      if (!remove) return;
      setText(value.slice(0, first) + block.slice(remove) + value.slice(last), Math.max(first, start - remove));
      return;
    }
    const next = block
      .split("\n")
      .map((line) => {
        if (direction > 0) return line.trim() ? INDENT + line : line;
        return line.slice(Math.min(indentWidth, /^ */.exec(line)[0].length));
      })
      .join("\n");
    setText(value.slice(0, first) + next + value.slice(last), first, first + next.length);
  }

  // Indraget som Enter utgår från. Med smartIndent tar en rad som stänger
  // fler "(" än den öppnar (som andra raden i try-huvudet, "...prepareStatement(sql)) {")
  // indraget från raden där parentesen öppnades, så att kroppen hamnar ett
  // indrag in från try och inte från fortsättningsraden.
  function lineIndent(lineStart, line) {
    const own = /^\s*/.exec(line)[0];
    if (!smartIndent) return own;
    const net = (text) => {
      const code = text
        .replace(/"(?:\\.|[^"\\\n])*"/g, "")
        .replace(/'(?:\\.|[^'\\\n])*'/g, "")
        .replace(/\/\/.*$/, "");
      return (code.match(/\)/g) || []).length - (code.match(/\(/g) || []).length;
    };
    let open = net(line);
    let end = lineStart - 1; // radbrytningen som avslutar raden ovanför
    while (open > 0 && end >= 0) {
      const prevStart = end > 0 ? value.lastIndexOf("\n", end - 1) + 1 : 0;
      const text = value.slice(prevStart, end);
      open += net(text);
      if (open <= 0) return /^\s*/.exec(text)[0];
      end = prevStart - 1;
    }
    return own;
  }

  function onKeyDown(event) {
    if (format) {
      const step = chordStep(chord.current, event);
      if (step === "start") {
        event.preventDefault();
        chord.current = Date.now();
        return;
      }
      if (step === "keep") return;
      chord.current = null;
      if (step === "format") {
        event.preventDefault();
        formatField(event.target, format);
        return;
      }
    }
    if (event.key === "Tab") {
      event.preventDefault();
      if (smartIndent) {
        if (event.shiftKey) shiftLines(-1);
        else if (selectedLines().multi) shiftLines(1);
        else replaceSelection(INDENT);
        return;
      }
      if (event.shiftKey) outdent(); else replaceSelection(INDENT);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (onSubmit && (event.metaKey || event.ctrlKey)) {
        onSubmit();
        return;
      }
      const start = event.target.selectionStart;
      const end = event.target.selectionEnd;
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const line = value.slice(lineStart, start);
      const current = lineIndent(lineStart, line);
      const opener = line.trim().slice(-1);
      const extra = INDENT.repeat(indentAfter[opener] || 0);
      // { | } blir tre rader, med markören indragen på den mittersta.
      if (smartIndent && extra && CLOSER[opener] && value[end] === CLOSER[opener]) {
        replaceSelection("\n" + current + extra + "\n" + current, 1 + current.length + extra.length);
        return;
      }
      replaceSelection("\n" + current + extra);
      return;
    }
    // AltGr (t.ex. "}" på svenskt tangentbord i Windows) kommer som Ctrl + Alt;
    // det är text, inte ett kortkommando.
    if (smartIndent && !event.metaKey && !(event.ctrlKey && !event.altKey)) {
      const opener = Object.keys(indentAfter).find((o) => CLOSER[o] === event.key);
      const field = event.target;
      if (opener && field.selectionStart === field.selectionEnd) {
        const start = field.selectionStart;
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        const before = value.slice(lineStart, start);
        if (before.length && /^ +$/.test(before)) {
          event.preventDefault();
          const keep = before.slice(Math.min(before.length, indentWidth * indentAfter[opener]));
          setText(value.slice(0, lineStart) + keep + event.key + value.slice(start), lineStart + keep.length + 1);
          return;
        }
      }
    }
    if (subscripts && (event.altKey || event.ctrlKey) && !event.metaKey && /^[0-9]$/.test(event.key)) {
      event.preventDefault();
      replaceSelection("₀₁₂₃₄₅₆₇₈₉"[Number(event.key)]);
      return;
    }
    if (event.key === "Escape") event.target.blur();
  }

  // Färglagret följer textfältets rullning (vågrätt när en rad är lång).
  function syncLayer() {
    const field = ref.current;
    const layer = layerRef.current;
    if (!field || !layer) return;
    layer.scrollTop = field.scrollTop;
    layer.scrollLeft = field.scrollLeft;
  }
  useLayoutEffect(syncLayer, [value]);

  function onFrameMouseDown(event) {
    const field = ref.current;
    if (!field || event.button !== 0 || event.target === field || event.target.closest("button")) return;
    event.preventDefault();
    field.focus();
    const gutter = event.target.closest("[data-gutter]");
    if (!gutter) return;
    const style = getComputedStyle(gutter);
    const row = Math.floor((event.clientY - gutter.getBoundingClientRect().top - parseFloat(style.paddingTop)) / parseFloat(style.lineHeight));
    const lines = value.split("\n");
    if (!(row >= 0 && row < lines.length)) return;
    const start = lines.slice(0, row).reduce((sum, line) => sum + line.length + 1, 0);
    field.setSelectionRange(start, start + lines[row].length);
  }

  // ⌘A när fokus står på en knapp i rubrikraden (små siffror) gäller också rutan.
  function onFrameKeyDown(event) {
    if (event.target === ref.current || !isSelectAll(event)) return;
    event.preventDefault();
    ref.current?.focus();
    ref.current?.select();
  }

  // Med färgning finns alltid en tom rad till, så att en vågrät rullist
  // aldrig tvingar fram lodrät rullning i fältet.
  const lineCount = Math.max(rows, value.split("\n").length + (highlight ? 1 : 0));
  const caret = { caretColor: "rgb(var(--code-ink-rgb))" };

  const textarea = highlight ? (
    <div className="relative min-w-0 flex-1">
      <pre
        ref={layerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 m-0 overflow-hidden whitespace-pre px-3 py-3 font-mono text-[14px] leading-6 text-code-ink"
        style={{ tabSize: indentWidth }}
      >
        <code className="block w-max min-w-full pr-16">{highlight(value)}{"\n"}</code>
      </pre>
      <textarea
        id={id}
        ref={ref}
        aria-label={label}
        aria-describedby={hintId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onScroll={syncLayer}
        placeholder={placeholder}
        rows={rows}
        wrap="off"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        style={{ tabSize: indentWidth, ...caret }}
        className="relative block h-full min-h-0 w-full resize-none overflow-auto whitespace-pre bg-transparent px-3 py-3 font-mono text-[14px] leading-6 text-transparent placeholder:text-code-ink/35 selection:bg-code-ink/25 focus:outline-none"
      />
    </div>
  ) : (
    <textarea
      id={id}
      ref={ref}
      aria-label={label}
      aria-describedby={hintId}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={rows}
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      autoComplete="off"
      style={{ tabSize: indentWidth, ...caret }}
      className="min-h-0 w-full resize-y bg-transparent px-3 py-3 font-mono text-[14px] leading-6 text-code-ink placeholder:text-code-ink/35 focus:outline-none"
    />
  );

  return (
    <div>
      <div
        className={highlight ? "rounded-lg focus-within:ring-2 focus-within:ring-pine focus-within:ring-offset-2 focus-within:ring-offset-surface" : undefined}
        onMouseDown={onFrameMouseDown}
        onKeyDown={onFrameKeyDown}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-lg border border-b-0 border-code/60 bg-code px-3 py-1.5">
          <span className="font-mono text-xs text-code-ink/60">{label}</span>
          {subscripts && <div className="flex items-center gap-1" role="group" aria-label="Små siffror">
            <span className="mr-1 text-xs text-code-ink/60">Liten siffra:</span>
            {SUBS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => replaceSelection(c)}
                title={`Sätt in ${c} (${MOD_LABEL} + ${"₁₂₃₄".indexOf(c) + 1})`}
                className="h-7 min-w-7 rounded border border-code-ink/25 px-1.5 font-mono text-sm text-code-ink transition-colors duration-150 hover:border-code-ink hover:bg-code-ink/15"
              >
                {c}
              </button>
            ))}
          </div>}
        </div>
        <div className="flex rounded-b-lg border border-code/60 bg-code font-mono text-[14px] leading-6">
          <pre data-gutter aria-hidden="true" className="select-none border-r border-code-ink/15 px-2 py-3 text-right text-code-ink/40">
            {Array.from({ length: lineCount }, (_, i) => i + 1).join("\n")}
          </pre>
          {textarea}
        </div>
      </div>
      <p id={hintId} className="mt-1 text-xs text-ink/65">
        {hint
          ? hint
          : subscripts
            ? <>Tab gör indrag, Enter behåller det, {MOD_LABEL} + siffra (eller Ctrl + siffra) ger liten siffra, Esc lämnar rutan.</>
            : <>Tab gör indrag (Shift+Tab tar bort), Enter behåller det och drar in efter "(",{format ? ` ${FORMAT_KEYS} formaterar,` : ""} Esc lämnar rutan.</>}
      </p>
    </div>
  );
}
