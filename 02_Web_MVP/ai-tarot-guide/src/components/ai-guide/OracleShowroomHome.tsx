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

type IconProps = { className?: string; style?: CSSProperties };

function OraMarkIcon({ className, style }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.25" style={style} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="13" />
      <line x1="24" x2="24" y1="7" y2="41" />
      <line x1="7" x2="41" y1="24" y2="24" />
      <rect fill="#f4efe5" height="8" stroke="currentColor" transform="rotate(45 24 24)" width="8" x="20" y="20" />
    </svg>
  );
}

function OraPairIcon({ className, style }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.25" style={style} viewBox="0 0 48 48">
      <rect height="30" rx="3" width="20" x="8" y="6" />
      <rect height="30" rx="3" width="20" x="20" y="12" />
    </svg>
  );
}

function OraLinkIcon({ className, style }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.25" style={style} viewBox="0 0 48 48">
      <circle cx="17" cy="24" r="8" />
      <circle cx="31" cy="24" r="8" />
    </svg>
  );
}

function OraPathIcon({ className, style }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.25" style={style} viewBox="0 0 48 48">
      <circle cx="10" cy="14" r="3" />
      <circle cx="24" cy="30" r="3" />
      <circle cx="38" cy="14" r="3" />
      <path d="M12.5 16 21.5 28M26.5 28 35.5 16" />
    </svg>
  );
}

function OraShieldIcon({ className, style }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.25" style={style} viewBox="0 0 48 48">
      <path d="M24 6l14 5v10c0 9-6 16-14 19-8-3-14-10-14-19V11l14-5Z" strokeLinejoin="round" />
    </svg>
  );
}

function OraLeafIcon({ className, style }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.25" style={style} viewBox="0 0 48 48">
      <path d="M12 36c0-14 10-24 24-24 0 14-10 24-24 24Z" strokeLinejoin="round" />
      <path d="M16 32 32 16" />
    </svg>
  );
}

function OraSunIcon({ className, style }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.25" style={style} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="12" />
      <circle cx="24" cy="24" fill="currentColor" r="2" />
      <line x1="24" x2="24" y1="5" y2="11" />
      <line x1="24" x2="24" y1="37" y2="43" />
      <line x1="5" x2="11" y1="24" y2="24" />
      <line x1="37" x2="43" y1="24" y2="24" />
      <line x1="11" x2="15" y1="11" y2="15" />
      <line x1="33" x2="37" y1="33" y2="37" />
      <line x1="37" x2="33" y1="11" y2="15" />
      <line x1="15" x2="11" y1="33" y2="37" />
    </svg>
  );
}

function OraMoonIcon({ className, style }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.25" style={style} viewBox="0 0 48 48">
      <path d="M30 9a16 16 0 1 0 0 30A13 13 0 0 1 30 9Z" strokeLinejoin="round" />
    </svg>
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
}: OracleShowroomHomeProps) {
  const [visible, setVisible] = useState<Set<string>>(() => new Set());
  const [compactHeader, setCompactHeader] = useState(false);
  const [theme, setTheme] = useState<"day" | "night">(() => {
    if (typeof document === "undefined") {
      return "day";
    }
    return document.documentElement.getAttribute("data-theme") === "night" ? "night" : "day";
  });

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
      heroTitle: isZh ? { r1: "向卡牌", r2: "提问" } : { r1: "ASK THE", r2: "CARD" },
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
      askOraTitle: isZh ? "向 Ora 提问" : "Ask Ora",
      askOraDescription: isZh
        ? "写下你现在想问的一句话，Ora 会带你抽一张牌。"
        : "Write the one thing you want to ask. Ora will guide you through a draw.",
      askOraButton: isZh ? "开始这次解读" : "Begin this reading",
      examplesLabel: isZh ? "也可以从这些问题开始" : "Or start from one of these",
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
        : [
            { name: "The Fool", numeral: "0", keyword: "Beginnings", face: true },
            { name: "The Star", numeral: "XVII", keyword: "Hope", face: true },
            { name: "Ace of Cups", numeral: "A", keyword: "Feeling", face: false },
            { name: "Two of Wands", numeral: "II", keyword: "Choice", face: false },
            { name: "The Hermit", numeral: "IX", keyword: "Inner light", face: true },
            { name: "The High Priestess", numeral: "II", keyword: "Intuition", face: false },
          ],
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
        ? [
            {
              title: "以隐私为先",
              description: "你的提问与解读默认只属于你。Ora 不用于训练，也不会公开展示。",
            },
            {
              title: "AI 辅助象征解读",
              description: "抽牌后，Ora 会结合你的问题与牌面，给出一段贴合当下的象征解读。",
            },
            {
              title: "用于反思与娱乐",
              description: "Ora 用于自我观察与放松，不构成医疗、法律、财务或心理建议。",
            },
          ]
        : [
            {
              title: "Private by design",
              description:
                "Your questions and readings are yours by default. Ora is never used for training and never shown publicly.",
            },
            {
              title: "AI-guided symbolism",
              description:
                "After a draw, Ora blends your question with the card to offer symbolism that fits the moment.",
            },
            {
              title: "For reflection and entertainment",
              description:
                "Ora is for self-observation and reflection. It is not medical, legal, financial, or psychological advice.",
            },
          ],
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
    let frame = 0;

    function updateMotion() {
      frame = 0;
      const scrollY = window.scrollY;
      setCompactHeader(scrollY > 42);
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

  function toggleTheme() {
    const next = theme === "night" ? "day" : "night";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("ora-theme", next);
    } catch {
      // localStorage may be unavailable (private mode, disabled storage)
    }
  }

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

  return (
    <div className="min-h-svh text-[#33291f]" style={{ background: "var(--c-bg)" }}>
      <div id="reading-account-panel">
        <ActivationCodePanel lang={lang} hasLangParam={hasLangParam} />
      </div>

      <header
        className={cx(
          "sticky top-0 isolate z-[240] border-b transition duration-300",
          compactHeader
            ? "border-[#d8b76a]/30 shadow-[0_10px_30px_rgba(88,64,31,0.08)] backdrop-blur"
            : "border-transparent backdrop-blur-sm",
        )}
        style={{ background: "var(--c-bg)" }}
      >
        <div className="pointer-events-auto mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-4 sm:px-6 lg:px-8 sm:items-center">
          <Link
            className="inline-flex min-h-9 shrink-0 items-center justify-self-start pt-0 leading-none text-[#4f4235] transition hover:text-[#9d7b3f] sm:min-w-0"
            href={homeHref}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "24px",
            }}
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
          <div className="hidden min-h-9 items-center justify-end gap-3 sm:flex">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d8c9ae] px-3 py-1.5 text-[0.8rem] text-[#7a6b56]">
              <svg
                className="h-[13px] w-[13px]"
                fill="currentColor"
                style={{ color: "var(--c-accent-text)" }}
                viewBox="0 0 48 48"
              >
                <path d="M24 6c1 9 8 16 17 18-9 2-16 9-17 18-1-9-8-16-17-18 9-2 16-9 17-18Z" />
              </svg>
              7,480
            </span>
            <button
              aria-label={isZh ? "切换日间 / 夜间" : "Toggle day / night"}
              className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#d6c9ae] text-[#7a6b56] transition hover:border-[#9d7b3f] hover:text-[#9d7b3f]"
              onClick={toggleTheme}
              type="button"
            >
              {theme === "night" ? (
                <OraMoonIcon className="h-[18px] w-[18px]" />
              ) : (
                <OraSunIcon className="h-[18px] w-[18px]" />
              )}
            </button>
            <span
              className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#d6c9ae] text-sm"
              style={{
                fontFamily: "'Spectral', Georgia, serif",
                background: "var(--c-surface)",
                color: "var(--c-accent-text)",
              }}
            >
              E
            </span>
          </div>
        </div>
      </header>

      <main className="oracle-home-main relative scroll-smooth overflow-x-hidden">
        <div
          aria-hidden="true"
          className="oracle-home-backdrop pointer-events-none absolute inset-0"
        />

        <section className="oracle-home-center relative mx-auto flex min-h-[calc(100svh-5.75rem)] w-full max-w-5xl items-start px-5 pt-[14vh] pb-8 sm:px-6 lg:px-8">
          <div className="grid w-full gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
            <div
              className={cx(revealClass("hero-copy"), "min-w-0")}
              data-reveal-id="hero-copy"
              data-showroom-reveal
              style={revealStyle(0)}
            >
              <p
                className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.24em]"
                style={{ color: "var(--c-accent-text)" }}
              >
                {copy.room}
              </p>
              <h1
                className="mb-6"
                style={{
                  fontFamily: '"Noto Serif SC", serif',
                  fontWeight: 600,
                  fontSize: "clamp(3.2rem, 9.5vw, 7rem)",
                  lineHeight: 0.92,
                  letterSpacing: "-0.01em",
                  color: "var(--c-text)",
                }}
              >
                <span className="block">{copy.heroTitle.r1}</span>
                <span className="-mt-[0.06em] block pl-[0.9em]">{copy.heroTitle.r2}</span>
              </h1>
              <p
                className="font-serif text-[clamp(1.1rem,2.4vw,1.5rem)]"
                style={{ color: "var(--c-text)" }}
              >
                {copy.subtitle}
              </p>
              <p className="mt-3 max-w-lg text-sm leading-7 text-[#766955]">
                {copy.heroBody}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link className="showroom-action-primary" href={onlineHref}>
                  {copy.begin}
                </Link>
                <Link className="showroom-action-secondary" href={physicalHref}>
                  {copy.physical}
                </Link>
                <Link
                  className="inline-flex items-center gap-2 px-1 py-2 text-sm font-medium tracking-[0.04em] text-[#8d6426] transition hover:text-[#9d7b3f]"
                  href="#deck"
                >
                  {copy.explore}
                  <svg
                    className="h-[15px] w-[15px]"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </div>

            <div
              aria-hidden="true"
              className={cx(revealClass("hero-deck"), "relative mx-auto h-[clamp(360px,42vw,460px)] w-full max-w-md lg:mx-0")}
              data-reveal-id="hero-deck"
              data-showroom-reveal
              style={revealStyle(1)}
            >
              <div
                className="absolute flex aspect-[0.66] w-[clamp(150px,17vw,196px)] flex-col items-center rounded-2xl border border-[#caa96a]/55 bg-[#fbf3df] p-4 shadow-[0_24px_50px_-28px_rgba(20,16,8,0.5)]"
                style={{ left: "2%", top: "14%", transform: "rotate(-13deg)" }}
              >
                <span className="font-serif text-sm tracking-[0.1em]" style={{ color: "var(--c-accent-text)" }}>
                  XVII
                </span>
                <svg
                  className="m-auto h-[46%] w-[46%] text-[#c9a24a]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M24 6c1.6 8.5 9 15.9 17.5 18C33 26 25.6 33.5 24 42c-1.6-8.5-9-15.9-17.5-18C15 22 22.4 14.5 24 6Z"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-center font-serif text-[13px] text-[#766955]">
                  {isZh ? "星星" : "The Star"}
                  <small className="mt-0.5 block font-sans text-[10px] text-[#8a8070]">
                    {isZh ? "希望" : "Hope"}
                  </small>
                </span>
              </div>

              <div
                className="absolute flex aspect-[0.66] w-[clamp(150px,17vw,196px)] flex-col items-center rounded-2xl border border-[#3a3d33] bg-[#23261f] p-4 shadow-[0_24px_50px_-28px_rgba(20,16,8,0.5)]"
                style={{ right: "6%", top: "6%", transform: "rotate(11deg)" }}
              >
                <span className="font-serif text-sm tracking-[0.1em] text-[#bdb6a3]">IX</span>
                <svg
                  className="m-auto h-[46%] w-[46%] text-[#7c6a3a] opacity-70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  viewBox="0 0 48 48"
                >
                  <path d="M30 9a16 16 0 1 0 0 30A13 13 0 0 1 30 9Z" strokeLinejoin="round" />
                </svg>
                <span className="text-center font-serif text-[13px] text-[#bdb6a3]">
                  {isZh ? "隐者" : "The Hermit"}
                  <small className="mt-0.5 block font-sans text-[10px] text-[#8a8070]">
                    {isZh ? "内在之光" : "Inner light"}
                  </small>
                </span>
              </div>

              <div
                className="absolute z-[3] flex aspect-[0.66] w-[clamp(150px,17vw,196px)] flex-col items-center rounded-2xl border border-[#caa96a]/55 bg-[#fbf3df] p-4 shadow-[0_24px_50px_-28px_rgba(20,16,8,0.5)] transition-transform duration-300 hover:-translate-y-2"
                style={{ left: "50%", top: "0%", transform: "translateX(-50%) rotate(-1deg)" }}
              >
                <span className="font-serif text-sm tracking-[0.1em]" style={{ color: "var(--c-accent-text)" }}>
                  0
                </span>
                <svg
                  className="m-auto h-[46%] w-[46%] text-[#c9a24a]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  viewBox="0 0 48 48"
                >
                  <circle cx="24" cy="24" r="13" />
                  <line x1="24" x2="24" y1="7" y2="41" />
                  <line x1="7" x2="41" y1="24" y2="24" />
                </svg>
                <span className="text-center font-serif text-[13px] text-[#766955]">
                  {isZh ? "愚者" : "The Fool"}
                  <small className="mt-0.5 block font-sans text-[10px] text-[#8a8070]">
                    {isZh ? "开始" : "Beginnings"}
                  </small>
                </span>
              </div>

              <div
                className="absolute right-0 bottom-[-4%] z-[4] w-[clamp(220px,26vw,290px)] rounded-2xl border border-[#d8b76a]/40 bg-[#fffaf0] p-5 shadow-[0_20px_40px_-26px_rgba(20,16,8,0.5)]"
                style={{ transform: "rotate(2deg)" }}
              >
                <span
                  className="absolute -top-[9px] left-6 h-[18px] w-[54px] border border-[#d8b76a]/40 bg-[#f0e7d0]/90"
                  style={{ transform: "rotate(-4deg)" }}
                />
                <p
                  className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em]"
                  style={{ color: "var(--c-accent-text)" }}
                >
                  {copy.questionSlip}
                </p>
                <p className="font-serif text-[1.05rem] leading-snug text-[#3f352b]">
                  {copy.waitingQuestion}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RULE DIVIDER */}
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-2 sm:px-6 lg:px-8">
          <span className="h-px flex-1 bg-[#e2d7c2]" />
          <OraMarkIcon className="h-6 w-6" style={{ color: "var(--c-accent-text)" }} />
          <span className="h-px flex-1 bg-[#e2d7c2]" />
        </div>

        {/* SPREADS GRID */}
        <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8" id="reading-modes">
          <div className="mb-10 max-w-xl">
            <p
              className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em]"
              style={{ color: "var(--c-accent-text)" }}
            >
              {copy.choosePath}
            </p>
            <h2 className="font-serif text-[clamp(1.5rem,3vw,1.75rem)] text-[#3f352b]">{copy.wonderingTitle}</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {copy.paths.map((path) => {
              const isGreen = path.tone === "green";
              const Icon =
                path.id === "three-card"
                  ? OraPairIcon
                  : path.id === "relationship"
                    ? OraLinkIcon
                    : path.id === "career"
                      ? OraPathIcon
                      : OraMarkIcon;
              const cardEl = (
                <div
                  className={cx(
                    "flex min-h-[230px] flex-col rounded-[18px] border p-6 transition hover:-translate-y-1",
                    isGreen ? "border-[#283a2e]" : "border-[#d8c9ae] hover:border-[#b58a48]",
                    path.disabled && "opacity-45",
                  )}
                  style={{ background: isGreen ? "var(--c-green)" : "var(--c-surface)" }}
                >
                  <Icon className="mb-auto h-10 w-10" style={{ color: "var(--c-accent-text)" }} />
                  <p
                    className="mb-2 text-[11px] uppercase tracking-[0.14em]"
                    style={{ color: "var(--c-accent-text)" }}
                  >
                    {path.disabled ? (isZh ? "即将开放" : "Coming Soon") : isZh ? "可用" : "Available"}
                  </p>
                  <p
                    className="mb-1.5 font-serif text-[1.4rem]"
                    style={{ color: isGreen ? "var(--c-ritual-text)" : "var(--c-text)" }}
                  >
                    {path.title}
                  </p>
                  <p className={cx("text-sm leading-relaxed", isGreen ? "text-[#c4cdbe]" : "text-[#766955]")}>
                    {path.body}
                  </p>
                </div>
              );
              return path.disabled || !path.href ? (
                <div key={path.id}>{cardEl}</div>
              ) : (
                <Link className="block" href={path.href} key={path.id}>
                  {cardEl}
                </Link>
              );
            })}
          </div>

          {/* ASK ORA BOX */}
          <div className="mx-auto mt-12 max-w-2xl">
            <div className="rounded-[18px] border border-[#d8c9ae] p-8" style={{ background: "var(--c-surface)" }}>
              <p
                className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.2em]"
                style={{ color: "var(--c-accent-text)" }}
              >
                {copy.askOraTitle}
              </p>
              <p className="mb-5 text-sm text-[#766955]">{copy.askOraDescription}</p>
              <div className="mb-6 flex flex-wrap gap-2">
                {copy.chips.map((chip) => (
                  <span
                    className="cursor-pointer rounded-full border border-[#d6c9ae] px-4 py-1.5 text-[0.8rem] text-[#766955] transition hover:border-[#9d7b3f] hover:text-[#9d7b3f]"
                    key={chip}
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <form action="/ai-guide/ask" className="space-y-5" method="get">
                <input name="lang" type="hidden" value={lang} />
                <input name="mode" type="hidden" value="online" />
                <input name="spread" type="hidden" value="single" />
                <input name="orientation" type="hidden" value="upright" />
                <textarea
                  className="w-full resize-y rounded-[12px] border border-[#d6c9ae] p-4 text-base leading-7 text-[#3f352b] outline-none placeholder:text-[#8a8070] focus:border-[#9d7b3f]"
                  name="question"
                  placeholder={isZh ? "写下此刻想问的一句话…" : "Write the one thing you want to ask…"}
                  rows={3}
                  style={{ background: "var(--c-surface-well)" }}
                />
                <button className="showroom-action-primary" type="submit">
                  {copy.askOraButton}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* PROCESS STEPS */}
        <section
          className="relative px-5 py-16 text-[#e9e1ce] sm:px-6 lg:px-8"
          id="how-it-works"
          style={{ background: "var(--c-green)" }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-xl">
              <p
                className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em]"
                style={{ color: "var(--c-accent-text)" }}
              >
                {copy.unfoldsKicker}
              </p>
              <h2
                className="font-serif text-[clamp(1.5rem,3vw,1.75rem)]"
                style={{ color: "var(--c-ritual-text)" }}
              >
                {copy.unfoldsTitle}
              </h2>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/15 pt-8 sm:grid-cols-5">
              {copy.unfolds.map((item, index) => (
                <div key={item.step}>
                  <div
                    className="mb-3 font-serif text-[2.4rem] leading-none"
                    style={{ color: "var(--c-accent-text)" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h4 className="mb-2 font-serif text-[1.15rem]" style={{ color: "var(--c-ritual-text)" }}>
                    {item.step}
                  </h4>
                  <p className="text-sm leading-relaxed text-[#bcc4b3]">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RULE DIVIDER */}
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-2 sm:px-6 lg:px-8">
          <span className="h-px flex-1 bg-[#e2d7c2]" />
          <OraMarkIcon className="h-6 w-6" style={{ color: "var(--c-accent-text)" }} />
          <span className="h-px flex-1 bg-[#e2d7c2]" />
        </div>

        {/* DECK BROWSE */}
        <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8" id="deck">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <p
                className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.24em]"
                style={{ color: "var(--c-accent-text)" }}
              >
                {copy.deckKicker}
              </p>
              <h2 className="mb-5 font-serif text-[clamp(1.5rem,3vw,1.75rem)] text-[#3f352b]">
                {copy.deckTitle.map((line) => (
                  <span className="block" key={line}>
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mb-8 max-w-md text-base leading-7 text-[#766955]">{copy.deckDescription}</p>
              <Link className="showroom-action-secondary" href="#deck">
                {copy.explore}
              </Link>
            </div>
            <div aria-hidden="true" className="flex items-center justify-center gap-3">
              {copy.deckCards.slice(0, 4).map((card, index) => {
                const rotations = [
                  "-rotate-[8deg] translate-y-2",
                  "-rotate-3",
                  "rotate-1 scale-[1.06] z-[2]",
                  "rotate-[7deg] translate-y-1.5",
                ];
                return (
                  <div
                    className={cx(
                      "flex aspect-[0.66] w-[clamp(96px,12vw,128px)] flex-col items-center rounded-2xl border p-3 shadow-[0_16px_30px_-22px_rgba(20,16,8,0.5)]",
                      card.face ? "border-[#caa96a]/55 bg-[#fbf3df]" : "border-[#3a3d33] bg-[#23261f]",
                      rotations[index] ?? "",
                    )}
                    key={card.name}
                  >
                    <span
                      className={cx("font-serif text-xs tracking-[0.1em]", !card.face && "text-[#bdb6a3]")}
                      style={card.face ? { color: "var(--c-accent-text)" } : undefined}
                    >
                      {card.numeral}
                    </span>
                    <OraMarkIcon
                      className={cx("m-auto h-[46%] w-[46%]", card.face ? "text-[#c9a24a]" : "text-[#7c6a3a] opacity-70")}
                    />
                    <span className={cx("text-center font-serif text-[11px]", card.face ? "text-[#766955]" : "text-[#bdb6a3]")}>
                      {card.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* READING LOG */}
        <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8" id="journal">
          <div className="mb-10 max-w-xl">
            <p
              className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em]"
              style={{ color: "var(--c-accent-text)" }}
            >
              {copy.modesKicker}
            </p>
            <h2 className="font-serif text-[clamp(1.5rem,3vw,1.75rem)] text-[#3f352b]">{copy.modesNote}</h2>
          </div>
          <div className="mb-6 flex justify-end">
            <Link className="showroom-action-quiet" href={readingsHref}>
              {copy.viewAll}
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {copy.modes.map((mode) => (
              <div
                className={cx("rounded-[18px] border border-[#d8c9ae] p-6", mode.disabled && "opacity-60")}
                key={mode.title}
                style={{ background: "var(--c-surface)" }}
              >
                <p className="mb-2 text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--c-accent-text)" }}>
                  {mode.status}
                </p>
                <p className="mb-2 font-serif text-[1.5rem] text-[#3f352b]">{mode.title}</p>
                <p className="mb-4 text-sm leading-relaxed text-[#766955]">{mode.body}</p>
                <p className="mb-4 text-xs text-[#8a8070]">
                  {copy.cardsLabel}: {mode.cards}
                </p>
                {mode.disabled || !mode.href ? (
                  <span className="showroom-action-quiet pointer-events-none opacity-60">{mode.cta}</span>
                ) : (
                  <Link className="showroom-action-secondary" href={mode.href}>
                    {mode.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* PHYSICAL DECK PANELS */}
        <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8" id="physical-deck">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="rounded-[18px] border border-[#d8c9ae] p-10" style={{ background: "#FAF6EC" }}>
              <p
                className="mb-5 text-[11px] font-medium uppercase tracking-[0.2em]"
                style={{ color: "#7E6224" }}
              >
                {copy.physicalDeckKicker}
              </p>
              <h3
                className="mb-8 font-serif text-[clamp(1.6rem,3vw,2.1rem)] leading-tight"
                style={{ color: "#26221C" }}
              >
                {copy.physicalDeckTitle.map((line) => (
                  <span className="block" key={line}>
                    {line}
                  </span>
                ))}
              </h3>
              <Link className="showroom-action-primary" href={physicalHref}>
                {copy.physical}
              </Link>
            </div>
            <div className="rounded-[18px] bg-[#283a2e] p-10 text-[#f2ecdc]">
              <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#d8b25a]">
                {copy.redeemDeckKicker}
              </p>
              <h3 className="mb-8 font-serif text-[clamp(1.6rem,3vw,2.1rem)] leading-tight">{copy.redeemDeckTitle}</h3>
              <Link
                className="inline-flex min-h-[3.15rem] items-center justify-center rounded-full bg-[#faf6ec] px-6 text-[0.75rem] font-bold uppercase tracking-[0.18em] text-[#283a2e] transition hover:bg-white"
                href={homeHref}
              >
                {copy.redeemDeckCode}
              </Link>
            </div>
          </div>
        </section>

        {/* TRUST STATEMENT */}
        <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8" id="faq">
          <h2 className="mb-4 max-w-[18ch] font-serif text-[clamp(1.8rem,4vw,2.6rem)] leading-snug text-[#3f352b]">
            {copy.trustTitle}
          </h2>
          <p className="mb-10 max-w-xl text-sm leading-7 text-[#766955]">{copy.trustBody}</p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-[18px] border border-[#d8c9ae] p-6" style={{ background: "var(--c-surface)" }}>
              <OraShieldIcon className="mb-4 h-[30px] w-[30px]" style={{ color: "var(--c-accent-text)" }} />
              <h4 className="mb-3 font-serif text-[1.2rem]" style={{ color: "var(--c-text)" }}>
                {copy.trustItems[0].title}
              </h4>
              <p className="text-sm leading-relaxed text-[#766955]">{copy.trustItems[0].description}</p>
            </div>
            <div className="rounded-[18px] border border-[#d8c9ae] p-6" style={{ background: "var(--c-surface)" }}>
              <OraMarkIcon className="mb-4 h-[30px] w-[30px]" style={{ color: "var(--c-accent-text)" }} />
              <h4 className="mb-3 font-serif text-[1.2rem]" style={{ color: "var(--c-text)" }}>
                {copy.trustItems[1].title}
              </h4>
              <p className="text-sm leading-relaxed text-[#766955]">{copy.trustItems[1].description}</p>
            </div>
            <div className="rounded-[18px] border border-[#d8c9ae] p-6" style={{ background: "var(--c-surface)" }}>
              <OraLeafIcon className="mb-4 h-[30px] w-[30px]" style={{ color: "var(--c-accent-text)" }} />
              <h4 className="mb-3 font-serif text-[1.2rem]" style={{ color: "var(--c-text)" }}>
                {copy.trustItems[2].title}
              </h4>
              <p className="text-sm leading-relaxed text-[#766955]">{copy.trustItems[2].description}</p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section
          className="relative px-5 py-20 text-center sm:px-6 lg:px-8"
          style={{ background: "var(--c-green)", color: "var(--c-ritual-text)" }}
        >
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 font-serif text-[clamp(2.4rem,6vw,4.4rem)] text-[#f4eedd]">{copy.finalTitle}</h2>
            <div className="flex flex-wrap justify-center gap-4">
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

      {/* FOOTER */}
      <footer
        className="border-t border-[#e2d7c2] px-5 py-16 sm:px-6 lg:px-8"
        style={{ background: "var(--c-bg)" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-start justify-between gap-8">
            <div>
              <OraMarkIcon className="mb-3 h-[30px] w-[30px]" style={{ color: "var(--c-accent-text)" }} />
              <p
                className="mb-2 text-lg text-[#4f4235]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
              >
                Ora Arcana
              </p>
              <p className="max-w-[30ch] text-sm leading-7 text-[#766955]">{copy.subtitle}</p>
            </div>
            <nav className="flex flex-wrap gap-6 text-sm text-[#766955]">
              <Link className="hover:text-[#9d7b3f]" href="#">
                {copy.trustLinks.privacy}
              </Link>
              <Link className="hover:text-[#9d7b3f]" href="#">
                {copy.trustLinks.terms}
              </Link>
              <Link className="hover:text-[#9d7b3f]" href="#">
                {copy.trustLinks.disclaimer}
              </Link>
              <Link className="hover:text-[#9d7b3f]" href="#">
                {copy.trustLinks.contact}
              </Link>
            </nav>
          </div>
          <p className="border-t border-[#e2d7c2] pt-6 text-xs leading-7 text-[#8a8070]">{copy.trustBody}</p>
        </div>
      </footer>

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
          padding: 0.875rem 1.75rem;
          text-align: center;
          font-size: 0.9375rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease, transform 0.08s ease;
        }
        .showroom-action-primary:active,
        .showroom-final-primary:active {
          transform: translateY(1px);
        }

        /* 主按钮：哑光金色 */
        .showroom-action-primary,
        .showroom-final-primary {
          background: var(--c-accent);
          color: var(--c-on-accent);
          border: 1px solid transparent;
        }
        .showroom-action-primary:hover,
        .showroom-final-primary:hover {
          background: var(--c-accent-hover);
        }

        /* 次要按钮：边框透明背景 */
        .showroom-action-secondary {
          background: transparent;
          color: var(--c-accent);
          border: 1px solid var(--c-accent);
        }
        .showroom-action-secondary:hover {
          background: var(--c-accent-wash);
        }

        /* 静默按钮：纯文字 */
        .showroom-action-quiet {
          background: transparent;
          color: var(--c-accent-text);
          border: 1px solid transparent;
        }
        .showroom-action-quiet:hover {
          color: var(--c-accent);
        }

        /* 深绿区域次要按钮 */
        .showroom-final-secondary {
          background: transparent;
          color: var(--c-ritual-text);
          border: 1px solid rgba(237, 228, 206, 0.4);
        }
        .showroom-final-secondary:hover {
          border-color: rgba(237, 228, 206, 0.85);
        }

        @media (prefers-reduced-motion: reduce) {
          .showroom-action-primary,
          .showroom-action-secondary,
          .showroom-action-quiet,
          .showroom-final-primary,
          .showroom-final-secondary {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
