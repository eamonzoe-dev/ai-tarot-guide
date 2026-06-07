import { PageContainer } from "@/components/ai-guide/PageContainer";
import { TarotButton } from "@/components/ai-guide/TarotButton";

export default function AiGuidePage() {
  return (
    <PageContainer compact>
      <div className="flex min-h-[calc(100dvh-3rem)] flex-col justify-between gap-6">
        <section className="pt-6">
          <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#7f99ad]">
            AI Tarot Guide
          </p>
          <h1 className="max-w-sm font-serif text-[2.75rem] leading-[0.98] text-[#f4efe5]">
            A quiet reading for the card in your hand.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#aaa49b]">
            Choose the physical card you drew, ask the question you brought to
            the deck, and receive a structured static interpretation for this
            MVP reading.
          </p>
        </section>

        <section className="flex flex-1 items-center justify-center py-2">
          <div className="relative h-[19.5rem] w-44 rotate-[-3deg] border border-[#3b4248] bg-[#08090a] shadow-[0_30px_70px_rgba(0,0,0,0.58),0_0_46px_rgba(75,112,139,0.11)]">
            <div className="absolute inset-3 border border-[#25292d]" />
            <div className="absolute inset-6 border border-[#343a40]" />
            <div className="absolute left-1/2 top-9 h-32 w-20 -translate-x-1/2 rounded-full border border-[#61788b]/55" />
            <div className="absolute left-1/2 top-14 h-20 w-px -translate-x-1/2 bg-[#61788b]/45" />
            <div className="absolute left-1/2 top-[6.6rem] h-px w-24 -translate-x-1/2 bg-[#61788b]/35" />
            <div className="absolute left-1/2 top-[8.6rem] h-12 w-12 -translate-x-1/2 rotate-45 border border-[#61788b]/45" />
            <div className="absolute bottom-12 left-1/2 h-10 w-px -translate-x-1/2 bg-[#363f47]" />
            <div className="absolute bottom-7 left-0 right-0 text-center text-[0.58rem] uppercase tracking-[0.32em] text-[#77736b]">
              The drawn card
            </div>
            <div className="absolute -inset-8 -z-10 bg-[#4b708b]/10 blur-3xl" />
          </div>
        </section>

        <div className="pb-4">
          <TarotButton href="/ai-guide/select-card">START READING</TarotButton>
        </div>
      </div>
    </PageContainer>
  );
}
