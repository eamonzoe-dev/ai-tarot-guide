"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ActivationCodePanel } from "@/components/ai-guide/ActivationCodePanel";
import { ReadingNav } from "@/components/ai-guide/ReadingNav";
import { type Language, withLang } from "@/lib/ai-guide/i18n";

const USER_QUESTION_KEY = "aiTarot:userQuestion";
const REFLECTING_DELAY_MS = 900;
const NOTE_MAX_LENGTH = 180;

type ReadingMode = "physical" | "online";
type Spread = "single" | "three-card";
type Orientation = "upright";
type ChatPhase =
  | "asking"
  | "reflectingQuestion"
  | "focus"
  | "mood"
  | "detail"
  | "reflectingSummary"
  | "summary";
type QuestionTopic = "relationship" | "career" | "money" | "decision" | "self" | "general";
type MoodValue = "hopeful" | "unclear" | "anxious" | "calm" | "drained" | "certain";

type ClarifyOption = {
  id: string;
  label: string;
  focus: string;
};

type ClarifyResult = {
  prompt: string;
  summary: string;
  topic: QuestionTopic;
  isClear: boolean;
  options: ClarifyOption[];
};

type AskFormProps = {
  mode: ReadingMode;
  spread: Spread;
  orientation: Orientation;
  lang: Language;
  hasLangParam: boolean;
  initialQuestion?: string;
  initialRitualEnabled?: boolean;
};

const chatCopy = {
  en: {
    oraName: "Ora",
    userName: "You",
    prompt:
      "Tell me what you are wondering. It does not need to be perfectly worded — I can help you shape it.",
    placeholder: "Write your question...",
    send: "Send",
    reflecting: "Ora is reflecting...",
    focusLead:
      "To make the reading more focused, choose the layer you most want to illuminate.",
    moodTitle: "Before we begin, I want to sense your current state.",
    moodBody: "This helps me unfold the cards in a way that fits you better.",
    detailPrompt:
      "Is there anything else you want Ora to carry into this reading? It is also fine to begin now.",
    skipDetail: "Begin without adding more",
    addDetail: "Add one line",
    briefTitle: "Reading Brief",
    briefIntro: "I will carry these details into the cards:",
    briefQuestion: "Your question",
    briefMood: "Current state",
    briefFocus: "Focus",
    briefDetail: "Additional note",
    briefUnset: "Not specified",
    briefDirect: "Begin with the question as it is",
    briefOutro: "If this feels accurate, you can begin the draw.",
    directDraw: "Continue to draw",
    beginDraw: "Begin the draw",
    enterRitual: "Enter the ritual",
    summaryRitualToggle: "Add preparation ritual before the draw",
    selectedLead: "I want the cards to focus on:",
    trailQuestion: "You asked",
    trailMood: "Current state",
    trailFocus: "Focus",
    trailDetail: "Note",
    notePrompt:
      "Optional: add one more line, or begin with what you have already shared.",
    notePlaceholder: "Optional: one thing you want this draw to notice...",
    addNote: "Add one line",
    userFocusLabel: "User focus",
    stageShape: "ORA · Shaping the question · 1/3",
    stageMood: "ORA · Sensing the state · 2/3",
    stageReady: "ORA · Ready to draw · 3/3",
    exitLabel: "Exit question flow",
    emptyError: "Please write a question before continuing.",
    loadingError:
      "Ora could not load suggestions, but you can still continue directly.",
  },
  zh: {
    oraName: "Ora",
    userName: "你",
    prompt: "把你的问题告诉我就好。不需要说得很完美，我会帮你一起整理。",
    placeholder: "写下你的问题...",
    send: "发送",
    reflecting: "正在整理你的问题...",
    focusLead: "为了让牌面更聚焦，你可以先选一个最想照亮的层面。",
    moodTitle: "在开始之前，我想先感受一下你现在的状态。",
    moodBody: "这会帮助我用更合适的方式为你展开牌面。",
    detailPrompt: "还有一句你想补充的吗？没有也没关系，牌面已经可以开始。",
    skipDetail: "不用补充，开始抽牌",
    addDetail: "补充一句",
    briefTitle: "解读委托单",
    briefIntro: "我会带着这些信息进入牌面：",
    briefQuestion: "你的问题",
    briefMood: "当前状态",
    briefFocus: "这次重点",
    briefDetail: "补充内容",
    briefUnset: "未特别选择",
    briefDirect: "直接带着这个问题进入牌面",
    briefOutro: "如果这些已经准确，我们就可以开始抽牌。",
    directDraw: "直接抽牌",
    beginDraw: "开始抽牌",
    enterRitual: "进入准备仪式",
    summaryRitualToggle: "抽牌前加入准备仪式",
    selectedLead: "我想让牌先回应：",
    trailQuestion: "你问",
    trailMood: "当前状态",
    trailFocus: "关注方向",
    trailDetail: "补充",
    notePrompt: "可选：补充一句，或带着已经整理好的信息开始。",
    notePlaceholder: "可选：补一句你更想让这次抽牌注意的地方...",
    addNote: "补充一句",
    userFocusLabel: "用户补充",
    stageShape: "ORA · 整理问题 · 1/3",
    stageMood: "ORA · 感受状态 · 2/3",
    stageReady: "ORA · 准备抽牌 · 3/3",
    exitLabel: "退出提问流程",
    emptyError: "请先写下一个问题，再继续。",
    loadingError: "Ora 暂时没有整理出建议，但你仍然可以直接抽牌。",
  },
} as const;

const moodOptions: Record<
  Language,
  Array<{
    value: MoodValue;
    label: string;
    detail: string;
    userText: string;
    paramText: string;
    tone: string;
  }>
> = {
  zh: [
    {
      value: "hopeful",
      label: "期待",
      detail: "想看见机会",
      userText: "我现在比较期待",
      paramText: "当前心境：期待，想看见机会",
      tone: "#c99a3b",
    },
    {
      value: "unclear",
      label: "迷茫",
      detail: "还没看清方向",
      userText: "我现在比较迷茫",
      paramText: "当前心境：迷茫，还没看清方向",
      tone: "#7f8fa6",
    },
    {
      value: "anxious",
      label: "焦虑",
      detail: "担心失控或错过",
      userText: "我现在比较焦虑",
      paramText: "当前心境：焦虑，担心失控或错过",
      tone: "#b86b5e",
    },
    {
      value: "calm",
      label: "平静",
      detail: "愿意慢慢看清",
      userText: "我现在比较平静",
      paramText: "当前心境：平静，愿意慢慢看清",
      tone: "#6d9a84",
    },
    {
      value: "drained",
      label: "疲惫",
      detail: "已经消耗很多",
      userText: "我现在比较疲惫",
      paramText: "当前心境：疲惫，已经消耗很多",
      tone: "#8d7a9f",
    },
    {
      value: "certain",
      label: "笃定",
      detail: "心里已有答案",
      userText: "我现在比较笃定",
      paramText: "当前心境：笃定，心里已有答案",
      tone: "#4f8f72",
    },
  ],
  en: [
    {
      value: "hopeful",
      label: "Hopeful",
      detail: "Looking for possibility",
      userText: "I feel hopeful right now",
      paramText: "Current state: hopeful, looking for possibility",
      tone: "#c99a3b",
    },
    {
      value: "unclear",
      label: "Unclear",
      detail: "Direction is not yet clear",
      userText: "I feel unclear right now",
      paramText: "Current state: unclear, direction is not yet clear",
      tone: "#7f8fa6",
    },
    {
      value: "anxious",
      label: "Anxious",
      detail: "Worried about losing control or missing something",
      userText: "I feel anxious right now",
      paramText: "Current state: anxious, worried about losing control or missing something",
      tone: "#b86b5e",
    },
    {
      value: "calm",
      label: "Calm",
      detail: "Willing to see it slowly",
      userText: "I feel calm right now",
      paramText: "Current state: calm, willing to see it slowly",
      tone: "#6d9a84",
    },
    {
      value: "drained",
      label: "Drained",
      detail: "Already spent a lot of energy",
      userText: "I feel drained right now",
      paramText: "Current state: drained, already spent a lot of energy",
      tone: "#8d7a9f",
    },
    {
      value: "certain",
      label: "Certain",
      detail: "Already sense the answer",
      userText: "I feel certain right now",
      paramText: "Current state: certain, already sense the answer",
      tone: "#4f8f72",
    },
  ],
};

const topicKeywords: Record<QuestionTopic, string[]> = {
  relationship: [
    "复合",
    "关系",
    "喜欢",
    "感情",
    "爱情",
    "恋爱",
    "前任",
    "分手",
    "暧昧",
    "relationship",
    "love",
    "ex",
    "partner",
    "dating",
    "romance",
    "breakup",
  ],
  career: [
    "工作",
    "事业",
    "职业",
    "面试",
    "升职",
    "离职",
    "项目",
    "机会",
    "work",
    "career",
    "job",
    "interview",
    "promotion",
    "business",
    "project",
    "opportunity",
  ],
  money: [
    "钱",
    "财务",
    "收入",
    "投资",
    "消费",
    "债",
    "money",
    "finance",
    "financial",
    "income",
    "invest",
    "debt",
    "budget",
  ],
  decision: [
    "选择",
    "决定",
    "要不要",
    "是否",
    "该不该",
    "纠结",
    "choose",
    "choice",
    "decision",
    "decide",
    "whether",
    "option",
  ],
  self: [
    "焦虑",
    "状态",
    "情绪",
    "内耗",
    "迷茫",
    "自己",
    "自我",
    "anxious",
    "anxiety",
    "emotion",
    "feeling",
    "self",
    "stuck",
    "overwhelmed",
  ],
  general: [],
};

const topicGuidance: Record<
  Language,
  Record<QuestionTopic, { prompt: string; options: Array<{ label: string; focus: string }> }>
> = {
  zh: {
    relationship: {
      prompt: "这段关系里，你最想看清哪一层？",
      options: [
        { label: "对方真实态度", focus: "对方真实态度" },
        { label: "关系接下来的走向", focus: "关系接下来的走向" },
        { label: "我该怎么行动", focus: "我该怎么行动" },
      ],
    },
    career: {
      prompt: "这件事里，你最想看哪一块？",
      options: [
        { label: "当前阻力", focus: "当前阻力" },
        { label: "下一步机会", focus: "下一步机会" },
        { label: "是否值得继续", focus: "是否值得继续" },
      ],
    },
    money: {
      prompt: "你更想看财务里的哪一层？",
      options: [
        { label: "当前卡点", focus: "当前卡点" },
        { label: "机会来源", focus: "机会来源" },
        { label: "接下来该注意什么", focus: "接下来该注意什么" },
      ],
    },
    decision: {
      prompt: "你更想让牌帮你看什么？",
      options: [
        { label: "两个选择的差异", focus: "两个选择的差异" },
        { label: "我真正害怕的点", focus: "我真正害怕的点" },
        { label: "下一步更稳的行动", focus: "下一步更稳的行动" },
      ],
    },
    self: {
      prompt: "你更想理解哪部分？",
      options: [
        { label: "情绪来源", focus: "情绪来源" },
        { label: "我真正需要什么", focus: "我真正需要什么" },
        { label: "如何稳定下来", focus: "如何稳定下来" },
      ],
    },
    general: {
      prompt: "你可以选择一个解读方向：",
      options: [
        { label: "当前状况", focus: "当前状况" },
        { label: "隐藏影响", focus: "隐藏影响" },
        { label: "下一步建议", focus: "下一步建议" },
      ],
    },
  },
  en: {
    relationship: {
      prompt: "In this relationship, what layer do you most want to see clearly?",
      options: [
        { label: "Their real attitude", focus: "Their real attitude" },
        { label: "Where this relationship is heading", focus: "Where this relationship is heading" },
        { label: "How I should act", focus: "How I should act" },
      ],
    },
    career: {
      prompt: "In this situation, what do you most want to look at?",
      options: [
        { label: "The current obstacle", focus: "The current obstacle" },
        { label: "The next opportunity", focus: "The next opportunity" },
        { label: "Whether it is worth continuing", focus: "Whether it is worth continuing" },
      ],
    },
    money: {
      prompt: "Which layer of the financial question do you want to understand?",
      options: [
        { label: "The current block", focus: "The current block" },
        { label: "Where opportunity may come from", focus: "Where opportunity may come from" },
        { label: "What to watch next", focus: "What to watch next" },
      ],
    },
    decision: {
      prompt: "What do you want the cards to help you see?",
      options: [
        { label: "The difference between the choices", focus: "The difference between the choices" },
        { label: "What I am really afraid of", focus: "What I am really afraid of" },
        { label: "The steadier next action", focus: "The steadier next action" },
      ],
    },
    self: {
      prompt: "Which part do you want to understand more clearly?",
      options: [
        { label: "Where the emotion comes from", focus: "Where the emotion comes from" },
        { label: "What I really need", focus: "What I really need" },
        { label: "How to steady myself", focus: "How to steady myself" },
      ],
    },
    general: {
      prompt: "You can choose one direction for the reading:",
      options: [
        { label: "The current situation", focus: "The current situation" },
        { label: "Hidden influences", focus: "Hidden influences" },
        { label: "Next-step guidance", focus: "Next-step guidance" },
      ],
    },
  },
};

function detectTopic(question: string): QuestionTopic {
  const normalized = question.toLowerCase();
  const orderedTopics: QuestionTopic[] = [
    "relationship",
    "career",
    "money",
    "decision",
    "self",
  ];

  return (
    orderedTopics.find((topic) =>
      topicKeywords[topic].some((keyword) => normalized.includes(keyword)),
    ) ?? "general"
  );
}

function truncateQuestion(question: string) {
  const compactQuestion = question.replace(/\s+/g, " ").trim();

  if (compactQuestion.length <= 42) {
    return compactQuestion;
  }

  return `${compactQuestion.slice(0, 42)}...`;
}

function isQuestionClear(question: string, topic: QuestionTopic) {
  const normalized = question.toLowerCase().replace(/\s+/g, " ").trim();
  const compactLength = normalized.replace(/\s/g, "").length;
  const wordCount = normalized.split(" ").filter(Boolean).length;
  const vagueMarkers = [
    "怎么办",
    "怎么样",
    "会怎样",
    "未来",
    "最近",
    "随便看看",
    "看看",
    "不知道",
    "迷茫",
    "what should i do",
    "what now",
    "anything",
    "general",
    "future",
    "not sure",
    "confused",
  ];
  const hasVagueMarker = vagueMarkers.some((marker) => normalized.includes(marker));
  const hasSpecificTopic = topic !== "general";
  const hasEnoughShape = compactLength >= 14 || wordCount >= 6;

  return hasSpecificTopic && hasEnoughShape && !hasVagueMarker;
}

function buildLocalClarify(question: string, lang: Language): ClarifyResult {
  const topic = detectTopic(question);
  const guidance = topicGuidance[lang][topic];
  const questionSnippet = truncateQuestion(question);
  const summary =
    lang === "zh"
      ? `我听到的是，你想看清「${questionSnippet}」背后的走向。`
      : `What I hear is that you want to understand the direction behind "${questionSnippet}".`;

  return {
    prompt: guidance.prompt,
    summary,
    topic,
    isClear: isQuestionClear(question, topic),
    options: guidance.options.map((option, index) => ({
      id: `${topic}-${index + 1}`,
      label: option.label,
      focus: option.focus,
    })),
  };
}

function buildDrawHref({
  target = "draw",
  mode,
  spread,
  orientation,
  question,
  lang,
  clarifyId,
  clarifyLabel,
  clarifyFocus,
  clarifyNote,
  clarifyDetail,
  mood,
  clarifyMood,
}: {
  target?: "draw" | "prepare";
  mode: ReadingMode;
  spread: Spread;
  orientation: Orientation;
  question: string;
  lang: Language;
  clarifyId: string;
  clarifyLabel?: string;
  clarifyFocus?: string;
  clarifyNote?: string;
  clarifyDetail?: string;
  mood?: MoodValue;
  clarifyMood?: MoodValue;
}) {
  const params = new URLSearchParams({
    mode,
    spread,
    orientation,
    question,
    lang,
  });

  params.set("clarifyId", clarifyId);

  if (clarifyLabel) {
    params.set("clarifyLabel", clarifyLabel);
  }

  if (clarifyFocus) {
    params.set("clarifyFocus", clarifyFocus);
  }

  if (clarifyNote) {
    params.set("clarifyNote", clarifyNote);
  }

  if (clarifyDetail) {
    params.set("clarifyDetail", clarifyDetail);
  }

  if (mood) {
    params.set("mood", mood);
  }

  if (clarifyMood) {
    params.set("clarifyMood", clarifyMood);
  }

  if (target === "prepare") {
    params.set("ritual", "1");
  }

  return `/ai-guide/${target}?${params.toString()}`;
}

export function AskForm({
  mode,
  spread,
  orientation,
  lang,
  hasLangParam,
  initialQuestion = "",
  initialRitualEnabled = false,
}: AskFormProps) {
  const ui = chatCopy[lang];
  const initialTrimmedQuestion = initialQuestion.trim();
  const [draft, setDraft] = useState(initialTrimmedQuestion);
  const [submittedQuestion, setSubmittedQuestion] = useState(initialTrimmedQuestion);
  const [phase, setPhase] = useState<ChatPhase>(
    initialTrimmedQuestion ? "reflectingQuestion" : "asking",
  );
  const [error, setError] = useState("");
  const [clarify, setClarify] = useState<ClarifyResult | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodValue | "">("");
  const [noteDraft, setNoteDraft] = useState("");
  const [submittedNote, setSubmittedNote] = useState("");
  const [isRitualEnabled, setIsRitualEnabled] = useState(initialRitualEnabled);
  const [isContinuing, setIsContinuing] = useState(false);
  const exitHref = withLang("/ai-guide", {}, lang);

  const prepareClarify = useCallback(
    (questionToClarify: string) => {
      setPhase("reflectingQuestion");
      setClarify(null);
      setSelectedId("");
      setSelectedMood("");
      setSubmittedNote("");
      setNoteDraft("");

      window.setTimeout(() => {
        const nextClarify = buildLocalClarify(questionToClarify, lang);

        setClarify(nextClarify);
        setPhase(nextClarify.isClear ? "mood" : "focus");
      }, REFLECTING_DELAY_MS);
    },
    [lang],
  );

  useEffect(() => {
    if (initialTrimmedQuestion) {
      queueMicrotask(() => {
        localStorage.setItem(USER_QUESTION_KEY, initialTrimmedQuestion);
        prepareClarify(initialTrimmedQuestion);
      });
      return;
    }

    const storedQuestion = localStorage.getItem(USER_QUESTION_KEY);

    if (storedQuestion) {
      queueMicrotask(() => setDraft(storedQuestion));
    }
  }, [prepareClarify, initialTrimmedQuestion]);

  const selectedOption = useMemo(
    () => clarify?.options.find((option) => option.id === selectedId),
    [clarify?.options, selectedId],
  );
  const selectedMoodOption = useMemo(
    () => moodOptions[lang].find((option) => option.value === selectedMood),
    [lang, selectedMood],
  );
  const hasQuestion = Boolean(submittedQuestion.trim());
  const hasNote = Boolean(submittedNote.trim());
  const clarifyNoteWithMood = [submittedNote.trim(), selectedMoodOption?.paramText]
    .filter(Boolean)
    .join(" · ");

  function moveToSummary(withDelay = true) {
    if (!withDelay) {
      setPhase("summary");
      return;
    }

    setPhase("reflectingSummary");
    window.setTimeout(() => {
      setPhase("summary");
    }, REFLECTING_DELAY_MS);
  }

  function submitQuestion() {
    const normalizedQuestion = draft.trim();

    if (!normalizedQuestion) {
      setError(ui.emptyError);
      return;
    }

    setError("");
    setSubmittedQuestion(normalizedQuestion);
    localStorage.setItem(USER_QUESTION_KEY, normalizedQuestion);
    prepareClarify(normalizedQuestion);
  }

  function submitNote() {
    const normalizedNote = noteDraft.trim().slice(0, NOTE_MAX_LENGTH);

    if (!normalizedNote) {
      return;
    }

    setSubmittedNote(normalizedNote);
    setNoteDraft("");
    moveToSummary();
  }

  function chooseOption(optionId: string) {
    setSelectedId(optionId);
    setPhase("mood");
  }

  function chooseMood(mood: MoodValue) {
    setSelectedMood(mood);

    if (clarify?.isClear) {
      moveToSummary();
      return;
    }

    setPhase("detail");
  }

  function skipToSummary() {
    setNoteDraft("");
    moveToSummary(false);
  }

  function continueToDraw() {
    if (!submittedQuestion.trim() || isContinuing) {
      return;
    }

    setIsContinuing(true);

    const target = isRitualEnabled ? "prepare" : "draw";
    const drawHref = selectedOption
      ? buildDrawHref({
          target,
          mode,
          spread,
          orientation,
          question: submittedQuestion.trim(),
          lang,
          clarifyId: selectedOption.id,
          clarifyLabel: selectedOption.label,
          clarifyFocus: selectedOption.focus,
          clarifyNote: clarifyNoteWithMood || undefined,
          clarifyDetail: submittedNote.trim() || undefined,
          mood: selectedMood || undefined,
          clarifyMood: selectedMood || undefined,
        })
      : submittedNote.trim()
        ? buildDrawHref({
            target,
            mode,
            spread,
            orientation,
            question: submittedQuestion.trim(),
            lang,
            clarifyId: "custom",
            clarifyLabel: ui.userFocusLabel,
            clarifyFocus: submittedNote.trim(),
            clarifyNote: clarifyNoteWithMood || undefined,
            clarifyDetail: submittedNote.trim(),
            mood: selectedMood || undefined,
            clarifyMood: selectedMood || undefined,
          })
        : selectedMoodOption
          ? buildDrawHref({
              target,
              mode,
              spread,
              orientation,
              question: submittedQuestion.trim(),
              lang,
              clarifyId: "mood",
              clarifyLabel: selectedMoodOption.label,
              clarifyFocus: selectedMoodOption.userText,
              clarifyNote: selectedMoodOption.paramText,
              mood: selectedMoodOption.value,
              clarifyMood: selectedMoodOption.value,
            })
          : buildDrawHref({
              target,
              mode,
              spread,
              orientation,
              question: submittedQuestion.trim(),
              lang,
              clarifyId: "direct",
              mood: selectedMood || undefined,
              clarifyMood: selectedMood || undefined,
            });

    window.location.href = drawHref;
  }

  const focusText = selectedOption?.label || ui.briefDirect;
  const moodText = selectedMoodOption?.label || ui.briefUnset;
  const detailText = submittedNote.trim() || ui.briefUnset;
  const trailItems = [
    hasQuestion ? { label: ui.trailQuestion, value: submittedQuestion } : null,
    selectedMoodOption ? { label: ui.trailMood, value: selectedMoodOption.label } : null,
    selectedOption ? { label: ui.trailFocus, value: selectedOption.label } : null,
    hasNote ? { label: ui.trailDetail, value: submittedNote } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <main className="ora-guide-shell relative h-[100dvh] overflow-hidden px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--c-surface)_92%,transparent),color-mix(in_srgb,var(--c-bg)_88%,var(--c-surface)_12%)_42%,color-mix(in_srgb,var(--c-border)_36%,transparent)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[14dvh] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full border border-[color:var(--c-accent)]/12 opacity-60" />
      <ActivationCodePanel lang={lang} hasLangParam={hasLangParam} />

      <Link
        aria-label={ui.exitLabel}
        className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--c-border)] bg-[color:color-mix(in_srgb,var(--c-bg)_74%,transparent)] text-xl leading-none text-[color:var(--c-text-soft)] backdrop-blur transition hover:border-[color:var(--c-accent)] hover:text-[color:var(--c-accent)] sm:right-6 sm:top-6"
        href={exitHref}
      >
        <span aria-hidden="true" className="-mt-0.5">×</span>
      </Link>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[760px] flex-col items-center justify-center gap-4 pt-10 sm:pt-8">
        <div className="w-full max-w-[520px] rounded-[1.4rem] border border-[color:var(--c-border)]/60 bg-[color:color-mix(in_srgb,var(--c-surface)_62%,transparent)] px-3 py-2 opacity-80 backdrop-blur-md">
          <ReadingNav lang={lang} />
        </div>

        <section className="w-full max-w-[760px] overflow-hidden rounded-[2rem] border border-[color:var(--c-border)]/65 bg-[color:color-mix(in_srgb,var(--c-surface)_78%,transparent)] shadow-[0_30px_90px_-58px_color-mix(in_srgb,var(--c-text)_72%,transparent)] backdrop-blur-xl sm:rounded-[2.25rem]">
          <div className="max-h-[70dvh] overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
            <TrailChips items={trailItems} />

            {phase === "asking" && (
              <CurrentStep label={ui.stageShape} title={ui.prompt}>
                <form
                  className="mt-5 flex flex-col gap-3 sm:flex-row"
                  onSubmit={(event) => {
                    event.preventDefault();
                    submitQuestion();
                  }}
                >
                  <textarea
                    className="min-h-24 flex-1 resize-none rounded-[1.35rem] border border-[color:var(--c-border)] bg-[color:var(--c-surface-well)]/70 px-4 py-3 text-sm leading-6 text-[color:var(--c-text)] outline-none placeholder:text-[color:var(--c-text-dim)] transition focus:border-[color:var(--c-accent)] focus:bg-[color:var(--c-surface)] focus:ring-2 focus:ring-[color:var(--c-accent)]/20 sm:min-h-14"
                    onChange={(event) => {
                      setDraft(event.target.value);
                      if (error) {
                        setError("");
                      }
                    }}
                    placeholder={ui.placeholder}
                    rows={2}
                    value={draft}
                  />
                  <button
                    className="min-h-12 shrink-0 rounded-full bg-[color:var(--c-accent)] px-6 text-sm font-medium text-[color:var(--c-on-accent)] transition hover:bg-[color:var(--c-accent-hover)] disabled:opacity-50"
                    type="submit"
                  >
                    {ui.send}
                  </button>
                </form>
                {error && (
                  <p className="mt-3 text-xs leading-5 text-[#a6563d]" role="alert">
                    {error}
                  </p>
                )}
              </CurrentStep>
            )}

            {phase === "reflectingQuestion" && (
              <CurrentStep label={ui.stageShape} title={ui.reflecting}>
                <div className="mt-5">
                  <ThinkingDots />
                </div>
              </CurrentStep>
            )}

            {phase === "focus" && (
              <CurrentStep
                label={ui.stageShape}
                title={clarify?.summary ?? ui.loadingError}
                description={ui.focusLead}
              >
                {clarify?.prompt && (
                  <p className="mt-3 text-sm leading-6 text-[color:var(--c-text-soft)]">
                    {clarify.prompt}
                  </p>
                )}
                <FocusOptionGrid options={clarify?.options ?? []} onChoose={chooseOption} />
                <div className="mt-5">
                  <DrawActionButton disabled={isContinuing} label={ui.directDraw} onClick={skipToSummary} />
                </div>
              </CurrentStep>
            )}

            {phase === "mood" && (
              <CurrentStep label={ui.stageMood} title={ui.moodTitle} description={ui.moodBody}>
                <MoodChipGrid
                  lang={lang}
                  onChoose={chooseMood}
                  selectedMood={selectedMood}
                />
                <div className="mt-5">
                  <DrawActionButton disabled={isContinuing} label={ui.directDraw} onClick={skipToSummary} />
                </div>
              </CurrentStep>
            )}

            {phase === "detail" && (
              <CurrentStep label={ui.stageReady} title={ui.detailPrompt}>
                <form
                  className="mt-5 space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    submitNote();
                  }}
                >
                  <textarea
                    className="min-h-28 w-full resize-none rounded-[1.35rem] border border-[color:var(--c-border)] bg-[color:var(--c-surface-well)]/70 px-4 py-3 text-sm leading-6 text-[color:var(--c-text)] outline-none placeholder:text-[color:var(--c-text-dim)] transition focus:border-[color:var(--c-accent)] focus:bg-[color:var(--c-surface)] focus:ring-2 focus:ring-[color:var(--c-accent)]/20"
                    maxLength={NOTE_MAX_LENGTH}
                    onChange={(event) => setNoteDraft(event.target.value)}
                    placeholder={ui.notePlaceholder}
                    rows={3}
                    value={noteDraft}
                  />
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <button
                      className="min-h-11 rounded-full bg-[color:var(--c-accent)] px-5 text-sm font-medium text-[color:var(--c-on-accent)] transition hover:bg-[color:var(--c-accent-hover)] disabled:opacity-50"
                      disabled={!noteDraft.trim()}
                      type="submit"
                    >
                      {ui.addDetail}
                    </button>
                    <button
                      className="min-h-11 rounded-full border border-[color:var(--c-border)] px-5 text-sm font-medium text-[color:var(--c-text-soft)] transition hover:border-[color:var(--c-accent)]/60 hover:text-[color:var(--c-text)]"
                      onClick={skipToSummary}
                      type="button"
                    >
                      {ui.skipDetail}
                    </button>
                  </div>
                </form>
              </CurrentStep>
            )}

            {phase === "reflectingSummary" && (
              <CurrentStep label={ui.stageReady} title={ui.reflecting}>
                <div className="mt-5">
                  <ThinkingDots />
                </div>
              </CurrentStep>
            )}

            {phase === "summary" && (
              <CurrentStep label={ui.stageReady} title={ui.briefTitle}>
                <div className="mt-5 space-y-3">
                  <p className="text-sm leading-6 text-[color:var(--c-text-soft)]">
                    {ui.briefIntro}
                  </p>
                  <ReadingBriefRow label={ui.briefQuestion} value={submittedQuestion} />
                  <ReadingBriefRow label={ui.briefMood} value={moodText} />
                  <ReadingBriefRow label={ui.briefFocus} value={focusText} />
                  <ReadingBriefRow label={ui.briefDetail} value={detailText} />
                  <p className="pt-1 text-sm leading-6 text-[color:var(--c-text-soft)]">
                    {ui.briefOutro}
                  </p>
                  <label className="flex items-center gap-3 rounded-[1rem] border border-[color:var(--c-border)]/70 bg-[color:color-mix(in_srgb,var(--c-surface-well)_38%,transparent)] px-3 py-2 text-xs leading-5 text-[color:var(--c-text-soft)]">
                    <button
                      aria-pressed={isRitualEnabled}
                      className={`relative h-6 w-11 shrink-0 rounded-full border transition ${
                        isRitualEnabled
                          ? "border-[color:var(--c-accent)] bg-[color:color-mix(in_srgb,var(--c-accent)_42%,var(--c-surface))]"
                          : "border-[color:var(--c-border)] bg-transparent"
                      }`}
                      onClick={() => setIsRitualEnabled((current) => !current)}
                      type="button"
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full transition ${
                          isRitualEnabled
                            ? "left-6 bg-[color:var(--c-accent)]"
                            : "left-1 bg-[color:var(--c-text-dim)]"
                        }`}
                      />
                    </button>
                    <span>{ui.summaryRitualToggle}</span>
                  </label>
                  <DrawActionButton
                    disabled={isContinuing}
                    label={isRitualEnabled ? ui.enterRitual : ui.beginDraw}
                    onClick={continueToDraw}
                  />
                </div>
              </CurrentStep>
            )}
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes oraThinkingDot {
          0%,
          80%,
          100% {
            opacity: 0.36;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-3px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ora-thinking-dot {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}

function DrawActionButton({
  disabled,
  label,
  onClick,
}: {
  disabled: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="inline-flex min-h-10 touch-manipulation select-none items-center justify-center rounded-full bg-[color:var(--c-accent)] px-5 text-sm font-medium text-[color:var(--c-on-accent)] transition hover:bg-[color:var(--c-accent-hover)] disabled:opacity-65"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function StageLabel({ label }: { label: string }) {
  return (
    <p className="text-[0.66rem] font-medium uppercase tracking-[0.14em] text-[color:var(--c-accent)]/75">
      {label}
    </p>
  );
}

function CurrentStep({
  children,
  description,
  label,
  title,
}: {
  children: ReactNode;
  description?: string;
  label: string;
  title: string;
}) {
  return (
    <div className="relative">
      <StageLabel label={label} />
      <h1 className="mt-4 font-serif text-[2rem] leading-tight text-[color:var(--c-text)] sm:text-[2.45rem]">
        {title}
      </h1>
      {description && (
        <p className="mt-3 max-w-[34rem] text-sm leading-7 text-[color:var(--c-text-soft)]">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

function TrailChips({ items }: { items: Array<{ label: string; value: string }> }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          className="max-w-full rounded-full border border-[color:var(--c-border)]/65 bg-[color:color-mix(in_srgb,var(--c-surface-well)_52%,transparent)] px-3 py-1.5 text-xs leading-5 text-[color:var(--c-text-soft)]"
          key={`${item.label}-${item.value}`}
        >
          <span className="text-[color:var(--c-text-dim)]">{item.label}: </span>
          <span className="text-[color:var(--c-text)]">{item.value}</span>
        </span>
      ))}
    </div>
  );
}

function FocusOptionGrid({
  onChoose,
  options,
}: {
  onChoose: (optionId: string) => void;
  options: ClarifyOption[];
}) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
      {options.map((option) => (
        <button
          className="min-h-20 rounded-[1.15rem] border border-[color:var(--c-border)] bg-[color:color-mix(in_srgb,var(--c-surface-well)_54%,transparent)] px-4 py-3 text-left text-sm font-medium leading-6 text-[color:var(--c-text)] transition hover:border-[color:var(--c-accent)]/65 hover:bg-[color:color-mix(in_srgb,var(--c-accent)_9%,var(--c-surface))] hover:shadow-[0_14px_28px_-26px_color-mix(in_srgb,var(--c-accent)_80%,transparent)]"
          key={option.id}
          onClick={() => onChoose(option.id)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function MoodChipGrid({
  lang,
  onChoose,
  selectedMood,
}: {
  lang: Language;
  onChoose: (mood: MoodValue) => void;
  selectedMood: MoodValue | "";
}) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {moodOptions[lang].map((mood) => {
        const selected = mood.value === selectedMood;

        return (
          <button
            className={`group relative flex min-h-28 flex-col items-start justify-between rounded-[1.25rem] border px-4 py-3 text-left transition ${
              selected
                ? "border-[color:var(--c-accent)] bg-[color:color-mix(in_srgb,var(--c-accent)_16%,var(--c-surface))] shadow-[0_18px_34px_-28px_color-mix(in_srgb,var(--c-accent)_92%,transparent)]"
                : "border-[color:var(--c-border)] bg-[color:color-mix(in_srgb,var(--c-surface-well)_50%,transparent)] hover:border-[color:var(--c-accent)]/55 hover:bg-[color:var(--c-surface)]/78"
            }`}
            key={mood.value}
            onClick={() => onChoose(mood.value)}
            type="button"
          >
            <span
              aria-hidden="true"
              className={`h-3 w-3 shrink-0 rounded-full shadow-[0_0_0_5px_color-mix(in_srgb,currentColor_13%,transparent)] ${
                selected ? "opacity-100" : "opacity-70"
              }`}
              style={{ backgroundColor: mood.tone, color: mood.tone }}
            />
            {selected && (
              <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--c-accent)] text-[0.7rem] font-semibold leading-none text-[color:var(--c-on-accent)]">
                ✓
              </span>
            )}
            <span className="min-w-0 pt-5">
              <span className="block text-sm font-medium leading-5 text-[color:var(--c-text)]">
                {mood.label}
              </span>
              <span className="block text-xs leading-5 text-[color:var(--c-text-soft)]">
                {mood.detail}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ReadingBriefRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] border border-[color:var(--c-border)]/70 bg-[color:color-mix(in_srgb,var(--c-surface-well)_46%,transparent)] px-3 py-2">
      <p className="text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[color:var(--c-text-dim)]">
        {label}
      </p>
      <p className="mt-1 text-sm leading-6 text-[color:var(--c-text)]">{value}</p>
    </div>
  );
}

function ThinkingDots() {
  return (
    <span aria-hidden="true" className="inline-flex items-center gap-1">
      {[0, 1, 2].map((dot) => (
        <span
          className="ora-thinking-dot h-1.5 w-1.5 rounded-full bg-[color:var(--c-accent)]"
          key={dot}
          style={{
            animation: "oraThinkingDot 1s ease-in-out infinite",
            animationDelay: `${dot * 140}ms`,
          }}
        />
      ))}
    </span>
  );
}
