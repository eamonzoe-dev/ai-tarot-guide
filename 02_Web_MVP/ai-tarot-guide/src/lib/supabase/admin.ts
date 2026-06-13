import "server-only";

import { createClient } from "@supabase/supabase-js";

function getSupabaseAdminConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
  }

  if (!supabaseSecretKey) {
    throw new Error("Missing SUPABASE_SECRET_KEY environment variable.");
  }

  return {
    supabaseUrl,
    supabaseSecretKey,
  };
}

export function createSupabaseAdminClient() {
  const { supabaseUrl, supabaseSecretKey } = getSupabaseAdminConfig();

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
