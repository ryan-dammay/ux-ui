// Mamas & Papas — Hero component

const Hero = ({ headline, subline, ctaLabel = 'Shop now', ctaSecondary = 'Find out more' }) => (
  <section style={heroStyles.root}>
    <div style={heroStyles.inner}>
      <div style={heroStyles.content}>
        <div style={heroStyles.overline}>New Season Collection</div>
        <h1 style={heroStyles.headline}>{headline || 'Everything baby needs,\nbeautifully made'}</h1>
        <p style={heroStyles.subline}>{subline || 'Award-winning pushchairs, car seats, nursery furniture and clothing — trusted by parents since 1981.'}</p>
        <div style={heroStyles.ctaRow}>
          <button style={heroStyles.ctaPrimary}
            onMouseEnter={e => e.currentTarget.style.background='#136b52'}
            onMouseLeave={e => e.currentTarget.style.background='#198669'}>
            {ctaLabel}
          </button>
          <button style={heroStyles.ctaSecondary}
            onMouseEnter={e => { e.currentTarget.style.background='#323232'; e.currentTarget.style.color='#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#323232'; }}>
            {ctaSecondary}
          </button>
        </div>
        <div style={heroStyles.trustRow}>
          {['Free delivery over £50', 'Award-winning design', 'Free returns'].map(t => (
            <div key={t} style={heroStyles.trustItem}>
              <i data-lucide="check-circle" style={{width:13,height:13,stroke:'#198669',strokeWidth:2,fill:'none',flexShrink:0}}></i>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={heroStyles.imgZone}>
        <div style={heroStyles.imgPlaceholder}>
          <span style={{fontSize:12,color:'#878686',letterSpacing:'.5px'}}>Hero image</span>
        </div>
      </div>
    </div>
  </section>
);

const heroStyles = {
  root: { background: '#F8F6F0', padding: '56px 24px', fontFamily: "'Poppins',sans-serif" },
  inner: { maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 48 },
  content: { flex: 1, minWidth: 0 },
  overline: { fontSize: 10, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#198669', marginBottom: 16 },
  headline: { fontSize: 44, fontWeight: 700, color: '#323232', lineHeight: 1.15, whiteSpace: 'pre-line', marginBottom: 16 },
  subline: { fontSize: 15, color: '#575656', lineHeight: 1.65, maxWidth: 440, marginBottom: 28 },
  ctaRow: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 },
  ctaPrimary: { padding: '13px 28px', background: '#198669', color: '#fff', border: '1px solid #198669', borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", transition: 'background .15s' },
  ctaSecondary: { padding: '13px 28px', background: 'transparent', color: '#323232', border: '1px solid #323232', borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", transition: 'all .15s' },
  trustRow: { display: 'flex', gap: 20, flexWrap: 'wrap' },
  trustItem: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#575656', fontWeight: 500 },
  imgZone: { width: 480, flexShrink: 0, borderRadius: 12, overflow: 'hidden' },
  imgPlaceholder: { height: 400, background: 'repeating-linear-gradient(135deg,#F0EDE7 0,#F0EDE7 12px,#e5e0d8 12px,#e5e0d8 24px)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};

Object.assign(window, { Hero });
