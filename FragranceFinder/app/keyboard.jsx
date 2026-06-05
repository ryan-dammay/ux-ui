// Functional iOS-style keyboard. Calls onKey / onBackspace / onSpace / onSubmit.
const { useState: useStateKb } = React;

function IOSKeyboardLive({ onKey, onBackspace, onSpace, onSubmit, canSubmit }) {
  const [shift, setShift] = useStateKb(true);
  const [num, setNum] = useStateKb(false);

  const letterRows = [
    "qwertyuiop".split(""),
    "asdfghjkl".split(""),
    "zxcvbnm".split(""),
  ];
  const numRows = [
    "1234567890".split(""),
    "-/:;()$&@\"".split(""),
    ".,?!'".split(""),
  ];
  const rows = num ? numRows : letterRows;

  const press = (ch) => {
    onKey(num ? ch : (shift ? ch.toUpperCase() : ch));
    if (shift && !num) setShift(false);
  };

  const Key = ({ label, onClick, flex = 1, wide, dark, glyph }) => (
    <button onMouseDown={(e) => { e.preventDefault(); onClick(); }} style={{
      flex: wide ? `0 0 ${wide}px` : flex, height: 42, borderRadius: 5,
      background: dark ? "rgba(140,144,152,0.55)" : "#fff",
      boxShadow: "0 1px 0 rgba(0,0,0,0.28)", border: "none", cursor: "pointer",
      fontFamily: "-apple-system,system-ui", fontSize: glyph ? 16 : 22, fontWeight: 400,
      color: "#000", display: "flex", alignItems: "center", justifyContent: "center",
      WebkitTapHighlightColor: "transparent", minWidth: 0, userSelect: "none",
    }}>{label}</button>
  );

  return (
    <div style={{
      background: "#d1d4db", padding: "8px 3px 26px", display: "flex", flexDirection: "column", gap: 9,
      flex: "0 0 auto",
    }}>
      <div style={{ display: "flex", gap: 5, padding: "0 3px" }}>
        {rows[0].map(c => <Key key={c} label={num ? c : (shift ? c.toUpperCase() : c)} onClick={() => press(c)} />)}
      </div>
      <div style={{ display: "flex", gap: 5, padding: num ? "0 3px" : "0 18px" }}>
        {rows[1].map(c => <Key key={c} label={num ? c : (shift ? c.toUpperCase() : c)} onClick={() => press(c)} />)}
      </div>
      <div style={{ display: "flex", gap: 5, padding: "0 3px", alignItems: "center" }}>
        {!num && <Key wide={42} dark glyph label={<svg width="20" height="17" viewBox="0 0 20 17"><path d="M10 1L1.5 9.5H6V16h8V9.5h4.5L10 1z" fill={shift ? "#000" : "none"} stroke="#000" strokeWidth="1.4" strokeLinejoin="round" /></svg>} onClick={() => setShift(s => !s)} />}
        {num && <Key wide={42} dark glyph label="#+=" onClick={() => {}} />}
        <div style={{ flex: 1, display: "flex", gap: 5 }}>
          {rows[2].map(c => <Key key={c} label={num ? c : (shift ? c.toUpperCase() : c)} onClick={() => press(c)} />)}
        </div>
        <Key wide={42} dark glyph label={<svg width="24" height="17" viewBox="0 0 24 17"><path d="M8 1.5h13a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5H8L1.5 8.5 8 1.5z" fill="none" stroke="#000" strokeWidth="1.4" strokeLinejoin="round" /><path d="M11 6l6 5M17 6l-6 5" stroke="#000" strokeWidth="1.4" strokeLinecap="round" /></svg>} onClick={onBackspace} />
      </div>
      <div style={{ display: "flex", gap: 5, padding: "0 3px", alignItems: "center" }}>
        <Key wide={42} dark glyph label="123" onClick={() => setNum(n => !n)} />
        <Key wide={34} dark glyph label="😊" onClick={() => {}} />
        <Key label="space" glyph onClick={onSpace} flex={1} />
        <button onMouseDown={(e) => { e.preventDefault(); if (canSubmit) onSubmit(); }} style={{
          flex: "0 0 80px", height: 42, borderRadius: 5, border: "none",
          background: canSubmit ? "#000" : "rgba(140,144,152,0.55)", color: canSubmit ? "#fff" : "#000",
          fontFamily: "-apple-system,system-ui", fontSize: 16, fontWeight: 500, cursor: "pointer",
          boxShadow: "0 1px 0 rgba(0,0,0,0.28)", WebkitTapHighlightColor: "transparent",
        }}>Send</button>
      </div>
    </div>
  );
}

Object.assign(window, { IOSKeyboardLive });
