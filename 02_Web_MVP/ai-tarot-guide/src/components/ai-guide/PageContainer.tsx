import { GalaxyBackground } from "@/components/ai-guide/GalaxyBackground";

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
    <main className="atelier-page relative flex min-h-svh flex-1 overflow-hidden px-0 py-0 text-[#eee8dd] sm:px-6 sm:py-6 lg:px-8">
      <GalaxyBackground />
      <div className="atelier-grain pointer-events-none absolute inset-0" />

      <section
        className={`ritual-room-container relative mx-auto flex min-h-svh w-full max-w-[520px] flex-col px-5 sm:min-h-0 sm:px-6 ${
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
