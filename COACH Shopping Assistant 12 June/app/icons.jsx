// icons.jsx — minimal line icons matching Coach's chrome. All inherit currentColor.
const Ic = {};
const mk = (paths, opts={}) => ({size=20, stroke=1.5, ...p}={}) =>
  React.createElement('svg', { width:size, height:size, viewBox:'0 0 24 24', fill:'none',
    stroke:'currentColor', strokeWidth:stroke, strokeLinecap:'round', strokeLinejoin:'round', ...p },
    paths.map((d,i)=>React.createElement('path',{key:i,d})));

Ic.Search   = mk(['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z','m21 21-4.3-4.3']);
Ic.Bag      = mk(['M6 8h12l1 12H5L6 8Z','M9 8V6a3 3 0 0 1 6 0v2']);
Ic.Heart    = mk(['M12 20s-7-4.5-9.5-9A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9.5 5c-2.5 4.5-9.5 9-9.5 9Z']);
Ic.Menu     = mk(['M4 7h16','M4 12h16','M4 17h16']);
Ic.Pin      = mk(['M12 21s-6-5-6-10a6 6 0 0 1 12 0c0 5-6 10-6 10Z','M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z']);
Ic.Close    = mk(['M6 6l12 12','M18 6 6 18']);
Ic.Send     = mk(['M5 12h13','M13 6l6 6-6 6']);
Ic.Back     = mk(['M15 6l-6 6 6 6']);
Ic.ChevR    = mk(['M9 6l6 6-6 6']);
Ic.ChevL    = mk(['M15 6l-6 6 6 6']);
Ic.Plus     = mk(['M12 5v14','M5 12h14']);
Ic.Check    = mk(['M5 12l4.5 4.5L19 6']);
Ic.Mic      = mk(['M12 15a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z','M6 11a6 6 0 0 0 12 0','M12 17v4']);
Ic.Spark    = mk(['M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z']);
Ic.Gift     = mk(['M4 11h16v9H4z','M4 7h16v4H4z','M12 7v13','M12 7S10 3 7.5 4 9 7 12 7Zm0 0s2-4 4.5-3-.5 3-4.5 3Z']);
Ic.Card     = mk(['M3 6h18v12H3z','M3 10h18']);
Ic.Help     = mk(['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z','M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.8.3-1.4 1-1.4 1.9v.3','M12 17h.01']);
Ic.Truck    = mk(['M3 7h11v9H3z','M14 10h4l3 3v3h-7','M7.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z']);
Ic.Return   = mk(['M4 8h11a5 5 0 0 1 0 10H9','M4 8l4-4','M4 8l4 4']);
Ic.User     = mk(['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z','M4 21a8 8 0 0 1 16 0']);
Ic.Tag      = mk(['M3 12l9-9 9 9-9 9-9-9Z','M12 8h.01']);
Ic.Chat     = mk(['M21 11.5a7.5 7.5 0 0 1-7.5 7.5c-1.18 0-2.3-.27-3.3-.74L5 20l1.26-3.96A7.5 7.5 0 1 1 21 11.5Z','M9 11h.01','M12.5 11h.01','M16 11h.01']);
Ic.Track    = mk(['M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z','M3.5 7.5 12 12l8.5-4.5','M12 12v9']);
// Shopping-assistant mark: a cart with a small "spark" (smart-assistant cue) — replaces the chat bubble.
Ic.ShopBot  = mk(['M2.5 5h1.9l.7 2.2m0 0 1.5 6.6a1 1 0 0 0 .98.78h6.84a1 1 0 0 0 .97-.76L17.2 7.2H5.1',
  'M9 18.5a1.15 1.15 0 1 0 0-2.3 1.15 1.15 0 0 0 0 2.3Z',
  'M14 18.5a1.15 1.15 0 1 0 0-2.3 1.15 1.15 0 0 0 0 2.3Z',
  'M18.2 3 18.95 4.45 20.4 5.2 18.95 5.95 18.2 7.4 17.45 5.95 16 5.2 17.45 4.45Z']);

// COACH-style serif "C" monogram avatar (original mark, not the trademark)
Ic.Monogram = ({size=28, color='currentColor', bg='transparent'})=>
  React.createElement('span',{style:{display:'inline-flex',alignItems:'center',justifyContent:'center',
    width:size,height:size,borderRadius:'50%',background:bg,color,
    fontFamily:'"Newsreader",Georgia,serif',fontSize:size*0.62,lineHeight:1,paddingBottom:size*0.04,
    fontWeight:500}},'C');

window.COACH_ICONS = Ic;
