// cod-components.jsx — atomic pieces lifted from the Gymshark COD Figma
// (black/white system). Exported to window for cod-app.jsx.

// ── Radio ──────────────────────────────────────────────────────────
function CodRadio({ checked = false, disabled = false }) {
  const border = disabled ? '#bbbcbc' : 'var(--cod-black)';
  return (
    <div style={{
      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
      border: `1.5px solid ${border}`, background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'border-color .15s ease',
    }}>
      <div style={{
        width: 9, height: 9, borderRadius: '50%',
        background: 'var(--cod-black)',
        transform: checked ? 'scale(1)' : 'scale(0)',
        transition: 'transform .15s ease',
      }} />
    </div>
  );
}

// ── COD payment-card badge (recreated from Brand=COD vector) ────────
function CodBadge() {
  return (
    <div style={{
      width: 38, height: 26, borderRadius: 4, flexShrink: 0,
      border: '1.25px solid var(--cod-black)', background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{
        fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: 9,
        letterSpacing: 0.5, color: 'var(--cod-black)',
      }}>COD</span>
    </div>
  );
}

// ── Small brand marks for the other payment rows ────────────────────
function VisaMark() {
  return (
    <div style={{
      width: 32, height: 22, borderRadius: 4, border: '1px solid var(--cod-border-light)',
      background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-btn)', fontWeight: 700, fontStyle: 'italic',
      fontSize: 9, letterSpacing: 0.3, color: '#1a1f71',
    }}>VISA</div>
  );
}
function MasterMark() {
  return (
    <div style={{
      width: 32, height: 22, borderRadius: 4, border: '1px solid var(--cod-border-light)',
      background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0,
    }}>
      <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#eb001b' }} />
      <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#f79e1b', marginLeft: -4, mixBlendMode: 'multiply' }} />
    </div>
  );
}
function ApplePayMark() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 2,
      fontFamily: 'var(--font-btn)', fontWeight: 600, fontSize: 13, color: 'var(--cod-black)',
    }}>
      <svg width="13" height="15" viewBox="0 0 17 20" fill="currentColor" aria-hidden="true">
        <path d="M13.3 10.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .7 1.1 1.6 2.3 2.7 2.3 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.1 0 1.9-1.1 2.6-2.2.8-1.2 1.2-2.4 1.2-2.5-.1 0-2.3-.9-2.4-3.4zM11 3.8c.6-.7 1-1.7.9-2.8-.9 0-2 .6-2.6 1.3-.6.6-1.1 1.7-.9 2.7 1 .1 2-.5 2.6-1.2z"/>
      </svg>
      <span>Pay</span>
    </div>
  );
}

// ── Alert (success / info / error) ─────────────────────────────────
function CodAlert({ type = 'info', title, body }) {
  const map = {
    success: { bg: 'var(--cod-success-bg)', bar: 'var(--cod-success)' },
    info:    { bg: 'var(--cod-info-bg)',    bar: 'var(--cod-info)' },
    error:   { bg: 'var(--cod-error-bg)',   bar: 'var(--cod-error)' },
  };
  const c = map[type] || map.info;
  const icon = {
    success: <path d="M9 12.5l2.2 2.2L15.5 9.5" />,
    error:   <g><path d="M9 9l6 6" /><path d="M15 9l-6 6" /></g>,
    info:    <g><path d="M12 11v5" /><circle cx="12" cy="7.6" r="0.4" fill={c.bar} stroke="none" /></g>,
  }[type];
  return (
    <div style={{ borderRadius: 'var(--cod-radius)', overflow: 'hidden' }}>
      <div style={{ background: c.bg, padding: '14px 16px', display: 'flex', gap: 10 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.bar}
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
             style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="12" cy="12" r="10" />
          {icon}
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {title && <span style={{
            fontFamily: 'var(--font-text)', fontWeight: 700, fontSize: 12.5,
            color: 'var(--cod-black)', textTransform: 'capitalize', lineHeight: 1.35,
          }}>{title}</span>}
          {body && <span style={{
            fontFamily: 'var(--font-text)', fontSize: 12, color: 'var(--cod-text-muted)',
            lineHeight: 1.45,
          }}>{body}</span>}
        </div>
      </div>
      <div style={{ height: 5, background: c.bar }} />
    </div>
  );
}

// ── Primary CTA (black pill) ────────────────────────────────────────
function CodButton({ label, onClick, disabled = false, loading = false }) {
  return (
    <button onClick={disabled || loading ? undefined : onClick} disabled={disabled || loading} style={{
      width: '100%', height: 46, border: 'none', borderRadius: 100, cursor: disabled || loading ? 'default' : 'pointer',
      background: disabled ? '#e7e7e7' : 'var(--cod-black)',
      color: disabled ? '#a9a9a9' : '#fff',
      fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: 14, letterSpacing: 0.2,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      transition: 'background .15s ease, color .15s ease',
    }}>
      {loading && <Spinner />}
      {loading ? '' : label}
    </button>
  );
}

function Spinner({ color = '#fff', size = 16 }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      border: `2px solid ${color}`, borderTopColor: 'transparent',
      display: 'inline-block', animation: 'cod-spin .7s linear infinite',
    }} />
  );
}

// ── OTP input ───────────────────────────────────────────────────────
// `value` is a left-to-right digit string of length 0–6 (no gaps).
function OtpInput({ value, onChange, error = false, disabled = false }) {
  const refs = React.useRef([]);
  const [focusIdx, setFocusIdx] = React.useState(-1);

  // focus the first field when the OTP screen first appears
  React.useEffect(() => {
    if (!disabled && refs.current[0]) {
      const id = setTimeout(() => refs.current[0] && refs.current[0].focus(), 60);
      return () => clearTimeout(id);
    }
  }, []);

  const focus = (i) => {
    const el = refs.current[Math.max(0, Math.min(5, i))];
    if (el) el.focus();
  };

  const handleChange = (i, e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) return;
    // typing or pasting from position i
    const next = (value.slice(0, i) + raw).slice(0, 6);
    onChange(next);
    focus(next.length >= 6 ? 5 : next.length);
  };

  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (value.length === 0) { focus(0); return; }
      const trimmed = value.slice(0, value.length - 1);
      onChange(trimmed);
      focus(trimmed.length);
    } else if (e.key === 'ArrowLeft') { focus(i - 1); }
    else if (e.key === 'ArrowRight') { focus(i + 1); }
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {[0,1,2,3,4,5].map(i => {
        const ch = value[i] || '';
        const filled = ch !== '';
        const focused = focusIdx === i && !disabled;
        const borderColor = error ? 'var(--cod-error)' : (focused || filled ? 'var(--cod-black)' : 'var(--cod-field-border)');
        return (
          <input key={i} ref={el => refs.current[i] = el}
            value={ch} disabled={disabled} inputMode="numeric" maxLength={1}
            onChange={(e) => handleChange(i, e)} onKeyDown={(e) => handleKey(i, e)}
            onFocus={(e) => { setFocusIdx(i); e.target.select(); }}
            onBlur={() => setFocusIdx(idx => (idx === i ? -1 : idx))}
            style={{
              flex: 1, minWidth: 0, height: 48, textAlign: 'center', padding: 0,
              fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: 18,
              color: error ? 'var(--cod-error)' : 'var(--cod-black)',
              background: disabled ? '#fafafa' : '#fff', borderRadius: 2, outline: 'none',
              border: `${focused ? 2 : 1}px solid ${borderColor}`,
              boxShadow: focused ? `0 0 0 3px ${error ? 'rgba(191,46,53,.14)' : 'rgba(0,0,0,.10)'}` : 'none',
              transition: 'border-color .12s ease, box-shadow .12s ease, color .15s ease',
            }} />
        );
      })}
    </div>
  );
}

Object.assign(window, {
  CodRadio, CodBadge, VisaMark, MasterMark, ApplePayMark,
  CodAlert, CodButton, Spinner, OtpInput,
});
