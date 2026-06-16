"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [isMounted, setIsMounted] = useState(false);
  const lastCreditsRefreshAtRef = useRef(0);
  const isZh = lang === "zh";
  const copy = useMemo(
    () => ({
      closeAccountPanel: isZh ? "关闭账户面板" : "Close account panel",
      credits: isZh ? "解读额度" : "Credits",
      creditsCount: (value: number) => isZh ? `${value} 次解读额度` : `${value} Credits`,
      topUp: isZh ? "补充额度" : "Top Up",
      notifications: isZh ? "通知" : "Notifications",
      readingAccount: isZh ? "阅读账户" : "Reading Account",
      signIn: isZh ? "登录" : "Sign in",
      topUpTitle: isZh ? "额度补充即将开放。" : "Credit top-up is coming soon.",
      topUpBody: isZh
        ? "目前可通过卡组码为阅读账户增加解读额度。"
        : "For now, deck codes can add credits to your Reading Account.",
      notificationsTitle: isZh ? "暂时没有通知。" : "No notifications yet.",
      notificationsBody: isZh
        ? "阅读提醒和账户更新稍后会出现在这里。"
        : "Reading reminders and account updates will appear here later.",
      enterRoom: isZh ? "进入你的阅读室" : "Enter your reading room",
      chooseSignInMethod: isZh
        ? "选择你的登录方式"
        : "Choose how to enter your reading account",
      signInBody: isZh
        ? "登录后可保存解读，并兑换卡组码。"
        : "Sign in to save your readings and redeem deck codes.",
      continueWithApple: isZh ? "使用 Apple 继续" : "Continue with Apple",
      continueWithGoogle: isZh ? "使用 Google 继续" : "Continue with Google",
      emailMagicLink: isZh ? "邮箱 Magic Link" : "Email Magic Link",
      socialSignInSoon: isZh
        ? "Apple 和 Google 登录即将开放。当前请使用邮箱 Magic Link。"
        : "Apple and Google sign-in are coming soon. Please use Email Magic Link for now.",
      registerPrompt: isZh
        ? "没有账户？使用邮箱登录即可创建阅读账户。"
        : "No account yet? Sign in with email to create your Reading Account.",
      checkingAccount: isZh ? "正在检查你的阅读账户..." : "Checking your reading account...",
      email: isZh ? "邮箱" : "Email",
      sending: isZh ? "发送中..." : "Sending...",
      sendSignInEmail: isZh ? "发送登录邮件" : "Send sign-in email",
      passwordlessNote: isZh
        ? "无需密码。我们会发送一封安全登录邮件给你。"
        : "No password needed. We'll send you a secure sign-in link.",
      language: isZh ? "语言" : "Language",
      signInEmailSent: isZh
        ? "登录邮件已发送。请查看收件箱，进入阅读室。"
        : "Sign-in email sent. Check your inbox to enter the Reading Room.",
      signedOut: isZh ? "已退出登录。" : "Signed out.",
      unableToLoadCredits: isZh
        ? "暂时无法读取解读额度。"
        : "Unable to load Reading Credits.",
      codeCouldNotRedeem: isZh
        ? "这个卡组码暂时无法兑换。"
        : "That code could not be redeemed.",
      codeCouldNotRedeemRetry: isZh
        ? "这个卡组码暂时无法兑换。请检查后再试一次。"
        : "That code could not be redeemed. Check the code and try again.",
      redeemedButCreditsFailed: isZh
        ? "卡组码已兑换，但解读额度暂时未能刷新。"
        : "Deck code redeemed, but Reading Credits could not refresh.",
      redeemedCreditsUpdated: isZh
        ? "卡组码已兑换，解读额度已更新。"
        : "Deck code redeemed. Credits updated.",
      account: isZh ? "账户" : "Account",
      creditsLoading: isZh ? "正在读取额度" : "Loading credits",
      creditsLower: (value: number) => isZh ? `${value} 次额度` : `${value} credits`,
      creditUseNote: isZh ? "每次 AI 解读会使用 1 次额度。" : "Each AI reading uses 1 credit.",
      readingRoom: isZh ? "阅读室" : "Reading Room",
      journal: isZh ? "解读日志" : "Journal",
      redeem: isZh ? "兑换" : "Redeem",
      membership: isZh ? "会员" : "Membership",
      comingSoon: isZh ? "即将开放" : "Coming soon",
      membershipPreviewSoon: isZh
        ? "会员预览即将开放。"
        : "Membership preview is coming soon.",
      signOut: isZh ? "退出登录" : "Sign out",
      signingOut: isZh ? "正在退出..." : "Signing out...",
      deckCode: isZh ? "卡组码" : "Deck code",
      deckCodePlaceholder: isZh ? "输入卡组码" : "Enter deck code",
      redeemBody: isZh
        ? "实体卡组附带的激活码可为你的账户增加解读额度。"
        : "Physical deck activation codes add credits to your account.",
      redeeming: isZh ? "兑换中..." : "Redeeming...",
      cancel: isZh ? "取消" : "Cancel",
      privacy: isZh ? "隐私" : "Privacy",
      terms: isZh ? "条款" : "Terms",
      disclaimer: isZh ? "免责声明" : "Disclaimer",
      contact: isZh ? "联系" : "Contact",
    }),
    [isZh],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
          getApiErrorMessage(payload, copy.unableToLoadCredits),
        );
      }

      const nextCredits =
        payload && typeof payload === "object"
          ? (payload as Record<string, unknown>).credits
          : null;

      if (!isCredits(nextCredits)) {
        throw new Error(copy.unableToLoadCredits);
      }

      setCredits(nextCredits);
    } catch (creditsError) {
      setCredits(null);
      setError(
        creditsError instanceof Error
          ? creditsError.message
          : copy.unableToLoadCredits,
      );
    } finally {
      setIsLoadingCredits(false);
    }
  }, [copy.unableToLoadCredits]);

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
      setStatus(copy.signInEmailSent);
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
      setStatus(copy.signedOut);
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
          getApiErrorMessage(payload, copy.codeCouldNotRedeem),
        );
      }

      const nextCredits =
        payload && typeof payload === "object"
          ? (payload as Record<string, unknown>).credits
          : null;

      if (!isCredits(nextCredits)) {
        throw new Error(copy.redeemedButCreditsFailed);
      }

      setCredits(nextCredits);
      setActivationCode("");
      setIsRedeemFormOpen(false);
      setStatus(copy.redeemedCreditsUpdated);
    } catch (redeemError) {
      setError(
        redeemError instanceof Error
          ? redeemError.message
          : copy.codeCouldNotRedeemRetry,
      );
    } finally {
      setIsRedeeming(false);
    }
  }

  const creditsRemaining = credits?.remaining_credits ?? 0;
  const userInitial = (user?.email ?? "A").slice(0, 1).toUpperCase();
  const accountName =
    user?.email?.split("@")[0]?.trim() || (user ? copy.account : "");
  const hasDismissOverlay =
    isTopUpOpen || isNotificationsOpen || (isMenuOpen && Boolean(user));

  function closePanels() {
    setIsMenuOpen(false);
    setIsTopUpOpen(false);
    setIsNotificationsOpen(false);
  }

  function openAccountMenu() {
    setIsMenuOpen(true);
    setIsTopUpOpen(false);
    setIsNotificationsOpen(false);
    setStatus(null);
    setError(null);
  }

  function openTopUpPreview() {
    setIsTopUpOpen(true);
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
    setStatus(null);
    setError(null);
  }

  function openNotificationsPreview() {
    setIsNotificationsOpen(true);
    setIsMenuOpen(false);
    setIsTopUpOpen(false);
    setStatus(null);
    setError(null);
  }

  const authModal = isMenuOpen && !user ? (
    <section
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto bg-[#2f271e]/18 p-4 backdrop-blur-[8px] sm:p-6"
      onClick={closePanels}
    >
      <div
        className="relative max-h-[min(90vh,44rem)] w-[min(calc(100vw-2rem),27rem)] overflow-y-auto rounded-3xl border border-[#d8b76a]/45 bg-[#fffaf0]/96 p-5 text-left text-[#4f4235] shadow-[0_28px_78px_rgba(35,27,18,0.3),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-md sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,255,255,0.92),transparent_32%),radial-gradient(circle_at_92%_12%,rgba(216,183,106,0.18),transparent_30%),repeating-linear-gradient(90deg,rgba(91,74,54,0.035)_0_1px,transparent_1px_18px)]"
        />
        <div className="relative grid gap-4">
          <div className="grid justify-items-center border-b border-[#d8b76a]/30 pb-4 text-center">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#caa96a]/60 bg-[#f6e1ae]/80 font-serif text-lg text-[#5b3c16] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
              O
            </div>
            <p className="mt-3 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#9d7b3f]">
              {copy.enterRoom}
            </p>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-[#3f352b]">
              {copy.signIn}
            </h2>
            <p className="mt-2 max-w-[20rem] text-sm leading-6 text-[#766955]">
              {copy.chooseSignInMethod}
            </p>
          </div>

          {isLoadingUser ? (
            <p className="rounded-xl border border-[#d8b76a]/28 bg-[#fff7e8]/72 px-3 py-2 text-xs leading-5 text-[#766955]">
              {copy.checkingAccount}
            </p>
          ) : (
            <div className="grid gap-3">
              <button
                className="min-h-11 rounded-full border border-[#d8b76a]/40 bg-[#fffdf8] px-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#3f352b] shadow-[0_10px_24px_rgba(111,84,43,0.08),inset_0_1px_0_rgba(255,255,255,0.72)] transition hover:-translate-y-0.5 hover:border-[#9d7b3f]"
                onClick={() => {
                  setStatus(copy.socialSignInSoon);
                  setError(null);
                }}
                type="button"
              >
                {copy.continueWithApple}
              </button>
              <button
                className="min-h-11 rounded-full border border-[#d8b76a]/40 bg-[#fffdf8] px-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#3f352b] shadow-[0_10px_24px_rgba(111,84,43,0.08),inset_0_1px_0_rgba(255,255,255,0.72)] transition hover:-translate-y-0.5 hover:border-[#9d7b3f]"
                onClick={() => {
                  setStatus(copy.socialSignInSoon);
                  setError(null);
                }}
                type="button"
              >
                {copy.continueWithGoogle}
              </button>
              <div className="relative flex items-center py-1">
                <span className="h-px flex-1 bg-[#d8b76a]/28" />
                <span className="px-3 text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-[#9d7b3f]">
                  {copy.emailMagicLink}
                </span>
                <span className="h-px flex-1 bg-[#d8b76a]/28" />
              </div>
              <label className="grid gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#6f5f4b]">
                {copy.email}
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
                {isSendingEmail ? copy.sending : copy.sendSignInEmail}
              </button>
              <p className="rounded-xl border border-[#d8b76a]/26 bg-[#fff7e8]/68 px-3 py-2 text-xs leading-5 text-[#766955]">
                {copy.passwordlessNote}
              </p>
              <p className="text-center text-xs leading-5 text-[#8a765d]">
                {copy.registerPrompt}
              </p>
            </div>
          )}

          <div className="grid gap-2.5 border-t border-[#d8b76a]/30 pt-3">
            <div>
              <p className="text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[#9d7b3f]">
                {copy.language}
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
      </div>
    </section>
  ) : null;

  return (
    <>
      <div className="fixed right-4 top-3 z-[360] sm:right-6 sm:top-4">
      <div className="relative z-[290] flex min-w-0 items-center justify-end gap-1.5">
        {user ? (
          <>
            <span className="hidden min-h-9 items-center rounded-full border border-[#d8b76a]/42 bg-[#fffaf0]/82 px-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.11em] text-[#5b4a36] shadow-[0_7px_18px_rgba(111,84,43,0.08),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur sm:inline-flex">
              {isLoadingCredits ? copy.credits : copy.creditsCount(creditsRemaining)}
            </span>
            <button
              aria-expanded={isTopUpOpen}
              className="hidden min-h-9 items-center rounded-full border border-[#caa96a]/55 bg-[#f7e5b8]/82 px-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.11em] text-[#5b3c16] shadow-[0_7px_18px_rgba(157,123,63,0.09),inset_0_1px_0_rgba(255,255,255,0.68)] transition hover:-translate-y-0.5 hover:border-[#9d7b3f] sm:inline-flex"
              onClick={openTopUpPreview}
              type="button"
            >
              {copy.topUp}
            </button>
            <button
              aria-expanded={isNotificationsOpen}
              aria-label={copy.notifications}
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
              onClick={(event) => {
                event.stopPropagation();
                openAccountMenu();
              }}
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
            onClick={(event) => {
              event.stopPropagation();
              openAccountMenu();
            }}
            type="button"
          >
            {isLoadingUser ? copy.readingAccount : copy.signIn}
          </button>
        )}
      </div>
      </div>

      {hasDismissOverlay ? (
        <button
          aria-label={copy.closeAccountPanel}
          className="fixed inset-0 z-[270] cursor-default bg-[#1d1710]/30 backdrop-blur-[2px]"
          onClick={closePanels}
          type="button"
        />
      ) : null}

      {isTopUpOpen ? (
        <section className="fixed right-4 top-[4.75rem] z-[300] w-[min(calc(100vw-2rem),19rem)] overflow-hidden rounded-2xl border border-[#d8b76a]/45 bg-[#fffaf0]/96 p-3.5 text-left text-[#4f4235] shadow-[0_18px_48px_rgba(102,75,33,0.17),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-md sm:right-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,255,255,0.92),transparent_32%),radial-gradient(circle_at_92%_12%,rgba(216,183,106,0.18),transparent_30%)]"
          />
          <div className="relative">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#9d7b3f]">
              {copy.topUp}
            </p>
            <h2 className="mt-2 font-serif text-xl text-[#3f352b]">
              {copy.topUpTitle}
            </h2>
            <p className="mt-2 text-xs leading-5 text-[#766955]">
              {copy.topUpBody}
            </p>
          </div>
        </section>
      ) : null}

      {isNotificationsOpen ? (
        <section className="fixed right-4 top-[4.75rem] z-[300] w-[min(calc(100vw-2rem),19rem)] overflow-hidden rounded-2xl border border-[#d8b76a]/45 bg-[#fffaf0]/96 p-3.5 text-left text-[#4f4235] shadow-[0_18px_48px_rgba(102,75,33,0.17),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-md sm:right-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,255,255,0.92),transparent_32%),radial-gradient(circle_at_92%_12%,rgba(216,183,106,0.18),transparent_30%)]"
          />
          <div className="relative">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#9d7b3f]">
              {copy.notifications}
            </p>
            <h2 className="mt-2 font-serif text-xl text-[#3f352b]">
              {copy.notificationsTitle}
            </h2>
            <p className="mt-2 text-xs leading-5 text-[#766955]">
              {copy.notificationsBody}
            </p>
          </div>
        </section>
      ) : null}

      {isMounted && authModal ? createPortal(authModal, document.body) : null}

      {isMenuOpen && user ? (
        <section className="fixed right-4 top-[4.75rem] z-[300] max-h-[80vh] w-[min(calc(100vw-2rem),22.5rem)] overflow-y-auto overflow-x-hidden rounded-2xl border border-[#d8b76a]/45 bg-[#fffaf0]/96 p-3 text-left text-[#4f4235] shadow-[0_20px_56px_rgba(102,75,33,0.19),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-md sm:right-6 sm:p-3.5">
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
                  {user.email ?? copy.readingAccount}
                </p>
              </div>
            </div>

            <p className="rounded-full border border-[#d8b76a]/28 bg-[#fff7e8]/68 px-3 py-1.5 text-[0.72rem] leading-5 text-[#6f5f4b]">
              <span className="font-semibold text-[#6f4f20]">
                {isLoadingCredits ? copy.creditsLoading : copy.creditsLower(creditsRemaining)}
              </span>{" "}
              · {copy.creditUseNote}
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
                  {copy.readingRoom}
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
                  {copy.journal}
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
                  {copy.redeem}
                </span>
              </button>
              <button
                className="grid min-h-[4.5rem] place-items-center rounded-xl border border-transparent bg-transparent px-2 py-2 text-center transition hover:border-[#d8b76a]/26 hover:bg-[#fff7e8]/78"
                onClick={() => {
                  setStatus(copy.membershipPreviewSoon);
                  setError(null);
                }}
                type="button"
              >
                <span className="flex size-7 items-center justify-center rounded-full border border-[#d8b76a]/35 bg-[#fffaf0] text-[0.62rem] font-semibold text-[#9d7b3f]">
                  M
                </span>
                <span className="mt-1 block text-xs font-semibold text-[#3f352b]">
                  {copy.membership}
                </span>
                <span className="mt-0.5 block text-[0.6rem] text-[#8a765d]">
                  {copy.comingSoon}
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
                  {copy.language}
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
                  {isSigningOut ? copy.signingOut : copy.signOut}
                </button>
              </div>
            </div>

            {isRedeemFormOpen ? (
              <div className="grid gap-2.5 rounded-xl border border-[#d8b76a]/30 bg-[#fffaf0]/72 p-3">
                    <label className="grid gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#6f5f4b]">
                      {copy.deckCode}
                      <input
                        autoComplete="off"
                        className="min-h-10 rounded-full border border-[#d8b76a]/45 bg-[#fffdf8] px-3.5 text-sm normal-case tracking-normal text-[#3f352b] outline-none transition placeholder:text-[#b09d7f] focus:border-[#9d7b3f] focus:ring-2 focus:ring-[#d8b76a]/20"
                        onChange={(event) =>
                          setActivationCode(event.target.value)
                        }
                        placeholder={copy.deckCodePlaceholder}
                        type="text"
                        value={activationCode}
                      />
                    </label>
                    <p className="text-xs leading-5 text-[#766955]">
                      {copy.redeemBody}
                    </p>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <button
                        className="min-h-10 rounded-full border border-[#caa96a]/60 bg-[#31483f] px-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-[#fff7e8] shadow-[0_10px_24px_rgba(49,72,63,0.16)] transition hover:-translate-y-0.5 hover:bg-[#263b34] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isRedeeming || !activationCode.trim()}
                        onClick={handleRedeemCode}
                        type="button"
                      >
                        {isRedeeming ? copy.redeeming : copy.redeem}
                      </button>
                      <button
                        className="min-h-10 rounded-full border border-[#d8b76a]/42 bg-[#fffaf0] px-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-[#6f5f4b] transition hover:border-[#9d7b3f] hover:text-[#3f352b] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isRedeeming}
                        onClick={handleCancelRedeem}
                        type="button"
                      >
                        {copy.cancel}
                      </button>
                    </div>
                  </div>
            ) : null}

            <div className="flex min-h-10 items-center justify-between gap-2.5 rounded-xl border border-[#d8b76a]/30 bg-[#fff7e8]/62 px-3 py-1.5 text-sm leading-6">
              <span className="text-xs text-[#5b4a36]">{copy.language}</span>
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
                  {copy.privacy}
                </Link>
                <Link
                  className="transition hover:text-[#9d7b3f]"
                  href={withLang("/terms", {}, lang)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {copy.terms}
                </Link>
                <Link
                  className="transition hover:text-[#9d7b3f]"
                  href={withLang("/disclaimer", {}, lang)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {copy.disclaimer}
                </Link>
                <Link
                  className="transition hover:text-[#9d7b3f]"
                  href={withLang("/contact", {}, lang)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {copy.contact}
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
    </>
  );
}
