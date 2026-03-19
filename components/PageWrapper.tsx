interface PageWrapperProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function PageWrapper({ children, sidebar }: PageWrapperProps) {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 20px" }}>
      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start"
      >
        <div>{children}</div>
        <aside className="lg:sticky lg:top-[76px] flex flex-col gap-5">
          {sidebar}
        </aside>
      </div>
    </div>
  );
}
