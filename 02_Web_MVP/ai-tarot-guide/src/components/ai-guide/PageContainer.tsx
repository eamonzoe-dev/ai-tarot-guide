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
    <main className="relative flex min-h-dvh flex-1 overflow-hidden bg-[#050506] text-[#eee8dd]">
      <div className="tarot-ink pointer-events-none absolute inset-0" />
      <div className="tarot-grain pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#101820]/55 to-transparent" />
      <div className="pointer-events-none absolute -right-24 top-24 h-56 w-56 rounded-full bg-[#2f5871]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-28 bottom-10 h-64 w-64 rounded-full bg-[#0f1720]/70 blur-3xl" />

      <section
        className={`relative mx-auto flex w-full max-w-md flex-col px-5 ${
          compact ? "py-6" : "py-8"
        }`}
      >
        {(eyebrow || title || description) && (
          <header className="mb-7">
            {eyebrow && (
              <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-[#7f99ad]">
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
