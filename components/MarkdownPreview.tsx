"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="max-w-none text-white/80">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 border-b border-white/10 pb-2 text-lg font-semibold text-white">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-4 mb-2 text-base font-medium text-white">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-3 mb-1.5 text-sm font-medium text-white/90">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-2 text-xs leading-relaxed text-white/70">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-2 list-inside list-disc space-y-1 text-xs text-white/70">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-2 list-inside list-decimal space-y-1 text-xs text-white/70">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="text-white/70">{children}</li>,
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");

            return isBlock ? (
              <code className="my-2 block overflow-auto rounded-lg bg-white/5 p-3 font-mono text-xs whitespace-pre-wrap text-emerald-400">
                {children}
              </code>
            ) : (
              <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs text-emerald-400">
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto">
              <table className="w-full border-collapse text-xs">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-white/10 bg-white/5 px-3 py-1.5 text-left font-medium text-white/80">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-white/10 px-3 py-1.5 text-white/60">
              {children}
            </td>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-2 border-[#1A9BA1] pl-3 text-xs text-white/50 italic">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-medium text-white">{children}</strong>
          ),
          hr: () => <hr className="my-4 border-white/10" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
