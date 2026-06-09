"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PageContainer } from "@/components/ai-guide/PageContainer";
import { getTarotCardById } from "@/data/tarotCards";

const SELECTED_CARD_KEY = "aiTarot:selectedCard";
const USER_QUESTION_KEY = "aiTarot:userQuestion";
const READING_MODE_KEY = "aiTarot:readingMode";
const READING_SPREAD_KEY = "aiTarot:readingSpread";
const CARD_ORIENTATION_KEY = "aiTarot:cardOrientation";
const LATEST_RITUAL_KEY = "aiTarot:latestRitual";

type ResultClientProps = {
  initialMode: "physical" | "online" | "";
  initialSpread: string;
  initialCard: string;
  initialOrientation: string;
  initialQuestion: string;
};

const READING_LABEL_PATTERN =
  /^(Core Message|What This Means For Your Question|What To Notice|A Practical Next Step):\s*/i;

function cleanParagraph(paragraph: string) {
  return paragraph.replace(READING_LABEL_PATTERN, "").trim();
}

type StoredRitual = {
  mode?: "physical" | "online";
  spread?: string;
  orientation?: string;
  question?: string;
  card?: string;
};

function readStoredRitual(): StoredRitual {
  const rawRitual = localStorage.getItem(LATEST_RITUAL_KEY);

  if (!rawRitual) {
    return {};
  }

  try {
    return JSON.parse(rawRitual) as StoredRitual;
  } catch {
    return {};
  }
}

export function ResultClient({
  initialMode,
  initialSpread,
  initialCard,
  initialOrientation,
  initialQuestion,
}: ResultClientProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"physical" | "online" | undefined>(
    initialMode || undefined,
  );
  const [spread, setSpread] = useState<string | undefined>(
    initialSpread || undefined,
  );
  const [orientation, setOrientation] = useState<string | undefined>(
    initialOrientation || undefined,
  );
  const [selectedCard, setSelectedCard] = useState<string | null | undefined>(
    initialCard || undefined,
  );
  const [question, setQuestion] = useState<string | null | undefined>(
    initialQuestion || undefined,
  );
  const card = selectedCard ? getTarotCardById(selectedCard) : undefined;

  useEffect(() => {
    const storedRitual = readStoredRitual();
    const storedMode = localStorage.getItem(READING_MODE_KEY);
    const storedSpread = localStorage.getItem(READING_SPREAD_KEY);
    const storedSelectedCard = localStorage.getItem(SELECTED_CARD_KEY);
    const storedOrientation = localStorage.getItem(CARD_ORIENTATION_KEY);
    const storedUserQuestion = localStorage.getItem(USER_QUESTION_KEY);
    const resolvedMode =
      initialMode ||
      storedRitual.mode ||
      (storedMode === "online" ? "online" : "physical");
    const resolvedSpread =
      initialSpread || storedRitual.spread || storedSpread || "single";
    const resolvedCard = initialCard || storedRitual.card || storedSelectedCard;
    const resolvedOrientation =
      initialOrientation ||
      storedRitual.orientation ||
      storedOrientation ||
      "upright";
    const resolvedQuestion =
      initialQuestion || storedRitual.question || storedUserQuestion;

    if (initialMode) {
      localStorage.setItem(READING_MODE_KEY, initialMode);
    }

    if (initialCard) {
      localStorage.setItem(SELECTED_CARD_KEY, initialCard);
    }

    if (initialSpread) {
      localStorage.setItem(READING_SPREAD_KEY, initialSpread);
    }

    if (initialOrientation) {
      localStorage.setItem(CARD_ORIENTATION_KEY, initialOrientation);
    }

    if (initialQuestion) {
      localStorage.setItem(USER_QUESTION_KEY, initialQuestion);
    }

    if (resolvedQuestion || resolvedCard) {
      localStorage.setItem(
        LATEST_RITUAL_KEY,
        JSON.stringify({
          mode: resolvedMode,
          spread: resolvedSpread,
          orientation: resolvedOrientation,
          question: resolvedQuestion,
          card: resolvedCard,
        }),
      );
    }

    queueMicrotask(() => {
      setMode(resolvedMode);
      setSpread(resolvedSpread);
      setSelectedCard(resolvedCard);
      setOrientation(resolvedOrientation);
      setQuestion(resolvedQuestion);
    });

    if (!resolvedCard) {
      router.replace(
        resolvedMode === "online"
          ? `/ai-guide/draw?mode=online${
              resolvedQuestion
                ? `&spread=single&orientation=upright&question=${encodeURIComponent(
                    resolvedQuestion,
                  )}`
                : ""
            }`
          : `/ai-guide/reveal?mode=physical&spread=single&orientation=upright${
              resolvedQuestion
                ? `&question=${encodeURIComponent(resolvedQuestion)}`
                : ""
            }`,
      );
    }
  }, [
    initialMode,
    initialSpread,
    initialCard,
    initialOrientation,
    initialQuestion,
    router,
  ]);

  if (
    mode === undefined ||
    spread === undefined ||
    selectedCard === undefined ||
    orientation === undefined ||
    question === undefined
  ) {
    return (
      <PageContainer
        eyebrow="Your reading"
        title="Reading the card"
        description="Gathering your saved card and question."
      >
        <p className="text-sm text-[#a9a59d]">Preparing your message...</p>
      </PageContainer>
    );
  }

  if (!card) {
    return (
      <PageContainer
        eyebrow="Reading error"
        title="The card cannot be found"
        description="The saved card is not part of this MVP deck. Return to the deck and choose again."
      >
        <Link
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-5 text-center text-xs font-semibold uppercase tracking-[0.25em] text-stone-100 transition hover:bg-white/[0.08]"
          href="/ai-guide/select-card"
        >
          BACK TO CARDS
        </Link>
      </PageContainer>
    );
  }

  if (!question) {
    return (
      <PageContainer
        eyebrow="Reading error"
        title="Missing question from localStorage"
        description="The selected card was found, but the question was not saved before opening the result page."
      >
        <Link
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-5 text-center text-xs font-semibold uppercase tracking-[0.25em] text-stone-100 transition hover:bg-white/[0.08]"
          href={`/ai-guide/ask?mode=${mode ?? "physical"}`}
        >
          BACK TO QUESTION
        </Link>
      </PageContainer>
    );
  }

  const readingSections = [
    {
      title: "Reading Reflection",
      body: [card.uprightMessage, card.loveMessage],
    },
    {
      title: "Shadow / Challenge",
      body: [card.shadowMessage],
    },
    { title: "Suggestion", body: [card.practicalAdvice] },
    { title: "Reflection Prompt", body: [card.reflectionQuestion] },
  ];
  const modeLabel =
    mode === "online" ? "Online Draw Mode" : "Physical Card Mode";
  const readingTypeLabel =
    spread === "single" ? "Single Card Reading" : "Single Card Reading";
  const orientationLabel =
    orientation === "upright" ? "Upright" : "Upright";

  return (
    <main className="atelier-page relative min-h-screen overflow-hidden text-zinc-100">
      <div className="atelier-grain pointer-events-none absolute inset-0" />
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:py-14">
        <header className="atelier-label relative flex items-center justify-between text-xs font-semibold">
          <p>Reading Dossier</p>
          <p>{mode === "online" ? "Online Draw" : "Physical Deck"}</p>
        </header>

        <div className="relative mt-8 grid gap-10 lg:grid-cols-5 lg:items-start lg:gap-16">
          <aside className="lg:col-span-2">
            <div className="text-center lg:sticky lg:top-10">
              <div className="atelier-worktop mx-auto max-w-xs p-4">
                <Image
                  src={card.image}
                  alt={`${card.title} tarot card`}
                  width={320}
                  height={569}
                  priority
                  className="mx-auto block h-auto w-36 border border-[#4a3b28] object-cover shadow-[0_22px_48px_rgba(0,0,0,0.55)] sm:w-44 lg:w-60 xl:w-64"
                />
              </div>

              <p className="atelier-label mt-6 text-xs font-semibold">
                {card.roman}
              </p>
              <h1 className="mt-2 font-serif text-4xl leading-tight text-zinc-100 sm:text-5xl">
                {card.title}
              </h1>
            </div>
          </aside>

          <section className="lg:col-span-3">
            <div className="atelier-paper p-5 lg:p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6d5532]">
                Question
              </h2>
              <p className="mt-3 text-base leading-7 text-[#17110d] sm:text-lg">
                {question}
              </p>
            </div>

            <div className="atelier-panel mt-4 p-5">
              <h2 className="atelier-label text-xs font-semibold">
                Reading Dossier
              </h2>
              <div className="mt-4 grid gap-4 text-sm leading-6 sm:grid-cols-3">
                <div>
                  <p className="text-[#bca77f]">Reading Type</p>
                  <p className="mt-1 text-zinc-100">{readingTypeLabel}</p>
                </div>
                <div>
                  <p className="text-[#bca77f]">Reading Mode</p>
                  <p className="mt-1 text-zinc-100">{modeLabel}</p>
                </div>
                <div>
                  <p className="text-[#bca77f]">Card Orientation</p>
                  <p className="mt-1 text-zinc-100">{orientationLabel}</p>
                </div>
              </div>
            </div>

            <div className="atelier-panel mt-4 p-5">
              <h2 className="atelier-label text-xs font-semibold">
                Card
              </h2>
              <p className="mt-3 font-serif text-2xl leading-tight text-zinc-100">
                {card.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#c8c0b4]">
                {cleanParagraph(card.coreMeaning)}
              </p>
            </div>

            <div className="mt-4 space-y-4">
              {readingSections.map((section) => (
                <section
                  key={section.title}
                  className="atelier-paper-dark p-5"
                >
                  <h2 className="atelier-label text-xs font-semibold">
                    {section.title}
                  </h2>
                  <div className="mt-3 space-y-4 text-[15px] leading-7 text-zinc-200 sm:text-base sm:leading-8">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{cleanParagraph(paragraph)}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                className="flex min-h-12 touch-manipulation items-center justify-center border border-[#3f4e47] bg-[linear-gradient(180deg,#111715,#090b0a)] px-5 text-center text-xs font-semibold uppercase tracking-widest text-zinc-200 shadow-[0_10px_24px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-[#7d927d] hover:bg-zinc-900"
                href={`/ai-guide/ask?mode=${mode ?? "physical"}`}
              >
                ASK ANOTHER QUESTION
              </Link>
              <Link
                className="flex min-h-12 touch-manipulation items-center justify-center border border-[#3f4e47] bg-[linear-gradient(180deg,#111715,#090b0a)] px-5 text-center text-xs font-semibold uppercase tracking-widest text-zinc-200 shadow-[0_10px_24px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-[#7d927d] hover:bg-zinc-900"
                href="/ai-guide"
              >
                START AGAIN
              </Link>
            </div>

            <section className="mt-4 border-t border-[#3d3020] pt-5">
              <h2 className="atelier-label text-xs font-semibold">
                Closing Note
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#9f947f]">
                This reading is a symbolic reflection, not a fixed prediction.
                Use it as a quiet prompt for attention, choice, and
                self-understanding.
              </p>
              <p className="mt-4 text-xs leading-5 text-[#777063]">
                Tarot readings on this site are symbolic reflections for
                personal insight. They are not medical, legal, financial, or
                psychological advice, and they should not replace professional
                support.
              </p>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}
