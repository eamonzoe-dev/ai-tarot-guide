"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getTarotCardLabel,
  getTarotCardTitle,
  type TarotCard,
} from "@/data/tarotCards";
import { type Language } from "@/lib/ai-guide/i18n";

type CardChoiceProps = {
  card: TarotCard;
  onSelect: (cardId: string) => void;
  href: string;
  isSelectionActive?: boolean;
  isSelected?: boolean;
  lang?: Language;
};

export function CardChoice({
  card,
  href,
  isSelectionActive = false,
  isSelected = false,
  onSelect,
  lang = "en",
}: CardChoiceProps) {
  const router = useRouter();
  const navigationTimer = useRef<number | undefined>(undefined);
  const [isNavigating, setIsNavigating] = useState(false);
  const cardLabel = getTarotCardLabel(card, lang);
  const cardTitle = getTarotCardTitle(card, lang);

  useEffect(() => {
    return () => {
      if (navigationTimer.current) {
        window.clearTimeout(navigationTimer.current);
      }
    };
  }, []);

  return (
    <Link
      href={href}
      onClick={(event) => {
        if (isNavigating || isSelectionActive) {
          event.preventDefault();
          return;
        }

        event.preventDefault();
        setIsNavigating(true);
        onSelect(card.id);

        navigationTimer.current = window.setTimeout(() => {
          router.push(href);
        }, 640);
      }}
      aria-disabled={isNavigating || isSelectionActive}
      className={`card group relative z-10 flex flex-col p-2.5 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[var(--c-accent)] focus:outline-none ${
        isSelected ? "ritual-draw-card-selected" : ""
      } ${
        isSelectionActive && !isSelected ? "ritual-draw-card-dimmed" : ""
      }`}
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden border border-[var(--c-border)] bg-[var(--c-surface-2)]">
        {card.image ? (
          <Image
            src={card.image}
            alt={`${cardTitle} tarot card`}
            width={180}
            height={320}
            sizes="(max-width: 768px) 45vw, 180px"
            className="pointer-events-none h-full w-full object-cover opacity-90 saturate-[0.86] transition duration-300 group-hover:scale-[1.025] group-hover:opacity-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--c-surface-2)] p-4">
            <div className="flex h-full w-full flex-col justify-between border border-[var(--c-border-strong)] p-3 text-center">
              <span className="eyebrow text-[0.52rem]">
                {cardLabel}
              </span>
              <span className="font-serif text-lg leading-tight text-[var(--c-text)]">
                {cardTitle}
              </span>
              <span className="micro uppercase">
                {card.rank}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="px-1 pb-1 pt-3 text-center">
        <p className="micro uppercase">
          {cardLabel}
        </p>
        <h2 className="mt-1 font-serif text-lg leading-none text-[var(--c-text)]">
          {cardTitle}
        </h2>
      </div>
    </Link>
  );
}
