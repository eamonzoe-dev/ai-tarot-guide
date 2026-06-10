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
      className={`group relative z-10 flex flex-col border border-[#4a3b28] bg-[linear-gradient(180deg,#15100d,#080706)] p-2.5 text-left shadow-[0_16px_34px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,245,224,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#a98552]/75 hover:shadow-[0_22px_48px_rgba(0,0,0,0.45),0_0_22px_rgba(169,133,82,0.12)] focus:outline-none focus:ring-2 focus:ring-[#b89a68]/55 ${
        isSelected ? "ritual-draw-card-selected" : ""
      } ${
        isSelectionActive && !isSelected ? "ritual-draw-card-dimmed" : ""
      }`}
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden border border-[#302719] bg-[#050506]">
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
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(160deg,#17110d,#070707)] p-4">
            <div className="flex h-full w-full flex-col justify-between border border-[#8c724b]/70 p-3 text-center">
              <span className="atelier-label text-[0.52rem] font-semibold">
                {cardLabel}
              </span>
              <span className="font-serif text-lg leading-tight text-[#efe8d9]">
                {cardTitle}
              </span>
              <span className="text-[0.58rem] uppercase tracking-[0.22em] text-[#bca77f]">
                {card.rank}
              </span>
            </div>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_62%,rgba(0,0,0,0.38))]" />
      </div>

      <div className="px-1 pb-1 pt-3 text-center">
        <p className="text-[0.64rem] uppercase tracking-[0.3em] text-[#bca77f]">
          {cardLabel}
        </p>
        <h2 className="mt-1 font-serif text-lg leading-none text-[#efe8d9]">
          {cardTitle}
        </h2>
      </div>
    </Link>
  );
}
