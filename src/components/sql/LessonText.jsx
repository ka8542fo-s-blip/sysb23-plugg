import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Lektionerna är markdown med syntaxexempel som indenterade kodblock.
const components = {
  p: ({ children }) => <p className="mt-3 first:mt-0">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold text-pine">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="mt-3 space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="mt-3 list-decimal space-y-1 pl-6">{children}</ol>,
  li: ({ children }) => <li className="marker:text-brass">{children}</li>,
  code: ({ children }) => (
    <code className="rounded bg-paper px-1.5 py-0.5 font-mono text-[0.92em]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-paper p-3 font-mono text-[13px] leading-relaxed">
      {children}
    </pre>
  ),
};

export default function LessonText({ children }) {
  return (
    <div className="max-w-reading text-[15px] leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
