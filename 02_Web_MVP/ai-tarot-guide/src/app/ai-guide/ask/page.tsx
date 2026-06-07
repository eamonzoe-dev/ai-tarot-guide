import { AskForm } from "./AskForm";

export default async function AskPage({
  searchParams,
}: {
  searchParams: Promise<{ card?: string }>;
}) {
  const { card } = await searchParams;

  return <AskForm initialCard={card ?? ""} />;
}
