import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Lärarens text i fliken Moduler. Modulens rubrik är sidans h2, så textens
// "##" blir h3 och "###" h4.
export const markdownComponents = {
  h2: ({ children }) => <h3 className="mt-9 font-display text-xl sm:text-2xl">{children}</h3>,
  h3: ({ children }) => <h4 className="mt-6 font-display text-lg">{children}</h4>,
  p: ({ children }) => <p className="mt-4">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-pine">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="mt-4 list-disc space-y-1.5 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 list-decimal space-y-1.5 pl-6">{children}</ol>,
  li: ({ children }) => <li className="marker:text-brass">{children}</li>,
};

export function Markdown({ children }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {children}
    </ReactMarkdown>
  );
}

// "Visa på engelska": lärarens original, per textblock och per fråga. Valet
// är bara en visning och sparas inte.
export function EnglishToggle({ children, label = "Visa på engelska" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2">
      <button
        type="button"
        className="text-sm text-ink/60 underline-offset-4 hover:text-pine hover:underline"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Dölj engelska" : label}
      </button>
      {open && (
        <div lang="en" className="mt-2 rounded-lg border border-line bg-surface px-4 py-3 text-[15px] leading-relaxed text-ink/80">
          {children}
        </div>
      )}
    </div>
  );
}

// Textblock och lärarens exempel (modul 1). Exemplen står i en ram, eftersom
// de är frågor med svaret utskrivet och inte går att besvara.
export default function TextBlock({ block }) {
  const framed = block.kind === "exempel";
  return (
    <section className={framed ? "mt-6 rounded-lg border border-line px-4 pb-4 pt-1 sm:px-5" : ""}>
      <Markdown>{block.sv}</Markdown>
      <EnglishToggle>
        <Markdown>{block.en}</Markdown>
      </EnglishToggle>
    </section>
  );
}
