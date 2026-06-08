"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PageContainer } from "@/components/ai-guide/PageContainer";
import { getTarotCardById } from "@/data/tarotCards";

const SELECTED_CARD_KEY = "aiTarot:selectedCard";
const USER_QUESTION_KEY = "aiTarot:userQuestion";

type ResultClientProps = {
  initialCard: string;
  initialQuestion: string;
};

const READING_LABEL_PATTERN =
  /^(Core Message|What This Means For Your Question|What To Notice|A Practical Next Step):\s*/i;

function cleanParagraph(paragraph: string) {
  return paragraph.replace(READING_LABEL_PATTERN, "").trim();
}

export function ResultClient({
  initialCard,
  initialQuestion,
}: ResultClientProps) {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState<string | null | undefined>(
    initialCard || undefined,
  );
  const [question, setQuestion] = useState<string | null | undefined>(
    initialQuestion || undefined,
  );
  const card = selectedCard ? getTarotCardById(selectedCard) : undefined;

  useEffect(() => {
    const storedSelectedCard = localStorage.getItem(SELECTED_CARD_KEY);
    const storedUserQuestion = localStorage.getItem(USER_QUESTION_KEY);
    const resolvedCard = initialCard || storedSelectedCard;
    const resolvedQuestion = initialQuestion || storedUserQuestion;

    if (initialCard) {
      localStorage.setItem(SELECTED_CARD_KEY, initialCard);
    }

    if (initialQuestion) {
      localStorage.setItem(USER_QUESTION_KEY, initialQuestion);
    }

    queueMicrotask(() => {
      setSelectedCard(resolvedCard);
      setQuestion(resolvedQuestion);
    });

    if (!resolvedCard) {
      router.replace("/ai-guide/select-card");
    }
  }, [initialCard, initialQuestion, router]);

  if (selectedCard === undefined || question === undefined) {
    return (
      <PageContainer
        eyebrow="Step 03"
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
          href={`/ai-guide/ask?card=${card.id}`}
        >
          BACK TO QUESTION
        </Link>
      </PageContainer>
    );
  }

  const readingSections = [
    { title: "Core Message", body: [card.coreMeaning] },
    {
      title: "What This Means For Your Question",
      body: [card.uprightMessage, card.loveMessage],
    },
    {
      title: "What To Notice",
      body: [card.shadowMessage, card.reflectionQuestion],
    },
    { title: "A Practical Next Step", body: [card.practicalAdvice] },
  ];

  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:py-14">
        <header className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-zinc-500">
          <p>Your reading</p>
          <p>Step 03</p>
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-5 lg:items-start lg:gap-16">
          <aside className="lg:col-span-2">
            <div className="text-center lg:sticky lg:top-10">
              <div className="mx-auto">
                <Image
                  src={card.image}
                  alt={`${card.title} tarot card`}
                  width={320}
                  height={569}
                  priority
                  className="mx-auto block h-auto w-36 rounded-2xl border border-zinc-900 object-cover shadow-2xl sm:w-44 lg:w-72 xl:w-80"
                />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                {card.roman}
              </p>
              <h1 className="mt-2 font-serif text-4xl leading-tight text-zinc-100 sm:text-5xl">
                {card.title}
              </h1>
            </div>
          </aside>

          <section className="lg:col-span-3">
            <div className="rounded-2xl border border-zinc-900/70 bg-zinc-950/80 p-5 lg:p-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Your Question
              </h2>
              <p className="mt-3 text-base leading-7 text-zinc-100 sm:text-lg">
                {question}
              </p>
            </div>

            <div className="mt-4 space-y-4">
              {readingSections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-2xl border border-zinc-900/70 bg-zinc-950/80 p-5"
                >
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
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
                className="flex min-h-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950 px-5 text-center text-xs font-semibold uppercase tracking-widest text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
                href={`/ai-guide/ask?card=${card.id}`}
              >
                ASK ANOTHER QUESTION
              </Link>
              <Link
                className="flex min-h-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950 px-5 text-center text-xs font-semibold uppercase tracking-widest text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
                href="/ai-guide"
              >
                START AGAIN
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
