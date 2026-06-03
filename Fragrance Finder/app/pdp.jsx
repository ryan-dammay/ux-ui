// Product Detail Page — fragrance, adapted from the Figma Beauty PDP.
const { useState: useStatePdp, useRef: useRefPdp, useEffect: useEffectPdp } = React;

function amberPoints(price) { return Math.round(price * 0.31); }

// ── sticky header ──
function PDPHeader({ product, scrolled, onBack }) {
  return (
    <div style={{
      flex: "0 0 auto", height: 48, background: "#fff", display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 6px", position: "relative", zIndex: 20,
      boxShadow: scrolled ? "0 4px 16px rgba(0,0,0,0.08)" : "none", transition: "box-shadow 0.25s ease",
    }}>
      <button onClick={onBack} style={iconBtn}><Icons.ChevronLeft size={24} /></button>
      <span style={{
        position: "absolute", left: 52, right: 52, textAlign: "center", pointerEvents: "none",
        fontSize: 13, fontWeight: 700, letterSpacing: 0.4, color: "#000", whiteSpace: "nowrap",
        overflow: "hidden", textOverflow: "ellipsis",
        opacity: scrolled ? 1 : 0, transform: scrolled ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}>{product.brand}</span>
      <div style={{ display: "flex" }}>
        <button style={iconBtn}><Icons.Search size={21} sw={1.7} /></button>
        <button style={iconBtn}><Icons.Share size={20} sw={1.7} /></button>
      </div>
    </div>
  );
}
const iconBtn = { width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#000", WebkitTapHighlightColor: "transparent" };

// ── gallery ──
function Gallery({ product }) {
  const [idx, setIdx] = useStatePdp(0);
  const tint = product.swatches ? product.swatches[0] : "#efe9dd";
  const accent = product.swatches ? product.swatches[product.swatches.length - 1] : "#c9bfa8";
  return (
    <div style={{ position: "relative", width: "100%", paddingTop: "118%", background: "#f6f3ee", overflow: "hidden" }}>
      <BottlePlaceholder tint={tint} accent={accent} big />
      {/* right-side actions */}
      <div style={{ position: "absolute", right: 14, bottom: 56, display: "flex", flexDirection: "column", gap: 12 }}>
        <GalleryHeart />
      </div>
      {/* dots */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, display: "flex", justifyContent: "center", gap: 6 }}>
        {[0, 1, 2, 3, 4].map(i => (
          <span key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 7 : 6, height: i === idx ? 7 : 6, borderRadius: 99, background: i === idx ? "#000" : "rgba(17,17,17,0.25)", cursor: "pointer" }} />
        ))}
      </div>
    </div>
  );
}
function GalleryIcon({ children }) {
  return <div style={{ width: 40, height: 40, borderRadius: 99, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>{children}</div>;
}
function GalleryHeart() {
  const [on, setOn] = useStatePdp(false);
  return (
    <button onClick={() => setOn(v => !v)} style={{ width: 40, height: 40, borderRadius: 99, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", color: on ? "#c4574a" : "#000", WebkitTapHighlightColor: "transparent" }}>
      <Icons.Heart size={20} sw={1.7} fill={on ? "#c4574a" : "none"} />
    </button>
  );
}

// ── info block ──
function StarRow({ rating, reviews }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Icons.Star size={15} style={{ color: "#000" }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: "#000" }}>{rating}</span>
        <span style={{ fontSize: 13, color: "#767676" }}>({reviews})</span>
      </div>
    </div>
  );
}

function InfoBlock({ product, size, onOpenDesigner }) {
  return (
    <div style={{ padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <div>
          <button onClick={() => onOpenDesigner && onOpenDesigner(product.brand)} style={{
            display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", padding: 0,
            cursor: "pointer", color: "#000", WebkitTapHighlightColor: "transparent",
          }}>
            <span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3, borderBottom: "1.5px solid #000", paddingBottom: 1 }}>{product.brand}</span>
            <Icons.ChevronRight size={15} sw={2} />
          </button>
          <div style={{ fontSize: 14, color: "#3a3a3a", lineHeight: 1.4, marginTop: 3 }}>{product.name}</div>
        </div>
        <StarRow rating={product.rating} reviews={product.reviews} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        {product.badge && <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "#000" }}>{product.badge === "NEW" ? "NEW" : product.badge}</span>}
        <span style={{ fontSize: 22, fontWeight: 600, color: "#000" }}>AED {size.price.toLocaleString()}</span>
        <span style={{ fontSize: 12, color: "#767676" }}>includes all taxes</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{ width: 38, height: 24, borderRadius: 4, background: "#1b1b1b", color: "#e8b94a", fontSize: 8, fontWeight: 700, letterSpacing: 0.4, display: "flex", alignItems: "center", justifyContent: "center" }}>AMBER</span>
        <span style={{ fontSize: 12, color: "#000" }}>Earn {amberPoints(size.price)} Amber points. <span style={{ textDecoration: "underline" }}>Join Amber</span></span>
      </div>
    </div>
  );
}

// ── size / volume selector ──
function SizeSelector({ product, sizeIdx, setSizeIdx }) {
  const sizes = window.FRAGRANCE_SIZES;
  return (
    <div style={{ padding: "4px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, color: "#000" }}><span style={{ color: "#767676" }}>Concentration:</span> {product.conc}</span>
        {product.stock <= 6 && <span style={{ fontSize: 12, fontWeight: 600, color: "#c4574a" }}>Only {product.stock} left</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 14, color: "#767676" }}>Size:</span>
        <div style={{ display: "flex", gap: 8 }}>
          {sizes.map((s, i) => {
            const on = i === sizeIdx;
            return (
              <button key={s.ml} onClick={() => setSizeIdx(i)} style={{
                minWidth: 54, padding: "9px 12px", borderRadius: 6, cursor: "pointer", fontSize: 13.5,
                fontWeight: on ? 600 : 400, color: on ? "#fff" : "#000",
                background: on ? "#000" : "#fff", border: on ? "1px solid #000" : "1px solid #cbcbcb",
                transition: "all 0.15s ease", WebkitTapHighlightColor: "transparent",
              }}>{s.ml}ml</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── CTAs ──
function CTAs({ onAdd }) {
  return (
    <div style={{ padding: "6px 16px 0", display: "flex", gap: 10 }}>
      <button onClick={onAdd} style={{ flex: 1, height: 52, borderRadius: 8, border: "none", background: "#000", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, WebkitTapHighlightColor: "transparent" }}>
        <Icons.Bag size={19} sw={1.7} /> Add to Bag
      </button>
    </div>
  );
}

// ── payments + delivery ──
function PayDelivery() {
  const I = window.Icons;
  const row = (icon, title, sub) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
      <span style={{ color: "#000", flexShrink: 0 }}>{icon}</span>
      <div style={{ fontSize: 13.5, color: "#000", lineHeight: 1.4 }}>{title}{sub && <span style={{ color: "#767676" }}> · {sub}</span>}</div>
    </div>
  );
  return (
    <div style={{ padding: "14px 16px 4px" }}>
      <div style={{ display: "flex", gap: 10 }}>
        {["tabby", "tamara"].map(n => (
          <div key={n} style={{ flex: 1, border: "1px solid #ececec", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#5b3df5", letterSpacing: 0.2, textTransform: "lowercase" }}>{n}</div>
            <div style={{ fontSize: 11.5, color: "#767676", marginTop: 3, lineHeight: 1.3 }}>4 interest-free payments</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 6, borderTop: "1px solid #f0f0f0" }}>
        {row(<I.Truck size={20} sw={1.6} />, "Same Day Delivery", "Order by 3pm, Dubai")}
        <div style={{ borderTop: "1px solid #f0f0f0" }} />
        {row(<I.Store size={20} sw={1.6} />, "Click & Collect available", "Check store availability")}
      </div>
    </div>
  );
}

// ── accordion ──
function Accordion({ title, meta, children, defaultOpen = false }) {
  const [open, setOpen] = useStatePdp(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid #ececec" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px", background: "none", border: "none", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: "#000" }}>{title}</span>
          {meta}
        </span>
        <span style={{ color: "#000", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.25s ease" }}><Icons.ChevronDown size={20} /></span>
      </button>
      <div style={{ maxHeight: open ? 600 : 0, overflow: "hidden", transition: "max-height 0.35s ease" }}>
        <div style={{ padding: "0 16px 18px", fontSize: 14, lineHeight: 1.6, color: "#3a3a3a" }}>{children}</div>
      </div>
    </div>
  );
}

function NotesPyramid({ p }) {
  const row = (label, val) => (
    <div style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid #f3f3f3" }}>
      <span style={{ flex: "0 0 64px", fontSize: 12, fontWeight: 600, letterSpacing: 0.6, color: "#9a9a9a", textTransform: "uppercase", paddingTop: 1 }}>{label}</span>
      <span style={{ fontSize: 14, color: "#000" }}>{val}</span>
    </div>
  );
  return <div>{row("Top", p.top)}{row("Heart", p.heart)}{row("Base", p.base)}</div>;
}

// ── rewards cards ──
function RewardCard({ icon, title, body, cta }) {
  return (
    <div style={{ border: "1px solid #ececec", borderRadius: 10, padding: "14px 14px", display: "flex", gap: 12, alignItems: "flex-start", background: "#fff" }}>
      <div style={{ flex: "0 0 44px", width: 44, height: 44, borderRadius: 8, background: "#1b1b1b", color: "#e8b94a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#000" }}>{title}</div>
        <div style={{ fontSize: 12.5, color: "#767676", lineHeight: 1.45, marginTop: 3 }}>{body}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#000", textDecoration: "underline", marginTop: 7 }}>{cta}</div>
      </div>
    </div>
  );
}

// ── editorial banner ──
function EditorialBanner() {
  return (
    <div style={{ position: "relative", width: "100%", paddingTop: "62%", background: "linear-gradient(135deg,#6b5847,#2a2018)", overflow: "hidden" }}>
      <BottlePlaceholder tint="#3a2e22" accent="#8a7355" big />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 54, height: 54, borderRadius: 99, background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="20" viewBox="0 0 18 20"><path d="M2 2l14 8-14 8z" fill="#000" /></svg>
        </div>
      </div>
    </div>
  );
}

// ── product carousel ──
function ProductRail({ title, items, onTap }) {
  return (
    <div style={{ padding: "4px 0" }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: "#000", padding: "0 16px 12px" }}>{title}</div>
      <div className="no-scrollbar" style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 16px 6px" }}>
        {items.map((p, i) => (
          <div key={i} style={{ flex: "0 0 150px" }}>
            <ProductCard p={p} index={i} compact onTap={onTap} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── toast ──
function Toast({ show, text }) {
  return (
    <div style={{
      position: "absolute", left: 16, right: 16, bottom: 194, zIndex: 66,
      background: "#000", color: "#fff", borderRadius: 10, padding: "13px 16px",
      fontSize: 14, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      display: "flex", alignItems: "center", gap: 9,
      opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(12px)",
      pointerEvents: "none", transition: "opacity 0.3s ease, transform 0.3s ease",
    }}>
      <Icons.Check size={18} sw={2.2} /> {text}
    </div>
  );
}

// ── PDP screen ──
function PDP({ product, onBack, onOpenProduct, onOpenChat, onOpenDesigner, onHome, fabVariant }) {
  const F = window.FRAME;
  const FabBtn = window.ChatFAB;
  const [scrolled, setScrolled] = useStatePdp(false);
  const [sizeIdx, setSizeIdx] = useStatePdp(1);
  const [bag, setBag] = useStatePdp(0);
  const [toast, setToast] = useStatePdp(false);
  const [ctaVisible, setCtaVisible] = useStatePdp(false);
  const scrollRef = useRefPdp(null);
  const ctaRef = useRefPdp(null);

  // sticky footer shows only while the in-page Add to Bag CTA is off screen
  const checkChrome = (el) => {
    if (!el) return;
    setScrolled(el.scrollTop > 320);
    if (ctaRef.current) {
      const pr = el.getBoundingClientRect();
      const br = ctaRef.current.getBoundingClientRect();
      // the tab bar + sticky bar occlude the bottom of the viewport — the in-page
      // CTA only counts as visible when it sits above that chrome
      const chrome = F.TAB_BAR_H + F.HOME_H + 8;
      setCtaVisible(br.bottom > pr.top + 8 && br.top < pr.bottom - chrome);
    }
  };

  // reset scroll + size when product changes
  useEffectPdp(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setSizeIdx(1); setScrolled(false);
    const id = setTimeout(() => checkChrome(scrollRef.current), 60);
    return () => clearTimeout(id);
  }, [product]);

  if (!product) return null;
  const size = { ml: window.FRAGRANCE_SIZES[sizeIdx].ml, price: Math.round(product.price * window.FRAGRANCE_SIZES[sizeIdx].mult / 5) * 5 };
  const others = window.FRAGRANCES.filter(p => p.name !== product.name);
  const youMay = others.slice(0, 6);
  const recent = others.slice(3, 9);

  const addToBag = () => { setBag(b => b + 1); setToast(true); setTimeout(() => setToast(false), 1900); };

  const footerH = 74;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "#fff" }}>
      <PDPHeader product={product} scrolled={scrolled} onBack={onBack} />
      <div ref={scrollRef} onScroll={(e) => checkChrome(e.target)} className="screen-scroll" style={{ flex: 1, overflowY: "auto", paddingBottom: F.TAB_BAR_H + F.HOME_H + footerH + 12 }}>
        <Gallery product={product} />
        <InfoBlock product={product} size={size} onOpenDesigner={onOpenDesigner} />
        <div style={{ height: 14 }} />
        <SizeSelector product={product} sizeIdx={sizeIdx} setSizeIdx={setSizeIdx} />
        <div style={{ height: 16 }} />
        <div ref={ctaRef}>
          <CTAs onAdd={addToBag} />
        </div>
        <PayDelivery />
        <div style={{ height: 8 }} />
        {/* accordions */}
        <div style={{ borderTop: "1px solid #ececec" }}>
          <Accordion title="Description" defaultOpen>
            {product.story}
          </Accordion>
          <Accordion title="Fragrance Notes">
            <NotesPyramid p={product.pyramid} />
          </Accordion>
          <Accordion title={`About ${product.brand.split(" ").slice(0, 2).join(" ")}`}>
            {product.brand} is celebrated for its craftsmanship and distinctive olfactory signature, blending the finest raw materials into fragrances worn the world over.
          </Accordion>
          <Accordion title="How to wear">
            Spray onto pulse points — wrists, neck and behind the ears — from roughly 15cm away. Avoid rubbing, and layer with a matching body lotion to extend wear.
          </Accordion>
          <Accordion title="Shipping & Returns">
            Free delivery on orders over AED 250. Same-day delivery available in Dubai when you order by 3pm. Returns accepted within 14 days on unopened items.
          </Accordion>
          <Accordion title="Reviews" meta={<span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#767676" }}><Icons.Star size={13} style={{ color: "#000" }} />{product.rating} ({product.reviews})</span>}>
            “{product.story.split(".")[0]}.” — verified buyers rate this {product.rating} out of 5 across {product.reviews} reviews.
          </Accordion>
        </div>
        {/* attribute chips */}
        <div style={{ padding: "16px 16px 6px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 10 }}>View more</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[product.brand, product.family, product.conc, "Fragrance", "Beauty"].map((c, i) => (
              <span key={i} style={{ fontSize: 12.5, padding: "7px 13px", borderRadius: 99, border: "1px solid #cbcbcb", color: "#444" }}>{c}</span>
            ))}
          </div>
        </div>
        {/* rewards */}
        <div style={{ padding: "16px 16px 4px", display: "flex", flexDirection: "column", gap: 12 }}>
          <RewardCard icon="AMBER" title="Join Amber Rewards" body="Your next purchase can earn you points towards exclusive rewards." cta="Join Amber" />
          <RewardCard icon="BB" title="Be a Beauty Member" body="Join our beauty programme — your buys unlock samples and early access." cta="Join Beauty" />
        </div>
        <div style={{ height: 20 }} />
        <EditorialBanner />
        <div style={{ padding: "16px 16px 4px" }}>
          <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 26, color: "#000" }}>The art of layering</h3>
          <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.5, color: "#3a3a3a" }}>Build a scent that's unmistakably yours. Discover how to combine notes for depth that lasts.</p>
          <span style={{ display: "inline-block", marginTop: 10, fontSize: 14, fontWeight: 600, color: "#000", borderBottom: "1.5px solid #000", paddingBottom: 2 }}>Read the edit</span>
        </div>
        <div style={{ height: 24 }} />
        <ProductRail title="You may also like" items={youMay} onTap={onOpenProduct} />
        <div style={{ height: 22 }} />
        <ProductRail title="Recently viewed" items={recent} onTap={onOpenProduct} />
        <div style={{ height: 16 }} />
      </div>

      <Toast show={toast} text="Added to your bag" />

      {/* Fragrance Finder FAB — opens the same (persistent) chat session. Icon-only on PDP. */}
      {onOpenChat && <FabBtn onOpen={onOpenChat} variant="icon" bottom={F.TAB_BAR_H + F.HOME_H + (ctaVisible ? 0 : footerH) + 16} />}

      {/* sticky Add to Bag — sits above the tab bar, shown only when the in-page CTA is off screen */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: F.TAB_BAR_H + F.HOME_H, zIndex: 54,
        background: "#fff", borderTop: "1px solid #ececec",
        transform: ctaVisible ? "translateY(110%)" : "translateY(0)",
        opacity: ctaVisible ? 0 : 1, pointerEvents: ctaVisible ? "none" : "auto",
        transition: "transform 0.32s cubic-bezier(0.32,0.72,0,1), opacity 0.25s ease",
        boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
      }}>
        <div style={{ height: footerH, display: "flex", alignItems: "center", gap: 14, padding: "0 16px" }}>
          <button onClick={addToBag} style={{ flex: 1, height: 50, borderRadius: 8, border: "none", background: "#000", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, WebkitTapHighlightColor: "transparent" }}>
            <Icons.Bag size={19} sw={1.7} /> Add to Bag{bag > 0 ? ` · ${bag}` : ""}
          </button>
        </div>
      </div>

      {/* bottom navigation bar */}
      <TabBar active="home" onSelect={(k) => { if (k === "home" && onHome) onHome(); }} />
    </div>
  );
}

Object.assign(window, { PDP });
