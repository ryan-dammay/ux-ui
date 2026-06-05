// iPhone 13 device frame — notch, status bar, home indicator + the app tab bar.
const { useState, useEffect, useRef } = React;

const SCREEN_W = 390;
const SCREEN_H = 844;
const STATUS_H = 47;   // notch-era status bar
const HOME_H = 34;     // home indicator safe area

// ── Status bar (black glyphs on light) ──
function StatusBar({ time = "9:41" }) {
  const c = "#000";
  return (
    <div style={{
      height: STATUS_H, flex: "0 0 auto", display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 30px 0 34px", boxSizing: "border-box",
      position: "relative", zIndex: 30, userSelect: "none",
    }}>
      <span style={{ fontFamily: "-apple-system,'SF Pro Text',system-ui", fontWeight: 600, fontSize: 16, letterSpacing: 0.2, color: c, paddingTop: 2 }}>{time}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 7, paddingTop: 2 }}>
        <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="7.5" width="3" height="4.5" rx="0.8" fill={c} /><rect x="4.5" y="5" width="3" height="7" rx="0.8" fill={c} /><rect x="9" y="2.5" width="3" height="9.5" rx="0.8" fill={c} /><rect x="13.5" y="0" width="3" height="12" rx="0.8" fill={c} /></svg>
        <svg width="17" height="12" viewBox="0 0 17 12"><path d="M8.5 3.1c2.3 0 4.4.9 5.9 2.4l1.1-1.1C13.7 2.6 11.2 1.4 8.5 1.4S3.3 2.6 1.5 4.4l1.1 1.1C4.1 4 6.2 3.1 8.5 3.1Z" fill={c} /><path d="M8.5 6.7c1.4 0 2.6.5 3.5 1.4l1.1-1.1C11.8 5.8 10.2 5 8.5 5S5.2 5.8 3.9 7l1.1 1.1c.9-.9 2.1-1.4 3.5-1.4Z" fill={c} /><circle cx="8.5" cy="10.4" r="1.5" fill={c} /></svg>
        <svg width="27" height="13" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity="0.35" fill="none" /><rect x="2" y="2" width="20" height="9" rx="1.8" fill={c} /><path d="M25 4.6v3.8c.8-.3 1.4-1.1 1.4-1.9S25.8 4.9 25 4.6Z" fill={c} fillOpacity="0.4" /></svg>
      </div>
    </div>
  );
}

function Notch() {
  return (
    <div style={{
      position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
      width: 164, height: 31, background: "#000", borderRadius: "0 0 20px 20px", zIndex: 40,
    }} />
  );
}

function HomeIndicator({ dark = false }) {
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: HOME_H, zIndex: 90,
      display: "flex", justifyContent: "center", alignItems: "flex-end", paddingBottom: 9,
      pointerEvents: "none",
    }}>
      <div style={{ width: 140, height: 5, borderRadius: 100, background: dark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }} />
    </div>
  );
}

// ── Bottom tab bar ──
const TAB_BAR_H = 64; // above the home indicator
function TabBar({ active = "home", onSelect }) {
  const I = window.Icons;
  const tabs = [
    { key: "home", label: "Home", Icon: I.TabHome },
    { key: "categories", label: "Categories", Icon: I.TabCategories },
    { key: "bag", label: "Bag", Icon: I.TabBag },
    { key: "designers", label: "Designers", Icon: I.TabAZ },
    { key: "account", label: "Account", Icon: I.TabAccount },
  ];
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 55,
      background: "#fff", borderTop: "1px solid #ececec",
      paddingBottom: HOME_H,
    }}>
      <div style={{ height: TAB_BAR_H, display: "flex", alignItems: "center" }}>
        {tabs.map(t => {
          const on = active === t.key;
          return (
            <button key={t.key} onClick={() => onSelect && onSelect(t.key)} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer", padding: "8px 0 4px",
              color: on ? "#000" : "#9a9a9a", WebkitTapHighlightColor: "transparent",
              transition: "color 0.2s ease, opacity 0.2s ease",
            }}>
              <t.Icon size={24} sw={on ? 1.9 : 1.6} />
              <span style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: 10.5, fontWeight: on ? 600 : 400, letterSpacing: 0.1 }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Frame shell + scale-to-fit stage ──
function PhoneFrame({ children }) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const m = 24;
      const sx = (window.innerWidth - m) / (SCREEN_W + 24);
      const sy = (window.innerHeight - m) / (SCREEN_H + 24);
      setScale(Math.min(1, sx, sy));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
      background: "#e8e6e1",
      backgroundImage: "radial-gradient(circle at 50% 38%, #f2f0ec 0%, #e3e0d9 78%)",
    }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        {/* outer bezel */}
        <div style={{
          width: SCREEN_W + 24, height: SCREEN_H + 24, borderRadius: 66, padding: 12,
          background: "linear-gradient(145deg,#2a2a2c,#0c0c0d)", boxSizing: "border-box",
          boxShadow: "0 50px 90px -20px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.4), inset 0 0 4px rgba(255,255,255,0.18)",
        }}>
          {/* screen */}
          <div style={{
            width: SCREEN_W, height: SCREEN_H, borderRadius: 54, overflow: "hidden",
            position: "relative", background: "#fff",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", WebkitFontSmoothing: "antialiased",
            display: "flex", flexDirection: "column",
          }}>
            <Notch />
            <StatusBar />
            <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
              {children}
            </div>
            <HomeIndicator />
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  PhoneFrame, StatusBar, TabBar, HomeIndicator, Notch,
  FRAME: { SCREEN_W, SCREEN_H, STATUS_H, HOME_H, TAB_BAR_H },
});
