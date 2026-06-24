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
    <main className="ora-page-shell relative flex min-h-svh flex-1 overflow-hidden px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
      <section
        className={`relative mx-auto flex min-h-svh w-full max-w-[520px] flex-col px-5 sm:min-h-0 sm:px-6 ${
          compact ? "py-6" : "py-8"
        }`}
      >
        {(eyebrow || title || description) && (
          <header className="mb-7">
            {eyebrow && (
              <p className="eyebrow mb-3">
                {eyebrow}
              </p>
            )}
            {title && (
              <h1 className="t-h1 max-w-sm">
                {title}
              </h1>
            )}
            {description && (
              <p className="caption mt-4 max-w-sm">
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
