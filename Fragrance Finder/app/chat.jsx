// Fragrance Finder bottom sheet — welcome state, AI conversation, recommendation carousel.
const { useState: useStateCh, useEffect: useEffectCh, useRef: useRefCh } = React;

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "6px 2px" }}>
      {[0, 1, 2].map(i => (
        <span key={i} className="ff-typing-dot" style={{
          width: 7, height: 7, borderRadius: 99, background: "#b8b8b8",
          animation: `ffBounce 1.2s ${i * 0.16}s infinite ease-in-out`,
        }} />
      ))}
    </div>
  );
}

function SentBubble({ text }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", margin: "4px 0" }}>
      <div style={{
        maxWidth: "78%", background: "#ececec", color: "#000", fontSize: 14.5, lineHeight: 1.4,
        padding: "10px 14px", borderRadius: "18px 18px 4px 18px",
      }}>{text}</div>
    </div>
  );
}

function ReceivedMessage({ text, recs, onTapProduct }) {
  return (
    <div style={{ margin: "10px 0", maxWidth: "92%" }}>
      <div style={{ fontSize: 14.5, lineHeight: 1.5, color: "#000", whiteSpace: "pre-wrap" }}>{text}</div>
      {recs && recs.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.4, color: "#9a9a9a", marginBottom: 10 }}>OUR RECOMMENDATIONS</div>
          <div className="no-scrollbar" style={{ display: "flex", gap: 12, overflowX: "auto", margin: "0 -16px", padding: "0 16px 4px" }}>
            {recs.map((p, i) => (
              <div key={i} style={{ flex: "0 0 142px" }}>
                <ProductCard p={p} index={i} compact onTap={onTapProduct} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WelcomeState({ quickQueries, onPick }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100%", padding: "20px 24px 8px", textAlign: "center" }}>
      <h2 style={{ margin: 0, flexShrink: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 40, lineHeight: 1.1, letterSpacing: 0.3, color: "#000", whiteSpace: "nowrap" }}>Find your<br />perfect scent</h2>
      <p style={{ margin: "16px 0 0", flexShrink: 0, fontSize: 14, lineHeight: 1.45, color: "#3a3a3a", maxWidth: 280 }}>Curated by fragrance experts to help you find a scent that feels like you</p>
      <div className="no-scrollbar" style={{ display: "flex", gap: 10, marginTop: 22, overflowX: "auto", maxWidth: "100%", padding: "2px 2px 4px", alignSelf: "stretch", justifyContent: "flex-start", flexShrink: 0 }}>
        {quickQueries.map((q, i) => (
          <button key={i} onClick={() => onPick(q)} style={{
            flex: "0 0 auto", whiteSpace: "nowrap", fontSize: 14, padding: "12px 16px", borderRadius: 12,
            border: "1px solid #d7d7d7", background: "#fff", color: "#000", cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
          }}>{q}</button>
        ))}
      </div>
    </div>
  );
}

const FOLLOWUPS = ["Tell me about scent families", "Something lighter for daytime", "An elegant gift idea"];

function ChatSheet({ open, onClose, detent, quickQueries, onOpenProduct }) {
  const F = window.FRAME;
  const [messages, setMessages] = useStateCh([]);
  const [input, setInput] = useStateCh("");
  const [typing, setTyping] = useStateCh(false);
  const [kbOpen, setKbOpen] = useStateCh(true);
  const [drag, setDrag] = useStateCh(0);
  const dragRef = useRefCh({ active: false, startY: 0 });
  const scrollRef = useRefCh(null);
  const inputRef = useRefCh(null);

  const topOffset = detent === "half" ? Math.round(F.SCREEN_H * 0.46) : 64;
  const sheetH = F.SCREEN_H - F.STATUS_H - topOffset;
  const welcome = messages.length === 0 && !typing;

  // focus input shortly after opening
  useEffectCh(() => {
    if (open) {
      setKbOpen(true);
      const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 460);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffectCh(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing, kbOpen]);

  const send = async (raw) => {
    const t = (raw != null ? raw : input).trim();
    if (!t || typing) return;
    const prior = messages;
    setMessages(m => [...m, { role: "user", text: t }]);
    setInput("");
    setTyping(true);
    const res = await window.askFragranceFinder(prior, t);
    setMessages(m => [...m, { role: "assistant", text: res.reply, recs: res.recs }]);
    setTyping(false);
  };

  // drag-to-dismiss on the handle
  const onHandleDown = (e) => {
    dragRef.current = { active: true, startY: (e.touches ? e.touches[0].clientY : e.clientY) };
    window.addEventListener("mousemove", onHandleMove);
    window.addEventListener("mouseup", onHandleUp);
    window.addEventListener("touchmove", onHandleMove, { passive: false });
    window.addEventListener("touchend", onHandleUp);
  };
  const onHandleMove = (e) => {
    if (!dragRef.current.active) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    setDrag(Math.max(0, y - dragRef.current.startY));
  };
  const onHandleUp = () => {
    window.removeEventListener("mousemove", onHandleMove);
    window.removeEventListener("mouseup", onHandleUp);
    window.removeEventListener("touchmove", onHandleMove);
    window.removeEventListener("touchend", onHandleUp);
    const d = drag;
    dragRef.current.active = false;
    setDrag(0);
    if (d > 110) onClose();
  };

  const translate = open ? drag : (sheetH + 80);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 80, pointerEvents: open ? "auto" : "none" }}>
      {/* scrim */}
      <div onClick={onClose} style={{
        position: "absolute", inset: 0, background: "rgba(0,0,0,0.32)",
        opacity: open ? 1 : 0, transition: "opacity 0.4s ease",
      }} />
      {/* sheet */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: sheetH,
        background: "#fff", borderRadius: "16px 16px 0 0", overflow: "hidden",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
        transform: `translateY(${translate}px)`,
        transition: dragRef.current.active ? "none" : "transform 0.5s cubic-bezier(0.32,0.72,0,1)",
        display: "flex", flexDirection: "column",
      }}>
        {/* header + grabber */}
        <div onMouseDown={onHandleDown} onTouchStart={onHandleDown} style={{ flex: "0 0 auto", cursor: "grab", paddingTop: 8, userSelect: "none" }}>
          <div style={{ width: 40, height: 5, borderRadius: 99, background: "#dcdcdc", margin: "0 auto" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", height: 46, padding: "0 12px" }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: "#000" }}>Fragrance Finder</span>
          </div>
          <div style={{ height: 1, background: "#f0f0f0" }} />
        </div>

        {/* body */}
        <div ref={scrollRef} onScroll={() => { if (kbOpen && !welcome) setKbOpen(false); }} style={{
          flex: 1, overflowY: "auto", background: welcome ? "#fff" : "#fafafa",
          padding: welcome ? 0 : "8px 16px 12px",
        }} className="screen-scroll">
          {welcome ? (
            <WelcomeState quickQueries={quickQueries} onPick={(q) => send(q)} />
          ) : (
            <div>
              {messages.map((m, i) => (
                m.role === "user"
                  ? <SentBubble key={i} text={m.text} />
                  : <ReceivedMessage key={i} text={m.text} recs={m.recs} onTapProduct={onOpenProduct} />
              ))}
              {typing && <ReceivedTyping />}
              {!typing && messages.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                  {FOLLOWUPS.map((f, i) => (
                    <button key={i} onClick={() => send(f)} style={{
                      fontSize: 13, padding: "8px 13px", borderRadius: 99, border: "1px solid #d7d7d7",
                      background: "#fff", color: "#000", cursor: "pointer", WebkitTapHighlightColor: "transparent",
                    }}>{f}</button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* composer */}
        <div style={{ flex: "0 0 auto", background: "#fff", borderTop: "1px solid #f0f0f0", padding: "10px 16px 8px" }}>
          <div onClick={() => { setKbOpen(true); inputRef.current && inputRef.current.focus(); }} style={{
            display: "flex", alignItems: "center", gap: 8, border: "1px solid #cbcbcb", borderRadius: 24,
            padding: "4px 4px 4px 16px", background: "#fff",
          }}>
            <input ref={inputRef} value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setKbOpen(true)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); send(); } }}
              placeholder="Ask for the perfect scent"
              style={{ flex: 1, border: "none", outline: "none", fontSize: 15, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: "#000", background: "transparent", minWidth: 0 }} />
            <button onClick={() => send()} disabled={!input.trim()} style={{
              flex: "0 0 auto", width: 40, height: 40, borderRadius: 99, border: "none",
              background: input.trim() ? "#000" : "#e4e4e4", color: input.trim() ? "#fff" : "#aaa",
              cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s ease", WebkitTapHighlightColor: "transparent",
            }}>
              <Icons.SendArrow size={20} sw={2.1} />
            </button>
          </div>
          {welcome && (
            <p style={{ margin: "8px 2px 0", fontSize: 11.5, lineHeight: 1.35, color: "#9a9a9a" }}>By using our fragrance finder, you're accepting our Terms &amp; Conditions and Privacy &amp; Cookie Policy.</p>
          )}
        </div>

        {/* keyboard */}
        <div style={{
          flex: "0 0 auto", maxHeight: kbOpen ? 290 : 0, overflow: "hidden",
          transition: "max-height 0.34s cubic-bezier(0.32,0.72,0,1)",
        }}>
          <IOSKeyboardLive
            onKey={(c) => setInput(v => v + c)}
            onBackspace={() => setInput(v => v.slice(0, -1))}
            onSpace={() => setInput(v => v + " ")}
            onSubmit={() => send()}
            canSubmit={!!input.trim()}
          />
        </div>
      </div>
    </div>
  );
}

function ReceivedTyping() {
  return (
    <div style={{ margin: "10px 0" }}>
      <TypingDots />
    </div>
  );
}

Object.assign(window, { ChatSheet });
