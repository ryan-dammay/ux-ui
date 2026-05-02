---
name: bloomingdales-design
description: Use this skill to generate well-branded interfaces and assets for Bloomingdale's, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping the Bloomingdale's e-commerce experience.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick Reference

**Primary font:** Inter Variable → `fonts/Inter-VariableFont_opsz,wght.ttf`
**CSS tokens:** `colors_and_type.css` (import this first in every artifact)

**Key colors:**
- Black `#111111` — primary text, buttons
- Magenta `#FA16C8` — hover/active accent only
- Mid grey `#767676` — secondary text
- Border default `#ECECEC`

**Button rules:** border-radius 2px always. Primary = black bg. Hover = #767676. No pill buttons.
**Type:** Inter, all weights. Captions are uppercase with letter-spacing. No Roboto Mono in UI.
**Cards:** 1px #ECECEC border, 2px radius, shadow-2 on elevation.
**Icons:** Use SVGs from `assets/icons/` or Lucide CDN as fallback for Bl-Icons font.
**UI kit:** `ui_kits/website/index.html` — full click-through prototype (Home → PLP → PDP → Bag → Wishlist → Account).
