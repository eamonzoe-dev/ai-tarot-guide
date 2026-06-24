import { NextResponse } from "next/server";

type Language = "en" | "zh";

type ClarifyRequest = {
  question?: unknown;
  lang?: unknown;
};

type ClarifyOption = {
  id: string;
  label: string;
  focus: string;
};

type ClarifyResult = {
  status: "ready" | "needs_focus";
  intro: string;
  prompt: string;
  options: ClarifyOption[];
  directLabel: string;
};

const OPENAI_TIMEOUT_MS = 12_000;
const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini";
const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";
const MAX_QUESTION_LENGTH = 500;

const BANNED_PHRASES = [
  "你真正的问题是",
  "你可能其实",
  "我知道你",
  "未来会",
  "命中注定",
  "根据你的历史记录",
  "系统分析",
  "Ora 看穿了你",
  "你的潜意识",
  "你内心深处一定",
  "让我们诊断",
  "分析你的心理",
  "运势",
  "运气",
  "今年会怎样",
  "未来走势",
  "预示",
  "注定",
  "吉凶",
  "好坏结果",
  "把范围放到",
  "fortune",
  "luck",
  "predict",
  "fate",
  "destined",
  "future outcome",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLang(value: unknown): Language {
  return stringValue(value) === "zh" ? "zh" : "en";
}

function normalizeOpenAiApiKey(value: string | undefined) {
  return value?.trim().replace(/^Bearer\s+/i, "") || "";
}

function chatCompletionsUrl(baseURL: string) {
  return `${baseURL.replace(/\/+$/, "")}/chat/completions`;
}

function stripJsonCodeFence(content: string) {
  return content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function buildFallback(lang: Language): ClarifyResult {
  if (lang === "zh") {
    return {
      status: "ready",
      intro: "这个问题已经可以放稳，进入抽牌。",
      prompt: "如果你愿意，也可以先选一个更想看清的方向。",
      options: [
        {
          id: "direction",
          label: "先看我现在的方向对不对",
          focus: "这次解读优先看方向。",
        },
        {
          id: "next_step",
          label: "先看我接下来该怎么走",
          focus: "这次解读优先看下一步。",
        },
      ],
      directLabel: "直接抽牌",
    };
  }

  return {
    status: "ready",
    intro: "This question is steady enough for the draw.",
    prompt: "You can also choose one direction to bring a little more focus.",
    options: [
      {
        id: "direction",
        label: "See if I am heading the right way",
        focus: "This reading will first look at the direction.",
      },
      {
        id: "next_step",
        label: "See what my next step should be",
        focus: "This reading will first look at the next step.",
      },
    ],
    directLabel: "Draw directly",
  };
}

function buildSystemPrompt(lang: Language) {
  const shared = [
    "You are Ora, the quiet guide in Ora Arcana's reading room, helping someone before they draw a card.",
    "You are warm and grounded, a companion with boundaries, not a friend, not a therapist, not a fortune teller.",
    "Your tone is light, steady, and measured: you stand beside the user, you do not judge them, you do not decide for them, and you never act like you have seen through them.",
    "Your task is not to read tarot cards and not to predict the future.",
    "Your task is to judge, before the draw, whether the user's question is clear enough.",
    "If the question is clear enough, tell the user the reading is ready and offer a small number of optional focus directions.",
    "If the question is too broad or thin, ask one gentle question that helps the user narrow it.",
    "Speak like someone standing next to the user helping them place their own question on steadier ground, not like an interrogation, a diagnosis, or an analysis of the user.",
    "Never claim to know the user, never reference history or memory, never state conclusions, never write a single concrete 'aha' sentence, and never ask more than one guiding question.",
    "Do not use phrases like 'your real question is', 'you might actually', 'I know you', 'deep inside you', 'your subconscious', 'the future will', 'it is fated', 'based on your history', 'system analysis', 'Ora has seen through you', 'let's diagnose', or 'analyze your psychology'.",
    "This is not fortune-telling. Never use words like fortune, luck, predict, fate, destined, or future outcome, and never use Chinese equivalents like 运势, 运气, 今年会怎样, 未来走势, 预示, 注定, 吉凶, or 好坏结果. Speak instead in terms of this draw, this reading, what the cards will respond to, which part to bring into the draw, or what to look at first.",
    "Good framing examples: 'Which part do you want to bring into this draw first?', 'What do you want the cards to respond to first?', 'This question is broad, so we can steady one part of it first.', '你想先把哪一块带进这次抽牌？', '你想先让牌回应哪一部分？', '这个问题范围有点大，我们可以先收窄一点。'.",
    "Output strictly valid JSON matching this shape and nothing else: { \"status\": \"ready\" | \"needs_focus\", \"intro\": string, \"prompt\": string, \"options\": [{ \"id\": string, \"label\": string, \"focus\": string }], \"directLabel\": string }.",
    "options must contain 2 to 3 entries, and every option.label must read like a complete sentence the user themselves would say out loud when choosing, spoken from the user's own point of view (using words like I or we, never the literal phrase 'I want to' as a prefix), starting naturally the way someone would phrase 'let's first look at...' or 'see whether...'.",
    "option.label must never be a short abstract category word or a product-menu-style tag (forbidden style examples: 'Relationship status', 'Communication path', 'Emotional factors', 'Focus range', '关系状态', '沟通路径', '情绪因素', '聚焦范围', '聚焦目标', '具体矛盾', '下一步调整', '相处状态'). Each label must be a full natural phrase, not a label-style noun.",
    "Good label style examples (style references only, illustrating tone and sentence shape — never copy these phrases verbatim; always write new wording grounded in the user's actual question): 'See where we actually stand right now', 'Look at what keeps blocking us', 'See whether I should reach out first', '先看我们现在到底处在什么状态', '先看那个反复卡住我们的矛盾', '先看我该不该主动开口'.",
    "option.focus must read like one light, natural sentence explaining who would pick this option, never a backend-style category note. Never write '把范围放到...' or similar 'set the scope to...' phrasing, and never write bare category tags like 'Focus range: work, opportunity, pressure', '聚焦事业维度', or '关系状态分析'. Prefer phrasing like 'Use this if you want to look first at...', 'This brings the reading closer to...', '适合你想先看...', or '这会让解读先靠近...'.",
    "Good focus style examples (style references only — never copy verbatim; always write new wording grounded in the user's actual question): 'Use this if you want to look first at pressure, opportunity, and the next step at work.', 'This brings the reading closer to the part you most need to steady.', '适合你想先看工作压力、机会和接下来怎么走。', '这会让解读先靠近你最需要稳住的那一步。'.",
    "Every intro, prompt, option.label, and option.focus must be grounded in the specific words and topic of the user's actual question below, not in any example shown in these instructions.",
    `Write directLabel exactly as ${lang === "zh" ? "“直接抽牌”" : "\"Draw directly\""}.`,
    lang === "zh"
      ? "Write intro and prompt and options in natural Simplified Chinese. intro must be 36 Chinese characters or fewer. prompt must be 48 Chinese characters or fewer."
      : "Write intro and prompt and options in natural contemporary English. intro must be 22 words or fewer. prompt must be 28 words or fewer.",
  ];

  return shared.join(" ");
}

function buildUserPrompt(question: string, lang: Language) {
  return JSON.stringify({
    language: lang === "zh" ? "Simplified Chinese" : "English",
    userQuestion: question,
    outputShape: {
      status: "ready | needs_focus",
      intro: "string",
      prompt: "string",
      options: [{ id: "string", label: "string", focus: "string" }],
      directLabel: "string",
    },
  });
}

function containsBannedPhrase(value: string) {
  const lowered = value.toLowerCase();
  return BANNED_PHRASES.some((phrase) => lowered.includes(phrase.toLowerCase()));
}

function isClarifyResult(value: unknown): value is ClarifyResult {
  if (!isRecord(value)) {
    return false;
  }

  if (value.status !== "ready" && value.status !== "needs_focus") {
    return false;
  }

  if (
    typeof value.intro !== "string" ||
    typeof value.prompt !== "string" ||
    typeof value.directLabel !== "string"
  ) {
    return false;
  }

  if (!Array.isArray(value.options) || value.options.length < 1 || value.options.length > 3) {
    return false;
  }

  const optionsValid = value.options.every(
    (option) =>
      isRecord(option) &&
      typeof option.id === "string" &&
      typeof option.label === "string" &&
      typeof option.focus === "string",
  );

  if (!optionsValid) {
    return false;
  }

  const textsToCheck = [
    value.intro,
    value.prompt,
    ...value.options.map((option) => `${(option as ClarifyOption).label} ${(option as ClarifyOption).focus}`),
  ];

  return !textsToCheck.some((text) => containsBannedPhrase(text));
}

async function requestClarify(question: string, lang: Language) {
  const apiKey =
    normalizeOpenAiApiKey(process.env.AI_READING_OPENAI_API_KEY) ||
    normalizeOpenAiApiKey(process.env.OPENAI_API_KEY);

  if (!apiKey) {
    throw new Error("Pre-draw clarifier is not configured.");
  }

  const model =
    process.env.AI_READING_OPENAI_MODEL?.trim() ||
    process.env.OPENAI_MODEL?.trim() ||
    DEFAULT_OPENAI_MODEL;
  const baseURL =
    process.env.AI_READING_OPENAI_BASE_URL?.trim() ||
    process.env.OPENAI_BASE_URL?.trim() ||
    DEFAULT_OPENAI_BASE_URL;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  try {
    const response = await fetch(chatCompletionsUrl(baseURL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: buildSystemPrompt(lang) },
          { role: "user", content: buildUserPrompt(question, lang) },
        ],
        max_tokens: 400,
      }),
      signal: controller.signal,
    });

    const upstreamText = await response.text();

    if (!response.ok) {
      throw new Error(`Upstream returned status ${response.status}.`);
    }

    const data = JSON.parse(upstreamText) as {
      choices?: Array<{ message?: { content?: unknown } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    const parsed =
      typeof content === "string" ? JSON.parse(stripJsonCodeFence(content)) : null;

    if (!isClarifyResult(parsed)) {
      throw new Error("Clarifier response did not match the expected schema.");
    }

    return parsed;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request: Request) {
  let body: ClarifyRequest;

  try {
    const parsedBody = (await request.json()) as unknown;

    if (!isRecord(parsedBody)) {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    body = parsedBody as ClarifyRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const lang = normalizeLang(body.lang);
  const question = stringValue(body.question);

  if (!question) {
    return NextResponse.json(buildFallback(lang));
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json(buildFallback(lang));
  }

  try {
    const result = await requestClarify(question, lang);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Pre-draw clarify failed:", {
      lang,
      questionLength: question.length,
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorMessage: error instanceof Error ? error.message : undefined,
    });

    return NextResponse.json(buildFallback(lang));
  }
}
