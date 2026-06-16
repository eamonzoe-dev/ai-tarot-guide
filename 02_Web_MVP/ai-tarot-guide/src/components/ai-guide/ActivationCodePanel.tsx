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
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
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
      setIsTopUpOpen(false);
      setIsNotificationsOpen(false);
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
  const userInitial = (user?.email ?? "A").slice(0, 1).toUpperCase();
  const accountName =
    user?.email?.split("@")[0]?.trim() || (user ? "Account" : "");
  const isAnyPanelOpen = isMenuOpen || isTopUpOpen || isNotificationsOpen;

  function closePanels() {
    setIsMenuOpen(false);
    setIsTopUpOpen(false);
    setIsNotificationsOpen(false);
  }

  function openAccountMenu() {
    setIsMenuOpen((value) => !value);
    setIsTopUpOpen(false);
    setIsNotificationsOpen(false);
    setStatus(null);
    setError(null);
  }

  function openTopUpPreview() {
    setIsTopUpOpen((value) => !value);
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
    setStatus(null);
    setError(null);
  }

  function openNotificationsPreview() {
    setIsNotificationsOpen((value) => !value);
    setIsMenuOpen(false);
    setIsTopUpOpen(false);
    setStatus(null);
    setError(null);
  }

  return (
    <div className="relative z-[280]">
      {isAnyPanelOpen ? (
        <button
          aria-label="Close account panel"
          className="fixed inset-0 z-[270] cursor-default bg-transparent"
          onClick={closePanels}
          type="button"
        />
      ) : null}

      <div className="relative z-[290] flex min-w-0 items-center justify-end gap-1.5">
        {user ? (
          <>
            <span className="hidden min-h-9 items-center rounded-full border border-[#d8b76a]/42 bg-[#fffaf0]/82 px-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.11em] text-[#5b4a36] shadow-[0_7px_18px_rgba(111,84,43,0.08),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur sm:inline-flex">
              {isLoadingCredits ? "Credits" : `${creditsRemaining} Credits`}
            </span>
            <button
              aria-expanded={isTopUpOpen}
              className="hidden min-h-9 items-center rounded-full border border-[#caa96a]/55 bg-[#f7e5b8]/82 px-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.11em] text-[#5b3c16] shadow-[0_7px_18px_rgba(157,123,63,0.09),inset_0_1px_0_rgba(255,255,255,0.68)] transition hover:-translate-y-0.5 hover:border-[#9d7b3f] sm:inline-flex"
              onClick={openTopUpPreview}
              type="button"
            >
              Top Up
            </button>
            <button
              aria-expanded={isNotificationsOpen}
              aria-label="Notifications"
              className="hidden size-8 items-center justify-center rounded-full border border-[#d8b76a]/42 bg-[#fffaf0]/86 text-[#6f4f20] shadow-[0_7px_18px_rgba(111,84,43,0.08),inset_0_1px_0_rgba(255,255,255,0.72)] transition hover:-translate-y-0.5 hover:border-[#caa96a] sm:inline-flex"
              onClick={openNotificationsPreview}
              type="button"
            >
              <svg
                aria-hidden="true"
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M13.7 21a2 2 0 0 1-3.4 0" />
              </svg>
            </button>
            <button
              aria-expanded={isMenuOpen}
              className="pointer-events-auto inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[#d8b76a]/55 bg-[#fffaf0]/88 px-2 text-[0.72rem] font-semibold normal-case tracking-normal text-[#5b4a36] shadow-[0_8px_20px_rgba(111,84,43,0.1),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#caa96a] hover:bg-[#fff7e8] hover:text-[#3f352b] sm:px-2.5"
              onClick={openAccountMenu}
              type="button"
            >
              <span className="flex size-5 items-center justify-center rounded-full border border-[#caa96a]/65 bg-[#f6e1ae] font-serif text-[0.66rem] text-[#5b3c16]">
                {userInitial}
              </span>
              <span className="hidden max-w-24 truncate sm:inline">
                {accountName}
              </span>
            </button>
          </>
        ) : (
          <button
            aria-expanded={isMenuOpen}
            className="pointer-events-auto inline-flex min-h-9 items-center gap-2 rounded-full border border-[#d8b76a]/55 bg-[#fffaf0]/88 px-3.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#5b4a36] shadow-[0_8px_20px_rgba(111,84,43,0.1),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#caa96a] hover:bg-[#fff7e8] hover:text-[#3f352b]"
            onClick={openAccountMenu}
            type="button"
          >
            {isLoadingUser ? "Reading Account" : "Sign in"}
          </button>
        )}
      </div>

      {isTopUpOpen ? (
        <section className="absolute right-0 top-10 z-[300] w-[min(calc(100vw-1.5rem),19rem)] overflow-hidden rounded-2xl border border-[#d8b76a]/45 bg-[#fffaf0]/96 p-3.5 text-left text-[#4f4235] shadow-[0_18px_48px_rgba(102,75,33,0.17),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-md">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,255,255,0.92),transparent_32%),radial-gradient(circle_at_92%_12%,rgba(216,183,106,0.18),transparent_30%)]"
          />
          <div className="relative">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#9d7b3f]">
              Top Up
            </p>
            <h2 className="mt-2 font-serif text-xl text-[#3f352b]">
              Credit top-up is coming soon.
            </h2>
            <p className="mt-2 text-xs leading-5 text-[#766955]">
              For now, deck codes can add credits to your Reading Account.
            </p>
          </div>
        </section>
      ) : null}

      {isNotificationsOpen ? (
        <section className="absolute right-0 top-10 z-[300] w-[min(calc(100vw-1.5rem),19rem)] overflow-hidden rounded-2xl border border-[#d8b76a]/45 bg-[#fffaf0]/96 p-3.5 text-left text-[#4f4235] shadow-[0_18px_48px_rgba(102,75,33,0.17),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-md">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,255,255,0.92),transparent_32%),radial-gradient(circle_at_92%_12%,rgba(216,183,106,0.18),transparent_30%)]"
          />
          <div className="relative">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#9d7b3f]">
              Notifications
            </p>
            <h2 className="mt-2 font-serif text-xl text-[#3f352b]">
              No notifications yet.
            </h2>
            <p className="mt-2 text-xs leading-5 text-[#766955]">
              Reading reminders and account updates will appear here later.
            </p>
          </div>
        </section>
      ) : null}

      {isMenuOpen && !user ? (
        <section className="fixed left-1/2 top-1/2 z-[300] max-h-[80vh] w-[min(calc(100vw-1.5rem),25rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-[#d8b76a]/45 bg-[#fffaf0]/96 p-4 text-left text-[#4f4235] shadow-[0_24px_68px_rgba(79,66,53,0.23),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-md">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,255,255,0.92),transparent_32%),radial-gradient(circle_at_92%_12%,rgba(216,183,106,0.18),transparent_30%),repeating-linear-gradient(90deg,rgba(91,74,54,0.035)_0_1px,transparent_1px_18px)]"
          />
          <div className="relative grid gap-3">
            <div className="flex items-start gap-2.5 border-b border-[#d8b76a]/30 pb-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#caa96a]/60 bg-[#f6e1ae]/80 font-serif text-base text-[#5b3c16] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                O
              </div>
              <div className="min-w-0">
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#9d7b3f]">
                  Enter your reading room
                </p>
                <p className="mt-1.5 text-xs leading-5 text-[#766955]">
                  Sign in to save your readings and redeem deck codes.
                </p>
              </div>
            </div>

            {isLoadingUser ? (
              <p className="rounded-xl border border-[#d8b76a]/28 bg-[#fff7e8]/72 px-3 py-2 text-xs leading-5 text-[#766955]">
                Checking your reading account...
              </p>
            ) : (
              <div className="grid gap-3">
                <label className="grid gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#6f5f4b]">
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
                <p className="rounded-xl border border-[#d8b76a]/26 bg-[#fff7e8]/68 px-3 py-2 text-xs leading-5 text-[#766955]">
                  No password needed. We&apos;ll send you a secure sign-in link.
                </p>
              </div>
            )}

            <div className="grid gap-2.5 border-t border-[#d8b76a]/30 pt-3">
              <div>
                <p className="text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[#9d7b3f]">
                  Language
                </p>
                <div className="mt-1.5 inline-flex min-h-9 items-center rounded-full border border-[#d8b76a]/45 bg-[#fff7e8]/76 p-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[#8f826f]">
                  {(["en", "zh"] as const).map((nextLang) => (
                    <Link
                      className={`flex min-h-7 touch-manipulation items-center rounded-full px-2.5 transition ${
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
            </div>

            {status ? (
              <p className="rounded-xl border border-[#8fb58a]/30 bg-[#eef7e9] px-3 py-2 text-xs leading-5 text-[#3e6d3f]">
                {status}
              </p>
            ) : null}
            {error ? (
              <p className="rounded-xl border border-[#d9a08f]/35 bg-[#fff0ea] px-3 py-2 text-xs leading-5 text-[#9a4b35]">
                {error}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {isMenuOpen && user ? (
        <section className="absolute right-0 top-10 z-[300] max-h-[80vh] w-[min(calc(100vw-1.5rem),22.5rem)] overflow-y-auto overflow-x-hidden rounded-2xl border border-[#d8b76a]/45 bg-[#fffaf0]/96 p-3 text-left text-[#4f4235] shadow-[0_20px_56px_rgba(102,75,33,0.19),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-md sm:p-3.5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,255,255,0.92),transparent_32%),radial-gradient(circle_at_92%_12%,rgba(216,183,106,0.18),transparent_30%),repeating-linear-gradient(90deg,rgba(91,74,54,0.035)_0_1px,transparent_1px_18px)]"
          />
          <div className="relative grid gap-3">
            <div className="flex items-center gap-2.5 border-b border-[#d8b76a]/30 pb-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#caa96a]/60 bg-[#f6e1ae]/80 font-serif text-sm text-[#5b3c16] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold leading-5 text-[#3f352b]">
                  {accountName}
                </p>
                <p className="truncate text-[0.68rem] leading-4 text-[#8a765d]">
                  {user.email ?? "Reading Account"}
                </p>
              </div>
            </div>

            <p className="rounded-full border border-[#d8b76a]/28 bg-[#fff7e8]/68 px-3 py-1.5 text-[0.72rem] leading-5 text-[#6f5f4b]">
              <span className="font-semibold text-[#6f4f20]">
                {isLoadingCredits ? "Loading credits" : `${creditsRemaining} credits`}
              </span>{" "}
              · Each AI reading uses 1 credit.
            </p>

            <div className="grid grid-cols-2 gap-1.5">
              <Link
                className="grid min-h-[4.5rem] place-items-center rounded-xl border border-transparent bg-transparent px-2 py-2 text-center transition hover:border-[#d8b76a]/26 hover:bg-[#fff7e8]/78"
                href={withLang("/ai-guide", {}, lang)}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex size-7 items-center justify-center rounded-full border border-[#d8b76a]/35 bg-[#fffaf0] text-[0.62rem] font-semibold text-[#9d7b3f]">
                  R
                </span>
                <span className="mt-1 block text-xs font-semibold text-[#3f352b]">
                  Reading Room
                </span>
              </Link>
              <Link
                className="grid min-h-[4.5rem] place-items-center rounded-xl border border-transparent bg-transparent px-2 py-2 text-center transition hover:border-[#d8b76a]/26 hover:bg-[#fff7e8]/78"
                href={withLang("/ai-guide/readings", {}, lang)}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex size-7 items-center justify-center rounded-full border border-[#d8b76a]/35 bg-[#fffaf0] text-[0.62rem] font-semibold text-[#9d7b3f]">
                  J
                </span>
                <span className="mt-1 block text-xs font-semibold text-[#3f352b]">
                  Journal
                </span>
              </Link>
              <button
                className="grid min-h-[4.5rem] place-items-center rounded-xl border border-transparent bg-transparent px-2 py-2 text-center transition hover:border-[#d8b76a]/26 hover:bg-[#fff7e8]/78"
                onClick={() => {
                  setStatus(null);
                  setError(null);
                  setIsRedeemFormOpen((value) => !value);
                }}
                type="button"
              >
                <span className="flex size-7 items-center justify-center rounded-full border border-[#d8b76a]/35 bg-[#fffaf0] text-[0.62rem] font-semibold text-[#9d7b3f]">
                  +
                </span>
                <span className="mt-1 block text-xs font-semibold text-[#3f352b]">
                  Redeem
                </span>
              </button>
              <button
                className="grid min-h-[4.5rem] place-items-center rounded-xl border border-transparent bg-transparent px-2 py-2 text-center transition hover:border-[#d8b76a]/26 hover:bg-[#fff7e8]/78"
                onClick={() => {
                  setStatus("Membership preview is coming soon.");
                  setError(null);
                }}
                type="button"
              >
                <span className="flex size-7 items-center justify-center rounded-full border border-[#d8b76a]/35 bg-[#fffaf0] text-[0.62rem] font-semibold text-[#9d7b3f]">
                  M
                </span>
                <span className="mt-1 block text-xs font-semibold text-[#3f352b]">
                  Membership
                </span>
                <span className="mt-0.5 block text-[0.6rem] text-[#8a765d]">
                  Coming soon
                </span>
              </button>
              <button
                className="grid min-h-[4.5rem] place-items-center rounded-xl border border-transparent bg-transparent px-2 py-2 text-center transition hover:border-[#d8b76a]/26 hover:bg-[#fff7e8]/78"
                onClick={() => setStatus(null)}
                type="button"
              >
                <span className="flex size-7 items-center justify-center rounded-full border border-[#d8b76a]/35 bg-[#fffaf0] text-[0.62rem] font-semibold text-[#9d7b3f]">
                  EN
                </span>
                <span className="mt-1 block text-xs font-semibold text-[#3f352b]">
                  Language
                </span>
                <span className="mt-0.5 block text-[0.6rem] text-[#8a765d]">
                  EN / 中文
                </span>
              </button>
              <div className="grid min-h-[4.5rem] place-items-center rounded-xl border border-transparent bg-transparent px-2 py-2 text-center">
                <span className="flex size-7 items-center justify-center rounded-full border border-[#d8b76a]/35 bg-[#fffaf0] text-[0.62rem] font-semibold text-[#9d7b3f]">
                  S
                </span>
                <button
                  className="mt-1 text-xs font-semibold text-[#3f352b] transition hover:text-[#9d7b3f] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSigningOut}
                  onClick={handleSignOut}
                  type="button"
                >
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            </div>

            {isRedeemFormOpen ? (
              <div className="grid gap-2.5 rounded-xl border border-[#d8b76a]/30 bg-[#fffaf0]/72 p-3">
                    <label className="grid gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#6f5f4b]">
                      Deck code
                      <input
                        autoComplete="off"
                        className="min-h-10 rounded-full border border-[#d8b76a]/45 bg-[#fffdf8] px-3.5 text-sm normal-case tracking-normal text-[#3f352b] outline-none transition placeholder:text-[#b09d7f] focus:border-[#9d7b3f] focus:ring-2 focus:ring-[#d8b76a]/20"
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
                        className="min-h-10 rounded-full border border-[#caa96a]/60 bg-[#31483f] px-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-[#fff7e8] shadow-[0_10px_24px_rgba(49,72,63,0.16)] transition hover:-translate-y-0.5 hover:bg-[#263b34] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isRedeeming || !activationCode.trim()}
                        onClick={handleRedeemCode}
                        type="button"
                      >
                        {isRedeeming ? "Redeeming..." : "Redeem"}
                      </button>
                      <button
                        className="min-h-10 rounded-full border border-[#d8b76a]/42 bg-[#fffaf0] px-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-[#6f5f4b] transition hover:border-[#9d7b3f] hover:text-[#3f352b] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isRedeeming}
                        onClick={handleCancelRedeem}
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
            ) : null}

            <div className="flex min-h-10 items-center justify-between gap-2.5 rounded-xl border border-[#d8b76a]/30 bg-[#fff7e8]/62 px-3 py-1.5 text-sm leading-6">
              <span className="text-xs text-[#5b4a36]">Language</span>
              <div className="inline-flex min-h-8 items-center rounded-full border border-[#d8b76a]/45 bg-[#fffaf0] p-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#8f826f]">
                {(["en", "zh"] as const).map((nextLang) => (
                  <Link
                    className={`flex min-h-7 touch-manipulation items-center rounded-full px-2 transition ${
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

            <div className="grid gap-2 border-t border-[#d8b76a]/30 pt-3">
              <div className="flex flex-wrap gap-x-2.5 gap-y-1 text-[0.62rem] uppercase tracking-[0.1em] text-[#8a765d]">
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
            </div>

            {status ? (
              <p className="rounded-xl border border-[#8fb58a]/30 bg-[#eef7e9] px-3 py-2 text-xs leading-5 text-[#3e6d3f]">
                {status}
              </p>
            ) : null}
            {error ? (
              <p className="rounded-xl border border-[#d9a08f]/35 bg-[#fff0ea] px-3 py-2 text-xs leading-5 text-[#9a4b35]">
                {error}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
