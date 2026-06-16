"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useMemo, useState } from "react";

import { ActivationCodePanel } from "@/components/ai-guide/ActivationCodePanel";
import { type Language } from "@/lib/ai-guide/i18n";

type OracleShowroomHomeProps = {
  lang: Language;
  hasLangParam: boolean;
  homeHref: string;
  physicalHref: string;
  onlineHref: string;
  readingsHref: string;
  askOnlineHref: string;
  clarityHref: string;
  mirrorHref: string;
  nextStepHref: string;
  trustHrefs: {
    privacy: string;
    terms: string;
    disclaimer: string;
    contact: string;
  };
};

const revealTiming = {
  transitionDuration: "700ms",
  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
};

const staggerDelays = ["80ms", "140ms", "200ms", "260ms"];

const questions = [
  "What am I not seeing clearly?",
  "What needs my attention?",
  "What is the next step?",
  "What is ready to be released?",
  "What is within my control?",
  "Where is my energy best spent?",
  "What lesson keeps returning?",
];

type DeckCard = {
  name: string;
  numeral: string;
  keyword: string;
  face: boolean;
};

const deckCards: DeckCard[] = [
  { name: "The Fool", numeral: "0", keyword: "Beginnings", face: true },
  { name: "The Star", numeral: "XVII", keyword: "Hope", face: true },
  { name: "Ace of Cups", numeral: "A", keyword: "Feeling", face: false },
  { name: "Two of Wands", numeral: "II", keyword: "Choice", face: false },
  { name: "The Hermit", numeral: "IX", keyword: "Inner light", face: true },
  { name: "The High Priestess", numeral: "II", keyword: "Intuition", face: false },
];

const journalNotes = [
  {
    title: "Quiet Pattern",
    card: "The Star",
    note: "A softer answer appeared after the question stopped trying to win.",
  },
  {
    title: "Decision Thread",
    card: "Two of Wands",
    note: "The next step asked for a boundary before it asked for speed.",
  },
  {
    title: "Mirror Note",
    card: "The Hermit",
    note: "The reading returned attention to the one thing that could be chosen.",
  },
  {
    title: "Release Mark",
    card: "Ace of Cups",
    note: "The card named feeling as information, not interruption.",
  },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function CardBack({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        "relative aspect-[9/16] overflow-hidden rounded-[1.35rem] border border-[#d8b76a]/48 bg-[linear-gradient(160deg,#17110d,#050504)] shadow-[0_24px_58px_rgba(18,13,8,0.32),0_0_32px_rgba(216,183,106,0.14),inset_0_0_0_9px_rgba(0,0,0,0.18),inset_0_0_0_10px_rgba(234,215,166,0.13)]",
        className,
      )}
    >
      <div className="absolute inset-4 rounded-[0.9rem] border border-[#ead7a6]/22" />
      <div className="absolute inset-8 rounded-full border border-[#d8b76a]/22" />
      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ead7a6]/36" />
      <div className="absolute left-1/2 top-1/2 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d8b76a]/54 to-transparent" />
      <div className="absolute left-1/2 top-[21%] h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#ead7a6]/42 to-transparent" />
      <div className="absolute bottom-[21%] left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#ead7a6]/42 to-transparent" />
    </div>
  );
}

function CardFace({
  numeral,
  name,
  keyword,
  className = "",
}: {
  numeral: string;
  name: string;
  keyword: string;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "relative aspect-[9/16] overflow-hidden rounded-[1.35rem] border border-[#caa96a]/55 bg-[linear-gradient(165deg,#fdf7ea,#efddb6)] shadow-[0_24px_60px_rgba(102,75,33,0.24),0_0_30px_rgba(255,255,255,0.6),inset_0_0_0_9px_rgba(255,255,255,0.34),inset_0_0_0_10px_rgba(202,169,106,0.42)]",
        className,
      )}
    >
      <div className="absolute inset-[14px] rounded-[0.85rem] border border-[#a9823f]/40" />
      <div className="absolute left-1/2 top-[14%] -translate-x-1/2 font-serif text-base tracking-[0.32em] text-[#8d6426]">
        {numeral}
      </div>
      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-[60%] rounded-full border border-[#a9823f]/45" />
      <div className="absolute left-1/2 top-1/2 h-px w-24 -translate-x-1/2 -translate-y-[60%] bg-gradient-to-r from-transparent via-[#a9823f]/55 to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-24 w-px -translate-x-1/2 -translate-y-[60%] bg-gradient-to-b from-transparent via-[#a9823f]/45 to-transparent" />
      <div className="absolute left-1/2 top-[40%] h-2 w-2 -translate-x-1/2 rotate-45 border border-[#8d6426]/55" />
      <div className="absolute inset-x-3 bottom-4 text-center">
        <p className="font-serif text-[0.78rem] leading-tight text-[#5b4a36]">
          {name}
        </p>
        <p className="mt-1 text-[0.52rem] font-semibold uppercase tracking-[0.22em] text-[#a9823f]">
          {keyword}
        </p>
      </div>
    </div>
  );
}

export function OracleShowroomHome({
  lang,
  hasLangParam,
  homeHref,
  physicalHref,
  onlineHref,
  readingsHref,
  askOnlineHref,
  clarityHref,
  mirrorHref,
  nextStepHref,
  trustHrefs,
}: OracleShowroomHomeProps) {
  const [visible, setVisible] = useState<Set<string>>(() => new Set());
  const [compactHeader, setCompactHeader] = useState(false);
  const [parallax, setParallax] = useState(0);
  const [activeCard, setActiveCard] = useState(0);

  const isZh = lang === "zh";
  const copy = useMemo(
    () => ({
      room: isZh ? "Reading Room" : "Reading Room",
      subtitle: isZh
        ? "A quiet reading room for modern questions."
        : "A quiet reading room for modern questions.",
      heroBody: isZh
        ? "Move through the room, choose your path, and let one card hold the question."
        : "Move through the room, choose your path, and let one card hold the question.",
      begin: isZh ? "Begin a Reading" : "Begin a Reading",
      physical: isZh ? "Use Physical Deck" : "Use Physical Deck",
      explore: isZh ? "Explore the Cards" : "Explore the Cards",
      journal: isZh ? "Reading Journal" : "Reading Journal",
    }),
    [isZh],
  );

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const revealNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-showroom-reveal]"),
    );

    if (reduceMotion) {
      setVisible(new Set(revealNodes.map((node) => node.dataset.revealId ?? "")));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const id = (entry.target as HTMLElement).dataset.revealId;
          if (id) {
            setVisible((current) => new Set(current).add(id));
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -10% 0px" },
    );

    revealNodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const smallViewport = window.matchMedia("(max-width: 640px)").matches;
    let frame = 0;

    function updateMotion() {
      frame = 0;
      const scrollY = window.scrollY;
      setCompactHeader(scrollY > 42);
      setParallax(reduceMotion || smallViewport ? 0 : Math.min(80, scrollY * 0.05));
    }

    function handleScroll() {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateMotion);
    }

    updateMotion();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  function revealClass(id: string) {
    return cx(
      "transition-all motion-reduce:translate-y-0 motion-reduce:opacity-100",
      visible.has(id)
        ? "translate-y-0 opacity-100"
        : "translate-y-8 opacity-0",
    );
  }

  function revealStyle(delayIndex = 0): CSSProperties {
    return {
      ...revealTiming,
      transitionDelay: staggerDelays[delayIndex % staggerDelays.length],
    };
  }

  function openAccountMenu() {
    const accountArea = document.getElementById("reading-account");
    const accountButton =
      accountArea?.querySelector<HTMLButtonElement>("button[aria-expanded]");

    accountArea?.scrollIntoView({ block: "center" });
    window.setTimeout(() => accountButton?.click(), 80);
  }

  function setNextCard(direction: number) {
    setActiveCard((current) => {
      const next = current + direction;
      if (next < 0) {
        return deckCards.length - 1;
      }

      if (next >= deckCards.length) {
        return 0;
      }

      return next;
    });
  }

  return (
    <div className="min-h-svh bg-[#f4efe5] text-[#33291f]">
      <header
        className={cx(
          "top-0 z-[90] border-b transition duration-300 sm:sticky",
          compactHeader
            ? "border-[#d8b76a]/30 bg-[#fff9ee]/86 shadow-[0_10px_30px_rgba(88,64,31,0.08)] backdrop-blur"
            : "border-transparent bg-[#f4efe5]/58",
        )}
      >
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto] items-start gap-4 px-5 py-4 sm:grid-cols-[1fr_auto_1fr] sm:px-6 lg:px-8">
          <Link
            className="min-w-0 pt-1 font-serif text-lg leading-none text-[#4f4235] transition hover:text-[#9d7b3f]"
            href={homeHref}
          >
            Ora Arcana
          </Link>
          <nav className="hidden items-center justify-center gap-6 pt-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#9b8a73] sm:flex">
            <span className="text-[#9d7b3f]">{copy.room}</span>
          </nav>
          <div
            className="relative z-[100] flex items-start justify-end [&_button[aria-expanded]]:border-[#d8b76a]/45 [&_button[aria-expanded]]:bg-[#fffaf0]/78 [&_button[aria-expanded]]:text-[#5b4a36] [&_button[aria-expanded]]:shadow-[0_10px_28px_rgba(111,84,43,0.12)] [&_button[aria-expanded]]:backdrop-blur"
            id="reading-account"
          >
            <ActivationCodePanel
              lang={lang}
              hasLangParam={hasLangParam}
            />
          </div>
        </div>
      </header>

      <main className="relative overflow-x-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-4%,rgba(255,255,255,0.96),rgba(244,239,229,0.76)_30%,transparent_58%),radial-gradient(circle_at_12%_10%,rgba(234,215,166,0.28),transparent_28%),radial-gradient(circle_at_90%_18%,rgba(49,72,63,0.13),transparent_30%),linear-gradient(180deg,#f8f4ec_0%,#efe5d4_42%,#eadfc9_66%,#f4efe5_100%)]"
        />

        <section className="relative mx-auto grid min-h-[calc(100svh-4.75rem)] w-full max-w-6xl items-center gap-6 px-5 pb-10 pt-6 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-12">
          <div
            className={revealClass("hero-copy")}
            data-reveal-id="hero-copy"
            data-showroom-reveal
            style={revealStyle(0)}
          >
            <p className="mb-5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9d7b3f]">
              Ora Arcana Reading Room
            </p>
            <h1 className="font-serif text-[clamp(4.25rem,19vw,11rem)] leading-[0.76] text-[#3f352b]">
              <span className="block">ASK</span>
              <span className="block">THE</span>
              <span className="block">CARD</span>
            </h1>
            <p className="mt-5 max-w-xl font-serif text-xl leading-8 text-[#5b4a36] sm:text-2xl">
              {copy.subtitle}
            </p>
            <p className="mt-4 max-w-xl text-base leading-8 text-[#766955] sm:text-lg">
              {copy.heroBody}
            </p>
            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              <Link className="showroom-action-primary" href={onlineHref}>
                {copy.begin}
              </Link>
              <Link className="showroom-action-secondary" href={physicalHref}>
                {copy.physical}
              </Link>
              <Link className="showroom-action-quiet" href="#deck-carousel">
                {copy.explore}
              </Link>
            </div>
          </div>

          <div
            className="relative min-h-[34rem] sm:min-h-[42rem]"
            style={{ transform: `translateY(${parallax * 0.35}px)` }}
          >
            <div
              className={cx(
                revealClass("hero-stage"),
                "relative mx-auto h-[34rem] w-full max-w-[31rem] sm:h-[42rem] sm:max-w-[38rem]",
              )}
              data-reveal-id="hero-stage"
              data-showroom-reveal
              style={revealStyle(1)}
            >
              {/* gold star compass */}
              <div className="absolute inset-x-1 bottom-7 h-44 rounded-[2rem] border border-[#d8b76a]/22 bg-[linear-gradient(180deg,rgba(255,250,240,0.36),rgba(202,169,106,0.18)),repeating-linear-gradient(90deg,rgba(79,66,53,0.045)_0_1px,transparent_1px_18px)] shadow-[0_26px_70px_rgba(102,75,33,0.13),inset_0_1px_0_rgba(255,255,255,0.5)]" />
              <div className="absolute left-1/2 top-4 h-[19rem] w-[19rem] -translate-x-1/2 rounded-full border border-[#d8b76a]/28 bg-[radial-gradient(circle,rgba(255,255,255,0.58),rgba(234,215,166,0.14)_46%,transparent_72%)] sm:h-[29rem] sm:w-[29rem]" />
              <div className="absolute left-1/2 top-12 h-56 w-56 -translate-x-1/2 rounded-full border border-[#caa96a]/20 sm:h-[22rem] sm:w-[22rem]" />
              <div className="absolute left-1/2 top-11 h-px w-[min(36rem,90vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#caa96a]/58 to-transparent" />
              <div className="absolute left-1/2 top-28 h-px w-[min(30rem,82vw)] -translate-x-1/2 rotate-[30deg] bg-gradient-to-r from-transparent via-[#caa96a]/40 to-transparent" />
              <div className="absolute left-1/2 top-28 h-px w-[min(30rem,82vw)] -translate-x-1/2 -rotate-[30deg] bg-gradient-to-r from-transparent via-[#caa96a]/40 to-transparent" />
              <div className="absolute left-1/2 top-28 h-px w-[min(24rem,72vw)] -translate-x-1/2 rotate-90 bg-gradient-to-r from-transparent via-[#caa96a]/30 to-transparent" />
              <div className="absolute left-1/2 top-[14%] h-2.5 w-2.5 -translate-x-1/2 rotate-45 border border-[#caa96a]/60" />
              <div className="absolute left-[9%] top-[8%] h-24 w-20 -rotate-[10deg] rounded-[0.45rem] border border-[#caa96a]/32 bg-[#fffaf0]/72 shadow-[0_12px_28px_rgba(102,75,33,0.12)] sm:left-[12%]" />
              <div className="absolute right-[7%] top-[19%] h-16 w-28 rotate-[8deg] rounded-[0.55rem] border border-[#caa96a]/28 bg-[#fff5e4]/72 shadow-[0_12px_28px_rgba(102,75,33,0.1)] sm:right-[10%]" />

              {/* fanned deck — depth via stacked offsets */}
              <div className="absolute left-1/2 top-20 w-32 -translate-x-1/2 translate-x-[-4.4rem] -rotate-[22deg] sm:top-24 sm:w-44">
                <CardBack className="shadow-[0_18px_44px_rgba(18,13,8,0.3)]" />
              </div>
              <div className="absolute left-1/2 top-20 w-32 -translate-x-1/2 translate-x-[4.4rem] rotate-[22deg] sm:top-24 sm:w-44">
                <CardBack className="shadow-[0_18px_44px_rgba(18,13,8,0.3)]" />
              </div>
              <div className="absolute left-[6%] top-30 w-30 -rotate-[13deg] sm:left-[5%] sm:w-44">
                <CardBack />
              </div>
              <div className="absolute right-[6%] top-30 w-30 rotate-[13deg] sm:right-[5%] sm:w-44">
                <CardFace keyword="Hope" name="The Star" numeral="XVII" />
              </div>
              {/* center hero card — thick, raised */}
              <div className="absolute left-1/2 top-8 w-48 -translate-x-1/2 sm:w-64">
                <div className="absolute inset-0 translate-x-2 translate-y-5 rounded-[1.35rem] border border-[#caa96a]/28 bg-[#3b2c1a]/18" />
                <div className="absolute inset-0 translate-x-1 translate-y-3 rounded-[1.35rem] border border-[#caa96a]/36 bg-[#ead7a6]/30" />
                <div className="absolute inset-0 translate-y-2 rounded-[1.35rem] bg-[#2c2016]/24 blur-[3px]" />
                <CardFace
                  keyword="Beginnings"
                  name="The Fool"
                  numeral="0"
                  className="relative shadow-[0_34px_82px_rgba(102,75,33,0.3),0_0_56px_rgba(255,255,255,0.7),inset_0_0_0_10px_rgba(255,255,255,0.34)]"
                />
              </div>

              {/* tiny paper mark */}
              <div className="absolute right-[14%] top-[6%] h-12 w-9 rotate-[16deg] rounded-sm border border-[#caa96a]/40 bg-[#fffaf0]/80 shadow-[0_8px_20px_rgba(102,75,33,0.14)] sm:right-[16%]" />
              <div className="absolute bottom-26 left-[5%] h-16 w-24 -rotate-[8deg] rounded-[0.5rem] border border-[#caa96a]/28 bg-[#fff7e8]/72 shadow-[0_12px_28px_rgba(102,75,33,0.1)] sm:left-[9%]" />

              {/* question slip with tape */}
              <div className="absolute bottom-4 left-1/2 w-[min(26rem,92vw)] -translate-x-1/2 rotate-[-3deg] rounded-[1.1rem] border border-[#caa96a]/40 bg-[#fffaf0]/94 p-5 shadow-[0_24px_62px_rgba(111,84,43,0.2),inset_0_1px_0_rgba(255,255,255,0.78)]">
                <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-2deg] rounded-[2px] bg-[#e9d6a8]/70 shadow-sm" />
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#9d7b3f]">
                  Question slip
                </p>
                <p className="mt-3 font-serif text-2xl leading-tight text-[#4f4235]">
                  What is waiting to be asked?
                </p>
                <div className="mt-4 h-px bg-gradient-to-r from-[#caa96a]/0 via-[#caa96a]/44 to-[#caa96a]/0" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
          <p
            className={cx(
              revealClass("path-kicker"),
              "text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9d7b3f]",
            )}
            data-reveal-id="path-kicker"
            data-showroom-reveal
            style={revealStyle(0)}
          >
            Choose Your Path
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: "online",
                title: "ONLINE READING",
                body: "Draw one upright card online and move directly into the reading flow.",
                href: onlineHref,
                tone: "light" as const,
              },
              {
                id: "physical",
                title: "PHYSICAL DECK",
                body: "Use the cards in your hands, then bring the drawn card into Ora.",
                href: physicalHref,
                tone: "green" as const,
              },
              {
                id: "journal",
                title: "READING JOURNAL",
                body: "Return to saved questions, cards, and reflections in a quiet archive.",
                href: readingsHref,
                tone: "product" as const,
              },
            ].map((item, index) => (
              <Link
                className={cx(
                  revealClass(`path-${item.id}`),
                  "group relative flex min-h-[24rem] flex-col justify-between overflow-hidden rounded-[1.8rem] border p-6 shadow-[0_22px_58px_rgba(102,75,33,0.14)] transition duration-[260ms] hover:-translate-y-1.5 hover:scale-[1.015] motion-reduce:transform-none sm:p-7",
                  item.tone === "green" &&
                    "border-[#31483f]/30 bg-[linear-gradient(155deg,#29443b,#172a23)] text-[#f4efe5] hover:shadow-[0_30px_72px_rgba(33,54,47,0.3)]",
                  item.tone === "light" &&
                    "border-[#d8b76a]/36 bg-[radial-gradient(circle_at_82%_12%,rgba(255,255,255,0.9),transparent_30%),linear-gradient(170deg,#fffaf0,#f1e4cb)] text-[#3f352b] hover:border-[#b9934f]/62",
                  item.tone === "product" &&
                    "border-[#d8b76a]/30 bg-[linear-gradient(170deg,#fbf3e4,#ead8ba)] text-[#3f352b] hover:border-[#b9934f]/55",
                )}
                data-reveal-id={`path-${item.id}`}
                data-showroom-reveal
                href={item.href}
                key={item.id}
                style={revealStyle(index)}
              >
                {/* object visual layer per tone */}
                {item.tone === "light" && (
                  <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-48">
                    <span className="absolute right-4 top-5 w-28 rotate-[10deg] opacity-95 sm:w-32">
                      <CardFace keyword="Begin" name="The Fool" numeral="0" />
                    </span>
                    <span className="absolute right-24 top-10 h-px w-40 rotate-[-24deg] bg-gradient-to-r from-transparent via-[#caa96a]/52 to-transparent" />
                    <span className="absolute left-5 top-8 h-20 w-16 -rotate-[8deg] rounded-[0.45rem] border border-[#caa96a]/28 bg-[#fffaf0]/70" />
                  </span>
                )}
                {item.tone === "green" && (
                  <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-52">
                    <span className="absolute right-5 top-8 block h-36 w-24 rotate-[8deg] rounded-md border border-[#d8b76a]/45 bg-[#1a2a24] shadow-[0_18px_44px_rgba(0,0,0,0.34),inset_0_0_0_7px_rgba(216,183,106,0.18)]" />
                    <span className="absolute right-16 top-12 h-36 w-24 rotate-[-6deg] rounded-md border border-[#d8b76a]/30 bg-[#22382f]" />
                    <span className="absolute left-6 top-10 h-px w-36 bg-gradient-to-r from-transparent via-[#d8b76a]/54 to-transparent" />
                    <span className="absolute left-8 top-20 h-px w-28 rotate-90 bg-gradient-to-r from-transparent via-[#d8b76a]/34 to-transparent" />
                  </span>
                )}
                {item.tone === "product" && (
                  <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-52">
                    <span className="absolute right-7 top-8 h-28 w-20 rotate-[6deg] rounded-[7px] border border-[#caa96a]/45 bg-[#fffaf0] shadow-[0_14px_34px_rgba(102,75,33,0.16)]" />
                    <span className="absolute right-20 top-5 h-28 w-20 rotate-[-5deg] rounded-[7px] border border-[#caa96a]/35 bg-[#f6ecd6]" />
                    <span className="absolute left-6 top-12 h-24 w-36 -rotate-[3deg] rounded-[0.65rem] border border-[#caa96a]/28 bg-[#fff8e9]/70 shadow-[0_10px_26px_rgba(102,75,33,0.08)]" />
                    <span className="absolute left-10 top-20 h-px w-28 bg-[#caa96a]/34" />
                    <span className="absolute left-10 top-28 h-px w-20 bg-[#caa96a]/24" />
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className={cx(
                    "pointer-events-none absolute inset-x-6 bottom-5 h-px bg-gradient-to-r from-transparent to-transparent",
                    item.tone === "green" ? "via-[#d8b76a]/30" : "via-[#caa96a]/34",
                  )}
                />
                <span
                  className={cx(
                    "text-[0.62rem] font-semibold uppercase tracking-[0.24em]",
                    item.tone === "green" ? "text-[#d8b76a]" : "text-[#9d7b3f]",
                  )}
                >
                  0{index + 1}
                </span>
                <div className="relative mt-auto pt-24">
                  <h2 className="max-w-[13rem] font-serif text-4xl leading-[0.92] sm:text-5xl">
                    {item.title}
                  </h2>
                  <p
                    className={cx(
                      "mt-4 max-w-[14rem] text-sm leading-7",
                      item.tone === "green" ? "text-[#cdbfa6]" : "text-[#766955]",
                    )}
                  >
                    {item.body}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
          <div
            className={revealClass("question-wall")}
            data-reveal-id="question-wall"
            data-showroom-reveal
            style={revealStyle(0)}
          >
            <h2 className="font-serif text-[clamp(2.6rem,10vw,7rem)] leading-[0.9] text-[#3f352b]">
              What are you wondering?
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Love", "Work", "Self", "Decision", "Future"].map((chip) => (
                <span
                  className="rounded-full border border-[#caa96a]/36 bg-[#fffaf0]/72 px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#8d6426]"
                  key={chip}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-12 grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {questions.map((question, index) => {
              const paper = [
                "bg-[#fffbf4]/90",
                "bg-[#fdf6e7]/90",
                "bg-[#fbf3e2]/90",
              ][index % 3];
              const pin = index % 3;
              return (
                <Link
                  className={cx(
                    revealClass(`question-${index}`),
                    "group relative block min-h-[9rem] rounded-[0.9rem] border border-[#d8b76a]/34 p-4 pt-6 shadow-[0_14px_34px_rgba(102,75,33,0.12),inset_0_1px_0_rgba(255,255,255,0.78)] transition duration-[260ms] hover:z-30 hover:-translate-y-1.5 hover:scale-[1.02] hover:border-[#b9934f]/62 motion-reduce:transform-none",
                    paper,
                    // gentle scatter on mobile (small, overflow-safe), stronger on desktop
                    index % 4 === 0 && "rotate-[-2deg] lg:translate-y-8 lg:rotate-[-2.4deg]",
                    index % 4 === 1 && "rotate-[1.6deg] lg:-translate-y-3 lg:rotate-[1.8deg]",
                    index % 4 === 2 && "rotate-[-1deg] lg:translate-y-12 lg:rotate-[-1.2deg]",
                    index % 4 === 3 && "rotate-[2deg] lg:translate-y-2 lg:rotate-[2.2deg]",
                    index === 6 && "lg:col-start-2",
                  )}
                  data-reveal-id={`question-${index}`}
                  data-showroom-reveal
                  href={askOnlineHref}
                  key={question}
                  style={{
                    ...revealStyle(index),
                    zIndex: 10 + (index % 3),
                  }}
                >
                  {/* pin or tape */}
                  {pin === 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#b9934f] shadow-[0_2px_5px_rgba(102,75,33,0.4),inset_0_1px_0_rgba(255,255,255,0.6)]"
                    />
                  )}
                  {pin === 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute -top-2 left-5 h-5 w-12 rotate-[-8deg] rounded-[2px] bg-[#e9d6a8]/65 shadow-sm"
                    />
                  )}
                  {pin === 2 && (
                    <span
                      aria-hidden="true"
                      className="absolute right-3 top-3 h-2 w-2 rotate-45 border border-[#caa96a]/60"
                    />
                  )}
                  <span className="block h-px w-12 bg-[#caa96a]/44" />
                  <p className="mt-4 font-serif text-lg leading-snug text-[#4f4235] sm:text-xl">
                    {question}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#21362f,#1a2b25)] py-24 text-[#f4efe5] sm:py-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(216,183,106,0.16),transparent_34%),radial-gradient(circle_at_88%_82%,rgba(216,183,106,0.1),transparent_36%)]"
          />
          <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">
            <p
              className={cx(
                revealClass("unfolds-title"),
                "text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#d8b76a]",
              )}
              data-reveal-id="unfolds-title"
              data-showroom-reveal
              style={revealStyle(0)}
            >
              The Reading Unfolds
            </p>
            <h2
              className={cx(
                revealClass("unfolds-head"),
                "mt-4 max-w-2xl font-serif text-4xl leading-tight text-[#f4efe5] sm:text-5xl",
              )}
              data-reveal-id="unfolds-head"
              data-showroom-reveal
              style={revealStyle(1)}
            >
              Five quiet movements, one upright card.
            </h2>
            <div className="mt-14 grid gap-x-6 gap-y-10 md:grid-cols-5">
              {[
                { step: "Settle", note: "Arrive and let the noise around the question soften." },
                { step: "Ask", note: "Put the real question into a single clear line." },
                { step: "Draw", note: "One upright card is drawn for this moment." },
                { step: "Reveal", note: "The card and its symbolism come into view." },
                { step: "Reflect", note: "Read it as a mirror, then carry one honest step." },
              ].map(({ step, note }, index) => (
                <div
                  className={cx(
                    revealClass(`unfold-${step}`),
                    "relative border-t border-[#d8b76a]/40 pt-6 md:pt-8",
                    index % 2 === 1 && "md:translate-y-8",
                  )}
                  data-reveal-id={`unfold-${step}`}
                  data-showroom-reveal
                  key={step}
                  style={revealStyle(index)}
                >
                  <p className="font-serif text-6xl leading-none text-[#d8b76a]/85 sm:text-7xl">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 font-serif text-3xl text-[#f4efe5]">{step}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#bccabf]">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="relative mx-auto -mt-[5vh] w-full max-w-6xl px-5 py-20 sm:px-6 lg:-mt-[6vh] lg:px-8"
          id="deck-carousel"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className={cx(
                  revealClass("deck-kicker"),
                  "mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9d7b3f]",
                )}
                data-reveal-id="deck-kicker"
                data-showroom-reveal
                style={revealStyle(0)}
              >
                The Deck
              </p>
              <h2
                className={cx(
                  revealClass("deck-title"),
                  "font-serif text-[clamp(3.4rem,13vw,8rem)] leading-[0.82] text-[#3f352b]",
                )}
                data-reveal-id="deck-title"
                data-showroom-reveal
                style={revealStyle(1)}
              >
                <span className="block">DRAG THROUGH</span>
                <span className="block">THE DECK</span>
              </h2>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#9b8a73]">
                {String(activeCard + 1).padStart(2, "0")} / {String(deckCards.length).padStart(2, "0")}
              </span>
              <button
                aria-label="Previous card"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#caa96a]/45 bg-[#fffaf0]/80 text-lg text-[#6f614d] shadow-[0_10px_26px_rgba(102,75,33,0.12)] transition duration-[260ms] hover:-translate-y-1 hover:border-[#9d7b3f] hover:text-[#3f352b] motion-reduce:transform-none"
                onClick={() => setNextCard(-1)}
                type="button"
              >
                ‹
              </button>
              <button
                aria-label="Next card"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#9d7b3f]/55 bg-[linear-gradient(180deg,#f6e1ae,#c59748)] text-lg text-[#352513] shadow-[0_12px_30px_rgba(148,105,39,0.22)] transition duration-[260ms] hover:-translate-y-1 hover:scale-[1.04] motion-reduce:transform-none"
                onClick={() => setNextCard(1)}
                type="button"
              >
                ›
              </button>
            </div>
          </div>

          <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-8 pt-4 [scrollbar-width:thin] md:gap-0 md:overflow-visible md:px-0">
            {deckCards.map((card, index) => {
              const active = activeCard === index;
              const offset = index - activeCard;
              return (
                <Link
                  className={cx(
                    revealClass(`deck-${card.name}`),
                    "group relative block min-w-[13.5rem] shrink-0 snap-center rounded-[1.3rem] border p-3 transition duration-[320ms] motion-reduce:transform-none md:min-w-0 md:flex-1",
                    active
                      ? "z-20 border-[#9d7b3f]/70 bg-[#fffaf0]/92 shadow-[0_30px_70px_rgba(102,75,33,0.22)] md:-translate-y-3 md:scale-[1.05]"
                      : "z-10 border-[#d8b76a]/28 bg-[#fbf3e4]/72 shadow-[0_14px_38px_rgba(102,75,33,0.1)] hover:-translate-y-1.5 md:translate-y-3 md:scale-[0.93] md:opacity-80 md:blur-[0.4px]",
                    offset === -1 && "md:rotate-[-4deg]",
                    offset === 1 && "md:rotate-[4deg]",
                    offset <= -2 && "md:-mr-6 md:rotate-[-7deg]",
                    offset >= 2 && "md:-ml-6 md:rotate-[7deg]",
                  )}
                  data-reveal-id={`deck-${card.name}`}
                  data-showroom-reveal
                  href={askOnlineHref}
                  key={card.name}
                  onFocus={() => setActiveCard(index)}
                  onMouseEnter={() => setActiveCard(index)}
                  style={revealStyle(index)}
                >
                  {card.face || active ? (
                    <CardFace
                      keyword={card.keyword}
                      name={card.name}
                      numeral={card.numeral}
                      className="rounded-[0.95rem]"
                    />
                  ) : (
                    <CardBack className="rounded-[0.95rem]" />
                  )}
                  <div className="mt-4 flex min-h-12 items-center justify-between gap-2">
                    <p className="font-serif text-lg leading-tight text-[#4f4235]">
                      {card.name}
                    </p>
                    {active && (
                      <span className="rounded-full bg-[#9d7b3f]/14 px-2 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-[#8d6426]">
                        Active
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="relative mx-auto -mt-[4vh] w-full max-w-6xl px-5 py-20 sm:px-6 lg:-mt-[5vh] lg:px-8">
          <p
            className={cx(
              revealClass("modes-kicker"),
              "text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9d7b3f]",
            )}
            data-reveal-id="modes-kicker"
            data-showroom-reveal
            style={revealStyle(0)}
          >
            Reading Modes
          </p>
          <p
            className={cx(
              revealClass("modes-note"),
              "mt-3 font-serif text-2xl text-[#4f4235] sm:text-3xl",
            )}
            data-reveal-id="modes-note"
            data-showroom-reveal
            style={revealStyle(1)}
          >
            Each reading begins with one upright card.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { theme: "clarity" as const, title: "CLARITY READING", body: "Name the central signal in a situation.", href: clarityHref },
              { theme: "mirror" as const, title: "MIRROR READING", body: "See what the question reflects back to you.", href: mirrorHref },
              { theme: "next" as const, title: "NEXT STEP READING", body: "Bring attention to the most honest next move.", href: nextStepHref },
            ].map((mode, index) => (
              <Link
                className={cx(
                  revealClass(`mode-${index}`),
                  "group relative flex min-h-[27rem] flex-col justify-end overflow-hidden rounded-[1.5rem] border p-7 shadow-[0_22px_60px_rgba(102,75,33,0.16)] transition duration-[260ms] hover:-translate-y-1.5 hover:scale-[1.015] motion-reduce:transform-none",
                  mode.theme === "clarity" && "border-[#d8b76a]/40 bg-[linear-gradient(180deg,#fff7e6,#f0deb4)] text-[#3f352b] md:translate-y-4",
                  mode.theme === "mirror" && "border-[#31483f]/40 bg-[linear-gradient(180deg,#2b3f38,#1b2a24)] text-[#f4efe5]",
                  mode.theme === "next" && "border-[#caa96a]/40 bg-[linear-gradient(180deg,#fbf3e4,#e7d6b6)] text-[#3f352b] md:translate-y-4",
                )}
                data-reveal-id={`mode-${index}`}
                data-showroom-reveal
                href={mode.href}
                key={mode.title}
                style={revealStyle(index)}
              >
                {/* themed visual */}
                {mode.theme === "clarity" && (
                  <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-2/3">
                    <span className="absolute left-1/2 top-8 h-40 w-28 -translate-x-1/2 rounded-t-full border border-[#caa96a]/55 bg-[radial-gradient(circle_at_50%_30%,rgba(255,247,224,0.95),rgba(216,183,106,0.25))] shadow-[0_0_50px_rgba(216,183,106,0.45)]" />
                    <span className="absolute left-1/2 top-2 h-px w-44 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#caa96a]/70 to-transparent" />
                  </span>
                )}
                {mode.theme === "mirror" && (
                  <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-2/3">
                    <span className="absolute left-1/2 top-8 h-44 w-32 -translate-x-1/2 rounded-[999px] border border-[#d8b76a]/55 bg-[linear-gradient(160deg,rgba(216,183,106,0.34),rgba(20,32,27,0.5)_55%,rgba(216,183,106,0.18))] shadow-[inset_0_0_30px_rgba(0,0,0,0.5),0_0_40px_rgba(216,183,106,0.22)]" />
                    <span className="absolute left-1/2 top-[5.5rem] h-28 w-1 -translate-x-1/2 -rotate-[18deg] bg-gradient-to-b from-[#f4efe5]/70 to-transparent" />
                  </span>
                )}
                {mode.theme === "next" && (
                  <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-10 flex flex-col items-center gap-1.5">
                    <span className="h-2.5 w-24 rounded-sm bg-[#caa96a]/45" />
                    <span className="h-2.5 w-32 rounded-sm bg-[#caa96a]/35" />
                    <span className="h-2.5 w-40 rounded-sm bg-[#caa96a]/28" />
                    <span className="mt-2 text-2xl text-[#9d7b3f]">↑</span>
                  </span>
                )}
                <div className="relative">
                  <h2 className="font-serif text-3xl leading-none sm:text-4xl">
                    {mode.title}
                  </h2>
                  <p
                    className={cx(
                      "mt-4 text-sm leading-7",
                      mode.theme === "mirror" ? "text-[#cdbfa6]" : "text-[#766955]",
                    )}
                  >
                    {mode.body}
                  </p>
                  <span
                    className={cx(
                      "mt-5 inline-block text-[0.62rem] font-semibold uppercase tracking-[0.2em]",
                      mode.theme === "mirror" ? "text-[#d8b76a]" : "text-[#9d7b3f]",
                    )}
                  >
                    One upright card →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <h2
              className={cx(
                revealClass("journal-title"),
                "font-serif text-[clamp(3.6rem,12vw,8rem)] leading-[0.82] text-[#3f352b]",
              )}
              data-reveal-id="journal-title"
              data-showroom-reveal
              style={revealStyle(0)}
            >
              <span className="block">YOUR</span>
              <span className="block">READING</span>
              <span className="block">JOURNAL</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {journalNotes.map((note, index) => (
                <article
                  className={cx(
                    revealClass(`journal-${index}`),
                    "rounded-[1.1rem] border border-[#d8b76a]/32 bg-[#fffbf4]/84 p-5 shadow-[0_16px_42px_rgba(102,75,33,0.09)]",
                  )}
                  data-reveal-id={`journal-${index}`}
                  data-showroom-reveal
                  key={note.title}
                  style={revealStyle(index)}
                >
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#9d7b3f]">
                    {note.title}
                  </p>
                  <h3 className="mt-4 font-serif text-3xl text-[#4f4235]">
                    {note.card}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#766955]">
                    {note.note}
                  </p>
                </article>
              ))}
              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
                <Link className="showroom-action-primary" href={readingsHref}>
                  Open Journal
                </Link>
                <Link className="showroom-action-secondary" href={readingsHref}>
                  View All
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-2">
            <div
              className={cx(
                revealClass("physical-deck"),
                "rounded-[1.5rem] border border-[#d8b76a]/32 bg-[#fff9ee]/78 p-6 shadow-[0_18px_48px_rgba(102,75,33,0.1)]",
              )}
              data-reveal-id="physical-deck"
              data-showroom-reveal
              style={revealStyle(0)}
            >
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9d7b3f]">
                PHYSICAL DECK
              </p>
              <h2 className="mt-8 font-serif text-5xl leading-none text-[#3f352b]">
                Made to be held.
                <br />
                Made to be felt.
              </h2>
              <Link className="showroom-action-primary mt-8" href={physicalHref}>
                Use Physical Deck
              </Link>
            </div>
            <div
              className={cx(
                revealClass("redeem-deck"),
                "rounded-[1.5rem] border border-[#31483f]/24 bg-[#21362f] p-6 text-[#f4efe5] shadow-[0_18px_48px_rgba(33,54,47,0.16)]",
              )}
              data-reveal-id="redeem-deck"
              data-showroom-reveal
              style={revealStyle(1)}
            >
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#d8b76a]">
                REDEEM YOUR DECK
              </p>
              <h2 className="mt-8 font-serif text-5xl leading-none">
                Unlock your deck&apos;s companion experience.
              </h2>
              <button
                className="mt-8 inline-flex min-h-12 touch-manipulation items-center justify-center rounded-full border border-[#d8b76a]/56 bg-[#f4efe5] px-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#21362f] shadow-[0_14px_34px_rgba(0,0,0,0.18)] transition duration-[260ms] hover:-translate-y-1.5 hover:scale-[1.015] motion-reduce:transform-none"
                onClick={openAccountMenu}
                type="button"
              >
                Redeem Deck Code
              </button>
            </div>
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
          <h2
            className={cx(
              revealClass("trust-title"),
              "max-w-3xl font-serif text-5xl leading-tight text-[#3f352b] sm:text-6xl",
            )}
            data-reveal-id="trust-title"
            data-showroom-reveal
            style={revealStyle(0)}
          >
            A reflective tool, not a prediction machine.
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {[
              "Private by design",
              "AI-guided symbolism",
              "For reflection and entertainment",
            ].map((item, index) => (
              <div
                className={cx(
                  revealClass(`trust-${index}`),
                  "rounded-[1rem] border border-[#d8b76a]/28 bg-[#fffaf0]/72 p-5 shadow-[0_12px_32px_rgba(102,75,33,0.07)]",
                )}
                data-reveal-id={`trust-${index}`}
                data-showroom-reveal
                key={item}
                style={revealStyle(index)}
              >
                <h3 className="font-serif text-2xl text-[#4f4235]">{item}</h3>
                <p className="mt-3 text-sm leading-7 text-[#766955]">
                  Ora supports symbolic reflection and structured attention. It
                  is not medical, legal, financial, or psychological advice.
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#7a6b56]">
            <Link className="transition hover:text-[#9d7b3f]" href={trustHrefs.privacy}>
              Privacy
            </Link>
            <Link className="transition hover:text-[#9d7b3f]" href={trustHrefs.terms}>
              Terms
            </Link>
            <Link
              className="transition hover:text-[#9d7b3f]"
              href={trustHrefs.disclaimer}
            >
              Disclaimer
            </Link>
            <Link className="transition hover:text-[#9d7b3f]" href={trustHrefs.contact}>
              Contact
            </Link>
          </div>
        </section>

        <section className="relative bg-[#21362f] px-5 py-20 text-center text-[#f4efe5] sm:px-6 lg:px-8">
          <div
            className={cx(revealClass("final-cta"), "mx-auto max-w-4xl")}
            data-reveal-id="final-cta"
            data-showroom-reveal
            style={revealStyle(0)}
          >
            <h2 className="font-serif text-[clamp(3.4rem,12vw,8rem)] leading-[0.85]">
              Your question is waiting.
            </h2>
            <div className="mt-8 grid gap-3 sm:flex sm:justify-center">
              <Link className="showroom-final-primary" href={onlineHref}>
                Begin a Reading
              </Link>
              <Link className="showroom-final-secondary" href={physicalHref}>
                Use Physical Deck
              </Link>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .showroom-action-primary,
        .showroom-action-secondary,
        .showroom-action-quiet,
        .showroom-final-primary,
        .showroom-final-secondary {
          display: inline-flex;
          min-height: 3rem;
          touch-action: manipulation;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          padding: 0.85rem 1.25rem;
          text-align: center;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transition:
            transform 260ms ease,
            border-color 260ms ease,
            box-shadow 260ms ease,
            color 260ms ease,
            background 260ms ease;
        }

        .showroom-action-primary,
        .showroom-final-primary {
          border: 1px solid rgba(157, 123, 63, 0.55);
          background: linear-gradient(180deg, #f6e1ae, #c59748);
          color: #352513;
          box-shadow:
            0 16px 34px rgba(148, 105, 39, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }

        .showroom-action-secondary {
          border: 1px solid rgba(202, 169, 106, 0.48);
          background: rgba(255, 250, 240, 0.78);
          color: #5b4a36;
          box-shadow: 0 12px 28px rgba(102, 75, 33, 0.08);
        }

        .showroom-action-quiet {
          border: 1px solid transparent;
          background: transparent;
          color: #8d6426;
        }

        .showroom-final-secondary {
          border: 1px solid rgba(216, 183, 106, 0.52);
          background: rgba(244, 239, 229, 0.08);
          color: #f4efe5;
        }

        .showroom-action-primary:hover,
        .showroom-action-secondary:hover,
        .showroom-action-quiet:hover,
        .showroom-final-primary:hover,
        .showroom-final-secondary:hover {
          transform: translateY(-6px) scale(1.015);
        }

        @media (prefers-reduced-motion: reduce) {
          .showroom-action-primary,
          .showroom-action-secondary,
          .showroom-action-quiet,
          .showroom-final-primary,
          .showroom-final-secondary {
            transition: none;
          }

          .showroom-action-primary:hover,
          .showroom-action-secondary:hover,
          .showroom-action-quiet:hover,
          .showroom-final-primary:hover,
          .showroom-final-secondary:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
