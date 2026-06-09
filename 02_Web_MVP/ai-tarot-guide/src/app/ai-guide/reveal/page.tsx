import { RevealClient } from "./RevealClient";

function normalizeValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function RevealPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string | string[];
    question?: string | string[];
    spread?: string | string[];
    card?: string | string[];
    orientation?: string | string[];
  }>;
}) {
  const { mode, question, spread, card, orientation } = await searchParams;

  return (
    <RevealClient
      initialMode={normalizeValue(mode)}
      initialQuestion={normalizeValue(question)}
      initialSpread={normalizeValue(spread)}
      initialCard={normalizeValue(card)}
      initialOrientation={normalizeValue(orientation)}
    />
  );
}
