"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const DEFAULT_NEXT_PATH = "/auth-test";

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_NEXT_PATH;
  }

  return value;
}

function getHashTokens(hash: string) {
  const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return null;
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
}

export default function AuthConfirmPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function completeSignIn() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const nextPath = safeNextPath(url.searchParams.get("next"));
      const hashTokens = getHashTokens(window.location.hash);

      try {
        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            throw exchangeError;
          }

          router.replace(nextPath);
          return;
        }

        if (hashTokens) {
          const { error: setSessionError } =
            await supabase.auth.setSession(hashTokens);

          if (setSessionError) {
            throw setSessionError;
          }

          router.replace(nextPath);
          return;
        }

        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (data.session) {
          router.replace(nextPath);
          return;
        }

        throw new Error("Auth session missing.");
      } catch (authError) {
        const message =
          authError instanceof Error
            ? authError.message
            : "Auth session missing.";

        console.error("Auth confirm failed:", message);

        if (isMounted) {
          setError(message);
        }
      }
    }

    void completeSignIn();

    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

  return (
    <main className="min-h-svh bg-[#080706] px-5 py-8 text-[#f6ecd8]">
      <section className="mx-auto max-w-md rounded-xl border border-[#c9a45b]/25 bg-[#14100d]/85 p-5 shadow-2xl shadow-black/30">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c9a45b]">
          Auth Confirm
        </p>
        <h1 className="mt-2 font-serif text-3xl">Completing sign in...</h1>

        {error ? (
          <div className="mt-5 rounded-lg border border-[#f0a99a]/35 bg-[#f0a99a]/10 p-4">
            <p className="text-sm leading-6 text-[#f2c4ba]">{error}</p>
            <Link
              className="mt-4 inline-block text-sm font-semibold text-[#d9bd80] underline-offset-4 hover:underline"
              href="/auth-test"
            >
              Return to Auth Test
            </Link>
          </div>
        ) : (
          <p className="mt-5 text-sm leading-6 text-[#cfc3ad]">
            Please wait while the sign-in session is being completed.
          </p>
        )}
      </section>
    </main>
  );
}
