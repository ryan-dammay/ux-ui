// Mamas & Papas — Header component
// Responsive site header: logo, nav, search, bag, account

const Header = ({ bagCount = 0, onSearch, onNav }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  const navItems = ['Pushchairs', 'Car Seats', 'Nursery', 'Clothing', 'Gifts', 'Sale'];

  return (
    <header style={headerStyles.root}>
      {/* Top bar */}
      <div style={headerStyles.topBar}>
        <span style={headerStyles.topBarText}>Free delivery on orders over £50 · Free returns</span>
      </div>

      {/* Main header */}
      <div style={headerStyles.main}>
        {/* Hamburger (mobile) */}
        <button style={headerStyles.iconBtn} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <i data-lucide={menuOpen ? 'x' : 'menu'} style={headerStyles.icon}></i>
        </button>

        {/* Logo */}
        <a href="#" style={headerStyles.logoLink}>
          <img src="../../assets/logo-wordmark.svg" width="96" height="36" alt="Mamas & Papas" style={{display:'block'}} />
        </a>

        {/* Desktop nav */}
        <nav style={headerStyles.nav}>
          {navItems.map(item => (
            <a key={item} href="#" style={headerStyles.navLink}
               onMouseEnter={e => e.target.style.color = '#198669'}
               onMouseLeave={e => e.target.style.color = '#323232'}>
              {item}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div style={headerStyles.actions}>
          <button style={headerStyles.iconBtn} onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
            <i data-lucide="search" style={headerStyles.icon}></i>
          </button>
          <button style={headerStyles.iconBtn} aria-label="Account">
            <i data-lucide="user" style={headerStyles.icon}></i>
          </button>
          <button style={headerStyles.bagBtn} aria-label="Bag">
            <i data-lucide="shopping-bag" style={headerStyles.icon}></i>
            {bagCount > 0 && <span style={headerStyles.bagBadge}>{bagCount}</span>}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div style={headerStyles.searchBar}>
          <div style={headerStyles.searchInner}>
            <i data-lucide="search" style={{width:16,height:16,stroke:'#878686',strokeWidth:1.5,fill:'none',flexShrink:0}}></i>
            <input autoFocus placeholder="Search pushchairs, car seats, nursery…" style={headerStyles.searchInput} />
            <button style={headerStyles.searchClose} onClick={() => setSearchOpen(false)}>
              <i data-lucide="x" style={{width:14,height:14,stroke:'#575656',strokeWidth:1.5,fill:'none'}}></i>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

const headerStyles = {
  root: { fontFamily: "'Poppins', sans-serif", background: '#fff', borderBottom: '1px solid #D1D1D1', position: 'sticky', top: 0, zIndex: 100 },
  topBar: { background: '#198669', padding: '7px 24px', textAlign: 'center' },
  topBarText: { fontSize: 11, fontWeight: 600, color: '#fff', letterSpacing: '.3px' },
  main: { display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', height: 64, maxWidth: 1280, margin: '0 auto' },
  logoLink: { textDecoration: 'none', flexShrink: 0 },
  nav: { display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' },
  navLink: { padding: '8px 14px', fontSize: 13, fontWeight: 500, color: '#323232', textDecoration: 'none', borderRadius: 4, transition: 'color .15s', whiteSpace: 'nowrap' },
  actions: { display: 'flex', alignItems: 'center', gap: 4 },
  iconBtn: { width: 40, height: 40, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  bagBtn: { width: 40, height: 40, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  icon: { width: 18, height: 18, stroke: '#323232', strokeWidth: 1.5, fill: 'none', display: 'block' },
  bagBadge: { position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: '50%', background: '#198669', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  searchBar: { borderTop: '1px solid #D1D1D1', padding: '12px 24px', background: '#fff' },
  searchInner: { maxWidth: 640, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10, background: '#F8F8F8', border: '1.5px solid #D1D1D1', borderRadius: 4, padding: '10px 14px' },
  searchInput: { flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: "'Poppins',sans-serif", fontSize: 14, color: '#323232' },
  searchClose: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2 },
};

Object.assign(window, { Header });
