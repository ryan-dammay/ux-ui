// assistant.jsx — Coach Shopping Assistant: themed chat engine + all 4 flows.
const { useState, useRef, useEffect } = React;

// ---- Direction themes (all Coach B&W; Boutique = charcoal + gold) ----------
const THEMES = {
  classic: {
    label:'Classic', mood:'By the book',
    panelBg:'#ffffff', text:'#111111', sub:'#6f6a62', line:'#d4cdbf',
    headerBg:'#000000', headerText:'#ffffff', headerSub:'rgba(255,255,255,.6)',
    botBg:'#f0eee8', botText:'#1a1a1a', botSerif:false, botBubble:true,
    userBg:'#111111', userText:'#ffffff',
    bubbleR:'3px',
    chip:{border:'1px solid #111', radius:'2px', bg:'#fff', text:'#111', active:'#000', activeText:'#fff'},
    accent:'#9a7b3f', accentText:'#ffffff',
    avatarBg:'#000', avatarColor:'#fff', monogramBg:'#000', monogramColor:'#fff',
    imgBg:'#efeeec', cardBg:'#ffffff', cardBorder:'1px solid #d4cdbf', cardR:'0',
    serifWelcome:false, elevated:false, inputBg:'#fff', inputBorder:'#bcb4a4',
  },
  editorial: {
    label:'Editorial', mood:"A stylist's note",
    panelBg:'#f4f1ea', text:'#1d1a14', sub:'#857c69', line:'#ddd5c4',
    headerBg:'#f4f1ea', headerText:'#1d1a14', headerSub:'#9a8f78',
    botBg:'transparent', botText:'#2c281f', botSerif:true, botBubble:false,
    userBg:'transparent', userText:'#1d1a14', userBorder:'1px solid #cabf a6',
    bubbleR:'0',
    chip:{border:'1px solid #b9ad92', radius:'0', bg:'transparent', text:'#3a3326', active:'#1d1a14', activeText:'#f4f1ea'},
    accent:'#9a7b3f', accentText:'#ffffff',
    avatarBg:'transparent', avatarColor:'#9a7b3f', monogramBg:'transparent', monogramColor:'#9a7b3f',
    imgBg:'#ece8df', cardBg:'#fbf9f4', cardBorder:'1px solid #ddd5c4', cardR:'0',
    serifWelcome:true, elevated:false, inputBg:'#fbf9f4', inputBorder:'#cabfa6',
  },
  boutique: {
    label:'Boutique', mood:'The "C", alive',
    panelBg:'#131110', text:'#f1ede4', sub:'#9c948682', line:'#2a2722',
    headerBg:'#131110', headerText:'#f1ede4', headerSub:'#9a9183',
    botBg:'#201d19', botText:'#ece7dc', botSerif:false, botBubble:true,
    userBg:'#caa765', userText:'#1a150c',
    bubbleR:'16px',
    chip:{border:'1px solid #45403a', radius:'999px', bg:'#1c1a16', text:'#e7e1d4', active:'#caa765', activeText:'#1a150c'},
    accent:'#caa765', accentText:'#1a150c',
    avatarBg:'#caa765', avatarColor:'#1a150c', monogramBg:'#caa765', monogramColor:'#1a150c',
    imgBg:'#ece9e2', cardBg:'#1a1714', cardBorder:'1px solid #2d2922', cardR:'14px',
    serifWelcome:false, elevated:true, inputBg:'#1c1a16', inputBorder:'#3a352e',
  },
};
// fix stray space typos in literals above
THEMES.editorial.userBorder='1px solid #cabfa6';

const AED = (n)=> 'AED '+Number(n).toLocaleString();

// ---- small UI atoms --------------------------------------------------------
function Dots({ th }) {
  return (
    <div className="ca-typing" style={{display:'flex',gap:4,padding:'12px 14px',background:th.botBubble?th.botBg:'transparent',borderRadius:th.bubbleR,width:'fit-content'}}>
      {[0,1,2].map(i=><span key={i} className="ca-dot" style={{background:th.sub||'#999',animationDelay:`${i*0.16}s`}} />)}
    </div>
  );
}

function Swatches({ prod, data, th }) {
  const sibs = data.PRODUCTS.filter(p=>p.name===prod.name);
  const seen = {}; const uniq = sibs.filter(p=>seen[p.colorHex]?false:(seen[p.colorHex]=1));
  return (
    <div style={{display:'flex',gap:6,marginTop:8}}>
      {uniq.slice(0,5).map(p=>(
        <span key={p.id} title={p.color} style={{width:13,height:13,borderRadius:'50%',background:p.colorHex,
          boxShadow:p.id===prod.id?`0 0 0 1.5px ${th.panelBg}, 0 0 0 3px ${th.accent}`:`inset 0 0 0 1px rgba(0,0,0,.18)`}} />
      ))}
    </div>
  );
}

function ProductCard({ prod, data, th, icons, onAdd, onDetails, wide }) {
  return (
    <div style={{flex:wide?'1 1 auto':'0 0 auto',width:wide?'auto':176,height:'100%',background:th.cardBg,border:th.cardBorder,
      borderRadius:th.cardR,overflow:'hidden',display:'flex',flexDirection:'column'}}>
      <div style={{position:'relative',background:th.imgBg,aspectRatio:'1/1',flex:'0 0 auto'}}>
        <img src={prod.img} alt={prod.name} style={{width:'100%',height:'100%',objectFit:'contain',mixBlendMode:'multiply'}} />
        {prod.tag && <span style={{position:'absolute',top:9,left:9,fontSize:9,letterSpacing:'.13em',
          textTransform:'uppercase',fontWeight:700,color:prod.tag==='Sale'?'#b3321f':'#1a1a1a'}}>{prod.tag}</span>}
      </div>
      <div style={{padding:'11px 12px 13px',display:'flex',flexDirection:'column',flex:1}}>
        <div style={{fontFamily:'var(--serif)',fontSize:14,lineHeight:1.25,color:th.text,minHeight:'2.5em',
          display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{prod.name}</div>
        <div style={{fontSize:11,letterSpacing:'.04em',color:th.sub,marginTop:3}}>{prod.color}</div>
        <div style={{display:'flex',alignItems:'baseline',gap:7,marginTop:7,minHeight:18}}>
          {prod.sale
            ? <><span style={{fontWeight:700,fontSize:13,color:'#b3321f'}}>{AED(prod.sale)}</span><span style={{fontSize:11,color:th.sub,textDecoration:'line-through'}}>{AED(prod.price)}</span></>
            : <span style={{fontWeight:700,fontSize:13,color:th.text}}>{AED(prod.price)}</span>}
        </div>
        <Swatches prod={prod} data={data} th={th} />
        <div style={{marginTop:'auto',paddingTop:11,display:'flex',flexDirection:'column',gap:6}}>
          <button onClick={()=>onAdd(prod)} style={{...btnSolid(th),fontSize:10.5,padding:'10px 8px'}}>Add to bag</button>
          <button onClick={()=>onDetails(prod)} style={{background:'none',border:'none',color:th.sub,fontSize:10.5,
            letterSpacing:'.12em',textTransform:'uppercase',cursor:'pointer',fontWeight:600}}>Details</button>
        </div>
      </div>
    </div>
  );
}

function btnSolid(th){return {background:th.accent==='#caa765'?th.accent:'#000',color:th.accent==='#caa765'?th.accentText:'#fff',
  border:'none',borderRadius:th.cardR==='14px'?'10px':'2px',padding:'12px 16px',fontFamily:'var(--sans)',
  fontSize:11,letterSpacing:'.14em',textTransform:'uppercase',fontWeight:700,cursor:'pointer'};}
function btnGhost(th){return {background:'none',color:th.text,border:`1px solid ${th.text}`,borderRadius:th.cardR==='14px'?'10px':'2px',
  padding:'11px 16px',fontFamily:'var(--sans)',fontSize:11,letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600,cursor:'pointer'};}

function Carousel({ items, ...p }) {
  return (
    <div style={{display:'flex',gap:10,overflowX:'auto',padding:'2px 2px 8px',margin:'0 -2px',alignItems:'stretch',
      scrollSnapType:'x mandatory',WebkitOverflowScrolling:'touch'}} className="ca-scroll">
      {items.map(prod=><div key={prod.id} style={{scrollSnapAlign:'start',display:'flex'}}><ProductCard prod={prod} {...p} /></div>)}
    </div>
  );
}

function AddedCard({ prod, th, icons, onBag }) {
  return (
    <div className="ca-added" style={{background:th.cardBg,border:`1px solid ${th.accent}`,borderRadius:th.cardR,padding:12,maxWidth:300}}>
      <div style={{display:'flex',alignItems:'center',gap:7,color:th.accent,fontSize:10.5,letterSpacing:'.14em',
        textTransform:'uppercase',fontWeight:700,marginBottom:10}}>
        <span className="ca-check-badge" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',
          width:18,height:18,borderRadius:'50%',background:th.accent,color:'#fff',flex:'0 0 auto'}}><icons.Check size={12} stroke={2.4} /></span>
        Added to your bag
      </div>
      <div style={{display:'flex',gap:11}}>
        <div style={{width:54,height:54,background:th.imgBg,flex:'0 0 auto'}}>
          <img src={prod.img} style={{width:'100%',height:'100%',objectFit:'contain',mixBlendMode:'multiply'}} /></div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:'var(--serif)',fontSize:14,color:th.text,lineHeight:1.2}}>{prod.name}</div>
          <div style={{fontSize:11,color:th.sub,marginTop:2}}>{prod.color} · {AED(prod.sale||prod.price)}</div>
        </div>
      </div>
      <div style={{marginTop:12}}>
        <button onClick={onBag} style={{...btnSolid(th),width:'100%',padding:'12px 10px'}}>View bag</button>
      </div>
    </div>
  );
}

function DetailCard({ prod, data, th, icons, onAdd }) {
  return (
    <div style={{background:th.cardBg,border:th.cardBorder,borderRadius:th.cardR,overflow:'hidden',maxWidth:320}}>
      <div style={{background:th.imgBg,aspectRatio:'4/3'}}>
        <img src={prod.img} style={{width:'100%',height:'100%',objectFit:'contain',mixBlendMode:'multiply'}} /></div>
      <div style={{padding:'14px 15px 16px'}}>
        <div style={{fontFamily:'var(--serif)',fontSize:17,color:th.text}}>{prod.name}</div>
        <div style={{display:'flex',alignItems:'baseline',gap:8,marginTop:6}}>
          {prod.sale
            ? <><span style={{fontWeight:700,color:'#b3321f'}}>{AED(prod.sale)}</span><span style={{fontSize:12,color:th.sub,textDecoration:'line-through'}}>{AED(prod.price)}</span></>
            : <span style={{fontWeight:700,color:th.text}}>{AED(prod.price)}</span>}
        </div>
        <Swatches prod={prod} data={data} th={th} />
        <p style={{fontSize:12.5,lineHeight:1.55,color:th.sub,margin:'12px 0 0'}}>
          Crafted in {prod.style.toLowerCase()==='crossbody'?'smooth':'polished pebble'} leather with our signature hardware. A piece made to carry forward, season after season.</p>
        <div style={{display:'flex',alignItems:'center',gap:8,marginTop:12,paddingTop:12,borderTop:`1px solid ${th.line}`,fontSize:11.5,color:th.sub}}>
          <icons.Tag size={15} /> Earn {Math.round((prod.sale||prod.price)*0.95).toLocaleString()} points with Amber
        </div>
        <div style={{marginTop:13,display:'flex',gap:8}}>
          <button onClick={()=>onAdd(prod)} style={{...btnSolid(th),flex:1}}>Add to bag</button>
          <button style={{...btnGhost(th),padding:'11px 14px',whiteSpace:'nowrap'}}>Open page ↗</button>
        </div>
      </div>
    </div>
  );
}

function BnplCard({ pay, amount, th, icons }) {
  const color = pay.name==='Tabby' ? '#3fd9b0' : '#e85ea0';
  return (
    <div style={{background:th.cardBg,border:th.cardBorder,borderRadius:th.cardR,padding:15,maxWidth:300}}>
      <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:10}}>
        <span style={{width:34,height:22,borderRadius:5,background:color,display:'flex',alignItems:'center',
          justifyContent:'center',color:'#0a0a0a',fontWeight:800,fontSize:10,letterSpacing:'.02em'}}>{pay.name==='Tabby'?'tabby':'tamara'}</span>
        <span style={{fontFamily:'var(--serif)',fontSize:15,color:th.text}}>{pay.headline}</span>
      </div>
      <p style={{fontSize:12.5,lineHeight:1.55,color:th.sub,margin:'0 0 12px'}}>{pay.body}</p>
      <div style={{display:'flex',gap:7}}>
        {[1,2,3,4].map(i=>(
          <div key={i} style={{flex:1,textAlign:'center',padding:'9px 4px',border:`1px solid ${th.line}`,borderRadius:th.cardR==='14px'?8:2}}>
            <div style={{fontSize:9,color:th.sub,letterSpacing:'.05em'}}>{i===1?'Today':'Mo '+i}</div>
            <div style={{fontSize:11,fontWeight:700,color:th.text,marginTop:3}}>{(amount/4).toLocaleString(undefined,{minimumFractionDigits:0})}</div>
          </div>
        ))}
      </div>
      <div style={{fontSize:11,color:th.accent,marginTop:11,fontWeight:600}}>{pay.sample(amount)}</div>
    </div>
  );
}

function StoresCard({ faq, th, icons }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:9,maxWidth:300}}>
      {faq.stores.map(s=>(
        <div key={s.name} style={{background:th.cardBg,border:th.cardBorder,borderRadius:th.cardR,padding:'13px 14px',
          display:'flex',gap:11,alignItems:'flex-start'}}>
          <span style={{color:th.accent,marginTop:1}}><icons.Pin size={18} /></span>
          <div style={{flex:1}}>
            <div style={{fontFamily:'var(--serif)',fontSize:14.5,color:th.text}}>{s.name}</div>
            <div style={{fontSize:12,color:th.sub,marginTop:2}}>{s.detail}</div>
            <button style={{background:'none',border:'none',padding:0,marginTop:7,color:th.text,fontSize:10.5,
              letterSpacing:'.1em',textTransform:'uppercase',fontWeight:700,cursor:'pointer',textDecoration:'underline',textUnderlineOffset:3}}>Get directions</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AgentCard({ th, icons, stage }) {
  return (
    <div style={{background:th.cardBg,border:th.cardBorder,borderRadius:th.cardR,padding:14,maxWidth:300}}>
      <div style={{display:'flex',alignItems:'center',gap:11}}>
        <span style={{width:38,height:38,borderRadius:'50%',background:th.accent,color:th.accentText,
          display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--serif)',fontSize:17}}>L</span>
        <div>
          <div style={{fontSize:13.5,fontWeight:600,color:th.text}}>Layla · Client Care</div>
          <div style={{fontSize:11.5,color:stage==='live'?'#1f8a5b':th.sub,display:'flex',alignItems:'center',gap:5,marginTop:2}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:stage==='live'?'#1f8a5b':th.sub}} />
            {stage==='live'?'Connected — typically replies in ~2 min':'Connecting you to a person…'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- message bubble wrapper ------------------------------------------------
function Row({ who, th, children, avatar }) {
  const isUser = who==='user';
  return (
    <div className="ca-msg-in" style={{display:'flex',gap:9,justifyContent:isUser?'flex-end':'flex-start',alignItems:'flex-end'}}>
      {!isUser && avatar}
      <div style={{maxWidth:isUser?'80%':'88%'}}>{children}</div>
    </div>
  );
}

function TextBubble({ who, th, text }) {
  const isUser = who==='user';
  if (isUser) {
    return <div style={{background:th.userBg,color:th.userText,border:th.userBg==='transparent'?th.userBorder:'none',
      borderRadius:th.bubbleR,padding:'10px 14px',fontSize:13.5,lineHeight:1.5}}>{text}</div>;
  }
  const serif = th.botSerif;
  return <div style={{background:th.botBubble?th.botBg:'transparent',color:th.botText,borderRadius:th.bubbleR,
    padding:th.botBubble?'11px 14px':'2px 0',fontSize:serif?15.5:13.5,lineHeight:1.55,
    fontFamily:serif?'var(--serif)':'var(--sans)'}}>{text}</div>;
}

window.COACH_THEMES = THEMES;

// ---- Order tracking: searching animation + status card ---------------------
function Searching({ th, icons }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:11,background:th.botBg,borderRadius:th.bubbleR,padding:'12px 15px',maxWidth:280}}>
      <span className="ca-spin" style={{flex:'0 0 auto',width:20,height:20,borderRadius:'50%',
        border:`2px solid ${th.line}`,borderTopColor:th.accent,display:'inline-block'}} />
      <span style={{fontSize:13.5,color:th.botText}}>Looking up your order…</span>
    </div>
  );
}

function OrderCard({ order, data, th, icons }) {
  const prod = data.byId(order.item);
  const color = (data.ORDER_STATUS_COLOR||{})[order.statusKey] || th.accent;
  const steps = data.ORDER_STEPS;
  const Row2 = ({ label, value, strong }) => (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:12,padding:'9px 0',borderTop:`1px solid ${th.line}`}}>
      <span style={{fontSize:11,letterSpacing:'.08em',textTransform:'uppercase',color:th.sub,fontWeight:600}}>{label}</span>
      <span style={{fontSize:13,color:th.text,fontWeight:strong?700:500,textAlign:'right'}}>{value}</span>
    </div>
  );
  return (
    <div className="ca-added" style={{background:th.cardBg,border:th.cardBorder,borderRadius:th.cardR,overflow:'hidden',maxWidth:312}}>
      {/* header: thumbnail + order no + status pill */}
      <div style={{display:'flex',gap:12,padding:'14px 15px 13px'}}>
        <div style={{width:52,height:52,background:th.imgBg,flex:'0 0 auto'}}>
          {prod && <img src={prod.img} alt="" style={{width:'100%',height:'100%',objectFit:'contain',mixBlendMode:'multiply'}} />}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:'var(--serif)',fontSize:15,color:th.text,lineHeight:1.25}}>{prod?prod.name:'Your order'}</div>
          <span style={{display:'inline-flex',alignItems:'center',gap:6,marginTop:8,background:color,color:'#fff',
            fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:700,padding:'4px 9px',borderRadius:'2px'}}>
            <span style={{width:5,height:5,borderRadius:'50%',background:'#fff'}} />{order.status}</span>
        </div>
      </div>
      {/* step tracker */}
      <div style={{padding:'4px 15px 16px'}}>
        <div style={{position:'relative',display:'flex',justifyContent:'space-between'}}>
          <div style={{position:'absolute',top:6,left:6,right:6,height:2,background:th.line}} />
          <div style={{position:'absolute',top:6,left:6,height:2,background:color,
            width:`calc((100% - 12px) * ${order.stepIndex/(steps.length-1)})`,transition:'width .5s ease'}} />
          {steps.map((s,i)=>{
            const done=i<=order.stepIndex;
            return (
              <div key={s} style={{position:'relative',display:'flex',flexDirection:'column',alignItems:'center',width:`${100/steps.length}%`}}>
                <span style={{width:13,height:13,borderRadius:'50%',background:done?color:th.cardBg,
                  border:`2px solid ${done?color:th.line}`,zIndex:1}} />
                <span style={{fontSize:8.5,letterSpacing:'.02em',color:i===order.stepIndex?th.text:th.sub,
                  fontWeight:i===order.stepIndex?700:500,marginTop:6,textAlign:'center',lineHeight:1.2,maxWidth:54}}>{s}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* meta rows */}
      <div style={{padding:'0 15px 16px'}}>
        <Row2 label="Order no." value={order.id} />
        <Row2 label="Order date" value={order.date} />
        <Row2 label="Est. delivery" value={order.eta} strong />
        <Row2 label="Courier" value={order.courier} />
      </div>
    </div>
  );
}

window.COACH_UI = { Dots, ProductCard, Carousel, AddedCard, DetailCard, BnplCard, StoresCard, AgentCard, Row, TextBubble, btnSolid, btnGhost, AED, OrderCard, Searching };
