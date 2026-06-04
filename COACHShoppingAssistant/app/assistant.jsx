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
  const [phase, setPhase] = useStateA(()=> {
    try { return localStorage.getItem('coach_oa_seen') ? 'chat' : 'onboard'; } catch(e) { return 'onboard'; }
  });
  const finishOnboarding = ()=>{ try{ localStorage.setItem('coach_oa_seen','1'); }catch(e){} setPhase('chat'); };
  const scrollRef = useRefA(null);
  const idRef = useRefA(0);
  const sel = useRefA({});
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
    await botSeq([{ kind:'text', text:'Happy to help you find something special. What colour are you drawn to?' }]);
    setReplies(D.COLOR_OPTIONS.map(c=>({ label:c.label, dot:c.hex, run:()=>pickColor(c.label) })));
  }
  async function pickColor(label) {
    sel.current.colors = [label]; user(label);
    await botSeq([{ kind:'text', text:`Lovely — ${label.toLowerCase()} is always elegant. Any particular style in mind?` }]);
    setReplies([...D.STYLE_OPTIONS.map(s=>({ label:s, run:()=>pickStyle(s) })), { label:'Surprise me', ghost:true, run:()=>pickStyle(null) }]);
  }
  async function pickStyle(style) {
    sel.current.style = style; user(style || 'Surprise me');
    await botSeq([{ kind:'text', text:'And roughly what budget feels right?' }]);
    setReplies(D.BUDGET_OPTIONS.map(b=>({ label:b.label, run:()=>pickBudget(b) })));
  }
  async function pickBudget(b) {
    sel.current.budget = b.max; user(b.label);
    const items = D.discover({ colors:sel.current.colors, styles:sel.current.style?[sel.current.style]:null, budget:b.max });
    const list = items.length ? items : D.discover({ colors:sel.current.colors });
    await botSeq([{ kind:'text', text:list.length
      ? `Here’s what I’d reach for — swipe through. Add any to your bag, or tap for details.`
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
    await botSeq([{ kind:'text', text:'How lovely — I’d be glad to help you find the perfect gift. Who are we treating?' }]);
    setReplies([{label:'My partner',run:()=>giftWho('her','my partner')},{label:'A friend',run:()=>giftWho('any','a friend')},{label:'My mum',run:()=>giftWho('her','my mum')},{label:'Treat myself',run:()=>giftWho('any','myself')}]);
  }
  async function giftWho(bucket, label) {
    sel.current.bucket = bucket; user(`For ${label}`);
    await botSeq([{ kind:'text', text:'What’s the occasion?' }]);
    setReplies([{label:'Birthday',run:()=>giftOcc('a birthday')},{label:'Anniversary',run:()=>giftOcc('an anniversary')},{label:'Just because',run:()=>giftOcc('no reason at all')}]);
  }
  async function giftOcc(occ) {
    sel.current.occ = occ; user(occ.replace(/^(a|an) /,'').replace('no reason at all','Just because'));
    await botSeq([{ kind:'text', text:'Perfect. Shall I keep to a budget, or show a considered range?' }]);
    setReplies([{label:'Under AED 2,000',run:()=>giftShow(2000)},{label:'AED 2,000–2,500',run:()=>giftShow(2500)},{label:'Show me a range',run:()=>giftShow(99999)}]);
  }
  async function giftShow(max) {
    user(max===99999?'Show me a range':`Up to ${window.COACH_UI.AED(max)}`);
    let picks = (D.GIFT_PICKS[sel.current.bucket]||D.GIFT_PICKS.any).map(D.byId).filter(p=>(p.sale||p.price)<=max);
    if (!picks.length) picks = D.GIFT_PICKS.any.map(D.byId);
    await botSeq([{ kind:'text', text:`A thoughtful choice for ${sel.current.occ}. Here are three I’d wrap up myself —` },
      { kind:'carousel', items:picks }]);
    setReplies([{label:'Add gift wrap & note',run:()=>giftWrap()},{label:'See more options',run:()=>startGifting('')},{label:'Talk to a stylist',run:()=>handoff()}]);
  }
  async function giftWrap() {
    user('Add gift wrap & a note');
    await botSeq([{ kind:'note', text:'Done — I’ve noted complimentary gift wrap and a handwritten card. You’ll be able to write your message at checkout.' }]);
    setReplies([{label:'Back to browsing',run:()=>startDiscovery('')},{label:'That’s everything',run:()=>thanks()}]);
  }

  // ---------------- PAYMENTS ----------------
  async function startPayments(echo='I have a question about payments') {
    setMenuOpen(false);
    if (echo) user(echo);
    await botSeq([{ kind:'text', text:'Of course — I’m happy to help. What can I sort out for you?' }]);
    setReplies([
      {label:'I’m struggling to make a payment',run:()=>payFail()},
      {label:'My voucher or promo code isn’t working',run:()=>voucherStart()},
      {label:'How Tabby & Tamara work',run:()=>payBnpl('tabby')},
      {label:'Payment methods',run:()=>payMethods()},
    ]);
  }
  async function payBnpl(which) {
    const p = D.PAYMENTS[which]; user(`How does ${p.name} work?`);
    await botSeq([{ kind:'text', text:`${p.name} lets you spread the cost — completely interest-free.` },
      { kind:'bnpl', which, amount:2050 }]);
    setReplies([{label:which==='tabby'?'How Tamara works':'How Tabby works',run:()=>payBnpl(which==='tabby'?'tamara':'tabby')},{label:'I’m struggling to make a payment',run:()=>payFail()},{label:'Back to menu',run:()=>resetToWelcome()}]);
  }
  async function payMethods() {
    user('What payment methods do you accept?');
    await botSeq([{ kind:'text', text:D.PAYMENTS.methods }]);
    setReplies([{label:'How Tabby & Tamara work',run:()=>payBnpl('tabby')},{label:'I’m struggling to make a payment',run:()=>payFail()},{label:'Back to menu',run:()=>resetToWelcome()}]);
  }

  // --- Flow 1: payment failure ---
  async function payFail() {
    user('I’m struggling to make a payment');
    await botSeq([
      { kind:'text', text:'Sorry to hear that! Here are some common reasons why payments fail:' },
      { kind:'bullets', items:['Incorrect card details','Incorrect billing address','A temporary system issue','Insufficient funds'] },
      { kind:'text', text:'Please check your details and try again.' },
    ]);
    setReplies([{label:'I re-tried and it’s still not working',run:()=>payMethodAsk()},{label:'Got it — payment went through! ✓',run:()=>resolved()}]);
  }
  async function payMethodAsk() {
    user('I re-tried and it’s still not working');
    await botSeq([{ kind:'text', text:'Let’s dig a little deeper. Which payment method are you using?' }]);
    setReplies([
      {label:'Credit / Debit Card',run:()=>payCard()},
      {label:'Tabby',run:()=>paySwap('tabby')},
      {label:'Tamara',run:()=>paySwap('tamara')},
      {label:'Cash on Delivery',run:()=>payCOD()},
    ]);
  }
  async function payCard() {
    user('Credit / Debit Card');
    await botSeq([{ kind:'text', text:'Please try another card or payment method — we also support Apple Pay and Cash on Delivery.' }]);
    setReplies([{label:'Still failing with another card',run:()=>escalate()},{label:'Apple Pay worked! ✓',run:()=>resolved()}]);
  }
  async function paySwap(which) {
    const other = which==='tabby' ? 'Tamara' : 'Tabby';
    const cur = which==='tabby' ? 'Tabby' : 'Tamara';
    user(cur);
    await botSeq([{ kind:'text', text:`I can see you’re using ${cur}. Please try ${other} instead.` }]);
    setReplies([{label:`Tried ${other} — still failing`,run:()=>escalate()},{label:`${other} worked! ✓`,run:()=>resolved()}]);
  }
  async function payCOD() {
    user('Cash on Delivery');
    await botSeq([{ kind:'text', text:'Cash on Delivery sometimes needs a One-Time Password (OTP) to confirm the order. Are you being asked for an OTP?' }]);
    setReplies([{label:'Yes, I need an OTP',run:()=>payOTP()},{label:'No OTP — it just fails',run:()=>payCODnoOTP()}]);
  }
  async function payCODnoOTP() {
    user('No OTP — it just fails');
    await botSeq([{ kind:'text', text:'Please try another payment method — we support Apple Pay and Credit / Debit Card.' }]);
    setReplies([{label:'I don’t want to use another method',run:()=>escalate()},{label:'Apple Pay worked! ✓',run:()=>resolved()}]);
  }
  async function payOTP() {
    user('Yes, I need an OTP');
    await botSeq([{ kind:'text', text:'Cash on Delivery requires a One-Time Password (OTP). Please check your email for the OTP and try again.' }]);
    setReplies([{label:'The OTP isn’t working',run:()=>escalate()},{label:'I haven’t received an OTP',run:()=>payOTPwait()},{label:'OTP worked! ✓',run:()=>resolved()}]);
  }
  async function payOTPwait() {
    user('I haven’t received an OTP');
    await botSeq([{ kind:'text', text:'Please wait a few minutes — there’s sometimes a short delay. Then try again.' }]);
    setReplies([{label:'Still no OTP after waiting',run:()=>escalate()},{label:'OTP arrived — sorted! ✓',run:()=>resolved()}]);
  }

  // --- Flow 2: voucher / promo code ---
  async function voucherStart() {
    user('My voucher or promo code isn’t working');
    await botSeq([{ kind:'text', text:'No worries, let’s get this sorted! Could you share your voucher or promo code with me?' }]);
    setReplies([{label:'COACH20',run:()=>voucherExpired()},{label:'WELCOME15',run:()=>voucherNA()},{label:'My code is different',run:()=>voucherRetry()}]);
  }
  async function voucherExpired() {
    user('COACH20');
    await botSeq([
      { kind:'text', text:'I found it! Unfortunately COACH20 is no longer active. This code was valid from 1 Jan 2025 to 31 Mar 2025 and has now expired.' },
      { kind:'text', text:'Keep an eye on your email and our app for new promotions — we run them regularly!' },
    ]);
    setReplies([{label:'Is there another code I can use?',run:()=>voucherNoActive()},{label:'That’s okay, thanks ✓',run:()=>resolved()}]);
  }
  async function voucherNoActive() {
    user('Is there another code I can use?');
    await botSeq([{ kind:'text', text:'I don’t have any active codes right now, but do check our Offers page for the latest deals.' },{ kind:'link', text:'View offers' }]);
    setReplies([{label:'Back to menu',run:()=>resetToWelcome()},{label:'That’s everything',run:()=>thanks()}]);
  }
  async function voucherNA() {
    user('WELCOME15');
    await botSeq([
      { kind:'text', text:'I found it! WELCOME15 is a valid code, but it’s not applicable on the items in your bag.' },
      { kind:'text', text:'This code is valid on full-price items only — it can’t be used on sale or discounted products, gift cards, or bundles.' },
    ]);
    setReplies([{label:'Which items is it valid for?',run:()=>voucherWhich()},{label:'I still can’t get it to work',run:()=>escalate()}]);
  }
  async function voucherWhich() {
    user('Which items is it valid for?');
    await botSeq([{ kind:'text', text:'It applies to any full-price items. Try removing sale items from your bag and re-entering the code — it should work!' }]);
    setReplies([{label:'That worked! ✓',run:()=>resolved()},{label:'Still not working',run:()=>escalate()}]);
  }
  async function voucherRetry() {
    user('My code is different');
    await botSeq([
      { kind:'text', text:'Good news — that code is valid and active! It could be a small checkout issue. A few things to try:' },
      { kind:'bullets', items:['Check there are no extra spaces when entering the code','Apply it at the payment step, not in the bag','Refresh the page, then try again'] },
    ]);
    setReplies([{label:'It worked! Thanks ✓',run:()=>resolved()},{label:'Still not working after all that',run:()=>escalate()}]);
  }

  // --- shared payment outcomes ---
  async function resolved() {
    user('That’s resolved, thank you ✓');
    await botSeq([{ kind:'text', text:'Wonderful — so glad that’s sorted! Is there anything else I can help you with?' }]);
    setReplies([{label:'Find a bag',run:()=>startDiscovery('')},{label:'No, that’s everything',run:()=>thanks()}]);
  }
  // ⮕ HANDOVER POINT — assistant escalates to Customer Care
  async function escalate() {
    user('It’s still not working');
    if (careOpen) {
      await botSeq([{ kind:'text', text:'Sorry you’re having this difficulty! One moment — connecting you to Customer Care.' }, { kind:'agent', stage:'connecting' }]);
      await wait(1200);
      setMessages(ms=>ms.map(m=>m.kind==='agent'?{...m,stage:'live'}:m));
      await botSeq([{ kind:'agentmsg', text:'Hi there! I’m Layla from the Coach Client Care team. I can see you’ve been having trouble — I’m here to help. Could you confirm your order number so I can look into this for you?' }]);
      setReplies([{label:'Share order number',run:()=>thanks()},{label:'Thanks, Layla',run:()=>thanks()}]);
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
    await botSeq([{ kind:'text', text:'Of course — what would you like to know?' }]);
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
    user('Connect me with a person');
    await botSeq([{ kind:'agent', stage:'connecting' }]);
    await wait(1100);
    setMessages(ms=>ms.map(m=>m.kind==='agent'?{...m,stage:'live'}:m));
    await botSeq([{ kind:'text', text:'Hi, this is Layla from Coach Client Care 👋 I can see your recent order — give me one moment and I’ll have this fixed for you.' }]);
    setReplies([{label:'Thank you',run:()=>thanks()}]);
  }
  async function thanks() {
    user('Thank you');
    await botSeq([{ kind:'text', text:'My pleasure — enjoy the rest of your day. I’m here whenever you need me.' }]);
    setReplies([{label:'Find a bag',run:()=>startDiscovery('')},{label:'Find a gift',run:()=>startGifting('')}]);
  }
  function resetToWelcome() { setMessages([]); setReplies([]); setMenuOpen(false); }

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
    const colorHit = D.COLOR_OPTIONS.find(c=>low.includes(c.label.toLowerCase()) || c.match.some(m=>low.includes(m.toLowerCase())));
    if (/gift|present|birthday|anniversary/.test(low)) return routeAfterUser(()=>startGifting(''));
    if (/tabby|tamara|installemployee|installment|instal|pay|payment|refund|charged|declined/.test(low)) return routeAfterUser(()=>startPayments(''));
    if (/deliver|ship|return|exchange|store|location|track/.test(low)) return routeAfterUser(()=>startFAQ(''));
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
    { key:'find', label:'Find a bag', sub:'By colour, style or budget', icon:Ic.Search, run:()=>startDiscovery() },
    { key:'gift', label:'Find a gift', sub:'For someone special', icon:Ic.Gift, run:()=>startGifting() },
    { key:'pay',  label:'Payments & BNPL', sub:'Tabby, Tamara & methods', icon:Ic.Card, run:()=>startPayments() },
    { key:'faq',  label:'Delivery & returns', sub:'Shipping, returns, stores', icon:Ic.Truck, run:()=>startFAQ() },
  ];

  const MENU_ITEMS = [
    { label:'Find a bag', run:()=>startDiscovery() },
    { label:'Find a gift', run:()=>startGifting() },
    { label:'Payments & BNPL', run:()=>startPayments() },
    { label:'Delivery', run:()=>faqAns('delivery') },
    { label:'Returns', run:()=>faqAns('returns') },
    { label:'Store locations', run:()=>faqAns('stores') },
    { label:'Talk to a person', run:()=>handoff() },
    { label:'Start over', run:()=>resetToWelcome() },
  ];

  return <AssistantView {...{ th, themeKey, Ic, UI, D, device, messages, typing, replies, input, setInput, submit,
    onClose, bagCount, menuOpen, setMenuOpen, MENU_ITEMS, WELCOME_ACTIONS, addToBag, showDetails, scrollRef,
    phase, finishOnboarding, saveTranscript,
    welcome: messages.length===0 }} />;
}

window.Assistant = Assistant;
