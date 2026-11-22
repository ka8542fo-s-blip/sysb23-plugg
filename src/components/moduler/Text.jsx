import { createContext, useContext } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Lärarens text i fliken Moduler. Modulens rubrik är sidans h2, så textens
// "##" blir h3 och "###" h4. Rubrikerna får ett litet mässingsstreck ovanför,
// så att avsnitten syns tydligt utan att ta över.
export const markdownComponents = {
  h2: ({ children }) => (
    <h3 className="mt-10 font-display text-[22px] leading-tight text-pine before:mb-3 before:block before:h-[3px] before:w-8 before:rounded-full before:bg-brass first:mt-0 sm:text-2xl">
      {children}
    </h3>
  ),
  h3: ({ children }) => <h4 className="mt-6 font-display text-lg text-pine">{children}</h4>,
  p: ({ children }) => <p className="mt-4 first:mt-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-pine">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="mt-4 list-disc space-y-1.5 pl-5 first:mt-0">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 list-decimal space-y-1.5 pl-6 first:mt-0">{children}</ol>,
  li: ({ children }) => <li className="pl-1 marker:text-brass">{children}</li>,
};

// I en ruta eller vid en kantlinje räcker den markeringen; där har rubriken
// inget streck.
const framedComponents = {
  ...markdownComponents,
  h2: ({ children }) => <h3 className="mt-8 font-display text-[22px] leading-tight text-pine first:mt-0 sm:text-2xl">{children}</h3>,
};

// Det engelska originalet: samma struktur men lågmält, utan rubrikernas tyngd.
const originalComponents = {
  ...markdownComponents,
  h2: ({ children }) => <p className="mt-3 font-medium first:mt-0">{children}</p>,
  h3: ({ children }) => <p className="mt-3 font-medium first:mt-0">{children}</p>,
  p: ({ children }) => <p className="mt-2 first:mt-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  ul: ({ children }) => <ul className="mt-2 list-disc space-y-0.5 pl-5 first:mt-0">{children}</ul>,
  ol: ({ children }) => <ol className="mt-2 list-decimal space-y-0.5 pl-6 first:mt-0">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
};

export function Markdown({ children, components = markdownComponents }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}

// "Visa engelskt original": en omkopplare i modulens början styr alla block
// (sparas i modulEngelska). Original ritas bara när den är på.
export const EnglishContext = createContext(false);

export function Original({ children, markdown, className = "" }) {
  const show = useContext(EnglishContext);
  if (!show) return null;
  return (
    <div lang="en" className={`mt-3 border-l-2 border-line-strong/70 pl-3 text-[14px] leading-relaxed text-ink/60 ${className}`}>
      {markdown ? <Markdown components={originalComponents}>{markdown}</Markdown> : children}
    </div>
  );
}

// Ett textavsnitt ur lärarens modul. Lärandemålen står i en egen ljus ruta,
// kärnavsnitten (Kärnbudskap, Kärnförklaring, Viktig poäng …) med en
// diskret kantlinje, och föreläsningens namn som en liten etikett. Lärarens
// exempel i modul 1 är frågor med svaret utskrivet och står i en ram.
const CORE = /^## (Kärnbudskap|Kärnförklaring|Kärndefinition|Kärnbegrepp|Viktig poäng|Viktig varning)\b/;

export function textKind(block) {
  const text = block.sv.trim();
  if (block.kind === "exempel") return "exempel";
  if (/^\*\*Föreläsning \d[^*]*\*\*$/.test(text)) return "forelasning";
  if (/^## Lärandemål\b/.test(text)) return "larandemal";
  if (CORE.test(text)) return "karna";
  return "text";
}

export default function TextBlock({ block }) {
  const kind = textKind(block);
  if (kind === "forelasning") {
    return (
      <div className="mt-2">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-brass-text">{block.sv.replace(/\*\*/g, "")}</p>
        <Original markdown={block.en} />
      </div>
    );
  }
  const frame = {
    larandemal: "rounded-xl border border-pine/15 bg-pine/[0.045] px-5 py-5 sm:px-6",
    karna: "border-l-[3px] border-brass/70 pl-5 sm:pl-6",
    exempel: "rounded-xl border border-dashed border-line-strong bg-surface px-5 py-4",
    text: "",
  }[kind];
  return (
    <section className={`mt-10 ${frame}`}>
      {kind === "exempel" && (
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink/55">Lärarens exempel</p>
      )}
      <Markdown components={kind === "text" ? markdownComponents : framedComponents}>{block.sv}</Markdown>
      <Original markdown={block.en} />
    </section>
  );
}
