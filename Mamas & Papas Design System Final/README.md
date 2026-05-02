# Mamas & Papas Design System

Mamas & Papas (M&P) is a premium British baby and nursery brand, selling pushchairs, car seats, nursery furniture, clothing and accessories. The brand targets new and expectant parents who want beautifully made, trustworthy products.

## Sources

- **GitHub repo**: `ryan-dammay/M-PDS` — contains four HTML design reference documents:
  - `M&P Design System.html` — full design system reference (colours, typography, spacing, buttons, badges, cards, forms, icons, chat components)
  - `M&P Figma Cheatsheet.html` — Figma variable/token setup guide
  - `M&P Form Elements Anatomy.html` — annotated anatomy of all form elements
  - `M&P Responsive Wireframe.html` — responsive layout wireframes
- **Uploaded fonts**: Poppins (Thin, Light, Regular, Medium, SemiBold, Bold) — copied to `fonts/`
- **Uploaded logo**: SVG wordmark — copied to `assets/logo-wordmark.svg`

---

## CONTENT FUNDAMENTALS

### Voice & Tone
- **Warm, reassuring, expert.** M&P speaks like a knowledgeable friend — never clinical or corporate.
- **Parent-first perspective.** Copy addresses the parent directly ("you", "your baby"). First-person brand voice is minimal.
- **Confidence without arrogance.** Claims are specific and grounded ("award-winning", "tested to the highest standards").
- **Celebratory of the journey.** Milestones, firsts, and family moments are elevated.
- **British English** spelling and idioms (colour, beautifully, nappy, pram).

### Casing
- Product names and category labels: **Title Case** ("Pushchairs & Prams", "Car Seats")
- CTAs: **Sentence case** ("Shop now", "Add to bag", "Find out more")
- Navigation labels: **Sentence case**
- Badge labels: **ALL CAPS** with tight tracking ("NEW IN", "BESTSELLER")
- Section labels / overlines: **ALL CAPS** small text with letter-spacing

### Emoji Usage
- **Not used** in product or UI copy. Emoji appear only in internal docs (e.g. Figma cheatsheet step icons). Never in the customer-facing UI.

### Example Copy Patterns
- Hero: *"Everything baby needs, beautifully made"*
- CTA: *"Shop now"*, *"Find out more"*, *"Add to bag"*
- Trust signals: *"Free delivery on orders over £50"*, *"Award-winning design"*
- Badge: `NEW IN` · `BESTSELLER` · `ECO` · `SALE`

---

## VISUAL FOUNDATIONS

### Colour System
**Primary**: Teal `#198669` — the brand's signature green. Used for primary buttons, active states, focus rings, progress indicators, links on dark backgrounds.

**Neutrals**:
| Name | Hex | Usage |
|---|---|---|
| Charcoal | `#323232` | Primary text, dark backgrounds |
| Logo Grey | `#575656` | Secondary text |
| Muted | `#878686` | Hints, placeholders, labels |
| Soft Grey | `#D1D1D1` | Borders, dividers |
| Grey | `#F8F8F8` | Page background, state boxes |
| Cream | `#F8F6F0` | Section backgrounds, product image wash |
| White | `#FFFFFF` | Cards, inputs, surfaces |

**Accent palette**:
| Name | Hex | Usage |
|---|---|---|
| Coral | `#C4574A` | Sale badges, error, alerts, destructive actions |
| Navy | `#2C3E5A` | Delivery badge, promo banner, secondary accent |
| Ocean | `#175A7B` | Info states, chat received bubbles |
| Amber | `#E8A020` | Star ratings, Bestseller badge, warnings |
| Purple | `#7B5EA7` | Certified badge, wishlist chip |

**Feedback/Semantic**:
- Success bg: `#D8EEE8` · Info bg: `#DFEBEB` · Warning bg: `#FAEACA` · Error: `#8B2925` / bg `#FDA8A4`

### Typography
- **Display/Body font**: Poppins (Google Fonts + local .ttf files in `fonts/`)
  - Weights used: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Mono font**: Cousine — used for token labels, code, hex values
- No serif typeface is used anywhere in the UI
- Line-height: 1.6 for body; 1.2–1.3 for display
- Letter-spacing: tight on headings; 1–1.5px tracking on overlines and badge labels

### Spacing
Scale: `xs=4px`, `sm=8px`, `md=16px`, `lg=24px`, `xl=32px`, `2xl=48px`, `3xl=64px`

### Borders & Radius
- `--radius-sm: 4px` — inputs, tags, small chips
- `--radius-md: 8px` — cards, modals, tooltips
- `--radius-lg: 12px` — hero sections, promo banners
- `--radius-xl: 16px` — large modals
- `--radius-full: 9999px` — badges, pills, toggles, avatar crops
- Border color: `#D1D1D1` at 1px; inputs use 1.5px

### Shadows
- `--shadow-sm`: `0 1px 2px -1px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.1)` — cards, buttons, wishlist icon
- `--shadow-md`: `0 4px 12px rgba(0,0,0,.08)` — dropdowns, hover cards, panels

### Backgrounds
- Page background: `#F8F8F8` (warm off-white)
- Product image backgrounds: `#F8F6F0` (cream) — never white; adds warmth
- Section backgrounds alternate between cream and white
- **No full-bleed gradients** in the main UI; gradients used sparingly on promo banners (navy→coral)
- No textures, patterns, or hand-drawn illustrations found in the design system

### Animation & Interaction
- Transitions: `0.15s` ease-in-out on all interactive states (colour, background, border)
- Hover on cards: `translateY(-2px)` + shadow-md — subtle lift
- Focus rings: `box-shadow: 0 0 0 3px rgba(25,134,105,.12)` (teal glow)
- Hover buttons: darken background or invert (secondary: white→charcoal fill)
- Typing indicator: bouncing dots animation (chat component)
- No spring or bounce animations; brand is refined, not playful

### Cards
- White background, 1px `#D1D1D1` border, `border-radius: 8px`, `shadow-sm`
- Hover: shadow-md + translateY(-2px)
- Product cards: image zone uses cream background (#F8F6F0)
- Feature cards: icon + title + description, minimal border

### Iconography
→ See ICONOGRAPHY section below

### Imagery
- Warm, natural tones — lifestyle photography of babies and parents
- Cream/neutral product photography backgrounds
- No grain or film effects noted in the design system

---

## ICONOGRAPHY

**Icon library**: [Lucide Icons](https://lucide.dev/) — loaded via CDN (`https://unpkg.com/lucide@latest/dist/umd/lucide.min.js`)

- **Style**: Outline / stroke-based. `stroke-width: 1.5`. `fill: none`.
- **Size**: 14–20px in UI contexts; 20px standard icon cell size
- **Color**: Inherits `currentColor` / matches text context
- **No emoji** used as icons in customer-facing UI
- **No unicode characters** used as icons
- **No custom SVG icon set** found — Lucide is the sole icon system
- Icons in nav: 14px, opacity 0.6 default, 1.0 on active/hover
- Icons in buttons: 14–16px inline with text

**Usage pattern**:
```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<i data-lucide="shopping-bag"></i>
<script>lucide.createIcons();</script>
```

---

## FILE INDEX

```
README.md                     ← This file
SKILL.md                      ← Agent skill definition
colors_and_type.css           ← All CSS custom properties (colors, type, spacing, radius, shadow)
fonts/                        ← Poppins TTF files (Thin→Bold)
assets/
  logo-wordmark.svg           ← M&P SVG wordmark (113×42px)
preview/                      ← Design system card previews (shown in Design System tab)
  colors-brand.html
  colors-neutrals.html
  colors-semantic.html
  colors-accents.html
  type-scale.html
  type-weights.html
  spacing-tokens.html
  radius-shadow.html
  buttons.html
  badges.html
  forms.html
  cards.html
ui_kits/
  website/
    index.html                ← M&P e-commerce website UI kit
    Header.jsx
    ProductCard.jsx
    Hero.jsx
    Footer.jsx
```
