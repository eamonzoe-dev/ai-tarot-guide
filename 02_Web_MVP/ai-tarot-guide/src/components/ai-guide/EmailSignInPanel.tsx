"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type EmailSignInPanelProps = {
  compact?: boolean;
  reason?: string;
};

export function EmailSignInPanel({
  compact = false,
  reason = "Sign in to save your readings, view your credits, and redeem a deck code.",
}: EmailSignInPanelProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const refreshUser = useCallback(async () => {
    setIsLoadingUser(true);
    setError(null);

    const { data: sessionData, error: getSessionError } =
      await supabase.auth.getSession();

    if (getSessionError) {
      setUser(null);
      setError(getSessionError.message);
      setIsLoadingUser(false);
      return;
    }

    if (!sessionData.session) {
      setUser(null);
      setError(null);
      setIsLoadingUser(false);
      return;
    }

    const { data, error: getUserError } = await supabase.auth.getUser();

    setUser(data.user ?? null);
    setError(getUserError?.message ?? null);
    setIsLoadingUser(false);
  }, [supabase]);

  useEffect(() => {
    queueMicrotask(() => {
      void refreshUser();
    });
  }, [refreshUser]);

  async function handleSendLoginEmail() {
    setIsSendingEmail(true);
    setStatus(null);
    setError(null);

    const next = `${window.location.pathname}${window.location.search}`;
    const emailRedirectTo = `${
      window.location.origin
    }/auth/callback?next=${encodeURIComponent(next)}`;
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo,
      },
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      setStatus(
        "Sign-in email sent. Check your inbox to enter the Reading Room.",
      );
    }

    setIsSendingEmail(false);
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    setStatus(null);
    setError(null);

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
    } else {
      setUser(null);
      setEmail("");
      setError(null);
      setStatus("Signed out.");
    }

    setIsSigningOut(false);
  }

  return (
    <section
      className={
        compact
          ? "rounded-xl border border-[#3d3020] bg-[#0b0907]/60 p-3"
          : "rounded-2xl border border-[#d9bd80]/24 bg-[linear-gradient(180deg,rgba(17,13,10,0.9),rgba(7,7,6,0.96))] p-5 shadow-[0_16px_44px_rgba(0,0,0,0.28)]"
      }
    >
      <div className={compact ? "grid gap-3" : "grid gap-4"}>
        <div>
          <p className="atelier-label text-[0.62rem] font-semibold">
            Reading Account
          </p>
          <p
            className={
              compact
                ? "mt-1 text-xs leading-5 text-[#b7aa94]"
                : "mt-2 text-sm leading-6 text-[#d8c9ae]"
            }
          >
            {reason}
          </p>
        </div>

        {isLoadingUser ? (
          <p className="text-xs leading-5 text-[#9f947f]">
            Checking your reading account...
          </p>
        ) : user ? (
          <div className="grid gap-3">
            <p className="text-sm leading-6 text-[#e8decb]">
              Signed in as{" "}
              <span className="text-[#d9bd80]">
                {user.email ?? "current user"}
              </span>
            </p>
            <button
              className="ritual-action-link w-full sm:w-auto"
              disabled={isSigningOut}
              onClick={handleSignOut}
              type="button"
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            <label className="grid gap-2 text-xs text-[#cfc3ad]">
              Email
              <input
                autoComplete="email"
                className="min-h-11 rounded-full border border-[#3d3020] bg-[#0d0a08]/80 px-4 text-sm text-[#f6ecd8] outline-none transition focus:border-[#d9bd80]"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                type="email"
                value={email}
              />
            </label>
            <button
              className="ritual-action-link w-full sm:w-auto"
              disabled={isSendingEmail || !email.trim()}
              onClick={handleSendLoginEmail}
              type="button"
            >
              {isSendingEmail ? "Sending..." : "Send sign-in email"}
            </button>
          </div>
        )}

        {status ? <p className="text-xs leading-5 text-[#bfe3bf]">{status}</p> : null}
        {error ? <p className="text-xs leading-5 text-[#f0a99a]">{error}</p> : null}
      </div>
    </section>
  );
}
