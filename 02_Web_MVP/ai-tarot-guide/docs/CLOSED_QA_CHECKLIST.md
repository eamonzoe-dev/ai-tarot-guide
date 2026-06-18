# Closed QA Checklist

Status: Pre-launch closed QA checklist
Product: Ora Arcana / AI Tarot Guide
Stage: Internal QA / closed beta prep

This checklist is for controlled testing before broader Launch QA or public indexing. Do not use this checklist as approval to open Google indexing.

## 1. QA Setup

### Required Environment

- [ ] Use the latest approved deployment from `main`.
- [ ] Confirm the baseline commit is `7b5f814` or later.
- [ ] Confirm `npm run lint` and `npm run build` have already passed for the tested build.
- [ ] Confirm the test environment has Supabase auth, credits, activation codes, and AI reading environment values configured.
- [ ] Confirm indexing remains closed with `noindex, nofollow`.

### URLs

Fill these in before testing:

- Production URL: `________________________________________`
- Preview URL: `________________________________________`
- Main product route: `/ai-guide`
- English home: `/ai-guide?lang=en`
- Chinese home: `/ai-guide?lang=zh`

### Test Accounts

- [ ] Tester has at least one email address that can receive Magic Link emails.
- [ ] Tester has one new logged-out account state, such as a private browser window.
- [ ] Tester has one logged-in account with 0 credits.
- [ ] Tester has one logged-in account with at least 2 credits.
- [ ] Tester knows how to sign out and start again.

### Test Email Requirements

- [ ] Inbox is accessible during testing.
- [ ] Spam/junk folder can be checked.
- [ ] Magic Link emails from Supabase/Ora Arcana are not blocked.
- [ ] The test email is not shared by multiple testers at the same time.

### Test Activation Code Requirements

Prepare these before QA:

- [ ] One valid unused activation code.
- [ ] One invalid activation code.
- [ ] One already claimed activation code.
- [ ] One expired activation code.
- [ ] Record the expected credit amount for the valid code: `__________`

### Browser and Device Requirements

Minimum:

- [ ] Desktop Chrome.
- [ ] Desktop Safari or Firefox.
- [ ] iPhone-width mobile Safari, real device preferred.
- [ ] Android-width Chrome if available.

Recommended viewport checks:

- [ ] Desktop width.
- [ ] Tablet width.
- [ ] iPhone-width layout.
- [ ] Narrow Android-width layout.

### Indexing Note

- [ ] Do not submit the site to Google Search Console.
- [ ] Do not create or request `robots.txt` or `sitemap.xml` during this QA pass.
- [ ] Treat `noindex, nofollow` as intentional protection.

## 2. Homepage QA

### English Homepage

Steps:

1. Open `/ai-guide?lang=en`.
2. Wait for the page to fully load.
3. Scroll from top to bottom.

Expected result:

- [ ] The page loads without a visible error.
- [ ] The page explains that Ora Arcana is a tarot reading companion.
- [ ] English copy is readable and does not mix unexpected Chinese text.
- [ ] No important text overlaps or is cut off.

### Chinese Homepage

Steps:

1. Open `/ai-guide?lang=zh`.
2. Wait for the page to fully load.
3. Scroll from top to bottom.

Expected result:

- [ ] The page loads without a visible error.
- [ ] Chinese copy is readable and consistent.
- [ ] No important text overlaps or is cut off.

### Navigation Anchors

Steps:

1. Click each homepage section navigation link.
2. Confirm the page scrolls to the matching section.
3. Use browser Back if anchors update the URL.

Expected result:

- [ ] Each anchor moves to the expected section.
- [ ] The header/navigation remains usable.
- [ ] No section is hidden behind fixed UI.

### Main CTAs

Steps:

1. Click Start Reading / Begin a Reading.
2. Return to `/ai-guide`.
3. Click Physical Deck.
4. Return to `/ai-guide`.
5. Click Redeem Deck Code.
6. Return to `/ai-guide`.
7. Click Reading Journal.

Expected result:

- [ ] Start Reading enters the online reading path.
- [ ] Physical Deck enters the physical deck path.
- [ ] Redeem Deck Code is visible and understandable as an account/deck-code action.
- [ ] Reading Journal opens the journal route or asks the user to sign in.

### Account Entry

Steps:

1. Click the account/sign-in control.
2. Observe the account modal.

Expected result:

- [ ] Logged-out users see sign-in options.
- [ ] Email Magic Link is available.
- [ ] Google and Apple clearly say they are coming soon.
- [ ] The modal can be closed by clicking outside it.

### Language Toggle

Steps:

1. Toggle from English to Chinese.
2. Toggle from Chinese to English.
3. Confirm the URL includes `lang=en` or `lang=zh`.

Expected result:

- [ ] Language changes without losing the user unexpectedly.
- [ ] URL language matches visible copy.

### Mobile Layout

Steps:

1. Open `/ai-guide?lang=en` on iPhone-width.
2. Open `/ai-guide?lang=zh` on iPhone-width.
3. Scroll the full homepage.

Expected result:

- [ ] No horizontal scrolling.
- [ ] CTAs remain tappable.
- [ ] Account entry does not cover core content permanently.
- [ ] Text is readable without zooming.

## 3. Core Online Reading Flow

### Online Prepare

Steps:

1. Open `/ai-guide/prepare?mode=online&spread=single&orientation=upright&lang=en`.
2. Move through each prepare step.

Expected result:

- [ ] Prepare loads in online mode.
- [ ] The flow remains single-card and upright-only.
- [ ] Final prepare step continues to `/ai-guide/ask`.

### Ask Page and Native GET Submit

Steps:

1. On `/ai-guide/ask`, enter a test question.
2. Submit using the main button.
3. Watch the browser URL.

Expected result:

- [ ] Empty question shows a clear error.
- [ ] Non-empty question submits to `/ai-guide/draw`.
- [ ] The URL includes expected params: `mode=online`, `spread=single`, `orientation=upright`, `question=...`, `lang=...`.
- [ ] The form behaves like a normal browser form submit, not a fragile click-only action.

### Draw Ritual Steps

Steps:

1. Complete the draw steps in order.
2. Observe Shuffle, Cut, and Draw states.

Expected result:

- [ ] Each step advances clearly.
- [ ] The question remains visible.
- [ ] The final step selects/draws a card on the client.
- [ ] The next action moves to `/ai-guide/reveal`.

### Reveal and Result

Steps:

1. Open the reveal page from the draw flow.
2. Continue to the result page.

Expected result:

- [ ] Reveal page confirms a card is drawn.
- [ ] Result page loads the selected card.
- [ ] Result page shows the user question.
- [ ] Result page remains single-card and upright-only.

### Refresh Behavior

Steps:

1. Refresh `/ai-guide/draw` during the online flow.
2. Refresh `/ai-guide/reveal`.
3. Refresh `/ai-guide/result`.

Expected result:

- [ ] The page recovers using URL params or localStorage.
- [ ] The user is not sent to a blank/broken state.
- [ ] Result refresh does not create duplicate AI credit charges.

### Back Behavior

Steps:

1. Use browser Back from result to reveal.
2. Use browser Back from reveal to draw.
3. Use in-app Back/Home controls.

Expected result:

- [ ] Back navigation remains understandable.
- [ ] The question/card state is not unexpectedly lost.
- [ ] Home returns to `/ai-guide` with the selected language.

### Direct Link Behavior

Steps:

1. Paste a complete result URL into a new tab.
2. Paste a draw URL with valid question params into a new tab.

Expected result:

- [ ] Complete URLs load the expected state.
- [ ] Result uses URL params first.
- [ ] localStorage is only a fallback when URL values are missing.

### Missing Question/Card Recovery

Steps:

1. Open `/ai-guide/draw?mode=online&spread=single&orientation=upright&lang=en` without a question.
2. Open `/ai-guide/result?mode=online&spread=single&orientation=upright&lang=en` without a card.
3. Open a result URL with an invalid card value.

Expected result:

- [ ] Missing question redirects or recovers to ask flow.
- [ ] Missing card redirects or recovers to draw/reveal flow.
- [ ] Invalid card shows a clear invalid-reading state.

## 4. Physical Deck Flow

### Physical Mode Entry

Steps:

1. Open `/ai-guide?lang=en`.
2. Click Physical Deck.
3. Complete prepare steps.
4. Enter a question on `/ai-guide/ask`.

Expected result:

- [ ] Physical flow starts in `mode=physical`.
- [ ] Prepare page appears before asking the question.
- [ ] Ask submits to `/ai-guide/draw` with physical mode params.

### Card Selection and Reveal Path

Steps:

1. Follow physical draw instructions.
2. Click the action after drawing a real card.
3. Choose the matching card from the list.

Expected result:

- [ ] Physical instructions are clear.
- [ ] Card selection list is usable.
- [ ] Selecting a card leads to `/ai-guide/result`.

### Physical Result Path

Expected URL params:

- [ ] `mode=physical`
- [ ] `spread=single`
- [ ] `orientation=upright`
- [ ] `question=...`
- [ ] `card=...`
- [ ] `lang=en` or `lang=zh`

Expected result:

- [ ] Result page shows the selected physical card.
- [ ] The question is preserved.
- [ ] The reading remains single-card and upright-only.

### Physical URL/localStorage Fallback

Steps:

1. Refresh physical reveal and result pages.
2. Open a complete physical result URL in a new tab.

Expected result:

- [ ] Complete URLs load correctly.
- [ ] Missing URL values can recover from localStorage when available.
- [ ] Result still prioritizes URL params first.

### Missing/Invalid Card Behavior

Steps:

1. Open physical result without a card.
2. Open physical result with an invalid card value.

Expected result:

- [ ] Missing card sends user back to card selection/reveal.
- [ ] Invalid card shows a clear error state.

## 5. Account and Email Sign-in QA

### Logged-out Account Modal

Steps:

1. Open `/ai-guide?lang=en` in a logged-out browser.
2. Click Sign in / Reading Account.

Expected result:

- [ ] Modal opens above the page.
- [ ] Email input is visible.
- [ ] Apple and Google buttons show coming-soon behavior.
- [ ] The modal can be closed by clicking the overlay.

Known gap:

- [ ] Escape close is not confirmed/implemented yet. Mark as Needs decision if Escape does not close the modal.

### Email Magic Link

Steps:

1. Enter a valid test email.
2. Click Send sign-in email.
3. Check inbox and spam/junk.
4. Click the Magic Link.

Expected result:

- [ ] A success message appears after sending.
- [ ] Email arrives within a reasonable time.
- [ ] Link redirects through `/auth/callback`.
- [ ] User returns to the intended page after sign-in.

### Logged-in State

Steps:

1. Return to `/ai-guide`.
2. Open the account control.

Expected result:

- [ ] Account shows logged-in state.
- [ ] Email/account name is visible or recognizable.
- [ ] Credits display appears.
- [ ] Journal and Redeem options are visible.

### Sign Out

Steps:

1. Open account menu.
2. Click Sign out.
3. Refresh the page.

Expected result:

- [ ] User is signed out.
- [ ] Account entry returns to logged-out state.
- [ ] Protected account features ask for sign-in again.

### Mobile Modal Behavior

Steps:

1. Open account modal on iPhone-width.
2. Try scrolling inside the modal.
3. Close the modal.

Expected result:

- [ ] Modal fits inside the viewport.
- [ ] Modal content can scroll if needed.
- [ ] Close behavior works.
- [ ] No permanent blocked screen remains after close.

## 6. Credits and AI Reading QA

### Credits Display Before Reading

Steps:

1. Sign in with an account that has credits.
2. Open account menu.
3. Record current credits: `__________`

Expected result:

- [ ] Credits are visible.
- [ ] Credit copy is understandable.
- [ ] User can tell that each AI reading uses 1 credit.

### AI Reading Generation

Steps:

1. Complete an online or physical reading while signed in.
2. Land on `/ai-guide/result`.
3. Wait for AI reading to generate.

Expected result:

- [ ] Loading state appears.
- [ ] Successful AI reading appears.
- [ ] Reading is relevant to the card and question.
- [ ] No medical, legal, financial, investment, or professional advice is presented as certain guidance.

### Successful AI Reading Consumes 1 Credit

Steps:

1. Record credits before reading.
2. Generate one successful AI reading.
3. Open account menu after result.

Expected result:

- [ ] Credits decrease by exactly 1 after successful AI reading.
- [ ] Credits refresh after the reading succeeds.

### Refresh Does Not Duplicate Charge

Steps:

1. After a successful AI reading, refresh `/ai-guide/result`.
2. Open account menu again.
3. Repeat once.

Expected result:

- [ ] Same reading remains available or reloads safely.
- [ ] Credits do not decrease again for the same result refresh.

### Retry Behavior

Steps:

1. If an AI reading error appears, click retry once.
2. Observe result and credits.

Expected result:

- [ ] Retry is clear and usable.
- [ ] Successful retry shows reading.
- [ ] Credits are not deducted more than intended.

### No-credit State

Steps:

1. Sign in with an account that has 0 credits.
2. Complete a reading to `/ai-guide/result`.

Expected result:

- [ ] AI reading does not generate as a paid/credited reading.
- [ ] User sees a clear no-credit message.
- [ ] User can understand that redeeming a deck code is the next step.

### AI Upstream Fallback Behavior

Steps:

1. Test only if the QA owner has provided a fallback test environment or instruction.
2. Trigger an AI upstream failure.
3. Observe result page, credits, and journal.

Expected result:

- [ ] Fallback reading may appear.
- [ ] Fallback should not charge a credit unless product owner explicitly changes the rule.
- [ ] Mark journal behavior as Needs decision until finalized.

Known unresolved decision:

- [ ] AI fallback save/journal behavior is not finalized. Record whether fallback readings appear in Reading Journal.

## 7. Redeem Deck Code QA

### Logged-out Redeem Behavior

Steps:

1. Open `/ai-guide` while logged out.
2. Find Redeem Deck Code.
3. Try to redeem or access redeem.

Expected result:

- [ ] User is asked to sign in before redeeming.
- [ ] Copy explains that deck codes connect to the Reading Account.

### Valid Code Success

Steps:

1. Sign in.
2. Open account menu.
3. Open Redeem.
4. Enter a valid unused activation code.
5. Submit.

Expected result:

- [ ] Success message appears.
- [ ] Credits increase by the expected amount.
- [ ] Redeem form clears or closes cleanly.

### Credits Refresh After Redeem

Steps:

1. Record credits before redeem.
2. Redeem valid code.
3. Reopen account menu.
4. Refresh the page and open account menu again.

Expected result:

- [ ] Credits update immediately after redeem.
- [ ] Credits remain correct after refresh.

### Invalid Code Error

Steps:

1. Enter invalid activation code.
2. Submit.

Expected result:

- [ ] User sees a clear error.
- [ ] Credits do not change.

### Already Claimed Code Error

Steps:

1. Enter already claimed activation code.
2. Submit.

Expected result:

- [ ] User sees a clear already-used/unavailable error.
- [ ] Credits do not change.

### Expired Code Error

Steps:

1. Enter expired activation code.
2. Submit.

Expected result:

- [ ] User sees a clear expired-code error.
- [ ] Credits do not change.

### Mobile Redeem Behavior

Steps:

1. Open account menu on iPhone-width.
2. Open Redeem.
3. Enter and cancel a code.

Expected result:

- [ ] Redeem panel fits the screen.
- [ ] Input is tappable.
- [ ] Submit and Cancel are easy to tap.
- [ ] No horizontal scrolling.

### Copy Clarity

- [ ] Tester understands what a Deck Code is.
- [ ] Tester understands credits are added to the Reading Account.
- [ ] Tester understands each AI reading uses 1 credit.

## 8. Reading Journal QA

### Logged-out State

Steps:

1. Sign out.
2. Open `/ai-guide/readings?lang=en`.

Expected result:

- [ ] Page asks user to sign in.
- [ ] Copy explains that readings are saved when signed in.
- [ ] Return to Reading Room link works.

### Empty State

Steps:

1. Sign in with an account that has no saved readings.
2. Open `/ai-guide/readings?lang=en`.

Expected result:

- [ ] Empty state appears.
- [ ] Empty state is calm and understandable.
- [ ] Begin a Reading link works.

### List State

Steps:

1. Sign in with an account that has saved readings.
2. Open `/ai-guide/readings?lang=en`.

Expected result:

- [ ] Latest readings appear.
- [ ] Each item shows date, card, mode, spread, orientation, question, and interpretation summary.
- [ ] Page remains readable on desktop and mobile.

### Saved Successful AI Reading Appears

Steps:

1. Generate a successful signed-in AI reading.
2. Open Reading Journal.

Expected result:

- [ ] Successful AI reading appears in the Journal.
- [ ] Card/question match the result page.
- [ ] Summary is readable.

### Latest-20 Behavior

Steps:

1. Use an account with more than 20 saved readings if available.
2. Open Reading Journal.

Expected result:

- [ ] The page shows the latest 20 saved readings.
- [ ] Older readings are not expected to appear in this MVP list.

### Mobile Layout

Steps:

1. Open Journal on iPhone-width.
2. Scroll through list items.

Expected result:

- [ ] No horizontal overflow.
- [ ] Cards are readable.
- [ ] Back/return link remains usable.

### Fallback Reading Behavior

Known unresolved decision:

- [ ] If fallback AI reading is shown on result page, record whether it appears in Journal.
- [ ] Mark this as Needs decision until product owner finalizes fallback save behavior.

## 9. Language and Copy QA

### EN/ZH Consistency

Steps:

1. Test homepage, prepare, ask, draw, reveal, result, account, redeem, and journal in English.
2. Repeat in Chinese.

Expected result:

- [ ] Core flow copy matches selected language.
- [ ] URL includes `lang=en` or `lang=zh`.
- [ ] Switching language keeps the user in an understandable state.

### Terminology

Check these terms:

- [ ] Reading Account
- [ ] Reading Credits
- [ ] Redeem Deck Code
- [ ] Reading Journal
- [ ] Email Magic Link

Expected result:

- [ ] Terms are used consistently.
- [ ] Chinese terms feel natural and consistent.
- [ ] Credit/deck-code meaning is understandable.

### Coming-soon Copy

Check these states:

- [ ] Google login.
- [ ] Apple login.
- [ ] Credit top-up.
- [ ] Membership preview.
- [ ] Follow-up AI input on result page.

Expected result:

- [ ] Coming-soon items do not feel broken.
- [ ] Tester understands what is available now.

### Error Copy

Check these states:

- [ ] Empty ask question.
- [ ] Invalid result/card.
- [ ] Sign-in error.
- [ ] No credits.
- [ ] Invalid redeem code.
- [ ] Journal load/auth state.

Expected result:

- [ ] Error copy is human-readable.
- [ ] Error copy gives a next step where possible.

### Legal/Trust Page Language Notes

- [ ] Privacy, Terms, Disclaimer, and Contact currently need owner review for final public wording.
- [ ] Record any mixed-language or unclear legal/trust text.

## 10. Legal and Trust QA

### Trust Pages

Open these pages:

- [ ] `/privacy`
- [ ] `/terms`
- [ ] `/disclaimer`
- [ ] `/contact`

Expected result:

- [ ] Each page loads.
- [ ] Each page has a clear title.
- [ ] Text is readable on desktop and mobile.
- [ ] Contact email is visible.

### AI / Entertainment Disclaimer Visibility

Steps:

1. Open a result page.
2. Scroll to the bottom.
3. Open `/disclaimer`.

Expected result:

- [ ] Result page includes an AI/entertainment disclaimer or clear reflective-use copy.
- [ ] Disclaimer page clearly says readings are symbolic/reflective and not professional advice.

### Homepage/Footer Links

Steps:

1. Scroll to homepage footer or trust section.
2. Click Privacy, Terms, Disclaimer, and Contact links if present.

Expected result:

- [ ] Links go to the correct pages.
- [ ] Back navigation returns to the homepage.

## 11. Launch Visibility QA

### Current Noindex/Nofollow State

Expected result:

- [ ] Current noindex/nofollow state remains intentional.
- [ ] Tester does not treat noindex as a bug.
- [ ] No public indexing work is started during closed QA.

### Do Not Open Indexing

- [ ] Do not submit URLs to Google.
- [ ] Do not request indexing in Search Console.
- [ ] Do not remove `noindex, nofollow`.
- [ ] Do not create `robots.txt`.
- [ ] Do not create `sitemap.xml`.

### Site Lock Behavior

If site lock is enabled:

- [ ] Opening the site asks for Basic Auth or equivalent protection.
- [ ] Correct credentials allow access.
- [ ] Incorrect credentials block access.
- [ ] Locked state still should not be indexable.

If site lock is disabled:

- [ ] Site is accessible to testers.
- [ ] Site remains `noindex, nofollow`.

### Production vs Preview Expectations

- [ ] Preview deployments must remain non-indexable.
- [ ] Production must remain non-indexable before public launch approval.
- [ ] Preview URLs should not be used as public canonical URLs.

Future public-launch tasks:

- [ ] Robots plan.
- [ ] Sitemap plan.
- [ ] Metadata/canonical review.
- [ ] Production indexing approval.

## 12. Mobile QA

### iPhone-width Layout

Check:

- [ ] `/ai-guide?lang=en`
- [ ] `/ai-guide/prepare?mode=online&spread=single&orientation=upright&lang=en`
- [ ] `/ai-guide/ask?mode=online&spread=single&orientation=upright&lang=en`
- [ ] `/ai-guide/draw`
- [ ] `/ai-guide/reveal`
- [ ] `/ai-guide/result`
- [ ] `/ai-guide/readings?lang=en`

Expected result:

- [ ] No horizontal overflow.
- [ ] Buttons are easy to tap.
- [ ] Text is readable.
- [ ] Fixed account UI does not block the main task.

### Android-width Layout

Repeat the iPhone-width checks on Android-width Chrome if available.

Expected result:

- [ ] No horizontal overflow.
- [ ] Touch targets are usable.
- [ ] Layout remains stable while scrolling.

### Specific Mobile Panels

Check:

- [ ] Account modal.
- [ ] Ask form textarea.
- [ ] Draw steps.
- [ ] Reveal/card selection.
- [ ] Result AI reading state.
- [ ] Journal list.
- [ ] Redeem panel.

Expected result:

- [ ] Panels fit the viewport.
- [ ] Inputs do not jump or become hidden after keyboard opens.
- [ ] No button or text overlaps another element.

## 13. Known Gaps To Track

- [ ] Account modal Escape close not confirmed/implemented.
- [ ] AI fallback save/journal behavior not finalized.
- [ ] Commercial flow not frozen.
- [ ] Journal detail page deferred unless public V1 requires it.
- [ ] Google/Apple login coming soon.
- [ ] Stripe/shop deferred.
- [ ] Indexing closed until launch gate passes.

## 14. QA Result Template

Use this table for each tester pass.

| Test area | Steps | Expected result | Actual result | Status | Notes | Screenshot link |
| --- | --- | --- | --- | --- | --- | --- |
| Homepage EN | Open `/ai-guide?lang=en` and scroll | Page loads, English copy is clear, CTAs visible |  | Pass / Fail / Needs decision |  |  |
| Homepage ZH | Open `/ai-guide?lang=zh` and scroll | Page loads, Chinese copy is clear, CTAs visible |  | Pass / Fail / Needs decision |  |  |
| Online reading | Complete prepare -> ask -> draw -> reveal -> result | Single-card upright result appears |  | Pass / Fail / Needs decision |  |  |
| Physical reading | Complete physical prepare -> ask -> draw instructions -> select card -> result | Selected card result appears |  | Pass / Fail / Needs decision |  |  |
| Account sign-in | Send Magic Link and return through callback | User becomes logged in |  | Pass / Fail / Needs decision |  |  |
| Credits | Generate successful AI reading | Credits decrease by exactly 1 |  | Pass / Fail / Needs decision |  |  |
| Result refresh | Refresh successful result page | No duplicate credit charge |  | Pass / Fail / Needs decision |  |  |
| Redeem valid code | Redeem unused deck code | Credits increase correctly |  | Pass / Fail / Needs decision |  |  |
| Redeem invalid code | Redeem invalid/claimed/expired code | Clear error, no credit change |  | Pass / Fail / Needs decision |  |  |
| Reading Journal | Open journal after successful reading | Saved successful reading appears |  | Pass / Fail / Needs decision |  |  |
| Mobile layout | Test iPhone-width core pages | No horizontal overflow, controls usable |  | Pass / Fail / Needs decision |  |  |
| Launch visibility | Confirm noindex/no public indexing | Indexing remains closed |  | Pass / Fail / Needs decision |  |  |

Overall QA decision:

- [ ] Ready for broader closed QA.
- [ ] Needs fixes before broader closed QA.
- [ ] Needs product decision before broader closed QA.

QA owner: `________________________`
Date: `________________________`
Deployment tested: `________________________`
