# Mamas & Papas Design System

A complete design system for **Mamas & Papas** (M&P) — the UK's leading nursery and baby products brand, established 1981 in Huddersfield, West Yorkshire by David and Luisa Scacchetti.

## Sources

| Source | Status | Notes |
|---|---|---|
| `uploads/M&P Web Guidelines (Apr 24) [External].pdf` | ✅ Read | 16-page official web guidelines — primary source |
| `uploads/Aerotype - Zooja Light.ttf/.otf` | 📦 Available in `fonts/` | Retained but superseded — Poppins is now sole brand font |

---

## Company Overview

- **Full name:** Mamas & Papas
- **Founded:** 1981, Huddersfield, West Yorkshire, UK
- **Category:** Nursery, baby & maternity products
- **Products:** Pushchairs/prams, nursery furniture, baby clothing, feeding, bathing, car seats, toys, maternity wear, gifts
- **Retail:** 30+ UK stores + mamasandpapas.com; products sold in 49+ countries
- **Digital purpose:** "Inspire and support parents in becoming the best they can be: confident, capable, and loving life with their little ones."
- **Positioning:** The website is "deeper than a transaction" — practical guidance, community access, personalised content, and confident product discovery

---

## CONTENT FUNDAMENTALS

### Tone of Voice
- **Warm and expert** — speaks like a knowledgeable friend, not a salesperson
- **Caring, not condescending** — addresses parents as capable adults navigating a new world
- **Reassuring** — especially for first-time parents making big decisions
- **Optimistic** — celebrates the joy of parenthood

### Voice Rules
- **Person:** Second-person "you / your" — direct and personal. Brand speaks as "we"
- **Casing:** Sentence case for headlines and body copy; ALL CAPS used sparingly for labels/tags only
- **Emoji:** Not used in primary brand communications
- **Contractions:** Used freely — keeps tone natural
- **Body text width:** Limited to **50–75 characters** per line for readability (per guidelines)
- **Alignment:** Left-align as much as possible. Centre-align only for subtitles/summaries under 3 lines

### Copy Examples
- Digital purpose: *"Inspire and support parents in becoming the best they can be"*
- Headlines: *"Buying for baby"* / *"Today at mamas & papas"*
- CTAs: *"Add to Bag"* / *"Shop Now"* / *"Read more"* / *"Discover Libro"* / *"Available for Click & Collect"*
- USP messaging: *"Free delivery on orders over £50"*

---

## VISUAL FOUNDATIONS

### 60-30-10 Color Rule (from guidelines)
- **60%** — Dominant: White `#FFFFFF`, Light Grey `#F8F8F8`, Cream `#F8F6F0` — main page backgrounds
- **30%** — Secondary: Blue Grey `#DFEBEB`, Soft Grey `#D1D1D1` — nav, info blocks, section backgrounds
- **10%** — Accent: Teal `#198669`, Charcoal `#323232`, Logo Grey `#575656` — buttons, key text, borders, highlights

### Colors (verified from guidelines)
| Name | Hex | Role |
|---|---|---|
| White | `#FFFFFF` | 60% primary background |
| Light Grey | `#F8F8F8` | 30% subtle surface |
| Cream | `#F8F6F0` | 30% warm background |
| Blue Grey | `#DFEBEB` | 30% info blocks, nav tints |
| Soft Grey | `#D1D1D1` | Borders, dividers, disabled |
| **Primary / Teal** | **`#198669`** | **10% — CTAs, highlights, links, icons, ampersand** |
| Charcoal | `#323232` | 10% — ALL headings and body text |
| Logo Grey | `#575656` | 10% — secondary text |

### Feedback Colors
| Name | Hex |
|---|---|
| Success | `#198669` |
| Success BG | `#D8EEE8` |
| Ocean (info) | `#175A7B` |
| Info BG | `#DFEBEB` |
| Warning BG | `#FAEACA` |
| Warning outline | `#B38C00` (outline only — no solid fill for warning) |
| Error | `#8B2925` |
| Error BG | `#FDA8A4` |

### Event / Campaign Colors (labels & assets only)
| Name | Hex |
|---|---|
| Black Friday | `#323232` |
| Big Little Event | `#C87D32` |
| Sale | `#E02947` |
> Campaign colours must NOT replace design system colours except for campaign-specific labels.

### Typography (verified from guidelines)
- **Font:** **Poppins** (Google Fonts) — the confirmed M&P brand font for ALL UI and body text
- **Display font:** Poppins weight 200 (ExtraLight) — used for campaign/hero headlines at large sizes
- **All text colour:** Charcoal `#323232`
- **Weights used:** 300 (light) for headings and body; 600 (semibold) for buttons and bold labels

| Style | Size | Weight | Usage |
|---|---|---|---|
| Desktop H1 | 46px | 300 light | Main page headlines |
| Mobile H1 / Small header | 29px | 300 light | Mobile headlines, section headers |
| Intro | 18px | 300 light | Section intros, summaries |
| Body | 14px | 300 light | Body copy, descriptions |
| Label / Button | 14px | 600 semibold | Buttons, bold labels |
| Caption | 12px | 300 light | Fine print |

### Buttons (verified from guidelines)
All buttons use **pill / fully-rounded** border-radius (`border-radius: 9999px`), 14px semibold.

| Type | Style | Usage |
|---|---|---|
| **Primary** | Teal fill `#198669`, white text | Main CTA — once per page, typically top |
| **Secondary** | Charcoal outline, charcoal text (→ inverted on hover) | Supporting actions, multiple per page |
| **Tertiary** | Text with underline, charcoal | Repeated content (e.g. blog carousel) |
| **Link button** | Teal text + arrow, no underline | Alternative to tertiary, list views |
| White outline | White outline + white text | On dark/image backgrounds |
| White text | Plain white text | On dark/image backgrounds |

### Accessibility
- Target: **AA accessibility standards**
- Colours checked via contrast checker — some colours may vary slightly from campaign originals
- Alt tags required on all images
- Icons must not be used in isolation unless universally understood (e.g. search); minimum 16px
- 1 in 4 people in the UK are disabled; AA compliance is required

### Mobile First
- **88.2% mobile traffic**, 11% desktop, 0.8% tablet
- Mobile-first approach encourages minimal, focused content

### Layout & Spacing
- **60-30-10** colour application across page sections
- Body text capped at **50–75 characters wide**
- Left-aligned text as default; centre only for short subtitles (< 3 lines)
- Icons: line style, minimum 16px, supporting text — never in isolation unless universally understood

### Backgrounds & Surfaces
- Predominantly white and light grey/cream surfaces
- Blue grey `#DFEBEB` for informational blocks and nav accents
- No gradient backgrounds in UI
- Campaign imagery in banners only — does not replace design system colours

### Shape & Form
- Buttons: **fully rounded pill** shape
- Cards/inputs: moderate radius (6–8px)
- Dividers: `1px solid #EBEBEB`

### Shadows / Elevation
- Very subtle warm-neutral shadows
- `shadow-sm`: resting cards, inputs
- `shadow-md`: hover state cards, dropdowns
- `shadow-lg`: modals, drawers

### Animation
- Smooth ease-out `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Hover: 150ms; panel transitions: 250ms; hero: 400ms
- No bouncy/spring animations in product UI

---

## ICONOGRAPHY

- **Style:** Thin line icons, 1.5px stroke, no fill — minimal and clean
- **Size:** Minimum 16px; never isolated without text label unless universally understood (search, basket, etc.)
- **System:** No confirmed M&P icon set available in guidelines; **Lucide Icons** used as nearest CDN substitute (same stroke weight and geometric style)
- **Emoji:** Not used in brand UI
- **Ratings:** Star character ★ (teal `#198669`) used for product ratings

```html
<!-- Lucide CDN (substitute for M&P icon set) -->
<script src="https://unpkg.com/lucide@0.378.0/dist/umd/lucide.min.js"></script>
```

---

## FILE INDEX

```
Mamas & Papas Design System/
├── README.md                      ← This file
├── SKILL.md                       ← Agent skill definition
├── colors_and_type.css            ← All design tokens (verified from guidelines PDF)
│
├── fonts/
│   ├── Zooja-Light.ttf            ← Retained for reference; Poppins is now sole brand font
│   └── Zooja-Light.otf
│
├── assets/
│   ├── logo.svg                   ← Wordmark on light backgrounds
│   └── logo-white.svg             ← Wordmark on dark backgrounds
│
├── preview/                       ← Design System tab cards
│   ├── colors-brand.html          ← 60/30/10 palette (white, grey, cream, teal, charcoal)
│   ├── colors-feedback.html       ← Success, info, warning, error
│   ├── colors-events.html         ← Sale, Black Friday, Big Little Event
│   ├── colors-semantic.html       ← Semantic tokens mapped to roles
│   ├── type-display.html          ← Poppins ExtraLight 200 display specimens
│   ├── type-headings.html         ← Poppins scale: 46px → 12px
│   ├── type-body.html             ← Body text rules (width, alignment)
│   ├── spacing-tokens.html        ← Spacing scale
│   ├── spacing-radius-shadow.html ← Radius + elevation
│   ├── components-buttons.html    ← Primary, secondary, tertiary, link, white variants
│   ├── components-forms.html      ← Inputs + feedback message blocks
│   ├── components-cards.html      ← Product, content, info cards
│   ├── components-badges.html     ← Badges, filter tags, ratings
│   └── brand-logo.html            ← Logo on light/dark/cream
│
└── ui_kits/
    └── website/
        ├── README.md
        └── index.html             ← Interactive e-commerce prototype (Homepage, PDP, Basket)
```
