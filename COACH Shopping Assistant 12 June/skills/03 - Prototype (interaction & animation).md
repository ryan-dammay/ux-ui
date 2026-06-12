# COACH Shopping Assistant — Prototype (interaction & animation)

> Reference skill: how the prototype is built, how it behaves, and how to run, tweak,
> and extend it. Read Context for the design system and Dialogues for the conversation
> content.

---

## Files & architecture

The prototype is a React app (UMD React 18 + Babel standalone, no build step). One source
of truth, three entry HTML files.

```
Coach Assistant.html            Both views, with a Mobile/Desktop toggle
Coach Assistant - Mobile.html   Locked to mobile (sets window.COACH_FORCE_DEVICE='mobile')
Coach Assistant - Desktop.html  Locked to desktop ('desktop')
Coach Assistant (offline).html  Self-contained single-file build (for sharing, ~1.9MB)

app/
  data.jsx            Catalogue, discovery/gift logic, FAQ + payment copy  → window.COACH_DATA
  icons.jsx           Inline line-icon set                                 → window.COACH_ICONS
  ui.jsx              Theme tokens + presentational cards (product, BNPL…) → window.COACH_UI / THEMES
  site.jsx            Mock storefront backdrop + launcher + (removed) teaser → window.COACH_SITE
  assistant.jsx       Conversation engine + all four flows                 → window.Assistant
  assistant-view.jsx  Chat shell: header, thread, chips, input, onboarding → window.AssistantView
  main.jsx            Device frames, scaling, controls, Tweaks, mount      → App
  tweaks-panel.jsx    Tweaks host wiring + controls (starter component)
```

**Cross-file sharing:** each Babel script attaches its exports to `window` (e.g.
`window.COACH_DATA`); later scripts read them. Script load order in the HTML matters —
`tweaks-panel → ui → data → icons → site → assistant-view → assistant → main`.

**Image paths** route through `window.assetURL()` so the same code works both as loose
files (passthrough) and in the bundled offline build (blob URLs).

---

## Layout & scaling

- The storefront renders at a fixed canvas (mobile 412×862 in a phone bezel; desktop
  1240×772 in browser chrome) and is scaled to fit the viewport with **`zoom`** (not
  `transform: scale`) so text stays crisp.
- The assistant overlays the storefront: a **bottom sheet** on mobile, a **docked panel**
  (394×636, bottom-right) on desktop.
- `window.COACH_FORCE_DEVICE` locks a view and hides the toggle in the two dedicated files.

---

## Interaction model

### Entry
- A **floating launcher bubble** (a **shopping-cart mark with a spark**, bottom-right) opens
  the assistant — chosen so it reads as a *shopping* assistant, not a chatbot. The same icon
  is the in-thread bot avatar. *(An earlier proactive teaser tooltip was removed — open is
  tap-only.)*

### Onboarding (every open)
- **Every time the assistant opens**, a swipeable intro shows three value-prop cards
  (Find your next bag · Find the perfect gift · Here to help). Swipe or Next; Skip / Get started.
- It is **not** persisted — shown on each open by design (`phase` initialises to `'onboard'`
  in `assistant.jsx`). Tapping Skip / Get started drops into the chat.

### The thread
- **Welcome state:** greeting bubble + quick-start action cards. **Find your next bag** is a
  full-width hero on the top row; the rest pair into two rows (Find the perfect gift /
  Payments & BNPL, then Delivery & returns / **Speak to Customer Care**, which is always
  last). Cards use a 1.5px stroke and 4px corner radius.
- **Quick replies** render inline beneath the latest question. Colours are full-width
  highlighter bars (tall enough to tap) with the label beneath.
- **Free-text input** is always available (mic + send affordances); routed by intent —
  upset / human-seeking messages go straight to Customer Care (see Dialogues).
- **≡ menu** (header) is a persistent shortcut to any flow + "Speak to Customer Care" + "Start over".

### Product & commerce
- Results show in a **horizontal swipe carousel** of equal-height cards (image, serif name,
  price, colour swatches, Add to bag, Details).
- **Add to bag** posts an **inline confirmation card** in the thread (View bag) and bumps the
  storefront cart badge. *(Checkout button was intentionally removed from the confirmation.)*
- **Details** posts an expanded product card; "Open page ↗" represents the jump to the PDP.

### Payments & support
- **Payments is informational only** — How Tabby works / How Tamara works / Payment methods,
  each with a **Speak to Customer Care** option. No troubleshooting triage, no voucher flow.
- **Customer Care** is a dedicated handover: the **“Speak to Customer Care”** action (welcome
  card / menu / Payments) or an upset free-text message sends the connect line, then an
  **agent card** (Connecting → Connected) and Layla’s greeting — or, outside Customer Care
  hours, an **offline card** with Close chat / Save transcript.

---

## Animations

Defined as CSS keyframes in each entry HTML `<style>`. All are **transform/opacity-safe**:
the visible end-state is the base style so paused/exported frames never show a hidden state,
and they respect `@media (prefers-reduced-motion: reduce)`.

| Name | Trigger | Motion |
|------|---------|--------|
| `caIn` | each new message | rise + settle (transform only) |
| typing dots | before a bot message | three blinking dots |
| `caUp` | open on mobile | sheet slides up |
| `caDock` | open on desktop | panel rises + fades in |
| `caAdded` | add to bag | confirmation card pops |
| `caCheck` | add to bag | check badge springs in |
| `caBump` | cart count change | storefront badge bumps (keyed on count) |
| `ca-hl` hover | colour options | highlighter bar grows / darkens |
| launcher pulse | idle bubble | soft expanding ring |
| onboarding | intro | horizontal track slide between cards |

**Timing feel:** entrances are quick (.34–.44s) with a gentle ease-out;
the "type then send" delay before each bot line is the main pacing lever (longer for
longer messages, shorter for cards).

---

## Tweaks panel

Open via the Tweaks toolbar control. Controls:
- **Device** — Mobile / Desktop *(hidden in the locked single-view files)*.
- **Care team online (10am–10pm)** — toggles live-agent vs. offline handover for demos.

To add a tweak: add a default in `DEFAULTS` (the `EDITMODE` block in `main.jsx`), read it
from `t`, and add a `<Tweak…>` control inside `<TweaksPanel>`.

---

## Running & verifying
- Open any entry HTML in the preview. Console should be clean.
- To demo a flow quickly, use the ≡ menu to jump straight to a flow, or type free text.
- The onboarding intro shows on **every open** (not persisted) — just reopen to see it.

---

## Extending — common tasks

| Task | Where |
|------|-------|
| Add/edit a product | `data.jsx` → `PRODUCTS` (+ image in `assets/img/`, referenced via `A('…')`) |
| Change discovery filtering | `data.jsx` → `discover()`, `COLOR/STYLE/BUDGET_OPTIONS` |
| Edit any dialogue line | `assistant.jsx` (flow functions: `startDiscovery`, `startGifting`, `startPayments`, `startFAQ`, `connectCare`, …) |
| Add a message type | render switch in `assistant-view.jsx` + a card in `ui.jsx` |
| Restyle tokens | `THEMES.classic` in `ui.jsx` |
| Add an animation | keyframes in the entry HTML `<style>` (keep base state visible + reduced-motion safe) |
| New images | put in `assets/img/`, reference through `assetURL`/`A`/`AS`; keep them optimised (JPEG, ≤600px) |

### Performance note
Product imagery is optimised JPEG (≤600px, `mix-blend: multiply` on coloured grounds).
Keep new assets the same way — it kept the whole project tiny and the offline build under 2 MB.
