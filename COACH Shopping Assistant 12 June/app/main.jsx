// main.jsx — orchestrates storefront + floating assistant, device frames, controls, tweaks.
const { useState:useS, useEffect:useE, useRef:useR } = React;

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "device": "mobile",
  "careOpen": true
}/*EDITMODE-END*/;

function useFit(w, h, pad=22) {
  const ref = useR(null); const [scale,setScale] = useS(1);
  useE(()=>{
    const el = ref.current; if(!el) return;
    const calc = ()=>{ const aw=el.clientWidth-pad*2, ah=el.clientHeight-pad*2; setScale(Math.max(0.2,Math.min(aw/w, ah/h, 1))); };
    calc();
    const ro = new ResizeObserver(calc); ro.observe(el);
    window.addEventListener('resize', calc);
    return ()=>{ ro.disconnect(); window.removeEventListener('resize', calc); };
  }, [w,h,pad]);
  return [ref, scale];
}

function Segmented({ options, value, onChange }) {
  return (
    <div style={{display:'inline-flex',border:'1px solid #d8d4cb',borderRadius:2,overflow:'hidden',background:'#fff'}}>
      {options.map(o=>(
        <button key={o.v} onClick={()=>onChange(o.v)} style={{border:'none',cursor:'pointer',padding:'7px 13px',
          fontFamily:'var(--sans)',fontSize:11,letterSpacing:'.06em',textTransform:'uppercase',fontWeight:600,
          background:value===o.v?'#111':'transparent',color:value===o.v?'#fff':'#6f6a62',transition:'all .15s'}}>{o.label}</button>
      ))}
    </div>
  );
}

function ControlBar({ t, setTweak }) {
  const forced = typeof window!=='undefined' && window.COACH_FORCE_DEVICE;
  return (
    <div style={{flex:'0 0 auto',display:'flex',justifyContent:'center',padding:'16px 16px 6px'}}>
      <div style={{display:'flex',alignItems:'center',gap:15,flexWrap:'wrap',justifyContent:'center',
        background:'#fff',border:'1px solid #e3dfd6',borderRadius:3,padding:'9px 18px',boxShadow:'0 2px 14px rgba(0,0,0,.05)'}}>
        <span style={{fontFamily:'var(--serif)',letterSpacing:'.2em',fontSize:13,textIndent:'.2em',fontWeight:500,color:'#111'}}>COACH</span>
        <span style={{fontSize:9.5,letterSpacing:'.16em',textTransform:'uppercase',color:'#a39c8f',fontWeight:700}}>Shopping Assistant</span>
        {forced &&
          <><span style={{width:1,height:20,background:'#e3dfd6'}} />
          <span style={{fontSize:9.5,letterSpacing:'.16em',textTransform:'uppercase',color:'#a39c8f',fontWeight:700}}>{forced==='mobile'?'Mobile web':'Desktop web'}</span></>}
        {!forced &&
          <><span style={{width:1,height:20,background:'#e3dfd6'}} />
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:9.5,letterSpacing:'.16em',textTransform:'uppercase',color:'#a39c8f',fontWeight:700}}>View</span>
            <Segmented value={t.device} onChange={v=>setTweak('device',v)}
              options={[{v:'mobile',label:'Mobile'},{v:'desktop',label:'Desktop'}]} />
          </div></>}
      </div>
    </div>
  );
}

function StatusBarMobile() {
  return (
    <div style={{height:46,flex:'0 0 auto',background:'#fff',display:'flex',alignItems:'center',justifyContent:'space-between',
      padding:'0 26px',position:'relative',zIndex:2}}>
      <span style={{fontSize:14,fontWeight:600,fontFamily:'var(--sans)'}}>9:16</span>
      <div style={{position:'absolute',left:'50%',top:9,transform:'translateX(-50%)',width:104,height:28,background:'#000',borderRadius:16}} />
      <div style={{display:'flex',alignItems:'center',gap:5}}>
        <span style={{fontSize:12}}>▲▲▲</span>
        <span style={{display:'inline-block',width:22,height:11,border:'1px solid #111',borderRadius:3,position:'relative'}}>
          <span style={{position:'absolute',inset:1,right:6,background:'#111',borderRadius:1}} /></span>
      </div>
    </div>
  );
}

function BrowserBar() {
  return (
    <div style={{height:46,flex:'0 0 auto',background:'#ecebe8',borderBottom:'1px solid #dad7d0',display:'flex',alignItems:'center',gap:8,padding:'0 16px'}}>
      <div style={{display:'flex',gap:8}}>
        {['#ff5f57','#febc2e','#28c840'].map(c=><span key={c} style={{width:12,height:12,borderRadius:'50%',background:c}} />)}
      </div>
      <div style={{flex:1,display:'flex',justifyContent:'center'}}>
        <div style={{background:'#fff',border:'1px solid #dad7d0',borderRadius:7,padding:'6px 16px',fontSize:12.5,color:'#555',
          fontFamily:'var(--sans)',minWidth:260,textAlign:'center'}}>coach.ae</div>
      </div>
      <div style={{width:60}} />
    </div>
  );
}

function AssistantLayer({ mode, th, Ic, S, open, setOpen, bag, addToBag, t, assistantKey }) {
  const launcher = <S.Launcher th={th} Ic={Ic} pulse={!open} onClick={()=>{ setOpen(true); }} />;

  if (mode==='mobile') {
    return (<>
      {!open && launcher}
      {open &&
        <div className="ca-sheet-up" style={{position:'absolute',inset:0,zIndex:40}}>
          <window.Assistant key={'a'+assistantKey} themeKey="classic" device="mobile" careOpen={t.careOpen} bagCount={bag} onAddToBag={addToBag} onClose={()=>setOpen(false)} />
        </div>}
    </>);
  }
  // desktop dock
  return (<>
    {!open && launcher}
    {open &&
      <div className="ca-dock-in" style={{position:'absolute',right:24,bottom:24,zIndex:40,width:394,height:'min(636px, calc(100% - 48px))',
        borderRadius:4,overflow:'hidden',boxShadow:'0 24px 60px rgba(0,0,0,.34)',border:`1px solid ${th.line}`}}>
        <window.Assistant key={'a'+assistantKey} themeKey="classic" device="desktop" careOpen={t.careOpen} bagCount={bag} onAddToBag={addToBag} onClose={()=>setOpen(false)} />
      </div>}
  </>);
}

function App() {
  const [t, setTweak] = useTweaks(DEFAULTS);
  const Ic = window.COACH_ICONS, S = window.COACH_SITE;
  const th = window.COACH_THEMES['classic'];
  const [open, setOpen] = useS(false);
  const [bag, setBag] = useS(0);
  const [assistantKey, setAssistantKey] = useS(0);
  const forcedDevice = (typeof window!=='undefined' && window.COACH_FORCE_DEVICE) || null;
  const isMobile = (forcedDevice || t.device)==='mobile';
  const [fitRef, scale] = useFit(isMobile?412:1240, isMobile?862:772);

  const addToBag = ()=> setBag(b=>b+1);

  const layerProps = { th, Ic, S, open, setOpen, bag, addToBag, t, assistantKey };

  return (
    <div style={{position:'fixed',inset:0,background:'#e7e4dd',display:'flex',flexDirection:'column',fontFamily:'var(--sans)'}}>
      <ControlBar t={t} setTweak={setTweak} />
      <div ref={fitRef} style={{flex:1,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',minHeight:0}}>
        <div style={{zoom:scale}}>
          {isMobile ?
            <div style={{width:412,height:862,background:'#0a0a0a',borderRadius:54,padding:11,boxShadow:'0 30px 70px rgba(0,0,0,.4)'}}>
              <div style={{width:390,height:840,background:'#fff',borderRadius:43,overflow:'hidden',position:'relative',display:'flex',flexDirection:'column'}}>
                <StatusBarMobile />
                <div style={{flex:1,position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',inset:0}}><S.SiteMobile Ic={Ic} bagCount={bag} /></div>
                  <AssistantLayer mode="mobile" {...layerProps} />
                </div>
              </div>
            </div>
            :
            <div style={{width:1240,height:772,background:'#fff',borderRadius:11,overflow:'hidden',boxShadow:'0 30px 80px rgba(0,0,0,.35)',border:'1px solid #d8d4cb'}}>
              <BrowserBar />
              <div style={{position:'relative',height:726}}>
                <div style={{position:'absolute',inset:0}}><S.SiteDesktop Ic={Ic} bagCount={bag} /></div>
                <AssistantLayer mode="desktop" {...layerProps} />
              </div>
            </div>
          }
        </div>
      </div>

      <TweaksPanel>
        {!(typeof window!=='undefined' && window.COACH_FORCE_DEVICE) && <>
        <TweakSection label="Surface" />
        <TweakRadio label="Device" value={t.device} options={['mobile','desktop']} onChange={v=>setTweak('device',v)} />
        </>}
        <TweakSection label="Customer Care" />
        <TweakToggle label="Care team online (10am–10pm)" value={t.careOpen} onChange={v=>setTweak('careOpen',v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
