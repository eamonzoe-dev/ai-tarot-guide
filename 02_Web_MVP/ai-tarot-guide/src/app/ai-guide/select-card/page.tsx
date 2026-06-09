import { SelectCardClient } from "./SelectCardClient";

function normalizeValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function SelectCardPage({
  searchParams,
}: {
  searchParams: Promise<{
    question?: string | string[];
    spread?: string | string[];
    orientation?: string | string[];
  }>;
}) {
  const { question, spread, orientation } = await searchParams;

  return (
    <SelectCardClient
      initialQuestion={normalizeValue(question)}
      initialSpread={normalizeValue(spread)}
      initialOrientation={normalizeValue(orientation)}
    />
  );
}
