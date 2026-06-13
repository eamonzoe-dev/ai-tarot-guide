"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type QueryState = {
  data: unknown;
  error: string | null;
};

const emptyQueryState: QueryState = {
  data: null,
  error: null,
};

function JsonPreview({ value }: { value: unknown }) {
  return (
    <pre className="max-h-64 overflow-auto rounded-lg border border-white/10 bg-black/30 p-3 text-xs leading-6 text-[#d8cdb8]">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

export default function AuthTestPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<QueryState>(emptyQueryState);
  const [quota, setQuota] = useState<QueryState>(emptyQueryState);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const loadRelatedData = useCallback(
    async (currentUser: User | null) => {
      if (!currentUser) {
        setProfile(emptyQueryState);
        setQuota(emptyQueryState);
        return;
      }

      const [profileResult, quotaResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("id,email,created_at,updated_at")
          .eq("id", currentUser.id)
          .maybeSingle(),
        supabase
          .from("user_quotas")
          .select(
            "user_id,plan_type,remaining_credits,daily_limit,valid_until,created_at,updated_at",
          )
          .eq("user_id", currentUser.id)
          .maybeSingle(),
      ]);

      setProfile({
        data: profileResult.data,
        error: profileResult.error?.message ?? null,
      });
      setQuota({
        data: quotaResult.data,
        error: quotaResult.error?.message ?? null,
      });
    },
    [supabase],
  );

  const refreshUser = useCallback(async () => {
    setIsLoadingUser(true);
    setError(null);

    const { data, error: getUserError } = await supabase.auth.getUser();
    const currentUser = data.user ?? null;

    setUser(currentUser);
    setError(getUserError?.message ?? null);
    await loadRelatedData(currentUser);
    setIsLoadingUser(false);
  }, [loadRelatedData, supabase]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  async function handleSendLoginEmail() {
    setIsSendingEmail(true);
    setStatus(null);
    setError(null);

    const trimmedEmail = email.trim();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth-test`,
      },
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      setStatus("Login email sent. Check your inbox.");
    }

    setIsSendingEmail(false);
  }

  async function handleVerifyOtp() {
    setIsVerifying(true);
    setStatus(null);
    setError(null);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: token.trim(),
      type: "email",
    });

    if (verifyError) {
      setError(verifyError.message);
    } else {
      setStatus("Signed in.");
      setToken("");
      await refreshUser();
    }

    setIsVerifying(false);
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    setStatus(null);
    setError(null);

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
    } else {
      setStatus("Signed out.");
      setUser(null);
      setProfile(emptyQueryState);
      setQuota(emptyQueryState);
    }

    setIsSigningOut(false);
  }

  return (
    <main className="min-h-svh bg-[#080706] px-5 py-8 text-[#f6ecd8]">
      <div className="mx-auto grid w-full max-w-3xl gap-6">
        <header className="rounded-xl border border-[#c9a45b]/25 bg-[#14100d]/80 p-5 shadow-2xl shadow-black/30">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c9a45b]">
            Auth Test
          </p>
          <h1 className="mt-2 font-serif text-3xl">Temporary internal test page</h1>
        </header>

        <section className="rounded-xl border border-white/10 bg-[#120f0c]/85 p-5">
          <h2 className="font-serif text-xl">Email login</h2>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-2 text-sm text-[#cfc3ad]">
              Email
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                autoComplete="email"
                className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-[#f6ecd8] outline-none transition focus:border-[#c9a45b]"
                placeholder="you@example.com"
              />
            </label>
            <button
              type="button"
              onClick={handleSendLoginEmail}
              disabled={isSendingEmail || !email.trim()}
              className="rounded-lg border border-[#c9a45b]/50 bg-[#c9a45b]/15 px-4 py-2 text-sm font-semibold text-[#f6ecd8] transition hover:bg-[#c9a45b]/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSendingEmail ? "Sending..." : "Send login email"}
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-[#120f0c]/85 p-5">
          <h2 className="font-serif text-xl">Verify OTP</h2>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-2 text-sm text-[#cfc3ad]">
              Token
              <input
                value={token}
                onChange={(event) => setToken(event.target.value)}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-[#f6ecd8] outline-none transition focus:border-[#c9a45b]"
                placeholder="Enter email token"
              />
            </label>
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isVerifying || !email.trim() || !token.trim()}
              className="rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-[#f6ecd8] transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </section>

        {(status || error) && (
          <section className="rounded-xl border border-white/10 bg-[#120f0c]/85 p-4">
            {status ? <p className="text-sm text-[#bfe3bf]">{status}</p> : null}
            {error ? <p className="text-sm text-[#f0a99a]">{error}</p> : null}
          </section>
        )}

        <section className="rounded-xl border border-white/10 bg-[#120f0c]/85 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-xl">Current user</h2>
            <button
              type="button"
              onClick={refreshUser}
              disabled={isLoadingUser}
              className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-[#cfc3ad] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoadingUser ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="mt-4 text-sm leading-7 text-[#cfc3ad]">
            {isLoadingUser ? (
              <p>Loading...</p>
            ) : user ? (
              <div className="grid gap-1">
                <p>
                  <span className="text-[#9f927d]">ID:</span> {user.id}
                </p>
                <p>
                  <span className="text-[#9f927d]">Email:</span>{" "}
                  {user.email ?? "No email"}
                </p>
              </div>
            ) : (
              <p>Not signed in</p>
            )}
          </div>

          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="mt-4 rounded-lg border border-[#f0a99a]/40 bg-[#f0a99a]/10 px-4 py-2 text-sm font-semibold text-[#f2c4ba] transition hover:bg-[#f0a99a]/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
          ) : null}
        </section>

        {user ? (
          <>
            <section className="rounded-xl border border-white/10 bg-[#120f0c]/85 p-5">
              <h2 className="font-serif text-xl">profiles</h2>
              {profile.error ? (
                <p className="mt-3 text-sm text-[#f0a99a]">{profile.error}</p>
              ) : (
                <div className="mt-3">
                  <JsonPreview value={profile.data} />
                </div>
              )}
            </section>

            <section className="rounded-xl border border-white/10 bg-[#120f0c]/85 p-5">
              <h2 className="font-serif text-xl">user_quotas</h2>
              {quota.error ? (
                <p className="mt-3 text-sm text-[#f0a99a]">{quota.error}</p>
              ) : (
                <div className="mt-3">
                  <JsonPreview value={quota.data} />
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
