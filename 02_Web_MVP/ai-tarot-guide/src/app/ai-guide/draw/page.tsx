import { DrawClient } from "./DrawClient";

type ReadingMode = "physical" | "online";

function normalizeMode(mode: string | string[] | undefined): ReadingMode {
  const value = Array.isArray(mode) ? mode[0] : mode;
  return value === "online" ? "online" : "physical";
}

function normalizeValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function DrawPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string | string[];
    question?: string | string[];
  }>;
}) {
  const {
    mode: modeParam,
    question: questionParam,
  } = await searchParams;

  return (
    <DrawClient
      initialMode={normalizeMode(modeParam)}
      initialQuestion={normalizeValue(questionParam)}
    />
  );
}
