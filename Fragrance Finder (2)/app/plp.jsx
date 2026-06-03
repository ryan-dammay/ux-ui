// Product Listing Page — Beauty › Fragrance. Sticky nav + filter, 2-col grid, scroll states, chat FAB.
const { useState: useStatePLP, useRef: useRefPLP, useEffect: useEffectPLP } = React;

function PLPNavBar({ scrolled, onBack, title }) {
  return (
    <div style={{
      flex: "0 0 auto", height: 52, background: "#fff", display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 6px", position: "relative", zIndex: 20,
      boxShadow: scrolled ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
      transition: "box-shadow 0.25s ease",
    }}>
      <button onClick={onBack} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#000", WebkitTapHighlightColor: "transparent" }}>
        <Icons.ChevronLeft size={24} />
      </button>
      <span style={{
        position: "absolute", left: 0, right: 0, textAlign: "center", pointerEvents: "none",
        fontSize: 17, fontWeight: 600, color: "#000", letterSpacing: 0.2,
        opacity: scrolled ? 1 : 0, transform: scrolled ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", padding: "0 52px",
      }}>{title}</span>
      <div style={{ display: "flex" }}>
        <button style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#000" }}><Icons.Search size={22} sw={1.7} /></button>
        <button style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#000" }}><Icons.Heart size={22} sw={1.7} /></button>
      </div>
    </div>
  );
}

function SubCategoryChips({ items }) {
  const [active, setActive] = useStatePLP(items[0]);
  return (
    <div className="no-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "4px 16px 14px" }}>
      {items.map(c => {
        const on = active === c;
        return (
          <button key={c} onClick={() => setActive(c)} style={{
            flex: "0 0 auto", whiteSpace: "nowrap", fontSize: 13, padding: "8px 15px", borderRadius: 99,
            cursor: "pointer", WebkitTapHighlightColor: "transparent",
            border: on ? "1px solid #000" : "1px solid #cbcbcb",
            background: on ? "#000" : "#fff", color: on ? "#fff" : "#444",
            fontWeight: on ? 600 : 400, transition: "all 0.15s ease",
          }}>{c}</button>
        );
      })}
    </div>
  );
}

function FilterBar() {
  return (
    <div style={{
      borderTop: "1px solid #ececec", borderBottom: "1px solid #ececec", background: "#fff",
      height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px",
    }}>
      <button style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#000", padding: 0, WebkitTapHighlightColor: "transparent" }}>
        <Icons.Filter size={20} />
        <span style={{ fontSize: 15, fontWeight: 500 }}>Filter</span>
        <span style={{ fontSize: 14, color: "#9a9a9a", fontWeight: 400 }}>1,284 items</span>
      </button>
      <button style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#000", padding: 0, WebkitTapHighlightColor: "transparent" }}>
        <span style={{ fontSize: 15 }}>Recommended</span>
        <Icons.ChevronDown size={18} />
      </button>
    </div>
  );
}

// Floating action button for the Fragrance Finder
function ChatFAB({ onOpen, variant = "icon", compact, bottom }) {
  const I = window.Icons;
  const labelMode = variant === "label" && !compact;
  return (
    <button onClick={onOpen} className="ff-fab" style={{
      position: "absolute", right: 16, bottom,
      height: 52, minWidth: 52, borderRadius: 99, background: "#000", color: "#fff",
      border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 9,
      padding: labelMode ? "0 18px 0 16px" : 0, justifyContent: "center",
      boxShadow: "0 6px 20px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.2)",
      zIndex: 50, WebkitTapHighlightColor: "transparent",
      transition: "padding 0.3s cubic-bezier(0.22,1,0.36,1), min-width 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.2s ease",
    }}>
      <span style={{ position: "relative", display: "flex" }}>
        <I.ChatSparkle size={26} color="#fff" />
      </span>
      {labelMode && <span style={{ fontSize: 14.5, fontWeight: 600, whiteSpace: "nowrap", letterSpacing: 0.2 }}>Fragrance Finder</span>}
    </button>
  );
}

function ToTopButton({ show, onClick, bottom }) {
  return (
    <button onClick={onClick} style={{
      position: "absolute", left: "50%", bottom,
      width: 44, height: 44, borderRadius: 99, background: "#fff", border: "1px solid #cbcbcb",
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#000",
      boxShadow: "0 4px 14px rgba(0,0,0,0.12)", zIndex: 50,
      opacity: show ? 1 : 0,
      transform: show ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(12px)",
      pointerEvents: show ? "auto" : "none", transition: "opacity 0.25s ease, transform 0.25s ease",
      WebkitTapHighlightColor: "transparent",
    }}>
      <Icons.ArrowUp size={20} sw={1.9} />
    </button>
  );
}

function PLP({ products, subcategories, onBack, onOpenChat, onOpenProduct, onHome, fabVariant, title = "Fragrance", overline = "BEAUTY" }) {
  const F = window.FRAME;
  const [scrolled, setScrolled] = useStatePLP(false);
  const scrollRef = useRefPLP(null);

  const onScroll = (e) => {
    const t = e.target.scrollTop;
    setScrolled(t > 110);
  };
  const toTop = () => scrollRef.current && scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });

  // FAB sits above the tab bar
  const fabBottom = F.TAB_BAR_H + F.HOME_H + 14;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "#fff" }}>
      <PLPNavBar scrolled={scrolled} onBack={onBack} title={title} />
      <div ref={scrollRef} onScroll={onScroll} className="screen-scroll" style={{
        flex: 1, overflowY: "auto", paddingBottom: F.TAB_BAR_H + F.HOME_H + 8,
      }}>
        {/* plp intro */}
        <div style={{ textAlign: "center", padding: "16px 16px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: "#9a9a9a" }}>{overline}</div>
          <h1 style={{ margin: "6px 0 0", fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 34, letterSpacing: 0.3, color: "#000" }}>{title}</h1>
        </div>
        {/* sticky filter bar */}
        <div style={{ position: "sticky", top: 0, zIndex: 10 }}>
          <FilterBar />
        </div>
        {/* grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 12px", padding: "16px 12px 0" }}>
          {products.map((p, i) => (
            <ProductCard key={i} p={p} index={i} onTap={onOpenProduct} />
          ))}
        </div>
        <div style={{ height: 20 }} />
      </div>
      <ToTopButton show={scrolled} onClick={toTop} bottom={fabBottom} />
      <ChatFAB onOpen={onOpenChat} variant={fabVariant} compact={scrolled} bottom={fabBottom} />
      <TabBar active="home" onSelect={(k) => { if (k === "home" && onHome) onHome(); }} />
    </div>
  );
}

Object.assign(window, { PLP, ChatFAB });
