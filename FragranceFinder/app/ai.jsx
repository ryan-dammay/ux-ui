// Fragrance Finder AI — talks to Claude, returns a reply + catalogue-matched recommendations.

function catalogueForPrompt() {
  return window.FRAGRANCES.map(f =>
    `- ${f.name} | ${f.brand} | ${f.family} | notes: ${f.notes} | AED ${f.price}`
  ).join("\n");
}

function matchProducts(names = []) {
  const all = window.FRAGRANCES;
  const out = [];
  names.forEach(n => {
    if (!n) return;
    const q = String(n).toLowerCase();
    const hit = all.find(f => f.name.toLowerCase() === q)
      || all.find(f => f.name.toLowerCase().includes(q) || q.includes(f.name.toLowerCase().split(" ")[0]))
      || all.find(f => q.includes(f.brand.toLowerCase()));
    if (hit && !out.includes(hit)) out.push(hit);
  });
  return out;
}

function extractJSON(text) {
  if (!text) return null;
  let t = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a === -1 || b === -1) return null;
  try { return JSON.parse(t.slice(a, b + 1)); } catch (e) { return null; }
}

// Fallback when window.claude is unavailable (offline / export)
function fallbackAnswer(userText) {
  const q = (userText || "").toLowerCase();
  const all = window.FRAGRANCES;
  let picks;
  if (/oud|orient|warm|evening|deep|spice/.test(q)) picks = all.filter(f => /Oriental|Woody/.test(f.family));
  else if (/fresh|summer|citrus|light|day/.test(q)) picks = all.filter(f => /Fresh|Aromatic/.test(f.family));
  else if (/fem|her|floral|woman|women/.test(q)) picks = all.filter(f => /Floral/.test(f.family));
  else if (/gift|under|budget|affordable/.test(q)) picks = [...all].sort((a, b) => a.price - b.price);
  else picks = all;
  const recs = (picks.length ? picks : all).slice(0, 4);
  const reply = "Here are a few I think you'll love — each one balances character with everyday wearability. Tap any bottle to explore the full notes, or tell me more about the mood you're after.";
  return { reply, recs };
}

async function askFragranceFinder(history, userText) {
  const sys = `You are the Fragrance Finder — a warm, expert fragrance consultant for a luxury department store. Speak like a knowledgeable friend at the perfume counter: warm, concise, never clinical. British English.

You may ONLY recommend fragrances from this catalogue (use the exact product name):
${catalogueForPrompt()}

Guidance:
- Reply in 2–4 short sentences. No markdown, no lists in the reply text.
- Recommend 2–4 fragrances that genuinely fit the request.
- If the request is vague, ask ONE friendly clarifying question and recommend an empty list.

Respond with ONLY valid JSON, no prose around it:
{"reply": "<your message>", "recommendations": ["<exact product name>", ...]}`;

  const convo = history.map(m => `${m.role === "user" ? "Shopper" : "Finder"}: ${m.text}`).join("\n");
  const prompt = `${sys}\n\nConversation so far:\n${convo}\nShopper: ${userText}\n\nJSON:`;

  try {
    if (!window.claude || !window.claude.complete) throw new Error("no-claude");
    const raw = await window.claude.complete(prompt);
    const parsed = extractJSON(raw);
    if (!parsed) throw new Error("bad-json");
    return {
      reply: parsed.reply || "Here are a few you might like.",
      recs: matchProducts(parsed.recommendations || []),
    };
  } catch (e) {
    return fallbackAnswer(userText);
  }
}

Object.assign(window, { askFragranceFinder });
