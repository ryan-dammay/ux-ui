// spec.jsx — AI Shopping Assistant component cheatsheet (renders the real components).
const { useState:useStateS } = React;
const UI = window.COACH_UI, Ic = window.COACH_ICONS, D = window.COACH_DATA, S = window.COACH_SITE;
const VP = window.COACH_VIEWPARTS;
const th = window.COACH_THEMES.classic;

// ---- layout primitives -----------------------------------------------------
function DTag({ k }) {
  const map = { both:['both','Mobile + Desktop'], mob:['mob','Mobile'], desk:['desk','Desktop'] };
  const [cls,label] = map[k] || map.both;
  return <span className={'dtag '+cls}>{label}</span>;
}
function Spec({ name, device='both', wide=false, span2=false, ground='checker', states, parts, note }) {
  return (
    <div className={'spec'+(span2?' span2':'')}>
      <div className="spec-h"><span className="nm">{name}</span><span className="dt"><DTag k={device} /></span></div>
      <div className={'canvas '+(ground==='plain'?'plain':ground==='panel'?'panel':'')}>
        {states.map((s,i)=>(
          <div className="state" key={i}>
            {s.label && <span className="lbl">{s.label}</span>}
            <div className="holder">{s.node}</div>
          </div>
        ))}
      </div>
      {(parts || note) &&
        <div className="meta">
          {parts && <><h5>Parts</h5><ul className="parts">{parts.map((p,i)=><li key={i}>{p}</li>)}</ul></>}
          {note && <p className="note" dangerouslySetInnerHTML={{__html:note}} />}
        </div>}
    </div>
  );
}
function Section({ n, title, desc, wide, children }) {
  return (
    <section>
      <div className="sec-h"><span className="n">{n}</span><h2>{title}</h2>{desc && <span className="d">{desc}</span>}</div>
      <div className={'grid'+(wide?' wide':'')}>{children}</div>
    </section>
  );
}

// ---- shared bits -----------------------------------------------------------
const avatar = (
  <span style={{flex:'0 0 auto',width:28,height:28,borderRadius:'50%',background:'#000',color:'#fff',
    display:'flex',alignItems:'center',justifyContent:'center'}}><Ic.Chat size={15} stroke={1.7} /></span>
);
const P = D.byId('brooklyn-brown'), PSale = D.byId('brooklyn-rust'), PNew = D.byId('lana-rust');
const noop = ()=>{};

// faithful replicas of inline shell pieces (header / input / footer / menu) ---
function ShellHeader() {
  return (
    <div style={{background:'#000',color:'#fff',padding:'13px 14px',display:'flex',alignItems:'center',gap:11}}>
      <button style={{background:'none',border:'none',color:'#fff',padding:4,display:'flex',cursor:'pointer'}}><Ic.Menu size={20} /></button>
      <div style={{flex:1,textAlign:'center',lineHeight:1.15}}>
        <div style={{fontFamily:'var(--serif)',letterSpacing:'.26em',fontSize:14,textIndent:'.26em',fontWeight:500}}>COACH</div>
        <div style={{fontSize:9.5,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(255,255,255,.6)',marginTop:2}}>Shopping Assistant</div>
      </div>
      <button style={{background:'none',border:'none',color:'#fff',padding:4,display:'flex',cursor:'pointer'}}><Ic.Close size={20} /></button>
    </div>
  );
}
function InputBar({ value='', focus=false }) {
  return (
    <form onSubmit={e=>e.preventDefault()} style={{display:'flex',alignItems:'center',gap:8,
      border:`1px solid ${focus?'#111':th.inputBorder}`,borderRadius:'2px',background:'#fff',padding:'4px 4px 4px 14px',width:260}}>
      <input defaultValue={value} placeholder="Ask me anything…" style={{flex:1,border:'none',outline:'none',background:'transparent',
        color:th.text,fontSize:13.5,fontFamily:'var(--sans)',minWidth:0}} />
      <button type="button" style={{background:'none',border:'none',color:th.sub,padding:6,display:'flex',cursor:'pointer'}}><Ic.Mic size={18} /></button>
      <button type="submit" style={{width:36,height:36,borderRadius:'2px',border:'none',background:'#000',color:'#fff',
        display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}><Ic.Send size={18} /></button>
    </form>
  );
}
function Footer() {
  return <div style={{textAlign:'center',fontSize:9.5,color:th.sub,letterSpacing:'.04em',width:240}}>Powered by Coach · Replies are typically instant</div>;
}
const MENU_ITEMS = ['Find a bag','Find a gift','Payments & BNPL','Delivery','Returns','Store locations','Talk to a person','Start over'];
function MenuList() {
  return (
    <div style={{background:'#fff',width:240,border:`1px solid ${th.line}`}}>
      <div style={{padding:'14px 16px',borderBottom:`1px solid ${th.line}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:10,letterSpacing:'.2em',textTransform:'uppercase',color:th.sub,fontWeight:700}}>How can I help?</span>
        <Ic.Close size={16} />
      </div>
      {MENU_ITEMS.map((it,i)=>(
        <div key={i} style={{padding:'12px 16px',fontSize:13.5,display:'flex',justifyContent:'space-between',alignItems:'center',
          borderBottom:i<MENU_ITEMS.length-1?`1px solid ${th.line}`:'none'}}>{it}<span style={{color:th.sub}}><Ic.ChevR size={14} /></span></div>
      ))}
    </div>
  );
}

// welcome action set (matches the prototype)
const WELCOME_ACTIONS = [
  { key:'find', label:'Find a bag', sub:'By colour, style or budget', icon:Ic.Search, run:noop },
  { key:'gift', label:'Find a gift', sub:'For someone special', icon:Ic.Gift, run:noop },
  { key:'pay',  label:'Payments & BNPL', sub:'Tabby, Tamara & methods', icon:Ic.Card, run:noop },
  { key:'faq',  label:'Delivery & returns', sub:'Shipping, returns, stores', icon:Ic.Truck, run:noop },
];

// quick-reply sets
const chipReplies = [{label:'Refine my search',run:noop},{label:'Show gifts instead',run:noop},{label:'Talk to a stylist',run:noop}];
const colorReplies = D.COLOR_OPTIONS.map(c=>({label:c.label,dot:c.hex,run:noop}));

// ---- buttons (spec-recommended states) -------------------------------------
function Btn({ kind='solid', state='default', label }) {
  const base = kind==='solid' ? UI.btnSolid(th) : UI.btnGhost(th);
  const st = { ...base, padding:'12px 18px', cursor:'pointer' };
  if (state==='hover')   st.opacity = kind==='solid' ? .9 : 1, kind==='ghost' && (st.background='#111', st.color='#fff');
  if (state==='disabled')st.opacity = .4, st.cursor='not-allowed';
  return <button style={st}>{label}</button>;
}

// ===========================================================================
function Sheet() {
  return (
    <div id="root-inner">
      <div className="mast">
        <div className="wm">COACH</div>
        <h1>AI Shopping Assistant — Components</h1>
        <div className="sub">Handoff cheatsheet · Parts &amp; states · Mobile + Desktop · Classic direction</div>
        <div className="legend">
          <span><b>How to read:</b> each card shows a component, its named <b>parts</b>, and every <b>state</b>.</span>
          <span><DTag k="both" /> identical across breakpoints</span>
          <span><DTag k="mob" /> mobile-specific</span>
          <span><DTag k="desk" /> desktop-specific</span>
        </div>
      </div>

      {/* FOUNDATIONS */}
      <Section n="00" title="Foundations" desc="Tokens the components are built from. Full rationale in the Context skill.">
        <div className="spec span2">
          <div className="spec-h"><span className="nm">Colour &amp; type tokens</span><span className="dt"><DTag k="both" /></span></div>
          <div className="canvas plain" style={{display:'block'}}>
            <div className="tokens">
              {[['Ink','#111111'],['Paper','#ffffff'],['Bot bubble','#f0eee8'],['Image ground','#efeeec'],['Gold accent','#9a7b3f'],['Sale','#b3321f'],['Line','#d4cdbf']].map(([n,h])=>(
                <div className="tok" key={n}><span className="sw" style={{background:h}} /><span className="tx"><b>{n}</b><span>{h}</span></span></div>
              ))}
            </div>
            <p className="note" style={{marginTop:14}}><b>Type:</b> Helvetica Neue (UI + labels, uppercase tracked) · Newsreader serif (wordmark + product names). <b>Corners:</b> square. <b>Accent:</b> gold for confirmations/active only; red for sale prices only.</p>
          </div>
        </div>
      </Section>

      {/* ENTRY & SHELL */}
      <Section n="01" title="Entry &amp; chat shell" desc="The container chrome. Panel differs by breakpoint; header, input and menu are shared.">
        <Spec name="Launcher bubble" device="both" ground="checker"
          parts={['button','message icon','pulse ring']}
          note="Tap-only entry, bottom-right. <b>Idle</b> shows a soft pulsing ring; suppressed while open."
          states={[
            {label:'Idle', node:<div style={{position:'relative',width:64,height:64,display:'flex',alignItems:'center',justifyContent:'center'}}><S.Launcher th={th} Ic={Ic} pulse={true} onClick={noop} /></div>},
            {label:'Hover', node:<div style={{position:'relative',width:64,height:64,display:'flex',alignItems:'center',justifyContent:'center',transform:'scale(1.06)'}}><S.Launcher th={th} Ic={Ic} pulse={false} onClick={noop} /></div>},
          ]} />

        <Spec name="Header" device="both" ground="plain"
          parts={['≡ menu','COACH wordmark','“Shopping Assistant” label','close ✕']}
          note="Black bar, serif wordmark. Identical on mobile sheet &amp; desktop dock."
          states={[{node:<div style={{width:280}}><ShellHeader /></div>}]} />

        <Spec name="Input bar" device="both" ground="plain"
          parts={['text field','placeholder','mic','send']}
          note="Always available alongside chips. Square send button."
          states={[
            {label:'Empty', node:<InputBar />},
            {label:'Focused', node:<InputBar focus={true} />},
            {label:'With text', node:<InputBar value="black crossbody under 2000" />},
          ]} />

        <Spec name="Footer caption" device="both" ground="plain"
          parts={['caption']} states={[{node:<Footer />}]} />

        <Spec name="Shortcut menu" device="both" ground="checker"
          parts={['header','list item','chevron','divider']}
          note="Opened from ≡. Persistent shortcut to any flow, a human, or restart. Slides in over the thread."
          states={[{node:<MenuList />}]} />

        <Spec name="Panel container — Mobile" device="mob" ground="checker" span2={false}
          parts={['bottom sheet','header','thread','input dock']}
          note="Full-height <b>bottom sheet</b> that slides up over the storefront."
          states={[{node:
            <div className="phone"><div className="scr">
              <ShellHeader />
              <div style={{flex:1,padding:'14px',fontSize:12,color:th.sub,display:'flex',alignItems:'center',justifyContent:'center'}}>conversation thread</div>
              <div style={{borderTop:`1px solid ${th.line}`,padding:'10px 12px',display:'flex',justifyContent:'center'}}><InputBar /></div>
            </div></div>
          }]} />

        <Spec name="Panel container — Desktop" device="desk" ground="checker"
          parts={['docked panel','header','thread','input dock']}
          note="<b>Docked panel</b> (≈394×636), bottom-right, over the site."
          states={[{node:
            <div className="dock">
              <ShellHeader />
              <div style={{flex:1,padding:'14px',fontSize:12,color:th.sub,display:'flex',alignItems:'center',justifyContent:'center'}}>conversation thread</div>
              <div style={{borderTop:`1px solid ${th.line}`,padding:'10px 12px',display:'flex',justifyContent:'center'}}><InputBar /></div>
            </div>
          }]} />
      </Section>

      {/* ONBOARDING & WELCOME */}
      <Section n="02" title="Onboarding &amp; welcome" desc="First-run intro (shown once) and the welcome menu.">
        <Spec name="Onboarding intro" device="both" ground="checker" span2={true}
          parts={['slide','image','title','body','pagination dots','Skip','Next / Get started']}
          note="One-time swipeable intro (3 slides), persisted in localStorage. Replay via Tweaks. Live — drag or tap Next."
          states={[{node:<div style={{width:300,height:430,border:`1px solid ${th.line}`,display:'flex',flexDirection:'column',background:'#fff',overflow:'hidden'}}><VP.Onboarding th={th} Ic={Ic} onDone={noop} /></div>}]} />

        <Spec name="Welcome" device="both" ground="panel" span2={true}
          parts={['avatar','greeting bubble','action card ×4','card icon','card title','card subtitle']}
          note="Greeting + 2×2 quick-start actions: Find a bag · Find a gift · Payments &amp; BNPL · Delivery &amp; returns."
          states={[{node:<div style={{width:340,padding:'4px 6px'}}><VP.Welcome th={th} Ic={Ic} actions={WELCOME_ACTIONS} avatar={avatar} /></div>}]} />
      </Section>

      {/* MESSAGES */}
      <Section n="03" title="Message types" desc="Everything that can appear in the thread. Identical across breakpoints.">
        <Spec name="Text bubble" device="both" ground="panel"
          parts={['avatar (bot)','bubble','text']}
          states={[
            {label:'Assistant', node:<UI.Row who="bot" th={th} avatar={avatar}><UI.TextBubble who="bot" th={th} text="Happy to help you find something special." /></UI.Row>},
            {label:'Customer', node:<div style={{display:'flex',justifyContent:'flex-end',width:240}}><UI.TextBubble who="user" th={th} text="A black crossbody, please" /></div>},
          ]} />

        <Spec name="Typing indicator" device="both" ground="panel"
          parts={['avatar','animated dots']}
          states={[{node:<UI.Row who="bot" th={th} avatar={avatar}><UI.Dots th={th} /></UI.Row>}]} />

        <Spec name="Note / system" device="both" ground="panel"
          parts={['left accent rule','text']}
          note="Confirmations &amp; system messages (e.g. gift wrap noted, transcript saved)."
          states={[{node:<div style={{background:th.botBg,borderLeft:`2px solid ${th.accent}`,padding:'10px 13px',fontSize:13.5,lineHeight:1.55,color:th.botText,maxWidth:280}}>Done — I’ve noted complimentary gift wrap and a handwritten card.</div>}]} />

        <Spec name="Bullet list" device="both" ground="panel"
          parts={['bubble','gold marker','item']}
          note="Used in payment-failure “common reasons” and voucher tips."
          states={[{node:<div style={{background:th.botBg,color:th.botText,borderRadius:th.bubbleR,padding:'11px 15px 12px',fontSize:13.5,lineHeight:1.5,maxWidth:280}}>
            <ul style={{margin:0,padding:0,listStyle:'none',display:'flex',flexDirection:'column',gap:7}}>
              {['Incorrect card details','Incorrect billing address','A temporary system issue','Insufficient funds'].map((x,i)=>(
                <li key={i} style={{display:'flex',gap:9,alignItems:'flex-start'}}><span style={{flex:'0 0 auto',width:5,height:5,borderRadius:'50%',background:th.accent,marginTop:7}} />{x}</li>))}
            </ul></div>}]} />

        <Spec name="Agent message" device="both" ground="panel"
          parts={['name label','bubble','left accent']}
          note="Layla’s lines after handover."
          states={[{node:<div style={{background:th.botBg,color:th.botText,borderRadius:th.bubbleR,padding:'11px 14px',fontSize:13.5,lineHeight:1.55,borderLeft:`2px solid ${th.accent}`,maxWidth:290}}>
            <div style={{fontSize:10,letterSpacing:'.14em',textTransform:'uppercase',fontWeight:700,color:th.accent,marginBottom:5}}>Layla · Client Care</div>
            Hi there! I’m Layla from the Coach Client Care team. Could you confirm your order number?</div>}]} />

        <Spec name="Link out" device="both" ground="panel"
          parts={['label','chevron']}
          note="Jumps to a full policy / catalogue page."
          states={[{node:<button style={{display:'inline-flex',alignItems:'center',gap:6,background:'none',border:'none',padding:0,color:th.text,fontSize:11.5,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:700,cursor:'pointer',textDecoration:'underline',textUnderlineOffset:4}}>Delivery &amp; shipping <Ic.ChevR size={13} /></button>}]} />
      </Section>

      {/* QUICK REPLIES & BUTTONS */}
      <Section n="04" title="Quick replies &amp; buttons" desc="Tap targets. Chips sit under the latest question; colours render as highlighter bars.">
        <Spec name="Quick-reply chip" device="both" ground="panel"
          parts={['chip','label','ghost variant']}
          note="<b>Selected</b> = filled ink. <b>Ghost</b> (dashed) for soft/optional choices like “Surprise me”."
          states={[
            {label:'Default', node:<button style={{border:th.chip.border,borderRadius:th.chip.radius,background:th.chip.bg,color:th.chip.text,padding:'9px 15px',fontSize:12.5,cursor:'pointer'}}>Refine my search</button>},
            {label:'Selected', node:<button style={{border:`1px solid ${th.chip.active}`,borderRadius:th.chip.radius,background:th.chip.active,color:th.chip.activeText,padding:'9px 15px',fontSize:12.5,cursor:'pointer'}}>Shoulder</button>},
            {label:'Ghost', node:<button style={{border:'1px dashed #111',borderRadius:th.chip.radius,background:'#fff',color:'#111',padding:'9px 15px',fontSize:12.5,cursor:'pointer'}}>Surprise me</button>},
          ]} />

        <Spec name="Colour option (highlighter)" device="both" ground="panel" span2={true}
          parts={['highlighter bar','label']}
          note="Full-width stacked bars — strokeless, tap-friendly. Hover grows the bar (live)."
          states={[{node:<div style={{width:248}}><VP.RepliesInline replies={colorReplies} th={th} /></div>}]} />

        <Spec name="Reply chip row" device="both" ground="panel" span2={true}
          parts={['chip row']}
          note="Post-result actions render as a horizontal chip set."
          states={[{node:<div style={{width:300}}><VP.RepliesInline replies={chipReplies} th={th} /></div>}]} />

        <Spec name="Buttons" device="both" ground="plain"
          parts={['solid (primary)','ghost (secondary)']}
          note="Square corners. <b>Hover</b> = solid 90% opacity / ghost fills ink. Spec guidance for devs."
          states={[
            {label:'Solid · default', node:<Btn kind="solid" label="Add to bag" />},
            {label:'Solid · hover', node:<Btn kind="solid" state="hover" label="Add to bag" />},
            {label:'Solid · disabled', node:<Btn kind="solid" state="disabled" label="Add to bag" />},
            {label:'Ghost · default', node:<Btn kind="ghost" label="View details" />},
            {label:'Ghost · hover', node:<Btn kind="ghost" state="hover" label="View details" />},
          ]} />
      </Section>

      {/* PRODUCT */}
      <Section n="05" title="Product &amp; commerce" desc="Cards shown in-thread. Carousel scrolls horizontally; cards are equal-height." wide={true}>
        <Spec name="Product card" device="both" ground="panel"
          parts={['image','tag','name (serif)','colour','price','sale price','swatch dots','Add to bag','Details']}
          note="<b>Tag</b> variants: Bestseller · New · Sale (with struck price)."
          states={[
            {label:'Bestseller', node:<div style={{width:176}}><UI.ProductCard prod={P} data={D} th={th} icons={Ic} onAdd={noop} onDetails={noop} /></div>},
            {label:'New', node:<div style={{width:176}}><UI.ProductCard prod={PNew} data={D} th={th} icons={Ic} onAdd={noop} onDetails={noop} /></div>},
            {label:'Sale', node:<div style={{width:176}}><UI.ProductCard prod={PSale} data={D} th={th} icons={Ic} onAdd={noop} onDetails={noop} /></div>},
          ]} />

        <Spec name="Carousel" device="both" ground="panel" span2={true}
          parts={['scroll track','product card','snap points']}
          note="Horizontal swipe; Sale &amp; Bestsellers float to the front."
          states={[{node:<div style={{width:400}}><UI.Carousel items={[PSale,P,PNew]} data={D} th={th} icons={Ic} onAdd={noop} onDetails={noop} /></div>}]} />

        <Spec name="Detail card" device="both" ground="panel"
          parts={['image','name','price','swatches','description','loyalty line','Add to bag','Open page ↗']}
          note="Expanded view posted in-thread; “Open page” represents the jump to the PDP."
          states={[{node:<div style={{width:300}}><UI.DetailCard prod={P} data={D} th={th} icons={Ic} onAdd={noop} /></div>}]} />

        <Spec name="Add-to-bag confirmation" device="both" ground="panel"
          parts={['check badge','thumbnail','name + price','View bag']}
          note="Inline confirmation with a pop + badge spring (live). Bumps the storefront cart badge. No checkout button."
          states={[{node:<div style={{width:280}}><UI.AddedCard prod={P} th={th} icons={Ic} onBag={noop} /></div>}]} />
      </Section>

      {/* PAYMENTS */}
      <Section n="06" title="Payments &amp; BNPL" desc="Interest-free explainers with a computed instalment breakdown.">
        <Spec name="BNPL card" device="both" ground="panel" span2={true}
          parts={['provider badge','headline','body','4× instalment chips','sample line']}
          note="Tabby (4 payments, 25% today) &amp; Tamara (Pay in 4 or in 30 days). Always interest-free."
          states={[
            {label:'Tabby', node:<div style={{width:300}}><UI.BnplCard pay={D.PAYMENTS.tabby} amount={2050} th={th} icons={Ic} /></div>},
            {label:'Tamara', node:<div style={{width:300}}><UI.BnplCard pay={D.PAYMENTS.tamara} amount={2050} th={th} icons={Ic} /></div>},
          ]} />
      </Section>

      {/* SUPPORT & HANDOVER */}
      <Section n="07" title="Support &amp; handover" desc="Store info and the escalation to Customer Care (Layla). Two states, gated by hours.">
        <Spec name="Stores card" device="both" ground="panel"
          parts={['pin','name','detail','Get directions']}
          states={[{node:<div style={{width:300}}><UI.StoresCard faq={D.FAQS.stores} th={th} icons={Ic} /></div>}]} />

        <Spec name="Agent card" device="both" ground="panel"
          parts={['avatar','name','status dot','status text']}
          note="<b>Within hours.</b> Animates Connecting → Connected before Layla speaks."
          states={[
            {label:'Connecting', node:<div style={{width:300}}><UI.AgentCard th={th} icons={Ic} stage="connecting" /></div>},
            {label:'Connected', node:<div style={{width:300}}><UI.AgentCard th={th} icons={Ic} stage="live" /></div>},
          ]} />

        <Spec name="Offline card" device="both" ground="panel" span2={true}
          parts={['status dot','heading','hours copy','Close chat','Save transcript']}
          note="<b>Outside hours (10am–10pm UAE).</b> Shown instead of a live agent."
          states={[{node:<div style={{width:320}}><VP.OfflineCard th={th} Ic={Ic} onCloseChat={noop} onSave={noop} /></div>}]} />
      </Section>

      {/* STOREFRONT CONTEXT */}
      <Section n="08" title="Storefront context" desc="Pieces the assistant touches on the host site.">
        <Spec name="Cart badge" device="both" ground="plain"
          parts={['bag icon','count badge']}
          note="Bumps on add-to-bag. Sized per breakpoint."
          states={[
            {label:'Mobile', node:<span style={{position:'relative',display:'inline-flex'}}><Ic.Bag size={21} /><span style={{position:'absolute',top:-6,right:-7,background:'#000',color:'#fff',fontSize:9,fontWeight:700,width:15,height:15,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>2</span></span>},
            {label:'Desktop', node:<span style={{position:'relative',display:'inline-flex'}}><Ic.Bag size={19} /><span style={{position:'absolute',top:-7,right:-7,background:'#000',color:'#fff',fontSize:9,fontWeight:700,width:15,height:15,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>2</span></span>},
          ]} />

        <Spec name="BNPL top banner" device="both" ground="plain" span2={true}
          parts={['banner']}
          states={[{node:<div style={{background:'#000',color:'#fff',textAlign:'center',fontSize:9.5,letterSpacing:'.16em',fontWeight:600,padding:'7px 16px',textTransform:'uppercase',width:300}}>Buy now, pay later with Tabby &amp; Tamara</div>}]} />
      </Section>

      <div style={{marginTop:54,paddingTop:20,borderTop:'1px solid var(--line)',fontSize:11,color:th.sub,textAlign:'center'}}>
        Rendered from the live prototype source · COACH Shopping Assistant · Classic direction
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Sheet />);
