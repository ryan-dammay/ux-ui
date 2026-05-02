// Mamas & Papas — Footer component

const Footer = () => {
  const cols = [
    { title: 'Shop', links: ['Pushchairs & Prams', 'Car Seats', 'Nursery Furniture', 'Baby Clothing', 'Gifts', 'Sale'] },
    { title: 'Help', links: ['Delivery & Returns', 'Track My Order', 'Product Guides', 'Store Finder', 'Contact Us', 'FAQs'] },
    { title: 'About', links: ['Our Story', 'Sustainability', 'Careers', 'Press', 'Affiliates'] },
  ];

  return (
    <footer style={footerStyles.root}>
      <div style={footerStyles.inner}>
        {/* Top grid */}
        <div style={footerStyles.grid}>
          {/* Brand col */}
          <div style={footerStyles.brandCol}>
            <img src="assets/logo-wordmark.svg" width="90" height="34" alt="Mamas & Papas" style={{filter:'brightness(0) invert(1)',display:'block',marginBottom:14}} />
            <p style={footerStyles.brandText}>Trusted by parents since 1981. Award-winning baby gear, beautifully designed.</p>
            <div style={footerStyles.socialRow}>
              {['instagram','facebook','youtube','pinterest'].map(n => (
                <a key={n} href="#" style={footerStyles.socialBtn} aria-label={n}>
                  <i data-lucide={n === 'instagram' ? 'instagram' : n === 'facebook' ? 'facebook' : n === 'youtube' ? 'youtube' : 'bookmark'} style={{width:15,height:15,stroke:'rgba(255,255,255,.8)',strokeWidth:1.5,fill:'none'}}></i>
                </a>
              ))}
            </div>
          </div>
          {/* Link cols */}
          {cols.map(col => (
            <div key={col.title} style={footerStyles.linkCol}>
              <div style={footerStyles.colTitle}>{col.title}</div>
              {col.links.map(link => (
                <a key={link} href="#" style={footerStyles.link}
                  onMouseEnter={e => e.target.style.color='#fff'}
                  onMouseLeave={e => e.target.style.color='rgba(255,255,255,.55)'}>
                  {link}
                </a>
              ))}
            </div>
          ))}
          {/* Newsletter col */}
          <div style={footerStyles.linkCol}>
            <div style={footerStyles.colTitle}>Stay in the loop</div>
            <p style={{...footerStyles.brandText, marginBottom:12}}>New arrivals, parenting tips and exclusive offers.</p>
            <div style={footerStyles.emailRow}>
              <input placeholder="Your email" style={footerStyles.emailInput} />
              <button style={footerStyles.emailBtn}>Subscribe</button>
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div style={footerStyles.bottom}>
          <span style={footerStyles.legal}>© 2025 Mamas &amp; Papas Ltd. All rights reserved.</span>
          <div style={footerStyles.legalLinks}>
            {['Privacy Policy','Cookie Policy','Terms & Conditions','Accessibility'].map(l => (
              <a key={l} href="#" style={footerStyles.legalLink}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const footerStyles = {
  root: { background: '#323232', fontFamily: "'Poppins',sans-serif", paddingTop: 56, paddingBottom: 0 },
  inner: { maxWidth: 1200, margin: '0 auto', padding: '0 24px' },
  grid: { display: 'grid', gridTemplateColumns: '200px 1fr 1fr 1fr 220px', gap: 40, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,.1)' },
  brandCol: {},
  brandText: { fontSize: 12, color: 'rgba(255,255,255,.5)', lineHeight: 1.7, marginBottom: 16 },
  socialRow: { display: 'flex', gap: 8 },
  socialBtn: { width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'background .15s' },
  linkCol: { display: 'flex', flexDirection: 'column', gap: 2 },
  colTitle: { fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 10 },
  link: { fontSize: 12.5, color: 'rgba(255,255,255,.55)', textDecoration: 'none', padding: '4px 0', transition: 'color .12s' },
  emailRow: { display: 'flex', gap: 8 },
  emailInput: { flex: 1, padding: '9px 12px', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 4, fontFamily: "'Poppins',sans-serif", fontSize: 12.5, color: '#fff', outline: 'none' },
  emailBtn: { padding: '9px 14px', background: '#198669', color: '#fff', border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", whiteSpace: 'nowrap' },
  bottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', flexWrap: 'wrap', gap: 12 },
  legal: { fontSize: 11, color: 'rgba(255,255,255,.3)' },
  legalLinks: { display: 'flex', gap: 16 },
  legalLink: { fontSize: 11, color: 'rgba(255,255,255,.3)', textDecoration: 'none' },
};

Object.assign(window, { Footer });
