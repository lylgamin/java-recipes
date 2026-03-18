import Link from "next/link";

interface NavItem {
  href: string;
  label: string;
}

interface PageNavProps {
  prev?: NavItem;
  next?: NavItem;
  related?: NavItem[];
}

export default function PageNav({ prev, next, related }: PageNavProps) {
  return (
    <div className="mt-12 pt-6 border-t border-gray-200">
      {/* 前後ページナビ */}
      {(prev || next) && (
        <div className="flex justify-between mb-6">
          {prev ? (
            <Link href={prev.href} className="group flex flex-col max-w-xs">
              <span className="text-xs text-gray-400 mb-1">← 前のページ</span>
              <span className="text-sm font-medium text-blue-600 group-hover:text-blue-800 group-hover:underline">
                {prev.label}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={next.href}
              className="group flex flex-col items-end max-w-xs"
            >
              <span className="text-xs text-gray-400 mb-1">次のページ →</span>
              <span className="text-sm font-medium text-blue-600 group-hover:text-blue-800 group-hover:underline text-right">
                {next.label}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}

      {/* 関連ページ */}
      {related && related.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            関連ページ
          </h3>
          <ul className="flex flex-wrap gap-2">
            {related.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
