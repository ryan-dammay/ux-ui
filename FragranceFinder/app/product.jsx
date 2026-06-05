// Cream-wash product placeholder + PLP product card.
const { useState: useStateP } = React;

// Elegant placeholder: warm cream wash with a faint perfume-bottle line motif.
function BottlePlaceholder({ tint = "#efe9dd", accent = "#c9bfa8", style, big = false }) {
  return (
    <div style={{
      position: "absolute", inset: 0, background: tint,
      display: "flex", alignItems: "center", justifyContent: "center", ...style,
    }}>
      <svg width={big ? 92 : 64} height={big ? 138 : 96} viewBox="0 0 64 96" fill="none"
        stroke={accent} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"
        style={{ opacity: 0.85 }}>
        <rect x="26" y="3" width="12" height="9" rx="1.5" />
        <path d="M27 12h10v6h-10z" />
        <path d="M20 19q12 -2 24 0 q6 1.5 6 9 v50 a6 6 0 0 1 -6 6 H20 a6 6 0 0 1 -6 -6 V28 q0 -7.5 6 -9Z" />
        <path d="M14 40h36" strokeOpacity="0.5" />
      </svg>
    </div>
  );
}

function MiniDots({ count = 3, active = 0 }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 12, display: "flex", justifyContent: "center", gap: 5 }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: 99,
          background: i === active ? "rgba(17,17,17,0.85)" : "rgba(17,17,17,0.22)",
        }} />
      ))}
    </div>
  );
}

function HeartButton({ size = 30, filled, onToggle, top = 8, right = 8 }) {
  const I = window.Icons;
  const [on, setOn] = useStateP(!!filled);
  return (
    <button onClick={(e) => { e.stopPropagation(); setOn(v => !v); onToggle && onToggle(!on); }} style={{
      position: "absolute", top, right, width: size, height: size, borderRadius: 99,
      border: "none", background: "transparent", cursor: "pointer", display: "flex",
      alignItems: "center", justifyContent: "center", WebkitTapHighlightColor: "transparent",
      color: on ? "#c4574a" : "#000",
    }}>
      <Icons.Heart size={20} sw={1.7} fill={on ? "#c4574a" : "none"} />
    </button>
  );
}

// PLP product card. `compact` reduces meta for the chat carousel.
function ProductCard({ p, onTap, compact = false, index = 0 }) {
  // Derive the bottle wash from the product's own palette so the card image
  // matches the PDP gallery exactly.
  const tint = p.swatches && p.swatches.length ? p.swatches[0] : "#efe9dd";
  const accent = p.swatches && p.swatches.length ? p.swatches[p.swatches.length - 1] : "#c9bfa8";
  return (
    <div onClick={() => onTap && onTap(p)} className="ff-tap" style={{
      width: "100%", cursor: "pointer", WebkitTapHighlightColor: "transparent",
    }}>
      <div style={{ position: "relative", width: "100%", paddingTop: "128%", borderRadius: 2, overflow: "hidden" }}>
        <BottlePlaceholder tint={tint} accent={accent} />
        {p.badge && (
          <span style={{
            position: "absolute", top: 10, left: 10, background: p.badge === "NEW" ? "#000" : "#fff",
            color: p.badge === "NEW" ? "#fff" : "#000", border: p.badge === "NEW" ? "none" : "1px solid #000",
            fontSize: 9, fontWeight: 600, letterSpacing: 1, padding: "3px 7px", borderRadius: 2,
          }}>{p.badge}</span>
        )}
        <HeartButton />
      </div>
      <div style={{ padding: compact ? "10px 0 0" : "11px 2px 0", display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.6, color: "#000", lineHeight: 1.2 }}>{p.brand}</span>
        <span style={{ fontSize: 13, color: "#3a3a3a", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: 34 }}>{p.name}</span>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#000", marginTop: 1 }}>AED {p.price.toLocaleString()}</span>
        {!compact && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
            {p.swatches && p.swatches.slice(0, 4).map((s, i) => (
              <span key={i} style={{ width: 14, height: 14, borderRadius: 99, background: s, border: "1px solid rgba(0,0,0,0.12)" }} />
            ))}
            <span style={{ display: "flex", alignItems: "center", gap: 3, marginLeft: "auto", color: "#000" }}>
              <Icons.Star size={13} style={{ color: "#000" }} />
              <span style={{ fontSize: 12, color: "#767676" }}>{p.rating}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { BottlePlaceholder, ProductCard, HeartButton, MiniDots });
