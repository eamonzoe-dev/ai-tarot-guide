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

      <main className="oracle-home-main relative scroll-smooth overflow-x-hidden">
        <div
          aria-hidden="true"
          className="oracle-home-backdrop pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-4%,rgba(255,255,255,0.96),rgba(244,239,229,0.76)_30%,transparent_58%),radial-gradient(circle_at_12%_10%,rgba(234,215,166,0.18),transparent_28%),radial-gradient(circle_at_90%_18%,rgba(49,72,63,0.08),transparent_30%),linear-gradient(180deg,#f8f4ec_0%,#efe5d4_42%,#eadfc9_66%,#f4efe5_100%)]"
        />

        <section className="oracle-home-center relative mx-auto flex min-h-[calc(100svh-5.75rem)] w-full max-w-5xl items-center px-5 py-8 sm:px-6 lg:px-8">
          <div className="grid w-full gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
            <div
              className={cx(revealClass("hero-copy"), "min-w-0")}
              data-reveal-id="hero-copy"
              data-showroom-reveal
              style={revealStyle(0)}
            >
              <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9d7b3f]">
                {copy.room}
              </p>
              <p className="font-serif text-[clamp(2.15rem,4vw,3.25rem)] leading-tight text-[#3f352b]">
                {copy.subtitle}
              </p>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#766955]">
                {copy.heroBody}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="showroom-action-primary" href={onlineHref}>
                  {copy.begin}
                </Link>
                <Link className="showroom-action-secondary" href={physicalHref}>
                  {copy.physical}
                </Link>
                <Link className="showroom-action-quiet" href={readingsHref}>
                  {copy.journal}
                </Link>
              </div>
            </div>

            <div
              className={cx(
                revealClass("composer-panel"),
                "oracle-home-composer-panel rounded-[1.35rem] border border-[#d8b76a]/30 bg-[#fffaf0]/88 p-5 shadow-[0_20px_52px_rgba(102,75,33,0.1)] sm:p-6",
              )}
              data-reveal-id="composer-panel"
              data-showroom-reveal
              style={revealStyle(1)}
            >
              <form action="/ai-guide/ask" method="get" className="space-y-4">
                <input name="lang" type="hidden" value={lang} />
                <input name="mode" type="hidden" value="online" />
                <input name="spread" type="hidden" value="single" />
                <input name="orientation" type="hidden" value="upright" />
                <label
                  className="block text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[#9d7b3f]"
                  htmlFor="homepage-ask-ora-question"
                >
                  {copy.askOraTitle}
                </label>
                <textarea
                  className="oracle-home-textarea w-full resize-none rounded-[1rem] border border-[#caa96a]/36 bg-white/78 p-4 text-base leading-7 text-[#3f352b] outline-none placeholder:text-[#a9967a] focus:border-[#b9934f]/70 focus:bg-white/94 focus:ring-2 focus:ring-[#d6b36d]/18"
                  id="homepage-ask-ora-question"
                  name="question"
                  placeholder={copy.askOraDescription}
                  rows={3}
                />
                <button className="showroom-action-primary w-full sm:w-auto" type="submit">
                  {copy.askOraButton}
                </button>
              </form>
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
