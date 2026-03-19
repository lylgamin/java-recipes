"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  filename?: string;
}

export default function CodeBlock({ code, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="my-4"
      style={{ border: "1px solid var(--slate-200)", borderRadius: "8px", overflow: "hidden" }}
    >
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          background: "#2d3748",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span className="text-xs font-mono" style={{ color: "var(--slate-400)" }}>
          {filename ?? "Sample.java"}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs transition-colors px-2 py-0.5 rounded"
          style={{ color: "var(--slate-400)", background: "transparent", border: "none", cursor: "pointer" }}
        >
          {copied ? "✓ コピーしました" : "コピー"}
        </button>
      </div>
      <pre
        className="overflow-x-auto p-4 text-sm leading-relaxed"
        style={{ background: "#1e293b", color: "#e2e8f0" }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
