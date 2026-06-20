export type Language = "en" | "zh";

type SearchParamValue = string | string[] | undefined;

export const LANGUAGE_STORAGE_KEY = "aiTarot:language";

export const dictionary = {
  en: {
    back: "Back",
    home: "Reading Room",
    homeTitle: "Ora Arcana Reading Room",
    homeSubtitle: "Ora, your AI Tarot Interpreter",
    homeDescription:
      "A quiet AI-assisted tarot space for symbolic reflection, card interpretation, and structured insight.",
    homePhysicalTitle: "Use a Physical Deck",
    homePhysicalDescription:
      "Draw a card by hand, then let Ora help interpret it in relation to your question.",
    homeOnlineTitle: "Draw Online",
    homeOnlineDescription:
      "Begin with a single-card online draw and receive a structured tarot interpretation.",
    entranceDesk: "For reflection only",
    readingRoom: "Reading Room",
    centerTitle: "Center Before You Ask",
    centerDescription:
      "Before forming your question, take a quiet moment to settle your attention.",
    quietNote: "Quiet Note",
    centerBreath:
      "Take three slow breaths. Let the noise around the question soften.",
    centerContinue: "When you are ready, continue to write your question.",
    preparePhysical:
      "Take a breath. Set your intention. The reading begins when you're ready.",
    prepareOnline:
      "Take a breath. Set your intention. The reading begins when you're ready.",
    prepareRitualPromptPhysical: [
      "Take a breath.",
      "Set your intention.",
      "The reading begins when you're ready.",
    ],
    prepareRitualPromptOnline: [
      "Take a breath.",
      "Set your intention.",
      "The reading begins when you're ready.",
    ],
    prepareStepBreathMain: "Take a breath.",
    prepareStepBreathSub:
      "Let your attention return to this moment before the reading begins.",
    prepareStepSettleMain: "Set your intention.",
    prepareStepSettleSub:
      "Hold the question quietly without forcing an answer.",
    prepareStepReadyPhysicalMain: "The reading begins when you're ready.",
    prepareStepReadyPhysicalSub:
      "Keep your question close as you move toward the deck.",
    prepareStepReadyOnlineMain: "The reading begins when you're ready.",
    prepareStepReadyOnlineSub:
      "Keep your question close as you enter the online draw.",
    prepareStepContinue: "Continue",
    continueToQuestion: "Continue",
    askEyebrow: "Reading Question",
    askTitle: "Ask your question.",
    askDescription: "Speak plainly. The cards respond to truth.",
    readingNote: "Reading Note",
    askPlaceholder: "What is it that you seek to understand...",
    askHint: "Try to ask a real, specific question about this moment.",
    askRitualPrompt: [
      "Speak plainly.",
      "Stay close to what is true.",
      "A clear question opens a clearer reading.",
    ],
    askError: "Please write a question before continuing.",
    continueToRitual: "Continue to Draw",
    yourQuestion: "Your Question",
    keepQuestion:
      "Keep your question gently in mind as you move through the ritual.",
    onlineDraw: "Online Draw",
    drawOnline: "Online Draw",
    onlineDrawDescription:
      "Shuffle, cut, and draw before the card is revealed.",
    shuffle: "Shuffle",
    cut: "Cut",
    draw: "Draw",
    shuffleAction: "Shuffle",
    cutAction: "Cut the Deck",
    drawAction: "Draw Card",
    drawStepShuffleTitle: "Shuffle the deck.",
    drawStepShuffleLine1: "Hold the deck in both hands.",
    drawStepShuffleLine2: "Feel its weight.",
    drawStepCutTitle: "Cut the deck.",
    drawStepCutLine1: "Divide the deck into two halves.",
    drawStepCutLine2: "Trust your hands.",
    drawStepDrawTitle: "Draw your card.",
    drawStepDrawLine1: "Set your question in your mind.",
    drawStepDrawLine2: "Draw the top card.",
    onlineShuffleDescription:
      "Hold the deck in both hands. Feel its weight.",
    onlineCutDescription: "Divide the deck into two halves. Trust your hands.",
    onlineDrawStepDescription:
      "Set your question in your mind. Draw the top card.",
    revealCard: "Reveal this card",
    revealReading: "Reveal Reading",
    physicalDeck: "Physical Deck",
    physicalDrawTitle: "Draw from your physical deck.",
    physicalDrawDescription:
      "Move through the same ritual by hand, then select the card you drew.",
    prepareStep: "Prepare",
    prepareDeck: "Prepare your physical deck and place it in front of you.",
    shuffleDeck:
      "Shuffle your physical deck slowly while keeping your question in mind.",
    cutDeck:
      "Cut the deck once, or in the way that feels natural to your reading practice.",
    drawDeck:
      "Draw one card from your deck. Keep it face down until you are ready to select it here.",
    selectSameCard: "When you are ready, select the same card in the guide.",
    haveDrawnCard: "I have drawn my card",
    physicalCardMode: "Physical Card Mode",
    onlineDrawMode: "Online Draw Mode",
    revealPhysicalTitle: "Reveal your physical card.",
    revealPhysicalDescription:
      "Select the card you drew from your physical deck.",
    revealOnlineTitle: "Reveal this card.",
    revealOnlineDescription: "What you drew is already part of you.",
    noCardDrawn: "No card was found.",
    noCardDrawnDescription:
      "Return to the draw and complete the ritual again.",
    backToDraw: "Back to Draw",
    cardIsDrawn: "Reveal this card.",
    cardIsDrawnDescription: "What you drew is already part of you.",
    onlineDeck: "Online Deck",
    onlineDeckDescription: "A single card waits at the center of the room.",
    openReading: "Reveal Reading",
    readingDossier: "Reading",
    readingType: "Reading Type",
    singleCardReading: "Single Card Reading",
    threeCardSpread: "Three Card Spread",
    threeCardSituation: "Situation",
    threeCardChallenge: "Challenge",
    threeCardGuidance: "Guidance",
    threeCardsAreDrawn: "Your three cards are drawn.",
    threeCardsAreDrawnDescription:
      "Read them as situation, challenge, and guidance before opening the full reflection.",
    yourThreeCards: "Your Three Cards",
    cardByCardMeaning: "Card-by-card meaning",
    overallMessage: "Overall Message",
    practicalGuidance: "Practical Guidance",
    threeCardOverallFallback:
      "This spread is a symbolic map of the question: first name the situation, then notice the challenge, then carry the guidance into one grounded choice.",
    threeCardPracticalFallback:
      "Choose one small action that honors the guidance card, and revisit the challenge card before making a rushed decision.",
    saveToJournal: "Save to Journal",
    readingMode: "Reading Mode",
    cardOrientation: "Card Orientation",
    upright: "Upright",
    theCard: "The Card",
    coreInterpretation: "Core Interpretation",
    situationMapping: "Situation Mapping",
    readingReflection: "Reading Reflection",
    quietSuggestion: "Quiet Suggestion",
    reflectionPrompt: "Reflection Prompt",
    aiPersonalizedReading: "AI Personalized Reading",
    aiReadingTitle: "This Reading",
    aiReadingLoading: "Preparing a personalized reflection...",
    aiReadingUnavailable:
      "The personalized AI reading is temporarily unavailable. Your static reading remains available below.",
    aiFallbackNoticeTitle: "System fallback reading",
    aiFallbackNoticeBody:
      "The live AI reader was unavailable, so Ora saved this fallback reflection instead. No credit was used.",
    aiRetryReading: "Regenerate Reading",
    aiFollowUpSoon: "Follow-up questions will be supported soon.",
    aiFollowUpPlaceholder: "Continue the conversation soon...",
    aiSummary: "Summary",
    aiDirectAnswer: "Direct Answer",
    aiCardMeaning: "Card Meaning",
    aiCardMessage: "Card Message",
    aiSituationReading: "For Your Question",
    aiHiddenTension: "Hidden Tension",
    aiAdvice: "Advice",
    aiNextStep: "Next Step",
    aiReflectionQuestion: "Reflection Question",
    cardReference: "Card Reference",
    showCardReference: "Open Card Reference",
    closingNote: "Closing Note",
    startAnotherReading: "Start a New Reading",
    returnToReadingRoom: "Return to Reading Room",
    noQuestion: "No question was recorded for this reading.",
    readingCard: "Reading the card",
    gatheringReading: "Gathering your saved card and question.",
    preparingMessage: "Preparing your reading...",
    invalidReadingTitle: "No card was found.",
    invalidReadingDescription:
      "Return to the reading room and begin again.",
    reflectionFallback: "What is this card asking you to notice?",
    closingReflection:
      "This reading is a symbolic reflection, not a fixed prediction. Use it as a quiet prompt for attention, choice, and self-understanding.",
    disclaimer:
      "Tarot readings on this site are symbolic reflections for personal insight. They are not medical, legal, financial, or psychological advice, and they should not replace professional support.",
    selectCardTitle: "Select the Card You Drew",
    selectCardDescription:
      "Choose the same card you just drew from your physical deck.",
    preparingCardList: "Preparing the card list...",
    readingsBack: "Back to Reading Room",
    readingsEyebrow: "Reading Journal",
    readingsTitle: "Reading Journal",
    readingsIntro:
      "A quiet archive of your questions, cards, and Ora's interpretations. Your saved readings are kept here for later reflection.",
    readingsAuthTitle: "Reading Account Required",
    readingsAuthBody:
      "Return to the Reading Room and sign in from your Reading Account to view your saved readings.",
    readingsAuthNote: "Your readings are saved when you are signed in.",
    readingsReturn: "Return to Reading Room",
    readingsLoadError: "The journal could not open right now.",
    readingsErrorBody: "Please return to the Reading Room or try again later.",
    readingsEmptyTitle: "Your journal is quiet for now.",
    readingsEmptyBody:
      "Begin a reading, and your saved interpretation will appear here for later reflection.",
    readingsEmptyCta: "Begin a Reading",
    readingsLatest: "Latest 20 saved readings",
    readingsSavedCard: "Saved Card",
    readingsQuestionLabel: "Question",
    readingsNoQuestion: "No question was recorded.",
    readingsInterpretationLabel: "Ora's interpretation",
    readingsFallbackBadge: "Fallback",
    readingsFallbackNote:
      "System fallback saved because the live AI reader was unavailable. No credit was used.",
    readingsModePhysical: "Physical Deck",
    readingsModeOnline: "Online Draw",
    readingsModeFallback: "Reading",
    readingsSpreadSingle: "Single Card",
    readingsOrientationUpright: "Upright",
    readingsSummaryFallback: "Saved reading",
  },
  zh: {
    back: "返回",
    home: "阅读室",
    homeTitle: "Ora Arcana",
    homeSubtitle: "牌中藏着你尚未说出口的事。",
    homeDescription: "一个安静的反思空间。进入，让解读开始。",
    homePhysicalTitle: "使用你的实体牌组",
    homePhysicalDescription: "扫描你的牌组上的二维码",
    homeOnlineTitle: "在线抽牌",
    homeOnlineDescription: "让算法为你选择",
    entranceDesk: "仅供反思",
    readingRoom: "阅读室",
    centerTitle: "提问之前，先安静下来",
    centerDescription:
      "在形成问题之前，给自己一个短暂的停顿，让注意力慢慢安定。",
    quietNote: "安静便笺",
    centerBreath: "慢慢呼吸三次。让围绕问题的杂音先放轻一点。",
    centerContinue: "准备好之后，继续写下你的问题。",
    preparePhysical:
      "先安静下来。把问题放在心里。准备好时，解读开始。",
    prepareOnline:
      "先安静下来。把问题放在心里。准备好时，解读开始。",
    prepareRitualPromptPhysical: [
      "先安静下来。",
      "把问题放在心里。",
      "准备好时，解读开始。",
    ],
    prepareRitualPromptOnline: [
      "先安静下来。",
      "把问题放在心里。",
      "准备好时，解读开始。",
    ],
    prepareStepBreathMain: "先安静下来。",
    prepareStepBreathSub: "让注意力回到当下，给解读一个安静的入口。",
    prepareStepSettleMain: "把问题放在心里。",
    prepareStepSettleSub: "不急着寻找答案，先诚实地看见问题本身。",
    prepareStepReadyPhysicalMain: "准备好时，解读开始。",
    prepareStepReadyPhysicalSub: "带着这个问题，进入你的实体牌组。",
    prepareStepReadyOnlineMain: "准备好时，解读开始。",
    prepareStepReadyOnlineSub: "带着这个问题，进入在线抽牌。",
    prepareStepContinue: "继续",
    continueToQuestion: "继续",
    askEyebrow: "解读问题",
    askTitle: "提出你的问题。",
    askDescription: "诚实地描述你的问题，牌会回应真实。",
    readingNote: "解读便笺",
    askPlaceholder: "你想理解什么？",
    askHint: "尽量提出一个真实、具体、当下的问题。",
    askRitualPrompt: [
      "诚实地描述。",
      "靠近真实。",
      "清晰的问题，会打开更清晰的解读。",
    ],
    askError: "请先写下一个问题，再继续。",
    continueToRitual: "继续抽牌",
    yourQuestion: "你的问题",
    keepQuestion: "在接下来的步骤中，轻轻记住你的问题。",
    onlineDraw: "在线抽牌",
    drawOnline: "在线抽牌",
    onlineDrawDescription: "在揭示之前，依次完成洗牌、切牌与抽牌。",
    shuffle: "洗牌",
    cut: "切牌",
    draw: "抽牌",
    shuffleAction: "洗牌",
    cutAction: "切牌",
    drawAction: "抽牌",
    drawStepShuffleTitle: "洗牌。",
    drawStepShuffleLine1: "把问题放在心里。",
    drawStepShuffleLine2: "让牌面重新归位。",
    drawStepCutTitle: "切牌。",
    drawStepCutLine1: "把牌分为两半。",
    drawStepCutLine2: "相信你的直觉。",
    drawStepDrawTitle: "抽取你的牌。",
    drawStepDrawLine1: "在心中设定你的问题。",
    drawStepDrawLine2: "抽取顶牌。",
    onlineShuffleDescription: "把问题放在心里。让牌面重新归位。",
    onlineCutDescription: "把牌分为两半。相信你的直觉。",
    onlineDrawStepDescription: "在心中设定你的问题。抽取顶牌。",
    revealCard: "揭示这张牌",
    revealReading: "查看解读",
    physicalDeck: "实体牌组",
    physicalDrawTitle: "从你的实体牌组抽牌。",
    physicalDrawDescription:
      "用手完成同样的仪式，然后选择你抽到的那张牌。",
    prepareStep: "准备",
    prepareDeck: "准备你的实体牌组，并把它放在面前。",
    shuffleDeck: "一边记住你的问题，一边慢慢洗牌。",
    cutDeck: "切一次牌，或按照你熟悉的解读方式切牌。",
    drawDeck: "从牌组中抽出一张牌。先保持牌面向下，直到准备好在这里选择它。",
    selectSameCard: "准备好之后，在指引中选择同一张牌。",
    haveDrawnCard: "我已经抽出我的牌",
    physicalCardMode: "实体牌模式",
    onlineDrawMode: "在线抽牌模式",
    revealPhysicalTitle: "选择你抽到的实体牌。",
    revealPhysicalDescription: "请选择你从实体牌组中抽到的那一张牌。",
    revealOnlineTitle: "揭示这张牌。",
    revealOnlineDescription: "你抽到的，已经与你有关。",
    noCardDrawn: "没有找到牌。",
    noCardDrawnDescription: "请返回抽牌步骤，重新完成仪式。",
    backToDraw: "返回抽牌",
    cardIsDrawn: "揭示这张牌。",
    cardIsDrawnDescription: "你抽到的，已经与你有关。",
    onlineDeck: "在线牌组",
    onlineDeckDescription: "一张牌正在阅读室中央等待。",
    openReading: "查看解读",
    readingDossier: "解读",
    readingType: "解读类型",
    singleCardReading: "单牌解读",
    threeCardSpread: "三牌阵",
    threeCardSituation: "处境",
    threeCardChallenge: "挑战",
    threeCardGuidance: "指引",
    threeCardsAreDrawn: "你的三张牌已经抽出。",
    threeCardsAreDrawnDescription:
      "先把它们作为处境、挑战与指引来阅读，再进入完整反思。",
    yourThreeCards: "你的三张牌",
    cardByCardMeaning: "逐张牌义",
    overallMessage: "整体信息",
    practicalGuidance: "实际指引",
    threeCardOverallFallback:
      "这组三牌阵是一张关于问题的象征地图：先看清处境，再辨认挑战，最后把指引带入一个踏实的选择。",
    threeCardPracticalFallback:
      "选择一个能回应指引牌的小行动；在急着决定之前，再回看挑战牌提醒你的地方。",
    saveToJournal: "保存到日志",
    readingMode: "解读模式",
    cardOrientation: "牌面方向",
    upright: "正位",
    theCard: "抽到的牌",
    coreInterpretation: "核心解读",
    situationMapping: "情境映射",
    readingReflection: "牌面解读",
    quietSuggestion: "安静建议",
    reflectionPrompt: "反思提示",
    aiPersonalizedReading: "AI 个性化解读",
    aiReadingTitle: "本次解读",
    aiReadingLoading: "正在准备个性化解读...",
    aiReadingUnavailable: "AI 个性化解读暂时不可用。下方静态阅读仍可正常查看。",
    aiFallbackNoticeTitle: "系统备用解读",
    aiFallbackNoticeBody:
      "实时 AI 解读暂时不可用，因此 Ora 保存了这份备用反思。本次没有消耗额度。",
    aiRetryReading: "重新生成解读",
    aiFollowUpSoon: "继续追问功能即将支持",
    aiFollowUpPlaceholder: "很快可以继续追问...",
    aiSummary: "概要",
    aiDirectAnswer: "直接回应",
    aiCardMeaning: "牌面含义",
    aiCardMessage: "牌的提示",
    aiSituationReading: "对应你的问题",
    aiHiddenTension: "隐藏张力",
    aiAdvice: "建议",
    aiNextStep: "下一步",
    aiReflectionQuestion: "反思问题",
    cardReference: "牌面资料",
    showCardReference: "展开牌面资料",
    closingNote: "结束说明",
    startAnotherReading: "开始新的解读",
    returnToReadingRoom: "返回阅读室",
    noQuestion: "这次解读没有记录问题。",
    readingCard: "正在读取牌面",
    gatheringReading: "正在整理保存的牌与问题。",
    preparingMessage: "正在准备你的解读...",
    invalidReadingTitle: "没有找到牌。",
    invalidReadingDescription: "你可以返回阅读室，重新开始一次解读。",
    reflectionFallback: "这张牌正在提醒你注意什么？",
    closingReflection:
      "这次解读是一份象征性的反思，而不是固定预测。请把它作为关于注意力、选择与自我理解的安静提示。",
    disclaimer:
      "本站的塔罗解读用于个人洞察与反思，不构成医疗、法律、财务或心理建议，也不能替代专业支持。",
    selectCardTitle: "选择你抽到的牌",
    selectCardDescription: "请选择你刚刚从实体牌组中抽到的那一张牌。",
    preparingCardList: "正在准备牌表...",
    readingsBack: "返回阅读室",
    readingsEyebrow: "解读记录",
    readingsTitle: "解读记录",
    readingsIntro:
      "这里安静地存放着你的问题、抽到的牌，以及 Ora 的解读。已保存的解读都收在这里，方便日后回看与反思。",
    readingsAuthTitle: "需要登录解读账户",
    readingsAuthBody:
      "请返回阅读室，从你的解读账户登录，即可查看已保存的解读。",
    readingsAuthNote: "在登录状态下，你的解读才会被保存。",
    readingsReturn: "返回阅读室",
    readingsLoadError: "解读记录暂时无法打开。",
    readingsErrorBody: "请返回阅读室，或稍后再试。",
    readingsEmptyTitle: "你的解读记录暂时还很安静。",
    readingsEmptyBody:
      "开始一次解读，保存后的解读内容会出现在这里，供你日后回看与反思。",
    readingsEmptyCta: "开始一次解读",
    readingsLatest: "最近保存的 20 条解读",
    readingsSavedCard: "已保存的牌",
    readingsQuestionLabel: "你的问题",
    readingsNoQuestion: "这次解读没有记录问题。",
    readingsInterpretationLabel: "Ora 的解读",
    readingsFallbackBadge: "备用解读",
    readingsFallbackNote:
      "实时 AI 解读不可用时保存的系统备用反思。本次没有消耗额度。",
    readingsModePhysical: "实体牌组",
    readingsModeOnline: "在线抽牌",
    readingsModeFallback: "解读",
    readingsSpreadSingle: "单牌",
    readingsOrientationUpright: "正位",
    readingsSummaryFallback: "已保存的解读",
  },
} as const;

export function normalizeLanguage(value: SearchParamValue): Language {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "zh" ? "zh" : "en";
}

export function text(lang: Language) {
  return dictionary[lang];
}

export function languageLabel(lang: Language) {
  return lang === "zh" ? "中文" : "EN";
}

export function withLang(
  pathname: string,
  params: Record<string, string | undefined>,
  lang: Language,
) {
  const nextParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      nextParams.set(key, value);
    }
  });

  nextParams.set("lang", lang);
  return `${pathname}?${nextParams.toString()}`;
}

export function getGroupTitle(title: string, lang: Language) {
  if (lang === "en") {
    return title;
  }

  const titles: Record<string, string> = {
    "Major Arcana": "大阿卡那",
    Wands: "权杖",
    Cups: "圣杯",
    Swords: "宝剑",
    Pentacles: "星币",
  };

  return titles[title] ?? title;
}
