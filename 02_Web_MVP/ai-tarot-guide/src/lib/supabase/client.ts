import { createBrowserClient } from "@supabase/ssr";

function getSupabaseBrowserConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
  }

  if (!supabasePublishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable.",
    );
  }

  return {
    supabaseUrl,
    supabasePublishableKey,
  };
}

export function createSupabaseBrowserClient() {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseBrowserConfig();

  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
