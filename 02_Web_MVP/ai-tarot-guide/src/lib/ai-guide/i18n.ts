export type Language = "en" | "zh";

type SearchParamValue = string | string[] | undefined;

export const LANGUAGE_STORAGE_KEY = "aiTarot:language";

export const dictionary = {
  en: {
    back: "Back",
    home: "Reading Room",
    homeTitle: "AI Tarot Guide",
    homeSubtitle:
      "A quiet symbolic reading room for physical and online tarot.",
    homeDescription:
      "Choose how you would like to begin your single-card reading.",
    homePhysicalTitle: "Use your own physical deck",
    homePhysicalDescription:
      "Shuffle, cut, and draw by hand, then select the card here.",
    homeOnlineTitle: "Draw a card inside the atelier",
    homeOnlineDescription:
      "Move through shuffle, cut, draw, and reveal before the reading.",
    entranceDesk: "Entrance Desk",
    readingRoom: "Reading Room",
    centerTitle: "Center Before You Ask",
    centerDescription:
      "Before forming your question, take a quiet moment to settle your attention.",
    quietNote: "Quiet Note",
    centerBreath:
      "Take three slow breaths. Let the noise around the question soften.",
    centerContinue: "When you are ready, continue to write your question.",
    preparePhysical:
      "You will use your own physical deck after this step. For now, simply settle your attention before shaping the question.",
    prepareOnline:
      "The online deck will open after your question is formed. For now, take a quiet pause before beginning the ritual.",
    prepareRitualPromptPhysical: [
      "Take a breath.",
      "Let the noise settle.",
      "Prepare your deck when you are ready.",
    ],
    prepareRitualPromptOnline: [
      "Take a breath.",
      "Let the noise settle.",
      "Enter the online draw when you are ready.",
    ],
    prepareStepBreathMain: "Take a breath.",
    prepareStepBreathSub:
      "Breathe slowly three times and return your attention to this moment.",
    prepareStepSettleMain: "Let the noise settle.",
    prepareStepSettleSub:
      "Do not rush toward an answer. Let the question become clear first.",
    prepareStepReadyPhysicalMain: "Prepare your physical deck.",
    prepareStepReadyPhysicalSub:
      "Next, you will shuffle, cut, and draw one card with your question in mind.",
    prepareStepReadyOnlineMain: "Prepare for the online draw.",
    prepareStepReadyOnlineSub:
      "Next, the deck will move through shuffle, cut, and draw.",
    prepareStepContinue: "Continue",
    continueToQuestion: "Continue to Question",
    askEyebrow: "Reading Question",
    askTitle: "Ask Your Question",
    askDescription:
      "Write one clear question. A single-card reading works best when the question is focused, open-ended, and personally meaningful.",
    readingNote: "Reading Note",
    askPlaceholder: "What should I pay attention to right now?",
    askHint:
      "Try asking what you should understand, notice, or approach - not what is guaranteed to happen.",
    askRitualPrompt: [
      "Hold one question gently.",
      "Ask for clarity, not control.",
      "A clear question opens a clearer reading.",
    ],
    askError: "Please write a question before continuing.",
    continueToRitual: "Continue to the Ritual",
    yourQuestion: "Your Question",
    keepQuestion:
      "Keep your question gently in mind as you move through the ritual.",
    onlineDraw: "Online Draw",
    drawOnline: "Draw Online",
    onlineDrawDescription:
      "Move through a simple online ritual before opening the reading.",
    shuffle: "Shuffle",
    cut: "Cut",
    draw: "Draw",
    shuffleAction: "SHUFFLE",
    cutAction: "CUT",
    drawAction: "DRAW",
    onlineShuffleDescription: "Quiet the deck and return to your question.",
    onlineCutDescription: "Mark the moment of choice.",
    onlineDrawStepDescription: "Draw one card from the online deck.",
    revealCard: "Reveal the Card",
    physicalDeck: "Physical Deck",
    physicalDrawTitle: "Ritual Step",
    physicalDrawDescription:
      "Move through one card with a slow, deliberate physical sequence.",
    prepareStep: "Prepare",
    prepareDeck: "Prepare your physical deck and place it in front of you.",
    shuffleDeck:
      "Shuffle your physical deck slowly while keeping your question in mind.",
    cutDeck:
      "Cut the deck once, or in the way that feels natural to your reading practice.",
    drawDeck:
      "Draw one card from your deck. Keep it face down until you are ready to select it here.",
    selectSameCard: "When you are ready, select the same card in the guide.",
    haveDrawnCard: "I HAVE DRAWN MY CARD",
    physicalCardMode: "Physical Card Mode",
    onlineDrawMode: "Online Draw Mode",
    revealPhysicalTitle: "Reveal Your Physical Card",
    revealPhysicalDescription:
      "Select the card you drew from your physical deck. The reading will be based on that card, your question, and the single-card format.",
    noCardDrawn: "No card has been drawn",
    noCardDrawnDescription:
      "Return to the ritual table and complete the draw step.",
    backToDraw: "BACK TO DRAW",
    cardIsDrawn: "The Card Is Drawn",
    cardIsDrawnDescription:
      "Your card has been drawn. Open the reading when you are ready to see the symbolic reflection.",
    onlineDeck: "Online Deck",
    onlineDeckDescription:
      "A single card has been drawn inside the atelier.",
    openReading: "Open the Reading",
    readingDossier: "Reading Dossier",
    readingType: "Reading Type",
    singleCardReading: "Single Card Reading",
    readingMode: "Reading Mode",
    cardOrientation: "Card Orientation",
    upright: "Upright",
    theCard: "The Card",
    readingReflection: "Reading Reflection",
    quietSuggestion: "Quiet Suggestion",
    reflectionPrompt: "Reflection Prompt",
    closingNote: "Closing Note",
    startAnotherReading: "Start Another Reading",
    returnToReadingRoom: "Return to Reading Room",
    noQuestion: "No question was recorded for this reading.",
    readingCard: "Reading the card",
    gatheringReading: "Gathering your saved card and question.",
    preparingMessage: "Preparing your message...",
    invalidReadingTitle: "The reading could not be opened.",
    invalidReadingDescription:
      "The selected card was not found. You can return to the reading room and begin again.",
    reflectionFallback: "What is this card asking you to notice?",
    closingReflection:
      "This reading is a symbolic reflection, not a fixed prediction. Use it as a quiet prompt for attention, choice, and self-understanding.",
    disclaimer:
      "Tarot readings on this site are symbolic reflections for personal insight. They are not medical, legal, financial, or psychological advice, and they should not replace professional support.",
    selectCardTitle: "Select the Card You Drew",
    selectCardDescription:
      "Choose the same card you just drew from your physical deck.",
    preparingCardList: "Preparing the card list...",
  },
  zh: {
    back: "返回",
    home: "阅读室",
    homeTitle: "AI 塔罗指引",
    homeSubtitle: "一间安静的塔罗象征阅读室，支持实体牌与线上抽牌。",
    homeDescription: "选择你想开始的单牌阅读方式。",
    homePhysicalTitle: "使用你的实体塔罗牌",
    homePhysicalDescription: "用自己的牌组洗牌、切牌、抽牌，然后在这里选择那张牌。",
    homeOnlineTitle: "在阅读室中线上抽一张牌",
    homeOnlineDescription: "依次完成洗牌、切牌、抽牌与揭示，再打开阅读结果。",
    entranceDesk: "入口桌面",
    readingRoom: "阅读室",
    centerTitle: "提问之前，先安静下来",
    centerDescription:
      "在形成问题之前，给自己一个短暂的停顿，让注意力慢慢安定。",
    quietNote: "安静便笺",
    centerBreath: "慢慢呼吸三次。让围绕问题的杂音先放轻一点。",
    centerContinue: "准备好之后，继续写下你的问题。",
    preparePhysical:
      "接下来你将使用自己的实体牌组。在此之前，先让注意力稳定下来，再形成问题。",
    prepareOnline:
      "线上牌组会在你写下问题后开启。现在，先给自己一个安静的停顿。",
    prepareRitualPromptPhysical: [
      "先让呼吸落下。",
      "让心里的杂音慢慢沉下去。",
      "准备好实体牌后，再进入提问。",
    ],
    prepareRitualPromptOnline: [
      "先让呼吸落下。",
      "让心里的杂音慢慢沉下去。",
      "准备好了，再进入在线抽牌。",
    ],
    prepareStepBreathMain: "先让呼吸落下。",
    prepareStepBreathSub: "慢慢呼吸三次，让注意力回到当下。",
    prepareStepSettleMain: "让心里的杂音慢慢沉下去。",
    prepareStepSettleSub: "不用急着寻找答案，先让问题变得清楚。",
    prepareStepReadyPhysicalMain: "准备好你的实体牌组。",
    prepareStepReadyPhysicalSub:
      "接下来你会带着这个问题洗牌、切牌，并抽出一张牌。",
    prepareStepReadyOnlineMain: "准备进入线上抽牌。",
    prepareStepReadyOnlineSub: "接下来牌组会依次完成洗牌、切牌与抽牌。",
    prepareStepContinue: "继续",
    continueToQuestion: "继续提问",
    askEyebrow: "阅读问题",
    askTitle: "写下你的问题",
    askDescription:
      "写下一个清晰的问题。单牌阅读更适合聚焦、开放，并且与你当下真实处境有关的问题。",
    readingNote: "阅读便笺",
    askPlaceholder: "我现在最需要注意什么？",
    askHint:
      "你可以询问自己需要理解什么、注意什么、如何面对，而不是询问某件事是否必然发生。",
    askRitualPrompt: [
      "只轻轻托住一个问题。",
      "求清晰，不求控制。",
      "问题越清晰，牌面越容易回应。",
    ],
    askError: "请先写下一个问题，再继续。",
    continueToRitual: "继续进入仪式",
    yourQuestion: "你的问题",
    keepQuestion: "在接下来的步骤中，轻轻记住你的问题。",
    onlineDraw: "线上抽牌",
    drawOnline: "线上抽牌",
    onlineDrawDescription: "在打开阅读之前，先完成一个简化的线上仪式。",
    shuffle: "洗牌",
    cut: "切牌",
    draw: "抽牌",
    shuffleAction: "洗牌",
    cutAction: "切牌",
    drawAction: "抽牌",
    onlineShuffleDescription: "让牌组安静下来，并回到你的问题。",
    onlineCutDescription: "标记这个选择的时刻。",
    onlineDrawStepDescription: "从线上牌组中抽出一张牌。",
    revealCard: "揭示这张牌",
    physicalDeck: "实体牌组",
    physicalDrawTitle: "仪式步骤",
    physicalDrawDescription: "以缓慢、清晰的顺序完成这次单牌阅读。",
    prepareStep: "准备",
    prepareDeck: "准备你的实体牌组，并把它放在面前。",
    shuffleDeck: "一边记住你的问题，一边慢慢洗牌。",
    cutDeck: "切一次牌，或按照你熟悉的阅读方式切牌。",
    drawDeck: "从牌组中抽出一张牌。先保持牌面向下，直到准备好在这里选择它。",
    selectSameCard: "准备好之后，在指引中选择同一张牌。",
    haveDrawnCard: "我已经抽出了我的牌",
    physicalCardMode: "实体牌模式",
    onlineDrawMode: "线上抽牌模式",
    revealPhysicalTitle: "选择你抽到的实体牌",
    revealPhysicalDescription: "请选择你从实体牌组中抽到的那一张牌。",
    noCardDrawn: "还没有抽出牌",
    noCardDrawnDescription: "请返回仪式桌面，完成抽牌步骤。",
    backToDraw: "返回抽牌",
    cardIsDrawn: "牌已经抽出",
    cardIsDrawnDescription:
      "你的牌已经抽出。准备好之后，打开这份象征阅读。",
    onlineDeck: "线上牌组",
    onlineDeckDescription: "一张牌已经在阅读室中抽出。",
    openReading: "打开阅读结果",
    readingDossier: "阅读档案",
    readingType: "阅读类型",
    singleCardReading: "单牌阅读",
    readingMode: "阅读模式",
    cardOrientation: "牌面方向",
    upright: "正位",
    theCard: "抽到的牌",
    readingReflection: "牌面解读",
    quietSuggestion: "安静建议",
    reflectionPrompt: "反思提示",
    closingNote: "结束说明",
    startAnotherReading: "重新开始一次阅读",
    returnToReadingRoom: "返回阅读室",
    noQuestion: "这次阅读没有记录问题。",
    readingCard: "正在读取牌面",
    gatheringReading: "正在整理保存的牌与问题。",
    preparingMessage: "正在准备你的阅读内容...",
    invalidReadingTitle: "无法打开这次阅读。",
    invalidReadingDescription:
      "没有找到所选择的牌。你可以返回阅读室，重新开始一次阅读。",
    reflectionFallback: "这张牌正在提醒你注意什么？",
    closingReflection:
      "这次阅读是一份象征性反思，而不是固定预测。请把它作为关于注意力、选择与自我理解的安静提示。",
    disclaimer:
      "本站的塔罗阅读是用于个人洞察的象征性反思，不构成医疗、法律、财务或心理建议，也不能替代专业支持。",
    selectCardTitle: "选择你抽到的牌",
    selectCardDescription: "请选择你刚刚从实体牌组中抽到的那一张牌。",
    preparingCardList: "正在准备牌表...",
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
  return lang === "zh" ? "中文" : "English";
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
    "Major Arcana": "大阿尔卡那",
    Wands: "权杖",
    Cups: "圣杯",
    Swords: "宝剑",
    Pentacles: "星币",
  };

  return titles[title] ?? title;
}
