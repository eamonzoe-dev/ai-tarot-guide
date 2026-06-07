"use client";

import { CardChoice } from "@/components/ai-guide/CardChoice";
import { PageContainer } from "@/components/ai-guide/PageContainer";
import { tarotCards } from "@/data/tarotCards";

const SELECTED_CARD_KEY = "aiTarot:selectedCard";
const USER_QUESTION_KEY = "aiTarot:userQuestion";

export default function SelectCardPage() {
  function handleSelect(cardId: string) {
    localStorage.setItem(SELECTED_CARD_KEY, cardId);
    localStorage.removeItem(USER_QUESTION_KEY);
  }

  return (
    <PageContainer
      eyebrow="Step 01"
      title="Select your card"
      description="Match the card in your hand. The reading will be shaped around this choice."
    >
      <div className="mx-auto grid w-full max-w-sm grid-cols-2 gap-3 pb-8">
        {tarotCards.map((card) => (
          <CardChoice key={card.id} card={card} onSelect={handleSelect} />
        ))}
      </div>
    </PageContainer>
  );
}
