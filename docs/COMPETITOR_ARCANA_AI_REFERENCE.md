# Competitor Reference: arcana-ai

## 1. Purpose of this document

This document preserves the reference value of the open-source `arcana-ai` project for future Ora Arcana product planning. It is intended as a competitive and architectural inspiration note only: it identifies product patterns, roadmap ideas, and organizational concepts worth considering while keeping a clear boundary between reference learning and implementation.

The goal is to help Ora Arcana make better planning decisions without copying source code, UI components, written content, prompts, images, migrations, assets, or the full technical stack from the reference project.

## 2. Reference source

Reference project:

- GitHub: `vanloc1808/arcana-ai`

Based on the repository name and observed project framing, `arcana-ai` appears to be an AI tarot reading platform with reading flows, tarot content, user journaling, analytics, subscriptions, administrative tooling, notifications, and support for multiple decks.

## 3. What we can learn

The useful reference value is at the product and architecture level. Ora Arcana can study how a broader AI tarot platform groups user journeys, separates product modules, and stages monetization or retention features.

Product modules worth studying:

- Daily Card: a recurring lightweight ritual that can bring users back without requiring a full reading flow.
- Spread Selector: a guided entry point that helps users choose the right reading format for their situation.
- Custom Spreads: a flexible spread model that may support advanced users or future premium experiences.
- Card Library: evergreen tarot content that supports education, SEO, and deeper user confidence.
- Reading Journal: a saved history of readings that can turn one-off interactions into an ongoing personal practice.
- Journal Analytics: reflection and pattern-finding features that can make the journal feel more valuable over time.
- Subscription: a possible monetization path for advanced readings, saved history, analytics, or personalization.
- Admin Panel: operational tooling for reviewing usage, managing content, or supporting launch workflows.
- Notification: retention mechanics such as reminders, daily rituals, or follow-up prompts.
- Multi-deck support: a long-term expansion path for personalization, collectible deck experiences, or artist collaborations.

Features relevant to Ora Arcana:

- A daily card ritual aligns well with a lightweight `Card of the Day` feature.
- A spread selection model can inform how Ora Arcana organizes `Three Card`, `Relationship`, `Career`, and future spreads.
- A card meaning library can support trust, education, and non-reading browsing sessions.
- Journal detail and analytics can deepen retention by turning readings into a longitudinal reflection practice.
- Subscription and premium membership ideas are worth tracking for later monetization design.
- Admin Lite could help manage content, QA, and launch operations without overbuilding a full back-office system.
- Notifications can be deferred, but the product should leave room for email reminders or daily prompts.
- Multi-deck support is not urgent, but the roadmap can avoid decisions that make it unnecessarily hard later.

Features not suitable for Ora Arcana right now:

- A fully custom spread builder is likely too broad for the current MVP and early roadmap.
- A full admin panel may be premature before there is enough operational volume.
- Subscription and payments should follow clear premium value, not precede it.
- Notifications should wait until the core reading and journal loops are strong enough to justify reminders.
- Multi-deck support can add content, asset, and interpretation complexity before the core deck experience is validated.
- Broad analytics should come after basic journal detail and saved reading behavior are stable.

Engineering organization ideas worth borrowing:

- Treat reading flows, card content, journaling, monetization, notifications, and admin tooling as separate product modules.
- Keep future premium, analytics, and notification features loosely coupled from the first reading experience.
- Plan domain concepts around stable nouns such as cards, spreads, readings, journal entries, users, subscriptions, and decks.
- Use phased delivery so that MVP reading flows are not blocked by later platform features.
- Keep admin capabilities focused on operational needs rather than building a parallel product too early.

Monetization ideas worth tracking:

- Premium Membership for expanded reading types, richer saved history, or enhanced insights.
- Stripe Payment as the likely payment implementation path when premium value is ready.
- Subscription packaging around advanced spreads, analytics, personalization, or future deck options.
- Admin Lite as an internal support layer for managing premium and content operations.
- Multi-deck support as a possible future paid personalization or collaboration surface.

## 4. What Ora Arcana should not copy

Ora Arcana should not copy from `arcana-ai`:

- source code
- UI components
- copywriting
- prompts
- database migrations
- images/assets
- full technical stack

Legal and licensing boundary:

This document is a reference-only planning artifact. It does not authorize copying implementation details, protected expression, prompts, content, assets, schema migrations, or UI from `arcana-ai`. Any Ora Arcana implementation inspired by these observations must be independently designed, independently written, and reviewed against Ora Arcana's own product goals, architecture, design system, and licensing requirements.

## 5. Feature mapping table

| Reference Feature | Ora Arcana Equivalent | Priority | Notes |
| --- | --- | --- | --- |
| Daily Cards | Card of the Day | P1 | Strong retention ritual; fits after the core reading path is stable. |
| Custom Spreads | Three Card / Relationship / Career | P0-P3 | Start with fixed spreads before considering user-defined spread creation. |
| Card Meanings | Card Library | P1 | Supports education, browsing, and trust in interpretations. |
| Journal Analytics | Reading Insights | P2 | Build after journal detail and saved reading data exist. |
| Subscription | Premium Membership | P3 | Track as monetization, but gate behind clear premium value. |
| Admin Panel | Admin Lite | P3 | Keep narrow: content, QA, waitlist, and operational support. |
| Notifications | Email Reminders | P4 | Useful for retention after core engagement is proven. |
| Multi-deck | Future Deck Support | P4 | Defer until the first deck experience is mature. |

## 6. Updated Ora Arcana roadmap influence

P0:

- Choose Reading
- Three Card Spread

P1:

- Card of the Day
- Card Library
- Journal Detail
- Deck Page
- Waitlist

P2:

- Journal Analytics
- Reading Insights

P3:

- Premium Membership
- Stripe Payment
- Admin Lite
- Relationship Spread
- Career Spread

P4:

- Celtic Cross
- Monthly Reflection
- Email Reminders
- Multi-deck support

## 7. Recommended follow-up tasks

- P1-CARD-DAILY
- P1-CARD-LIBRARY
- P2-JOURNAL-ANALYTICS
- P3-ADMIN-LITE
- P3-PREMIUM-MEMBERSHIP
