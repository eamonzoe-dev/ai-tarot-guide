import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MAX_ACTIVATION_CODE_LENGTH = 80;

type RedeemBody = {
  code?: unknown;
};

type RedeemResult = {
  remaining_credits: number;
  total_credits: number;
  redeemed_credits: number;
  credit_event_id: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeCode(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function activationErrorMessage(message: string) {
  if (message.includes("activation_code_not_found")) {
    return {
      error: "Activation code was not found.",
      code: "activation_code_not_found",
      status: 404,
    };
  }

  if (message.includes("activation_code_unavailable")) {
    return {
      error: "Activation code has already been used or is unavailable.",
      code: "activation_code_unavailable",
      status: 409,
    };
  }

  if (message.includes("activation_code_expired")) {
    return {
      error: "Activation code has expired.",
      code: "activation_code_expired",
      status: 410,
    };
  }

  return {
    error: "Unable to redeem activation code.",
    code: "activation_redeem_failed",
    status: 500,
  };
}

function normalizeRedeemResult(value: unknown): RedeemResult | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const result = value as Record<string, unknown>;

  if (
    typeof result.remaining_credits !== "number" ||
    typeof result.total_credits !== "number" ||
    typeof result.redeemed_credits !== "number" ||
    typeof result.credit_event_id !== "string"
  ) {
    return null;
  }

  return {
    remaining_credits: result.remaining_credits,
    total_credits: result.total_credits,
    redeemed_credits: result.redeemed_credits,
    credit_event_id: result.credit_event_id,
  };
}

export async function POST(request: Request) {
  let body: RedeemBody;

  try {
    const parsed = (await request.json()) as unknown;

    if (!isRecord(parsed)) {
      return NextResponse.json(
        { error: "Invalid JSON body.", code: "invalid_body" },
        { status: 400 },
      );
    }

    body = parsed as RedeemBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body.", code: "invalid_body" },
      { status: 400 },
    );
  }

  const code = normalizeCode(body.code);

  if (!code) {
    return NextResponse.json(
      {
        error: "Activation code is required.",
        code: "activation_code_required",
      },
      { status: 400 },
    );
  }

  if (code.length > MAX_ACTIVATION_CODE_LENGTH) {
    return NextResponse.json(
      {
        error: "Activation code is too long.",
        code: "activation_code_too_long",
      },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      {
        error: "Please sign in to redeem an activation code.",
        code: "auth_required",
      },
      { status: 401 },
    );
  }

  const admin = createSupabaseAdminClient();
  const redeemResult = await admin.rpc("redeem_activation_code", {
    p_user_id: user.id,
    p_code: code,
  });

  if (redeemResult.error) {
    const mapped = activationErrorMessage(redeemResult.error.message);

    console.error("Activation code redeem failed:", {
      userId: user.id,
      error: {
        code: redeemResult.error.code,
        message: redeemResult.error.message,
        details: redeemResult.error.details,
        hint: redeemResult.error.hint,
      },
    });

    return NextResponse.json(
      {
        error: mapped.error,
        code: mapped.code,
      },
      { status: mapped.status },
    );
  }

  const firstResult = Array.isArray(redeemResult.data)
    ? redeemResult.data[0]
    : redeemResult.data;
  const normalized = normalizeRedeemResult(firstResult);

  if (!normalized) {
    return NextResponse.json(
      {
        error: "Activation code was redeemed, but the response was invalid.",
        code: "activation_redeem_invalid_response",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    credits: {
      remaining_credits: normalized.remaining_credits,
      total_credits: normalized.total_credits,
    },
    redeemedCredits: normalized.redeemed_credits,
  });
}
