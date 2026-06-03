// Icon set — outline/stroke style (Lucide-inspired), 1.5px stroke, currentColor.
// Each takes { size, sw (stroke width), style } and inherits color via currentColor.
const { createElement: h } = React;

function svg(size, children, vb = 24, extra = {}) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} fill="none"
      stroke="currentColor" strokeWidth={extra.sw || 1.6}
      strokeLinecap="round" strokeLinejoin="round" style={extra.style}>
      {children}
    </svg>
  );
}

const ChevronLeft = ({ size = 24, sw, style }) => svg(size, <path d="M15 5l-7 7 7 7" />, 24, { sw: sw || 1.8, style });
const ChevronRight = ({ size = 24, sw, style }) => svg(size, <path d="M9 5l7 7-7 7" />, 24, { sw: sw || 1.8, style });
const ChevronDown = ({ size = 24, sw, style }) => svg(size, <path d="M5 9l7 7 7-7" />, 24, { sw: sw || 1.8, style });
const ArrowUp = ({ size = 24, sw, style }) => svg(size, <><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></>, 24, { sw: sw || 2, style });

const Search = ({ size = 24, sw, style }) => svg(size, <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>, 24, { sw, style });

const Heart = ({ size = 24, sw, style, fill }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor"
    strokeWidth={sw || 1.6} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M20.8 6.6a5 5 0 0 0-8.8-2 5 5 0 0 0-8.8 2c-1 3 1.2 6 8.8 11.4 7.6-5.4 9.8-8.4 8.8-11.4Z" />
  </svg>
);

const Filter = ({ size = 24, sw, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw || 1.6} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="9" />
    <path d="M7 9.5h7M7 14.5h4" />
    <circle cx="16" cy="9.5" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="13" cy="14.5" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

const Star = ({ size = 16, style, fill = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="none" style={style}>
    <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.9 6.2 20.95 7.3 14.5 2.6 9.9l6.5-.95L12 2.5Z" />
  </svg>
);

const X = ({ size = 24, sw, style }) => svg(size, <><path d="M6 6l12 12M18 6L6 18" /></>, 24, { sw: sw || 1.8, style });

const Plus = ({ size = 24, sw, style }) => svg(size, <><path d="M12 5v14M5 12h14" /></>, 24, { sw: sw || 1.8, style });

const Share = ({ size = 22, sw, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw || 1.6} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M12 3v13" /><path d="M8 7l4-4 4 4" /><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" />
  </svg>
);
const Truck = ({ size = 22, sw, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw || 1.6} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M2 6.5h11v9H2z" /><path d="M13 9.5h4l3 3v3h-7z" /><circle cx="6.5" cy="17.5" r="1.8" /><circle cx="16.5" cy="17.5" r="1.8" />
  </svg>
);
const Store = ({ size = 22, sw, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw || 1.6} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M4 9.5V20h16V9.5" /><path d="M3 5h18l1 4.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0L3 5Z" /><path d="M9.5 20v-5h5v5" />
  </svg>
);
const Check = ({ size = 20, sw, style }) => svg(size, <path d="M4 12.5l5 5 11-11" />, 24, { sw: sw || 2, style });
const Bag = ({ size = 22, sw, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw || 1.6} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M5.5 8h13l-1 12.5h-11L5.5 8Z" /><path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" />
  </svg>
);

const ThumbUp = ({ size = 20, sw, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw || 1.6} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3Z" />
    <path d="M7 11l4-7a2 2 0 0 1 2.7.7l.3.6a3 3 0 0 1 .2 2.3L13.5 11H19a2 2 0 0 1 2 2.3l-1 6A2 2 0 0 1 18 21H7" />
  </svg>
);
const ThumbDown = ({ size = 20, sw, style }) => (
  <ThumbUp size={size} sw={sw} style={{ ...style, transform: "rotate(180deg)" }} />
);

// Chat + AI sparkle — the FAB glyph
const ChatSparkle = ({ size = 24, style, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={style}>
    <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h13A2.5 2.5 0 0 1 23 6.5v8A2.5 2.5 0 0 1 20.5 17H12l-4.6 3.8A.6.6 0 0 1 6.4 20.3V17H7.5A2.5 2.5 0 0 1 5 14.5v-8Z"
      stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M14 7.2l.85 2.1 2.15.85-2.15.85L14 13.1l-.85-2.1L11 10.15l2.15-.85L14 7.2Z"
      fill={color} />
  </svg>
);

// Send / submit arrow inside a filled circle handled by caller; this is the glyph
const SendArrow = ({ size = 20, sw, style }) => svg(size, <><path d="M12 19V6" /><path d="M6 12l6-6 6 6" /></>, 24, { sw: sw || 2, style });

// ── Tab bar icons (outline) ──
const TabHome = ({ size = 24, sw, style }) => svg(size, <><path d="M4 11l8-6.5L20 11" /><path d="M6 10v9h12v-9" /><path d="M10 19v-5h4v5" /></>, 24, { sw: sw || 1.6, style });
const TabCategories = ({ size = 24, sw, style }) => svg(size, <><circle cx="10" cy="10" r="6" /><path d="M14.5 14.5L20 20" /><path d="M14 7h6M14 10h4" /></>, 24, { sw: sw || 1.6, style });
const TabBag = ({ size = 24, sw, style }) => svg(size, <><path d="M5.5 8h13l-1 12.5h-11L5.5 8Z" /><path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" /></>, 24, { sw: sw || 1.6, style });
const TabAZ = ({ size = 24, sw, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw || 1.6} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M3 10l2.2-6 2.2 6M3.5 8h3.4" />
    <path d="M16.5 5h4.5l-4.5 9h4.5" />
    <path d="M18.7 17v3.5M17 18.7l1.7-1.7 1.7 1.7M17 19.3l1.7 1.7 1.7-1.7" />
  </svg>
);
const TabAccount = ({ size = 24, sw, style }) => svg(size, <><circle cx="12" cy="8.5" r="3.6" /><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" /></>, 24, { sw: sw || 1.6, style });

Object.assign(window, {
  Icons: {
    ChevronLeft, ChevronRight, ChevronDown, ArrowUp, Search, Heart, Filter, Star,
    X, Plus, ThumbUp, ThumbDown, ChatSparkle, SendArrow,
    Share, Truck, Store, Check, Bag,
    TabHome, TabCategories, TabBag, TabAZ, TabAccount,
  },
});
