import Link from "next/link";

import { ThemeToggle } from "@/components/ai-guide/ThemeToggle";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeLanguage, text, withLang } from "@/lib/ai-guide/i18n";

type ReadingsText = ReturnType<typeof text>;

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

function getReadingSummary(reading: unknown, t: ReadingsText) {
  if (!isRecord(reading)) {
    return t.readingsSummaryFallback;
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
    return t.readingsSummaryFallback;
  }

  return summary.length > 180 ? `${summary.slice(0, 180)}...` : summary;
}

function isFallbackReading(reading: unknown) {
  return (
    isRecord(reading) &&
    (reading.fallback === true || reading.readingSource === "system_fallback")
  );
}

function formatReadableValue(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function getModeLabel(mode: string | null, t: ReadingsText) {
  if (mode === "physical") {
    return t.readingsModePhysical;
  }

  if (mode === "online") {
    return t.readingsModeOnline;
  }

  return mode ? formatReadableValue(mode) : t.readingsModeFallback;
}

function getSpreadLabel(spread: string | null, t: ReadingsText) {
  if (spread === "single") {
    return t.readingsSpreadSingle;
  }

  return spread ? formatReadableValue(spread) : t.readingsSpreadSingle;
}

function getOrientationLabel(orientation: string | null, t: ReadingsText) {
  if (orientation === "upright") {
    return t.readingsOrientationUpright;
  }

  return orientation
    ? formatReadableValue(orientation)
    : t.readingsOrientationUpright;
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
  const t = text(lang);
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
      loadError = t.readingsLoadError;
    } else {
      readings = (readingsResult.data ?? []) as ReadingLogRow[];
    }
  }

  return (
    <main className="ora-page-shell relative flex min-h-svh flex-1 overflow-hidden px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
      <section className="relative z-10 mx-auto flex min-h-svh w-full max-w-5xl flex-col px-5 py-6 sm:min-h-0 sm:px-6 sm:py-8">
        <header className="flex items-center justify-between gap-4">
          <Link
            className="btn btn--text text-xs"
            href={backHref}
          >
            {t.readingsBack}
          </Link>
          <div className="flex items-center gap-3">
            <p className="wordmark text-lg text-[var(--c-text)]">Ora Arcana</p>
            <ThemeToggle />
          </div>
        </header>

        <section className="mx-auto w-full max-w-3xl pt-10 text-center sm:pt-14">
          <p className="eyebrow mb-3 flex items-center justify-center gap-3">
            {t.readingsEyebrow}
          </p>
          <h1 className="t-h2 max-w-2xl mx-auto">
            {t.readingsTitle}
          </h1>
          <p className="caption mx-auto mt-4 max-w-xl sm:text-base">
            {t.readingsIntro}
          </p>
        </section>

        <section className="mx-auto mt-8 w-full max-w-3xl">
          {!user || authError ? (
            <div className="well relative p-5 sm:p-6">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--c-border-strong)] to-transparent" />
              <h2 className="t-h3">
                {t.readingsAuthTitle}
              </h2>
              <p className="caption mt-3">
                {t.readingsAuthBody}
              </p>
              <p className="caption mt-2">
                {t.readingsAuthNote}
              </p>
              <Link
                className="btn btn--primary mt-5"
                href={backHref}
              >
                {t.readingsReturn}
              </Link>
            </div>
          ) : loadError ? (
            <div className="well relative p-5 sm:p-6">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--c-border-strong)] to-transparent" />
              <h2 className="t-h3">
                {loadError}
              </h2>
              <p className="caption mt-3">
                {t.readingsErrorBody}
              </p>
              <Link
                className="btn btn--ghost mt-5"
                href={backHref}
              >
                {t.readingsReturn}
              </Link>
            </div>
          ) : readings.length === 0 ? (
            <div className="card relative p-5 sm:p-7">
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--c-border-strong)] to-transparent" />
              <div
                aria-hidden="true"
                className="mb-5 flex h-24 items-center justify-center rounded-[1rem] border border-[var(--c-border)] bg-[var(--c-surface-2)]"
              >
                <div className="relative h-16 w-12 rounded-[0.7rem] border border-[var(--c-border-strong)] bg-[var(--c-surface)]">
                  <div className="absolute inset-2 rounded-[0.5rem] border border-[var(--c-border)]" />
                  <div className="absolute inset-x-3 top-4 h-px bg-[var(--c-border-strong)]" />
                  <div className="absolute inset-x-3 bottom-4 h-px bg-[var(--c-border)]" />
                </div>
              </div>
              <h2 className="t-h3">
                {t.readingsEmptyTitle}
              </h2>
              <p className="caption mt-3">
                {t.readingsEmptyBody}
              </p>
              <Link
                className="btn btn--primary mt-5"
                href={backHref}
              >
                {t.readingsEmptyCta}
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              <p className="text-center text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[var(--c-text-soft)]">
                {t.readingsLatest}
              </p>
              {readings.map((reading) => {
                const isFallback = isFallbackReading(reading.reading_json);

                return (
                  <article
                    className="card p-4 sm:p-5"
                    key={reading.id}
                  >
                    <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--c-border-strong)] to-transparent" />
                    <div className="flex flex-col gap-3 border-b border-[var(--c-border)] pb-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="micro">
                          {formatDate(reading.created_at, lang)}
                        </p>
                        <h2 className="t-h3 mt-2">
                          {reading.card_title ||
                            reading.card_id ||
                            t.readingsSavedCard}
                        </h2>
                      </div>
                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        {isFallback ? (
                          <span className="inline-flex rounded-full border border-[var(--c-border)] bg-[var(--c-surface-2)] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[var(--c-text-soft)]">
                            {t.readingsFallbackBadge}
                          </span>
                        ) : null}
                        <span className="inline-flex rounded-full border border-[var(--c-border)] bg-[var(--c-surface-2)] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[var(--c-text-soft)]">
                          {getModeLabel(reading.mode, t)}
                        </span>
                        <span className="inline-flex rounded-full border border-[var(--c-border)] bg-[var(--c-surface)] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[var(--c-text-soft)]">
                          {getSpreadLabel(reading.spread, t)}
                        </span>
                        <span className="inline-flex rounded-full border border-[var(--c-border)] bg-[var(--c-surface)] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[var(--c-text-soft)]">
                          {getOrientationLabel(reading.orientation, t)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4">
                      {isFallback ? (
                        <p className="well px-4 py-3 text-xs leading-5">
                          {t.readingsFallbackNote}
                        </p>
                      ) : null}
                      <section className="well p-4">
                        <h3 className="micro">
                          {t.readingsQuestionLabel}
                        </h3>
                        <p className="caption mt-2">
                          {reading.question || t.readingsNoQuestion}
                        </p>
                      </section>
                      <section className="well p-4">
                        <h3 className="micro">
                          {t.readingsInterpretationLabel}
                        </h3>
                        <p className="caption mt-2">
                          {getReadingSummary(reading.reading_json, t)}
                        </p>
                      </section>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
