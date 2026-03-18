"use client";

import { useState } from "react";

export interface TabItem {
  label: string; // 例: "Java 8", "Java 17", "Java 21"
  code: string;
  note?: string; // バージョン固有の注意書き
}

interface VersionTabsProps {
  tabs: TabItem[];
  filename?: string;
}

export default function VersionTabs({ tabs, filename }: VersionTabsProps) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tabs[active].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4">
      {/* タブヘッダー */}
      <div className="flex gap-1 border-b border-gray-700">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
              i === active
                ? "bg-gray-950 text-orange-400 border-x border-t border-gray-700"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* コードエリア */}
      <div className="rounded-b-lg border-x border-b border-gray-700 overflow-hidden">
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
          <code>{tabs[active].code}</code>
        </pre>
      </div>

      {/* バージョン固有の注記 */}
      {tabs[active].note && (
        <p className="mt-2 text-sm text-gray-500 italic">{tabs[active].note}</p>
      )}
    </div>
  );
}
