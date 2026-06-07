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
    coreMeaning: "A threshold, a first step, and the courage to move before every answer is visible.",
    uprightMessage:
      "Your question is asking for openness rather than certainty. The Fool suggests that a fresh path is forming, but it will only reveal itself once you begin. Do not confuse inexperience with weakness; your beginner's eye may be the very thing that lets you see the cleanest route.",
    shadowMessage:
      "Naivety becomes costly when it ignores plain signals. Check whether you are calling something freedom because you do not want to face the consequences of a choice.",
    loveMessage:
      "In love, this card points to honesty, lightness, and emotional risk. Let curiosity lead, but do not abandon your boundaries just to keep the feeling alive.",
    practicalAdvice:
      "Take one small reversible step. Write down what you need to know next, then act in a way that gives you real feedback within the next few days.",
    reflectionQuestion:
      "Where am I being invited to trust the path, and where do I still need a simple safeguard?",
  },
  {
    id: "the-lovers",
    title: "THE LOVERS",
    roman: "VI",
    image: "/cards/the-lovers.png",
    coreMeaning: "Choice, alignment, devotion, and the moment where values become visible.",
    uprightMessage:
      "The Lovers asks you to choose from the part of yourself that can live with the outcome. This is not only about attraction or desire; it is about whether your decision reflects your deeper values. A clear yes requires an equally clear no to what pulls you away from integrity.",
    shadowMessage:
      "Avoid letting harmony become avoidance. If you are keeping peace by silencing a true need, the imbalance will eventually speak louder.",
    loveMessage:
      "This card favors sincere connection and mutual recognition. The strongest bond here is not intensity alone, but the willingness to choose each other consciously.",
    practicalAdvice:
      "Name your non-negotiables. Compare your next action against them before you make a promise, accept an offer, or reopen a door.",
    reflectionQuestion:
      "What choice would make my outer life match my inner truth more closely?",
  },
  {
    id: "death",
    title: "DEATH",
    roman: "XIII",
    image: "/cards/death.png",
    coreMeaning: "Ending, release, transformation, and the quiet dignity of letting a cycle close.",
    uprightMessage:
      "Death rarely speaks of sudden ruin; it speaks of what has already completed itself. Your question may be tied to something that can no longer grow in its current form. Letting go is not failure here. It is the necessary clearing that allows a more honest life to emerge.",
    shadowMessage:
      "Resistance may be keeping you attached to a version of the situation that no longer exists. Grief is valid, but denial is draining your strength.",
    loveMessage:
      "In relationships, Death marks a serious transition. A pattern must end, whether that means renewal through truth or separation from what cannot be repaired.",
    practicalAdvice:
      "Choose one thing to stop feeding: an old expectation, repeated argument, stale plan, or identity that has become too small.",
    reflectionQuestion:
      "What am I still carrying because I have not admitted that its season has passed?",
  },
  {
    id: "the-tower",
    title: "THE TOWER",
    roman: "XVI",
    image: "/cards/the-tower.png",
    coreMeaning: "Disruption, revelation, collapse of false structures, and necessary truth.",
    uprightMessage:
      "The Tower shows where a weak structure can no longer hold. It may feel harsh, but the card is not interested in punishment; it is interested in reality. Your question benefits from directness. What is unstable, exaggerated, or built on avoidance needs to be seen clearly now.",
    shadowMessage:
      "The danger is not the truth itself, but your attempt to preserve appearances after the truth has arrived. Do not rebuild too quickly on the same foundation.",
    loveMessage:
      "In love, hidden tension may surface. If a bond survives this moment, it must do so with more honesty and fewer illusions.",
    practicalAdvice:
      "Separate facts from panic. List what actually changed, what you now know, and what decision can wait until your nervous system settles.",
    reflectionQuestion:
      "What truth have I been treating as a threat when it may be a form of protection?",
  },
  {
    id: "the-star",
    title: "THE STAR",
    roman: "XVII",
    image: "/cards/the-star.png",
    coreMeaning: "Healing, renewal, spiritual steadiness, and a future that can be trusted again.",
    uprightMessage:
      "The Star brings a quiet kind of hope. It does not erase what happened; it restores your relationship with possibility. Your question is asking for patience, care, and faith in gradual repair. The next answer may arrive through calm consistency rather than dramatic proof.",
    shadowMessage:
      "Hope becomes fragile when it avoids practical care. Do not wait for a sign while neglecting the small routines that help you recover.",
    loveMessage:
      "In love, The Star favors tenderness, forgiveness, and emotional space. It asks for connection that lets both people breathe.",
    practicalAdvice:
      "Return to one restorative habit and protect it. Sleep, water, honest conversation, or a quiet walk may be more useful than another analysis loop.",
    reflectionQuestion:
      "What would I do differently if I truly believed healing was already underway?",
  },
  {
    id: "the-moon",
    title: "THE MOON",
    roman: "XVIII",
    image: "/cards/the-moon.png",
    coreMeaning: "Intuition, uncertainty, dreams, projection, and the path through partial light.",
    uprightMessage:
      "The Moon says the full picture is not available yet. Your instincts are active, but so are fear, memory, and imagination. Move gently. This is a time to observe patterns, track emotional signals, and resist forcing a final answer before the fog begins to thin.",
    shadowMessage:
      "Not every intense feeling is a prophecy. Check where anxiety may be dressing itself as intuition.",
    loveMessage:
      "In relationships, The Moon points to ambiguity, longing, and unspoken material. Ask clear questions, but allow time for the truth to surface.",
    practicalAdvice:
      "Do not make a major irreversible decision at peak emotion. Record what you notice, sleep on it, and look for repeated evidence.",
    reflectionQuestion:
      "Which part of my fear is protecting me, and which part is only repeating an old story?",
  },
];

export function getTarotCardById(id: string | null) {
  return tarotCards.find((card) => card.id === id);
}
