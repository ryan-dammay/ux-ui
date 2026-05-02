// Mamas & Papas — ProductCard component

const ProductCard = ({ name, price, wasPrice, badge, badgeType = 'new', stars = 5, reviewCount = 0, onAdd }) => {
  const [wished, setWished] = React.useState(false);

  const badgeColors = {
    new:        { bg: '#198669', color: '#fff' },
    sale:       { bg: '#C4574A', color: '#fff' },
    bestseller: { bg: '#E8A020', color: '#323232' },
    eco:        { bg: '#8FA888', color: '#fff' },
    exclusive:  { bg: '#323232', color: '#fff' },
  };
  const bc = badgeColors[badgeType] || badgeColors.new;

  return (
    <div style={pcStyles.card}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 2px -1px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
      {/* Image zone */}
      <div style={pcStyles.imgZone}>
        <div style={pcStyles.imgPlaceholder}>Product image</div>
        {badge && (
          <span style={{...pcStyles.badge, background: bc.bg, color: bc.color}}>{badge}</span>
        )}
        <button style={{...pcStyles.wishBtn, color: wished ? '#C4574A' : '#323232'}}
          onClick={() => setWished(!wished)} aria-label="Add to wishlist">
          <i data-lucide="heart" style={{width:14,height:14,stroke:'currentColor',strokeWidth:1.5,fill: wished ? 'currentColor':'none'}}></i>
        </button>
      </div>
      {/* Body */}
      <div style={pcStyles.body}>
        <div style={pcStyles.name}>{name}</div>
        {reviewCount > 0 && (
          <div style={pcStyles.stars}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{color: i <= stars ? '#E8A020' : '#D1D1D1', fontSize: 12}}>★</span>
            ))}
            <span style={pcStyles.reviewCount}>({reviewCount})</span>
          </div>
        )}
        <div style={pcStyles.priceRow}>
          <span style={pcStyles.price}>£{price}</span>
          {wasPrice && <span style={pcStyles.was}>£{wasPrice}</span>}
        </div>
      </div>
      {/* Footer */}
      <div style={pcStyles.footer}>
        <button style={pcStyles.addBtn} onClick={onAdd}
          onMouseEnter={e => e.currentTarget.style.background = '#136b52'}
          onMouseLeave={e => e.currentTarget.style.background = '#198669'}>
          Add to bag
        </button>
      </div>
    </div>
  );
};

const pcStyles = {
  card: { background: '#fff', borderRadius: 8, border: '1px solid #D1D1D1', overflow: 'hidden', boxShadow: '0 1px 2px -1px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.1)', transition: 'box-shadow .2s, transform .2s', display: 'flex', flexDirection: 'column', fontFamily: "'Poppins',sans-serif" },
  imgZone: { height: 200, background: '#F8F6F0', position: 'relative', overflow: 'hidden' },
  imgPlaceholder: { width: '100%', height: '100%', background: 'repeating-linear-gradient(135deg,#F8F6F0 0,#F8F6F0 10px,#ede8e2 10px,#ede8e2 20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#878686', letterSpacing: '.5px' },
  badge: { position: 'absolute', top: 10, left: 10, fontSize: 10, fontWeight: 700, letterSpacing: '.6px', borderRadius: 9999, padding: '3px 9px' },
  wishBtn: { position: 'absolute', top: 8, right: 8, width: 30, height: 30, background: '#fff', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,.12)', transition: 'color .15s' },
  body: { padding: '14px 16px', flex: 1 },
  name: { fontSize: 13, fontWeight: 600, color: '#323232', lineHeight: 1.4 },
  stars: { display: 'flex', alignItems: 'center', gap: 1, marginTop: 4 },
  reviewCount: { fontSize: 10.5, color: '#878686', marginLeft: 4 },
  priceRow: { marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 6 },
  price: { fontSize: 16, fontWeight: 700, color: '#323232' },
  was: { fontSize: 12, color: '#878686', textDecoration: 'line-through', fontWeight: 400 },
  footer: { padding: '0 16px 14px' },
  addBtn: { width: '100%', padding: '9px 16px', background: '#198669', color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", transition: 'background .15s' },
};

Object.assign(window, { ProductCard });
