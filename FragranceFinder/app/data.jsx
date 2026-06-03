// Fragrance catalogue + chat suggestion data. Exported to window for cross-script use.
// Prices in AED (United Arab Emirates Dirham) to match the Figma source.

const FRAGRANCES = [
  { brand: "ACQUA DI PARMA", name: "Colonia Sandalo Eau de Cologne", price: 985, badge: null, rating: 4.8, reviews: 212, family: "Woody", swatches: ["#e7e1d2", "#d9cdb4", "#c9b48f"], notes: "Sandalwood · Bergamot · Cardamom",
    conc: "Eau de Cologne", stock: 6, story: "A modern tribute to Italian sandalwood — bright citrus opens onto a creamy, refined drydown that wears beautifully from desk to dusk.", pyramid: { top: "Bergamot, Cardamom", heart: "Sandalwood, Orange Blossom", base: "Tonka Bean, Cedar" } },
  { brand: "DIPTYQUE", name: "Tam Daô Eau de Parfum", price: 1120, badge: "BESTSELLER", rating: 4.9, reviews: 488, family: "Woody", swatches: ["#d7c9b0", "#b89a72"], notes: "Cedar · Sandalwood · Incense",
    conc: "Eau de Parfum", stock: 14, story: "A woody meditation built around Mysore-style sandalwood, grounded by incense and a whisper of spice. Calm, contemplative, unmistakably Diptyque.", pyramid: { top: "Italian Cypress, Rosewood", heart: "Sandalwood, Cedar", base: "Incense, Amber, Musk" } },
  { brand: "BYREDO", name: "Gypsy Water Eau de Parfum", price: 1290, badge: null, rating: 4.7, reviews: 356, family: "Woody Aromatic", swatches: ["#cdd6d0", "#aebcae", "#8fa292"], notes: "Pine · Sandalwood · Amber",
    conc: "Eau de Parfum", stock: 9, story: "An ode to the romanticised freedom of Bohemian living — pine and bright bergamot melt into sandalwood and amber for an outdoorsy, almost mossy freshness.", pyramid: { top: "Bergamot, Lemon, Pepper", heart: "Pine Needles, Incense", base: "Sandalwood, Amber, Vanilla" } },
  { brand: "JO MALONE LONDON", name: "Wood Sage & Sea Salt Cologne", price: 640, badge: null, rating: 4.6, reviews: 921, family: "Fresh", swatches: ["#dfe6e9", "#c4d0d4"], notes: "Sea Salt · Sage · Grapefruit",
    conc: "Cologne", stock: 21, story: "Escape the everyday along the windswept shore. Mineral sea salt wraps around earthy sage for a scent as fresh and free as the coast.", pyramid: { top: "Ambrette Seeds, Grapefruit", heart: "Sea Salt", base: "Sage, Driftwood" } },
  { brand: "MAISON F. KURKDJIAN", name: "Baccarat Rouge 540 Extrait", price: 1680, badge: "NEW", rating: 4.9, reviews: 1043, family: "Amber Floral", swatches: ["#e9c6c0", "#d99a90"], notes: "Saffron · Jasmine · Ambergris",
    conc: "Extrait de Parfum", stock: 4, story: "A signature of luminous opulence. Saffron and jasmine glow over ambergris and cedar — a trail that lingers like candlelight on crystal.", pyramid: { top: "Saffron, Bitter Almond", heart: "Egyptian Jasmine", base: "Ambergris, Fir Resin, Cedar" } },
  { brand: "LE LABO", name: "Santal 33 Eau de Parfum", price: 1240, badge: null, rating: 4.8, reviews: 770, family: "Woody", swatches: ["#ddd0bd", "#c2a982"], notes: "Sandalwood · Cardamom · Leather",
    conc: "Eau de Parfum", stock: 11, story: "The cult classic. Smoky sandalwood meets cardamom, leather and iris for an addictive, unisex warmth that's become a modern signature.", pyramid: { top: "Cardamom, Violet", heart: "Iris, Ambrox", base: "Sandalwood, Cedar, Leather" } },
  { brand: "TOM FORD", name: "Oud Wood Eau de Parfum", price: 1450, badge: null, rating: 4.7, reviews: 612, family: "Oriental", swatches: ["#cbb79b", "#9c8460", "#6f5a3c"], notes: "Oud · Rosewood · Vanilla",
    conc: "Eau de Parfum", stock: 7, story: "Rare oud wood, smoothed with rosewood and warm spice, settles into vanilla and amber. Exotic and refined in equal measure.", pyramid: { top: "Rosewood, Cardamom, Pepper", heart: "Oud, Sandalwood", base: "Vanilla, Amber, Tonka" } },
  { brand: "KILIAN PARIS", name: "Good Girl Gone Bad Refill", price: 1390, badge: null, rating: 4.8, reviews: 284, family: "Floral", swatches: ["#ecd2d8", "#dba7b6"], notes: "Tuberose · Jasmine · Osmanthus",
    conc: "Eau de Parfum", stock: 5, story: "A seductive white-floral bouquet — tuberose, jasmine and osmanthus laced with narcissus. Daring, luminous, unforgettable.", pyramid: { top: "Osmanthus, Narcissus", heart: "Tuberose, Jasmine, May Rose", base: "Amber, Cedar" } },
  { brand: "CREED", name: "Aventus Eau de Parfum", price: 1590, badge: "BESTSELLER", rating: 4.9, reviews: 1322, family: "Fruity Chypre", swatches: ["#d9d2c4", "#b6ab93"], notes: "Pineapple · Birch · Musk",
    conc: "Eau de Parfum", stock: 18, story: "The icon of confidence. A burst of juicy pineapple gives way to smoky birch and oakmoss — bold, sophisticated and endlessly wearable.", pyramid: { top: "Pineapple, Bergamot, Blackcurrant", heart: "Birch, Patchouli, Rose", base: "Musk, Oakmoss, Vanilla" } },
  { brand: "CHANEL", name: "Bleu de Chanel Parfum", price: 870, badge: null, rating: 4.8, reviews: 1580, family: "Woody Aromatic", swatches: ["#c4cdd6", "#8b9bad"], notes: "Citrus · Cedar · Sandalwood",
    conc: "Parfum", stock: 16, story: "A timeless statement of freedom. Zesty citrus and aromatic herbs deepen into sandalwood and cedar — clean, magnetic, effortlessly modern.", pyramid: { top: "Grapefruit, Lemon, Mint", heart: "Ginger, Nutmeg, Jasmine", base: "Sandalwood, Cedar, Tonka" } },
];

// Volume options for fragrance PDPs (price multipliers relative to the listed 100ml price)
const FRAGRANCE_SIZES = [
  { ml: 50, mult: 0.68 },
  { ml: 100, mult: 1 },
  { ml: 200, mult: 1.62 },
];

// Quick-query chips shown in the chat welcome state (tweakable)
const QUICK_QUERIES_DEFAULT = [
  "A feminine day perfume",
  "Something like Bleu de Chanel",
  "Warm & woody for evening",
  "A fresh summer scent",
  "An elegant gift under AED 800",
];

// Sub-category chips on the PLP intro
const SUBCATEGORIES = ["All", "For Her", "For Him", "Unisex", "Oud & Oriental", "Gift Sets", "Niche"];

// Fallback assistant flow used when window.claude is unavailable (offline / export)
const FALLBACK_RECS = ["DIPTYQUE", "ACQUA DI PARMA", "LE LABO", "BYREDO", "JO MALONE LONDON"];

Object.assign(window, { FRAGRANCES, FRAGRANCE_SIZES, QUICK_QUERIES_DEFAULT, SUBCATEGORIES, FALLBACK_RECS });
