type PageContainerProps = {
  children: React.ReactNode;
  eyebrow?: string;
  title?: string;
  description?: string;
  compact?: boolean;
};

export function PageContainer({
  children,
  eyebrow,
  title,
  description,
  compact = false,
}: PageContainerProps) {
  return (
    <main className="atelier-page relative flex min-h-dvh flex-1 overflow-hidden text-[#eee8dd]">
      <div className="atelier-grain pointer-events-none absolute inset-0" />

      <section
        className={`relative mx-auto flex w-full max-w-md flex-col px-5 ${
          compact ? "py-6" : "py-8"
        }`}
      >
        {(eyebrow || title || description) && (
          <header className="mb-7">
            {eyebrow && (
              <p className="atelier-label mb-3 text-[0.68rem] font-semibold">
                {eyebrow}
              </p>
            )}
            {title && (
              <h1 className="max-w-sm font-serif text-4xl leading-[1.02] text-[#f4efe5]">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#a9a59d]">
                {description}
              </p>
            )}
          </header>
        )}
        {children}
      </section>
    </main>
  );
}
