type ReadingSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function ReadingSection({ title, children }: ReadingSectionProps) {
  return (
    <section className="border-t border-[color:var(--c-border)] py-5">
      <h2 className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--c-accent)]">
        {title}
      </h2>
      <div className="text-sm leading-6 text-[color:var(--c-text)]">{children}</div>
    </section>
  );
}
