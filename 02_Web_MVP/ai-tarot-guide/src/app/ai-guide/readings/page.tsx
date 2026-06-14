import Link from "next/link";

import { GalaxyBackground } from "@/components/ai-guide/GalaxyBackground";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeLanguage, withLang } from "@/lib/ai-guide/i18n";

type ReadingLogRow = {
  id: string;
  question: string | null;
  card_id: string | null;
  card_title: string | null;
  mode: string | null;
  spread: string | null;
  orientation: string | null;
  lang: string | null;
  reading_json: unknown;
  created_at: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getReadingSummary(reading: unknown) {
  if (!isRecord(reading)) {
    return "Saved reading";
  }

  const candidates = [
    reading.summary,
    reading.reflection,
    reading.opening,
    reading.directAnswer,
    reading.fullReading,
  ];
  const summary = candidates.find(
    (candidate): candidate is string =>
      typeof candidate === "string" && candidate.trim().length > 0,
  );

  if (!summary) {
    return "Saved reading";
  }

  return summary.length > 180 ? `${summary.slice(0, 180)}...` : summary;
}

function formatReadableValue(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function getModeLabel(mode: string | null) {
  if (mode === "physical") {
    return "Physical Deck";
  }

  if (mode === "online") {
    return "Online Draw";
  }

  return mode ? formatReadableValue(mode) : "Reading";
}

function getSpreadLabel(spread: string | null) {
  if (spread === "single") {
    return "Single Card";
  }

  return spread ? formatReadableValue(spread) : "Single Card";
}

function formatDate(value: string, lang: "en" | "zh") {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function MyReadingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    lang?: string | string[];
  }>;
}) {
  const { lang: langParam } = await searchParams;
  const lang = normalizeLanguage(langParam);
  const backHref = withLang("/ai-guide", {}, lang);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  let readings: ReadingLogRow[] = [];
  let loadError: string | null = null;

  if (user && !authError) {
    const admin = createSupabaseAdminClient();
    const readingsResult = await admin
      .from("reading_logs")
      .select(
        "id,question,card_id,card_title,mode,spread,orientation,lang,reading_json,created_at",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (readingsResult.error) {
      loadError = "Unable to open your Reading Journal right now.";
    } else {
      readings = (readingsResult.data ?? []) as ReadingLogRow[];
    }
  }

  return (
    <main className="atelier-page relative flex min-h-svh flex-1 overflow-hidden px-0 py-0 text-[#eee8dd] sm:px-6 sm:py-6 lg:px-8">
      <GalaxyBackground />
      <div className="atelier-grain pointer-events-none absolute inset-0" />

      <section className="ritual-room-container relative mx-auto flex min-h-svh w-full max-w-5xl flex-col px-5 py-5 sm:min-h-0 sm:px-6">
        <header className="flex items-center justify-between gap-4">
          <Link
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9f947f] transition hover:text-[#f6ecd8]"
            href={backHref}
          >
            Back to Reading Room
          </Link>
          <p className="font-serif text-lg text-[#f6ecd8]">Ora Arcana</p>
        </header>

        <section className="mx-auto w-full max-w-3xl pt-10 sm:pt-14">
          <p className="atelier-label mb-3 text-[0.68rem] font-semibold">
            {lang === "zh" ? "Reading Journal" : "Reading Journal"}
          </p>
          <h1 className="font-serif text-4xl leading-tight text-[#f6ecd8] sm:text-5xl">
            {lang === "zh" ? "Reading Journal" : "Reading Journal"}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#b7aa94] sm:text-base">
            {lang === "zh"
              ? "A quiet archive of your questions, cards, and Ora’s interpretations. Your saved readings are kept here for later reflection."
              : "A quiet archive of your questions, cards, and Ora’s interpretations. Your saved readings are kept here for later reflection."}
          </p>
        </section>

        <section className="mx-auto mt-8 w-full max-w-3xl">
          {!user || authError ? (
            <div className="atelier-worktop p-5 sm:p-6">
              <h2 className="font-serif text-2xl text-[#f6ecd8]">
                Reading Account Required
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#b7aa94]">
                Sign in from your Reading Account to view your saved readings.
              </p>
              <p className="mt-2 text-sm leading-7 text-[#9f947f]">
                Your readings are saved when you are signed in.
              </p>
            </div>
          ) : loadError ? (
            <div className="atelier-worktop p-5 sm:p-6">
              <p className="text-sm leading-7 text-[#f0a99a]">{loadError}</p>
              <p className="mt-2 text-sm leading-7 text-[#b7aa94]">
                Please return to the Reading Room and try again.
              </p>
            </div>
          ) : readings.length === 0 ? (
            <div className="atelier-worktop p-5 sm:p-6">
              <h2 className="font-serif text-2xl text-[#f6ecd8]">
                Your journal is quiet for now.
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#b7aa94]">
                Begin a reading, and your saved interpretation will appear here
                for later reflection.
              </p>
              <Link className="ritual-action-link mt-5" href={backHref}>
                Begin a Reading
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {readings.map((reading) => (
                <article
                  className="rounded-2xl border border-[#3d3020] bg-[#0b0907]/72 p-4 shadow-[0_18px_42px_rgba(0,0,0,0.22)] sm:p-5"
                  key={reading.id}
                >
                  <div className="flex flex-col gap-2 border-b border-[#2b241a] pb-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#8f826f]">
                        {formatDate(reading.created_at, lang)}
                      </p>
                      <h2 className="mt-2 font-serif text-2xl text-[#f6ecd8]">
                        {reading.card_title || reading.card_id || "Saved Card"}
                      </h2>
                    </div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#8f826f]">
                      {getModeLabel(reading.mode)} /{" "}
                      {getSpreadLabel(reading.spread)}
                    </p>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-[#d8c9ae]">
                    {reading.question || "No question was recorded."}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#9f947f]">
                    {getReadingSummary(reading.reading_json)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
