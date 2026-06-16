"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";

import {
  LANGUAGE_STORAGE_KEY,
  type Language,
  languageLabel,
  withLang,
} from "@/lib/ai-guide/i18n";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const CREDITS_UPDATED_EVENT = "ora-arcana:credits-updated";
const CREDITS_REFRESH_THROTTLE_MS = 1500;

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
  const lastCreditsRefreshAtRef = useRef(0);

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
          getApiErrorMessage(payload, "Unable to load Reading Credits."),
        );
      }

      const nextCredits =
        payload && typeof payload === "object"
          ? (payload as Record<string, unknown>).credits
          : null;

      if (!isCredits(nextCredits)) {
        throw new Error("Unable to load Reading Credits.");
      }

      setCredits(nextCredits);
    } catch (creditsError) {
      setCredits(null);
      setError(
        creditsError instanceof Error
          ? creditsError.message
          : "Unable to load Reading Credits.",
      );
    } finally {
      setIsLoadingCredits(false);
    }
  }, []);

  const requestCreditsRefresh = useCallback(() => {
    if (!user) {
      return;
    }

    const now = Date.now();

    if (now - lastCreditsRefreshAtRef.current < CREDITS_REFRESH_THROTTLE_MS) {
      return;
    }

    lastCreditsRefreshAtRef.current = now;
    void loadCredits();
  }, [loadCredits, user]);

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

  useEffect(() => {
    if (isMenuOpen) {
      requestCreditsRefresh();
    }
  }, [isMenuOpen, requestCreditsRefresh]);

  useEffect(() => {
    function handleCreditsRefresh() {
      requestCreditsRefresh();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        requestCreditsRefresh();
      }
    }

    window.addEventListener("focus", handleCreditsRefresh);
    window.addEventListener(CREDITS_UPDATED_EVENT, handleCreditsRefresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleCreditsRefresh);
      window.removeEventListener(CREDITS_UPDATED_EVENT, handleCreditsRefresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [requestCreditsRefresh]);

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
          getApiErrorMessage(payload, "That code could not be redeemed."),
        );
      }

      const nextCredits =
        payload && typeof payload === "object"
          ? (payload as Record<string, unknown>).credits
          : null;

      if (!isCredits(nextCredits)) {
        throw new Error("Deck code redeemed, but Reading Credits could not refresh.");
      }

      setCredits(nextCredits);
      setActivationCode("");
      setIsRedeemFormOpen(false);
      setStatus("Deck code redeemed. Credits updated.");
    } catch (redeemError) {
      setError(
        redeemError instanceof Error
          ? redeemError.message
          : "That code could not be redeemed. Check the code and try again.",
      );
    } finally {
      setIsRedeeming(false);
    }
  }

  const creditsRemaining = credits?.remaining_credits ?? 0;

  return (
    <div className="relative z-[280]">
      {isMenuOpen ? (
        <button
          aria-label="Close account menu"
          className="fixed inset-0 z-[270] cursor-default bg-transparent"
          onClick={() => setIsMenuOpen(false)}
          type="button"
        />
      ) : null}

      <div className="relative z-[290] flex items-center justify-end">
        <button
          aria-expanded={isMenuOpen}
          className="pointer-events-auto inline-flex min-h-10 items-center gap-2 rounded-full border border-[#d8b76a]/55 bg-[#fffaf0]/88 px-4 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#5b4a36] shadow-[0_10px_26px_rgba(111,84,43,0.12),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#caa96a] hover:bg-[#fff7e8] hover:text-[#3f352b]"
          onClick={() => {
            setIsMenuOpen((value) => !value);
            setStatus(null);
            setError(null);
          }}
          type="button"
        >
          {user ? (
            <>
              <span className="flex size-6 items-center justify-center rounded-full border border-[#caa96a]/65 bg-[#f6e1ae] font-serif text-[0.72rem] text-[#5b3c16]">
                {(user.email ?? "A").slice(0, 1).toUpperCase()}
              </span>
              <span>Reading Account</span>
            </>
          ) : isLoadingUser ? (
            "Reading Account"
          ) : (
            "Sign in"
          )}
        </button>
      </div>

      {isMenuOpen ? (
        <section className="absolute right-0 top-12 z-[300] w-[min(calc(100vw-1.5rem),24rem)] overflow-hidden rounded-3xl border border-[#d8b76a]/45 bg-[#fffaf0]/96 p-4 text-left text-[#4f4235] shadow-[0_24px_70px_rgba(102,75,33,0.22),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-md sm:p-5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,255,255,0.92),transparent_32%),radial-gradient(circle_at_92%_12%,rgba(216,183,106,0.18),transparent_30%),repeating-linear-gradient(90deg,rgba(91,74,54,0.035)_0_1px,transparent_1px_18px)]"
          />
          <div className="relative grid gap-4">
            <div className="flex items-start gap-3 border-b border-[#d8b76a]/30 pb-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#caa96a]/60 bg-[#f6e1ae]/80 font-serif text-lg text-[#5b3c16] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                {user ? (user.email ?? "A").slice(0, 1).toUpperCase() : "O"}
              </div>
              <div className="min-w-0">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#9d7b3f]">
                  {user ? "Reading Account" : "Enter your reading room"}
                </p>
                {user ? (
                  <div className="mt-2 grid gap-1">
                    <p className="text-sm leading-6 text-[#6f5f4b]">
                      Signed in as{" "}
                      <span className="break-all font-semibold text-[#4f4235]">
                        {user.email ?? "current user"}
                      </span>
                    </p>
                    <p className="text-sm leading-6 text-[#766955]">
                      Your readings are saved when you are signed in.
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-[#766955]">
                    Sign in to save your readings and redeem deck codes.
                  </p>
                )}
              </div>
            </div>

            {isLoadingUser ? (
              <p className="rounded-2xl border border-[#d8b76a]/28 bg-[#fff7e8]/72 px-4 py-3 text-xs leading-5 text-[#766955]">
                Checking your reading account...
              </p>
            ) : user ? (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-[#d8b76a]/34 bg-[#fff7e8]/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#9d7b3f]">
                      Reading Credits
                    </p>
                    <span className="rounded-full border border-[#caa96a]/38 bg-[#fffaf0] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#6f4f20]">
                      {isLoadingCredits ? "Loading" : `${creditsRemaining} remaining`}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#6f5f4b]">
                    {creditsRemaining === 0
                      ? "Each AI reading uses 1 credit. Redeem a deck code to add credits."
                      : "Each AI reading uses 1 credit."}
                  </p>
                </div>

                <button
                  className="min-h-11 rounded-full border border-[#caa96a]/60 bg-[linear-gradient(180deg,#f7e5b8,#d7ad62)] px-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#3f2b14] shadow-[0_12px_28px_rgba(157,123,63,0.18),inset_0_1px_0_rgba(255,255,255,0.62)] transition hover:-translate-y-0.5 hover:border-[#9d7b3f] disabled:cursor-not-allowed disabled:opacity-55"
                  onClick={() => {
                    setStatus(null);
                    setError(null);
                    setIsRedeemFormOpen(true);
                  }}
                  type="button"
                >
                  Redeem Deck Code
                </button>

                {isRedeemFormOpen ? (
                  <div className="grid gap-3 rounded-2xl border border-[#d8b76a]/30 bg-[#fffaf0]/72 p-4">
                    <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#6f5f4b]">
                      Deck code
                      <input
                        autoComplete="off"
                        className="min-h-11 rounded-full border border-[#d8b76a]/45 bg-[#fffdf8] px-4 text-sm normal-case tracking-normal text-[#3f352b] outline-none transition placeholder:text-[#b09d7f] focus:border-[#9d7b3f] focus:ring-2 focus:ring-[#d8b76a]/20"
                        onChange={(event) =>
                          setActivationCode(event.target.value)
                        }
                        placeholder="Enter deck code"
                        type="text"
                        value={activationCode}
                      />
                    </label>
                    <p className="text-xs leading-5 text-[#766955]">
                      Physical deck activation codes add credits to your account.
                    </p>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <button
                        className="min-h-11 rounded-full border border-[#caa96a]/60 bg-[#31483f] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#fff7e8] shadow-[0_10px_24px_rgba(49,72,63,0.16)] transition hover:-translate-y-0.5 hover:bg-[#263b34] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isRedeeming || !activationCode.trim()}
                        onClick={handleRedeemCode}
                        type="button"
                      >
                        {isRedeeming ? "Redeeming..." : "Redeem"}
                      </button>
                      <button
                        className="min-h-11 rounded-full border border-[#d8b76a]/42 bg-[#fffaf0] px-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#6f5f4b] transition hover:border-[#9d7b3f] hover:text-[#3f352b] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isRedeeming}
                        onClick={handleCancelRedeem}
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="grid overflow-hidden rounded-2xl border border-[#d8b76a]/30 bg-[#fff7e8]/62 text-sm leading-6">
                  <button
                    className="flex min-h-11 items-center justify-between border-b border-[#d8b76a]/24 px-4 py-2 text-left text-[#5b4a36] transition hover:bg-[#fffaf0] hover:text-[#9d7b3f]"
                    onClick={() => setIsMenuOpen(false)}
                    type="button"
                  >
                    <span>Reading Room</span>
                  </button>
                  <Link
                    className="flex min-h-11 items-center justify-between border-b border-[#d8b76a]/24 px-4 py-2 text-[#5b4a36] transition hover:bg-[#fffaf0] hover:text-[#9d7b3f]"
                    href={withLang("/ai-guide/readings", {}, lang)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>View Reading Journal</span>
                  </Link>
                  <div className="flex min-h-11 items-center justify-between gap-3 px-4 py-2">
                    <span className="text-[#5b4a36]">Language</span>
                    <div className="inline-flex min-h-8 items-center rounded-full border border-[#d8b76a]/45 bg-[#fffaf0] p-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#8f826f]">
                      {(["en", "zh"] as const).map((nextLang) => (
                        <Link
                          className={`flex min-h-7 touch-manipulation items-center rounded-full px-2.5 transition ${
                            lang === nextLang
                              ? "bg-[#31483f] text-[#fff7e8]"
                              : "text-[#8f826f] hover:text-[#5b4a36]"
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
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#6f5f4b]">
                  Email
                  <input
                    autoComplete="email"
                    className="min-h-11 rounded-full border border-[#d8b76a]/45 bg-[#fffdf8] px-4 text-sm normal-case tracking-normal text-[#3f352b] outline-none transition placeholder:text-[#b09d7f] focus:border-[#9d7b3f] focus:ring-2 focus:ring-[#d8b76a]/20"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                  />
                </label>
                <button
                  className="min-h-11 rounded-full border border-[#caa96a]/60 bg-[linear-gradient(180deg,#f7e5b8,#d7ad62)] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#3f2b14] shadow-[0_12px_28px_rgba(157,123,63,0.18),inset_0_1px_0_rgba(255,255,255,0.62)] transition hover:-translate-y-0.5 hover:border-[#9d7b3f] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSendingEmail || !email.trim()}
                  onClick={handleSendLoginEmail}
                  type="button"
                >
                  {isSendingEmail ? "Sending..." : "Send sign-in email"}
                </button>
                <p className="rounded-2xl border border-[#d8b76a]/26 bg-[#fff7e8]/68 px-4 py-3 text-xs leading-5 text-[#766955]">
                  No password needed. We&apos;ll send you a secure sign-in link.
                </p>
              </div>
            )}

            <div className="grid gap-3 border-t border-[#d8b76a]/30 pt-4">
              {!user ? (
                <div>
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[#9d7b3f]">
                    Language
                  </p>
                  <div className="mt-2 inline-flex min-h-10 items-center rounded-full border border-[#d8b76a]/45 bg-[#fff7e8]/76 p-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#8f826f]">
                    {(["en", "zh"] as const).map((nextLang) => (
                      <Link
                        className={`flex min-h-8 touch-manipulation items-center rounded-full px-3 transition ${
                          lang === nextLang
                            ? "bg-[#31483f] text-[#fff7e8] shadow-[0_8px_18px_rgba(49,72,63,0.12)]"
                            : "text-[#8f826f] hover:text-[#5b4a36]"
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

              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[0.68rem] uppercase tracking-[0.12em] text-[#8a765d]">
                <Link
                  className="transition hover:text-[#9d7b3f]"
                  href={withLang("/privacy", {}, lang)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Privacy
                </Link>
                <Link
                  className="transition hover:text-[#9d7b3f]"
                  href={withLang("/terms", {}, lang)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Terms
                </Link>
                <Link
                  className="transition hover:text-[#9d7b3f]"
                  href={withLang("/disclaimer", {}, lang)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Disclaimer
                </Link>
                <Link
                  className="transition hover:text-[#9d7b3f]"
                  href={withLang("/contact", {}, lang)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>

              {user ? (
                <button
                  className="justify-self-start rounded-full px-1 py-1.5 text-sm font-semibold uppercase tracking-[0.16em] text-[#8a765d] transition hover:text-[#9d7b3f] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSigningOut}
                  onClick={handleSignOut}
                  type="button"
                >
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </button>
              ) : null}
            </div>

            {status ? (
              <p className="rounded-2xl border border-[#8fb58a]/30 bg-[#eef7e9] px-4 py-3 text-xs leading-5 text-[#3e6d3f]">
                {status}
              </p>
            ) : null}
            {error ? (
              <p className="rounded-2xl border border-[#d9a08f]/35 bg-[#fff0ea] px-4 py-3 text-xs leading-5 text-[#9a4b35]">
                {error}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
