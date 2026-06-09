import { PageContainer } from "@/components/ai-guide/PageContainer";
import { TarotButton } from "@/components/ai-guide/TarotButton";

export default function AiGuidePage() {
  return (
    <PageContainer compact>
      <div className="flex min-h-[calc(100dvh-3rem)] flex-col justify-between gap-6">
        <section className="pt-5">
          <p className="atelier-label mb-4 text-[0.68rem] font-semibold">
            AI Tarot Guide
          </p>
          <h1 className="max-w-sm font-serif text-[2.75rem] leading-[0.98] text-[#f4efe5]">
            A quiet symbolic reading room for physical and online tarot.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#aaa49b]">
            Choose your reading method.
          </p>
        </section>

        <section className="flex flex-1 items-center justify-center py-2">
          <div className="atelier-worktop w-full max-w-sm p-4">
            <div className="grid grid-cols-2 gap-3">
              <TarotButton
                href="/ai-guide/ask?mode=physical&spread=single&orientation=upright"
                className="min-h-52 flex-col gap-3 p-3 tracking-[0.16em]"
              >
                <span className="flex h-24 w-20 items-center justify-center border border-[#8c724b] bg-[linear-gradient(160deg,#21160f,#0d0906)] shadow-[0_14px_28px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,245,224,0.1)]">
                  <span className="h-16 w-12 border border-[#b49a68]/65 bg-[#080706]" />
                </span>
                <span className="leading-5">Use your own physical deck</span>
              </TarotButton>

              <TarotButton
                href="/ai-guide/ask?mode=online&spread=single&orientation=upright"
                variant="ghost"
                className="min-h-52 flex-col gap-3 p-3 tracking-[0.16em]"
              >
                <span className="relative flex h-24 w-20 items-center justify-center">
                  <span className="absolute h-20 w-14 translate-x-2 translate-y-2 border border-[#4b5c54] bg-[#0b100f]" />
                  <span className="absolute h-20 w-14 translate-x-1 translate-y-1 border border-[#64776b] bg-[#101715]" />
                  <span className="relative h-20 w-14 border border-[#8aa08f] bg-[linear-gradient(160deg,#17201d,#080b0a)] shadow-[0_14px_28px_rgba(0,0,0,0.45)]" />
                </span>
                <span className="leading-5">Draw a card inside the atelier</span>
              </TarotButton>
            </div>
            <div className="atelier-divider mt-4" />
            <p className="pt-4 text-center text-[0.58rem] uppercase tracking-[0.32em] text-[#a19072]">
              Entrance Desk
            </p>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
