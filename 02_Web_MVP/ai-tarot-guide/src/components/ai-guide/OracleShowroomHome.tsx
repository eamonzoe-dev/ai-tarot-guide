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
  threeCardHref: string;
  readingsHref: string;
  askOnlineHref: string;
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
  threeCardHref,
  readingsHref,
  askOnlineHref,
  trustHrefs,
}: OracleShowroomHomeProps) {
  const [visible, setVisible] = useState<Set<string>>(() => new Set());
  const [compactHeader, setCompactHeader] = useState(false);
  const [parallax, setParallax] = useState(0);
  const [activeCard, setActiveCard] = useState(0);

  const isZh = lang === "zh";
  const copy = useMemo(
    () => ({
      sectionNavItems: isZh
        ? [
            { label: "如何开始", href: "#how-it-works" },
            { label: "卡组", href: "#deck" },
            { label: "解读模式", href: "#reading-modes" },
            { label: "解读日志", href: "#journal" },
            { label: "实体卡组", href: "#physical-deck" },
            { label: "说明", href: "#faq" },
          ]
        : [
            { label: "How it works", href: "#how-it-works" },
            { label: "Deck", href: "#deck" },
            { label: "Reading Modes", href: "#reading-modes" },
            { label: "Journal", href: "#journal" },
            { label: "Physical Deck", href: "#physical-deck" },
            { label: "FAQ", href: "#faq" },
          ],
      room: isZh ? "Ora Arcana 阅读室" : "Ora Arcana Reading Room",
      sectionNavigationLabel: isZh ? "页面分区导航" : "Section navigation",
      heroTitle: isZh ? ["向", "卡牌", "提问"] : ["ASK", "THE", "CARD"],
      subtitle: isZh
        ? "为现代问题准备的一间安静阅读室。"
        : "A quiet reading room for modern questions.",
      heroBody: isZh
        ? "在阅读室中选择路径，让一张正位牌安放此刻的问题。"
        : "Move through the room, choose your path, and let one card hold the question.",
      begin: isZh ? "开始解读" : "Begin a Reading",
      physical: isZh ? "使用实体卡组" : "Use Physical Deck",
      explore: isZh ? "浏览卡牌" : "Explore the Cards",
      journal: isZh ? "解读日志" : "Reading Journal",
      questionSlip: isZh ? "问题纸条" : "Question slip",
      waitingQuestion: isZh ? "此刻等待被问出的是什么？" : "What is waiting to be asked?",
      choosePath: isZh ? "选择你的解读" : "Choose Your Reading",
      paths: isZh
        ? [
            {
              id: "single",
              title: "单牌解读",
              body: "一个清晰问题的快速提示。",
              href: onlineHref,
              tone: "light" as const,
              disabled: false,
            },
            {
              id: "three-card",
              title: "三牌阵",
              body: "围绕处境、挑战与指引展开更深入的解读。",
              href: threeCardHref,
              tone: "green" as const,
              disabled: false,
            },
            {
              id: "relationship",
              title: "关系解读",
              body: "即将开放",
              href: "",
              tone: "product" as const,
              disabled: true,
            },
            {
              id: "career",
              title: "事业解读",
              body: "即将开放",
              href: "",
              tone: "product" as const,
              disabled: true,
            },
          ]
        : [
            {
              id: "single",
              title: "Single Card Reading",
              body: "A quick message for one clear question.",
              href: onlineHref,
              tone: "light" as const,
              disabled: false,
            },
            {
              id: "three-card",
              title: "Three Card Spread",
              body: "A deeper reading for situation, challenge, and guidance.",
              href: threeCardHref,
              tone: "green" as const,
              disabled: false,
            },
            {
              id: "relationship",
              title: "Relationship Reading",
              body: "Coming Soon",
              href: "",
              tone: "product" as const,
              disabled: true,
            },
            {
              id: "career",
              title: "Career Reading",
              body: "Coming Soon",
              href: "",
              tone: "product" as const,
              disabled: true,
            },
          ],
      wonderingTitle: isZh ? "你正在想什么？" : "What are you wondering?",
      chips: isZh
        ? ["关系", "工作", "自我", "选择", "未来"]
        : ["Love", "Work", "Self", "Decision", "Future"],
      questions: isZh
        ? [
            "我还没有看清什么？",
            "什么正在请求我的注意？",
            "下一步该放在哪里？",
            "什么已经可以放下？",
            "什么仍在我的掌控之中？",
            "我的能量最值得投向哪里？",
            "哪个课题正在反复回来？",
          ]
        : questions,
      unfoldsKicker: isZh ? "解读如何展开" : "The Reading Unfolds",
      unfoldsTitle: isZh ? "五个安静动作，一张正位牌。" : "Five quiet movements, one upright card.",
      unfolds: isZh
        ? [
            { step: "安顿", note: "抵达这里，让问题周围的杂音慢慢变轻。" },
            { step: "提问", note: "把真正的问题放进一句清楚的话里。" },
            { step: "抽牌", note: "为此刻抽取一张正位牌。" },
            { step: "揭示", note: "让卡牌与它的象征逐渐显现。" },
            { step: "回看", note: "把解读当作镜子，再带走一个诚实的下一步。" },
          ]
        : [
            { step: "Settle", note: "Arrive and let the noise around the question soften." },
            { step: "Ask", note: "Put the real question into a single clear line." },
            { step: "Draw", note: "One upright card is drawn for this moment." },
            { step: "Reveal", note: "The card and its symbolism come into view." },
            { step: "Reflect", note: "Read it as a mirror, then carry one honest step." },
          ],
      deckKicker: isZh ? "卡组" : "The Deck",
      deckTitle: isZh ? ["轻触浏览", "整副卡组"] : ["DRAG THROUGH", "THE DECK"],
      deckDescription: isZh
        ? "拖动卡组，或用按钮一步步翻看。"
        : "Drag across the deck or step through it with the controls.",
      deckAction: isZh ? "拖动 / 浏览" : "Drag / Explore",
      previousCard: isZh ? "上一张" : "Prev",
      nextCard: isZh ? "下一张" : "Next",
      previousCardLabel: isZh ? "上一张牌" : "Previous card",
      nextCardLabel: isZh ? "下一张牌" : "Next card",
      innerGuidance: isZh ? "内在指引" : "Inner guidance",
      active: isZh ? "当前" : "Active",
      deckCards: isZh
        ? [
            { name: "愚者", numeral: "0", keyword: "开始", face: true },
            { name: "星星", numeral: "XVII", keyword: "希望", face: true },
            { name: "圣杯王牌", numeral: "A", keyword: "感受", face: false },
            { name: "权杖二", numeral: "II", keyword: "选择", face: false },
            { name: "隐者", numeral: "IX", keyword: "内在之光", face: true },
            { name: "女祭司", numeral: "II", keyword: "直觉", face: false },
          ]
        : deckCards,
      modesKicker: isZh ? "解读模式" : "Reading Modes",
      modesNote: isZh ? "选择最适合你问题的解读。" : "Choose the reading that fits your question.",
      modes: isZh
        ? [
            {
              theme: "clarity" as const,
              title: "单牌解读",
              body: "一个清晰问题的快速提示。",
              cards: "1 张牌",
              status: "可用",
              cta: "开始单牌解读",
              href: onlineHref,
              disabled: false,
            },
            {
              theme: "mirror" as const,
              title: "三牌阵",
              body: "围绕处境、挑战与指引展开更深入的解读。",
              cards: "3 张牌",
              status: "可用",
              cta: "开始三牌解读",
              href: threeCardHref,
              disabled: false,
            },
            {
              theme: "next" as const,
              title: "关系解读",
              body: "用于爱、连接与情感清晰度。",
              cards: "3 张牌",
              status: "即将开放",
              cta: "即将开放",
              href: "",
              disabled: true,
            },
            {
              theme: "product" as const,
              title: "事业解读",
              body: "用于工作、方向与下一次机会。",
              cards: "3 张牌",
              status: "即将开放",
              cta: "即将开放",
              href: "",
              disabled: true,
            },
          ]
        : [
            {
              theme: "clarity" as const,
              title: "Single Card Reading",
              body: "A quick message for one clear question.",
              cards: "1 card",
              status: "Available",
              cta: "Start Single Card",
              href: onlineHref,
              disabled: false,
            },
            {
              theme: "mirror" as const,
              title: "Three Card Spread",
              body: "A deeper reading for situation, challenge, and guidance.",
              cards: "3 cards",
              status: "Available",
              cta: "Start Three Card",
              href: threeCardHref,
              disabled: false,
            },
            {
              theme: "next" as const,
              title: "Relationship Reading",
              body: "For love, connection, and emotional clarity.",
              cards: "3 cards",
              status: "Coming Soon",
              cta: "Coming Soon",
              href: "",
              disabled: true,
            },
            {
              theme: "product" as const,
              title: "Career Reading",
              body: "For work, direction, and next opportunities.",
              cards: "3 cards",
              status: "Coming Soon",
              cta: "Coming Soon",
              href: "",
              disabled: true,
            },
          ],
      cardsLabel: isZh ? "牌数" : "Cards",
      statusLabel: isZh ? "状态" : "Status",
      journalTitle: isZh ? ["你的", "解读", "日志"] : ["YOUR", "READING", "JOURNAL"],
      journalNotes: isZh
        ? [
            {
              title: "安静的模式",
              card: "星星",
              note: "当问题不再急着取胜，一个更柔和的答案浮现出来。",
            },
            {
              title: "选择的线索",
              card: "权杖二",
              note: "下一步先请求边界，然后才请求速度。",
            },
            {
              title: "镜中札记",
              card: "隐者",
              note: "这次解读把注意力带回那个仍然可以选择的地方。",
            },
            {
              title: "释放标记",
              card: "圣杯王牌",
              note: "卡牌把感受命名为信息，而不是干扰。",
            },
          ]
        : journalNotes,
      openJournal: isZh ? "打开解读日志" : "Open Journal",
      viewAll: isZh ? "查看全部" : "View All",
      physicalDeckKicker: isZh ? "实体卡组" : "PHYSICAL DECK",
      physicalDeckTitle: isZh ? ["为手心而作。", "为感受而作。"] : ["Made to be held.", "Made to be felt."],
      redeemDeckKicker: isZh ? "兑换你的卡组" : "REDEEM YOUR DECK",
      redeemDeckTitle: isZh
        ? "解锁实体卡组的线上陪伴体验。"
        : "Unlock your deck's companion experience.",
      redeemDeckCode: isZh ? "兑换卡组码" : "Redeem Deck Code",
      trustTitle: isZh ? "这是一件反思工具，不是一台预言机器。" : "A reflective tool, not a prediction machine.",
      trustItems: isZh
        ? ["以隐私为先", "AI 辅助象征解读", "用于反思与娱乐"]
        : ["Private by design", "AI-guided symbolism", "For reflection and entertainment"],
      trustBody: isZh
        ? "Ora 支持象征性的自我反思与有结构的注意力整理。它不是医疗、法律、财务或心理建议。"
        : "Ora supports symbolic reflection and structured attention. It is not medical, legal, financial, or psychological advice.",
      trustLinks: isZh
        ? { privacy: "隐私", terms: "条款", disclaimer: "免责声明", contact: "联系" }
        : { privacy: "Privacy", terms: "Terms", disclaimer: "Disclaimer", contact: "Contact" },
      finalTitle: isZh ? "你的问题正在等待。" : "Your question is waiting.",
    }),
    [isZh, onlineHref, threeCardHref],
  );
  const sectionNavItems = copy.sectionNavItems;
  const localizedDeckCards = copy.deckCards;

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const revealNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-showroom-reveal]"),
    );

    if (reduceMotion) {
      queueMicrotask(() => {
        setVisible(
          new Set(revealNodes.map((node) => node.dataset.revealId ?? "")),
        );
      });
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
      "translate-y-0 opacity-100 transition-all motion-reduce:translate-y-0 motion-reduce:opacity-100",
      visible.has(id) && "will-change-transform",
    );
  }

  function revealStyle(delayIndex = 0): CSSProperties {
    return {
      ...revealTiming,
      transitionDelay: staggerDelays[delayIndex % staggerDelays.length],
    };
  }

  function openAccountMenu() {
    const accountArea = document.getElementById("reading-account-panel");
    const accountButton =
      accountArea?.querySelector<HTMLButtonElement>(
        "button[aria-expanded].pointer-events-auto",
      );

    accountButton?.click();
  }

  function setNextCard(direction: number) {
    setActiveCard((current) => {
      const next = current + direction;
      if (next < 0) {
        return localizedDeckCards.length - 1;
      }

      if (next >= localizedDeckCards.length) {
        return 0;
      }

      return next;
    });
  }

  return (
    <div className="min-h-svh bg-[#f4efe5] text-[#33291f]">
      <div id="reading-account-panel">
        <ActivationCodePanel lang={lang} hasLangParam={hasLangParam} />
      </div>

      <header
        className={cx(
          "sticky top-0 isolate z-[240] border-b transition duration-300",
          compactHeader
            ? "border-[#d8b76a]/30 bg-[#fff9ee]/86 shadow-[0_10px_30px_rgba(88,64,31,0.08)] backdrop-blur"
            : "border-transparent bg-[#f4efe5]/88 backdrop-blur-sm",
        )}
      >
        <div className="pointer-events-auto mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-4 sm:px-6 lg:px-8 sm:items-center">
          <Link
            className="inline-flex min-h-9 shrink-0 items-center justify-self-start pt-0 font-serif text-lg leading-none text-[#4f4235] transition hover:text-[#9d7b3f] sm:min-w-0"
            href={homeHref}
          >
            Ora Arcana
          </Link>
          <nav
            aria-label={copy.sectionNavigationLabel}
            className="hidden items-center justify-center gap-4 text-[0.68rem] font-medium text-[#7a6b56] xl:flex xl:gap-5"
          >
            {sectionNavItems.map((item) => (
              <Link
                className="group relative whitespace-nowrap transition hover:text-[#4f4235]"
                href={item.href}
                key={item.label}
              >
                {item.label}
                <span className="absolute inset-x-0 -bottom-1 h-px scale-x-0 bg-[#9d7b3f] transition group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>
          <div aria-hidden="true" className="hidden min-h-9 sm:block" />
        </div>
      </header>

      <main className="relative scroll-smooth overflow-x-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-4%,rgba(255,255,255,0.96),rgba(244,239,229,0.76)_30%,transparent_58%),radial-gradient(circle_at_12%_10%,rgba(234,215,166,0.28),transparent_28%),radial-gradient(circle_at_90%_18%,rgba(49,72,63,0.13),transparent_30%),linear-gradient(180deg,#f8f4ec_0%,#efe5d4_42%,#eadfc9_66%,#f4efe5_100%)]"
        />

        <section className="relative mx-auto grid min-h-[calc(100svh-5.75rem)] w-full max-w-7xl items-center gap-8 px-5 pb-4 pt-6 sm:px-6 lg:grid-cols-[0.98fr_1.02fr] lg:gap-10 lg:px-8 lg:pb-6 lg:pt-8 xl:gap-14">
          <div
            className={cx(revealClass("hero-copy"), "min-w-0")}
            data-reveal-id="hero-copy"
            data-showroom-reveal
            style={revealStyle(0)}
          >
            <p className="mb-5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9d7b3f]">
              {copy.room}
            </p>
            <h1 className="font-serif text-[clamp(4.5rem,20vw,12.5rem)] leading-[0.74] text-[#3f352b]">
              {copy.heroTitle.map((line) => (
                <span className="block" key={line}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-5 max-w-xl font-serif text-xl leading-8 text-[#5b4a36] sm:text-2xl">
              {copy.subtitle}
            </p>
            <p className="mt-4 max-w-xl text-base leading-8 text-[#766955] sm:text-lg">
              {copy.heroBody}
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
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
            className="relative min-h-[34rem] sm:min-h-[42rem] lg:min-h-[44rem]"
            style={{ transform: `translateY(${parallax * 0.35}px)` }}
          >
            <div
              className={cx(
                revealClass("hero-stage"),
                "relative mx-auto h-[34rem] w-full max-w-[31rem] sm:h-[42rem] sm:max-w-[38rem] lg:h-[44rem] lg:max-w-[42rem]",
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

              {/* fanned deck - depth via stacked offsets */}
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
                <CardFace keyword={copy.deckCards[1].keyword} name={copy.deckCards[1].name} numeral="XVII" />
              </div>
              {/* center hero card - thick, raised */}
              <div className="absolute left-1/2 top-8 w-48 -translate-x-1/2 sm:w-64 lg:w-72">
                <div className="absolute inset-0 translate-x-2 translate-y-5 rounded-[1.35rem] border border-[#caa96a]/28 bg-[#3b2c1a]/18" />
                <div className="absolute inset-0 translate-x-1 translate-y-3 rounded-[1.35rem] border border-[#caa96a]/36 bg-[#ead7a6]/30" />
                <div className="absolute inset-0 translate-y-2 rounded-[1.35rem] bg-[#2c2016]/24 blur-[3px]" />
                <CardFace
                  keyword={copy.deckCards[0].keyword}
                  name={copy.deckCards[0].name}
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
                  {copy.questionSlip}
                </p>
                <p className="mt-3 font-serif text-2xl leading-tight text-[#4f4235]">
                  {copy.waitingQuestion}
                </p>
                <div className="mt-4 h-px bg-gradient-to-r from-[#caa96a]/0 via-[#caa96a]/44 to-[#caa96a]/0" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          <p
            className={cx(
              revealClass("path-kicker"),
              "text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9d7b3f]",
            )}
            data-reveal-id="path-kicker"
            data-showroom-reveal
            style={revealStyle(0)}
          >
            {copy.choosePath}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.paths.map((item, index) => {
              const className = cx(
                revealClass(`path-${item.id}`),
                "group relative flex min-h-[24rem] flex-col justify-between overflow-hidden rounded-[1.8rem] border p-6 shadow-[0_22px_58px_rgba(102,75,33,0.14)] transition duration-[260ms] motion-reduce:transform-none sm:p-7",
                item.disabled
                  ? "cursor-not-allowed opacity-68"
                  : "hover:-translate-y-1.5 hover:scale-[1.015]",
                item.tone === "green" &&
                  "border-[#31483f]/30 bg-[linear-gradient(155deg,#29443b,#172a23)] text-[#f4efe5] hover:shadow-[0_30px_72px_rgba(33,54,47,0.3)]",
                item.tone === "light" &&
                  "border-[#d8b76a]/36 bg-[radial-gradient(circle_at_82%_12%,rgba(255,255,255,0.9),transparent_30%),linear-gradient(170deg,#fffaf0,#f1e4cb)] text-[#3f352b] hover:border-[#b9934f]/62",
                item.tone === "product" &&
                  "border-[#d8b76a]/30 bg-[linear-gradient(170deg,#fbf3e4,#ead8ba)] text-[#3f352b] hover:border-[#b9934f]/55",
              );
              const content = (
                <>
                {/* object visual layer per tone */}
                {item.tone === "light" && (
                  <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-48">
                    <span className="absolute right-4 top-5 w-28 rotate-[10deg] opacity-95 sm:w-32">
                      <CardFace
                        keyword={copy.deckCards[0].keyword}
                        name={copy.deckCards[0].name}
                        numeral="0"
                      />
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
                </>
              );

              return item.disabled ? (
              <div
                className={cx(
                  className,
                  "hover:translate-y-0 hover:scale-100",
                )}
                data-reveal-id={`path-${item.id}`}
                data-showroom-reveal
                key={item.id}
                style={revealStyle(index)}
                aria-disabled="true"
              >
                {content}
              </div>
              ) : (
              <Link
                className={className}
                data-reveal-id={`path-${item.id}`}
                data-showroom-reveal
                href={item.href}
                key={item.id}
                style={revealStyle(index)}
              >
                {content}
              </Link>
              );
            })}
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
          <div
            className={revealClass("question-wall")}
            data-reveal-id="question-wall"
            data-showroom-reveal
            style={revealStyle(0)}
          >
            <h2 className="font-serif text-[clamp(2.6rem,10vw,7rem)] leading-[0.9] text-[#3f352b]">
              {copy.wonderingTitle}
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {copy.chips.map((chip) => (
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
            {copy.questions.map((question, index) => {
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

        <section
          className="relative scroll-mt-24 overflow-hidden bg-[linear-gradient(180deg,#21362f,#1a2b25)] py-18 text-[#f4efe5] sm:py-20"
          id="how-it-works"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(216,183,106,0.16),transparent_34%),radial-gradient(circle_at_88%_82%,rgba(216,183,106,0.1),transparent_36%)]"
          />
          <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
            <p
              className={cx(
                revealClass("unfolds-title"),
                "text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#d8b76a]",
              )}
              data-reveal-id="unfolds-title"
              data-showroom-reveal
              style={revealStyle(0)}
            >
              {copy.unfoldsKicker}
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
              {copy.unfoldsTitle}
            </h2>
            <div className="mt-10 grid gap-x-6 gap-y-8 md:grid-cols-5">
              {copy.unfolds.map(({ step, note }, index) => (
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
          className="relative scroll-mt-24 mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 lg:px-8"
          id="deck"
        >
          <div aria-hidden="true" className="h-0" id="deck-carousel" />
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
                {copy.deckKicker}
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
                {copy.deckTitle.map((line) => (
                  <span className="block" key={line}>
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#766955]">
                {copy.deckDescription}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#d8b76a]/36 bg-[#fffaf0]/78 px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#8d6426]">
                {copy.deckAction}
              </span>
              <span className="rounded-full border border-[#caa96a]/28 bg-[#fffaf0]/70 px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#9b8a73]">
                {String(activeCard + 1).padStart(2, "0")} / {String(localizedDeckCards.length).padStart(2, "0")}
              </span>
              <button
                aria-label={copy.previousCardLabel}
                className="flex min-h-12 items-center justify-center rounded-full border border-[#caa96a]/45 bg-[#fffaf0]/82 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#6f614d] shadow-[0_10px_26px_rgba(102,75,33,0.12)] transition duration-[260ms] hover:-translate-y-1 hover:border-[#9d7b3f] hover:text-[#3f352b] motion-reduce:transform-none"
                onClick={() => setNextCard(-1)}
                type="button"
              >
                {copy.previousCard}
              </button>
              <button
                aria-label={copy.nextCardLabel}
                className="flex min-h-12 items-center justify-center rounded-full border border-[#9d7b3f]/55 bg-[linear-gradient(180deg,#f6e1ae,#c59748)] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#352513] shadow-[0_12px_30px_rgba(148,105,39,0.22)] transition duration-[260ms] hover:-translate-y-1 hover:scale-[1.03] motion-reduce:transform-none"
                onClick={() => setNextCard(1)}
                type="button"
              >
                {copy.nextCard}
              </button>
            </div>
          </div>

          <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-8 pt-4 [scrollbar-width:thin] md:relative md:h-[31rem] md:block md:overflow-hidden md:px-0">
            {localizedDeckCards.map((card, index) => {
              const active = activeCard === index;
              const offset = index - activeCard;
              let layeredOffset = offset;
              const halfDeck = localizedDeckCards.length / 2;

              if (layeredOffset > halfDeck) {
                layeredOffset -= localizedDeckCards.length;
              }

              if (layeredOffset < -halfDeck) {
                layeredOffset += localizedDeckCards.length;
              }

              const distance = Math.abs(layeredOffset);
              const deckX = layeredOffset * 14.5;
              const deckY =
                distance === 0 ? -6 : distance === 1 ? 18 : distance === 2 ? 42 : 60;
              const deckScale =
                distance === 0 ? 1.18 : distance === 1 ? 0.93 : distance === 2 ? 0.8 : 0.68;
              const deckRotate = distance === 0 ? 0 : layeredOffset * 7;
              const deckOpacity =
                distance === 0 ? 1 : distance === 1 ? 0.82 : distance === 2 ? 0.56 : 0.32;
              const deckZ = distance === 0 ? 50 : 40 - distance * 8;
              return (
                <Link
                  className={cx(
                    revealClass(`deck-${card.name}`),
                    "group relative block min-w-[min(18rem,78vw)] shrink-0 snap-center rounded-[1.45rem] border p-3 transition duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none md:absolute md:left-1/2 md:top-0 md:min-w-0 md:w-[15rem] md:snap-none md:origin-top-center md:opacity-[var(--deck-opacity)] md:[transform:translateX(calc(-50%+var(--deck-x)))_translateY(var(--deck-y))_scale(var(--deck-scale))_rotate(var(--deck-rotate))]",
                    active
                      ? "border-[#9d7b3f]/70 bg-[#fffaf0]/94 shadow-[0_34px_76px_rgba(102,75,33,0.24)]"
                      : "border-[#d8b76a]/28 bg-[#fbf3e4]/74 shadow-[0_18px_44px_rgba(102,75,33,0.12)] hover:-translate-y-1.5",
                  )}
                  data-reveal-id={`deck-${card.name}`}
                  data-showroom-reveal
                  href={askOnlineHref}
                  key={card.name}
                  onFocus={() => setActiveCard(index)}
                  onMouseEnter={() => setActiveCard(index)}
                  style={
                    {
                      ...revealStyle(index),
                      "--deck-x": `${deckX}rem`,
                      "--deck-y": `${deckY}px`,
                      "--deck-scale": deckScale,
                      "--deck-rotate": `${deckRotate}deg`,
                      "--deck-opacity": deckOpacity,
                      zIndex: deckZ,
                    } as CSSProperties
                  }
                >
                  <div className="relative">
                    {card.face || active ? (
                      <CardFace
                        keyword={card.keyword}
                        name={card.name}
                        numeral={card.numeral}
                        className="rounded-[1rem]"
                      />
                    ) : (
                      <CardBack className="rounded-[1rem]" />
                    )}
                    {active ? (
                      <div className="absolute inset-x-3 bottom-3 rounded-[0.9rem] border border-[#d8b76a]/26 bg-[#fffaf0]/78 px-3 py-2 shadow-[0_8px_22px_rgba(102,75,33,0.1)] backdrop-blur">
                        <p className="font-serif text-lg leading-tight text-[#4f4235]">
                          {card.name}
                        </p>
                        <p className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#9d7b3f]">
                          {card.keyword}
                        </p>
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-4 flex min-h-12 items-center justify-between gap-2 px-1">
                    <div>
                      <p className="font-serif text-lg leading-tight text-[#4f4235]">
                        {card.name}
                      </p>
                      <p className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#9d7b3f]">
                        {active ? copy.innerGuidance : card.keyword}
                      </p>
                    </div>
                    {active ? (
                      <span className="rounded-full border border-[#d8b76a]/36 bg-[#fffaf0]/82 px-2 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-[#8d6426]">
                        {copy.active}
                      </span>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section
          className="relative scroll-mt-24 mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 lg:px-8"
          id="reading-modes"
        >
          <p
            className={cx(
              revealClass("modes-kicker"),
              "text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9d7b3f]",
            )}
            data-reveal-id="modes-kicker"
            data-showroom-reveal
            style={revealStyle(0)}
          >
            {copy.modesKicker}
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
            {copy.modesNote}
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {copy.modes.map((mode, index) => {
              const isDark = mode.theme === "mirror";
              const cardClassName = cx(
                revealClass(`mode-${index}`),
                "group relative flex min-h-[27rem] flex-col justify-end overflow-hidden rounded-[1.5rem] border p-7 shadow-[0_22px_60px_rgba(102,75,33,0.16)] transition duration-[260ms] motion-reduce:transform-none",
                !mode.disabled && "hover:-translate-y-1.5 hover:scale-[1.015]",
                mode.disabled && "cursor-not-allowed opacity-70 saturate-[0.82]",
                mode.theme === "clarity" && "border-[#d8b76a]/40 bg-[linear-gradient(180deg,#fff7e6,#f0deb4)] text-[#3f352b] xl:translate-y-4",
                mode.theme === "mirror" && "border-[#31483f]/40 bg-[linear-gradient(180deg,#2b3f38,#1b2a24)] text-[#f4efe5]",
                mode.theme === "next" && "border-[#caa96a]/40 bg-[linear-gradient(180deg,#fbf3e4,#e7d6b6)] text-[#3f352b] xl:translate-y-4",
                mode.theme === "product" && "border-[#d8b76a]/32 bg-[linear-gradient(180deg,#fffaf0,#eadfc9)] text-[#3f352b]",
              );
              const cardContent = (
                <>
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
                      <span className="mt-2 text-2xl text-[#9d7b3f]">-&gt;</span>
                    </span>
                  )}
                  {mode.theme === "product" && (
                    <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-8 flex items-center justify-center">
                      <span className="relative h-36 w-28 rounded-[0.75rem] border border-[#caa96a]/42 bg-[#fff7e6]/72 shadow-[0_20px_44px_rgba(102,75,33,0.14)]">
                        <span className="absolute inset-4 rounded-full border border-[#d8b76a]/28" />
                        <span className="absolute left-1/2 top-1/2 h-px w-16 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#9d7b3f]/54 to-transparent" />
                      </span>
                    </span>
                  )}
                  <div className="relative">
                    <div
                      className={cx(
                        "mb-5 flex flex-wrap items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em]",
                        isDark ? "text-[#d8b76a]" : "text-[#9d7b3f]",
                      )}
                    >
                      <span>{copy.cardsLabel}: {mode.cards}</span>
                      <span aria-hidden="true" className={cx("h-1 w-1 rounded-full", isDark ? "bg-[#d8b76a]" : "bg-[#9d7b3f]")} />
                      <span>{copy.statusLabel}: {mode.status}</span>
                    </div>
                    <h2 className="font-serif text-3xl leading-none sm:text-4xl">
                      {mode.title}
                    </h2>
                    <p
                      className={cx(
                        "mt-4 text-sm leading-7",
                        isDark ? "text-[#cdbfa6]" : "text-[#766955]",
                      )}
                    >
                      {mode.body}
                    </p>
                    <span
                      className={cx(
                        "mt-5 inline-block text-[0.62rem] font-semibold uppercase tracking-[0.2em]",
                        isDark ? "text-[#d8b76a]" : "text-[#9d7b3f]",
                      )}
                    >
                      {mode.cta}{mode.disabled ? "" : " ->"}
                    </span>
                  </div>
                </>
              );

              if (mode.disabled) {
                return (
                  <article
                    aria-disabled="true"
                    className={cardClassName}
                    data-reveal-id={`mode-${index}`}
                    data-showroom-reveal
                    key={mode.title}
                    style={revealStyle(index)}
                  >
                    {cardContent}
                  </article>
                );
              }

              return (
                <Link
                  className={cardClassName}
                  data-reveal-id={`mode-${index}`}
                  data-showroom-reveal
                  href={mode.href}
                  key={mode.title}
                  style={revealStyle(index)}
                >
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </section>

        <section
          className="relative scroll-mt-24 mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 lg:px-8"
          id="journal"
        >
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
              {copy.journalTitle.map((line) => (
                <span className="block" key={line}>
                  {line}
                </span>
              ))}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {copy.journalNotes.map((note, index) => (
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
                  {copy.openJournal}
                </Link>
                <Link className="showroom-action-secondary" href={readingsHref}>
                  {copy.viewAll}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative scroll-mt-24 mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 lg:px-8"
          id="physical-deck"
        >
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
                {copy.physicalDeckKicker}
              </p>
              <h2 className="mt-8 font-serif text-5xl leading-none text-[#3f352b]">
                {copy.physicalDeckTitle[0]}
                <br />
                {copy.physicalDeckTitle[1]}
              </h2>
              <Link className="showroom-action-primary mt-8" href={physicalHref}>
                {copy.physical}
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
                {copy.redeemDeckKicker}
              </p>
              <h2 className="mt-8 font-serif text-5xl leading-none">
                {copy.redeemDeckTitle}
              </h2>
              <button
                className="mt-8 inline-flex min-h-12 touch-manipulation items-center justify-center rounded-full border border-[#d8b76a]/56 bg-[#f4efe5] px-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#21362f] shadow-[0_14px_34px_rgba(0,0,0,0.18)] transition duration-[260ms] hover:-translate-y-1.5 hover:scale-[1.015] motion-reduce:transform-none"
                onClick={openAccountMenu}
                type="button"
              >
                {copy.redeemDeckCode}
              </button>
            </div>
          </div>
        </section>

        <section
          className="relative scroll-mt-24 mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 lg:px-8"
          id="faq"
        >
          <h2
            className={cx(
              revealClass("trust-title"),
              "max-w-3xl font-serif text-5xl leading-tight text-[#3f352b] sm:text-6xl",
            )}
            data-reveal-id="trust-title"
            data-showroom-reveal
            style={revealStyle(0)}
          >
            {copy.trustTitle}
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {copy.trustItems.map((item, index) => (
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
                  {copy.trustBody}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#7a6b56]">
            <Link className="transition hover:text-[#9d7b3f]" href={trustHrefs.privacy}>
              {copy.trustLinks.privacy}
            </Link>
            <Link className="transition hover:text-[#9d7b3f]" href={trustHrefs.terms}>
              {copy.trustLinks.terms}
            </Link>
            <Link
              className="transition hover:text-[#9d7b3f]"
              href={trustHrefs.disclaimer}
            >
              {copy.trustLinks.disclaimer}
            </Link>
            <Link className="transition hover:text-[#9d7b3f]" href={trustHrefs.contact}>
              {copy.trustLinks.contact}
            </Link>
          </div>
        </section>

        <section className="relative bg-[#21362f] px-5 py-16 text-center text-[#f4efe5] sm:px-6 lg:px-8">
          <div
            className={cx(revealClass("final-cta"), "mx-auto max-w-4xl")}
            data-reveal-id="final-cta"
            data-showroom-reveal
            style={revealStyle(0)}
          >
            <h2 className="font-serif text-[clamp(3.4rem,12vw,8rem)] leading-[0.85]">
              {copy.finalTitle}
            </h2>
            <div className="mt-8 grid gap-3 sm:flex sm:justify-center">
              <Link className="showroom-final-primary" href={onlineHref}>
                {copy.begin}
              </Link>
              <Link className="showroom-final-secondary" href={physicalHref}>
                {copy.physical}
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
          min-height: 3.15rem;
          touch-action: manipulation;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          padding: 0.9rem 1.35rem;
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
