"use client";

import Image from "next/image";
import Link from "next/link";

import type { TarotCard } from "@/data/tarotCards";

type CardChoiceProps = {
  card: TarotCard;
  onSelect: (cardId: string) => void;
  href: string;
};

export function CardChoice({ card, href, onSelect }: CardChoiceProps) {
  return (
    <Link
      href={href}
      onClick={() => {
        onSelect(card.id);
      }}
      className="group relative z-10 flex flex-col border border-[#4a3b28] bg-[linear-gradient(180deg,#15100d,#080706)] p-2.5 text-left shadow-[0_16px_34px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,245,224,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-[#a98552]/75 hover:shadow-[0_22px_48px_rgba(0,0,0,0.45),0_0_22px_rgba(169,133,82,0.12)] focus:outline-none focus:ring-2 focus:ring-[#b89a68]/55"
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden border border-[#302719] bg-[#050506]">
        <Image
          src={card.image}
          alt={`${card.title} tarot card`}
          width={180}
          height={320}
          sizes="(max-width: 768px) 45vw, 180px"
          className="pointer-events-none h-full w-full object-cover opacity-90 saturate-[0.86] transition duration-300 group-hover:scale-[1.025] group-hover:opacity-100"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_62%,rgba(0,0,0,0.38))]" />
      </div>

      <div className="px-1 pb-1 pt-3 text-center">
        <p className="text-[0.64rem] uppercase tracking-[0.3em] text-[#bca77f]">
          {card.roman}
        </p>
        <h2 className="mt-1 font-serif text-lg leading-none text-[#efe8d9]">
          {card.title}
        </h2>
      </div>
    </Link>
  );
}
