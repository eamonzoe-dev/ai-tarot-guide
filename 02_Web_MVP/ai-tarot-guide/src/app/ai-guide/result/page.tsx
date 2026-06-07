import { ResultClient } from "./ResultClient";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ card?: string; question?: string }>;
}) {
  const { card, question } = await searchParams;

  return (
    <ResultClient
      initialCard={card ?? ""}
      initialQuestion={question ?? ""}
    />
  );
}
