import Link from "next/link";

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

function getOrientationLabel(orientation: string | null) {
  if (orientation === "upright") {
    return "Upright";
  }

  return orientation ? formatReadableValue(orientation) : "Upright";
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
      loadError = "The journal could not open right now.";
    } else {
      readings = (readingsResult.data ?? []) as ReadingLogRow[];
    }
  }

  return (
    <main className="relative flex min-h-svh flex-1 overflow-hidden bg-[#f6f0e5] px-0 py-0 text-[#3d3024] sm:px-6 sm:py-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.98),rgba(246,240,229,0.9)_42%,rgba(226,213,188,0.46)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-16 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-[#c9a86a]/16 opacity-80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-32 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full border border-[#d8bd82]/22 opacity-80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-48 h-px w-[42rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#caa664]/22 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-[#d7bd82]/12 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-40 h-72 w-72 rounded-full bg-white/44 blur-3xl"
      />

      <section className="relative z-10 mx-auto flex min-h-svh w-full max-w-5xl flex-col px-5 py-6 sm:min-h-0 sm:px-6 sm:py-8">
        <header className="flex items-center justify-between gap-4">
          <Link
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9d7b3f] transition hover:text-[#5b4a36]"
            href={backHref}
          >
            Back to Reading Room
          </Link>
          <p className="font-serif text-lg text-[#5b4a36]">Ora Arcana</p>
        </header>

        <section className="mx-auto w-full max-w-3xl pt-10 text-center sm:pt-14">
          <p className="mb-3 flex items-center justify-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#9d7b3f]">
            <span className="h-px w-8 bg-gradient-to-r from-transparent via-[#d8b76a]/70 to-transparent" />
            {lang === "zh" ? "Reading Journal" : "Reading Journal"}
            <span className="h-px w-8 bg-gradient-to-r from-transparent via-[#d8b76a]/70 to-transparent" />
          </p>
          <h1 className="font-serif text-4xl leading-tight text-[#4f4235] drop-shadow-[0_1px_0_rgba(255,255,255,0.6)] sm:text-5xl">
            {lang === "zh" ? "Reading Journal" : "Reading Journal"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#766955] sm:text-base">
            {lang === "zh"
              ? "A quiet archive of your questions, cards, and Ora's interpretations. Your saved readings are kept here for later reflection."
              : "A quiet archive of your questions, cards, and Ora's interpretations. Your saved readings are kept here for later reflection."}
          </p>
        </section>

        <section className="mx-auto mt-8 w-full max-w-3xl">
          {!user || authError ? (
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#d8bd82]/42 bg-[linear-gradient(180deg,rgba(255,250,241,0.92),rgba(248,241,229,0.86))] p-5 shadow-[0_22px_64px_rgba(116,83,36,0.10),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-md sm:p-6">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d2b06d]/58 to-transparent" />
              <h2 className="font-serif text-2xl text-[#4f4235]">
                Reading Account Required
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#6f624f]">
                Return to the Reading Room and sign in from your Reading
                Account to view your saved readings.
              </p>
              <p className="mt-2 text-sm leading-7 text-[#8b7a61]">
                Your readings are saved when you are signed in.
              </p>
              <Link
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-[#c89d4f]/72 bg-[linear-gradient(180deg,rgba(246,225,174,0.98),rgba(197,151,72,0.98))] px-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#3a2a18] shadow-[0_16px_34px_rgba(148,105,39,0.18),inset_0_1px_0_rgba(255,255,255,0.58)] transition hover:-translate-y-0.5"
                href={backHref}
              >
                Return to Reading Room
              </Link>
            </div>
          ) : loadError ? (
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#c48a73]/32 bg-[#fff5ed]/78 p-5 shadow-[0_20px_54px_rgba(137,83,54,0.09)] backdrop-blur-md sm:p-6">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d4a088]/48 to-transparent" />
              <h2 className="font-serif text-2xl text-[#5b3b2f]">
                {loadError}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#7b5f52]">
                Please return to the Reading Room or try again later.
              </p>
              <Link
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-[#c89d4f]/50 bg-white/54 px-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#7b5b2a] shadow-[0_12px_28px_rgba(148,105,39,0.10)] transition hover:-translate-y-0.5 hover:bg-white/74"
                href={backHref}
              >
                Return to Reading Room
              </Link>
            </div>
          ) : readings.length === 0 ? (
            <div className="relative overflow-hidden rounded-[1.85rem] border border-[#d8bd82]/42 bg-[linear-gradient(180deg,rgba(255,253,247,0.94),rgba(250,244,233,0.88))] p-5 shadow-[0_24px_68px_rgba(116,83,36,0.10),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-md sm:p-7">
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#d2b06d]/58 to-transparent" />
              <div
                aria-hidden="true"
                className="mb-5 flex h-28 items-center justify-center rounded-[1.35rem] border border-[#d8bd82]/34 bg-[#fffaf1]/62"
              >
                <div className="relative h-20 w-14 rounded-[0.8rem] border border-[#d8bd82]/48 bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(242,231,211,0.88))] shadow-[0_12px_30px_rgba(116,83,36,0.10)]">
                  <div className="absolute inset-2 rounded-[0.55rem] border border-[#d8bd82]/42" />
                  <div className="absolute inset-x-3 top-4 h-px bg-gradient-to-r from-transparent via-[#caa664]/42 to-transparent" />
                  <div className="absolute inset-x-3 bottom-4 h-px bg-gradient-to-r from-transparent via-[#caa664]/32 to-transparent" />
                </div>
              </div>
              <h2 className="font-serif text-2xl text-[#4f4235]">
                Your journal is quiet for now.
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#6f624f]">
                Begin a reading, and your saved interpretation will appear here
                for later reflection.
              </p>
              <Link
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-[#c89d4f]/72 bg-[linear-gradient(180deg,rgba(246,225,174,0.98),rgba(197,151,72,0.98))] px-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#3a2a18] shadow-[0_16px_34px_rgba(148,105,39,0.18),inset_0_1px_0_rgba(255,255,255,0.58)] transition hover:-translate-y-0.5"
                href={backHref}
              >
                Begin a Reading
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              <p className="text-center text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#9d7b3f]">
                Latest 20 saved readings
              </p>
              {readings.map((reading) => (
                <article
                  className="relative overflow-hidden rounded-[1.6rem] border border-[#d8bd82]/42 bg-[linear-gradient(180deg,rgba(255,253,247,0.94),rgba(250,244,233,0.88))] p-4 shadow-[0_18px_52px_rgba(116,83,36,0.10),inset_0_1px_0_rgba(255,255,255,0.74)] backdrop-blur-md sm:p-5"
                  key={reading.id}
                >
                  <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d2b06d]/56 to-transparent" />
                  <div className="flex flex-col gap-3 border-b border-[#d8bd82]/32 pb-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#9d7b3f]">
                        {formatDate(reading.created_at, lang)}
                      </p>
                      <h2 className="mt-2 font-serif text-2xl leading-tight text-[#4f4235]">
                        {reading.card_title || reading.card_id || "Saved Card"}
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <span className="inline-flex rounded-full border border-[#d8bd82]/46 bg-[#fffaf1]/76 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#8d6426]">
                        {getModeLabel(reading.mode)}
                      </span>
                      <span className="inline-flex rounded-full border border-[#d8bd82]/38 bg-white/48 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#7b6c58]">
                        {getSpreadLabel(reading.spread)}
                      </span>
                      <span className="inline-flex rounded-full border border-[#d8bd82]/38 bg-white/48 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#7b6c58]">
                        {getOrientationLabel(reading.orientation)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4">
                    <section className="rounded-[1.1rem] border border-[#d8bd82]/28 bg-white/42 p-4">
                      <h3 className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#9d7b3f]">
                        Question
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-[#4f4334]">
                        {reading.question || "No question was recorded."}
                      </p>
                    </section>
                    <section className="rounded-[1.1rem] border border-[#d8bd82]/28 bg-[#fffaf1]/58 p-4">
                      <h3 className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#9d7b3f]">
                        Ora's interpretation
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-[#6f624f]">
                        {getReadingSummary(reading.reading_json)}
                      </p>
                    </section>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
