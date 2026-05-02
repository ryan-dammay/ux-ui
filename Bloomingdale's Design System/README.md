# Bloomingdale's Design System

**Brand:** Bloomingdale's — Macy's Inc. luxury and contemporary department store.  
**Website:** [bloomingdales.com](http://www.bloomingdales.com)

## Sources

| Source | Reference |
|--------|-----------|
| Figma file | `BLM - Design System.fig` (mounted as virtual filesystem) |
| Inter Variable Font | `uploads/Inter-VariableFont_opsz,wght.ttf` → `fonts/` |
| Live site | http://www.bloomingdales.com |

---

## Product Context

Bloomingdale's is a premium American department store operating:

1. **E-commerce website** (desktop + mobile responsive) — the primary product surface. Covers Browse/PLP, PDP (Product Detail), Checkout, Account management, Wishlist/Registry, and editorial/content pages.
2. **Mobile app** (iOS + Android) — referenced in the Figma via device frames and mobile-specific component variants.
3. **In-store digital** — represented via Amber (loyalty) and store locator components.

### Key sub-products visible in the Figma
- **Mega Nav** — desktop navigation with category flyouts
- **PDP / Mini-PDP** — full and condensed product pages
- **Checkout** — multi-step checkout flow (236 component frames)
- **Wishlist / Registry** — wishlist and gift registry (213 frames)
- **Account** — full account management portal (59 + 100 frames)
- **Loyalty (Amber)** — rewards/loyalty program UI
- **Designers A–Z** — designer directory landing pages
- **BBB (Bloomingdale's Big Brown Bag)** — brand marketing / landing page
- **Fragrance Finder** — interactive guided selling tool
- **Holition** — AR try-on integration (88 frames)
- **Size Guide** — interactive size chart modals
- **Our Apps** — app store marketing pages

---

## CONTENT FUNDAMENTALS

### Voice & Tone
- **Authoritative but approachable.** Copy is confident and editorial, befitting a luxury department store, but never cold or exclusionary.
- **Concise & direct.** Bloomingdale's uses short, punchy labels and CTAs. "Add to Bag" (not "Add to Cart"). "Shop Now." "View Details."
- **Second person (you/your).** "Find your size." "Your wishlist." Copy addresses the customer directly.
- **Sentence case** for body copy and UI labels. **Title Case** for section headings and designer names.
- **ALL CAPS** sparingly — used in CAPTION type tokens (category labels, filter labels, metadata). Never for primary CTAs.
- **No emoji** in UI components. The design system contains zero emoji usage.
- **Numbers:** Price always formatted with `$` prefix: `$248.00`. Sale pricing shows original with strikethrough.
- **Promotional copy:** Urgency language used carefully ("Limited time," "New Arrivals," "Exclusive").

### Examples
- CTA: "Add to Bag" / "Shop Now" / "Save to Wishlist" / "Sign In" / "Create an Account"
- Error: "Something went wrong. Please try again."
- Empty state: "Your bag is empty. Start shopping."
- Nav labels: "Women," "Men," "Home," "Sale," "Designers"

---

## VISUAL FOUNDATIONS

### Color
- **Primary palette is near-monochrome black/white/grey** with magenta as the sole brand accent.
- **#111111 (near-black)** — primary text, CTA buttons, borders in active/focus state.
- **#FA16C8 (magenta)** — brand accent; used exclusively for link hover, active, and select UI states. Never used as a fill for large surfaces.
- **Neutral grey scale** runs from `#767676` (mid) through `#CBCBCB`, `#E8E8E8`, `#ECECEC`, `#F9F9F9` to white. Used for dividers, borders, surface fills.
- **Alert colours** are functional: red (`#AE1800`/`#F94116`) for errors, green (`#155635`) for success, light blue (`#E9F3FC`) for informational banners.
- **No gradients** on UI components. Backgrounds are flat solids.
- **Image overlays** use `rgba(0,0,0,0.25)` — black scrim, not coloured.

### Typography
- **Primary typeface: Inter** (variable, full weight range 400–700). Used for all UI labels, body, headings, and display text.
- **Helvetica Neue** — used in some legacy/marketing frames; considered a near-equivalent.
- **Avenir** — appears in some editorial/older frames; also considered equivalent to Inter in spirit.
- **Bl-Icons** — proprietary Bloomingdale's icon font. Glyph-based; rendered at 20px, 16px, 24px. See `assets/` folder.
- **Roboto Mono** — used only within the design system documentation itself (token labels, hex values). Not part of the product UI.
- Type scale is defined with CSS tokens in `colors_and_type.css`. See that file for the full scale.
- **Letter-spacing** on CAPTION classes only (0.4–0.8px). Body and headings are 0.

### Backgrounds
- **White (#FFFFFF) is the default page background.**
- Surfaces (cards, modals, sheets) use `#F9F9F9` or white.
- **No full-bleed photographic backgrounds** on UI chrome — product imagery is always contained in cards or hero zones.
- **No patterns or textures** in UI. Editorial pages may use styled imagery.
- Info banners use `#E9F3FC` (light blue).

### Cards
- **Border:** `1px solid #ECECEC` (default) or `1px solid #111111` (selected/active).
- **Border radius: 2px** (nearly square). Very minimal rounding. 4px used for tooltips/tags. 100px for pill shapes (badges).
- **Shadow:** `0 2px 8px rgba(17,17,17,0.1)` for elevated cards. Modals use `0 16px 40px rgba(0,0,0,0.25)`.
- Card content: product image (2:1 or 1:1 aspect ratio), brand name caption, product title, price. No avatar or icon decoration.

### Buttons
- **Primary:** `background: #111111`, `color: white`, `border-radius: 2px`. Heights: Small 32px / Default 44px / Large 48px.
- **Hover:** background shifts to `#767676` (mid-grey). No scale transform.
- **Secondary:** transparent fill, `1px solid #111111` border, `#111111` text. Same hover: fill becomes `#111111`, text becomes white.
- **Link / Ghost:** Text only. `#111111` text, underline. Hover: `#FA16C8`.
- **Disabled:** opacity 0.4, no pointer events.
- **No pill/rounded buttons** in the primary UI — always `border-radius: 2px`.

### Icons
- Custom **Bl-Icons** glyph font at 16px, 20px, 24px. See ICONOGRAPHY section below.
- No SVG icons drawn by hand in components — all icon references use the Bl-Icons font or isolated SVG exports.

### Spacing
- Base unit: **4px**. Scale: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80px.
- Page gutters: 70px on design frames. Component internal padding: 12–16px.

### Animation & Motion
- **Minimal animation.** Transitions on hover/focus states are `200ms ease`.
- Bottom sheets and modals slide/fade in. No bouncing or spring physics.
- No parallax or scroll-triggered animations observed in the design system.

### Borders
- `border_all_1`: `1px solid #CBCBCB` — default, subtle.
- `border_all_2`: `1px solid #CBCBCB` + `inset 0 0 0 1px #111111` — selected/active state.
- `border_all_3`: `1px solid #111111` + `inset 0 0 0 1px #CBCBCB` — alternate emphasis.

### Elevation / Shadow System
Five shadow levels — all use the neutral palette, no coloured shadows:
1. `0 1px 2px rgba(17,17,17,0.1)` — subtle (inputs on hover)
2. `0 2px 8px rgba(17,17,17,0.1)` — cards
3. `0 4px 16px rgba(17,17,17,0.1)` — dropdowns, tooltips
4. `0 8px 24px rgba(0,0,0,0.1)` — bottom sheets
5. `0 16px 40px rgba(0,0,0,0.25)` — modals

### Imagery
- Product photography is dominant — full-colour, studio-quality, white/neutral background.
- Editorial images: rich, lifestyle, warm-toned.
- **No grain, duotone, or black-and-white** treatment in UI components.
- Aspect ratios: **1:1** (square product thumbnails), **2:1** (hero banners), **4:3** (editorial cards).
- Image placeholders use flat `#CBCBCB` fills in wireframe mode.

### Scrollbars
- Custom scrollbar styling (thin, `#CBCBCB` thumb on white track).

### Blur / Transparency
- Overlay scrims: `rgba(17,17,17,0.5)` black scrim behind modals and bottom sheets.
- No frosted-glass / backdrop-filter blur in the standard component library.

---

## ICONOGRAPHY

The design system uses a **proprietary icon font: `Bl-Icons`**. This is a glyph-based icon system rendered via `font-family: "Bl-Icons"` at sizes 16px, 20px, and 24px.

**Approach:**
- No SVG icons in components — icons are rendered as text glyphs via the icon font.
- Size variants: 16px (compact/inline), 20px (default, most common), 24px (large/standalone).
- Padding variants: `No` padding (icon only) vs default (icon with container padding).
- No emoji usage. No unicode character icons.

**The `Bl-Icons` font file is not in the provided assets.** A CDN or system substitute is not available. Any implementation should obtain this font from the Bloomingdale's engineering team. As a fallback, Lucide Icons (stroke-style, `https://unpkg.com/lucide@latest`) or Material Symbols provide a close visual match.

**Other icon types present:**
- **Payment card logos** — `assets/payment-cards/` (Visa, MC, Amex, etc.)
- **Country flags** — `assets/flags/`
- **App store badges** — `assets/app-store/` (App Store, Google Play)
- **Social icons** — `assets/social/`
- **BNPL (Buy Now Pay Later)** icons — Tamara, Tabby, etc. (`assets/bnpl/`)

Assets are copied into `assets/` where available from the Figma export.

---

## FILE INDEX

```
/
├── README.md                  ← This file (full design system manifest)
├── colors_and_type.css        ← All CSS custom properties (colors, type, spacing, effects)
├── SKILL.md                   ← Agent skill definition
│
├── fonts/
│   └── Inter-VariableFont_opsz,wght.ttf
│
├── assets/
│   ├── icons/                 ← SVG icon exports from Figma
│   ├── payment-cards/         ← Payment method logos
│   ├── social/                ← Social media icons
│   └── app-store/             ← App store badges
│
├── preview/                   ← Design System tab cards
│   ├── colors-brand.html
│   ├── colors-neutral.html
│   ├── colors-semantic.html
│   ├── type-display.html
│   ├── type-body.html
│   ├── type-caption.html
│   ├── spacing-tokens.html
│   ├── effects-shadow.html
│   ├── effects-radius.html
│   └── effects-borders.html
│
└── ui_kits/
    └── website/
        ├── README.md
        ├── index.html         ← Interactive website prototype
        ├── Header.jsx
        ├── ProductCard.jsx
        ├── Button.jsx
        └── ...
```
