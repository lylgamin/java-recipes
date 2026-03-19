"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "ホーム" },
  { href: "/dates/", label: "日付・時刻" },
  { href: "/strings/", label: "文字列" },
  { href: "/collections/", label: "コレクション" },
  { href: "/fileio/", label: "ファイルI/O" },
  { href: "/network/", label: "ネットワーク" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: "var(--navy)", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
    >
      <div
        className="relative flex items-center gap-8 h-14 px-5"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        {/* ロゴ */}
        <Link
          href="/"
          className="font-bold shrink-0 hover:opacity-90 transition-opacity"
          style={{ fontSize: "18px", letterSpacing: "-0.3px", textDecoration: "none" }}
        >
          <span style={{ color: "#60a5fa" }}>java</span>
          <span style={{ color: "var(--slate-400)" }}>-</span>
          <span style={{ color: "#ffffff" }}>recipes</span>
        </Link>

        {/* デスクトップナビ（768px以上で表示） */}
        <nav className="hidden md:flex items-center flex-1 overflow-x-auto" style={{ gap: "2px" }}>
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="whitespace-nowrap transition-colors"
              style={{
                color: "#cbd5e1",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "13.5px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--navy-light)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#cbd5e1";
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* ハンバーガーボタン（767px以下で表示） */}
        <button
          className="md:hidden ml-auto p-2 cursor-pointer"
          style={{ background: "none", border: "none", color: "#ffffff" }}
          onClick={() => setOpen(!open)}
          aria-label="メニューを開く"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* モバイルナビドロップダウン */}
        {open && (
          <nav
            className="absolute left-0 right-0 md:hidden flex flex-col"
            style={{
              top: "56px",
              background: "var(--navy)",
              padding: "12px",
              gap: "4px",
            }}
          >
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block rounded transition-colors"
                style={{
                  color: "#cbd5e1",
                  textDecoration: "none",
                  padding: "8px 12px",
                  fontSize: "14px",
                }}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
