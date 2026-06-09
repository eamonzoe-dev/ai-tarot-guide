import { PageContainer } from "@/components/ai-guide/PageContainer";
import { TarotButton } from "@/components/ai-guide/TarotButton";

type ReadingMode = "physical" | "online";

function normalizeMode(mode: string | string[] | undefined): ReadingMode {
  const value = Array.isArray(mode) ? mode[0] : mode;
  return value === "online" ? "online" : "physical";
}

export default async function PreparePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string | string[] }>;
}) {
  const { mode: modeParam } = await searchParams;
  const mode = normalizeMode(modeParam);

  return (
    <PageContainer
      eyebrow="Reading Room"
      title="Before You Begin"
      description="Take one slow breath. Hold your question clearly. Tarot works best when the question is honest, specific, and open."
    >
      <div className="space-y-6">
        <div className="atelier-paper p-5 text-sm leading-7">
          <p className="mb-4 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#6d5532]">
            Quiet Note
          </p>
          {mode === "physical" ? (
            <p>Keep your physical deck nearby.</p>
          ) : (
            <p>The guide will draw one card for you.</p>
          )}
        </div>

        <TarotButton href={`/ai-guide/ask?mode=${mode}`}>I AM READY</TarotButton>
      </div>
    </PageContainer>
  );
}
