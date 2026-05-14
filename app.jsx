// Bag screen — iOS sticky checkout
// Layout / type / colors / spacing match the Figma design system.
// Products and wordmarks kept generic (no brand logos).

const { useState, useEffect, useRef, useCallback } = React;

// ─────────────────────────────────────────────────────────────
// Tokens — pulled from the Figma metadata + component reads
// ─────────────────────────────────────────────────────────────
const T = {
  white: '#FFFFFF',
  panel: '#F5F5F5',           // shipping bar / chip bg
  panel2: '#F1F1F1',
  inkText: '#000000',
  ink: '#262626',
  ink2: '#444444',
  mute: '#6E6E6E',
  hair: '#E0E0E0',
  hair2: '#E7E7E7',
  hair3: '#EEEEEE',
  blue: 'rgb(0,125,181)',     // primary CTA
  blueLite: 'rgb(5,178,255)', // progress gradient stop
  green: 'rgb(44,131,73)',    // confirmation tick
  greenLite: 'rgb(59,255,157)',
  inactive: 'rgb(217,217,217)',
};

const FONT_DISPLAY = 'Montserrat, "Helvetica Neue", Helvetica, Arial, sans-serif';
const FONT_BODY    = 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif';

// iPhone X
const SAFE_TOP = 44;
const SAFE_BOTTOM = 34;
const STATUS_H = 47;        // matches Figma status bar
const HEADER_NAV_H = 56;    // matches Figma PageBag header
const HEADER_H = STATUS_H + HEADER_NAV_H; // 103
const TAB_H = 48;           // tab row above home indicator
const NAV_H = TAB_H + SAFE_BOTTOM; // 82 (per Figma)
const VIEWPORT_W = 375;
const VIEWPORT_H = 812;

const CHECKOUT_MODULE_H = 186; // per Figma

// ─────────────────────────────────────────────────────────────
// Status bar (carrier / time / battery — iOS style)
// ─────────────────────────────────────────────────────────────
function StatusBar() {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: STATUS_H, zIndex: 80,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 28px 0', boxSizing: 'border-box', color: '#000',
      fontFamily: '-apple-system, "SF Pro Text", system-ui',
      fontWeight: 600, fontSize: 15, letterSpacing: -0.2,
      pointerEvents: 'none',
    }}>
      <div style={{ width: 54, textAlign: 'left' }}>9:41</div>
      {/* notch */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 209, height: 30, background: '#000',
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
      }} />
      <div style={{ width: 67, display: 'flex', gap: 5, alignItems: 'center', justifyContent: 'flex-end', paddingTop: 2 }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><g fill="#000">
          <rect x="0" y="7" width="3" height="4" rx="0.5"/>
          <rect x="4.5" y="5" width="3" height="6" rx="0.5"/>
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.5"/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.5"/>
        </g></svg>
        <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 2.5c2 0 3.8.8 5.2 2.1l1.1-1.1A9.5 9.5 0 007.5 1 9.5 9.5 0 001.2 3.5l1.1 1.1A7.5 7.5 0 017.5 2.5zm0 3.5c1.2 0 2.2.4 3 1.2l1.1-1.1A6 6 0 007.5 4.5a6 6 0 00-4.1 1.6l1.1 1.1a4.3 4.3 0 013-1.2zm0 3.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill="#000"/></svg>
        <svg width="24" height="11" viewBox="0 0 24 11">
          <rect x="0.5" y="0.5" width="21" height="10" rx="2.5" fill="none" stroke="#000" strokeOpacity="0.35"/>
          <rect x="2" y="2" width="18" height="7" rx="1.2" fill="#000"/>
          <rect x="22.5" y="3.5" width="1.2" height="4" rx="0.6" fill="#000" fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Header — Bag title + help icon (matches Figma Page=Bag)
// ─────────────────────────────────────────────────────────────
function Header() {
  return (
    <div style={{
      position: 'absolute', top: STATUS_H, left: 0, right: 0, height: HEADER_NAV_H, zIndex: 70,
      background: T.white,
      borderBottom: `1px solid ${T.hair3}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16,
        color: T.inkText, letterSpacing: 0.2,
      }}>
        Bag
      </div>
      {/* help icon top-right (per PageBag spec, 24×24 at left:335 top:16) */}
      <button aria-label="Help" style={{
        position: 'absolute', right: 16, top: 16,
        width: 24, height: 24, border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#000" strokeWidth="1.5"/>
          <path d="M9.5 9.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="12" cy="17" r="0.9" fill="#000"/>
        </svg>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Product image placeholder (112×140, striped + label)
// ─────────────────────────────────────────────────────────────
function ProductImg({ label, tint = '#EDEDED' }) {
  const pid = `pp-${label.replace(/\W/g,'')}`;
  return (
    <div style={{
      width: 112, height: 140, flexShrink: 0,
      position: 'relative', overflow: 'hidden', background: tint,
    }}>
      <svg width="100%" height="100%" viewBox="0 0 112 140" preserveAspectRatio="none">
        <defs>
          <pattern id={pid} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="8" height="8" fill={tint}/>
            <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(0,0,0,0.05)" strokeWidth="4"/>
          </pattern>
        </defs>
        <rect width="112" height="140" fill={`url(#${pid})`}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
        padding: 8,
        fontFamily: 'ui-monospace, "SF Mono", Roboto Mono, monospace', fontSize: 9, color: 'rgba(0,0,0,0.4)',
        textTransform: 'uppercase', letterSpacing: 0.5,
      }}>{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Product card (matches GS2_product_card_qucik_add — 343 wide)
// ─────────────────────────────────────────────────────────────
function ProductCard({ name, color, price, size, qty, label, tint, badge }) {
  return (
    <div style={{
      width: 343, background: T.white,
      display: 'flex', gap: 16,
      padding: 0,
    }}>
      <ProductImg label={label} tint={tint} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', paddingRight: 0 }}>
        {/* product name */}
        <div style={{
          fontFamily: FONT_BODY, fontSize: 14, color: T.ink, lineHeight: 1.4,
          fontWeight: 400,
        }}>{name}</div>
        <div style={{
          fontFamily: FONT_BODY, fontSize: 12, color: T.mute, marginTop: 4, lineHeight: 1.4,
        }}>{color}</div>
        <div style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, color: T.inkText,
          marginTop: 8,
        }}>AED {price}</div>

        {badge && (
          <div style={{
            display: 'inline-flex', alignSelf: 'flex-start', marginTop: 10,
            padding: '2px 8px', background: T.green, color: T.white,
            fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: 0.2,
            borderRadius: 2,
          }}>{badge}</div>
        )}

        {/* size dropdown row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 16 }}>
          <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: T.ink2 }}>Size {size}</span>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
            <path d="M1 1l6 6 6-6" stroke={T.inkText} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* qty + trash row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 12,
        }}>
          <QtyStepper qty={qty} />
          <button aria-label="Remove" style={{
            width: 32, height: 32, borderRadius: 999, border: 'none',
            background: T.panel, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4l.6 8.4A1.5 1.5 0 007.1 14h1.8a1.5 1.5 0 001.5-1.6L11 4" stroke="#000" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function QtyStepper({ qty }) {
  const btn = (sign) => (
    <button style={{
      width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer',
      fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16, color: T.inkText,
    }}>{sign}</button>
  );
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      border: `1px solid ${T.hair}`, borderRadius: 4, height: 28,
    }}>
      {btn('−')}
      <div style={{
        minWidth: 24, textAlign: 'center',
        fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13, color: T.inkText,
      }}>{qty}</div>
      {btn('+')}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Subtotal row & list
// ─────────────────────────────────────────────────────────────
function SummaryRow({ label, value, info, bold, strike, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '11px 0',
      borderBottom: `1px solid ${T.hair}`,
      fontFamily: FONT_BODY,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          fontSize: bold ? 16 : 14,
          fontFamily: bold ? FONT_DISPLAY : FONT_BODY,
          fontWeight: bold ? 700 : 400,
          color: color || T.ink,
        }}>{label}</span>
        {info && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 16, height: 16, borderRadius: 999, border: `1.2px solid ${T.mute}`,
            fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700, color: T.mute,
          }}>i</span>
        )}
      </div>
      <span style={{
        fontSize: bold ? 16 : 14,
        fontFamily: bold ? FONT_DISPLAY : FONT_BODY,
        fontWeight: bold ? 700 : 400,
        color: color || T.ink,
        fontVariantNumeric: 'tabular-nums',
        textDecoration: strike ? 'line-through' : 'none',
      }}>{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bag content (scrollable)
// ─────────────────────────────────────────────────────────────
function BagContent({ scrollRef, onScroll, bottomPad, inlineModule }) {
  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      style={{
        position: 'absolute',
        top: HEADER_H,
        left: 0, right: 0, bottom: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        background: T.white,
        scrollbarWidth: 'none',
      }}
    >
      {/* Info banner (matches Figma top banner: 343×44 gray pill with info icon) */}
      <div style={{ padding: '24px 16px 0' }}>
        <div style={{
          height: 44, borderRadius: 6, background: T.panel,
          display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8.5" stroke={T.ink2} strokeWidth="1.4"/>
            <circle cx="10" cy="6.5" r="0.9" fill={T.ink2}/>
            <path d="M10 9.5v5" stroke={T.ink2} strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.ink2 }}>
            Order before 6pm for next-day delivery
          </span>
        </div>
      </div>

      {/* product cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '24px 16px 0' }}>
        <ProductCard
          name="Lightweight Performance Tee"
          color="Sand / Crew Neck"
          price="139"
          size="M" qty={1}
          label="Tee" tint="#EBE6DC"
        />
        <ProductCard
          name="Element Training Shorts 5″"
          color="Stone / With Liner"
          price="189"
          size="S" qty={1}
          label="Shorts" tint="#DCDED4"
          badge="Free returns"
        />
        <ProductCard
          name="Crew Sock — 3 Pack"
          color="Mixed Neutrals"
          price="79"
          size="L" qty={2}
          label="Socks" tint="#E4DCD4"
        />
      </div>

      {/* Subtotal section */}
      <div style={{ padding: '24px 16px 0' }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16, color: T.inkText,
          marginBottom: 8,
        }}>Order summary</div>
        <SummaryRow label="Subtotal (4 items)" value="AED 298" />
        <SummaryRow label="Promo (SAVE50)" value="−AED 50" color={T.green} />
        <SummaryRow label="Delivery" value="Free" info />
        <SummaryRow label="Total" value="AED 248" bold />
      </div>

      {/* Checkout Module – Inline (assigned position: directly after Order summary) */}
      {inlineModule && (
        <div style={{ paddingTop: 24 }}>
          {inlineModule}
        </div>
      )}

      {/* Payment methods accepted (matches Figma 'tenders' card 343×172, hair border) */}
      <div style={{ padding: '24px 16px 0' }}>
        <div style={{
          border: `1px solid ${T.hair2}`, background: T.white,
          padding: '16px 16px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{
            fontFamily: FONT_BODY, fontSize: 13, color: T.ink2, fontWeight: 700,
          }}>We accept</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['VISA','MC','AMEX','APAY','GPAY','TABBY'].map(n => (
              <div key={n} style={{
                width: 44, height: 28, borderRadius: 4, background: T.panel,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT_DISPLAY, fontSize: 9, fontWeight: 700, color: T.ink2,
                letterSpacing: 0.4,
              }}>{n}</div>
            ))}
          </div>
          <div style={{
            fontFamily: FONT_BODY, fontSize: 12, color: T.mute, marginTop: 4, lineHeight: 1.5,
          }}>All transactions are encrypted and secure.</div>
        </div>
      </div>

      {/* Installments / pay later card (matches Figma installments block: bg #f5f5f5, 343×120) */}
      <div style={{ padding: '24px 16px 0' }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16, color: T.inkText,
          marginBottom: 16,
        }}>Split the cost</div>
        <div style={{
          background: T.panel, borderRadius: 4, padding: 12,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <InstallmentRow tint={T.greenLite} title="Pay in 4 — interest-free" subtitle="AED 62 / month" />
          <InstallmentRow tint="#FFD3B6" title="Pay later in 14 days" subtitle="No fees, no interest" />
        </div>
      </div>

      {/* Delivery info section (matches Figma 343×350 with light 241,241,241 inner) */}
      <div style={{ padding: '24px 16px 0' }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16, color: T.inkText,
          marginBottom: 12,
        }}>Delivery & returns</div>
        <div style={{
          background: T.panel2, padding: 24,
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          {[
            { t: 'Free Express Shipping', s: '1–3 business days. Free on orders over AED 200.' },
            { t: 'Free returns', s: '30 days from delivery. Easy in-store or postal returns.' },
            { t: 'Carbon-neutral', s: 'Every shipment is carbon-offset at no extra cost.' },
          ].map(r => (
            <div key={r.t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 999, background: T.white,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M3 8.5l3 3L13 4.5" stroke={T.green} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14, color: T.ink }}>{r.t}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: T.mute, marginTop: 2, lineHeight: 1.5 }}>{r.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* You might also like */}
      <div style={{ padding: '32px 0 0' }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16, color: T.inkText,
          padding: '0 16px', marginBottom: 12,
        }}>You might also like</div>
        <div style={{ display: 'flex', gap: 12, padding: '0 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {[
            { l: 'Pants',  t: '#E0DED7', n: 'Performance Joggers', p: '249' },
            { l: 'Hoodie', t: '#E6E0D6', n: 'Element Pullover', p: '299' },
            { l: 'Cap',    t: '#DCDDD3', n: 'Logo Cap', p: '69' },
            { l: 'Tank',   t: '#E8E2D6', n: 'Stringer Vest', p: '99' },
          ].map(p => (
            <div key={p.l} style={{ flexShrink: 0, width: 150 }}>
              <div style={{ width: 150, height: 180, background: p.t, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
                  padding: 8,
                  fontFamily: 'ui-monospace, monospace', fontSize: 9, color: 'rgba(0,0,0,0.35)',
                  textTransform: 'uppercase', letterSpacing: 0.5,
                }}>{p.l}</div>
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.ink, marginTop: 8 }}>{p.n}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13, color: T.inkText, marginTop: 2 }}>AED {p.p}</div>
            </div>
          ))}
        </div>
      </div>

      {/* bottom spacer so content can scroll above sticky module + nav */}
      <div style={{ height: bottomPad }} />
    </div>
  );
}

function InstallmentRow({ tint, title, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 34, height: 24, borderRadius: 4, background: tint,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT_DISPLAY, fontSize: 9, fontWeight: 700, color: '#292929',
        letterSpacing: 0.3,
      }}>PAY</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: T.ink, fontWeight: 500 }}>{title}</div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: T.mute, marginTop: 2 }}>{subtitle}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path d="M5 2l6 6-6 6" stroke={T.inkText} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Inline Checkout Module — same anatomy as the sticky version
//   (Shipping Confirmation Bar, Order Total Row, Secure Checkout
//   CTA) but flows with the page rather than docking. Visually
//   identical to the sticky module per the Figma spec.
// ─────────────────────────────────────────────────────────────
const InlineCheckoutModule = React.forwardRef(function InlineCheckoutModule(
  { showShippingBar, ctaStyle, accent, vatLabel, totalLabel, totalValue },
  ref
) {
  let ctaBg = accent, ctaFg = T.white, ctaBorder = 'none';
  if (ctaStyle === 'inverse') { ctaBg = T.inkText; ctaFg = T.white; }
  if (ctaStyle === 'outline') { ctaBg = T.white; ctaFg = T.inkText; ctaBorder = `1.5px solid ${T.inkText}`; }

  return (
    <div
      ref={ref}
      data-checkout-inline
      style={{ width: 375, background: T.white }}
    >
      {/* Shipping confirmation bar — 72×375 */}
      {showShippingBar && (
        <div style={{
          width: 375, height: 72,
          background: T.panel,
          borderTop: `1px solid ${T.hair2}`,
          borderBottom: `1px solid ${T.hair2}`,
          padding: '16px 16px',
          boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center',
        }}>
          <div style={{ width: 343, height: 4, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: T.inactive }} />
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%',
              background: `linear-gradient(90deg, ${T.blue} 0%, ${T.blueLite} 100%)`,
            }} />
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: 343, justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="7.5" fill={T.green}/>
              <path d="M4.5 8.2l2.2 2.2L11.6 5.5" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{
              fontFamily: FONT_BODY, fontSize: 14, color: T.ink2, lineHeight: 1.4,
            }}>You’ve qualified for Free Express Shipping</span>
          </div>
        </div>
      )}

      {/* Order total row */}
      <div style={{
        height: 22, marginTop: 16,
        padding: '0 16px',
        display: 'flex', alignItems: 'baseline', gap: 4,
        boxSizing: 'border-box', width: 375,
      }}>
        <span style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, lineHeight: 1.2, color: T.inkText,
        }}>{totalLabel}</span>
        <span style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, lineHeight: 1.2, color: T.mute,
        }}>·</span>
        <span style={{
          fontFamily: FONT_BODY, fontSize: 12, color: T.mute, alignSelf: 'baseline', marginLeft: 2,
        }}>{vatLabel}</span>
        <span style={{ flex: 1 }}/>
        <span style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, lineHeight: 1.2, color: T.inkText,
          fontVariantNumeric: 'tabular-nums',
        }}>{totalValue}</span>
      </div>

      {/* CTA — 343×44, pill */}
      <div style={{
        marginTop: 16, padding: '0 16px 16px', width: 375, boxSizing: 'border-box',
      }}>
        <button style={{
          width: 343, height: 44, borderRadius: 100,
          background: ctaBg, color: ctaFg,
          border: ctaBorder === 'none' ? 'none' : ctaBorder,
          padding: '12px 32px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, lineHeight: 1.2,
          letterSpacing: 0.2,
          boxShadow: ctaStyle === 'outline' ? 'none' : '0 1px 2px rgba(0,0,0,0.06)',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="4" y="9" width="12" height="8" rx="1.5" stroke={ctaFg} strokeWidth="1.4"/>
            <path d="M6.5 9V6.5a3.5 3.5 0 017 0V9" stroke={ctaFg} strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Checkout securely
        </button>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────
// Sticky Checkout Module — matches Figma 375×186
//   • Shipping confirmation bar: 72px, bg #F5F5F5, border #E7E7E7
//       - 4px progress (blue gradient on inactive #D9D9D9), 343 wide
//       - row: green tick + Roboto 14 "You've qualified for Free Express Shipping"
//   • Order Total row at top:88, 22px tall
//       - "Total" / "VAT inclusive" / "AED 248" — Montserrat Bold 18
//   • CTA at top:126, 343×44, pill (radius 100), bg blue (0,125,181)
//       - Montserrat Bold 14, white, lock icon left
// ─────────────────────────────────────────────────────────────
function CheckoutModule({ visible, behaviour, showShippingBar, ctaStyle, accent, vatLabel, totalLabel, totalValue }) {
  const hidden = !visible;

  let ctaBg = accent, ctaFg = T.white, ctaBorder = 'none';
  if (ctaStyle === 'inverse') { ctaBg = T.inkText; ctaFg = T.white; }
  if (ctaStyle === 'outline') { ctaBg = T.white; ctaFg = T.inkText; ctaBorder = `1.5px solid ${T.inkText}`; }

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0,
      bottom: NAV_H,
      zIndex: 50,
      width: 375,
      background: T.white,
      transform: hidden ? 'translateY(calc(100% + 12px))' : 'translateY(0)',
      transition: 'transform 460ms cubic-bezier(0.22, 1, 0.36, 1)',
      willChange: 'transform',
      boxShadow: '0 -8px 24px rgba(0,0,0,0.06), 0 -1px 0 rgba(0,0,0,0.04)',
    }}>
      {/* Shipping confirmation bar — 72×375 */}
      {showShippingBar && (
        <div style={{
          width: 375, height: 72,
          background: T.panel,
          borderTop: `1px solid ${T.hair2}`,
          borderBottom: `1px solid ${T.hair2}`,
          padding: '16px 16px',
          boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center',
          position: 'relative',
        }}>
          {/* progress 343×4 */}
          <div style={{ width: 343, height: 4, position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: T.inactive,
            }} />
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%',
              background: `linear-gradient(90deg, ${T.blue} 0%, ${T.blueLite} 100%)`,
            }} />
          </div>
          {/* row: tick + text */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: 343, justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="7.5" fill={T.green}/>
              <path d="M4.5 8.2l2.2 2.2L11.6 5.5" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{
              fontFamily: FONT_BODY, fontSize: 14, color: T.ink2, lineHeight: 1.4,
            }}>You’ve qualified for Free Express Shipping</span>
          </div>
        </div>
      )}

      {/* Order total row — 22px tall, padding 16, gap 4, baseline */}
      <div style={{
        height: 22, marginTop: showShippingBar ? 16 : 16,
        padding: '0 16px',
        display: 'flex', alignItems: 'baseline', gap: 4,
        boxSizing: 'border-box', width: 375,
      }}>
        <span style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, lineHeight: 1.2, color: T.inkText,
        }}>{totalLabel}</span>
        <span style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, lineHeight: 1.2, color: T.mute,
        }}>·</span>
        <span style={{
          fontFamily: FONT_BODY, fontSize: 12, color: T.mute, alignSelf: 'baseline',
          marginLeft: 2,
        }}>{vatLabel}</span>
        <span style={{ flex: 1 }}/>
        <span style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, lineHeight: 1.2, color: T.inkText,
          fontVariantNumeric: 'tabular-nums',
        }}>{totalValue}</span>
      </div>

      {/* CTA — 343×44, pill */}
      <div style={{
        marginTop: 16, padding: '0 16px 16px', width: 375, boxSizing: 'border-box',
      }}>
        <button style={{
          width: 343, height: 44, borderRadius: 100,
          background: ctaBg, color: ctaFg,
          border: ctaBorder === 'none' ? 'none' : ctaBorder,
          padding: '12px 32px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, lineHeight: 1.2,
          letterSpacing: 0.2,
          boxShadow: ctaStyle === 'outline' ? 'none' : '0 1px 2px rgba(0,0,0,0.06)',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="4" y="9" width="12" height="8" rx="1.5" stroke={ctaFg} strokeWidth="1.4"/>
            <path d="M6.5 9V6.5a3.5 3.5 0 017 0V9" stroke={ctaFg} strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Checkout securely
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom navigation — matches Figma 82×375 (48 tabs + 34 home indicator)
// ─────────────────────────────────────────────────────────────
function BottomNav({ activeIdx = 2, bagCount = 4 }) {
  const tabs = [
    { name: 'home',     icon: <HomeIcon/> },
    { name: 'menu',     icon: <MenuIcon/> },
    { name: 'bag',      icon: <BagIcon count={bagCount}/> },
    { name: 'wishlist', icon: <HeartIcon/> },
    { name: 'account',  icon: <UserIcon/> },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      width: 375, height: NAV_H, zIndex: 60,
      background: T.white,
      borderTop: `1px solid ${T.hair3}`,
    }}>
      {/* 48px tab row */}
      <div style={{
        height: 48, padding: '0 16px',
        display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center',
      }}>
        {tabs.map((t, i) => (
          <div key={t.name} style={{
            width: 67, height: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            color: i === activeIdx ? T.inkText : T.ink2,
          }}>
            {t.icon}
            {i === activeIdx && (
              <div style={{
                position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
                width: 4, height: 4, borderRadius: 999, background: T.inkText,
              }} />
            )}
          </div>
        ))}
      </div>
      {/* 34px home indicator area */}
      <div style={{ height: SAFE_BOTTOM, position: 'relative' }}>
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          width: 134, height: 5, borderRadius: 999, background: '#000',
        }}/>
      </div>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-7H9v7H5a1 1 0 01-1-1v-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function BagIcon({ count }) {
  return (
    <div style={{ position: 'relative' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 8h14l-1.2 12.2A2 2 0 0115.8 22H8.2a2 2 0 01-2-1.8L5 8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M8 8V6a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      {count > 0 && (
        <div style={{
          position: 'absolute', top: -4, right: -6, minWidth: 16, height: 16, borderRadius: 999,
          background: T.blue, color: '#fff', fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 4px', border: `2px solid ${T.white}`,
        }}>{count}</div>
      )}
    </div>
  );
}
function HeartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4.5 20c1.4-3.6 4.2-5.5 7.5-5.5s6.1 1.9 7.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Device bezel
// ─────────────────────────────────────────────────────────────
function DeviceBezel({ children }) {
  return (
    <div style={{
      width: VIEWPORT_W + 16, height: VIEWPORT_H + 16,
      borderRadius: 48, padding: 8, background: '#111',
      boxShadow: '0 30px 80px rgba(14,14,12,0.18), 0 0 0 1px rgba(0,0,0,0.4)',
      position: 'relative',
    }}>
      <div style={{
        width: VIEWPORT_W, height: VIEWPORT_H, borderRadius: 40,
        overflow: 'hidden', position: 'relative', background: T.white,
      }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Live-state caption (next to device)
// ─────────────────────────────────────────────────────────────
function Caption({ visible, behaviour, scrollY, dir, inlineInView }) {
  const row = (k, v) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '3px 0' }}>
      <span style={{ color: '#A8A8A0' }}>{k}</span>
      <span style={{ color: '#111', fontVariantNumeric: 'tabular-nums' }}>{v}</span>
    </div>
  );
  return (
    <div style={{
      fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 11, color: '#6E6E68', lineHeight: 1.6,
      letterSpacing: 0.3, minWidth: 220,
    }}>
      <div style={{
        color: '#111', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
        marginBottom: 10, fontSize: 10,
      }}>Live state</div>
      {row('behaviour', behaviour)}
      {row('sticky.visible', String(visible))}
      {row('scroll.y', `${Math.round(scrollY)}px`)}
      {row('scroll.dir', dir || '—')}
      {row('inline.inView', String(!!inlineInView))}
      <div style={{ height: 10 }}/>
      <div style={{ color: '#111', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6, fontSize: 10 }}>Safe area</div>
      {row('safe.top', `${SAFE_TOP}px`)}
      {row('safe.bottom', `${SAFE_BOTTOM}px`)}
      {row('nav.height', `${NAV_H}px`)}
      {row('module.h', `${CHECKOUT_MODULE_H}px`)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "behaviour": "inline-aware",
  "showShippingBar": true,
  "ctaStyle": "filled",
  "showInlineModule": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  const scrollRef = useRef(null);
  const inlineRef = useRef(null);
  const lastY = useRef(0);
  const accUp = useRef(0);
  const accDown = useRef(0);
  const [visible, setVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [dir, setDir] = useState(null);
  const [inlineInView, setInlineInView] = useState(false);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const y = el.scrollTop;
    const dy = y - lastY.current;

    if (dy > 0) { accUp.current = 0; accDown.current += dy; setDir('down'); }
    else if (dy < 0) { accDown.current = 0; accUp.current += -dy; setDir('up'); }

    if (tweaks.behaviour === 'hide-on-scroll') {
      if (accDown.current > 24 && y > 60) setVisible(false);
      else if (accUp.current > 8 || y < 20) setVisible(true);
    } else {
      // 'inline-aware' and 'always-visible' both keep the
      // scroll-direction state at visible; final gating happens below.
      setVisible(true);
    }
    setScrollY(y);
    lastY.current = y;
  }, [tweaks.behaviour]);

  useEffect(() => {
    if (tweaks.behaviour !== 'hide-on-scroll') setVisible(true);
  }, [tweaks.behaviour]);

  // Observe the inline module. Per spec, the sticky default behaviour
  // is to appear only while the inline module is not in the viewport.
  useEffect(() => {
    const root = scrollRef.current;
    const target = inlineRef.current;
    if (!root || !target || !tweaks.showInlineModule) {
      setInlineInView(false);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => setInlineInView(entries[0].isIntersecting),
      {
        root,
        // No rootMargin: any visible pixel of the inline module hides the
        // sticky immediately. Prevents the brief both-visible flicker that
        // an inset margin would create on the entry edge. The 460ms slide
        // animation gives the handoff its smoothness.
        threshold: 0,
      }
    );
    io.observe(target);
    return () => io.disconnect();
  }, [tweaks.showInlineModule, tweaks.showShippingBar]);

  // Final visibility. Invariant: only one checkout module visible at a time —
  // if the inline module is on screen, the sticky is always hidden, regardless
  // of behaviour mode.
  const inlineBlocking = tweaks.showInlineModule && inlineInView;
  let stickyVisible;
  if (inlineBlocking) {
    stickyVisible = false;
  } else if (tweaks.behaviour === 'hide-on-scroll') {
    stickyVisible = visible;
  } else {
    // 'inline-aware' (default per spec)
    stickyVisible = true;
  }

  // bottom spacer = module height + nav height + comfort
  const moduleH = (tweaks.showShippingBar ? 72 : 0) + 22 + 16 + 44 + 16 + 16;
  const bottomPad = moduleH + NAV_H + 32;

  return (
    <>
      <div style={{
        minHeight: '100vh', background: '#F1F0EC',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 56,
        padding: 40, fontFamily: FONT_BODY,
      }}>
        <Caption visible={stickyVisible} behaviour={tweaks.behaviour} scrollY={scrollY} dir={dir} inlineInView={inlineInView && tweaks.showInlineModule}/>
        <DeviceBezel>
          <StatusBar />
          <Header />
          <BagContent
            scrollRef={scrollRef}
            onScroll={onScroll}
            bottomPad={bottomPad}
            inlineModule={tweaks.showInlineModule ? (
              <InlineCheckoutModule
                ref={inlineRef}
                showShippingBar={tweaks.showShippingBar}
                ctaStyle={tweaks.ctaStyle}
                accent={T.blue}
                totalLabel="Total"
                vatLabel="VAT inclusive"
                totalValue="AED 248"
              />
            ) : null}
          />
          <CheckoutModule
            visible={stickyVisible}
            behaviour={tweaks.behaviour}
            showShippingBar={tweaks.showShippingBar}
            ctaStyle={tweaks.ctaStyle}
            accent={T.blue}
            totalLabel="Total"
            vatLabel="VAT inclusive"
            totalValue="AED 248"
          />
          <BottomNav activeIdx={2} bagCount={4}/>
        </DeviceBezel>
        <div style={{ width: 220 }}/>
      </div>

      <window.TweaksPanel>
        <window.TweakSection label="Inline checkout module">
          <window.TweakToggle
            label="Show inline module"
            value={tweaks.showInlineModule}
            onChange={v => setTweak('showInlineModule', v)}
          />
        </window.TweakSection>
        <window.TweakSection label="Sticky behaviour">
          <window.TweakRadio
            label="Show / hide"
            value={tweaks.behaviour}
            onChange={v => setTweak('behaviour', v)}
            options={[
              { value: 'inline-aware', label: 'Default' },
              { value: 'hide-on-scroll', label: 'Hide on scroll' },
            ]}
          />
          <window.TweakToggle
            label="Shipping bar"
            value={tweaks.showShippingBar}
            onChange={v => setTweak('showShippingBar', v)}
          />
        </window.TweakSection>
        <window.TweakSection label="CTA style">
          <window.TweakRadio
            label="Variant"
            value={tweaks.ctaStyle}
            onChange={v => setTweak('ctaStyle', v)}
            options={[
              { value: 'filled', label: 'Filled' },
              { value: 'inverse', label: 'Inverse' },
              { value: 'outline', label: 'Outline' },
            ]}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
