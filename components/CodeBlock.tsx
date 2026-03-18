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
    <div className="rounded-lg border border-gray-700 overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs text-gray-400 font-mono">
          {filename ?? "Sample.java"}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-0.5 rounded hover:bg-gray-700"
        >
          {copied ? "✓ コピーしました" : "コピー"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 bg-gray-950 text-gray-100 text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
