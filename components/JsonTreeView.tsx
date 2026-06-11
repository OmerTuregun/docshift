"use client";

import { useState } from "react";
import { TbChevronDown, TbChevronRight } from "react-icons/tb";

interface JsonTreeViewProps {
  data: unknown;
  depth?: number;
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const isArray = (v: unknown): v is unknown[] => Array.isArray(v);

const isPrimitive = (v: unknown) => !isObject(v) && !isArray(v);

function getValueColor(value: unknown): string {
  if (typeof value === "string") return "text-emerald-400";
  if (typeof value === "number") return "text-amber-400";
  if (typeof value === "boolean") return "text-blue-400";
  if (value === null) return "text-gray-500";
  return "text-white";
}

export default function JsonTreeView({ data, depth: depthProp }: JsonTreeViewProps) {
  const depth = depthProp ?? 0;
  const [collapsed, setCollapsed] = useState(depth > 1);
  const indent = depth * 16;

  if (isPrimitive(data)) {
    return (
      <span className={getValueColor(data)}>{JSON.stringify(data)}</span>
    );
  }

  if (isArray(data)) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setCollapsed((p) => !p)}
          className="flex items-center gap-1 text-xs text-white/60 transition-colors hover:text-white"
        >
          {collapsed ? (
            <TbChevronRight className="text-[10px]" />
          ) : (
            <TbChevronDown className="text-[10px]" />
          )}
          <span className="text-white/40">[{data.length}]</span>
        </button>

        {!collapsed ? (
          <div style={{ marginLeft: `${indent}px` }}>
            {data.map((item, i) => (
              <div key={i} className="my-0.5 flex items-start gap-1">
                <span className="mt-0.5 min-w-[20px] text-right text-xs text-white/30">
                  {i}:
                </span>
                <JsonTreeView data={item} depth={depth + 1} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  const entries = Object.entries(data);

  return (
    <div>
      <button
        type="button"
        onClick={() => setCollapsed((p) => !p)}
        className="flex items-center gap-1 text-xs text-white/60 transition-colors hover:text-white"
      >
        {collapsed ? (
          <TbChevronRight className="text-[10px]" />
        ) : (
          <TbChevronDown className="text-[10px]" />
        )}
        <span className="text-white/40">{`{${entries.length}}`}</span>
      </button>

      {!collapsed ? (
        <div style={{ marginLeft: `${indent}px` }}>
          {entries.map(([key, value]) => (
            <div key={key} className="my-0.5 flex items-start gap-1.5">
              <span className="mt-0.5 shrink-0 text-xs text-[#4BBFC4]">{key}:</span>
              <JsonTreeView data={value} depth={depth + 1} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
