type ReadingSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function ReadingSection({ title, children }: ReadingSectionProps) {
  return (
    <section className="border-t border-[#2a2e32] py-5">
      <h2 className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#7f99ad]">
        {title}
      </h2>
      <div className="text-sm leading-6 text-[#d7d0c2]">{children}</div>
    </section>
  );
}
