export type TarotCard = {
  id: string;
  title: string;
  roman: string;
  image: string;
  coreMeaning: string;
  uprightMessage: string;
  shadowMessage: string;
  loveMessage: string;
  practicalAdvice: string;
  reflectionQuestion: string;
};

export const tarotCards: TarotCard[] = [
  {
    id: "the-fool",
    title: "THE FOOL",
    roman: "0",
    image: "/cards/the-fool.png",
    coreMeaning:
      "Core Message: You are standing at the edge of a new path. The Fool does not promise certainty; it invites movement, trust, and the willingness to learn by stepping forward.",
    uprightMessage:
      "What This Means For Your Question: Your answer may not come from planning every detail first. This card suggests that the next honest step matters more than having the whole journey mapped out.",
    shadowMessage:
      "What To Notice: Pay attention to the difference between courage and carelessness. Excitement is useful, but ignoring clear risks or repeated warnings may create avoidable difficulty.",
    loveMessage:
      "This reading favors openness, curiosity, and a lighter grip. If the situation feels too heavy too soon, return to what is simple, direct, and true.",
    practicalAdvice:
      "A Practical Next Step: Take one small action that is reversible. Send the message, ask the question, make the first draft, or test the idea before making a larger commitment.",
    reflectionQuestion:
      "Ask yourself: What would I try if I did not need to look certain before beginning?",
  },
  {
    id: "the-lovers",
    title: "THE LOVERS",
    roman: "VI",
    image: "/cards/the-lovers.png",
    coreMeaning:
      "Core Message: The Lovers is about alignment. A meaningful choice is asking you to bring desire, values, and responsibility into the same conversation.",
    uprightMessage:
      "What This Means For Your Question: The answer depends on what you are truly choosing, not only what you want in the moment. Look for the option that lets you remain honest with yourself afterward.",
    shadowMessage:
      "What To Notice: Notice where you may be confusing harmony with avoidance. If you are keeping the peace by hiding your needs, the decision is not yet fully honest.",
    loveMessage:
      "This card highlights connection, consent, and mutual recognition. A bond becomes stronger when both people can choose it freely, not when one person disappears into it.",
    practicalAdvice:
      "A Practical Next Step: Write down your non-negotiables before responding. Then compare your next action with those values instead of reacting only to pressure or longing.",
    reflectionQuestion:
      "Ask yourself: Which choice would make my outer life match my inner truth more closely?",
  },
  {
    id: "death",
    title: "DEATH",
    roman: "XIII",
    image: "/cards/death.png",
    coreMeaning:
      "Core Message: Something is ready to end, change form, or be released. Death is not here to punish you; it clears what can no longer keep growing.",
    uprightMessage:
      "What This Means For Your Question: The situation may be asking for surrender rather than repair. If a pattern has already completed its lesson, holding it tighter will not make it alive again.",
    shadowMessage:
      "What To Notice: Notice what you keep reviving out of fear, guilt, or habit. Grief may be real, but denial can keep you tied to a version of life that has already passed.",
    loveMessage:
      "In matters of the heart, this card points to transformation. A relationship, expectation, or emotional pattern must change honestly if it is going to continue.",
    practicalAdvice:
      "A Practical Next Step: Choose one thing to stop feeding this week: an old argument, a stale plan, a false obligation, or a self-image that has become too small.",
    reflectionQuestion:
      "Ask yourself: What am I still carrying because I have not admitted that its season is over?",
  },
  {
    id: "the-tower",
    title: "THE TOWER",
    roman: "XVI",
    image: "/cards/the-tower.png",
    coreMeaning:
      "Core Message: The Tower reveals what was unstable. A truth, interruption, or sudden clarity may be uncomfortable, but it can also protect you from building further on a weak foundation.",
    uprightMessage:
      "What This Means For Your Question: The answer may arrive through disruption rather than reassurance. Look at what the situation has exposed, especially where appearances were hiding pressure or imbalance.",
    shadowMessage:
      "What To Notice: Notice the urge to rebuild too quickly. If you rush back to the old structure, you may recreate the same problem with a new surface.",
    loveMessage:
      "In relationships, The Tower brings buried tension into the open. What survives this moment must become more truthful, less performative, and less dependent on denial.",
    practicalAdvice:
      "A Practical Next Step: Separate facts from panic. List what actually happened, what you now know, and what decision can wait until you are steadier.",
    reflectionQuestion:
      "Ask yourself: What truth have I been treating as a threat when it may be a form of protection?",
  },
  {
    id: "the-star",
    title: "THE STAR",
    roman: "XVII",
    image: "/cards/the-star.png",
    coreMeaning:
      "Core Message: The Star brings quiet restoration. It does not erase the past, but it helps you trust that healing, clarity, and possibility can return gradually.",
    uprightMessage:
      "What This Means For Your Question: The situation may need patience more than force. Your answer is likely to come through steadiness, care, and a renewed relationship with hope.",
    shadowMessage:
      "What To Notice: Notice whether you are waiting for a sign while neglecting the simple care that would help you recover. Hope needs daily support.",
    loveMessage:
      "In love, The Star points to tenderness, forgiveness, and emotional breathing room. Connection grows best when both people feel safe enough to be honest.",
    practicalAdvice:
      "A Practical Next Step: Return to one restorative habit and protect it. Sleep, water, a quiet walk, or a sincere conversation may do more than another round of overthinking.",
    reflectionQuestion:
      "Ask yourself: What would I do differently if I trusted that healing was already underway?",
  },
  {
    id: "the-moon",
    title: "THE MOON",
    roman: "XVIII",
    image: "/cards/the-moon.png",
    coreMeaning:
      "Core Message: The Moon speaks through uncertainty, dreams, instinct, and hidden feeling. Not everything is visible yet, so move carefully through partial light.",
    uprightMessage:
      "What This Means For Your Question: The answer is not ready to be forced. Your intuition may be active, but so are fear, memory, and projection. Give the truth time to separate itself from anxiety.",
    shadowMessage:
      "What To Notice: Notice what repeats. A single intense feeling may not be reliable, but a pattern that appears again and again deserves attention.",
    loveMessage:
      "In relationships, The Moon can show ambiguity, longing, or unspoken material. Ask clear questions, but do not demand instant certainty from a situation still covered in fog.",
    practicalAdvice:
      "A Practical Next Step: Do not make a major irreversible decision at peak emotion. Write down what you notice, sleep on it, and look for evidence in the morning.",
    reflectionQuestion:
      "Ask yourself: Which part of my fear is protecting me, and which part is only repeating an old story?",
  },
];

export function getTarotCardById(id: string | null) {
  return tarotCards.find((card) => card.id === id);
}
