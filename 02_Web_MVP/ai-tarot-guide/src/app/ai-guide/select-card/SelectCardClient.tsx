"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CardChoice } from "@/components/ai-guide/CardChoice";
import { PageContainer } from "@/components/ai-guide/PageContainer";
import { tarotCardGroups } from "@/data/tarotCards";

const SELECTED_CARD_KEY = "aiTarot:selectedCard";
const USER_QUESTION_KEY = "aiTarot:userQuestion";
const READING_MODE_KEY = "aiTarot:readingMode";

type SelectCardClientProps = {
  initialQuestion: string;
  initialSpread: string;
  initialOrientation: string;
};

export function SelectCardClient({
  initialQuestion,
  initialSpread,
  initialOrientation,
}: SelectCardClientProps) {
  const router = useRouter();
  const [question, setQuestion] = useState<string | undefined>(
    initialQuestion || undefined,
  );

  useEffect(() => {
    const storedQuestion = localStorage.getItem(USER_QUESTION_KEY) ?? "";
    const resolvedQuestion = initialQuestion || storedQuestion;

    if (initialQuestion) {
      localStorage.setItem(USER_QUESTION_KEY, initialQuestion);
    }

    localStorage.setItem(READING_MODE_KEY, "physical");

    queueMicrotask(() => {
      setQuestion(resolvedQuestion);
    });

    if (!resolvedQuestion) {
      router.replace("/ai-guide/ask?mode=physical");
    }
  }, [initialQuestion, router]);

  function handleSelect(cardId: string) {
    localStorage.setItem(SELECTED_CARD_KEY, cardId);
    localStorage.setItem(READING_MODE_KEY, "physical");

    if (question) {
      localStorage.setItem(USER_QUESTION_KEY, question);
    }
  }

  function buildResultHref(cardId: string) {
    const params = new URLSearchParams({
      mode: "physical",
      question: question ?? "",
      spread: initialSpread || "single",
      card: cardId,
      orientation: initialOrientation || "upright",
    });

    return `/ai-guide/result?${params.toString()}`;
  }

  if (question === undefined) {
    return (
      <PageContainer
        eyebrow="Physical Deck"
        title="Select the Card You Drew"
        description="Gathering your saved question."
      >
        <p className="text-sm text-[#a9a59d]">Preparing the card list...</p>
      </PageContainer>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <PageContainer
      eyebrow="Physical Deck"
      title="Select the Card You Drew"
      description="Choose the same card you just drew from your physical deck."
    >
      <div className="space-y-6 pb-8">
        {tarotCardGroups.map((group) => (
          <section key={group.title} className="atelier-panel p-3">
            <h2 className="atelier-label mb-3 px-1 text-xs font-semibold">
              {group.title}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {group.cards.map((card) => (
                <CardChoice
                  key={card.id}
                  card={card}
                  href={buildResultHref(card.id)}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
