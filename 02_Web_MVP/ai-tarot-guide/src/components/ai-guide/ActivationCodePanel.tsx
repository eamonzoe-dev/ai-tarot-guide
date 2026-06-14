"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";

import {
  LANGUAGE_STORAGE_KEY,
  type Language,
  languageLabel,
  withLang,
} from "@/lib/ai-guide/i18n";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Credits = {
  remaining_credits: number;
  total_credits: number;
};

type ActivationCodePanelProps = {
  lang: Language;
  hasLangParam?: boolean;
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

export function ActivationCodePanel({
  lang,
  hasLangParam = true,
}: ActivationCodePanelProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingCredits, setIsLoadingCredits] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isRedeemFormOpen, setIsRedeemFormOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (hasLangParam) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      return;
    }

    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (storedLanguage === "en" || storedLanguage === "zh") {
      window.location.replace(withLang("/ai-guide", {}, storedLanguage));
      return;
    }

    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, [hasLangParam, lang]);

  function rememberLanguage(nextLang: Language) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
  }

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
      setIsMenuOpen(false);
      setIsRedeemFormOpen(false);
      setStatus("Signed out.");
    }

    setIsSigningOut(false);
  }

  function handleCancelRedeem() {
    setActivationCode("");
    setError(null);
    setIsRedeemFormOpen(false);
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

      if (!isCredits(nextCredits)) {
        throw new Error("Activation code redeemed, but credits could not load.");
      }

      setCredits(nextCredits);
      setActivationCode("");
      setIsRedeemFormOpen(false);
      setStatus("Deck code redeemed.");
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
    <div className="relative z-30">
      {isMenuOpen ? (
        <button
          aria-label="Close account menu"
          className="fixed inset-0 z-30 cursor-default bg-transparent"
          onClick={() => setIsMenuOpen(false)}
          type="button"
        />
      ) : null}

      <div className="relative z-40 flex items-center justify-end">
        <button
          aria-expanded={isMenuOpen}
          className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#3d3020] bg-[#0b0907]/70 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#d8c9ae] shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition hover:border-[#6d5a35] hover:text-[#f6ecd8]"
          onClick={() => {
            setIsMenuOpen((value) => !value);
            setStatus(null);
            setError(null);
          }}
          type="button"
        >
          {user ? (
            <>
              <span className="flex size-5 items-center justify-center rounded-full border border-[#6d5a35] bg-[#120d09] text-[0.62rem] text-[#d9bd80]">
                {(user.email ?? "A").slice(0, 1).toUpperCase()}
              </span>
              <span>Account</span>
            </>
          ) : isLoadingUser ? (
            "Account"
          ) : (
            "Sign in"
          )}
        </button>
      </div>

      {isMenuOpen ? (
        <section className="absolute right-0 top-11 z-50 w-[min(calc(100vw-1rem),23rem)] rounded-xl border border-[#d9bd80]/24 bg-[#0b0907]/95 p-4 text-left shadow-[0_18px_48px_rgba(0,0,0,0.38)] backdrop-blur">
          <div className="grid gap-3">
            <div className="flex items-start gap-3 border-b border-[#2b241a] pb-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#6d5a35] bg-[#120d09] font-serif text-lg text-[#d9bd80]">
                {user ? (user.email ?? "A").slice(0, 1).toUpperCase() : "O"}
              </div>
              <div className="min-w-0">
                <p className="atelier-label text-[0.62rem] font-semibold">
                  Account
                </p>
                {user ? (
                  <div className="mt-1 grid gap-0.5">
                    <p className="text-sm leading-6 text-[#b7aa94]">
                      Signed in as{" "}
                      <span className="break-all text-[#d9bd80]">
                        {user.email ?? "current user"}
                      </span>
                    </p>
                    <p className="text-sm leading-6 text-[#8f826f]">
                      {isLoadingCredits
                        ? "Loading AI readings..."
                        : `${credits?.remaining_credits ?? 0} AI readings left`}
                    </p>
                  </div>
                ) : (
                  <p className="mt-1 text-xs leading-5 text-[#b7aa94]">
                    Sign in to redeem your deck code and unlock AI readings.
                  </p>
                )}
              </div>
            </div>

            {isLoadingUser ? (
              <p className="text-xs leading-5 text-[#9f947f]">
                Checking sign in...
              </p>
            ) : user ? (
              <div className="grid gap-3">
                <button
                  className="min-h-11 rounded-full border border-[#6d5a35]/75 bg-[#1a130b]/80 px-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#f2dfb9] transition hover:border-[#d9bd80] hover:text-[#fff7e8]"
                  onClick={() => {
                    setStatus(null);
                    setError(null);
                    setIsRedeemFormOpen(true);
                  }}
                  type="button"
                >
                  Redeem deck code
                </button>

                {isRedeemFormOpen ? (
                  <div className="grid gap-3 border-t border-[#3d3020] pt-3">
                    <label className="grid gap-2 text-xs text-[#cfc3ad]">
                      Activation code
                      <input
                        autoComplete="off"
                        className="min-h-11 rounded-full border border-[#3d3020] bg-[#0d0a08]/80 px-4 text-sm text-[#f6ecd8] outline-none transition focus:border-[#d9bd80]"
                        onChange={(event) =>
                          setActivationCode(event.target.value)
                        }
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
                        className="min-h-11 rounded-full border border-[#3d3020] bg-transparent px-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#b7aa94] transition hover:border-[#6d5a35] hover:text-[#efe8d9] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isRedeeming}
                        onClick={handleCancelRedeem}
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="grid border-y border-[#2b241a] text-sm leading-6">
                  <button
                    className="flex min-h-11 items-center justify-between border-b border-[#2b241a] py-2 text-left text-[#c8bca6] transition hover:text-[#f6ecd8]"
                    onClick={() => setIsMenuOpen(false)}
                    type="button"
                  >
                    <span>Reading Room</span>
                  </button>
                  <Link
                    className="flex min-h-11 items-center justify-between border-b border-[#2b241a] py-2 text-[#c8bca6] transition hover:text-[#f6ecd8]"
                    href={withLang("/ai-guide/readings", {}, lang)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Reading Journal</span>
                  </Link>
                  <div className="flex min-h-11 items-center justify-between gap-3 border-b border-[#2b241a] py-2">
                    <span className="text-[#c8bca6]">Language</span>
                    <div className="inline-flex min-h-8 items-center rounded-full border border-[#6d5a35]/45 bg-[#080706]/80 p-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#a9a59d]">
                      {(["en", "zh"] as const).map((nextLang) => (
                        <Link
                          className={`flex min-h-7 touch-manipulation items-center rounded-full px-2.5 transition ${
                            lang === nextLang
                              ? "bg-[#2b2114] text-[#f2dfb9]"
                              : "text-[#9f947f] hover:text-[#efe8d9]"
                          }`}
                          href={withLang("/ai-guide", {}, nextLang)}
                          key={nextLang}
                          onClick={() => rememberLanguage(nextLang)}
                        >
                          {nextLang === "en" ? "EN" : languageLabel(nextLang)}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="flex min-h-11 items-center justify-between py-2 text-[#7d7466]">
                    <span>Settings</span>
                    <span className="text-[0.68rem] uppercase tracking-[0.14em]">
                      Coming soon
                    </span>
                  </div>
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

            <div className="grid gap-3 border-t border-[#3d3020] pt-3">
              {!user ? (
                <div>
                <p className="atelier-label text-[0.58rem] font-semibold">
                  Language
                </p>
                <div className="mt-2 inline-flex min-h-10 items-center rounded-full border border-[#6d5a35]/55 bg-[#080706]/80 p-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#a9a59d]">
                  {(["en", "zh"] as const).map((nextLang) => (
                    <Link
                      className={`flex min-h-8 touch-manipulation items-center rounded-full px-3 transition ${
                        lang === nextLang
                          ? "bg-[#2b2114] text-[#f2dfb9] shadow-[0_0_18px_rgba(214,179,109,0.12)]"
                          : "text-[#9f947f] hover:text-[#efe8d9]"
                      }`}
                      href={withLang("/ai-guide", {}, nextLang)}
                      key={nextLang}
                      onClick={() => rememberLanguage(nextLang)}
                    >
                      {nextLang === "en" ? "EN" : languageLabel(nextLang)}
                    </Link>
                  ))}
                </div>
              </div>
              ) : null}

              {user ? (
                <button
                  className="justify-self-start rounded-full py-1.5 text-sm font-semibold uppercase tracking-[0.16em] text-[#8f826f] transition hover:text-[#d8c9ae] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSigningOut}
                  onClick={handleSignOut}
                  type="button"
                >
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </button>
              ) : null}
            </div>

            {status ? (
              <p className="text-xs leading-5 text-[#bfe3bf]">{status}</p>
            ) : null}
            {error ? (
              <p className="text-xs leading-5 text-[#f0a99a]">{error}</p>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
