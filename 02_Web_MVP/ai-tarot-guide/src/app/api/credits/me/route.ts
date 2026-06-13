import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type UserCredits = {
  remaining_credits: number;
  total_credits: number;
  updated_at: string | null;
};

function normalizeCredits(value: unknown): UserCredits {
  if (!value || typeof value !== "object") {
    return {
      remaining_credits: 0,
      total_credits: 0,
      updated_at: null,
    };
  }

  const credits = value as Record<string, unknown>;

  return {
    remaining_credits:
      typeof credits.remaining_credits === "number"
        ? credits.remaining_credits
        : 0,
    total_credits:
      typeof credits.total_credits === "number" ? credits.total_credits : 0,
    updated_at:
      typeof credits.updated_at === "string" ? credits.updated_at : null,
  };
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
  const creditsResult = await admin
    .from("user_credits")
    .select("remaining_credits,total_credits,updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

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
      .select("remaining_credits,total_credits,updated_at")
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
