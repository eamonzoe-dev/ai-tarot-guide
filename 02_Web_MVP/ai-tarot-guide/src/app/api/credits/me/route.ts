import { NextResponse } from "next/server";

import { creditsToStardust } from "@/lib/ai-guide/credits";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type UserCredits = {
  remaining_credits: number;
  total_credits: number;
  remaining_stardust: number;
  total_stardust: number;
  updated_at: string | null;
};

function normalizeCredits(value: unknown): UserCredits {
  if (!value || typeof value !== "object") {
    return {
      remaining_credits: 0,
      total_credits: 0,
      remaining_stardust: 0,
      total_stardust: 0,
      updated_at: null,
    };
  }

  const credits = value as Record<string, unknown>;
  const remainingCredits =
    typeof credits.remaining_credits === "number"
      ? credits.remaining_credits
      : 0;
  const totalCredits =
    typeof credits.total_credits === "number" ? credits.total_credits : 0;

  return {
    remaining_credits: remainingCredits,
    total_credits: totalCredits,
    remaining_stardust:
      typeof credits.remaining_stardust === "number"
        ? credits.remaining_stardust
        : creditsToStardust(remainingCredits),
    total_stardust:
      typeof credits.total_stardust === "number"
        ? credits.total_stardust
        : creditsToStardust(totalCredits),
    updated_at:
      typeof credits.updated_at === "string" ? credits.updated_at : null,
  };
}

function isMissingStardustColumnError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const details = error as Record<string, unknown>;
  const text = [
    details.code,
    details.message,
    details.details,
    details.hint,
  ]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();

  return (
    text.includes("remaining_stardust") ||
    text.includes("total_stardust") ||
    (text.includes("schema cache") && text.includes("stardust")) ||
    (text.includes("column") && text.includes("stardust")) ||
    text.includes("42703") ||
    text.includes("pgrst204")
  );
}

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      {
        error: "Please sign in to view your credits.",
        code: "auth_required",
      },
      { status: 401 },
    );
  }

  const admin = createSupabaseAdminClient();
  const stardustCreditsResult = await admin
    .from("user_credits")
    .select(
      "remaining_credits,total_credits,remaining_stardust,total_stardust,updated_at",
    )
    .eq("user_id", user.id)
    .maybeSingle();

  const shouldUseLegacyFallback =
    stardustCreditsResult.error &&
    isMissingStardustColumnError(stardustCreditsResult.error);
  const creditsResult = shouldUseLegacyFallback
    ? await admin
        .from("user_credits")
        .select("remaining_credits,total_credits,updated_at")
        .eq("user_id", user.id)
        .maybeSingle()
    : stardustCreditsResult;
  const selectFields = shouldUseLegacyFallback
    ? "remaining_credits,total_credits,updated_at"
    : "remaining_credits,total_credits,remaining_stardust,total_stardust,updated_at";

  if (creditsResult.error) {
    return NextResponse.json(
      {
        error: "Unable to load credits.",
        code: "credits_load_failed",
      },
      { status: 500 },
    );
  }

  if (!creditsResult.data) {
    const createdResult = await admin
      .from("user_credits")
      .insert({
        user_id: user.id,
        remaining_credits: 0,
        total_credits: 0,
      })
      .select(selectFields)
      .single();

    if (createdResult.error) {
      return NextResponse.json(
        {
          error: "Unable to load credits.",
          code: "credits_load_failed",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      credits: normalizeCredits(createdResult.data),
    });
  }

  return NextResponse.json({
    credits: normalizeCredits(creditsResult.data),
  });
}
