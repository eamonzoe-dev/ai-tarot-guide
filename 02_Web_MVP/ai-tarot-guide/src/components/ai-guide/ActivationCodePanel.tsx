"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Credits = {
  remaining_credits: number;
  total_credits: number;
};

function isCredits(value: unknown): value is Credits {
  if (!value || typeof value !== "object") {
    return false;
  }

  const credits = value as Record<string, unknown>;
  return (
    typeof credits.remaining_credits === "number" &&
    typeof credits.total_credits === "number"
  );
}

function getApiErrorMessage(value: unknown, fallback: string) {
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const payload = value as Record<string, unknown>;
  return typeof payload.error === "string" ? payload.error : fallback;
}

export function ActivationCodePanel() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingCredits, setIsLoadingCredits] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const loadCredits = useCallback(async () => {
    setIsLoadingCredits(true);

    try {
      const response = await fetch("/api/credits/me", {
        method: "GET",
      });
      const payload = (await response.json()) as unknown;

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(payload, "Unable to load AI reading credits."),
        );
      }

      const nextCredits =
        payload && typeof payload === "object"
          ? (payload as Record<string, unknown>).credits
          : null;

      if (!isCredits(nextCredits)) {
        throw new Error("Unable to load AI reading credits.");
      }

      setCredits(nextCredits);
    } catch (creditsError) {
      setCredits(null);
      setError(
        creditsError instanceof Error
          ? creditsError.message
          : "Unable to load AI reading credits.",
      );
    } finally {
      setIsLoadingCredits(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    setIsLoadingUser(true);
    setError(null);

    const { data: sessionData, error: getSessionError } =
      await supabase.auth.getSession();

    if (getSessionError) {
      setUser(null);
      setCredits(null);
      setError(getSessionError.message);
      setIsLoadingUser(false);
      return;
    }

    if (!sessionData.session) {
      setUser(null);
      setCredits(null);
      setError(null);
      setIsLoadingUser(false);
      return;
    }

    const { data, error: getUserError } = await supabase.auth.getUser();
    const currentUser = data.user ?? null;

    setUser(currentUser);
    setError(getUserError?.message ?? null);
    setIsLoadingUser(false);

    if (currentUser && !getUserError) {
      await loadCredits();
    }
  }, [loadCredits, supabase]);

  useEffect(() => {
    void refreshUser();
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
      setStatus("Login email sent. Check your inbox.");
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
      setCredits(null);
      setEmail("");
      setActivationCode("");
      setStatus("Signed out.");
    }

    setIsSigningOut(false);
  }

  async function handleRedeemCode() {
    setIsRedeeming(true);
    setStatus(null);
    setError(null);

    try {
      const response = await fetch("/api/activation/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: activationCode.trim(),
        }),
      });
      const payload = (await response.json()) as unknown;

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(payload, "Unable to redeem activation code."),
        );
      }

      const nextCredits =
        payload && typeof payload === "object"
          ? (payload as Record<string, unknown>).credits
          : null;
      const redeemedCredits =
        payload && typeof payload === "object"
          ? (payload as Record<string, unknown>).redeemedCredits
          : null;

      if (!isCredits(nextCredits)) {
        throw new Error("Activation code redeemed, but credits could not load.");
      }

      setCredits(nextCredits);
      setActivationCode("");
      setStatus(
        typeof redeemedCredits === "number"
          ? `Activation code redeemed. ${redeemedCredits} AI readings added.`
          : "Activation code redeemed.",
      );
    } catch (redeemError) {
      setError(
        redeemError instanceof Error
          ? redeemError.message
          : "Unable to redeem activation code.",
      );
    } finally {
      setIsRedeeming(false);
    }
  }

  return (
    <section className="rounded-xl border border-[#3d3020] bg-[#0b0907]/60 p-3">
      <div className="grid gap-3">
        <div>
          <p className="atelier-label text-[0.62rem] font-semibold">Account</p>
          <p className="mt-1 text-xs leading-5 text-[#b7aa94]">
            {user
              ? "Redeem your deck code and check your AI reading balance."
              : "Sign in to redeem your deck code and unlock AI readings."}
          </p>
        </div>

        {isLoadingUser ? (
          <p className="text-xs leading-5 text-[#9f947f]">Checking sign in...</p>
        ) : user ? (
          <div className="grid gap-3">
            <div className="grid gap-1 text-sm leading-6 text-[#e8decb]">
              <p>
                Signed in as{" "}
                <span className="text-[#d9bd80]">
                  {user.email ?? "current user"}
                </span>
              </p>
              <p className="text-xs text-[#b7aa94]">
                Remaining AI readings:{" "}
                <span className="text-[#f6ecd8]">
                  {isLoadingCredits
                    ? "Loading..."
                    : credits?.remaining_credits ?? 0}
                </span>
              </p>
            </div>

            <label className="grid gap-2 text-xs text-[#cfc3ad]">
              Activation code
              <input
                autoComplete="off"
                className="min-h-11 rounded-full border border-[#3d3020] bg-[#0d0a08]/80 px-4 text-sm text-[#f6ecd8] outline-none transition focus:border-[#d9bd80]"
                onChange={(event) => setActivationCode(event.target.value)}
                placeholder="Enter deck code"
                type="text"
                value={activationCode}
              />
            </label>

            <div className="grid gap-2 sm:grid-cols-2">
              <button
                className="ritual-action-link w-full"
                disabled={isRedeeming || !activationCode.trim()}
                onClick={handleRedeemCode}
                type="button"
              >
                {isRedeeming ? "Redeeming..." : "Redeem"}
              </button>
              <button
                className="ritual-action-link w-full opacity-80"
                disabled={isSigningOut}
                onClick={handleSignOut}
                type="button"
              >
                {isSigningOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
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
              className="ritual-action-link w-full"
              disabled={isSendingEmail || !email.trim()}
              onClick={handleSendLoginEmail}
              type="button"
            >
              {isSendingEmail ? "Sending..." : "Send login email"}
            </button>
          </div>
        )}

        {status ? <p className="text-xs leading-5 text-[#bfe3bf]">{status}</p> : null}
        {error ? <p className="text-xs leading-5 text-[#f0a99a]">{error}</p> : null}
      </div>
    </section>
  );
}
