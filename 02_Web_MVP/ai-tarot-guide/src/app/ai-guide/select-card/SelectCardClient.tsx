"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CardChoice } from "@/components/ai-guide/CardChoice";
import { LanguageToggle } from "@/components/ai-guide/LanguageToggle";
import { PageContainer } from "@/components/ai-guide/PageContainer";
import { ReadingNav } from "@/components/ai-guide/ReadingNav";
import { tarotCardGroups } from "@/data/tarotCards";
import { getGroupTitle, type Language, text } from "@/lib/ai-guide/i18n";

const SELECTED_CARD_KEY = "aiTarot:selectedCard";
const USER_QUESTION_KEY = "aiTarot:userQuestion";
const READING_MODE_KEY = "aiTarot:readingMode";

type SelectCardClientProps = {
  initialQuestion: string;
  initialSpread: string;
  initialOrientation: string;
  initialLang: Language;
  hasLangParam: boolean;
};

export function SelectCardClient({
  initialQuestion,
  initialSpread,
  initialOrientation,
  initialLang,
  hasLangParam,
}: SelectCardClientProps) {
  const router = useRouter();
  const copy = text(initialLang);
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
      router.replace(
        `/ai-guide/ask?mode=physical&spread=single&orientation=upright&lang=${initialLang}`,
      );
    }
  }, [initialLang, initialQuestion, router]);

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
      lang: initialLang,
    });

    return `/ai-guide/result?${params.toString()}`;
  }

  if (question === undefined) {
    return (
      <PageContainer
        eyebrow={copy.physicalDeck}
        title={copy.selectCardTitle}
        description="Gathering your saved question."
      >
        <ReadingNav lang={initialLang} />
        <p className="text-sm text-[#a9a59d]">{copy.preparingCardList}</p>
      </PageContainer>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <PageContainer
      eyebrow={copy.physicalDeck}
      title={copy.selectCardTitle}
      description={copy.selectCardDescription}
    >
      <ReadingNav lang={initialLang} />
      <div className="mb-5 flex justify-end">
        <LanguageToggle
          lang={initialLang}
          pathname="/ai-guide/select-card"
          params={{
            question,
            spread: initialSpread || "single",
            orientation: initialOrientation || "upright",
          }}
          hasLangParam={hasLangParam}
        />
      </div>
      <div className="space-y-6 pb-8">
        {tarotCardGroups.map((group) => (
          <section key={group.title} className="atelier-panel p-3">
            <h2 className="atelier-label mb-3 px-1 text-xs font-semibold">
              {getGroupTitle(group.title, initialLang)}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {group.cards.map((card) => (
                <CardChoice
                  key={card.id}
                  card={card}
                  href={buildResultHref(card.id)}
                  onSelect={handleSelect}
                  lang={initialLang}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
