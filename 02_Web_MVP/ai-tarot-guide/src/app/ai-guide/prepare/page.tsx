import { LanguageToggle } from "@/components/ai-guide/LanguageToggle";
import { PageContainer } from "@/components/ai-guide/PageContainer";
import { ReadingNav } from "@/components/ai-guide/ReadingNav";
import { TarotButton } from "@/components/ai-guide/TarotButton";
import { normalizeLanguage, text } from "@/lib/ai-guide/i18n";

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
    lang?: string | string[];
  }>;
}) {
  const {
    mode: modeParam,
    spread: spreadParam,
    orientation: orientationParam,
    lang: langParam,
  } = await searchParams;
  const mode = normalizeMode(modeParam);
  const lang = normalizeLanguage(langParam);
  const copy = text(lang);
  const spreadValue = normalizeValue(spreadParam);
  const orientationValue = normalizeValue(orientationParam);
  const spread: Spread = spreadValue === "single" ? "single" : "single";
  const orientation: Orientation =
    orientationValue === "upright" ? "upright" : "upright";
  const nextParams = new URLSearchParams({ mode, spread, orientation, lang });

  return (
    <PageContainer
      eyebrow={copy.readingRoom}
      title={copy.centerTitle}
      description={copy.centerDescription}
    >
      <ReadingNav lang={lang} />
      <div className="mb-5 flex justify-end">
        <LanguageToggle
          lang={lang}
          pathname="/ai-guide/prepare"
          params={{ mode, spread, orientation }}
          hasLangParam={Boolean(langParam)}
        />
      </div>
      <div className="space-y-6">
        <div className="atelier-paper p-5 text-sm leading-7">
          <p className="mb-4 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#6d5532]">
            {copy.quietNote}
          </p>
          <p>{copy.centerBreath}</p>
          <p className="mt-4">{copy.centerContinue}</p>
        </div>

        <div className="atelier-panel p-4 text-sm leading-6 text-[#c8c0b4]">
          <p>{mode === "physical" ? copy.preparePhysical : copy.prepareOnline}</p>
        </div>

        <div className="atelier-worktop p-5">
          <div className="mx-auto flex h-28 w-28 items-center justify-center border border-[#8c724b]/70 bg-[#090806]">
            <div className="h-16 w-16 border border-[#bca77f]/60" />
          </div>
        </div>

        <TarotButton href={`/ai-guide/ask?${nextParams.toString()}`}>
          {copy.continueToQuestion}
        </TarotButton>
      </div>
    </PageContainer>
  );
}
