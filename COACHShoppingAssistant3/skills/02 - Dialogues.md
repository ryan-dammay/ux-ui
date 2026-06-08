# COACH Shopping Assistant — Dialogues

> Reference skill: every conversation flow, its happy path, branches, and edge cases,
> plus the exact points where the assistant hands over to Customer Care. Read the
> Context skill first for voice and scope.
>
> A companion spreadsheet/text export of every line lives in `exports/`. This file is
> the *design rationale* behind those scripts.

---

## Conversation model

- **Speakers:** Customer · Assistant (the bot) · Layla (Client Care, after handover) · System.
- **Input is hybrid:** every prompt offers **quick-reply chips** *and* accepts **free text**.
  Free text is routed by keyword to the right flow (see "Free-text routing" below).
- **Chips appear under the latest question** (not pinned to the input bar). Colour choices
  render as full-width **highlighter bars** with a label beneath.
- **Pacing:** the assistant "types" (animated dots) before each message, so multi-part
  answers arrive in a natural rhythm rather than all at once.
- **Every branch resolves** to one of: a result, a next action, or a human handover.

---

## Flow A — Product Discovery

**Goal:** narrow the catalogue to a short, swipeable set of matches.

Happy path: `Colour → Style → Budget → Carousel of matches → Add to bag / View details`

1. **Colour** — Black · Brown · Rust · Burgundy (highlighter swatches). Brown also matches Chocolate.
2. **Style** — Shoulder · Crossbody · Top handle · *Surprise me*.
3. **Budget** — Under AED 2,000 · AED 2,000–2,500 · No limit.
4. **Results** — horizontal carousel; Sale & Bestsellers float to the front. Each card →
   **Add to bag** (inline confirmation) or **Details**.
5. After results: *Refine my search* · *Show gifts instead* · *Talk to a stylist*.

### Edge cases
- **No exact match:** never dead-end. Fall back to colour-only matches with copy like
  *"I don't have an exact match, but these are close and just as beautiful."*
- **"Surprise me" / no style:** skip the style filter entirely.
- **Refine:** offers Different colour / Lower budget / Start over — no need to restart.
- **Free-text entry** ("a black crossbody under 2000"): pre-fills colour + style and jumps
  straight toward results, skipping questions already answered.

---

## Flow B — Gifting

**Goal:** feel like a stylist curating, not a form. **No visible wizard steps.**

Happy path: `Recipient → Occasion → Budget → 3 curated picks → Gift wrap & note`

1. **Recipient** — My partner · A friend · My mum · Treat myself (maps to a curated set).
2. **Occasion** — Birthday · Anniversary · Just because.
3. **Budget** — Under AED 2,000 · AED 2,000–2,500 · Show me a range.
4. **Picks** — exactly **three**, framed personally: *"three I'd wrap up myself."*
5. **Gift wrap & note** — confirms complimentary wrap + handwritten card, written at checkout.

### Edge cases
- **Budget filters out all picks:** fall back to the "any" curated set rather than showing nothing.
- **"See more options":** loops back to recipient without losing tone.
- Conversation stays natural — occasion is echoed back in the results line for warmth.

---

## Flow C — Payments & BNPL

Entry menu: *Struggling to make a payment* · *Voucher/promo not working* ·
*How Tabby & Tamara work* · *Payment methods*.

### C1 — BNPL explainers
Tabby (4 interest-free payments, 25% today) and Tamara (Pay in 4 **or** Pay in 30 days).
Each shows a 4-instalment breakdown computed from a sample basket. Always described as
**interest-free**.

### C2 — Payment failure (branching triage)
`Common reasons → which method? → method-specific advice → resolved ✓ or HANDOVER`

Branches by method:
- **Card** → try another card / Apple Pay / COD → still failing → **handover**.
- **Tabby** → suggest **Tamara** instead → still failing → **handover**.
- **Tamara** → suggest **Tabby** instead → still failing → **handover**.
- **Cash on Delivery** → asks about **OTP**:
  - *Needs OTP* → check email → not working → **handover**; not received → wait then retry →
    still nothing → **handover**.
  - *No OTP, just fails* → try another method → won't switch → **handover**.

### C3 — Voucher / promo code
Three illustrative routes keyed off the code entered:
- **COACH20 → expired** (states the validity window; points to future promos).
- **WELCOME15 → not applicable** (full-price items only; suggests removing sale items).
- **Any other code → valid, retry** (whitespace, apply at payment step, refresh) →
  still failing → **handover**.

### Edge cases
- Every payment branch has a **"✓ it worked"** exit *and* a **"still not working"** path.
- "It worked" routes to a warm close + "anything else?".

---

## Flow D — FAQs

Menu: Delivery · Returns · Store locations · Something else.

- **Delivery:** Same-Day in Dubai (order before 2pm, over AED 500); standard 2–4 days UAE-wide,
  free over AED 500. Links to full policy.
- **Returns:** 14 days, unworn with tags, free; refund 7–10 working days.
- **Stores:** two Dubai boutiques as cards with "Get directions".
- **Something else → handover.**
- Each answer ends with a link out to the full policy page (chat gives the concise version).

---

## Handover to Customer Care

The single most important edge behaviour. **Handover points** (marked `→ HANDOVER` in the
exports) occur whenever self-serve is exhausted:

- Card / Tabby / Tamara still failing after a suggested swap.
- COD OTP unresolved.
- Voucher still failing after retry.
- FAQ "Something else".

### Two states (gated by Customer Care hours, 10am–10pm UAE)
1. **Within hours → live agent.** Agent card animates *Connecting… → Connected*, then
   **Layla** introduces herself and asks for an order number.
2. **Outside hours → offline notice.** "Client Care is offline… we're online 10am–10pm…
   email us." Actions: **Close chat** · **Save transcript** (transcript emailed).

> In the prototype, the **"Care team online"** tweak toggles between these two states for demos.

---

## Free-text routing (intent matching)

Typed input is matched to a flow by keyword before falling back to the menu:
- gift / present / birthday / anniversary → **Gifting**
- tabby / tamara / pay / payment / refund / charged / declined → **Payments**
- deliver / ship / return / exchange / store / track → **FAQ**
- a colour, or bag / tabby / brooklyn / lana / crossbody / shoulder / find → **Discovery**
- anything else → a friendly menu re-prompt (never an error).

---

## Writing checklist (when adding or editing dialogue)
- [ ] Warm, unhurried, non-pushy (see Context voice table).
- [ ] AED currency; Tabby/Tamara spelled correctly; British spelling.
- [ ] Every branch ends in resolution, next action, or handover — no dead ends.
- [ ] Both a success exit and a "still stuck" path on any troubleshooting step.
- [ ] Handover respects Customer Care hours.
- [ ] Update the `exports/` script + spreadsheet if flows change.
