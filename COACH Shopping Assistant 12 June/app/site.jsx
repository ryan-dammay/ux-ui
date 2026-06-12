// site.jsx — mock Coach storefront backdrop (context for the floating assistant).
const IMGS = 'assets/img/';
const AS = (f) => (typeof window!=='undefined' && window.assetURL ? window.assetURL(IMGS + f) : IMGS + f);

function TopBNPL() {
  return <div style={{ background: '#000', color: '#fff', textAlign: 'center', fontSize: 9.5, letterSpacing: '.16em',
    fontWeight: 600, padding: '7px 10px', textTransform: 'uppercase' }}>Buy now, pay later with Tabby &amp; Tamara</div>;
}

const ICONS_ROW = [
{ img: AS('icon-brooklyn.jpg'), label: 'Shop Brooklyn' },
{ img: AS('icon-lana.jpg'), label: 'Shop Lana' },
{ img: AS('icon-tabby-cherry.jpg'), label: 'Shop Tabby' },
{ img: AS('icon-tabby-stack.jpg'), label: 'Shop All Bags' }];


function SiteMobile({ Ic, bagCount }) {
  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#fff', fontFamily: 'var(--sans)', color: '#111' }} className="ca-scroll">
      <TopBNPL />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', gap: 14 }}><Ic.Menu size={21} /><Ic.Pin size={21} /></div>
        <div style={{ fontFamily: 'var(--serif)', letterSpacing: '.22em', fontSize: 19, textIndent: '.22em', fontWeight: 500 }}>COACH</div>
        <div style={{ display: 'flex', gap: 14, position: 'relative' }}>
          <Ic.Search size={21} />
          <span style={{ position: 'relative' }}><Ic.Bag size={21} />{bagCount > 0 &&
            <span key={bagCount} className="ca-bag-bump" style={{ position: 'absolute', top: -6, right: -7, background: '#000', color: '#fff', fontSize: 9, fontWeight: 700,
              width: 15, height: 15, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{bagCount}</span>}</span>
        </div>
      </div>
      {/* Hero */}
      <div style={{ position: 'relative', background: '#d9d3c7', aspectRatio: '4/5', overflow: 'hidden' }}>
        <img src={AS('icon-tabby-cherry.jpg')} style={{ width: '112%', height: '112%', objectFit: 'cover', objectPosition: 'center 22%', mixBlendMode: 'multiply' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '42%', background: 'linear-gradient(to top,#d9d3c7 28%,rgba(217,211,199,0))' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 30, textAlign: 'center', color: '#111' }}>
          <div style={{ fontWeight: 800, fontSize: 32, letterSpacing: '-.02em' }}>Tabby in the wild.</div>
          <button style={{ marginTop: 15, background: '#fff', border: '1px solid #111', padding: '12px 26px', fontSize: 11,
            letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 600 }}>Shop Bags</button>
        </div>
      </div>
      {/* Icons section */}
      <div style={{ background: '#efeeec', padding: '34px 0 40px' }}>
        <h2 style={{ fontWeight: 800, fontSize: 27, letterSpacing: '-.02em', textAlign: 'center', margin: '0 0 26px', padding: '0 20px' }}>Icons to carry forward.</h2>
        <div className="ca-scroll" style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '0 18px' }}>
          {ICONS_ROW.map((c) =>
          <div key={c.label} style={{ flex: '0 0 auto', width: 200 }}>
              <div style={{ background: '#e6e2d8', aspectRatio: '1/1' }}><img src={c.img} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} /></div>
              <div style={{ textAlign: 'center', marginTop: 14 }}><button style={{ background: 'none', border: '1px solid #111', padding: '9px 16px', fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 600 }}>{c.label}</button></div>
            </div>
          )}
        </div>
      </div>
      <div style={{ height: 80 }} />
    </div>);

}

function SiteDesktop({ Ic, bagCount }) {
  const NAV = ['New', 'Women', 'Men', 'Bags', 'Shoes', 'Gifts', 'Sale', 'Outlet'];
  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#fff', fontFamily: 'var(--sans)', color: '#111' }} className="ca-scroll">
      <TopBNPL />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px 6px' }}>
        <div style={{ display: 'flex', gap: 22, fontSize: 12, letterSpacing: '.08em' }}><span>🇦🇪 UAE ▾</span><span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Ic.Pin size={15} /> Stores</span></div>
        <div style={{ fontFamily: 'var(--serif)', letterSpacing: '.24em', fontSize: 26, textIndent: '.24em', fontWeight: 500 }}>COACH</div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}><Ic.Search size={19} /><Ic.Heart size={19} /><Ic.User size={19} />
          <span style={{ position: 'relative' }}><Ic.Bag size={19} />{bagCount > 0 &&
            <span key={bagCount} className="ca-bag-bump" style={{ position: 'absolute', top: -7, right: -7, background: '#000', color: '#fff', fontSize: 9, fontWeight: 700, width: 15, height: 15, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{bagCount}</span>}</span></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 34, padding: '14px 0 16px', borderBottom: '1px solid #eee', fontSize: 13, letterSpacing: '.13em', textTransform: 'uppercase', fontWeight: 500 }}>
        {NAV.map((n) => <span key={n}>{n}</span>)}
      </div>
      {/* Hero */}
      <div style={{ position: 'relative', height: 420, background: '#d9d3c7', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={AS('icon-tabby-stack.jpg')} style={{ position: 'absolute', right: '6%', top: '50%', transform: 'translateY(-50%)', height: '128%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
        <div style={{ position: 'absolute', left: '9%', top: '50%', transform: 'translateY(-50%)' }}>
          <div style={{ fontWeight: 800, fontSize: 58, letterSpacing: '-.02em', lineHeight: .98 }}>Tabby in<br />the wild.</div>
          <button style={{ marginTop: 24, background: '#fff', border: '1px solid #111', padding: '14px 34px', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 600 }}>Shop Bags</button>
        </div>
      </div>
      {/* Icons row */}
      <div style={{ background: '#efeeec', padding: '46px 40px 56px' }}>
        <h2 style={{ fontWeight: 800, fontSize: 34, letterSpacing: '-.02em', textAlign: 'center', margin: '0 0 34px' }}>Icons to carry forward.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
          {ICONS_ROW.map((c) =>
          <div key={c.label}>
              <div style={{ background: '#e6e2d8', aspectRatio: '1/1' }}><img src={c.img} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} /></div>
              <div style={{ textAlign: 'center', marginTop: 16 }}><button style={{ background: 'none', border: '1px solid #111', padding: '10px 18px', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 600 }}>{c.label}</button></div>
            </div>
          )}
        </div>
      </div>
    </div>);

}

// Floating launcher bubble
function Launcher({ th, Ic, onClick, pulse }) {
  return (
    <button onClick={onClick} aria-label="Open shopping assistant" style={{ position: 'absolute', zIndex: 30, right: 18, bottom: 18,
      width: 58, height: 58, borderRadius: '50%', border: 'none', cursor: 'pointer',
      background: '#000',
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 8px 26px rgba(0,0,0,.32)' }}>
      <Ic.ShopBot size={28} stroke={1.6} />
      {pulse && <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(255,255,255,.5)', animation: 'caPulse 2.2s ease-out infinite' }} />}
    </button>);

}

function Teaser({ th, Ic, onOpen, onClose }) {
  return (
    <div className="ca-teaser" style={{ position: 'absolute', zIndex: 29, right: 18, bottom: 86, maxWidth: 248, background: '#fff', color: '#111',
      border: '1px solid #e7e4dd', borderRadius: '2px', boxShadow: '0 10px 30px rgba(0,0,0,.18)', padding: '14px 15px' }}>
      <button onClick={onClose} aria-label="Dismiss" style={{ position: 'absolute', top: 6, right: 6, background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: 4 }}>×</button>
      <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
        <span style={{ flex: '0 0 auto', width: 26, height: 26, borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic.ShopBot size={16} stroke={1.7} /></span>
        <div>
          <div style={{ fontSize: 13, lineHeight: 1.45 }}>Hello — can I help you find something today?</div>
          <button onClick={onOpen} style={{ marginTop: 10, background: '#000', color: '#fff', border: 'none', padding: '8px 14px', fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer' }}>Chat with us</button>
        </div>
      </div>
    </div>);

}

window.COACH_SITE = { SiteMobile, SiteDesktop, Launcher, Teaser };