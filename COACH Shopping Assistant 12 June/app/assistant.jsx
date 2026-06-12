// assistant.jsx — chat engine + 4 flows. Renders inside any container (mobile sheet / desktop dock).
const { useState:useStateA, useRef:useRefA, useEffect:useEffectA } = React;

function Assistant({ themeKey, onClose, onAddToBag, bagCount, device, careOpen=true }) {
  const AssistantView = window.AssistantView;
  const D = window.COACH_DATA, Ic = window.COACH_ICONS, UI = window.COACH_UI;
  const th = window.COACH_THEMES[themeKey];
  const [messages, setMessages] = useStateA([]);
  const [typing, setTyping] = useStateA(false);
  const [replies, setReplies] = useStateA([]);
  const [input, setInput] = useStateA('');
  const [menuOpen, setMenuOpen] = useStateA(false);
  const [phase, setPhase] = useStateA('onboard'); // value-prop screens show on every open
  const finishOnboarding = ()=>{ setPhase('chat'); };
  const scrollRef = useRefA(null);
  const idRef = useRefA(0);
  const sel = useRefA({});
  const awaitingRef = useRefA(null);
  const nid = ()=>++idRef.current;

  const push = (m)=> setMessages(ms=>[...ms,{id:nid(),...m}]);
  const wait = (ms)=> new Promise(r=>setTimeout(r,ms));

  useEffectA(()=>{ const el=scrollRef.current; if(el) el.scrollTop=el.scrollHeight; }, [messages, typing, replies]);

  async function botSeq(parts) {
    setReplies([]);
    for (const p of parts) {
      setTyping(true);
      await wait(p.delay ?? (p.kind && p.kind!=='text' ? 650 : 480 + Math.min((p.text||'').length*7, 700)));
      setTyping(false);
      push({ who:'bot', ...p });
      await wait(140);
    }
  }
  const user = (text)=> push({ who:'user', kind:'text', text });

  // ---------------- DISCOVERY ----------------
  async function startDiscovery(echo='Help me find a bag') {
    setMenuOpen(false); sel.current = {};
    if (echo) user(echo);
    await botSeq([{ kind:'text', text:'I’m here to help you find something special. Do you have a colour in mind?' }]);
    setReplies(D.COLOR_OPTIONS.map(c=>({ label:c.label, dot:c.hex, run:()=>pickColor(c.label) })));
  }
  async function pickColor(label) {
    sel.current.colors = [label]; user(label);
    await botSeq([{ kind:'text', text:`Beautiful choice. Are you looking for a particular style?` }]);
    setReplies([...D.STYLE_OPTIONS.map(s=>({ label:s, run:()=>pickStyle(s) })), { label:'Surprise me', ghost:true, run:()=>pickStyle(null) }]);
  }
  async function pickStyle(style) {
    sel.current.style = style; user(style || 'Surprise me');
    await botSeq([{ kind:'text', text:'Do you have a price range in mind?' }]);
    setReplies(D.BUDGET_OPTIONS.map(b=>({ label:b.label, run:()=>pickBudget(b) })));
  }
  async function pickBudget(b) {
    sel.current.budget = b.max; user(b.label);
    const items = D.discover({ colors:sel.current.colors, styles:sel.current.style?[sel.current.style]:null, budget:b.max });
    const list = items.length ? items : D.discover({ colors:sel.current.colors });
    await botSeq([{ kind:'text', text:list.length
      ? `Here’s what we’d suggest. Take a look, add to bag or tap for details.`
      : `I don’t have an exact match, but these are close and just as beautiful.` },
      { kind:'carousel', items:list }]);
    setReplies([{ label:'Refine my search', run:()=>refine() }, { label:'Show gifts instead', run:()=>startGifting('') }, { label:'Talk to a stylist', run:()=>handoff() }]);
  }
  async function refine() {
    user('Refine my search');
    await botSeq([{ kind:'text', text:'Of course. What should I adjust?' }]);
    setReplies([{ label:'Different colour', run:()=>startDiscovery('') }, { label:'Lower budget', run:()=>pickBudget(D.BUDGET_OPTIONS[0]) }, { label:'Start over', run:()=>resetToWelcome() }]);
  }

  // ---------------- GIFTING ----------------
  async function startGifting(echo='Help me find a gift') {
    setMenuOpen(false); sel.current = {};
    if (echo) user(echo);
    await botSeq([{ kind:'text', text:'I’m here to help you find the perfect gift. Who is it for?' }]);
    setReplies([{label:'My partner',run:()=>giftWho('her','my partner')},{label:'A friend',run:()=>giftWho('any','a friend')},{label:'My mum',run:()=>giftWho('her','my mum')},{label:'Treat myself',run:()=>giftWho('any','myself')}]);
  }
  async function giftWho(bucket, label) {
    sel.current.bucket = bucket; user(`For ${label}`);
    await botSeq([{ kind:'text', text:'What’s the occasion?' }]);
    setReplies([{label:'Birthday',run:()=>giftOcc('a birthday')},{label:'Anniversary',run:()=>giftOcc('an anniversary')},{label:'Just because',run:()=>giftOcc('no reason at all')}]);
  }
  async function giftOcc(occ) {
    sel.current.occ = occ; user(occ.replace(/^(a|an) /,'').replace('no reason at all','Just because'));
    await botSeq([{ kind:'text', text:'Do you have a price range in mind, or would you like to see a few options?' }]);
    setReplies([{label:'Under AED 2,000',run:()=>giftShow(2000)},{label:'AED 2,000–2,500',run:()=>giftShow(2500)},{label:'Show me a range',run:()=>giftShow(99999)}]);
  }
  async function giftShow(max) {
    user(max===99999?'Show me a range':`Up to ${window.COACH_UI.AED(max)}`);
    let picks = (D.GIFT_PICKS[sel.current.bucket]||D.GIFT_PICKS.any).map(D.byId).filter(p=>(p.sale||p.price)<=max);
    if (!picks.length) picks = D.GIFT_PICKS.any.map(D.byId);
    await botSeq([{ kind:'text', text:`Great choice for ${sel.current.occ}. Here’s three we’d choose.` },
      { kind:'carousel', items:picks }]);
    setReplies([{label:'Add gift wrap & note',run:()=>giftWrap()},{label:'See more options',run:()=>startGifting('')},{label:'Talk to a stylist',run:()=>handoff()}]);
  }
  async function giftWrap() {
    user('Add gift wrap & a note');
    await botSeq([{ kind:'note', text:'Done. A complimentary gift wrap and a handwritten card are available. You can add your message at the checkout.' }]);
    setReplies([{label:'Back to browsing',run:()=>startDiscovery('')},{label:'That’s everything',run:()=>thanks()}]);
  }

  // ---------------- PAYMENTS (informational only) ----------------
  async function startPayments(echo='I have a question about payments') {
    setMenuOpen(false);
    if (echo) user(echo);
    await botSeq([{ kind:'text', text:'Of course, how can I help?' }]);
    setReplies([
      {label:'How Tabby works',run:()=>payBnpl('tabby')},
      {label:'How Tamara works',run:()=>payBnpl('tamara')},
      {label:'Payment methods',run:()=>payMethods()},
      {label:'Speak to Customer Care',run:()=>connectCare({echo:'I’d like to speak to the Customer Care team'})},
    ]);
  }
  async function payBnpl(which) {
    const p = D.PAYMENTS[which]; user(`How does ${p.name} work?`);
    await botSeq([{ kind:'text', text:`${p.name} lets you split the total into 4 interest-free payments.` },
      { kind:'bnpl', which, amount:2050 }]);
    setReplies([{label:which==='tabby'?'How Tamara works':'How Tabby works',run:()=>payBnpl(which==='tabby'?'tamara':'tabby')},{label:'Payment methods',run:()=>payMethods()},{label:'Speak to Customer Care',run:()=>connectCare({echo:'I’d like to speak to the Customer Care team'})}]);
  }
  async function payMethods() {
    user('What payment methods do you accept?');
    await botSeq([{ kind:'text', text:D.PAYMENTS.methods }]);
    setReplies([{label:'How Tabby works',run:()=>payBnpl('tabby')},{label:'Speak to Customer Care',run:()=>connectCare({echo:'I’d like to speak to the Customer Care team'})},{label:'Back to menu',run:()=>resetToWelcome()}]);
  }

  // ---------------- CUSTOMER CARE (handover) ----------------
  // ⮕ HANDOVER POINT — assistant connects the customer to the live Customer Care team (Layla)
  async function connectCare(opts={}) {
    setMenuOpen(false);
    if (opts.echo) user(opts.echo);
    await botSeq([{ kind:'text', text: opts.intro || 'Of course! Let me connect you with our Customer Care team right away. 🙋' }]);
    if (careOpen) {
      await botSeq([{ kind:'agent', stage:'connecting' }]);
      await wait(1200);
      setMessages(ms=>ms.map(m=>m.kind==='agent'?{...m,stage:'live'}:m));
      await botSeq([{ kind:'agentmsg', text:'Hello, I’m Layla from Coach Customer Care. How can I help you today?' }]);
      setReplies([{label:'Thanks, Layla',run:()=>thanks()}]);
    } else {
      await botSeq([{ kind:'offline' }]);
      setReplies([]);
    }
  }
  function saveTranscript() {
    push({ who:'bot', id:nid(), kind:'note', text:'Your transcript has been saved and emailed to you. We’ll be in touch soon.' });
  }

  // ---------------- FAQ ----------------
  async function startFAQ(echo='I have a question') {
    setMenuOpen(false);
    if (echo) user(echo);
    await botSeq([{ kind:'text', text:'Of course, what would you like to know?' }]);
    setReplies([{label:'Delivery',run:()=>faqAns('delivery')},{label:'Returns',run:()=>faqAns('returns')},{label:'Store locations',run:()=>faqAns('stores')},{label:'Something else',run:()=>handoff()}]);
  }
  async function faqAns(key) {
    const f = D.FAQS[key]; user(f.q);
    const parts = [{ kind:'text', text:f.a }];
    if (f.stores) parts.push({ kind:'stores', faq:f });
    parts.push({ kind:'link', text:f.link });
    await botSeq(parts);
    setReplies([{label:'Delivery',run:()=>faqAns('delivery')},{label:'Returns',run:()=>faqAns('returns')},{label:'Store locations',run:()=>faqAns('stores')},{label:'Back to menu',run:()=>resetToWelcome()}]);
  }

  // ---------------- shared ----------------
  async function handoff() {
    await connectCare({ echo:'Connect me with someone' });
  }
  async function thanks() {
    user('Thank you');
    await botSeq([{ kind:'text', text:'My pleasure — enjoy the rest of your day. I’m here whenever you need me.' }]);
    setReplies([{label:'Find your next bag',run:()=>startDiscovery('')},{label:'Find the perfect gift',run:()=>startGifting('')}]);
  }
  function resetToWelcome() { setMessages([]); setReplies([]); setMenuOpen(false); awaitingRef.current=null; }

  // add to bag
  async function addToBag(prod) {
    onAddToBag && onAddToBag(prod);
    push({ who:'bot', id:nid(), kind:'added', prod });
    await wait(60);
  }
  async function showDetails(prod) {
    push({ who:'bot', id:nid(), kind:'detail', prod });
  }

  // free text routing
  async function submit(text) {
    const t = text.trim(); if (!t) return; setInput(''); user(t);
    const low = t.toLowerCase();
    // Upset / complaint / asking for a human → Customer Care (empathetic acknowledgement if upset)
    const upset = /angry|upset|furious|annoyed|frustrat|terrible|awful|worst|unacceptable|ridiculous|disappoint|complain|complaint/.test(low);
    if (upset || /refund|speak (to|with)|talk (to|with)|customer (care|service)|real person|live (agent|chat)|\bhuman\b|\bagent\b|manager/.test(low)) {
      return routeAfterUser(()=>connectCare(upset ? { intro:'I’m sorry to hear that. Let me connect you with our Customer Care team right away.' } : {}));
    }
    const colorHit = D.COLOR_OPTIONS.find(c=>low.includes(c.label.toLowerCase()) || c.match.some(m=>low.includes(m.toLowerCase())));
    if (/gift|present|birthday|anniversary/.test(low)) return routeAfterUser(()=>startGifting(''));
    if (/tabby|tamara|installment|instal|payment|\bpay\b|bnpl/.test(low)) return routeAfterUser(()=>startPayments(''));
    if (/deliver|ship|return|exchange|store|location/.test(low)) return routeAfterUser(()=>startFAQ(''));
    if (colorHit || /bag|tabby|brooklyn|lana|crossbody|shoulder|tote|find|looking/.test(low)) {
      sel.current = { colors: colorHit?[colorHit.label]:null };
      const style = D.STYLE_OPTIONS.find(s=>low.includes(s.toLowerCase()));
      sel.current.style = style||null;
      return routeAfterUser(async ()=>{
        if (colorHit && style) return pickBudget(D.BUDGET_OPTIONS[2]);
        if (colorHit) { await botSeq([{kind:'text',text:`Beautiful choice. Any particular style?`}]); setReplies([...D.STYLE_OPTIONS.map(s=>({label:s,run:()=>pickStyle(s)})),{label:'Surprise me',ghost:true,run:()=>pickStyle(null)}]); return; }
        await botSeq([{kind:'text',text:'Happy to help. What colour are you drawn to?'}]);
        setReplies(D.COLOR_OPTIONS.map(c=>({label:c.label,dot:c.hex,run:()=>pickColor(c.label)})));
      });
    }
    routeAfterUser(async ()=>{
      await botSeq([{ kind:'text', text:'I can help you find a bag, choose a gift, sort out a payment, or answer delivery & returns questions. Where shall we start?' }]);
      setReplies(WELCOME_ACTIONS.map(a=>({ label:a.label, run:a.run })));
    });
  }
  function routeAfterUser(fn){ fn(); }

  const WELCOME_ACTIONS = [
    { key:'find', label:'Find your next bag', sub:'By colour, style or budget', icon:Ic.Search, run:()=>startDiscovery(), wide:true },
    { key:'gift', label:'Find the perfect gift', sub:'For someone special', icon:Ic.Gift, run:()=>startGifting() },
    { key:'pay',  label:'Payments & BNPL', sub:'Tabby, Tamara & methods', icon:Ic.Card, run:()=>startPayments() },
    { key:'faq',  label:'Delivery & returns', sub:'Shipping, returns, stores', icon:Ic.Truck, run:()=>startFAQ() },
    { key:'care', label:'Speak to Customer Care', sub:'Talk to our team', icon:Ic.User, run:()=>connectCare({echo:'I want to speak to the Customer Care team'}) },
  ];

  const MENU_ITEMS = [
    { label:'Find your next bag', run:()=>startDiscovery() },
    { label:'Find the perfect gift', run:()=>startGifting() },
    { label:'Payments & BNPL', run:()=>startPayments() },
    { label:'Delivery', run:()=>faqAns('delivery') },
    { label:'Returns', run:()=>faqAns('returns') },
    { label:'Store locations', run:()=>faqAns('stores') },
    { label:'Speak to Customer Care', run:()=>connectCare({echo:'I want to speak to the Customer Care team'}) },
    { label:'Start over', run:()=>resetToWelcome() },
  ];

  return <AssistantView {...{ th, themeKey, Ic, UI, D, device, messages, typing, replies, input, setInput, submit,
    onClose, bagCount, menuOpen, setMenuOpen, MENU_ITEMS, WELCOME_ACTIONS, addToBag, showDetails, scrollRef,
    phase, finishOnboarding, saveTranscript,
    welcome: messages.length===0 }} />;
}

window.Assistant = Assistant;
