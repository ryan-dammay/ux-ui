// Homepage screen — greeting header, search, category tabs, promo banner, fragrance hero banner.
const { useRef: useRefHome } = React;

function HomeHeader({ store }) {
  const cats = ["All", "Women", "Men", "Kids", "Home", "Beauty"];
  const active = "Beauty";
  return (
    <div style={{ padding: "8px 20px 0", background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, letterSpacing: -0.6, color: "#000" }}>Good morning</h1>
        <Icons.Heart size={24} sw={1.6} style={{ color: "#000" }} />
      </div>
      {/* search */}
      <div style={{
        marginTop: 16, height: 48, display: "flex", alignItems: "center", gap: 10,
        border: "1px solid #cbcbcb", borderRadius: 6, padding: "0 14px", color: "#8a8a8a",
      }}>
        <Icons.Search size={20} sw={1.7} />
        <span style={{ fontSize: 15, color: "#8a8a8a" }}>Search {store}</span>
      </div>
      {/* category tabs */}
      <div style={{ display: "flex", gap: 22, marginTop: 14, overflowX: "auto", paddingBottom: 2 }} className="no-scrollbar">
        {cats.map(c => (
          <span key={c} style={{
            fontSize: 17, whiteSpace: "nowrap", paddingBottom: 8,
            fontWeight: c === active ? 600 : 400,
            color: c === active ? "#000" : "#9a9a9a",
            borderBottom: c === active ? "2px solid #000" : "2px solid transparent",
          }}>{c}</span>
        ))}
      </div>
    </div>
  );
}

function PromoBanner({ code }) {
  return (
    <div style={{
      height: 48, background: "#000", color: "#fff", display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: 13.5, letterSpacing: 0.1,
    }}>
      <span>15% off your 1st order, use code: <strong style={{ fontWeight: 700 }}>{code}</strong>. </span>
      <span style={{ textDecoration: "underline", marginLeft: 5 }}>Shop now</span>
    </div>
  );
}

function SoloBanner({ overline, title, body, cta, onTap, tint, accent }) {
  return (
    <div onClick={onTap} className={onTap ? "ff-tap" : ""} style={{ cursor: onTap ? "pointer" : "default", padding: "16px 0 0", WebkitTapHighlightColor: "transparent" }}>
      <div style={{ position: "relative", width: "100%", paddingTop: "62%", overflow: "hidden" }}>
        <BottlePlaceholder tint={tint} accent={accent} big />
        {overline && (
          <span style={{ position: "absolute", top: 16, left: 18, fontSize: 11, fontWeight: 600, letterSpacing: 1.6, color: "#7a7468" }}>{overline}</span>
        )}
      </div>
      <div style={{ padding: "16px 20px 0" }}>
        <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 38, lineHeight: 1, letterSpacing: 0.2, color: "#000" }}>{title}</h2>
        <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.5, color: "#3a3a3a", maxWidth: 320 }}>{body}</p>
        <span style={{ display: "inline-block", marginTop: 14, fontSize: 15, fontWeight: 600, color: "#000", borderBottom: "1.5px solid #000", paddingBottom: 2 }}>{cta}</span>
      </div>
    </div>
  );
}

function CategoryTiles({ onOpenCategory }) {
  const cats = [
    { name: "Fragrance 1", tint: "#ece4d6", accent: "#b9a888" },
    { name: "Fragrance 2", tint: "#e7e9ea", accent: "#9fb0b6" },
    { name: "Fragrance 3", tint: "#ede7e2", accent: "#c2a98f" },
    { name: "Fragrance 4", tint: "#e9ece9", accent: "#9fb6a4" },
  ];
  return (
    <div style={{ padding: "20px 0 4px" }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: "#000", padding: "0 20px 12px" }}>Shop by category</div>
      <div className="no-scrollbar" style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 20px 4px" }}>
        {cats.map(c => (
          <button key={c.name} onClick={() => onOpenCategory && onOpenCategory(c.name)} style={{
            flex: "0 0 124px", border: "none", background: "none", padding: 0, cursor: "pointer",
            WebkitTapHighlightColor: "transparent", textAlign: "left",
          }}>
            <div style={{ position: "relative", width: "100%", paddingTop: "118%", borderRadius: 4, overflow: "hidden" }}>
              <BottlePlaceholder tint={c.tint} accent={c.accent} />
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: "#000", marginTop: 8 }}>{c.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Homepage({ store, onOpenFragrance, onOpenCategory }) {
  const F = window.FRAME;
  return (
    <div style={{
      position: "absolute", inset: 0, overflowY: "auto", background: "#fff",
      paddingBottom: F.TAB_BAR_H + F.HOME_H + 8,
    }} className="screen-scroll">
      <HomeHeader store={store} />
      <div style={{ marginTop: 14 }}>
        <PromoBanner code="WELCOME15" />
      </div>
      <SoloBanner
        overline="THE FRAGRANCE EDIT"
        title="Find your signature scent"
        body="From fresh citrus to deep oud — discover fragrances chosen for the way you want to feel."
        cta="Shop Fragrance"
        onTap={onOpenFragrance}
        tint="#ece4d6" accent="#b9a888"
      />
      <CategoryTiles onOpenCategory={onOpenCategory} />
      <SoloBanner
        overline="NEW IN BEAUTY"
        title="Niche houses, newly arrived"
        body="Byredo, Le Labo and Maison Francis Kurkdjian — the names everyone's wearing this season."
        cta="Explore New In"
        onTap={onOpenFragrance}
        tint="#e7e9ea" accent="#9fb0b6"
      />
      <div style={{ height: 8 }} />
    </div>
  );
}

Object.assign(window, { Homepage });
