"use client";

import Link from "next/link";
import { type CSSProperties, useMemo } from "react";

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

type IconProps = { className?: string; style?: CSSProperties };

function OraMarkIcon({ className, style }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.25" style={style} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="13" />
      <line x1="24" x2="24" y1="7" y2="41" />
      <line x1="7" x2="41" y1="24" y2="24" />
      <rect className="ora-mark-core" height="8" stroke="currentColor" transform="rotate(45 24 24)" width="8" x="20" y="20" />
    </svg>
  );
}

function OraStarIcon({ className, style }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.25" style={style} viewBox="0 0 48 48">
      <path d="M24 6c1.6 8.5 9 15.9 17.5 18C33 26 25.6 33.5 24 42c-1.6-8.5-9-15.9-17.5-18C15 22 22.4 14.5 24 6Z" strokeLinejoin="round" />
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

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

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
  const isZh = lang === "zh";

  const copy = useMemo(
    () => ({
      room: isZh ? "Ora Arcana · 阅读室" : "Ora Arcana · Reading Room",
      sectionNavigationLabel: isZh ? "页面分区导航" : "Section navigation",
      nav: isZh
        ? [
            ["如何开始", "#reading-modes"],
            ["卡组", "#deck"],
            ["解读日志", "#journal"],
            ["实体卡组", "#physical"],
            ["说明", "#trust"],
          ]
        : [
            ["Start", "#reading-modes"],
            ["Deck", "#deck"],
            ["Journal", "#journal"],
            ["Physical Deck", "#physical"],
            ["Trust", "#trust"],
          ],
      heroTitle: isZh ? { r1: "向卡牌", r2: "提问" } : { r1: "ASK THE", r2: "CARD" },
      subtitle: isZh ? "为现代问题准备的一间安静阅读室。" : "A quiet reading room for modern questions.",
      heroBody: isZh
        ? "在阅读室中选择路径，让一张正位牌安放此刻的问题。"
        : "Move through the room, choose your path, and let one upright card hold the question.",
      begin: isZh ? "开始解读" : "Begin a Reading",
      physical: isZh ? "使用实体卡组" : "Use Physical Deck",
      explore: isZh ? "浏览卡牌" : "Explore the Cards",
      questionSlip: isZh ? "问题纸条" : "Question slip",
      waitingQuestion: isZh ? "此刻等待被问出的是什么？" : "What is waiting to be asked?",
      choosePath: isZh ? "选择你的解读" : "Choose Your Reading",
      wonderingTitle: isZh ? "你正在想什么？" : "What are you wondering?",
      spreads: isZh
        ? [
            {
              id: "single",
              title: "单牌解读",
              body: "一个清晰问题的快速提示。",
              meta: "1 张牌 · 可用",
              href: onlineHref,
              icon: OraMarkIcon,
              active: false,
              disabled: false,
            },
            {
              id: "three-card",
              title: "三牌阵",
              body: "围绕处境、挑战与指引展开更深入的解读。",
              meta: "3 张牌 · 可用",
              href: threeCardHref,
              icon: OraPairIcon,
              active: true,
              disabled: false,
            },
            {
              id: "relationship",
              title: "关系解读",
              body: "用于爱、连接与情感清晰度。",
              meta: "3 张牌 · 即将开放",
              href: "",
              icon: OraLinkIcon,
              active: false,
              disabled: true,
            },
            {
              id: "career",
              title: "事业解读",
              body: "用于工作、方向与下一次机会。",
              meta: "3 张牌 · 即将开放",
              href: "",
              icon: OraPathIcon,
              active: false,
              disabled: true,
            },
          ]
        : [
            {
              id: "single",
              title: "Single Card Reading",
              body: "A quick message for one clear question.",
              meta: "1 card · Available",
              href: onlineHref,
              icon: OraMarkIcon,
              active: false,
              disabled: false,
            },
            {
              id: "three-card",
              title: "Three Card Spread",
              body: "A deeper reading for situation, challenge, and guidance.",
              meta: "3 cards · Available",
              href: threeCardHref,
              icon: OraPairIcon,
              active: true,
              disabled: false,
            },
            {
              id: "relationship",
              title: "Relationship Reading",
              body: "For love, connection, and emotional clarity.",
              meta: "3 cards · Coming Soon",
              href: "",
              icon: OraLinkIcon,
              active: false,
              disabled: true,
            },
            {
              id: "career",
              title: "Career Reading",
              body: "For work, direction, and next opportunities.",
              meta: "3 cards · Coming Soon",
              href: "",
              icon: OraPathIcon,
              active: false,
              disabled: true,
            },
          ],
      askOraTitle: isZh ? "向 Ora 提问" : "Ask Ora",
      askOraDescription: isZh
        ? "写下你现在想问的一句话，Ora 会带你抽一张牌。"
        : "Write the one thing you want to ask. Ora will guide you through a draw.",
      askOraButton: isZh ? "开始这次解读" : "Begin this reading",
      chips: isZh ? ["关系", "工作", "自我", "选择", "未来"] : ["Love", "Work", "Self", "Decision", "Future"],
      questionPlaceholder: isZh ? "写下此刻想问的一句话..." : "Write the one thing you want to ask...",
      unfoldsKicker: isZh ? "解读如何展开" : "The Reading Unfolds",
      unfoldsTitle: isZh ? "五个安静动作，一张正位牌。" : "Five quiet movements, one upright card.",
      unfolds: isZh
        ? [
            ["安顿", "抵达这里，让问题周围的杂音慢慢变轻。"],
            ["提问", "把真正的问题放进一句清楚的话里。"],
            ["抽牌", "为此刻抽取一张正位牌。"],
            ["揭示", "让卡牌与它的象征逐渐显现。"],
            ["回看", "把解读当作镜子，再带走一个诚实的下一步。"],
          ]
        : [
            ["Settle", "Arrive and let the noise around the question soften."],
            ["Ask", "Put the real question into a single clear line."],
            ["Draw", "One upright card is drawn for this moment."],
            ["Reveal", "The card and its symbolism come into view."],
            ["Reflect", "Read it as a mirror, then carry one honest step."],
          ],
      deckKicker: isZh ? "卡组" : "The Deck",
      deckTitle: isZh ? "轻触浏览整副卡组。" : "Drag through the deck.",
      deckDescription: isZh
        ? "拖动卡组，或用按钮一步步翻看。每张牌都带着它的正位含义与象征。"
        : "Drag across the deck or step through it with the controls. Each card carries its upright meaning and symbol.",
      deckCards: isZh
        ? [
            ["0", "愚者", "开始", true],
            ["XVII", "星星", "希望", true],
            ["A", "圣杯王牌", "感受", true],
            ["IX", "隐者", "内在之光", false],
          ]
        : [
            ["0", "The Fool", "Beginnings", true],
            ["XVII", "The Star", "Hope", true],
            ["A", "Ace of Cups", "Feeling", true],
            ["IX", "The Hermit", "Inner light", false],
          ],
      journalKicker: isZh ? "解读日志" : "Reading Journal",
      journalTitle: isZh ? "你的解读，留成一段可回看的日志。" : "Your readings become a journal you can return to.",
      journalNotes: isZh
        ? [
            ["安静的模式", "星星", "当问题不再急着取胜，一个更柔和的答案浮现出来。"],
            ["选择的线索", "权杖二", "下一步先请求边界，然后才请求速度。"],
            ["镜中札记", "隐者", "这次解读把注意力带回那个仍然可以选择的地方。"],
            ["释放标记", "圣杯王牌", "卡牌把感受命名为信息，而不是干扰。"],
          ]
        : [
            ["Quiet Pattern", "The Star", "A softer answer appeared after the question stopped trying to win."],
            ["Decision Thread", "Two of Wands", "The next step asked for a boundary before it asked for speed."],
            ["Mirror Note", "The Hermit", "The reading returned attention to the one thing that could be chosen."],
            ["Release Mark", "Ace of Cups", "The card named feeling as information, not interruption."],
          ],
      openJournal: isZh ? "打开解读日志" : "Open Journal",
      viewAll: isZh ? "查看全部" : "View All",
      physicalDeckKicker: isZh ? "实体卡组" : "Physical Deck",
      physicalDeckTitle: isZh ? "为手心而作。\n为感受而作。" : "Made to be held.\nMade to be felt.",
      redeemDeckKicker: isZh ? "兑换你的卡组" : "Redeem Your Deck",
      redeemDeckTitle: isZh ? "解锁实体卡组的线上陪伴体验。" : "Unlock your deck's companion experience.",
      redeemDeckCode: isZh ? "兑换卡组码" : "Redeem Deck Code",
      trustTitle: isZh ? "这是一件反思工具，不是一台预言机器。" : "A reflective tool, not a prediction machine.",
      trustBody: isZh
        ? "Ora 支持象征性的自我反思与有结构的注意力整理。它不是医疗、法律、财务或心理建议。"
        : "Ora supports symbolic reflection and structured attention. It is not medical, legal, financial, or psychological advice.",
      trustItems: isZh
        ? [
            ["以隐私为先", "你的提问与解读默认只属于你。Ora 不用于训练，也不会公开展示。"],
            ["AI 辅助象征解读", "抽牌后，Ora 会结合你的问题与牌面，给出一段贴合当下的象征解读。"],
            ["用于反思与娱乐", "Ora 用于自我观察与放松，不构成医疗、法律、财务或心理建议。"],
          ]
        : [
            ["Private by design", "Your questions and readings are yours by default. Ora is never used for training and never shown publicly."],
            ["AI-guided symbolism", "After a draw, Ora blends your question with the card to offer symbolism that fits the moment."],
            ["For reflection and entertainment", "Ora is for self-observation and reflection. It is not medical, legal, financial, or psychological advice."],
          ],
      finalTitle: isZh ? "你的问题正在等待。" : "Your question is waiting.",
      footerLinks: isZh
        ? [
            ["隐私", "/privacy"],
            ["条款", "/terms"],
            ["免责声明", "/disclaimer"],
            ["联系", "/contact"],
          ]
        : [
            ["Privacy", "/privacy"],
            ["Terms", "/terms"],
            ["Disclaimer", "/disclaimer"],
            ["Contact", "/contact"],
          ],
    }),
    [isZh, onlineHref, threeCardHref],
  );

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") === "night" ? "night" : "day";
    const next = currentTheme === "night" ? "day" : "night";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("ora-theme", next);
    } catch {
      // Storage can be unavailable in restricted browsing modes.
    }
  }

  return (
    <div className="ora-home">
      <div id="reading-account-panel">
        <ActivationCodePanel lang={lang} hasLangParam={hasLangParam} />
      </div>

      <header className="ora-nav">
        <Link className="ora-brand" href={homeHref}>
          Ora Arcana
        </Link>
        <nav aria-label={copy.sectionNavigationLabel} className="ora-nav-links">
          {copy.nav.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <button aria-label={isZh ? "切换日间 / 夜间" : "Toggle day / nocturne"} className="ora-theme-toggle" onClick={toggleTheme} type="button">
          <OraSunIcon className="ora-theme-sun" />
          <OraMoonIcon className="ora-theme-moon" />
        </button>
      </header>

      <main className="ora-home-main">
        <span aria-hidden="true" className="ora-starfield" />

        <section className="ora-hero" id="start">
          <span aria-hidden="true" className="ora-hero-halo" />
          <div className="ora-wrap ora-hero-grid">
            <div className="ora-hero-copy">
              <p className="ora-eyebrow ora-hero-eyebrow">{copy.room}</p>
              <h1 className="ora-hero-title">
                <span>{copy.heroTitle.r1}</span>
                <span>{copy.heroTitle.r2}</span>
              </h1>
              <p className="ora-hero-sub">{copy.subtitle}</p>
              <p className="ora-hero-note">{copy.heroBody}</p>
              <div className="ora-actions">
                <Link className="ora-btn ora-btn-primary" href={onlineHref}>
                  {copy.begin}
                </Link>
                <Link className="ora-btn ora-btn-ghost" href={physicalHref}>
                  {copy.physical}
                </Link>
                <Link className="ora-btn-text" href="#deck">
                  {copy.explore}
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            <div aria-hidden="true" className="ora-deck-cluster">
              <div className="ora-tcard ora-tcard-one">
                <span className="ora-card-num">XVII</span>
                <OraStarIcon className="ora-card-sigil" />
                <span className="ora-card-name">{isZh ? "星星" : "The Star"}<small>{isZh ? "希望" : "Hope"}</small></span>
              </div>
              <div className="ora-tcard ora-tcard-dark ora-tcard-two">
                <span className="ora-card-num">IX</span>
                <OraMoonIcon className="ora-card-sigil" />
                <span className="ora-card-name">{isZh ? "隐者" : "The Hermit"}<small>{isZh ? "内在之光" : "Inner light"}</small></span>
              </div>
              <div className="ora-tcard ora-tcard-three">
                <span className="ora-card-num">0</span>
                <OraMarkIcon className="ora-card-sigil" />
                <span className="ora-card-name">{isZh ? "愚者" : "The Fool"}<small>{isZh ? "开始" : "Beginnings"}</small></span>
              </div>
              <div className="ora-question-slip">
                <span className="ora-slip-tape" />
                <p>{copy.questionSlip}</p>
                <strong>{copy.waitingQuestion}</strong>
              </div>
            </div>
          </div>
        </section>

        <SigilRule />

        <section className="ora-section ora-section-spreads" id="reading-modes">
          <div className="ora-wrap">
            <div className="ora-section-head">
              <p className="ora-eyebrow">{copy.choosePath}</p>
              <h2>{copy.wonderingTitle}</h2>
            </div>
            <div className="ora-spreads">
              {copy.spreads.map((spread) => {
                const Icon = spread.icon;
                const card = (
                  <article className={cx("ora-spread", spread.active && "is-active", spread.disabled && "is-soon")}>
                    <Icon className="ora-spread-icon" />
                    <span className="ora-spread-meta">{spread.meta}</span>
                    <h3>{spread.title}</h3>
                    <p>{spread.body}</p>
                  </article>
                );

                return spread.disabled || !spread.href ? (
                  <div aria-disabled="true" key={spread.id}>
                    {card}
                  </div>
                ) : (
                  <Link className="ora-spread-link" href={spread.href} key={spread.id}>
                    {card}
                  </Link>
                );
              })}
            </div>

            <div className="ora-askbox" id="ask-ora">
              <p className="ora-ask-label">{copy.askOraTitle}</p>
              <p>{copy.askOraDescription}</p>
              <div className="ora-chips">
                {copy.chips.map((chip) => (
                  <span key={chip}>{chip}</span>
                ))}
              </div>
              <form action="/ai-guide/ask" method="get">
                <input name="lang" type="hidden" value={lang} />
                <input name="mode" type="hidden" value="online" />
                <input name="spread" type="hidden" value="single" />
                <input name="orientation" type="hidden" value="upright" />
                <textarea name="question" placeholder={copy.questionPlaceholder} rows={3} />
                <button className="ora-btn ora-btn-primary" type="submit">
                  {copy.askOraButton}
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="ora-section ora-section-ink" id="how-it-works">
          <div className="ora-wrap">
            <div className="ora-section-head">
              <p className="ora-eyebrow">{copy.unfoldsKicker}</p>
              <h2>{copy.unfoldsTitle}</h2>
            </div>
            <div className="ora-steps">
              {copy.unfolds.map(([step, note], index) => (
                <article className="ora-step" key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step}</h3>
                  <p>{note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ora-section ora-section-deck" id="deck">
          <div className="ora-wrap ora-browse">
            <div>
              <p className="ora-eyebrow">{copy.deckKicker}</p>
              <h2>{copy.deckTitle}</h2>
              <p className="ora-lead">{copy.deckDescription}</p>
              <Link className="ora-btn ora-btn-ghost" href="#deck">
                {copy.explore}
              </Link>
            </div>
            <div aria-hidden="true" className="ora-browse-strip">
              {copy.deckCards.map(([num, name, keyword, isFace], index) => (
                <div className={cx("ora-tcard", !isFace && "ora-tcard-dark", `ora-browse-card-${index}`)} key={String(name)}>
                  <span className="ora-card-num">{num}</span>
                  {index === 1 ? <OraStarIcon className="ora-card-sigil" /> : index === 3 ? <OraMoonIcon className="ora-card-sigil" /> : <OraMarkIcon className="ora-card-sigil" />}
                  <span className="ora-card-name">{name}<small>{keyword}</small></span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SigilRule />

        <section className="ora-section" id="journal">
          <div className="ora-wrap">
            <div className="ora-section-head">
              <p className="ora-eyebrow">{copy.journalKicker}</p>
              <h2>{copy.journalTitle}</h2>
            </div>
            <div className="ora-modes">
              {copy.journalNotes.map(([label, card, note]) => (
                <article className="ora-mode" key={label}>
                  <span>{label}</span>
                  <h3>{card}</h3>
                  <p>{note}</p>
                </article>
              ))}
            </div>
            <div className="ora-actions ora-journal-actions">
              <Link className="ora-btn ora-btn-primary" href={readingsHref}>
                {copy.openJournal}
              </Link>
              <Link className="ora-btn ora-btn-surface" href={readingsHref}>
                {copy.viewAll}
              </Link>
            </div>
          </div>
        </section>

        <section className="ora-section ora-section-physical" id="physical">
          <div className="ora-wrap ora-physical">
            <article className="ora-panel ora-panel-paper">
              <p>{copy.physicalDeckKicker}</p>
              <h2>{copy.physicalDeckTitle.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
              <Link className="ora-btn ora-btn-primary" href={physicalHref}>
                {copy.physical}
              </Link>
            </article>
            <article className="ora-panel ora-panel-ink">
              <p>{copy.redeemDeckKicker}</p>
              <h2>{copy.redeemDeckTitle}</h2>
              <Link className="ora-btn ora-btn-on-ink" href={homeHref}>
                {copy.redeemDeckCode}
              </Link>
            </article>
          </div>
        </section>

        <section className="ora-section" id="trust">
          <div className="ora-wrap">
            <h2 className="ora-statement">{copy.trustTitle}</h2>
            <div className="ora-features">
              {copy.trustItems.map(([title, body], index) => {
                const Icon = index === 0 ? OraShieldIcon : index === 1 ? OraMarkIcon : OraLeafIcon;
                return (
                  <article className="ora-feature" key={title}>
                    <Icon className="ora-feature-icon" />
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="ora-cta">
          <div className="ora-wrap">
            <h2>{copy.finalTitle}</h2>
            <div className="ora-actions ora-cta-actions">
              <Link className="ora-btn ora-btn-primary" href={onlineHref}>
                {copy.begin}
              </Link>
              <Link className="ora-btn ora-btn-ghost-on-ink" href={physicalHref}>
                {copy.physical}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="ora-footer">
        <div className="ora-wrap">
          <div className="ora-footer-top">
            <div>
              <OraMarkIcon className="ora-footer-mark" />
              <p className="ora-footer-brand">Ora Arcana</p>
              <p className="ora-footer-tag">{copy.subtitle}</p>
            </div>
            <nav className="ora-footer-links">
              {copy.footerLinks.map(([label, href]) => (
                <Link href={href} key={href}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <p className="ora-footer-legal">{copy.trustBody}</p>
        </div>
      </footer>

      <style jsx global>{`
        .ora-home {
          --ora-section-y: clamp(4rem, 9vw, 7rem);
          --ora-container: 1120px;
          --ora-measure: 42rem;
          --ora-gutter: clamp(20px, 5vw, 64px);
          --ora-radius: 18px;
          min-height: 100svh;
          background: var(--c-bg);
          color: var(--c-text);
          font-family: "Noto Sans SC", Arial, Helvetica, sans-serif;
          font-weight: 300;
          line-height: 1.75;
        }

        .ora-home a {
          color: inherit;
          text-decoration: none;
        }

        .ora-mark-core {
          fill: var(--c-bg);
        }

        .ora-wrap {
          max-width: var(--ora-container);
          margin: 0 auto;
          padding: 0 var(--ora-gutter);
        }

        .ora-eyebrow {
          color: var(--c-accent-text);
          font-size: 0.8125rem;
          font-weight: 500;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .ora-nav {
          position: sticky;
          top: 0;
          z-index: 240;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 18px var(--ora-gutter);
          border-bottom: 1px solid var(--c-border);
          background: color-mix(in srgb, var(--c-bg) 86%, transparent);
          backdrop-filter: saturate(120%) blur(10px);
        }

        .ora-brand {
          color: var(--c-text);
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 24px;
          font-style: italic;
          font-weight: 600;
          line-height: 1;
        }

        .ora-nav-links {
          display: flex;
          gap: 1.5rem;
          color: var(--c-text-soft);
          font-size: 0.85rem;
          font-weight: 400;
        }

        .ora-nav-links a:hover,
        .ora-footer-links a:hover {
          color: var(--c-accent);
        }

        .ora-theme-toggle {
          display: inline-flex;
          width: 38px;
          height: 38px;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--c-border);
          border-radius: 999px;
          background: transparent;
          color: var(--c-text-soft);
          cursor: pointer;
        }

        .ora-theme-toggle:hover {
          border-color: var(--c-accent);
          color: var(--c-accent);
        }

        .ora-theme-toggle svg {
          width: 18px;
          height: 18px;
        }

        .ora-home-main {
          position: relative;
          overflow-x: hidden;
          background: var(--c-bg);
        }

        .ora-starfield {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
        }

        [data-theme="night"] .ora-starfield {
          opacity: 1;
          background-image:
            radial-gradient(1px 1px at 12% 22%, rgba(239,233,219,.52), transparent),
            radial-gradient(1px 1px at 28% 64%, rgba(239,233,219,.36), transparent),
            radial-gradient(1.4px 1.4px at 46% 14%, rgba(216,178,90,.62), transparent),
            radial-gradient(1px 1px at 63% 48%, rgba(239,233,219,.42), transparent),
            radial-gradient(1px 1px at 78% 28%, rgba(239,233,219,.34), transparent),
            radial-gradient(1.2px 1.2px at 88% 62%, rgba(216,178,90,.48), transparent),
            radial-gradient(1px 1px at 38% 84%, rgba(239,233,219,.3), transparent);
          background-size: 100% 100%;
        }

        .ora-hero {
          position: relative;
          overflow: hidden;
          padding: clamp(3rem, 7vw, 6rem) 0 clamp(3.5rem, 8vw, 6.5rem);
        }

        .ora-hero-halo {
          position: absolute;
          right: 6%;
          top: 20%;
          width: min(720px, 80vw);
          aspect-ratio: 1;
          border-radius: 50%;
          background: radial-gradient(circle, var(--c-halo), transparent 62%);
          pointer-events: none;
        }

        [data-theme="night"] .ora-hero-halo {
          background: radial-gradient(circle, rgba(216,178,90,.16), rgba(60,85,71,.06) 42%, transparent 66%);
        }

        .ora-hero-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 3rem;
          align-items: center;
        }

        .ora-hero-eyebrow {
          margin-bottom: 1.5rem;
        }

        .ora-hero-title {
          margin: 0 0 1.5rem;
          color: var(--c-text);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(3.2rem, 9.5vw, 7rem);
          font-weight: 600;
          letter-spacing: -0.01em;
          line-height: 0.92;
        }

        .ora-hero-title span {
          display: block;
        }

        .ora-hero-title span + span {
          margin-top: -0.06em;
          padding-left: 0.9em;
        }

        .ora-hero-sub {
          margin: 0 0 0.75rem;
          color: var(--c-text);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(1.1rem, 2.4vw, 1.5rem);
        }

        .ora-hero-note {
          max-width: 32ch;
          margin: 0 0 2rem;
          color: var(--c-text-soft);
          line-height: 1.8;
        }

        .ora-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem;
        }

        .ora-btn {
          display: inline-flex;
          min-height: 3rem;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          border-radius: 999px;
          padding: 0.875rem 2rem;
          cursor: pointer;
          font-size: 0.9375rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease, transform 0.08s ease;
        }

        .ora-btn:active {
          transform: translateY(1px);
        }

        .ora-btn-primary {
          background: var(--c-accent);
          color: var(--c-on-accent);
        }

        .ora-btn-primary:hover {
          background: var(--c-accent-hover);
        }

        .ora-btn-ghost {
          border-color: var(--c-accent);
          background: transparent;
          color: var(--c-accent);
        }

        .ora-btn-ghost:hover {
          background: var(--c-accent-wash);
        }

        [data-theme="night"] .ora-btn-ghost {
          border-color: rgba(239,233,219,.32);
          color: var(--c-text);
        }

        [data-theme="night"] .ora-btn-ghost:hover {
          border-color: rgba(239,233,219,.7);
          background: transparent;
        }

        .ora-btn-surface {
          border-color: var(--c-border);
          background: var(--c-surface);
          color: var(--c-text);
        }

        .ora-btn-surface:hover {
          border-color: var(--c-accent);
          color: var(--c-accent);
        }

        .ora-btn-text {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0;
          color: var(--c-accent-text);
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.04em;
        }

        .ora-btn-text:hover {
          color: var(--c-accent);
        }

        .ora-btn-text svg {
          width: 15px;
          height: 15px;
        }

        .ora-deck-cluster {
          position: relative;
          height: clamp(360px, 42vw, 460px);
        }

        .ora-tcard {
          position: absolute;
          display: flex;
          width: clamp(150px, 17vw, 196px);
          aspect-ratio: 0.66;
          flex-direction: column;
          align-items: center;
          border: 1px solid var(--c-border-strong);
          border-radius: 16px;
          background: var(--card-face);
          box-shadow: 0 24px 50px -28px rgba(20,16,8,.5);
          padding: 18px 14px;
        }

        .ora-tcard-dark {
          border-color: #3a3d33;
          background: var(--card-dark);
        }

        .ora-card-num {
          color: var(--c-accent-text);
          font-family: "Spectral", Georgia, serif;
          font-size: 15px;
          letter-spacing: 0.1em;
        }

        .ora-tcard-dark .ora-card-num,
        .ora-tcard-dark .ora-card-name {
          color: #bdb6a3;
        }

        .ora-card-sigil {
          width: 46%;
          height: 46%;
          margin: auto;
          color: var(--card-line);
          opacity: 0.85;
        }

        .ora-tcard-dark .ora-card-sigil {
          color: #7c6a3a;
          opacity: 0.7;
        }

        .ora-card-name {
          color: var(--c-text-soft);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 13px;
          text-align: center;
        }

        .ora-card-name small {
          display: block;
          margin-top: 2px;
          color: var(--c-text-dim);
          font-family: "Noto Sans SC", Arial, sans-serif;
          font-size: 10px;
        }

        .ora-tcard-one {
          left: 2%;
          top: 14%;
          transform: rotate(-13deg);
        }

        .ora-tcard-two {
          right: 6%;
          top: 6%;
          transform: rotate(11deg);
        }

        .ora-tcard-three {
          left: 50%;
          top: 0;
          z-index: 3;
          transform: translateX(-50%) rotate(-1deg);
        }

        .ora-question-slip {
          position: absolute;
          right: 0;
          bottom: -4%;
          z-index: 4;
          width: clamp(220px, 26vw, 290px);
          border: 1px solid var(--c-border);
          border-radius: 14px;
          background: var(--c-surface);
          box-shadow: 0 20px 40px -26px rgba(20,16,8,.5);
          padding: 18px 20px;
          transform: rotate(2deg);
        }

        .ora-slip-tape {
          position: absolute;
          left: 24px;
          top: -9px;
          width: 54px;
          height: 18px;
          border: 1px solid var(--c-border);
          background: var(--c-accent-wash);
          opacity: 0.9;
          transform: rotate(-4deg);
        }

        .ora-question-slip p {
          margin: 0 0 8px;
          color: var(--c-accent-text);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .ora-question-slip strong {
          color: var(--c-text);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 1.05rem;
          font-weight: 400;
          line-height: 1.5;
        }

        .ora-rule {
          display: flex;
          max-width: var(--ora-container);
          align-items: center;
          gap: 1.5rem;
          margin: 0 auto;
          padding: 0 var(--ora-gutter);
          color: var(--c-border-strong);
        }

        .ora-rule::before,
        .ora-rule::after {
          content: "";
          height: 1px;
          flex: 1;
          background: var(--c-border);
        }

        .ora-rule svg {
          width: 24px;
          height: 24px;
          color: var(--c-accent);
        }

        [data-theme="night"] .ora-rule svg,
        [data-theme="night"] .ora-footer-mark {
          filter: drop-shadow(0 0 6px rgba(216,178,90,.35));
        }

        .ora-section {
          position: relative;
          padding: var(--ora-section-y) 0;
        }

        .ora-section-spreads,
        .ora-section-deck,
        .ora-section-physical {
          padding-bottom: clamp(3.25rem, 6.5vw, 5rem);
        }

        .ora-section-head {
          max-width: 48ch;
          margin-bottom: 3rem;
        }

        .ora-section-head .ora-eyebrow {
          margin-bottom: 1rem;
        }

        .ora-section-head h2,
        .ora-browse h2 {
          margin: 0;
          color: var(--c-text);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(1.5rem, 3vw, 1.75rem);
          font-weight: 500;
          line-height: 1.3;
        }

        .ora-spreads {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.25rem;
        }

        .ora-spread {
          display: flex;
          min-height: 230px;
          flex-direction: column;
          border: 1px solid var(--c-border);
          border-radius: var(--ora-radius);
          background: var(--c-surface);
          padding: 1.5rem;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .ora-spread-link:hover .ora-spread {
          border-color: var(--c-border-strong);
          transform: translateY(-3px);
        }

        .ora-spread-icon {
          width: 40px;
          height: 40px;
          margin-bottom: auto;
          color: var(--c-accent);
        }

        .ora-spread-meta {
          margin-bottom: 8px;
          color: var(--c-accent-text);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .ora-spread h3 {
          margin: 0 0 6px;
          color: var(--c-text);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 1.4rem;
          font-weight: 500;
        }

        .ora-spread p {
          margin: 0;
          color: var(--c-text-soft);
          font-size: 0.85rem;
          line-height: 1.65;
        }

        .ora-spread.is-active {
          border-color: var(--c-green);
          background: var(--c-green);
        }

        .ora-spread.is-active h3 {
          color: var(--c-ritual-text);
        }

        .ora-spread.is-active p {
          color: #c4cdbe;
        }

        .ora-spread.is-active .ora-spread-meta,
        .ora-spread.is-active .ora-spread-icon {
          color: #d8b25a;
        }

        .ora-spread.is-soon > * {
          opacity: 0.45;
        }

        .ora-askbox {
          max-width: var(--ora-measure);
          margin-top: 3rem;
          border: 1px solid var(--c-border);
          border-radius: var(--ora-radius);
          background: var(--c-surface);
          padding: 2rem;
        }

        .ora-ask-label,
        .ora-panel p {
          margin: 0 0 6px;
          color: var(--c-accent-text);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .ora-askbox > p:not(.ora-ask-label) {
          margin: 0 0 1.25rem;
          color: var(--c-text-soft);
          font-size: 0.95rem;
        }

        .ora-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .ora-chips span {
          border: 1px solid var(--c-border-strong);
          border-radius: 999px;
          padding: 6px 16px;
          color: var(--c-text-soft);
          font-size: 0.8rem;
        }

        .ora-askbox form {
          display: grid;
          gap: 1.25rem;
        }

        .ora-askbox textarea {
          min-height: 64px;
          width: 100%;
          resize: vertical;
          border: 1px solid var(--c-border-strong);
          border-radius: 12px;
          background: var(--c-surface-well);
          color: var(--c-text);
          padding: 1rem;
          font: inherit;
          outline: none;
        }

        .ora-askbox textarea::placeholder {
          color: var(--c-text-dim);
        }

        .ora-askbox textarea:focus {
          border-color: var(--c-accent);
        }

        .ora-section-ink,
        .ora-cta {
          background: var(--c-green);
          color: #e9e1ce;
        }

        .ora-section-ink .ora-eyebrow,
        .ora-panel-ink p {
          color: #d8b25a;
        }

        .ora-section-ink h2,
        .ora-panel-ink h2 {
          color: var(--c-ritual-text);
        }

        .ora-steps {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 1.5rem;
          margin-top: 3rem;
          border-top: 1px solid rgba(255,255,255,.14);
          padding-top: 2rem;
        }

        .ora-step span {
          display: block;
          margin-bottom: 0.75rem;
          color: #d8b25a;
          font-family: "Spectral", Georgia, serif;
          font-size: 2.4rem;
          line-height: 1;
        }

        .ora-step h3 {
          margin: 0 0 0.5rem;
          color: var(--c-ritual-text);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 1.15rem;
          font-weight: 500;
        }

        .ora-step p {
          margin: 0;
          color: #bcc4b3;
          font-size: 0.85rem;
          line-height: 1.7;
        }

        .ora-browse,
        .ora-physical {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }

        .ora-browse .ora-eyebrow {
          margin-bottom: 1rem;
        }

        .ora-lead {
          max-width: 44ch;
          margin: 1.25rem 0 2rem;
          color: var(--c-text-soft);
          font-size: 1.125rem;
          line-height: 1.8;
        }

        .ora-browse-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          perspective: 1000px;
        }

        .ora-browse-strip .ora-tcard {
          position: relative;
          left: auto;
          top: auto;
          width: clamp(96px, 12vw, 128px);
          box-shadow: 0 16px 30px -22px rgba(20,16,8,.5);
        }

        .ora-browse-card-0 {
          transform: rotate(-8deg) translateY(8px);
        }

        .ora-browse-card-1 {
          transform: rotate(-3deg);
        }

        .ora-browse-card-2 {
          z-index: 2;
          transform: rotate(2deg) scale(1.06);
        }

        .ora-browse-card-3 {
          transform: rotate(7deg) translateY(6px);
        }

        .ora-modes {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.25rem;
        }

        .ora-mode,
        .ora-feature {
          border: 1px solid var(--c-border);
          border-radius: var(--ora-radius);
          background: var(--c-surface);
          padding: 1.5rem;
        }

        .ora-mode span {
          display: block;
          margin-bottom: 8px;
          color: var(--c-accent-text);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .ora-mode h3,
        .ora-feature h3 {
          margin: 0 0 8px;
          color: var(--c-text);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 1.5rem;
          font-weight: 500;
        }

        .ora-mode p,
        .ora-feature p {
          margin: 0;
          color: var(--c-text-soft);
          font-size: 0.9rem;
          line-height: 1.7;
        }

        .ora-journal-actions {
          margin-top: 2rem;
        }

        .ora-panel {
          border-radius: var(--ora-radius);
          padding: clamp(2rem, 4vw, 3rem);
        }

        .ora-panel-paper {
          border: 1px solid var(--c-border);
          background: var(--c-surface);
        }

        .ora-panel-ink {
          background: var(--c-green);
          color: var(--c-ritual-text);
        }

        .ora-panel h2 {
          margin: 0 0 2rem;
          color: var(--c-text);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(1.6rem, 3vw, 2.1rem);
          font-weight: 500;
          line-height: 1.3;
        }

        .ora-panel h2 span {
          display: block;
        }

        .ora-btn-on-ink {
          background: var(--c-surface);
          color: var(--c-green);
        }

        .ora-btn-on-ink:hover {
          background: #fff;
        }

        .ora-statement {
          max-width: 18ch;
          margin: 0 0 3rem;
          color: var(--c-text);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 500;
          line-height: 1.35;
        }

        .ora-features {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.25rem;
        }

        .ora-feature-icon {
          width: 30px;
          height: 30px;
          margin-bottom: 1rem;
          color: var(--c-accent);
        }

        .ora-feature h3 {
          font-size: 1.2rem;
        }

        .ora-cta {
          padding: clamp(4rem, 9vw, 7rem) 0;
          text-align: center;
        }

        .ora-cta h2 {
          margin: 0 0 2rem;
          color: #f4eedd;
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(2.4rem, 6vw, 4.4rem);
          font-weight: 500;
          line-height: 1.08;
        }

        .ora-cta-actions {
          justify-content: center;
        }

        .ora-btn-ghost-on-ink {
          border-color: rgba(237,228,206,.4);
          background: transparent;
          color: #ede4ce;
        }

        .ora-btn-ghost-on-ink:hover {
          border-color: rgba(237,228,206,.85);
        }

        .ora-footer {
          border-top: 1px solid var(--c-border);
          background: var(--c-bg);
          padding: 4rem 0 5rem;
        }

        .ora-footer-top {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .ora-footer-mark {
          width: 30px;
          height: 30px;
          margin-bottom: 0.75rem;
          color: var(--c-accent);
        }

        .ora-footer-brand {
          margin: 0 0 0.5rem;
          color: var(--c-text);
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 20px;
          font-style: italic;
        }

        .ora-footer-tag {
          max-width: 30ch;
          margin: 0;
          color: var(--c-text-soft);
          font-size: 0.85rem;
          line-height: 1.7;
        }

        .ora-footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          color: var(--c-text-soft);
          font-size: 0.85rem;
        }

        .ora-footer-legal {
          margin: 0;
          border-top: 1px solid var(--c-border);
          padding-top: 1.5rem;
          color: var(--c-text-dim);
          font-size: 0.75rem;
          line-height: 1.7;
        }

        [data-theme="night"] .ora-spread.is-active {
          border-color: rgba(216,178,90,.45);
          background: radial-gradient(circle at 60% 30%, rgba(216,178,90,.16), transparent 62%), var(--c-surface);
        }

        [data-theme="night"] .ora-spread.is-active h3 {
          color: var(--c-accent-hover);
        }

        [data-theme="night"] .ora-tcard {
          border-color: var(--c-border-strong);
          background: #23262f;
        }

        [data-theme="night"] .ora-tcard-dark {
          border-color: #1a1d25;
          background: #0c0e13;
        }

        @media (max-width: 920px) {
          .ora-nav-links {
            display: none;
          }

          .ora-hero-grid,
          .ora-browse,
          .ora-physical {
            grid-template-columns: 1fr;
          }

          .ora-deck-cluster {
            width: 100%;
            max-width: 420px;
            height: 380px;
            margin: 0 auto;
          }

          .ora-spreads,
          .ora-steps,
          .ora-modes {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ora-features {
            grid-template-columns: 1fr;
          }

          .ora-browse-strip {
            order: -1;
          }
        }

        @media (max-width: 560px) {
          .ora-nav {
            padding-inline: 20px;
          }

          .ora-spreads,
          .ora-steps,
          .ora-modes {
            grid-template-columns: 1fr;
          }

          .ora-hero-title {
            font-size: clamp(3rem, 18vw, 4.9rem);
          }

          .ora-browse-strip {
            justify-content: flex-start;
            overflow: hidden;
            padding: 1rem 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ora-btn,
          .ora-spread {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

function SigilRule() {
  return (
    <div className="ora-rule">
      <OraMarkIcon />
    </div>
  );
}
