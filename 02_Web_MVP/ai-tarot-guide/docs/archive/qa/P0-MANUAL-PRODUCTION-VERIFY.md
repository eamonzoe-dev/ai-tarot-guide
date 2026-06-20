# P0-MANUAL-PRODUCTION-VERIFY

- Status: Current
- Last updated: 2026-06-20
- Owner: AI Project OS
- Source priority: Historical QA / Manual Production Verification Report

Historical archive warning: this report records user-confirmed manual production verification on 2026-06-20. It is archived QA evidence and must not override current docs. For current truth, follow `00_START_HERE.md` source priority.

## 1. Summary

Manual verification result: PARTIAL / strong production-readiness progress.

PARTIAL is expected because core protected production infrastructure is now verified, while some launch-stage and deeper operational checks remain open.

Confirmed at a high level:

* Vercel production domain, deployment, environment variable names, and Site Lock access are verified.
* Supabase Auth URL configuration, email provider settings, branded Magic Link / OTP template, Resend custom SMTP, production Magic Link delivery, and session return flow are verified.
* Supabase core DB tables, RLS enablement, self-read policies, server-only table protection, and `consume_ai_reading_credit` RPC structure are verified by metadata-only checks.
* No secret values, SMTP passwords, API keys, auth tokens, Magic Link URLs, real activation codes, private user emails, user data, or database rows were recorded.

Remaining open at a high level:

* Existing-browser language localStorage versus URL-priority behavior.
* Supabase redirect URL strictness before public launch.
* Full internal RPC body behavior.
* DNS/Search Console/robots/sitemap/indexing launch verification.
* GitHub Secrets and Feishu automation status if needed.
* Activation code operational policy and batch status before sales/public launch.

## 2. Vercel Verification

### Domains

User-provided Vercel Domains evidence confirmed:

| Item | Status | Notes |
| --- | --- | --- |
| Project `ai-tarot-guide` | OK | Project name shown in Vercel. |
| `oraarcana.com` | OK | Valid Configuration; Production domain. |
| `www.oraarcana.com` | OK | Valid Configuration; 308 redirect to `oraarcana.com`. |
| `ai-tarot-guide.vercel.app` | OK / legacy-supporting | Valid Configuration; Production. |
| HTTPS/domain configuration | OK | Vercel Valid Configuration plus browser production access test. |

Assessment:

* Vercel domain configuration: OK.
* Apex production domain: OK.
* `www` redirect to apex domain: OK.
* Vercel default domain: OK / legacy-supporting.

### Deployments

User-provided Vercel Deployments evidence confirmed:

| Item | Status | Notes |
| --- | --- | --- |
| Latest production deployment | OK | Status Ready. |
| Branch | OK | `main`. |
| Label | OK | Production. |
| Commit | OK | `276ad4a`. |
| Visible production deployment | OK | `276ad4a Verify external service documentation`. |

Assessment:

* Latest production deployment is Ready: OK.
* Latest production deployment is from `main`: OK.
* Latest visible production commit: `276ad4a`: OK.

### Environment Variables

User-provided Vercel Environment Variables evidence confirmed these variable names exist. Values were hidden and were not recorded.

| Variable name | Status | Notes |
| --- | --- | --- |
| `SITE_LOCK_PASSWORD` | OK | Secret value not recorded. |
| `SITE_LOCK_USERNAME` | OK | Secret value not recorded. |
| `SITE_LOCK_ENABLED` | OK | Value not recorded. |
| `AI_READING_OPENAI_MODEL` | OK | Preferred project-specific AI provider variable. |
| `AI_READING_OPENAI_BASE_URL` | OK | Preferred project-specific AI provider variable. |
| `AI_READING_OPENAI_API_KEY` | OK | Secret value not recorded. |
| `OPENAI_MODEL` | OK / legacy or compatibility | Keep documented as fallback. |
| `SUPABASE_SECRET_KEY` | OK | Secret value not recorded. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | OK | Value not recorded. |
| `NEXT_PUBLIC_SUPABASE_URL` | OK | Value not recorded. |
| `OPENAI_BASE_URL` | OK / legacy or compatibility | Keep documented as fallback. |
| `OPENAI_API_KEY` | OK / legacy or compatibility | Secret value not recorded. |

Assessment:

* Required Vercel environment variable names exist: OK.
* Secret values were not viewed or recorded: OK.
* `AI_READING_OPENAI_*` remains the preferred project-specific AI provider variable set.
* `OPENAI_*` remains legacy / compatibility fallback.

### Production Access / Site Lock

User manually tested production route access.

Normal browser:

* `https://oraarcana.com/ai-guide?lang=en` opened.
* Browser Basic Auth / Site Lock prompt appeared: OK.
* After entering credentials, production page loaded: OK.
* Production page rendered successfully: OK.
* Site Lock / Basic Auth is currently enabled: OK.
* No credentials were recorded.

Incognito browser:

* `https://oraarcana.com/ai-guide?lang=en` opened in incognito mode: OK.
* Browser Basic Auth / Site Lock prompt appeared: OK.
* After authentication, production page rendered successfully: OK.
* Fresh visitor with `lang=en` displayed English UI: OK.
* HTTPS access worked with no visible browser certificate warning: OK.

Language observation:

* Normal browser previously showed Chinese UI on `/ai-guide?lang=en`.
* Incognito browser showed English UI on `/ai-guide?lang=en`.
* Fresh visitor English flow: OK.
* Existing-browser localStorage / URL-priority behavior: Verification needed.

Vercel assessment:

* Production deployment/domain/access/site-lock: OK.
* Production is currently protected / locked: OK.
* Fresh incognito English flow: OK.
* Existing browser language persistence behavior: Verification needed.

## 3. Supabase Auth URL Configuration

User-provided Supabase Auth URL Configuration evidence confirmed:

| Item | Status | Notes |
| --- | --- | --- |
| Project | OK | Project appears to be `ai-tarot-guide-prod`. |
| Site URL | OK | `https://oraarcana.com`. |
| Production callback | OK | `https://oraarcana.com/auth/callback`. |
| Production confirm | OK | `https://oraarcana.com/auth/confirm`. |
| Production wildcard | OK / broad | `https://oraarcana.com/**`. |
| Production `www` wildcard | OK / broad | `https://www.oraarcana.com/**`. |
| Local callback | OK | `http://localhost:3000/auth/callback`. |
| Local confirm | OK | `http://localhost:3000/auth/confirm`. |
| Local wildcard | OK | `http://localhost:3000/**`. |
| Legacy Vercel callback | OK / legacy | `https://ai-tarot-guide.vercel.app/auth/callback`. |
| Legacy Vercel confirm | OK / legacy | `https://ai-tarot-guide.vercel.app/auth/confirm`. |
| Legacy Vercel wildcard | OK / legacy | `https://ai-tarot-guide.vercel.app/**`. |

Assessment:

* Supabase production Site URL: OK.
* Production auth redirect routes: OK.
* Local development redirect routes: OK.
* Legacy Vercel redirect routes: OK / legacy.
* Redirect URL strictness: PARTIAL because wildcard redirects are broad.
* Wildcard redirects are acceptable for current closed-beta / protected-site stage.
* Before public launch, consider tightening production Redirect URLs to only required routes.

## 4. Supabase Sign In / Providers

User-provided Supabase Sign In / Providers evidence confirmed:

| Item | Status | Notes |
| --- | --- | --- |
| Allow new users to sign up | OK / enabled | Matches V1 testing needs. |
| Allow manual linking | N/A / disabled | Not active for V1. |
| Allow anonymous sign-ins | N/A / disabled | Not active for V1. |
| Confirm email | OK / enabled | Matches email-first auth. |
| Email provider | OK / enabled | Current production auth method. |
| Phone provider | N/A / disabled | Not active for V1. |
| SAML 2.0 | N/A / disabled | Not active for V1. |
| Web3 Wallet | N/A / disabled | Not active for V1. |
| Apple | N/A / disabled | UI preview only, not production auth. |
| Azure and other visible third-party providers | N/A / disabled | Not active for V1. |

Assessment:

* Email-based auth is enabled and matches V1 strategy.
* Confirm email is enabled.
* Third-party production auth providers are disabled, consistent with current V1 state where Google / Apple login are not active production auth methods.

## 5. Supabase Email Templates

User-provided Supabase Emails / Templates evidence confirmed:

Template categories exist:

* Confirm sign up: OK.
* Invite user: OK.
* Magic link or OTP: OK.
* Change email address: OK.
* Reset password: OK.
* Reauthentication: OK.

Security notification templates:

* Password changed: Disabled / N/A.
* Email address changed: Disabled / N/A.
* Phone number changed: Disabled / N/A.
* Sign-in method linked: Disabled / N/A.
* Sign-in method removed: Disabled / N/A.
* MFA method added/removed: Disabled / N/A.

Magic Link / OTP template:

* Magic Link / OTP template exists: OK.
* Subject is branded: OK.
* Subject: `Your Ora Arcana sign-in link`.
* Body mentions Ora Arcana: OK.
* Body includes sign-in link: OK.
* Template uses Supabase confirmation URL variable: OK.
* Real Magic Link / token exposed: No.

Assessment:

* Supabase Magic Link / OTP email template is configured with Ora Arcana branding.
* Template is simple but functional for current closed-beta / production-protected stage.
* No secrets, tokens, private user data, or real login links were recorded.

## 6. Supabase Custom SMTP / Resend

User-provided Supabase Emails / SMTP Settings evidence confirmed:

| Item | Status | Notes |
| --- | --- | --- |
| Enable custom SMTP | OK / enabled | Production auth email uses custom SMTP. |
| Sender email address | OK | `no-reply@oraarcana.com`. |
| Sender name | OK | `Ora Arcana`. |
| SMTP host | OK | `smtp.resend.com`. |
| SMTP provider | OK | Appears to be Resend. |
| Port number | OK | `465`. |
| Minimum interval per user | OK | `60` seconds. |
| Username | OK | `resend`. |
| Password | Hidden | Not revealed, not recorded. |

Assessment:

* Supabase Auth emails are configured to send through Resend custom SMTP.
* Sender identity matches expected Ora Arcana production sender.
* No SMTP password, API key, token, or secret value was recorded.

## 7. Supabase Audit Logs

User-provided Supabase Authentication / Audit Logs evidence confirmed:

* Audit Logs page found: OK.
* Write audit logs to database: Disabled / N/A.
* `audit_log_entries` database writing: Disabled / N/A.
* Recent auth/email delivery errors were not confirmed from this page.

Assessment:

* Audit log database writing is not enabled.
* This is acceptable for current closed-beta stage unless detailed auth event auditing is required.
* This page does not confirm whether recent Magic Link / OTP emails succeeded or failed.

## 8. Production Magic Link Test

User manually performed a real production Magic Link login test and confirmed:

* Magic Link test email received: OK.
* Sender correct: OK.
* Login link returns to `oraarcana.com`: OK.
* Session works after login: OK.

Assessment:

* Production Supabase Email Auth flow is verified: OK.
* Supabase custom SMTP / Resend delivery is working: OK.
* Ora Arcana sender identity is correct: OK.
* Production auth callback / confirm flow successfully returns user to production domain: OK.
* No login link, token, email body, API key, or secret value was recorded.

## 9. Supabase Database / RPC / RLS

User ran a safe metadata-only SQL check in Supabase SQL Editor. No table data, user data, activation codes, tokens, or secrets were exported.

Expected tables exist in `public` schema:

* `profiles`: OK.
* `user_credits`: OK.
* `credit_events`: OK.
* `activation_codes`: OK.
* `usage_events`: OK.
* `reading_logs`: OK.

RLS is enabled on all expected tables:

* `profiles`: OK.
* `user_credits`: OK.
* `credit_events`: OK.
* `activation_codes`: OK.
* `usage_events`: OK.
* `reading_logs`: OK.

Policies:

* `profiles`: OK, Users can read own profile.
* `user_credits`: OK, Users can read own credits.
* `credit_events`: OK, Users can read own credit events.
* `reading_logs`: OK, Users can read own reading logs.

Server-only / protected tables:

* `activation_codes`: OK, RLS enabled, no public policies, expected server-side only.
* `usage_events`: OK, RLS enabled, no public policies, expected server-side only.

RPC existence:

* `consume_ai_reading_credit`: OK.

Assessment:

* Supabase database core tables are present.
* RLS is enabled on all expected tables.
* User-readable tables have self-read policies.
* Activation codes and usage events appear protected from direct client access.
* Credit consumption RPC exists.
* No table data, user data, activation codes, tokens, or secrets were exported.

## 10. Supabase RPC Structure

User ran metadata-only SQL checks for `consume_ai_reading_credit`. The RPC was not executed.

Confirmed RPC metadata:

| Item | Status | Notes |
| --- | --- | --- |
| RPC exists | OK | `consume_ai_reading_credit`. |
| Schema | OK | `public`. |
| Function signature | OK | `consume_ai_reading_credit(uuid)`. |
| Input argument | OK | `p_user_id uuid`. |
| Return type | OK | `TABLE(remaining_credits integer, total_credits integer, credit_event_id uuid)`. |
| Security mode | OK | `SECURITY DEFINER`. |
| Volatility | OK | `VOLATILE`. |
| Returns set | OK | `true`. |
| Language | OK | `plpgsql`. |

Argument detail:

* Position 1: `p_user_id`, mode input, type `uuid`.
* Position 2: `remaining_credits`, mode table return, type `integer`.
* Position 3: `total_credits`, mode table return, type `integer`.
* Position 4: `credit_event_id`, mode table return, type `uuid`.

Partial function body observation:

* Function definition was partially inspected.
* Visible body includes an `insufficient_credits` exception branch.
* Full internal RPC behavior was not fully inspected.
* User chose not to continue deeper inspection.

Assessment:

* RPC structure is suitable for server-side AI reading credit consumption.
* RPC was not executed during verification.
* Input and return structure are verified.
* Full internal behavior remains optional/deeper verification for later.

## 11. Current Overall Manual Verification Result

Manual verification result: PARTIAL / strong production-readiness progress.

Reason:

Core production hosting, domain, auth, email, Resend SMTP, Magic Link, session, database table existence, RLS, policies, and credit RPC structure are verified. Some launch-adjacent items still remain for later verification.

Confirmed OK:

* Vercel production deployment Ready.
* Vercel production domain `oraarcana.com`.
* `www.oraarcana.com` 308 redirect to `oraarcana.com`.
* Vercel environment variable names exist.
* Site Lock / Basic Auth enabled.
* Production page loads after Site Lock.
* Fresh incognito `lang=en` English flow.
* Supabase production Site URL.
* Supabase production/local/legacy redirect URLs.
* Email provider enabled.
* Confirm email enabled.
* Ora Arcana Magic Link / OTP template.
* Custom SMTP enabled.
* Resend SMTP configured.
* Sender `Ora Arcana <no-reply@oraarcana.com>`.
* Real production Magic Link email received.
* Magic Link sender correct.
* Magic Link returns to `oraarcana.com`.
* Session works after login.
* Expected Supabase tables exist.
* RLS enabled on expected tables.
* User self-read policies exist.
* Server-only tables protected by RLS with no public policies.
* `consume_ai_reading_credit` RPC exists.
* RPC input/return structure verified.

Remaining unknown / later verification:

* Exact Vercel environment variable values are not recorded by design.
* Existing browser language localStorage vs URL priority behavior needs focused verification.
* Redirect URL strictness should be tightened before public launch.
* Full internal RPC body behavior was not fully inspected.
* DNS/Search Console/robots/sitemap/indexing state still needs launch-stage verification.
* GitHub Secrets state still needs manual verification if workflows require them.
* Feishu automation current write status still needs verification if expected.
* Activation code operational policy / batch status may need separate verification before sales/public launch.

## 12. Docs Updated By This Sync

* `docs/EXTERNAL_SERVICES.md`: Synced verified Vercel, Supabase Auth, Supabase Email/Resend, Magic Link, DB/RPC/RLS, and remaining manual items.
* `docs/ENVIRONMENT.md`: Confirmed Vercel-visible variable names while preserving `Value recorded: No`.
* `docs/PROJECT_STATUS.md`: Updated the external verification snapshot from repo-only PARTIAL to strong production-readiness PARTIAL.
* `docs/CORE_BEHAVIOR_SPEC.md`: Updated verification notes for production auth, Resend email delivery, Vercel deployment, DB/RPC/RLS, and remaining uncertainties.
* `docs/OPERATIONS_LOG.md`: Logged the manual production verification sync and secrets-safety posture.
* `docs/CHANGELOG.md`: Added a short entry for the sync.
* `docs/NEXT_TASK.md`: Set the next focused task to language URL-priority verification.
* `docs/archive/qa/P0-MANUAL-PRODUCTION-VERIFY.md`: Added this archived manual verification report.

## 13. Secrets Safety

* No actual secret values were recorded.
* No API keys were recorded.
* No SMTP passwords were recorded.
* No Magic Link URLs were recorded.
* No auth tokens were recorded.
* No real activation codes were recorded.
* No private user emails or user data were recorded.
* No table rows were exported or recorded.
