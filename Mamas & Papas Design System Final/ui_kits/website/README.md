# Mamas & Papas — Website UI Kit

Interactive click-through prototype of the M&P e-commerce website.

## Components

| File | Description |
|---|---|
| `Header.jsx` | Sticky header with top bar, logo, nav, search, bag counter |
| `Hero.jsx` | Full hero section with headline, CTA row, trust signals, image zone |
| `ProductCard.jsx` | Product card with image, badge, star rating, price, wishlist, add-to-bag |
| `Footer.jsx` | Dark footer with 4-column nav, newsletter signup, social links, legal bar |

## Usage

Components export to `window` so they are available globally across Babel scripts.

```html
<script type="text/babel" src="Header.jsx"></script>
<!-- then in your app script: -->
<Header bagCount={3} />
```

## Design width: 1280px (desktop)
