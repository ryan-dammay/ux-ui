// cod-app.jsx — Cash-on-Delivery verification flow, iPhone 13.
const { useState, useEffect, useRef, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "countdown": 30,
  "scenario": "Live (default)"
}/*EDITMODE-END*/;

const AMOUNT = "AED 1,250";
const PHONE_MASK = "+971 58 ••••• 38";
const EMAIL_MASK = "j••••a@email.com";

const SCENARIOS = [
  "Live (default)", "Default COD", "Verification method", "No-selection error",
  "Sending code", "OTP entry", "Wrong-code error", "Cooldown lockout", "Resend ready", "Success",
];

// ── Payment method row (the non-COD options) ────────────────────────
function MethodCard({ id, label, selected, onSelect, marks }) {
  const active = selected === id;
  return (
    <button onClick={() => onSelect(id)} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer',
      background: '#fff', borderRadius: 'var(--cod-radius)',
      border: `1px solid ${active ? 'var(--cod-black)' : 'var(--cod-border-light)'}`,
      padding: '13px 12px', display: 'flex', alignItems: 'center', gap: 12,
      transition: 'border-color .15s ease',
    }}>
      <CodRadio checked={active} />
      <span style={{
        flex: 1, fontFamily: 'var(--font-text)', fontWeight: 700, fontSize: 14,
        color: 'var(--cod-black)',
      }}>{label}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>{marks}</div>
    </button>
  );
}

// ── Selectable verification channel row (phone / email) ─────────────
function ChannelRow({ id, label, value, selected, onSelect, last }) {
  const active = selected === id;
  return (
    <button onClick={() => onSelect(id)} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer', background: 'transparent',
      border: 'none', borderBottom: last ? 'none' : '1px solid var(--cod-border-light)',
      padding: '12px 0', display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <CodRadio checked={active} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ fontFamily: 'var(--font-text)', fontWeight: 700, fontSize: 13.5, color: 'var(--cod-black)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-text)', fontSize: 12.5, color: 'var(--cod-text-muted)' }}>{value}</span>
      </div>
    </button>
  );
}

const TextLink = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    background: 'none', border: 'none', padding: 0, cursor: 'pointer',
    fontFamily: 'var(--font-text)', fontWeight: 700, fontSize: 12,
    color: 'var(--cod-black)', textDecoration: 'underline', textUnderlineOffset: 2,
  }}>{children}</button>
);

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, '0');
  return `${m}:${sec} seconds`;
}

function fmtCooldown(s) {
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, '0');
  return `${m}:${sec}`;
}

function fmtCooldownWords(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m} min ${sec} sec`;
}

function Stopwatch() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         style={{ verticalAlign: '-2px', margin: '0 3px 0 1px' }} aria-hidden="true">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 1.5" />
      <path d="M9 2h6" />
      <path d="M12 2v2" />
    </svg>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [method, setMethod] = useState(null);        // selected payment method
  const [phase, setPhase] = useState('default');     // COD sub-phase
  const [channel, setChannel] = useState(null);      // 'phone' | 'email'
  const [otp, setOtp] = useState('');
  const [code, setCode] = useState('');              // the "real" 6-digit code
  const [timer, setTimer] = useState(0);
  const [resending, setResending] = useState(false);
  const [attempts, setAttempts] = useState(0);       // consecutive wrong attempts
  const [cooldown, setCooldown] = useState(0);       // lockout seconds remaining
  const [toast, setToast] = useState(false);
  const lastScenario = useRef(t.scenario);

  const genCode = () => String(Math.floor(100000 + Math.random() * 900000));
  const maskFor = (c) => (c === 'email' ? EMAIL_MASK : PHONE_MASK);

  const MAX_ATTEMPTS = 4;
  const COOLDOWN_SECS = 180; // 3 minutes

  // resend countdown
  useEffect(() => {
    if (!['otp', 'wrongCode'].includes(phase)) return;
    if (timer <= 0) return;
    const id = setInterval(() => setTimer(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [phase, timer]);

  // cooldown lockout countdown
  useEffect(() => {
    if (phase !== 'cooldown') return;
    if (cooldown <= 0) {
      // lockout over — issue a fresh code and let the customer try again
      setCode(genCode()); setOtp(''); setAttempts(0);
      setTimer(Math.round(t.countdown)); setPhase('otp');
      return;
    }
    const id = setInterval(() => setCooldown(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [phase, cooldown]);

  // ── transitions ──────────────────────────────────────────────────
  const selectMethod = (id) => {
    if (id === 'cod') {
      setMethod('cod');
      if (phase === 'default') setPhase('verify');
    } else {
      setMethod(id);
      setPhase('default'); setChannel(null); setOtp(''); setCode('');
    }
  };

  const sendCode = () => {
    if (!channel) { setPhase('noSelect'); return; }
    setPhase('sending');
    setTimeout(() => {
      setCode(genCode()); setOtp(''); setAttempts(0);
      setTimer(Math.round(t.countdown));
      setPhase('otp');
    }, 1100);
  };

  const confirmCode = (val = otp) => {
    if (phase === 'cooldown') return;
    if (val.length < 6) return;
    if (val === code) {
      setAttempts(0);
      setPhase('verifying');
      setTimeout(() => setPhase('success'), 1100);
    } else {
      const n = attempts + 1;
      if (n >= MAX_ATTEMPTS) {
        setAttempts(0);
        setCooldown(COOLDOWN_SECS);
        setPhase('cooldown');
      } else {
        setAttempts(n);
        setPhase('wrongCode');
      }
    }
  };

  const resend = () => {
    if (resending || phase === 'cooldown') return;
    setResending(true); setOtp(''); setAttempts(0);
    setTimeout(() => {
      setCode(genCode());
      setTimer(Math.round(t.countdown));
      setResending(false);
    }, 1000);
  };

  const changeMethod = () => { if (phase === 'cooldown') return; setPhase('verify'); setOtp(''); setCode(''); setTimer(0); setAttempts(0); };

  // ── scenario jump (tweak) ────────────────────────────────────────
  useEffect(() => {
    if (t.scenario === lastScenario.current) return;
    lastScenario.current = t.scenario;
    const c = genCode();
    const dur = Math.round(t.countdown);
    switch (t.scenario) {
      case 'Default COD':       setMethod(null); setPhase('default'); setChannel(null); setOtp(''); break;
      case 'Verification method':setMethod('cod'); setPhase('verify'); setChannel(null); setOtp(''); break;
      case 'No-selection error': setMethod('cod'); setPhase('noSelect'); setChannel(null); setOtp(''); break;
      case 'Sending code':       setMethod('cod'); setChannel('phone'); setPhase('sending'); break;
      case 'OTP entry':          setMethod('cod'); setChannel('phone'); setCode(c); setOtp(''); setTimer(dur); setPhase('otp'); break;
      case 'Wrong-code error':   setMethod('cod'); setChannel('phone'); setCode(c); setOtp('000000'); setTimer(dur); setPhase('wrongCode'); break;
      case 'Cooldown lockout':   setMethod('cod'); setChannel('phone'); setCode(c); setOtp('000000'); setAttempts(0); setCooldown(COOLDOWN_SECS); setPhase('cooldown'); break;
      case 'Resend ready':       setMethod('cod'); setChannel('phone'); setCode(c); setOtp(''); setTimer(0); setPhase('otp'); break;
      case 'Success':            setMethod('cod'); setChannel('phone'); setPhase('success'); break;
      default: break; // Live
    }
  }, [t.scenario]);

  const codSelected = method === 'cod';
  const verified = phase === 'success';
  const orderReady = (method && method !== 'cod') || verified;

  const placeOrder = () => { if (orderReady) { setToast(true); setTimeout(() => setToast(false), 2600); } };

  // ── COD card body per phase ──────────────────────────────────────
  const introText = "For ‘Cash on Delivery’ please verify the phone number or email address you have provided.";

  const renderCodBody = () => {
    if (!codSelected) return null;

    if (['verify', 'noSelect', 'sending'].includes(phase) && phase !== 'sendingOtp') {
      const isSending = phase === 'sending';
      return (
        <div style={bodyStyle}>
          <p style={introStyle}>{introText}</p>
          {phase === 'noSelect' && (
            <CodAlert type="error"
              body="Please choose phone or email before we can send your code." />
          )}
          <p style={boldNote}>Please select phone or email for verification</p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <ChannelRow id="phone" label="Phone number" value={PHONE_MASK}
              selected={channel} onSelect={(c) => { setChannel(c); if (phase === 'noSelect') setPhase('verify'); }} />
            <ChannelRow id="email" label="Email address" value={EMAIL_MASK} last
              selected={channel} onSelect={(c) => { setChannel(c); if (phase === 'noSelect') setPhase('verify'); }} />
          </div>
          <CodButton label="Send verification number" loading={isSending} onClick={sendCode} />
        </div>
      );
    }

    if (['otp', 'wrongCode', 'verifying'].includes(phase)) {
      const wrong = phase === 'wrongCode';
      const verifying = phase === 'verifying';
      return (
        <div style={bodyStyle}>
          <p style={introStyle}>{introText}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
            <span style={boldNote}>Please enter the code sent to {maskFor(channel)}</span>
            <TextLink onClick={changeMethod}>Change</TextLink>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <OtpInput value={otp} onChange={(v) => { setOtp(v); if (phase === 'wrongCode') setPhase('otp'); if (v.length === 6) setTimeout(() => confirmCode(v), 220); }} error={wrong} disabled={verifying} />
            {wrong && <span style={{ fontFamily: 'var(--font-text)', fontSize: 12, color: 'var(--cod-error)' }}>
              Oops! The code you entered is incorrect. Please try again.
            </span>}
          </div>
          {verifying ? (
            <CodButton label="Confirm" loading onClick={() => {}} />
          ) : timer > 0 ? (
            <CodButton label="Confirm" disabled={otp.length < 6 || wrong} onClick={confirmCode} />
          ) : (
            <CodButton label="Resend code" loading={resending} onClick={resend} />
          )}
          {timer > 0 && !verifying && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 5, alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-text)', fontSize: 13.5, color: 'var(--cod-text-muted)' }}>Resend code in</span>
              <span style={{ fontFamily: 'var(--font-text)', fontWeight: 700, fontSize: 13.5, color: 'var(--cod-black)' }}>{fmtTime(timer)}</span>
            </div>
          )}
        </div>
      );
    }

    if (phase === 'cooldown') {
      return (
        <div style={bodyStyle}>
          <CodAlert type="error" body={
            <span>
              Too many unsuccessful attempts. Please try again in <Stopwatch />
              <strong style={{ fontWeight: 700, color: 'var(--cod-black)', whiteSpace: 'nowrap' }}>{fmtCooldownWords(cooldown)}</strong> or choose another payment method.
            </span>
          } />
        </div>
      );
    }

    if (phase === 'success') {
      return (
        <div style={bodyStyle}>
          <CodAlert type="success" title="Verification completed"
            body="Your number is confirmed — you can place your order with Cash on Delivery." />
          <CodAlert type="info" title="Important notice"
            body="Please pay the courier upon receiving your order. In case of returns, we will refund via a gift card." />
        </div>
      );
    }
    return null;
  };

  // ── COD card ──────────────────────────────────────────────────────
  const codCard = (
    <div style={{
      background: '#fff', borderRadius: 'var(--cod-radius)',
      border: `1px solid ${codSelected ? 'var(--cod-black)' : 'var(--cod-border-light)'}`,
      transition: 'border-color .15s ease', overflow: 'hidden',
    }}>
      <button onClick={() => selectMethod('cod')} style={{
        width: '100%', textAlign: 'left', cursor: 'pointer', background: 'transparent',
        border: 'none', padding: '13px 12px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <CodRadio checked={codSelected} />
        <span style={{ flex: 1, fontFamily: 'var(--font-text)', fontWeight: 700, fontSize: 14, color: 'var(--cod-black)' }}>
          Cash on Delivery
        </span>
        {!codSelected && (
          <span style={{ fontFamily: 'var(--font-text)', fontWeight: 700, fontSize: 14, color: 'var(--cod-black)' }}>{AMOUNT}</span>
        )}
        <CodBadge />
      </button>
      {renderCodBody()}
    </div>
  );

  // ── screen ────────────────────────────────────────────────────────
  const screen = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--cod-page)' }}>
      {/* header */}
      <div style={{
        background: '#fff', paddingTop: 50, borderBottom: '1px solid var(--cod-border-light)',
        flexShrink: 0, position: 'relative', zIndex: 5,
      }}>
        <div style={{ height: 46, display: 'flex', alignItems: 'center', padding: '0 12px' }}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none" style={{ flexShrink: 0 }}>
            <path d="M9 1L1 9l8 8" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{
            position: 'absolute', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none',
            fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: 16, letterSpacing: 0.3, color: '#000',
          }}>Checkout</span>
        </div>
      </div>

      {/* body */}
      <div className="cod-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 16px' }}>
        {/* demo hint */}
        {['otp', 'wrongCode', 'verifying'].includes(phase) && code && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14,
            border: '1px dashed #b9b9b9', borderRadius: 'var(--cod-radius)',
            background: '#fff', padding: '10px 12px',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="9" /><path d="M12 8v5" /><circle cx="12" cy="16.5" r="0.3" />
            </svg>
            <span style={{ flex: 1, fontFamily: 'var(--font-text)', fontSize: 11.5, color: 'var(--cod-text-muted)', lineHeight: 1.3 }}>
              Demo only — use this code:
            </span>
            <strong style={{ color: '#000', letterSpacing: 2, fontFamily: 'var(--font-btn)', fontWeight: 700, fontSize: 13.5 }}>{code}</strong>
          </div>
        )}

        <p style={{
          fontFamily: 'var(--font-text)', fontWeight: 700, fontSize: 11, letterSpacing: 1,
          textTransform: 'uppercase', color: 'var(--cod-text-muted)', margin: '2px 0 10px 2px',
        }}>Select payment method</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {codCard}
        </div>
      </div>

      {/* toast */}
      {toast && (
        <div style={{
          position: 'absolute', left: 16, right: 16, bottom: 96, zIndex: 80,
          background: '#000', color: '#fff', borderRadius: 8, padding: '13px 16px',
          display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 24px rgba(0,0,0,.25)',
          animation: 'cod-rise .25s ease',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span style={{ fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: 13.5 }}>Order placed — pay the courier on delivery</span>
        </div>
      )}
    </div>
  );

  return (
    <div id="cod-root">
      <IOSDevice width={390} height={844} notch>{screen}</IOSDevice>

      <TweaksPanel>
        <TweakSection label="Demo controls" />
        <TweakSelect label="Jump to state" value={t.scenario} options={SCENARIOS}
          onChange={(v) => setTweak('scenario', v)} />
        <TweakSlider label="Resend countdown" value={t.countdown} min={10} max={90} step={5} unit="s"
          onChange={(v) => setTweak('countdown', v)} />
      </TweaksPanel>
    </div>
  );
}

// stage scaling so the phone fits any viewport
function Stage() {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const pad = 40;
      const s = Math.min((window.innerWidth - pad) / 390, (window.innerHeight - pad) / 844, 1.1);
      setScale(s);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div ref={wrapRef} style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
      <App />
    </div>
  );
}

// shared style objects
const bodyStyle = { padding: '4px 12px 14px', display: 'flex', flexDirection: 'column', gap: 14 };
const introStyle = { fontFamily: 'var(--font-text)', fontSize: 12, color: 'var(--cod-text-muted)', lineHeight: 1.5, margin: 0 };
const boldNote = { fontFamily: 'var(--font-text)', fontWeight: 700, fontSize: 12, color: 'var(--cod-black)', margin: 0 };

// keyframes
const styleEl = document.createElement('style');
styleEl.textContent = `
@keyframes cod-spin { to { transform: rotate(360deg); } }
@keyframes cod-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
`;
document.head.appendChild(styleEl);

ReactDOM.createRoot(document.getElementById('stage')).render(<Stage />);
