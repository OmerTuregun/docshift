"use client";

import { useEffect, useState } from "react";
import { TbAlertTriangle } from "react-icons/tb";
import JsonTreeView from "@/components/JsonTreeView";

const MAX_PREVIEW_SIZE = 50 * 1024;

interface JsonTreeRootProps {
  content: string;
}

export default function JsonTreeRoot({ content }: JsonTreeRootProps) {
  const [parsed, setParsed] = useState<unknown>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setParsed(JSON.parse(content));
      setParseError(null);
    } catch {
      setParsed(null);
      setParseError("Geçersiz JSON — ham metin gösteriliyor");
    }
  }, [content]);

  if (content.length > MAX_PREVIEW_SIZE) {
    return (
      <div>
        <div className="mb-2 flex items-center gap-1.5 text-xs text-amber-400">
          <TbAlertTriangle />
          Dosya çok büyük — önizleme devre dışı (50KB+)
        </div>
        <pre className="max-h-64 overflow-auto font-mono text-xs whitespace-pre-wrap text-emerald-400">
          {content.slice(0, 2000)}...
        </pre>
      </div>
    );
  }

  if (parseError) {
    return (
      <div>
        <div className="mb-2 flex items-center gap-1 text-xs text-amber-400">
          <TbAlertTriangle />
          {parseError}
        </div>
        <pre className="font-mono text-xs whitespace-pre-wrap text-emerald-400">
          {content}
        </pre>
      </div>
    );
  }

  if (parsed !== null) {
    return (
      <div className="font-mono text-xs leading-relaxed">
        <JsonTreeView data={parsed} depth={0} />
      </div>
    );
  }

  return null;
}
