import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function normalizeLimit(value: string | null) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 20;
  }

  return Math.min(Math.max(Math.floor(parsed), 1), 50);
}

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      {
        error: "Please sign in to view your readings.",
        code: "auth_required",
      },
      { status: 401 },
    );
  }

  const url = new URL(request.url);
  const limit = normalizeLimit(url.searchParams.get("limit"));
  const admin = createSupabaseAdminClient();
  const readingsResult = await admin
    .from("reading_logs")
    .select(
      "id,question,card_id,card_title,mode,spread,orientation,lang,reading_json,created_at",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (readingsResult.error) {
    return NextResponse.json(
      {
        error: "Unable to load readings.",
        code: "readings_load_failed",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    readings: readingsResult.data ?? [],
  });
}
