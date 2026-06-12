// assistant-view.jsx — presentational shell for the assistant (Classic).
function AssistantView(p) {
  const { th, themeKey, Ic, UI, D, device, messages, typing, replies, input, setInput, submit,
    onClose, bagCount, menuOpen, setMenuOpen, MENU_ITEMS, WELCOME_ACTIONS, addToBag, showDetails, welcome,
    phase, finishOnboarding, saveTranscript } = p;
  const avatar =
  <span style={{ flex: '0 0 auto', width: 28, height: 28, borderRadius: '50%', background: '#000', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic.ShopBot size={17} stroke={1.6} /></span>;


  function renderMsg(m) {
    if (m.who === 'user') return <UI.Row key={m.id} who="user" th={th}><UI.TextBubble who="user" th={th} text={m.text} /></UI.Row>;
    const inner = (() => {
      switch (m.kind) {
        case 'text':return <UI.TextBubble who="bot" th={th} text={m.text} />;
        case 'agentmsg':return (
          <div style={{ background: th.botBg, color: th.botText, borderRadius: th.bubbleR, padding: '11px 14px', fontSize: 13.5, lineHeight: 1.55,
            borderLeft: `2px solid ${th.accent}` }}>
            <div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 700, color: th.accent, marginBottom: 5 }}>Layla · Client Care</div>
            {m.text}
          </div>);
        case 'bullets':return (
          <div style={{ background: th.botBg, color: th.botText, borderRadius: th.bubbleR, padding: '11px 15px 12px', fontSize: 13.5, lineHeight: 1.5 }}>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {m.items.map((it, k) =>
              <li key={k} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <span style={{ flex: '0 0 auto', width: 5, height: 5, borderRadius: '50%', background: th.accent, marginTop: 7 }} />
                <span>{it}</span>
              </li>)}
            </ul>
          </div>);
        case 'offline':return <OfflineCard th={th} Ic={Ic} onCloseChat={onClose} onSave={saveTranscript} />;
        case 'note':return <div style={{ background: th.botBubble ? th.botBg : 'transparent', borderLeft: `2px solid ${th.accent}`,
            padding: '10px 13px', fontSize: 13.5, lineHeight: 1.55, color: th.botText, borderRadius: th.botBubble ? th.bubbleR : 0,
            fontFamily: th.botSerif ? 'var(--serif)' : 'var(--sans)' }}>{m.text}</div>;
        case 'carousel':return <UI.Carousel items={m.items} data={D} th={th} icons={Ic} onAdd={addToBag} onDetails={showDetails} />;
        case 'added':return <UI.AddedCard prod={m.prod} th={th} icons={Ic} onBag={() => {}} />;
        case 'detail':return <UI.DetailCard prod={m.prod} data={D} th={th} icons={Ic} onAdd={addToBag} />;
        case 'bnpl':return <UI.BnplCard pay={D.PAYMENTS[m.which]} amount={m.amount} th={th} icons={Ic} />;
        case 'stores':return <UI.StoresCard faq={m.faq} th={th} icons={Ic} />;
        case 'agent':return <UI.AgentCard th={th} icons={Ic} stage={m.stage} />;
        case 'link':return <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
            padding: 0, color: th.text, fontSize: 11.5, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
            textDecoration: 'underline', textUnderlineOffset: 4 }}>{m.text} <Ic.ChevR size={13} /></button>;
        default:return null;
      }
    })();
    const wide = m.kind === 'carousel';
    return <UI.Row key={m.id} who="bot" th={th} avatar={avatar}>{wide ? <div style={{ width: device === 'desktop' ? 360 : 'min(78vw,330px)' }}>{inner}</div> : inner}</UI.Row>;
  }

  const onboarding = phase === 'onboard';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: th.panelBg, color: th.text,
      fontFamily: 'var(--sans)', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ flex: '0 0 auto', background: th.headerBg, color: th.headerText,
        padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 11 }}>
        {onboarding ? <span style={{ width: 28 }} /> :
        <button onClick={() => setMenuOpen((v) => !v)} aria-label="Menu" style={iconBtn(th.headerText)}><Ic.Menu size={20} /></button>}
        <div style={{ flex: 1, textAlign: 'center', lineHeight: 1.15 }}>
          <div style={{ fontFamily: 'var(--serif)', letterSpacing: '.26em', fontSize: 14, textIndent: '.26em', fontWeight: 500 }}>COACH</div>
          <div style={{ fontSize: 9.5, letterSpacing: '.18em', textTransform: 'uppercase', color: th.headerSub, marginTop: 2 }}>Shopping Assistant</div>
        </div>
        <button onClick={onClose} aria-label="Close" style={iconBtn(th.headerText)}><Ic.Close size={20} /></button>
      </div>

      {onboarding ? <Onboarding th={th} Ic={Ic} onDone={finishOnboarding} /> : <>
        {/* Scroll area */}
        <div ref={p.scrollRef} className="ca-scroll" style={{ flex: 1, overflowY: 'auto', padding: '18px 14px 10px', display: 'flex', flexDirection: 'column', gap: 13 }}>
          {welcome ? <Welcome th={th} Ic={Ic} actions={WELCOME_ACTIONS} avatar={avatar} /> : messages.map(renderMsg)}
          {typing && <UI.Row who="bot" th={th} avatar={avatar}><UI.Dots th={th} /></UI.Row>}
          {!welcome && !typing && replies.length > 0 && <RepliesInline replies={replies} th={th} />}
        </div>

        {/* Input */}
        <div style={{ flex: '0 0 auto', borderTop: `1px solid ${th.line}`, background: th.panelBg, padding: '10px 12px calc(10px + env(safe-area-inset-bottom))' }}>
          <form onSubmit={(e) => {e.preventDefault();submit(input);}} style={{ display: 'flex', alignItems: 'center', gap: 8,
            border: `1px solid ${th.inputBorder}`, borderRadius: '2px', background: th.inputBg, padding: '4px 4px 4px 14px' }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything…"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: th.text, fontSize: 13.5, fontFamily: 'var(--sans)', minWidth: 0 }} />
            <button type="button" aria-label="Voice" style={{ ...iconBtn(th.sub), padding: 6 }}><Ic.Mic size={18} /></button>
            <button type="submit" aria-label="Send" style={{ flex: '0 0 auto', width: 36, height: 36, borderRadius: '2px',
              border: 'none', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Ic.Send size={18} /></button>
          </form>
          <div style={{ textAlign: 'center', fontSize: 9.5, color: th.sub, marginTop: 8, letterSpacing: '.04em' }}>Powered by Coach · Replies are typically instant</div>
        </div>
      </>}

      {/* Menu sheet */}
      {menuOpen && !onboarding &&
      <div onClick={() => setMenuOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.32)', zIndex: 5, display: 'flex', alignItems: 'flex-start' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: th.panelBg, color: th.text, width: '82%', maxWidth: 300, height: '100%',
          boxShadow: '2px 0 24px rgba(0,0,0,.25)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 18px', borderBottom: `1px solid ${th.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10.5, letterSpacing: '.2em', textTransform: 'uppercase', color: th.sub, fontWeight: 700 }}>How can I help?</span>
              <button onClick={() => setMenuOpen(false)} style={iconBtn(th.text)}><Ic.Close size={18} /></button>
            </div>
            <div style={{ padding: '6px 0', overflowY: 'auto' }}>
              {MENU_ITEMS.map((it, i) =>
            <button key={i} onClick={it.run} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none',
              padding: '13px 18px', fontSize: 14, color: th.text, cursor: 'pointer', fontFamily: 'var(--sans)',
              borderBottom: i < MENU_ITEMS.length - 1 ? `1px solid ${th.line}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {it.label} <span style={{ color: th.sub }}><Ic.ChevR size={15} /></span>
                </button>
            )}
            </div>
          </div>
        </div>}
    </div>);

}

// Quick replies rendered INLINE, under the latest question
function RepliesInline({ replies, th }) {
  const isColor = replies.some((r) => r.dot);
  if (isColor) {
    return (
      <div className="ca-msg-in" style={{ marginLeft: 37, display: 'block', maxWidth: 260, paddingTop: 1 }}>
        {replies.map((r, i) =>
        <button key={i} onClick={r.run} className="ca-hl" style={{ display: 'block', width: '100%', textAlign: 'left',
          border: 'none', background: 'none', cursor: 'pointer', padding: 0, marginBottom: i < replies.length - 1 ? 14 : 0 }}>
          <span className="ca-hl-line" style={{ width: '100%', height: 26, background: r.dot, borderRadius: '3px', display: 'block' }} />
          <span style={{ display: 'block', fontSize: 13, color: th.text, letterSpacing: '.02em', marginTop: 8 }}>{r.label}</span>
        </button>)}
      </div>);
  }
  return (
    <div className="ca-msg-in" style={{ marginLeft: 37, display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 1, alignItems: 'center' }}>
      {replies.map((r, i) =>
      <button key={i} onClick={r.run} style={{ display: 'inline-flex', alignItems: 'center', gap: 7,
        border: r.ghost ? `1px dashed ${th.chip.border.split(' ').pop()}` : th.chip.border, borderRadius: th.chip.radius,
        background: th.chip.bg, color: th.chip.text, padding: '9px 15px', fontSize: 12.5, cursor: 'pointer', whiteSpace: 'nowrap',
        fontFamily: 'var(--sans)', letterSpacing: '.01em' }}>{r.label}</button>)}
    </div>);

}

// One-time swipeable value-prop intro
function Onboarding({ th, Ic, onDone }) {
  const slides = [
  { img: window.assetURL('assets/img/brooklyn-rust.jpg'), title: 'Find your next bag', body: 'Tell me a colour, a style or a budget — I’ll bring the pieces straight to you.' },
  { img: window.assetURL('assets/img/tabby-brown.jpg'), title: 'Find the perfect gift', body: 'Share who it’s for and the occasion, and I’ll curate a considered few.' },
  { img: window.assetURL('assets/img/icon-lana.jpg'), title: 'Here to help', body: 'Tabby & Tamara, delivery, returns, store hours, or a chat with our Customer Care team — just ask, anytime.' }];

  const [i, setI] = React.useState(0);
  const startX = React.useRef(null);
  const go = (n) => setI(Math.max(0, Math.min(slides.length - 1, n)));
  const down = (e) => {startX.current = e.touches ? e.touches[0].clientX : e.clientX;};
  const up = (e) => {if (startX.current == null) return;const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;const dx = x - startX.current;if (dx < -40) go(i + 1);else if (dx > 40) go(i - 1);startX.current = null;};
  const last = i === slides.length - 1;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: th.panelBg, minHeight: 0 }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }} onPointerDown={down} onPointerUp={up} onTouchStart={down} onTouchEnd={up}>
        <div style={{ display: 'flex', height: '100%', transform: `translateX(-${i * 100}%)`, transition: 'transform .42s cubic-bezier(.22,.8,.2,1)' }}>
          {slides.map((s, idx) =>
          <div key={idx} style={{ flex: '0 0 100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 30px', textAlign: 'center' }}>
              <div style={{ width: '100%', maxWidth: 218, aspectRatio: '1/1', background: th.imgBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <img src={s.img} draggable="false" style={{ width: '80%', height: '80%', objectFit: 'contain', mixBlendMode: 'multiply', pointerEvents: 'none' }} />
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 23, lineHeight: 1.15, color: th.text, marginBottom: 10 }}>{s.title}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.6, color: th.sub, maxWidth: '28ch' }}>{s.body}</div>
            </div>
          )}
        </div>
      </div>
      <div style={{ flex: '0 0 auto', padding: '14px 20px calc(16px + env(safe-area-inset-bottom))', borderTop: `1px solid ${th.line}` }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginBottom: 15 }}>
          {slides.map((_, idx) =>
          <button key={idx} onClick={() => go(idx)} aria-label={'Slide ' + (idx + 1)} style={{ width: idx === i ? 20 : 7, height: 7, borderRadius: 99, border: 'none',
            background: idx === i ? '#111' : '#cfcbc2', cursor: 'pointer', transition: 'all .3s', padding: 0 }} />
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={onDone} style={{ flex: '0 0 auto', background: 'none', border: 'none', color: th.sub, fontSize: 11.5,
            letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer', padding: '13px 6px' }}>Skip</button>
          <button onClick={() => last ? onDone() : go(i + 1)} style={{ flex: 1, background: '#000', color: '#fff', border: 'none',
            padding: '14px 18px', fontSize: 11.5, letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer' }}>
            {last ? 'Get started' : 'Next'}</button>
        </div>
      </div>
    </div>);

}

function Welcome({ th, Ic, actions, avatar }) {
  return (
    <div className="ca-msg-in" style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 4 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        {avatar}
        <div style={{ background: th.botBg, borderRadius: th.bubbleR, padding: '12px 15px', fontSize: 14.5, lineHeight: 1.5, color: th.botText }}>
          Hello, I’m your Coach shopping assistant. How can I help today?
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginLeft: 37 }}>
        {actions.map((a) =>
        <button key={a.key} onClick={a.run} style={{ gridColumn: a.wide ? '1 / -1' : 'auto', textAlign: 'left', background: th.cardBg, border: `1.5px solid ${th.line}`, borderRadius: 4,
          padding: '13px 12px', cursor: 'pointer', display: 'flex', flexDirection: a.wide ? 'row' : 'column', alignItems: a.wide ? 'center' : 'stretch', gap: a.wide ? 12 : 9, minHeight: a.wide ? 0 : 96, fontFamily: 'var(--sans)' }}>
            <span style={{ color: th.accent, flex: '0 0 auto' }}><a.icon size={21} /></span>
            <span>
              <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: th.text, letterSpacing: '.01em' }}>{a.label}</span>
              <span style={{ display: 'block', fontSize: 11, color: th.sub, marginTop: 3, lineHeight: 1.35 }}>{a.sub}</span>
            </span>
          </button>
        )}
      </div>
    </div>);

}

function iconBtn(color) {return { background: 'none', border: 'none', color, cursor: 'pointer', padding: 4, display: 'flex',
    alignItems: 'center', justifyContent: 'center' };}

// Outside-working-hours escalation sheet
function OfflineCard({ th, Ic, onCloseChat, onSave }) {
  const [saved, setSaved] = React.useState(false);
  return (
    <div style={{ background: th.cardBg, border: `1px solid ${th.accent}`, borderRadius: th.cardR, padding: '16px 16px 15px', maxWidth: 320 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#b3321f' }} />
        <span style={{ fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 700, color: th.sub }}>Client Care is offline</span>
      </div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 17, color: th.text, marginBottom: 8 }}>Thanks for contacting Coach</div>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: th.sub, margin: '0 0 6px' }}>
        Our Customer Care team is currently offline. We’re available every day from <strong style={{ color: th.text }}>10am to 10pm UAE time</strong>. Please email us and we’ll get back to you as soon as possible.</p>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: th.sub, margin: '0 0 14px' }}>Speak soon.</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onCloseChat} style={{ ...UI_btnGhost(th), flex: 1, padding: '12px 10px' }}>Close chat</button>
        <button onClick={() => {setSaved(true);onSave && onSave();}} style={{ ...UI_btnSolid(th), flex: 1, padding: '13px 10px' }}>
          {saved ? 'Saved ✓' : 'Save transcript'}</button>
      </div>
    </div>);

}
function UI_btnSolid(th) {return { background: '#000', color: '#fff', border: 'none', borderRadius: '2px', padding: '12px 16px', fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer' };}
function UI_btnGhost(th) {return { background: 'none', color: th.text, border: `1px solid ${th.text}`, borderRadius: '2px', padding: '11px 16px', fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer' };}

window.AssistantView = AssistantView;
// Exposed for the component cheatsheet (single source of truth)
Object.assign(window, { COACH_VIEWPARTS: { Welcome, Onboarding, OfflineCard, RepliesInline, iconBtn } });