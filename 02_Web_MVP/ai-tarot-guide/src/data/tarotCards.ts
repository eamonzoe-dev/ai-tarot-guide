export type TarotArcana = "major" | "minor";
export type TarotSuit = "major" | "wands" | "cups" | "swords" | "pentacles";

export type TarotCard = {
  id: string;
  title: string;
  roman: string;
  arcana: TarotArcana;
  suit: TarotSuit;
  rank: string;
  keywords: string[];
  reflection: string;
  suggestion: string;
  image?: string;
  coreMeaning: string;
  uprightMessage: string;
  shadowMessage: string;
  loveMessage: string;
  practicalAdvice: string;
  reflectionQuestion: string;
};

type CardSeed = {
  id: string;
  title: string;
  roman: string;
  arcana: TarotArcana;
  suit: TarotSuit;
  rank: string;
  keywords: string[];
  reflection: string;
  suggestion: string;
  image?: string;
};

const existingImages: Record<string, string> = {
  "the-fool": "/cards/the-fool.png",
  "the-lovers": "/cards/the-lovers.png",
  death: "/cards/death.png",
  "the-tower": "/cards/the-tower.png",
  "the-star": "/cards/the-star.png",
  "the-moon": "/cards/the-moon.png",
};

const suitLabels: Record<TarotSuit, string> = {
  major: "Major Arcana",
  wands: "Wands",
  cups: "Cups",
  swords: "Swords",
  pentacles: "Pentacles",
};

function toReadingCard(seed: CardSeed): TarotCard {
  const focus = seed.keywords.slice(0, 3).join(", ");
  const firstKeyword = seed.keywords[0].toLowerCase();

  return {
    ...seed,
    image: seed.image ?? existingImages[seed.id],
    coreMeaning: `Core Message: ${seed.reflection}`,
    uprightMessage: `What This Means For Your Question: In this single-card reading, ${seed.title} may invite reflection on ${focus}. Notice how this theme appears in the situation you brought to the deck.`,
    shadowMessage: `What To Notice: The shadow of this card may appear when ${seed.keywords[0].toLowerCase()} becomes too narrow, rushed, or disconnected from honest attention.`,
    loveMessage: `This card can be read as a quiet prompt to stay present with what is real, relational, and personally meaningful rather than forcing a quick conclusion.`,
    practicalAdvice: `A Practical Next Step: ${seed.suggestion}`,
    reflectionQuestion:
      seed.arcana === "major"
        ? `Ask yourself: Where is ${firstKeyword} asking for more honest attention now?`
        : `Ask yourself: How is ${firstKeyword} showing up in this situation?`,
  };
}

const majorSeeds: CardSeed[] = [
  {
    id: "the-fool",
    title: "The Fool",
    roman: "0",
    arcana: "major",
    suit: "major",
    rank: "0",
    keywords: ["beginning", "openness", "risk", "trust"],
    reflection:
      "The Fool may point to a threshold moment. In this reading, it reflects openness, uncertainty, and the need to begin without demanding complete control.",
    suggestion:
      "Take one honest step forward, while keeping your attention on the ground beneath you.",
  },
  {
    id: "the-magician",
    title: "The Magician",
    roman: "I",
    arcana: "major",
    suit: "major",
    rank: "I",
    keywords: ["agency", "focus", "skill", "intention"],
    reflection:
      "The Magician may point to the resources already within reach. In this reading, it reflects focused attention, practical skill, and the power of clear intention.",
    suggestion:
      "Choose one available tool or skill and apply it with deliberate attention.",
  },
  {
    id: "the-high-priestess",
    title: "The High Priestess",
    roman: "II",
    arcana: "major",
    suit: "major",
    rank: "II",
    keywords: ["intuition", "stillness", "mystery", "inner knowing"],
    reflection:
      "The High Priestess may point to knowledge that has not become fully visible. In this reading, it reflects stillness, intuition, and respect for what is unfolding quietly.",
    suggestion:
      "Pause before responding, and notice what your quieter awareness already understands.",
  },
  {
    id: "the-empress",
    title: "The Empress",
    roman: "III",
    arcana: "major",
    suit: "major",
    rank: "III",
    keywords: ["nurture", "growth", "creation", "embodiment"],
    reflection:
      "The Empress may point to what needs care in order to grow. In this reading, it reflects nourishment, creative patience, and attention to lived experience.",
    suggestion:
      "Support the situation through steady care rather than pressure or overcontrol.",
  },
  {
    id: "the-emperor",
    title: "The Emperor",
    roman: "IV",
    arcana: "major",
    suit: "major",
    rank: "IV",
    keywords: ["structure", "responsibility", "boundaries", "stability"],
    reflection:
      "The Emperor may point to the need for structure and clear responsibility. In this reading, it reflects boundaries, stability, and grounded decision-making.",
    suggestion:
      "Define the boundary, role, or next practical structure that would make the situation steadier.",
  },
  {
    id: "the-hierophant",
    title: "The Hierophant",
    roman: "V",
    arcana: "major",
    suit: "major",
    rank: "V",
    keywords: ["tradition", "teaching", "values", "belonging"],
    reflection:
      "The Hierophant may point to inherited wisdom, shared values, or a trusted framework. In this reading, it reflects learning through guidance, lineage, or community.",
    suggestion:
      "Consider which value, practice, or trusted counsel can help you proceed with integrity.",
  },
  {
    id: "the-lovers",
    title: "The Lovers",
    roman: "VI",
    arcana: "major",
    suit: "major",
    rank: "VI",
    keywords: ["choice", "alignment", "relationship", "values"],
    reflection:
      "The Lovers may point to a meaningful choice. In this reading, it reflects alignment between desire, responsibility, and the values you want to live by.",
    suggestion:
      "Notice which option lets you remain honest with yourself after the moment passes.",
  },
  {
    id: "the-chariot",
    title: "The Chariot",
    roman: "VII",
    arcana: "major",
    suit: "major",
    rank: "VII",
    keywords: ["direction", "discipline", "movement", "will"],
    reflection:
      "The Chariot may point to the need for direction and self-command. In this reading, it reflects movement that becomes useful when guided by discipline.",
    suggestion:
      "Name the direction clearly before spending more effort trying to move faster.",
  },
  {
    id: "strength",
    title: "Strength",
    roman: "VIII",
    arcana: "major",
    suit: "major",
    rank: "VIII",
    keywords: ["patience", "courage", "gentleness", "self-trust"],
    reflection:
      "Strength may point to quiet courage rather than force. In this reading, it reflects patience, emotional steadiness, and the power of gentleness under pressure.",
    suggestion:
      "Meet the difficult part with steadiness before trying to overpower it.",
  },
  {
    id: "the-hermit",
    title: "The Hermit",
    roman: "IX",
    arcana: "major",
    suit: "major",
    rank: "IX",
    keywords: ["solitude", "reflection", "guidance", "inner light"],
    reflection:
      "The Hermit may point to the value of stepping back. In this reading, it reflects solitude, discernment, and the search for a quieter source of guidance.",
    suggestion:
      "Create enough space to hear your own insight without competing noise.",
  },
  {
    id: "wheel-of-fortune",
    title: "Wheel of Fortune",
    roman: "X",
    arcana: "major",
    suit: "major",
    rank: "X",
    keywords: ["change", "cycles", "timing", "turning point"],
    reflection:
      "Wheel of Fortune may point to movement within a larger cycle. In this reading, it reflects timing, change, and the need to respond wisely to what is turning.",
    suggestion:
      "Notice what is shifting, and adapt without assuming the whole pattern is fixed.",
  },
  {
    id: "justice",
    title: "Justice",
    roman: "XI",
    arcana: "major",
    suit: "major",
    rank: "XI",
    keywords: ["truth", "balance", "accountability", "clarity"],
    reflection:
      "Justice may point to truth, balance, and the consequences of choices. In this reading, it reflects honest assessment rather than blame or avoidance.",
    suggestion:
      "Look at the facts clearly, including your part, before deciding what is fair.",
  },
  {
    id: "the-hanged-man",
    title: "The Hanged Man",
    roman: "XII",
    arcana: "major",
    suit: "major",
    rank: "XII",
    keywords: ["pause", "surrender", "perspective", "waiting"],
    reflection:
      "The Hanged Man may point to a pause that changes perspective. In this reading, it reflects suspension, patience, and the wisdom of not forcing resolution too soon.",
    suggestion:
      "Let the situation look different before deciding that nothing is happening.",
  },
  {
    id: "death",
    title: "Death",
    roman: "XIII",
    arcana: "major",
    suit: "major",
    rank: "XIII",
    keywords: ["ending", "release", "transition", "renewal"],
    reflection:
      "Death may point to a necessary ending or change of form. In this reading, it reflects release, transition, and the space created when something is allowed to complete.",
    suggestion:
      "Notice what has reached its natural ending, and let your energy move accordingly.",
  },
  {
    id: "temperance",
    title: "Temperance",
    roman: "XIV",
    arcana: "major",
    suit: "major",
    rank: "XIV",
    keywords: ["balance", "integration", "moderation", "healing"],
    reflection:
      "Temperance may point to the work of integration. In this reading, it reflects balance, gradual healing, and the blending of parts that once felt separate.",
    suggestion:
      "Choose the measured response that helps the whole system settle.",
  },
  {
    id: "the-devil",
    title: "The Devil",
    roman: "XV",
    arcana: "major",
    suit: "major",
    rank: "XV",
    keywords: ["attachment", "pattern", "shadow", "constraint"],
    reflection:
      "The Devil may point to attachment, habit, or a pattern that feels difficult to loosen. In this reading, it reflects shadow material asking for honest attention.",
    suggestion:
      "Name the pattern clearly, without shame, and notice where choice still exists.",
  },
  {
    id: "the-tower",
    title: "The Tower",
    roman: "XVI",
    arcana: "major",
    suit: "major",
    rank: "XVI",
    keywords: ["disruption", "truth", "collapse", "release"],
    reflection:
      "The Tower may point to a truth that unsettles an unstable structure. In this reading, it reflects disruption that can reveal what needs to be rebuilt differently.",
    suggestion:
      "Separate what actually happened from the fear around it, then take the next steady step.",
  },
  {
    id: "the-star",
    title: "The Star",
    roman: "XVII",
    arcana: "major",
    suit: "major",
    rank: "XVII",
    keywords: ["hope", "renewal", "healing", "trust"],
    reflection:
      "The Star may point to quiet renewal after difficulty. In this reading, it reflects healing, hope, and the gradual return of trust.",
    suggestion:
      "Protect one restorative practice that helps you stay connected to possibility.",
  },
  {
    id: "the-moon",
    title: "The Moon",
    roman: "XVIII",
    arcana: "major",
    suit: "major",
    rank: "XVIII",
    keywords: ["uncertainty", "intuition", "dreams", "projection"],
    reflection:
      "The Moon may point to unclear emotional terrain. In this reading, it reflects intuition, uncertainty, and the need to separate fear from deeper knowing.",
    suggestion:
      "Move slowly, gather evidence, and let intense feelings settle before concluding.",
  },
  {
    id: "the-sun",
    title: "The Sun",
    roman: "XIX",
    arcana: "major",
    suit: "major",
    rank: "XIX",
    keywords: ["clarity", "warmth", "vitality", "confidence"],
    reflection:
      "The Sun may point to clarity, warmth, and renewed confidence. In this reading, it reflects what becomes easier to see when openness returns.",
    suggestion:
      "Let simple truth and direct communication guide your next step.",
  },
  {
    id: "judgement",
    title: "Judgement",
    roman: "XX",
    arcana: "major",
    suit: "major",
    rank: "XX",
    keywords: ["awakening", "review", "calling", "renewal"],
    reflection:
      "Judgement may point to a moment of review and awakening. In this reading, it reflects the invitation to respond to what you now understand more clearly.",
    suggestion:
      "Listen for the call that asks you to act from a more honest version of yourself.",
  },
  {
    id: "the-world",
    title: "The World",
    roman: "XXI",
    arcana: "major",
    suit: "major",
    rank: "XXI",
    keywords: ["completion", "integration", "wholeness", "arrival"],
    reflection:
      "The World may point to completion and integration. In this reading, it reflects a wider view, a cycle closing, and the feeling of parts coming together.",
    suggestion:
      "Acknowledge what has been completed before moving immediately into the next cycle.",
  },
];

const suitProfiles: Record<
  Exclude<TarotSuit, "major">,
  {
    label: string;
    domain: string;
    qualities: string[];
  }
> = {
  wands: {
    label: "Wands",
    domain: "energy, initiative, and creative direction",
    qualities: ["spark", "movement", "courage", "creative will"],
  },
  cups: {
    label: "Cups",
    domain: "feeling, relationship, and emotional understanding",
    qualities: ["feeling", "connection", "tenderness", "emotional truth"],
  },
  swords: {
    label: "Swords",
    domain: "thought, communication, and discernment",
    qualities: ["clarity", "choice", "language", "mental focus"],
  },
  pentacles: {
    label: "Pentacles",
    domain: "work, resources, body, and material care",
    qualities: ["stability", "practice", "resources", "daily care"],
  },
};

const rankProfiles = [
  {
    rank: "Ace",
    slug: "ace",
    title: "Ace",
    keywords: ["seed", "potential", "beginning"],
    reflection:
      "This card may point to a fresh seed of possibility within the suit's field.",
    suggestion:
      "Protect the first sign of potential before asking it to become fully formed.",
  },
  {
    rank: "Two",
    slug: "two",
    title: "Two",
    keywords: ["choice", "balance", "relationship"],
    reflection:
      "This card may point to a meeting point, choice, or delicate balance.",
    suggestion:
      "Notice what needs honest comparison before you move in one direction.",
  },
  {
    rank: "Three",
    slug: "three",
    title: "Three",
    keywords: ["growth", "collaboration", "expression"],
    reflection:
      "This card may point to early growth and the way energy changes through expression.",
    suggestion:
      "Let the next step become visible through conversation, practice, or shared effort.",
  },
  {
    rank: "Four",
    slug: "four",
    title: "Four",
    keywords: ["structure", "pause", "foundation"],
    reflection:
      "This card may point to structure, rest, or the need for a steadier base.",
    suggestion:
      "Strengthen the foundation before asking the situation to expand.",
  },
  {
    rank: "Five",
    slug: "five",
    title: "Five",
    keywords: ["tension", "change", "challenge"],
    reflection:
      "This card may point to friction, disruption, or a lesson inside discomfort.",
    suggestion:
      "Look for the specific tension that needs attention rather than reacting to all of it at once.",
  },
  {
    rank: "Six",
    slug: "six",
    title: "Six",
    keywords: ["support", "repair", "movement"],
    reflection:
      "This card may point to adjustment, support, or a path toward greater ease.",
    suggestion:
      "Accept the form of help, repair, or movement that is actually available.",
  },
  {
    rank: "Seven",
    slug: "seven",
    title: "Seven",
    keywords: ["assessment", "defense", "discernment"],
    reflection:
      "This card may point to a moment of assessment, testing, or choosing what deserves your energy.",
    suggestion:
      "Decide what is worth protecting, and let the rest take less of your attention.",
  },
  {
    rank: "Eight",
    slug: "eight",
    title: "Eight",
    keywords: ["movement", "practice", "momentum"],
    reflection:
      "This card may point to motion, repetition, or the momentum created by continued attention.",
    suggestion:
      "Focus on the next repeatable action rather than the whole distance ahead.",
  },
  {
    rank: "Nine",
    slug: "nine",
    title: "Nine",
    keywords: ["integration", "resilience", "reflection"],
    reflection:
      "This card may point to accumulated experience and the need to understand what it has taught you.",
    suggestion:
      "Pause long enough to recognize what your experience has already built.",
  },
  {
    rank: "Ten",
    slug: "ten",
    title: "Ten",
    keywords: ["completion", "burden", "threshold"],
    reflection:
      "This card may point to culmination, fullness, or the weight that comes near the end of a cycle.",
    suggestion:
      "Notice what has completed its purpose and what can now be redistributed or released.",
  },
  {
    rank: "Page",
    slug: "page",
    title: "Page",
    keywords: ["learning", "message", "curiosity"],
    reflection:
      "This card may point to beginner's attention, a message, or a new way of learning through the suit.",
    suggestion:
      "Approach the matter as a student, with curiosity stronger than certainty.",
  },
  {
    rank: "Knight",
    slug: "knight",
    title: "Knight",
    keywords: ["pursuit", "movement", "devotion"],
    reflection:
      "This card may point to active pursuit and the direction your energy is taking.",
    suggestion:
      "Check whether your pace and direction match the care the situation requires.",
  },
  {
    rank: "Queen",
    slug: "queen",
    title: "Queen",
    keywords: ["maturity", "receptivity", "care"],
    reflection:
      "This card may point to mature relationship with the suit's wisdom and a steadier inner posture.",
    suggestion:
      "Lead from grounded receptivity before moving into response.",
  },
  {
    rank: "King",
    slug: "king",
    title: "King",
    keywords: ["mastery", "responsibility", "leadership"],
    reflection:
      "This card may point to responsibility, maturity, and the outward expression of the suit's lessons.",
    suggestion:
      "Take responsibility for the tone you set and the structure you create.",
  },
];

function minorSeed(
  suit: Exclude<TarotSuit, "major">,
  rankProfile: (typeof rankProfiles)[number],
): CardSeed {
  const suitProfile = suitProfiles[suit];
  const title = `${rankProfile.title} of ${suitProfile.label}`;
  const keywords = [
    ...rankProfile.keywords.slice(0, 2),
    ...suitProfile.qualities.slice(0, 2),
  ];

  return {
    id: `${rankProfile.slug}-of-${suit}`,
    title,
    roman: rankProfile.rank,
    arcana: "minor",
    suit,
    rank: rankProfile.rank,
    keywords,
    reflection: `${title} may point to ${rankProfile.reflection
      .replace("This card may point to ", "")
      .replace(/\.$/, "")} within ${suitProfile.domain}. In this reading, it reflects ${keywords
      .slice(0, 3)
      .join(", ")} in a practical, symbolic way.`,
    suggestion:
      suit === "wands"
        ? `${rankProfile.suggestion} Let your energy stay intentional rather than reactive.`
        : suit === "cups"
          ? `${rankProfile.suggestion} Give the emotional truth enough room to be heard.`
          : suit === "swords"
            ? `${rankProfile.suggestion} Let clarity guide the words or decisions that follow.`
            : `${rankProfile.suggestion} Keep the next step grounded in what can be tended today.`,
  };
}

const minorSeeds: CardSeed[] = (
  ["wands", "cups", "swords", "pentacles"] as const
).flatMap((suit) => rankProfiles.map((rankProfile) => minorSeed(suit, rankProfile)));

export const tarotCards: TarotCard[] = [...majorSeeds, ...minorSeeds].map(
  toReadingCard,
);

export const tarotCardGroups = [
  {
    title: "Major Arcana",
    cards: tarotCards.filter((card) => card.suit === "major"),
  },
  {
    title: "Wands",
    cards: tarotCards.filter((card) => card.suit === "wands"),
  },
  {
    title: "Cups",
    cards: tarotCards.filter((card) => card.suit === "cups"),
  },
  {
    title: "Swords",
    cards: tarotCards.filter((card) => card.suit === "swords"),
  },
  {
    title: "Pentacles",
    cards: tarotCards.filter((card) => card.suit === "pentacles"),
  },
];

export function getTarotCardLabel(card: TarotCard) {
  return card.arcana === "major" ? suitLabels.major : suitLabels[card.suit];
}

export function getTarotCardById(id: string | null) {
  return tarotCards.find((card) => card.id === id);
}
