import AdUnit from "@/components/AdUnit";
import Link from "next/link";

export interface SidebarNavItem {
  href: string;
  label: string;
}

interface SidebarProps {
  navTitle?: string;
  navItems?: SidebarNavItem[];
  tall?: boolean;
}

function AdBlock({ tall }: { tall?: boolean }) {
  return (
    <div
      style={{
        background: "var(--ad-bg)",
        border: "1px dashed var(--ad-border)",
        borderRadius: "10px",
        padding: "16px",
        minHeight: tall ? "600px" : "250px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
      }}
    >
      <span
        style={{
          fontSize: "10px",
          color: "var(--slate-300)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        広告
      </span>
      <AdUnit />
    </div>
  );
}

export default function Sidebar({ navTitle, navItems, tall }: SidebarProps) {
  return (
    <>
      {/* 300×250 広告 */}
      <AdBlock />

      {/* カテゴリナビ */}
      {navItems && navItems.length > 0 && (
        <div
          style={{
            background: "var(--white)",
            border: "1px solid var(--slate-200)",
            borderRadius: "10px",
            padding: "16px",
          }}
        >
          {navTitle && (
            <p
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--slate-500)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "10px",
              }}
            >
              {navTitle}
            </p>
          )}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {navItems.map((item, i) => (
              <li
                key={item.href}
                style={{
                  borderBottom:
                    i < navItems.length - 1 ? "1px solid var(--slate-100)" : "none",
                }}
              >
                <Link
                  href={item.href}
                  style={{
                    display: "block",
                    fontSize: "13px",
                    color: "var(--blue)",
                    textDecoration: "none",
                    padding: "4px 0",
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 300×600 広告（tall=true の場合） */}
      {tall && <AdBlock tall />}
    </>
  );
}
