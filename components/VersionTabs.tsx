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
      <div className="flex gap-1" style={{ borderBottom: "1px solid var(--slate-200)", marginBottom: "-1px" }}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={
              i === active
                ? {
                    background: "var(--white)",
                    color: "var(--blue)",
                    border: "1px solid var(--slate-200)",
                    borderBottom: "1px solid var(--white)",
                    borderRadius: "8px 8px 0 0",
                    padding: "7px 18px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    position: "relative",
                    zIndex: 1,
                  }
                : {
                    background: "var(--slate-100)",
                    color: "var(--slate-500)",
                    border: "1px solid var(--slate-200)",
                    borderBottom: "none",
                    borderRadius: "8px 8px 0 0",
                    padding: "7px 18px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* コードエリア */}
      <div
        style={{
          border: "1px solid var(--slate-200)",
          borderRadius: "0 8px 8px 8px",
          overflow: "hidden",
        }}
      >
        {/* ツールバー */}
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
          <code>{tabs[active].code}</code>
        </pre>
      </div>

      {/* バージョン固有の注記 */}
      {tabs[active].note && (
        <p className="mt-2 text-sm italic" style={{ color: "var(--slate-500)" }}>
          {tabs[active].note}
        </p>
      )}
    </div>
  );
}
