// data.jsx — Coach Shopping Assistant content: catalog, flows, FAQ, payments
// All copy is UAE-specific (AED, Tabby/Tamara, Dubai stores).

const IMG = 'assets/img/';
const A = (f) => (typeof window!=='undefined' && window.assetURL ? window.assetURL(IMG + f) : IMG + f);

const PRODUCTS = [
  { id:'brooklyn-rust',   name:'Brooklyn Shoulder Bag 34', color:'Rust',      colorHex:'#a8472e', style:'Shoulder',  price:2200, sale:1540, tag:'Sale',       img:A('brooklyn-rust.jpg') },
  { id:'brooklyn-brown',  name:'Brooklyn Shoulder Bag 34', color:'Brown',     colorHex:'#5a3826', style:'Shoulder',  price:2200, tag:'Bestseller', img:A('brooklyn-brown.jpg') },
  { id:'brooklyn-choc',   name:'Brooklyn Shoulder Bag 34', color:'Chocolate', colorHex:'#6b4a2f', style:'Shoulder',  price:2200, img:A('brooklyn-chocolate.jpg') },
  { id:'brooklyn-black',  name:'Brooklyn Shoulder Bag 34', color:'Black',     colorHex:'#1a1a1a', style:'Shoulder',  price:2200, tag:'Bestseller', img:A('brooklyn-black.jpg') },
  { id:'tabby-brown',     name:'Tabby Shoulder Bag 26',    color:'Brown',     colorHex:'#5a3826', style:'Shoulder',  price:2050, tag:'Bestseller', img:A('tabby-brown.jpg') },
  { id:'tabby-black',     name:'Tabby Shoulder Bag 26',    color:'Black',     colorHex:'#1a1a1a', style:'Top handle',price:2050, img:A('icon-tabby-cherry.jpg') },
  { id:'tabby-msgr',      name:'Tabby Messenger 26',       color:'Black',     colorHex:'#1a1a1a', style:'Crossbody', price:2400, img:A('icon-tabby-stack.jpg') },
  { id:'lana-rust',       name:'Lana Shoulder Bag 23',     color:'Rust',      colorHex:'#a8472e', style:'Top handle',price:1950, tag:'New',        img:A('icon-lana.jpg') },
  { id:'icon-brooklyn',   name:'Brooklyn Shoulder Bag 28', color:'Burgundy',  colorHex:'#5b2330', style:'Shoulder',  price:1950, img:A('icon-brooklyn.jpg') },
];

const byId = (id) => PRODUCTS.find(p => p.id === id);

// Discovery filter helpers ------------------------------------------------
const COLOR_OPTIONS = [
  { label:'Black',  hex:'#1a1a1a', match:['Black'] },
  { label:'Brown',  hex:'#5a3826', match:['Brown','Chocolate'] },
  { label:'Rust',   hex:'#a8472e', match:['Rust'] },
  { label:'Burgundy',hex:'#5b2330',match:['Burgundy'] },
];
const STYLE_OPTIONS = ['Shoulder','Crossbody','Top handle'];
const BUDGET_OPTIONS = [
  { label:'Under AED 2,000', max:2000 },
  { label:'AED 2,000–2,500', max:2500 },
  { label:'No limit',        max:99999 },
];

function discover({ colors, styles, budget }) {
  let list = PRODUCTS.slice();
  if (colors && colors.length) {
    const set = new Set();
    colors.forEach(c => COLOR_OPTIONS.find(o=>o.label===c)?.match.forEach(m=>set.add(m)));
    list = list.filter(p => set.has(p.color));
  }
  if (styles && styles.length) list = list.filter(p => styles.includes(p.style));
  if (budget) list = list.filter(p => (p.sale||p.price) <= budget);
  // Sale & bestsellers float up
  list.sort((a,b)=> (b.tag?1:0)-(a.tag?1:0));
  return list.slice(0,6);
}

// Gifting curated picks ----------------------------------------------------
const GIFT_PICKS = {
  her:   ['tabby-brown','brooklyn-rust','lana-rust'],
  him:   ['tabby-msgr','brooklyn-black','brooklyn-choc'],
  any:   ['tabby-black','lana-rust','brooklyn-rust'],
};

// FAQ ----------------------------------------------------------------------
const FAQS = {
  delivery: {
    q:'Delivery',
    a:'Same-day delivery is available in Dubai on orders over AED 500 placed before 2pm. Standard delivery across the UAE takes 2 to 4 working days and is complimentary on orders over AED 500.',
    link:'Delivery & shipping',
  },
  returns: {
    q:'Returns',
    a:'You can return unworn items with tags attached within 14 days of delivery, free of charge. Refunds are issued to your original payment method within 7 to 10 working days.',
    link:'Returns & exchanges',
  },
  stores: {
    q:'Store locations',
    a:'We have two stores in Dubai, open daily from 10am to 12am.',
    link:'Find a store',
    stores:[
      { name:'Coach — The Dubai Mall', detail:'Ground Floor, Fashion Avenue' },
      { name:'Coach — Mall of the Emirates', detail:'Level 1, near Centre Court' },
    ],
  },
};

// Payments -----------------------------------------------------------------
const PAYMENTS = {
  tabby: {
    name:'Tabby',
    headline:'Split into 4 interest-free payments.',
    body:'Pay 25% today and the rest over 3 months. No interest, no fees — ever.',
    sample:(amt)=>`On a AED ${amt.toLocaleString()} bag, that’s 4 × AED ${(amt/4).toLocaleString(undefined,{minimumFractionDigits:2})}.`,
  },
  tamara: {
    name:'Tamara',
    headline:'Pay in 4, or pay in 30 days.',
    body:'Split your order into 4 interest-free installments, or pay the full amount within 30 days — your choice.',
    sample:(amt)=>`Split a AED ${amt.toLocaleString()} order into 4 × AED ${(amt/4).toLocaleString(undefined,{minimumFractionDigits:2})}.`,
  },
  methods:'We accept Visa, Mastercard, American Express, Apple Pay and Cash on Delivery. Tabby and Tamara are also available at checkout for interest-free instalments.',
};

// Order tracking ----------------------------------------------------------
// Sample orders for the demo. statusKey drives the colour + which step is active.
const ORDER_STEPS = ['Ordered','Packed','Shipped','Out for delivery','Delivered'];
const ORDERS = {
  'COACH-100482': { id:'COACH-100482', status:'Shipped',           statusKey:'shipped',   date:'5 Jun 2026', eta:'10 Jun 2026', item:'tabby-brown',   courier:'Aramex',  stepIndex:2 },
  'COACH-100517': { id:'COACH-100517', status:'In progress',       statusKey:'progress',  date:'8 Jun 2026', eta:'13 Jun 2026', item:'brooklyn-black', courier:'Aramex',  stepIndex:1 },
  'COACH-100396': { id:'COACH-100396', status:'Out for delivery',  statusKey:'outfor',    date:'3 Jun 2026', eta:'Today by 6pm', item:'lana-rust',     courier:'Aramex',  stepIndex:3 },
  'COACH-100211': { id:'COACH-100211', status:'Delivered',         statusKey:'delivered', date:'28 May 2026', eta:'Delivered 1 Jun 2026', item:'brooklyn-rust', courier:'Aramex', stepIndex:4 },
};
// Two surfaced as tappable “recent” chips so users needn’t type.
const RECENT_ORDERS = ['COACH-100482','COACH-100517'];
const ORDER_STATUS_COLOR = { shipped:'#9a7b3f', progress:'#6f6a62', outfor:'#9a7b3f', delivered:'#1f8a5b' };

function trackOrder(input){
  if(!input) return null;
  let q = String(input).toUpperCase().replace(/\s+/g,'').replace(/^#/,'');
  if(ORDERS[q]) return ORDERS[q];
  // allow bare digits or a missing COACH- prefix
  const digits = q.replace(/[^0-9]/g,'');
  if(digits){
    const hit = Object.keys(ORDERS).find(k=>k.replace(/[^0-9]/g,'')===digits);
    if(hit) return ORDERS[hit];
  }
  return null;
}

// Whatever the user enters, we always return a plausible order (demo behaviour).
// Unknown numbers are synthesised deterministically from the input.
function synthOrder(input){
  let q = String(input||'').toUpperCase().replace(/\s+/g,'').replace(/^#/,'');
  const digits = q.replace(/[^0-9]/g,'') || '100000';
  if(!/^COACH-/.test(q)) q = 'COACH-'+digits;
  const variants = [
    { status:'In progress',      statusKey:'progress',  stepIndex:1, date:'7 Jun 2026', eta:'in 4–6 working days' },
    { status:'Shipped',          statusKey:'shipped',   stepIndex:2, date:'6 Jun 2026', eta:'in 2–3 working days' },
    { status:'Out for delivery', statusKey:'outfor',    stepIndex:3, date:'5 Jun 2026', eta:'Today by 6pm' },
  ];
  const sum = digits.split('').reduce((a,c)=>a+(+c),0);
  const v = variants[sum % variants.length];
  const items = ['tabby-brown','brooklyn-black','lana-rust','brooklyn-rust'];
  return { id:q, item: items[sum % items.length], courier:'Aramex', ...v };
}

window.COACH_DATA = { PRODUCTS, byId, COLOR_OPTIONS, STYLE_OPTIONS, BUDGET_OPTIONS, discover, GIFT_PICKS, FAQS, PAYMENTS, ORDERS, ORDER_STEPS, RECENT_ORDERS, ORDER_STATUS_COLOR, trackOrder, synthOrder };
