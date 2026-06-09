import { PageContainer } from "@/components/ai-guide/PageContainer";
import { TarotButton } from "@/components/ai-guide/TarotButton";

type ReadingMode = "physical" | "online";
type Spread = "single";
type Orientation = "upright";

function normalizeMode(mode: string | string[] | undefined): ReadingMode {
  const value = Array.isArray(mode) ? mode[0] : mode;
  return value === "online" ? "online" : "physical";
}

function normalizeValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function PreparePage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string | string[];
    spread?: string | string[];
    orientation?: string | string[];
  }>;
}) {
  const {
    mode: modeParam,
    spread: spreadParam,
    orientation: orientationParam,
  } = await searchParams;
  const mode = normalizeMode(modeParam);
  const spreadValue = normalizeValue(spreadParam);
  const orientationValue = normalizeValue(orientationParam);
  const spread: Spread = spreadValue === "single" ? "single" : "single";
  const orientation: Orientation =
    orientationValue === "upright" ? "upright" : "upright";
  const nextParams = new URLSearchParams({ mode, spread, orientation });

  return (
    <PageContainer
      eyebrow="Reading Room"
      title="Center Before You Ask"
      description="Before forming your question, take a quiet moment to settle your attention."
    >
      <div className="space-y-6">
        <div className="atelier-paper p-5 text-sm leading-7">
          <p className="mb-4 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#6d5532]">
            Quiet Note
          </p>
          <p>
            Take three slow breaths. Let the noise around the question soften.
          </p>
          <p className="mt-4">
            When you are ready, continue to write your question.
          </p>
        </div>

        <div className="atelier-panel p-4 text-sm leading-6 text-[#c8c0b4]">
          {mode === "physical" ? (
            <p>
              You will use your own physical deck after this step. For now,
              simply settle your attention before shaping the question.
            </p>
          ) : (
            <p>
              The online deck will open after your question is formed. For now,
              take a quiet pause before beginning the ritual.
            </p>
          )}
        </div>

        <div className="atelier-worktop p-5">
          <div className="mx-auto flex h-28 w-28 items-center justify-center border border-[#8c724b]/70 bg-[#090806]">
            <div className="h-16 w-16 border border-[#bca77f]/60" />
          </div>
        </div>

        <TarotButton href={`/ai-guide/ask?${nextParams.toString()}`}>
          Continue to Question
        </TarotButton>
      </div>
    </PageContainer>
  );
}
