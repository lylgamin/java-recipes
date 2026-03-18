import Link from "next/link";

const navItems = [
  { href: "/", label: "ホーム" },
  { href: "/dates/", label: "日付・時刻" },
  { href: "/strings/", label: "文字列" },
  { href: "/collections/", label: "コレクション" },
  { href: "/fileio/", label: "ファイルI/O" },
  { href: "/network/", label: "ネットワーク" },
];

export default function Header() {
  return (
    <header className="bg-gray-900 text-white shadow-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-6 h-14">
          <Link
            href="/"
            className="font-bold text-lg shrink-0 hover:opacity-80 transition-opacity"
          >
            <span className="text-orange-400">java</span>
            <span className="text-gray-400">-</span>
            <span className="text-white">recipes</span>
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-1 rounded text-sm whitespace-nowrap text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
