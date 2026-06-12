\# Supabase Auth V1 Configuration



Project: AI Tarot Guide

Supabase project: `ai-tarot-guide-prod`

Target market: United States

Auth strategy: Email-first login for V1



\## 1. V1 Auth Scope



V1 uses Supabase Auth with email login.



Enabled:



\* Email sign up and login

\* Email confirmation

\* Email OTP / Magic Link capability



Disabled for V1:



\* Phone login

\* Anonymous sign-ins

\* Google login

\* Apple login

\* SAML

\* Web3 wallet

\* Custom SMTP



Planned later:



\* Google / Apple login

\* Custom SMTP for production email delivery

\* Stripe-based paid membership



\## 2. URL Configuration



Site URL:



```text

https://ai-tarot-guide.vercel.app

```



Redirect URLs:



```text

http://localhost:3000/auth/callback

https://ai-tarot-guide.vercel.app/auth/callback

http://localhost:3000/ai-guide

https://ai-tarot-guide.vercel.app/ai-guide

```



Notes:



\* Site URL uses the root production domain, not `/ai-guide`.

\* `/auth/callback` is reserved for future Magic Link and email confirmation flows.

\* `/ai-guide` is kept as a temporary fallback redirect target during early testing.



\## 3. Sign In / Providers



User signups:



```text

Allow new users to sign up: enabled

Allow manual linking: disabled

Allow anonymous sign-ins: disabled

Confirm email: enabled

```



Auth providers:



```text

Email: enabled

Phone: disabled

SAML 2.0: disabled

Web3 Wallet: disabled

Apple: disabled

```



\## 4. Email Provider Settings



Email provider:



```text

Enable email provider: enabled

Secure email change: enabled

Secure password change: disabled

Require current password when updating: disabled

Prevent use of leaked passwords: disabled

Minimum password length: 6

Email OTP expiration: 3600 seconds

Email OTP length: 8 digits

```



V1 product decision:



```text

Prefer Email OTP code login over Magic Link for the first implementation.

```



Reason:



\* OTP is easier to test on mobile.

\* OTP avoids browser handoff issues from email apps.

\* Magic Link can remain supported later through `/auth/callback`.



\## 5. Email Templates



Template checked:



```text

Magic link or OTP

```



Current status:



```text

Default Supabase template is used.

Custom SMTP is not configured.

```



Notes:



\* Supabase requires custom SMTP before editing email templates.

\* Do not configure SMTP during early development.

\* Before commercial launch, configure production email through a proper provider such as Resend, Postmark, or SendGrid.



\## 6. Rate Limits



Observed default limits:



```text

Rate limit for sending emails: 2 emails/hour

Rate limit for token refreshes: 150 requests / 5 minutes

Rate limit for token verifications: 30 requests / 5 minutes

Rate limit for sign-ups and sign-ins: 30 requests / 5 minutes

```



Testing note:



```text

Do not repeatedly send login emails during development. The default email limit is very low.

```



\## 7. Current Security Position



V1 Auth rules:



\* Login is required before AI reading quota enforcement.

\* Phone login is disabled.

\* Anonymous login is disabled.

\* Third-party login is deferred.

\* Supabase service key must never be exposed to client-side code.

\* Supabase public URL and publishable key may be used by the browser client.

\* Secret key must only be used in server-side API routes.



\## 8. Related Database Tables



The current Supabase schema includes:



```text

profiles

activation\_codes

user\_quotas

usage\_events

```



RLS status:



```text

RLS enabled on all four tables.

profiles: users can read own profile.

user\_quotas: users can read own quota.

activation\_codes: no client policy in V1.

usage\_events: no client policy in V1.

```



\## 9. Next Planned Step



Next task:



```text

Create Supabase Auth client helper files for Next.js.

```



Planned files may include:



```text

src/lib/supabase/client.ts

src/lib/supabase/server.ts

src/app/auth/callback/route.ts

```



Do not modify `/api/ai-reading` until login and session handling are verified.



