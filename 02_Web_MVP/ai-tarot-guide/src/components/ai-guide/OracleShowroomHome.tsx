"use client";

import Link from "next/link";
import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";

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

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: {
    transcript: string;
  };
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
};

type SpeechRecognitionErrorEventLike = {
  error: string;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  abort: () => void;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructorLike = new () => SpeechRecognitionLike;

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

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function DiceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
      <rect height="14" rx="3" width="14" x="5" y="5" />
      <circle cx="9" cy="9" fill="currentColor" r="0.75" stroke="none" />
      <circle cx="15" cy="9" fill="currentColor" r="0.75" stroke="none" />
      <circle cx="12" cy="12" fill="currentColor" r="0.75" stroke="none" />
      <circle cx="9" cy="15" fill="currentColor" r="0.75" stroke="none" />
      <circle cx="15" cy="15" fill="currentColor" r="0.75" stroke="none" />
    </svg>
  );
}

function MicrophoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3Z" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
      <path d="M9 21h6" />
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
  const [activeQuestionCategory, setActiveQuestionCategory] = useState("love");
  const [heroQuestion, setHeroQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const heroQuestionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const speechRecognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const copy = useMemo(
    () => ({
      room: isZh ? "Ora Arcana · 向卡牌提问" : "Ora Arcana · Ask the Cards",
      sectionNavigationLabel: isZh ? "页面分区导航" : "Section navigation",
      nav: isZh
        ? [
            ["如何开始", "#reading-modes"],
            ["认识 Ora", "#meet-ora"],
            ["解读日志", "#journal"],
            ["说明", "#trust"],
          ]
        : [
            ["Start", "#reading-modes"],
            ["Meet Ora", "#meet-ora"],
            ["Journal", "#journal"],
            ["Trust", "#trust"],
          ],
      heroTitle: isZh ? "下午好。" : "Good afternoon.",
      subtitle: isZh ? "把此刻的问题交给 Ora。" : "Bring this moment's question to Ora.",
      heroBody: isZh
        ? "Ora 会先整理你的语境，再带你抽牌。"
        : "Ora reads your context first, then guides the draw.",
      begin: isZh ? "开始解读" : "Start Reading",
      randomQuestion: isZh ? "随机问题" : "Random question",
      voiceInput: isZh ? "语音输入" : "Voice input",
      voiceUnsupported: isZh ? "此浏览器暂不支持语音输入" : "Voice input is not supported in this browser",
      voicePermissionUnavailable: isZh ? "无法使用麦克风权限" : "Microphone permission is unavailable.",
      physical: isZh ? "使用实体卡组" : "Use Physical Deck",
      explore: isZh ? "浏览卡牌" : "Explore the Cards",
      questionCategoryLabel: isZh ? "问题方向" : "Question direction",
      questionPlaceholder: isZh ? "写下你现在想问的问题" : "Write the question you want to ask",
      questionCategories: isZh
        ? [
            {
              id: "love",
              label: "爱情",
              questions: [
                "我们之间真正的问题是什么？",
                "这段关系里，我需要看清什么？",
                "如果我选择自己，这段关系会发生什么变化？",
                "我现在应该靠近，还是保持距离？",
              ],
            },
            {
              id: "work",
              label: "事业",
              questions: [
                "我现在的工作方向对吗？",
                "下一步我应该先处理什么？",
                "这个机会值得继续投入吗？",
                "我在事业上真正卡住的地方是什么？",
              ],
            },
            {
              id: "money",
              label: "财富",
              questions: [
                "我现在对钱的焦虑来自哪里？",
                "这个财务决定需要注意什么？",
                "我该保守一点，还是主动争取？",
                "现在最该调整的消费或投资习惯是什么？",
              ],
            },
            {
              id: "choice",
              label: "决策",
              questions: [
                "这个选择背后，我最害怕失去什么？",
                "我现在真正犹豫的是什么？",
                "如果我继续推进，最大的阻力是什么？",
                "我应该等待，还是做出行动？",
              ],
            },
            {
              id: "self",
              label: "自我",
              questions: [
                "我现在最需要听见的提醒是什么？",
                "我为什么一直重复同一个模式？",
                "我需要放下什么，才能往前走？",
                "我忽略了自己哪一部分感受？",
              ],
            },
          ]
        : [
            {
              id: "love",
              label: "Love",
              questions: [
                "What is the real issue between us?",
                "What do I need to see clearly in this relationship?",
                "What changes if I choose myself?",
                "Should I move closer or keep distance?",
              ],
            },
            {
              id: "work",
              label: "Work",
              questions: [
                "Is my current direction at work right for me?",
                "What should I handle first next?",
                "Is this opportunity worth continuing?",
                "Where am I truly stuck in my work?",
              ],
            },
            {
              id: "money",
              label: "Money",
              questions: [
                "Where is my anxiety about money coming from?",
                "What should I notice before this financial decision?",
                "Should I stay cautious or ask for more?",
                "What money habit needs adjustment now?",
              ],
            },
            {
              id: "choice",
              label: "Choice",
              questions: [
                "What am I afraid to lose behind this choice?",
                "What am I really hesitating about?",
                "What resistance will I meet if I move forward?",
                "Should I wait or take action?",
              ],
            },
            {
              id: "self",
              label: "Self",
              questions: [
                "What reminder do I need most right now?",
                "Why do I keep repeating the same pattern?",
                "What do I need to release to move forward?",
                "What part of myself am I ignoring?",
              ],
            },
          ],
      choosePath: isZh ? "选择你的解读" : "Choose Your Reading",
      wonderingTitle: isZh ? "你正在想什么？" : "What are you wondering?",
      spreads: isZh
        ? [
            {
              id: "single",
              title: "单牌解读",
              body: "一个清晰问题的快速提示。",
              meta: "1 张牌 · 推荐",
              cta: "开始单牌解读",
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
              cta: "开始三牌阵",
              href: threeCardHref,
              icon: OraPairIcon,
              active: false,
              disabled: false,
            },
            {
              id: "relationship",
              title: "关系解读",
              body: "用于爱、连接与情感清晰度。",
              meta: "3 张牌 · 即将开放",
              cta: "",
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
              cta: "",
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
              meta: "1 card · Recommended",
              cta: "Start single-card reading",
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
              cta: "Start three-card spread",
              href: threeCardHref,
              icon: OraPairIcon,
              active: false,
              disabled: false,
            },
            {
              id: "relationship",
              title: "Relationship Reading",
              body: "For love, connection, and emotional clarity.",
              meta: "3 cards · Coming Soon",
              cta: "",
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
              cta: "",
              href: "",
              icon: OraPathIcon,
              active: false,
              disabled: true,
            },
          ],
      unfoldsKicker: isZh ? "解读如何展开" : "The Reading Unfolds",
      unfoldsTitle: isZh ? "从安顿到回看，流程保持轻盈。" : "From settling to reflection, the path stays light.",
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
      journalTitle: isZh ? "Ora 不只给你一次答案。" : "Ora is not only here for one answer.",
      journalBody: isZh
        ? "每次阅读都会成为你的情绪、问题与选择脉络。当你第十次回来时，Ora 不应该像第一次见你。"
        : "Each reading becomes part of your emotional and decision-making archive. When you return for the tenth time, Ora should not meet you like a stranger.",
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
      physicalDeckTitle: isZh ? "已有实体卡组？\n使用实体卡组解读。" : "Have the physical deck?\nRead with your cards.",
      redeemDeckKicker: isZh ? "兑换你的卡组" : "Redeem Your Deck",
      redeemDeckTitle: isZh ? "解锁实体卡组的线上陪伴体验。" : "Unlock your deck's companion experience.",
      redeemDeckCode: isZh ? "兑换卡组码" : "Redeem Deck Code",
      trustTitle: isZh ? "Ora 的边界" : "Ora's Boundaries",
      trustBody: isZh
        ? "Ora 不是医疗、法律、财务或心理治疗建议。她不会替你做决定，也不会承诺未来。她更像一面安静的镜子，帮助你把问题看得更清楚。"
        : "Ora is not medical, legal, financial, or therapeutic advice. She does not make decisions for you or promise the future. She is a quiet mirror for reflection, helping you see the question more clearly.",
      storyKicker: isZh ? "Ora 如何完成一次专业解读" : "How Ora Shapes a Professional Reading",
      storyTitle: isZh ? "一屏一个步骤，看到 Ora 怎样把问题变成解读。" : "One step at a time: how Ora turns a question into a reading.",
      storySteps: isZh
        ? [
            {
              title: "Ora 先听见你的问题。",
              body: "在抽牌之前，Ora 会先整理你的问题语境。她不会只抓关键词，而是判断你真正想看的，是选择、关系、阻力，还是下一步方向。",
              kind: "conversation",
            },
            {
              title: "牌阵不是装饰，是问题的结构。",
              body: "单牌适合一个清晰问题。三牌阵会把问题拆成现状、挑战与指引。Ora 不只是逐张解释牌义，而是看牌与牌之间的关系。",
              kind: "spread",
            },
            {
              title: "同一张牌，不会只有一种答案。",
              body: "愚者在新开始里可能是勇气。在关系问题里可能是轻率。在事业问题里可能是准备不足。Ora 会结合问题、牌阵位置和上下文解释牌面。",
              kind: "card",
            },
            {
              title: "被说中的地方，可以继续问下去。",
              body: "一次解读不必停在第一段回答。你可以追问某个建议、某张牌、某个不舒服的提醒。Ora 会沿着本次牌面继续展开，而不是重新抽牌。",
              kind: "follow-up",
            },
            {
              title: "Ora 不只给你一次答案。",
              body: "每次阅读都会成为你的私人阅读脉络。当你第十次回来时，Ora 不应该像第一次见你。",
              kind: "journal",
            },
          ]
        : [
            {
              title: "Ora first listens to the question.",
              body: "Before the draw, Ora reads the shape of your question. She does not only scan keywords; she looks for whether you are asking about choice, relationship, resistance, or the next step.",
              kind: "conversation",
            },
            {
              title: "A spread is not decoration. It is structure.",
              body: "A single card is for one clear question. A three-card spread separates situation, challenge, and guidance. Ora does not translate cards one by one; she reads the relationship between them.",
              kind: "spread",
            },
            {
              title: "The same card does not always say the same thing.",
              body: "The Fool may be courage in a new beginning, carelessness in a relationship, or lack of preparation in a work question. Ora reads the card through the question, the spread position, and the surrounding context.",
              kind: "card",
            },
            {
              title: "When something lands, you can keep asking.",
              body: "A reading does not need to stop at the first answer. You can ask about a suggestion, a card, or a line that feels uncomfortable. Ora continues from the same reading instead of drawing again.",
              kind: "follow-up",
            },
            {
              title: "Ora is not here for only one answer.",
              body: "Each reading becomes part of your private reading trail. When you return for the tenth time, Ora should not meet you like a stranger.",
              kind: "journal",
            },
          ],
      whyOraKicker: isZh ? "为什么不是普通抽牌" : "Why Ora",
      whyOraItems: isZh
        ? [
            ["不是只抽牌", "Ora 会先整理你的问题，再进入抽牌。"],
            ["不是固定牌义", "同一张牌，会根据问题、心境和牌阵位置产生不同解读。"],
            ["不是一次性回答", "你可以继续追问，也可以在日志里回看每次阅读。"],
            ["不替你决定", "Ora 给出的是反思、方向和下一步建议。"],
          ]
        : [
            ["Not only a draw", "Ora helps shape your question before the card is drawn."],
            ["Not fixed meanings", "The same card reads differently through question, mood, and spread position."],
            ["Not one-and-done", "You can continue asking and revisit every reading in your journal."],
            ["Not a decision-maker", "Ora offers reflection, direction, and next-step suggestions."],
          ],
      finalTitle: isZh ? "把你的问题交给 Ora。" : "Bring your question to Ora.",
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

  const activeQuestionGroup =
    copy.questionCategories.find((category) => category.id === activeQuestionCategory) ?? copy.questionCategories[0];

  const resizeHeroQuestionTextarea = useCallback(() => {
    const textarea = heroQuestionTextareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  useEffect(() => {
    resizeHeroQuestionTextarea();
  }, [heroQuestion, resizeHeroQuestionTextarea]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructorLike;
      webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
    };

    queueMicrotask(() => {
      setSpeechSupported(Boolean(speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition));
    });

    return () => {
      speechRecognitionRef.current?.abort();
      speechRecognitionRef.current = null;
    };
  }, []);

  function buildAskHref(question?: string) {
    const trimmedQuestion = question?.trim();
    const params = new URLSearchParams({
      lang,
      mode: "online",
      orientation: "upright",
      spread: "single",
    });

    if (trimmedQuestion) {
      params.set("question", trimmedQuestion);
    }

    return `/ai-guide/ask?${params.toString()}`;
  }

  function chooseRandomQuestion() {
    const currentQuestion = heroQuestion.trim();
    const allQuestions = copy.questionCategories.flatMap((category) => category.questions);
    const candidateQuestions = allQuestions.filter((question) => question !== currentQuestion);
    const questions = candidateQuestions.length > 0 ? candidateQuestions : allQuestions;
    const nextQuestion = questions[Math.floor(Math.random() * questions.length)];

    if (nextQuestion) {
      setHeroQuestion(nextQuestion);
    }
  }

  function appendVoiceTranscript(transcript: string) {
    const cleanTranscript = transcript.trim();

    if (!cleanTranscript) {
      return;
    }

    setHeroQuestion((currentQuestion) => {
      const trimmedQuestion = currentQuestion.trim();

      if (!trimmedQuestion) {
        return cleanTranscript;
      }

      return `${trimmedQuestion}${isZh ? "，" : " "}${cleanTranscript}`;
    });
  }

  function toggleVoiceInput() {
    if (isListening) {
      speechRecognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructorLike;
      webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
    };
    const SpeechRecognitionConstructor = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      setSpeechSupported(false);
      setVoiceStatus(copy.voiceUnsupported);
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    speechRecognitionRef.current = recognition;
    recognition.lang = isZh ? "zh-CN" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];

        if (result?.isFinal) {
          finalTranscript += result[0]?.transcript ?? "";
        }
      }

      appendVoiceTranscript(finalTranscript);
    };
    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "permission-denied") {
        setVoiceStatus(copy.voicePermissionUnavailable);
      } else if (event.error !== "no-speech") {
        setVoiceStatus(copy.voiceUnsupported);
      }

      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };

    setVoiceStatus("");
    setIsListening(true);

    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceStatus(copy.voiceUnsupported);
    }
  }

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
          <div className="ora-wrap ora-hero-entry">
            <p className="ora-eyebrow ora-hero-eyebrow">{copy.room}</p>
            <h1 className="ora-hero-title">{copy.heroTitle}</h1>
            <p className="ora-hero-sub">{copy.subtitle}</p>
            <p className="ora-hero-note">{copy.heroBody}</p>
            <div className="ora-entry-composer">
              <textarea
                aria-label={copy.questionPlaceholder}
                onChange={(event) => {
                  setHeroQuestion(event.target.value);
                  resizeHeroQuestionTextarea();
                }}
                placeholder={copy.questionPlaceholder}
                ref={heroQuestionTextareaRef}
                rows={1}
                value={heroQuestion}
              />
              <div className="ora-entry-actions">
                <button aria-label={copy.randomQuestion} className="ora-entry-random" onClick={chooseRandomQuestion} title={copy.randomQuestion} type="button">
                  <DiceIcon />
                </button>
                <button
                  aria-label={copy.voiceInput}
                  aria-pressed={isListening}
                  className={cx("ora-entry-voice", isListening && "is-listening")}
                  disabled={!speechSupported}
                  onClick={toggleVoiceInput}
                  title={speechSupported ? copy.voiceInput : copy.voiceUnsupported}
                  type="button"
                >
                  <MicrophoneIcon />
                </button>
                <Link className="ora-entry-start" href={buildAskHref(heroQuestion)}>
                  {copy.begin}
                  <ArrowIcon />
                </Link>
              </div>
            </div>
            {voiceStatus ? <p className="ora-voice-status">{voiceStatus}</p> : null}
            <div className="ora-question-starters">
              <div aria-label={copy.questionCategoryLabel} className="ora-question-tabs" role="tablist">
                {copy.questionCategories.map((category) => {
                  const isActive = category.id === activeQuestionGroup.id;

                  return (
                    <button
                      aria-selected={isActive}
                      className={cx("ora-question-tab", isActive && "is-active")}
                      key={category.id}
                      onClick={() => setActiveQuestionCategory(category.id)}
                      role="tab"
                      type="button"
                    >
                      {category.label}
                    </button>
                  );
                })}
              </div>
              <div className="ora-question-list">
                {activeQuestionGroup.questions.slice(0, 4).map((question) => (
                  <button
                    className={cx("ora-question-sample", heroQuestion === question && "is-selected")}
                    key={question}
                    onClick={() => setHeroQuestion(question)}
                    type="button"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
            <div className="ora-hero-minor-links">
              <Link className="ora-btn-text" href={physicalHref}>
                {copy.physical}
              </Link>
              <Link className="ora-btn-text" href="#deck">
                {copy.explore}
                <ArrowIcon />
              </Link>
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
                    {!spread.disabled && spread.href ? (
                      <span className="ora-spread-cta">
                        {spread.cta}
                        <ArrowIcon />
                      </span>
                    ) : null}
                  </article>
                );

                return spread.disabled || !spread.href ? (
                  <div aria-disabled="true" key={spread.id}>
                    {card}
                  </div>
                ) : (
                  <Link
                    className="ora-spread-link"
                    href={spread.href}
                    key={spread.id}
                  >
                    {card}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="ora-section ora-section-story" id="meet-ora">
          <div className="ora-wrap">
            <div className="ora-section-head">
              <p className="ora-eyebrow">{copy.storyKicker}</p>
              <h2>{copy.storyTitle}</h2>
            </div>
            <div className="ora-story-stack">
              {copy.storySteps.map((step, index) => (
                <article
                  className={cx("ora-story-panel", index % 2 === 1 && "is-reversed")}
                  key={step.title}
                >
                  <div className="ora-story-copy">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                  <div className="ora-story-mock" aria-hidden="true">
                    {step.kind === "conversation" ? (
                      <div className="ora-mock-chat">
                        <p className="ora-mock-user">{isZh ? "我这次的项目会顺利吗？" : "Will this project go smoothly?"}</p>
                        <p className="ora-mock-ora">
                          {isZh
                            ? "我听到的不是简单的成败，而是你想确认下一步是否值得继续投入。"
                            : "I hear more than success or failure. You are asking whether the next step is worth more energy."}
                        </p>
                      </div>
                    ) : null}

                    {step.kind === "spread" ? (
                      <div className="ora-mock-spread">
                        {[isZh ? "现状" : "Situation", isZh ? "挑战" : "Challenge", isZh ? "指引" : "Guidance"].map((label) => (
                          <div className="ora-mock-card" key={label}>
                            <OraMarkIcon />
                            <span>{label}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {step.kind === "card" ? (
                      <div className="ora-mock-card-context">
                        <div className="ora-mock-focus-card">
                          <span>0</span>
                          <OraMarkIcon />
                          <strong>{isZh ? "愚者" : "The Fool"}</strong>
                        </div>
                        <div className="ora-mock-chips">
                          {(isZh ? ["新开始", "关系", "事业"] : ["New beginning", "Relationship", "Work"]).map((chip) => (
                            <span key={chip}>{chip}</span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {step.kind === "follow-up" ? (
                      <div className="ora-mock-chat ora-mock-follow">
                        <p className="ora-mock-ora">{isZh ? "这张牌提醒你先确认边界。" : "This card asks you to name the boundary first."}</p>
                        <p className="ora-mock-user">{isZh ? "这个建议具体怎么落地？" : "How can I apply this advice?"}</p>
                        <p className="ora-mock-ora">{isZh ? "从一个最小行动开始，不要一次处理全部压力。" : "Start with one smallest action, not the whole pressure at once."}</p>
                      </div>
                    ) : null}

                    {step.kind === "journal" ? (
                      <div className="ora-mock-journal">
                        <span>{isZh ? "上一次的问题" : "Previous question"}</span>
                        <h4>{isZh ? "我应该继续投入这个方向吗？" : "Should I keep investing in this direction?"}</h4>
                        <p>{isZh ? "抽到的牌：星星" : "Card drawn: The Star"}</p>
                        <p>{isZh ? "Ora 留下的提醒：先恢复信心，再决定速度。" : "Ora's note: restore trust before deciding speed."}</p>
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ora-section ora-section-why-lite">
          <div className="ora-wrap">
            <p className="ora-eyebrow">{copy.whyOraKicker}</p>
            <div className="ora-why-lite-grid">
              {copy.whyOraItems.map(([title, body]) => (
                <article className="ora-why-lite-card" key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
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

        <section className="ora-section" id="journal">
          <div className="ora-wrap">
            <div className="ora-section-head">
              <p className="ora-eyebrow">{copy.journalKicker}</p>
              <h2>{copy.journalTitle}</h2>
              <p className="ora-lead">{copy.journalBody}</p>
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
            <div className="ora-boundary">
              <OraShieldIcon className="ora-feature-icon" />
              <p>{copy.trustBody}</p>
            </div>
          </div>
        </section>

        <section className="ora-cta">
          <div className="ora-wrap">
            <h2>{copy.finalTitle}</h2>
            <div className="ora-actions ora-cta-actions">
              <Link className="ora-btn ora-btn-primary" href="#reading-modes">
                {copy.begin}
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
          padding: clamp(2.35rem, 5vw, 4.3rem) 0 clamp(1.6rem, 3.5vw, 2.6rem);
        }

        .ora-hero-entry {
          position: relative;
          z-index: 1;
          display: grid;
          max-width: min(var(--ora-container), 860px);
          justify-items: center;
          text-align: center;
        }

        .ora-hero-eyebrow {
          margin-bottom: 1.15rem;
        }

        .ora-hero-title {
          max-width: 100%;
          margin: 0 0 0.9rem;
          color: var(--c-text);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(3rem, 6.9vw, 5.35rem);
          font-weight: 600;
          letter-spacing: 0;
          line-height: 1.02;
          white-space: nowrap;
        }

        .ora-hero-sub {
          margin: 0 0 0.6rem;
          color: var(--c-text);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(1.1rem, 2.4vw, 1.5rem);
        }

        .ora-hero-note {
          max-width: 42rem;
          margin: 0 0 1rem;
          color: var(--c-text-soft);
          line-height: 1.8;
        }

        .ora-entry-composer {
          display: grid;
          width: min(100%, 730px);
          max-width: 100%;
          min-height: 5.2rem;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: flex-end;
          gap: 1.1rem;
          border: 1px solid color-mix(in srgb, var(--c-accent) 24%, var(--c-border));
          border-radius: 30px;
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--c-surface) 97%, transparent), color-mix(in srgb, var(--c-surface-well) 78%, transparent));
          box-shadow: 0 24px 56px -46px rgba(20,16,8,.58), inset 0 1px 0 color-mix(in srgb, #fff 34%, transparent);
          padding: 0.7rem 0.75rem 0.7rem 1.55rem;
          text-align: left;
          transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.08s ease;
        }

        .ora-entry-composer:hover,
        .ora-entry-composer:focus-within {
          border-color: color-mix(in srgb, var(--c-accent) 58%, var(--c-border));
          box-shadow: 0 26px 60px -44px rgba(20,16,8,.66), 0 0 0 2px color-mix(in srgb, var(--c-accent) 8%, transparent);
        }

        .ora-entry-composer textarea {
          display: block;
          width: 100%;
          min-width: 0;
          min-height: 1.45em;
          align-self: center;
          border: 0;
          background: transparent;
          color: var(--c-text-soft);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(1.06rem, 2vw, 1.22rem);
          line-height: 1.45;
          outline: none;
          overflow-x: hidden;
          overflow-y: hidden;
          resize: none;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .ora-entry-composer textarea:not(:placeholder-shown) {
          color: var(--c-text);
        }

        .ora-entry-composer textarea::placeholder {
          color: var(--c-text-soft);
          opacity: 0.92;
        }

        .ora-entry-actions {
          display: flex;
          flex: 0 0 auto;
          align-items: center;
          justify-content: flex-end;
          gap: 0.55rem;
        }

        .ora-entry-random,
        .ora-entry-voice {
          display: inline-flex;
          width: 3rem;
          height: 3rem;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          border: 1px solid color-mix(in srgb, var(--c-border-strong) 72%, transparent);
          border-radius: 999px;
          background: color-mix(in srgb, var(--c-surface) 76%, transparent);
          color: var(--c-accent-text);
          cursor: pointer;
          transition: border-color 0.18s ease, background 0.18s ease, color 0.18s ease, transform 0.08s ease;
        }

        .ora-entry-random:hover,
        .ora-entry-random:focus-visible,
        .ora-entry-voice:hover,
        .ora-entry-voice:focus-visible,
        .ora-entry-voice.is-listening {
          border-color: color-mix(in srgb, var(--c-accent) 58%, var(--c-border));
          background: var(--c-accent-wash);
          color: var(--c-text);
          outline: none;
        }

        .ora-entry-voice.is-listening {
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c-accent) 28%, transparent);
        }

        .ora-entry-random:active,
        .ora-entry-voice:active {
          transform: translateY(1px);
        }

        .ora-entry-voice:disabled,
        .ora-entry-voice:disabled:hover,
        .ora-entry-voice:disabled:focus-visible {
          border-color: color-mix(in srgb, var(--c-border-strong) 72%, transparent);
          background: color-mix(in srgb, var(--c-surface) 76%, transparent);
          color: var(--c-accent-text);
          cursor: not-allowed;
          opacity: 0.48;
        }

        .ora-entry-random svg,
        .ora-entry-voice svg {
          width: 1.1rem;
          height: 1.1rem;
        }

        .ora-voice-status {
          max-width: min(100%, 700px);
          margin: 0.55rem 0 0;
          color: var(--c-text-dim);
          font-size: 0.78rem;
          line-height: 1.5;
          text-align: center;
        }

        .ora-entry-start {
          display: inline-flex;
          min-width: 8.4rem;
          min-height: 3rem;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: 1px solid transparent;
          border-radius: 999px;
          background: var(--c-accent);
          padding: 0.95rem 1.65rem;
          color: var(--c-on-accent);
          font-family: "Noto Sans SC", Arial, sans-serif;
          font-size: 0.92rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          line-height: 1;
          white-space: nowrap;
          transition: background 0.18s ease, transform 0.08s ease;
        }

        .ora-entry-start:hover,
        .ora-entry-start:focus-visible {
          background: var(--c-accent-hover);
          outline: none;
        }

        .ora-entry-start:active {
          transform: translateY(1px);
        }

        .ora-entry-start svg {
          width: 15px;
          height: 15px;
        }

        .ora-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem;
        }

        .ora-hero-minor-links {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-top: 0.8rem;
        }

        .ora-question-starters {
          width: min(100%, 700px);
          margin-top: 0.9rem;
        }

        .ora-question-tabs {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.45rem;
        }

        .ora-question-tab {
          border: 1px solid color-mix(in srgb, var(--c-border-strong) 78%, transparent);
          border-radius: 999px;
          background: color-mix(in srgb, var(--c-surface) 80%, transparent);
          padding: 0.5rem 0.88rem;
          color: color-mix(in srgb, var(--c-text) 82%, var(--c-text-soft));
          cursor: pointer;
          font: inherit;
          font-size: 0.82rem;
          font-weight: 400;
          line-height: 1.2;
          transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
        }

        .ora-question-tab:hover,
        .ora-question-tab:focus-visible,
        .ora-question-tab.is-active {
          border-color: color-mix(in srgb, var(--c-accent) 58%, var(--c-border));
          background: color-mix(in srgb, var(--c-accent-wash) 92%, var(--c-surface));
          color: var(--c-text);
          outline: none;
        }

        .ora-question-tab.is-active {
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c-accent) 22%, transparent);
        }

        .ora-question-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.58rem;
          margin-top: 0.7rem;
          transition: opacity 0.18s ease;
        }

        .ora-question-sample {
          border: 1px solid color-mix(in srgb, var(--c-border-strong) 62%, transparent);
          border-radius: 14px;
          background: color-mix(in srgb, var(--c-surface) 86%, transparent);
          box-shadow: 0 10px 26px -24px rgba(20,16,8,.5);
          padding: 0.68rem 0.9rem;
          color: color-mix(in srgb, var(--c-text) 86%, var(--c-text-soft));
          cursor: pointer;
          font: inherit;
          font-size: 0.88rem;
          line-height: 1.42;
          text-align: left;
          transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease, transform 0.08s ease, box-shadow 0.18s ease;
        }

        .ora-question-sample:hover,
        .ora-question-sample:focus-visible,
        .ora-question-sample.is-selected {
          border-color: var(--c-accent);
          background: var(--c-accent-wash);
          color: var(--c-text);
          box-shadow: 0 14px 30px -22px rgba(20,16,8,.58);
          outline: none;
        }

        .ora-question-sample.is-selected {
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c-accent) 22%, transparent), 0 14px 30px -22px rgba(20,16,8,.58);
        }

        .ora-question-sample:active {
          transform: translateY(1px);
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

        .ora-rule {
          display: flex;
          max-width: min(var(--ora-container), 760px);
          align-items: center;
          gap: 1rem;
          margin: 0 auto;
          padding: 0 var(--ora-gutter);
          color: var(--c-border-strong);
          opacity: 0.66;
        }

        .ora-rule::before,
        .ora-rule::after {
          content: "";
          height: 1px;
          flex: 1;
          background: var(--c-border);
        }

        .ora-rule svg {
          width: 18px;
          height: 18px;
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

        .ora-section-spreads {
          padding-top: clamp(2.2rem, 5vw, 3.7rem);
        }

        .ora-section-spreads .ora-section-head {
          margin-bottom: clamp(1.5rem, 3.5vw, 2.25rem);
        }

        .ora-section-story {
          border-top: 1px solid var(--c-border);
          background: color-mix(in srgb, var(--c-surface) 54%, transparent);
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

        .ora-story-stack {
          display: grid;
          gap: clamp(1.25rem, 3vw, 2rem);
        }

        .ora-story-panel {
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
          gap: clamp(1.25rem, 4vw, 3rem);
          align-items: center;
          border: 1px solid var(--c-border);
          border-radius: calc(var(--ora-radius) + 6px);
          background: color-mix(in srgb, var(--c-bg) 54%, var(--c-surface));
          padding: clamp(1.25rem, 3vw, 2rem);
        }

        .ora-story-panel.is-reversed .ora-story-copy {
          order: 2;
        }

        .ora-story-copy > span {
          display: block;
          margin-bottom: 1rem;
          color: var(--c-accent-text);
          font-family: "Spectral", Georgia, serif;
          font-size: 1.25rem;
          line-height: 1;
        }

        .ora-story-copy h3 {
          margin: 0 0 0.85rem;
          color: var(--c-text);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(1.35rem, 2.6vw, 2rem);
          font-weight: 500;
          line-height: 1.35;
        }

        .ora-story-copy p {
          margin: 0;
          color: var(--c-text-soft);
          font-size: 0.98rem;
          line-height: 1.85;
        }

        .ora-story-mock {
          border: 1px solid var(--c-border);
          border-radius: var(--ora-radius);
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--c-surface) 94%, transparent), color-mix(in srgb, var(--c-surface-well) 70%, transparent));
          box-shadow: 0 18px 38px color-mix(in srgb, var(--c-text) 7%, transparent);
          padding: clamp(1rem, 2.4vw, 1.5rem);
        }

        .ora-mock-chat {
          display: grid;
          gap: 0.8rem;
        }

        .ora-mock-chat p,
        .ora-mock-journal p {
          margin: 0;
        }

        .ora-mock-user,
        .ora-mock-ora {
          width: fit-content;
          max-width: 86%;
          border: 1px solid var(--c-border);
          border-radius: 1rem;
          padding: 0.8rem 0.9rem;
          font-size: 0.86rem;
          line-height: 1.65;
        }

        .ora-mock-user {
          justify-self: end;
          border-bottom-right-radius: 0.3rem;
          background: color-mix(in srgb, var(--c-surface-well) 62%, transparent);
          color: var(--c-text-soft);
        }

        .ora-mock-ora {
          justify-self: start;
          border-bottom-left-radius: 0.3rem;
          background: color-mix(in srgb, var(--c-surface) 90%, var(--c-accent-wash));
          color: var(--c-text);
        }

        .ora-mock-spread {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.75rem;
        }

        .ora-mock-card {
          display: grid;
          min-height: 9.5rem;
          place-items: center;
          border: 1px solid var(--c-border-strong);
          border-radius: 0.85rem;
          background: var(--card-face);
          padding: 0.75rem;
          text-align: center;
        }

        .ora-mock-card svg,
        .ora-mock-focus-card svg {
          width: 2.1rem;
          height: 2.1rem;
          color: var(--c-accent);
        }

        .ora-mock-card span {
          color: var(--c-text-soft);
          font-size: 0.75rem;
        }

        .ora-mock-card-context {
          display: grid;
          grid-template-columns: 9rem minmax(0, 1fr);
          gap: 1rem;
          align-items: center;
        }

        .ora-mock-focus-card {
          display: flex;
          min-height: 13rem;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          border: 1px solid var(--c-border-strong);
          border-radius: 1rem;
          background: var(--card-face);
          padding: 1rem;
          text-align: center;
        }

        .ora-mock-focus-card span {
          align-self: flex-start;
          color: var(--c-accent-text);
          font-family: "Spectral", Georgia, serif;
        }

        .ora-mock-focus-card strong {
          color: var(--c-text);
          font-family: "Noto Serif SC", Georgia, serif;
          font-weight: 500;
        }

        .ora-mock-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
        }

        .ora-mock-chips span {
          border: 1px solid var(--c-border);
          border-radius: 999px;
          background: color-mix(in srgb, var(--c-surface) 72%, transparent);
          padding: 0.45rem 0.7rem;
          color: var(--c-text-soft);
          font-size: 0.78rem;
        }

        .ora-mock-journal {
          border-left: 2px solid var(--c-accent);
          padding-left: 1rem;
        }

        .ora-mock-journal span {
          color: var(--c-accent-text);
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .ora-mock-journal h4 {
          margin: 0.55rem 0 0.9rem;
          color: var(--c-text);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 1.2rem;
          font-weight: 500;
          line-height: 1.45;
        }

        .ora-mock-journal p {
          color: var(--c-text-soft);
          font-size: 0.86rem;
          line-height: 1.65;
        }

        .ora-mock-journal p + p {
          margin-top: 0.55rem;
        }

        .ora-section-why-lite {
          padding-block: clamp(2.75rem, 5vw, 4.25rem);
        }

        .ora-section-why-lite .ora-eyebrow {
          margin-bottom: 1rem;
        }

        .ora-why-lite-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
        }

        .ora-why-lite-card {
          border: 1px solid var(--c-border);
          border-radius: var(--ora-radius);
          background: color-mix(in srgb, var(--c-surface) 86%, transparent);
          padding: 1.2rem;
        }

        .ora-why-lite-card h3 {
          margin: 0 0 0.5rem;
          color: var(--c-text);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 1.05rem;
          font-weight: 500;
          line-height: 1.35;
        }

        .ora-why-lite-card p {
          margin: 0;
          color: var(--c-text-soft);
          font-size: 0.84rem;
          line-height: 1.7;
        }

        .ora-spreads {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.25rem;
        }

        .ora-spread-link {
          display: block;
          min-width: 0;
          color: inherit;
        }

        .ora-spread {
          position: relative;
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

        .ora-spread-cta {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 0.45rem;
          margin-top: auto;
          padding-top: 1.15rem;
          color: var(--c-accent);
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .ora-spread-cta svg {
          width: 1rem;
          height: 1rem;
          transition: transform 0.18s ease;
        }

        .ora-spread-link:hover .ora-spread-cta svg {
          transform: translateX(3px);
        }

        .ora-spread.is-active .ora-spread-cta {
          color: #d8b25a;
        }

        .ora-panel p {
          margin: 0 0 6px;
          color: var(--c-accent-text);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .ora-section-ink,
        .ora-cta {
          background: var(--c-green);
          color: #e9e1ce;
        }

        .ora-section-ink {
          padding: clamp(2rem, 4.5vw, 3.25rem) 0;
        }

        .ora-section-ink .ora-section-head {
          margin-bottom: 0;
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
          margin-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,.14);
          padding-top: 1.25rem;
        }

        .ora-step span {
          display: block;
          margin-bottom: 0.45rem;
          color: #d8b25a;
          font-family: "Spectral", Georgia, serif;
          font-size: 1.25rem;
          line-height: 1;
        }

        .ora-step h3 {
          margin: 0 0 0.5rem;
          color: var(--c-ritual-text);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 1rem;
          font-weight: 500;
        }

        .ora-step p {
          margin: 0;
          color: #bcc4b3;
          font-size: 0.78rem;
          line-height: 1.55;
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
        .ora-boundary {
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

        .ora-mode h3 {
          margin: 0 0 8px;
          color: var(--c-text);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 1.5rem;
          font-weight: 500;
        }

        .ora-mode p,
        .ora-boundary p {
          margin: 0;
          color: var(--c-text-soft);
          font-size: 0.9rem;
          line-height: 1.7;
        }

        .ora-journal-actions {
          margin-top: 2rem;
        }

        .ora-section-physical {
          padding-top: clamp(2.5rem, 5vw, 4rem);
        }

        .ora-panel {
          border-radius: var(--ora-radius);
          padding: clamp(1.5rem, 3vw, 2.2rem);
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

        .ora-feature-icon {
          width: 30px;
          height: 30px;
          margin-bottom: 1rem;
          color: var(--c-accent);
        }

        .ora-boundary {
          display: grid;
          max-width: 48rem;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 1rem;
          align-items: start;
        }

        .ora-boundary .ora-feature-icon {
          margin-bottom: 0;
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

        [data-theme="night"] .ora-spread:not(.is-soon) {
          border-color: rgba(239,233,219,.2);
          background:
            linear-gradient(180deg, rgba(37,43,38,.92), rgba(24,30,27,.9));
        }

        [data-theme="night"] .ora-spread:not(.is-soon) h3 {
          color: #f2ead8;
        }

        [data-theme="night"] .ora-spread:not(.is-soon) p {
          color: rgba(239,233,219,.74);
        }

        [data-theme="night"] .ora-spread:not(.is-soon) .ora-spread-meta {
          color: rgba(216,178,90,.86);
        }

        [data-theme="night"] .ora-spread:not(.is-soon) .ora-spread-cta {
          color: #e0bc68;
        }

        [data-theme="night"] .ora-spread.is-soon {
          border-color: rgba(239,233,219,.1);
          background: rgba(23,28,25,.5);
        }

        [data-theme="night"] .ora-spread.is-soon > * {
          opacity: 0.58;
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

          .ora-browse,
          .ora-physical,
          .ora-story-panel {
            grid-template-columns: 1fr;
          }

          .ora-story-panel.is-reversed .ora-story-copy {
            order: 0;
          }

          .ora-spreads,
          .ora-steps,
          .ora-modes,
          .ora-why-lite-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
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
          .ora-modes,
          .ora-why-lite-grid {
            grid-template-columns: 1fr;
          }

          .ora-boundary {
            grid-template-columns: 1fr;
          }

          .ora-mock-spread,
          .ora-mock-card-context {
            grid-template-columns: 1fr;
          }

          .ora-hero-title {
            font-size: clamp(2.35rem, 12.5vw, 4.2rem);
            white-space: normal;
          }

          .ora-entry-composer {
            width: 100%;
            min-height: 0;
            grid-template-columns: 1fr;
            align-items: stretch;
            border-radius: 24px;
            padding: 1rem;
            text-align: center;
          }

          .ora-entry-composer textarea {
            width: 100%;
            text-align: left;
          }

          .ora-entry-actions {
            justify-content: flex-end;
          }

          .ora-entry-start {
            min-width: 0;
          }

          .ora-question-tabs {
            flex-wrap: nowrap;
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 0.25rem;
            scrollbar-width: none;
          }

          .ora-question-tabs::-webkit-scrollbar {
            display: none;
          }

          .ora-question-tab {
            flex: 0 0 auto;
          }

          .ora-browse-strip {
            justify-content: flex-start;
            overflow: hidden;
            padding: 1rem 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ora-btn,
          .ora-spread-cta svg,
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
