"use client";

import Image from "next/image";
import Link from "next/link";

import type { TarotCard } from "@/data/tarotCards";

type CardChoiceProps = {
  card: TarotCard;
  onSelect: (cardId: string) => void;
};

export function CardChoice({ card, onSelect }: CardChoiceProps) {
  return (
    <Link
      href={`/ai-guide/ask?card=${card.id}`}
      onClick={() => {
        onSelect(card.id);
      }}
      className="group relative z-10 flex flex-col border border-[#2f3438] bg-[#090a0b] p-2.5 text-left shadow-[0_18px_40px_rgba(0,0,0,0.34),inset_0_0_0_1px_rgba(255,255,255,0.025)] transition duration-200 hover:-translate-y-0.5 hover:border-[#617e94]/75 hover:shadow-[0_22px_48px_rgba(0,0,0,0.45),0_0_26px_rgba(75,112,139,0.14)] focus:outline-none focus:ring-2 focus:ring-[#668aa8]/60"
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden border border-[#252a2f] bg-[#050506]">
        <Image
          src={card.image}
          alt={`${card.title} tarot card`}
          fill
          sizes="(max-width: 768px) 45vw, 180px"
          className="pointer-events-none object-cover opacity-90 saturate-[0.86] transition duration-300 group-hover:scale-[1.025] group-hover:opacity-100"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_62%,rgba(0,0,0,0.38))]" />
      </div>

      <div className="px-1 pb-1 pt-3 text-center">
        <p className="text-[0.64rem] uppercase tracking-[0.3em] text-[#7f99ad]">
          {card.roman}
        </p>
        <h2 className="mt-1 font-serif text-lg leading-none text-[#efe8d9]">
          {card.title}
        </h2>
      </div>
    </Link>
  );
}
