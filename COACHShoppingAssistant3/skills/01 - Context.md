# COACH Shopping Assistant — Context

> Reference skill: what this product is, who it serves, and the rules that govern its
> voice, scope, and visual language. Read this first; the dialogue and prototype skills
> build on it.

---

## 1. What it is

A **conversational shopping assistant** that lives in a **floating chat bubble** on the
COACH UAE storefront (coach.ae). It is not a separate app — there is no native app — so
it must work on **mobile web first** and **desktop web**.

It is an **original** assistant designed to live inside Coach's visual language. It is
**not** a clone of any proprietary Coach UI or a third-party assistant.

### Primary jobs (in priority order)
1. **Product Discovery** — "help me find a bag in my favourite colour / style / budget"
2. **Gifting** — "find the perfect birthday gift for my friend"
3. **Payment issues** — BNPL questions (Tabby / Tamara), payment methods, failed payments
4. **FAQs** — delivery, returns, store locations

### How far it goes
From the chat, a user can **add an item to bag** (inline confirmation in the thread) or
**jump to the full product details page**. It does **not** complete checkout in-chat.

---

## 2. Audience & market

- **Region:** United Arab Emirates. Currency is always **AED**.
- **BNPL partners:** **Tabby** and **Tamara** (interest-free instalments) — region-specific,
  must always be spelled correctly and described as interest-free.
- **Stores:** two Dubai boutiques — *The Dubai Mall* (Ground Floor, Fashion Avenue) and
  *Mall of the Emirates* (Level 1, near Centre Court). Open daily 10am–12am.
- **Customer Care hours:** 10am–10pm UAE time, every day. Outside these hours the assistant
  shows an offline / email-us state instead of connecting a live agent.

---

## 3. Personality & voice

**Warm personal stylist** — friendly, conversational, unhurried, knowledgeable. Think of a
boutique associate who knows the collection intimately and is genuinely glad to help.

| Do | Don't |
|----|-------|
| "Happy to help you find something special." | Be pushy or salesy |
| "How lovely — I'd be glad to help." | Use hype or exclamation overload |
| "A thoughtful choice for a birthday." | Rush the customer to checkout |
| Mirror the customer's language | Use jargon or system-speak |
| Offer a graceful exit / human handoff | Dead-end the conversation |

**Tone anchors:** elegant, calm, considered. One light touch of delight is fine
(an occasional 👋), never emoji-heavy. British-leaning spelling is used in copy
("colour", "personalise", "instalment").

---

## 4. Visual language (the Coach system)

Pulled from coach.ae and applied throughout the assistant.

| Token | Value | Use |
|-------|-------|-----|
| Ink | `#111111` / `#000000` | Text, header, primary buttons |
| Paper | `#ffffff` | Panel background |
| Bot bubble | `#f0eee8` | Assistant message ground |
| Gray product ground | `#efeeec` | Image backgrounds |
| Gold (heritage "C") | `#9a7b3f` | Accent only — confirmations, active states |
| Sale red | `#b3321f` | Sale prices only |
| Line / border | `#d4cdbf` | Dividers, card borders (kept visible, not too light) |

- **Type:** Helvetica Neue for UI + headlines (uppercase, tracked for labels); a
  transitional serif (Newsreader) for the COACH wordmark and product names.
- **Corners:** square. No rounded cards or pill buttons in the Classic direction.
- **Restraint:** strict black & white with one gold accent. No gradients, no decorative
  illustration. Real product photography on gray/tan grounds (rendered with `mix-blend: multiply`).

> The project originally explored three directions (Classic / Editorial / Boutique).
> **Classic is the locked, shipping direction.** The others are retired.

---

## 5. Scope guardrails

- **In scope:** discovery, gifting, BNPL & payment help, delivery/returns/store FAQs,
  add-to-bag, hand-off to Customer Care.
- **Out of scope (hand off or link out):** completing payment/checkout, order-specific
  account changes, anything requiring authentication or PII beyond an order number.
- **Always offer an exit:** every branch ends with either a resolution, a next action,
  or a path to a human. Never leave the customer at a dead end.
- **Handover trigger:** when self-serve advice is exhausted (e.g. "still not working"),
  escalate to **Layla · Client Care**. Within hours → live agent; outside hours →
  offline notice + save transcript. See the Dialogues skill for exact handover points.

---

## 6. Catalogue (prototype data)

Nine bags across three families — **Brooklyn**, **Tabby**, **Lana** — in Black, Brown,
Chocolate, Rust, Burgundy. Prices AED 1,950–2,400, with one Sale item (Brooklyn Rust,
AED 2,200 → 1,540). Tags: *Bestseller*, *New*, *Sale*. This is mock data sized for a
believable demo, not the live catalogue.
