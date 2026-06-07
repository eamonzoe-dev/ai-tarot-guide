"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PageContainer } from "@/components/ai-guide/PageContainer";
import { ReadingSection } from "@/components/ai-guide/ReadingSection";
import { TarotButton } from "@/components/ai-guide/TarotButton";
import { getTarotCardById } from "@/data/tarotCards";

const SELECTED_CARD_KEY = "aiTarot:selectedCard";
const USER_QUESTION_KEY = "aiTarot:userQuestion";

type ResultClientProps = {
  initialCard: string;
  initialQuestion: string;
};

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
        <TarotButton href="/ai-guide/select-card">BACK TO CARDS</TarotButton>
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
        <TarotButton href={`/ai-guide/ask?card=${card.id}`}>
          BACK TO QUESTION
        </TarotButton>
      </PageContainer>
    );
  }

  return (
    <PageContainer compact>
      <article className="pb-8">
        <header className="border-b border-[#2a2e32] pb-6 pt-2 text-center">
          <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#7f99ad]">
            Your reading
          </p>
          <div className="mx-auto max-w-[13rem]">
            <div className="relative mx-auto h-[300px] w-full border border-[#33383d] bg-[#070809] p-2 shadow-[0_26px_64px_rgba(0,0,0,0.48),0_0_38px_rgba(75,112,139,0.1)]">
              <div className="relative h-full w-full overflow-hidden border border-[#24282c] bg-[#050506]">
                <Image
                  src={card.image}
                  alt={`${card.title} tarot card`}
                  fill
                  sizes="208px"
                  className="object-contain opacity-95 saturate-[0.9]"
                />
              </div>
            </div>
          </div>
          <p className="mt-5 text-sm uppercase tracking-[0.32em] text-[#7f99ad]">
            {card.roman}
          </p>
          <h1 className="mt-2 font-serif text-4xl leading-none text-[#f4efe5]">
            {card.title}
          </h1>
        </header>

        <ReadingSection title="Your Question">
          <p>{question}</p>
        </ReadingSection>
        <ReadingSection title="Core Meaning">
          <p>{card.coreMeaning}</p>
        </ReadingSection>
        <ReadingSection title="Upright Message">
          <p>{card.uprightMessage}</p>
        </ReadingSection>
        <ReadingSection title="Shadow Message">
          <p>{card.shadowMessage}</p>
        </ReadingSection>
        <ReadingSection title="Love Message">
          <p>{card.loveMessage}</p>
        </ReadingSection>
        <ReadingSection title="Practical Advice">
          <p>{card.practicalAdvice}</p>
        </ReadingSection>
        <ReadingSection title="Reflection Question">
          <p>{card.reflectionQuestion}</p>
        </ReadingSection>

        <div className="mt-3 flex flex-col gap-3">
          <TarotButton href="/ai-guide/select-card" variant="ghost">
            CHOOSE ANOTHER CARD
          </TarotButton>
          <TarotButton href={`/ai-guide/ask?card=${card.id}`} variant="ghost">
            ASK AGAIN
          </TarotButton>
        </div>
      </article>
    </PageContainer>
  );
}
