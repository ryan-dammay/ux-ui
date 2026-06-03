// Root app — push/pop navigation stack (home → PLP → PDP → designer PLP → …),
// Fragrance Finder FAB + persistent chat sheet, tweaks.
const { useState: useStateApp, useEffect: useEffectApp, useRef: useRefApp } = React;

const CHIP_SETS = {
  "Curated mix": window.QUICK_QUERIES_DEFAULT,
  "Occasion-led": ["A scent for a wedding", "Everyday office wear", "A night-out perfume", "Something for warm weather", "A cosy winter scent"],
  "Budget & gifting": ["An elegant gift under AED 800", "A crowd-pleasing bestseller", "A safe gift for him", "A luxurious treat for her", "Something unique & niche"],
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "fabVariant": "icon",
  "sheetDetent": "full",
  "chipSet": "Curated mix",
  "store": "Maison"
}/*EDITMODE-END*/;

// ── product mixing helpers ──
function hashSeed(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; }
function mixProducts(title) {
  const a = [...window.FRAGRANCES];
  const off = hashSeed(title) % a.length;
  // rotate + light shuffle so each category reads as a distinct mix
  const rotated = a.slice(off).concat(a.slice(0, off));
  return rotated;
}
function designerMix(brand) {
  const all = window.FRAGRANCES;
  const mine = all.filter(p => p.brand === brand);
  const rest = all.filter(p => p.brand !== brand);
  return mine.concat(rest);
}

// ── push-stack layers ──
const PUSH_TRANSITION = "transform 0.42s cubic-bezier(0.32,0.72,0,1), filter 0.42s ease";
function PushLayer({ covered, z, children }) {
  const [inn, setInn] = useStateApp(false);
  useEffectApp(() => { const r = requestAnimationFrame(() => requestAnimationFrame(() => setInn(true))); return () => cancelAnimationFrame(r); }, []);
  const x = !inn ? "100%" : (covered ? "-26%" : "0%");
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: z, transform: `translateX(${x})`,
      transition: PUSH_TRANSITION, filter: covered ? "brightness(0.92)" : "none",
      boxShadow: (inn && !covered) ? "-12px 0 30px rgba(0,0,0,0.12)" : "none",
    }}>{children}</div>
  );
}
function ExitingLayer({ z, children }) {
  const [out, setOut] = useStateApp(false);
  useEffectApp(() => { const r = requestAnimationFrame(() => requestAnimationFrame(() => setOut(true))); return () => cancelAnimationFrame(r); }, []);
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: z, transform: `translateX(${out ? "100%" : "0%"})`,
      transition: PUSH_TRANSITION, boxShadow: "-12px 0 30px rgba(0,0,0,0.12)",
    }}>{children}</div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [stack, setStack] = useStateApp([]);     // entries above home
  const [exiting, setExiting] = useStateApp(null);
  const [chatOpen, setChatOpen] = useStateApp(false);
  const keyRef = useRefApp(1);

  const push = (entry) => setStack(s => [...s, { ...entry, key: keyRef.current++ }]);
  const pop = () => setStack(s => {
    if (!s.length) return s;
    const top = s[s.length - 1];
    setExiting(top);
    setTimeout(() => setExiting(x => (x && x.key === top.key ? null : x)), 460);
    return s.slice(0, -1);
  });
  const goHome = () => setStack(s => {
    if (!s.length) return s;
    const top = s[s.length - 1];
    setExiting(top);
    setTimeout(() => setExiting(x => (x && x.key === top.key ? null : x)), 460);
    return [];
  });

  const openCategory = (title, overline = "BEAUTY") => push({ type: "plp", title, overline, products: mixProducts(title) });
  const openDesigner = (brand) => push({ type: "plp", title: brand, overline: "DESIGNER", products: designerMix(brand) });
  const openProduct = (p) => { setChatOpen(false); push({ type: "pdp", product: p }); };

  useEffectApp(() => {
    if (typeof location !== "undefined" && location.hash === "#finder") {
      openCategory("Fragrance");
      setTimeout(() => setChatOpen(true), 600);
    }
  }, []);

  const quickQueries = CHIP_SETS[t.chipSet] || CHIP_SETS["Curated mix"];

  const renderEntry = (e) => {
    if (e.type === "plp") {
      return (
        <PLP products={e.products} title={e.title} overline={e.overline}
          onBack={pop} onHome={goHome} onOpenChat={() => setChatOpen(true)}
          onOpenProduct={(p) => push({ type: "pdp", product: p })} fabVariant={t.fabVariant} />
      );
    }
    return (
      <PDP product={e.product} onBack={pop}
        onOpenProduct={(p) => push({ type: "pdp", product: p })}
        onOpenChat={() => setChatOpen(true)} onOpenDesigner={openDesigner} onHome={goHome} fabVariant={t.fabVariant} />
    );
  };

  const hasStack = stack.length > 0 || !!exiting;

  return (
    <PhoneFrame>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {/* Home (base) */}
        <div style={{
          position: "absolute", inset: 0,
          transform: hasStack ? "translateX(-26%)" : "translateX(0)",
          filter: hasStack ? "brightness(0.92)" : "none", transition: PUSH_TRANSITION,
        }}>
          <Homepage store={t.store} onOpenFragrance={() => openCategory("Fragrance")} onOpenCategory={openCategory} />
          <TabBar active="home" onSelect={() => {}} />
        </div>

        {/* pushed layers */}
        {stack.map((e, i) => (
          <PushLayer key={e.key} covered={i < stack.length - 1} z={60 + i}>
            {renderEntry(e)}
          </PushLayer>
        ))}
        {/* exiting (popped) layer */}
        {exiting && (
          <ExitingLayer key={"ex" + exiting.key} z={60 + stack.length + 1}>
            {renderEntry(exiting)}
          </ExitingLayer>
        )}
      </div>

      {/* Fragrance Finder sheet — persistent across all screens */}
      <ChatSheet
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        detent={t.sheetDetent}
        quickQueries={quickQueries}
        onOpenProduct={openProduct}
      />

      {/* Tweaks */}
      <TweaksPanel>
        <TweakSection label="Fragrance Finder" />
        <TweakRadio label="FAB style" value={t.fabVariant}
          options={["icon", "label"]} onChange={(v) => setTweak("fabVariant", v)} />
        <TweakRadio label="Sheet height" value={t.sheetDetent}
          options={["full", "half"]} onChange={(v) => setTweak("sheetDetent", v)} />
        <TweakSelect label="Suggestion chips" value={t.chipSet}
          options={Object.keys(CHIP_SETS)} onChange={(v) => setTweak("chipSet", v)} />
        <TweakSection label="Store" />
        <TweakText label="Search name" value={t.store} onChange={(v) => setTweak("store", v)} />
      </TweaksPanel>
    </PhoneFrame>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
