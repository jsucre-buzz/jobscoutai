// POST /api/generate – JobScoutAI
// API key server-side only — never exposed to client
// Future: add NextAuth session + Stripe plan check here

import Anthropic from '@anthropic-ai/sdk';

const MAX_INPUT_CHARS = 500;

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim().slice(0, MAX_INPUT_CHARS);
}

function detectLang(text) {
  const de = (text.match(/\b(und|ich|wir|für|mit|von|ist|sind|Stelle|Erfahrung|Kenntnisse|Aufgaben|Unternehmen)\b/gi) || []).length;
  const es = (text.match(/\b(y|el|la|los|con|para|que|en|de|experiencia|empresa|trabajo|conocimientos)\b/gi) || []).length;
  if (de > es) return 'de';
  if (es > de) return 'es';
  return 'other';
}

function buildPrompt(jobOffer, cv, inputLang) {
  const langNote = inputLang === 'de'
    ? 'Die Eingaben sind auf Deutsch.'
    : inputLang === 'es'
    ? 'Die Eingaben sind auf Spanisch. Übersetze und verarbeite alles – Ausgabe auf natürlichem, professionellem Deutsch.'
    : 'Eingaben können in einer anderen Sprache sein. Verarbeite sie und gib alles auf professionellem Deutsch aus.';

  return `Du bist ein erfahrener Karriereberater in Deutschland.

${langNote}

WICHTIG: Alle Ausgaben AUSSCHLIESSLICH auf Deutsch. Direkter, menschlicher Ton – keine Floskeln.

Antworte NUR mit einem gültigen JSON-Objekt. KEIN Text davor oder danach. KEIN Markdown. KEINE Erklärungen. NUR reines JSON:

{"matchScore":74,"strengths":["Stärke 1","Stärke 2","Stärke 3"],"gaps":["Lücke 1","Lücke 2"],"tips":["Tipp 1","Tipp 2","Tipp 3"],"optimizedCV":"Vollständiger optimierter Lebenslauf hier","coverLetter":"Anschreiben max 6 Zeilen hier","interviewQA":[{"question":"Frage 1","answer":"Antwort 1"},{"question":"Frage 2","answer":"Antwort 2"},{"question":"Frage 3","answer":"Antwort 3"},{"question":"Frage 4","answer":"Antwort 4"},{"question":"Frage 5","answer":"Antwort 5"}]}

Ersetze die Beispielwerte mit echten Inhalten basierend auf:

---STELLENANGEBOT---
${jobOffer}

---LEBENSLAUF---
${cv}

Regeln:
- matchScore: ehrliche Zahl 0-100
- strengths: 3-4 kurze Punkte
- gaps: 2-3 ehrliche Lücken
- tips: 3 konkrete Tipps
- optimizedCV: max 400 Wörter, deutsches Format
- coverLetter: max 6 Zeilen, konkret, persönlich
- interviewQA: genau 5 realistische Fragen mit persönlichen Antworten
- Klingt wie ein Mensch, nicht wie eine KI`;
}

function mockResponse() {
  return {
    matchScore: 71,
    strengths: ['Technische Grundkenntnisse vorhanden', 'Praktische Projekterfahrung', 'Lernbereitschaft erkennbar'],
    gaps: ['Spezifische Branchenerfahrung fehlt', 'Zertifizierungen nicht erwähnt'],
    tips: ['Zahlen und Ergebnisse konkret nennen', 'Keywords aus der Stellenanzeige übernehmen', 'Anschreiben auf diese Firma zuschneiden'],
    optimizedCV: `Max Mustermann\nmax@email.de | +49 123 456789\n\nPROFIL\nEntwickler mit 4 Jahren Erfahrung in Webprojekten. Schwerpunkt auf sauberen, wartbaren Code.\n\nERFAHRUNG\nSoftware Developer – Beispiel GmbH (2021–heute)\n• Entwicklung und Wartung von Webanwendungen\n• Enge Zusammenarbeit mit dem Produktteam\n\nAUSBILDUNG\nB.Sc. Informatik – Universität Musterstadt (2021)\n\nKENNTNISSE\nJavaScript, React, Node.js, Git, SQL`,
    coverLetter: `Hallo,\n\ndie ausgeschriebene Stelle passt gut zu dem, was ich in den letzten Jahren gemacht habe.\n\nBei Beispiel GmbH habe ich messbare Ergebnisse geliefert und strukturiert gearbeitet.\n\nGerne mehr in einem kurzen Gespräch.\n\nMax Mustermann`,
    interviewQA: [
      { question: 'Was hat Sie an dieser Stelle konkret angesprochen?', answer: 'Die Kombination aus technischer Tiefe und direktem Einfluss auf das Produkt. Das entspricht meiner Arbeitsweise.' },
      { question: 'Beschreiben Sie ein Projekt, auf das Sie stolz sind.', answer: 'Bei Beispiel GmbH habe ich ein System refaktoriert, das die Ladezeiten um 45% verbessert hat.' },
      { question: 'Wie gehen Sie mit unklaren Anforderungen um?', answer: 'Ich frage früh nach – lieber einmal zu oft als einmal zu wenig.' },
      { question: 'Warum möchten Sie wechseln?', answer: 'Ich suche mehr Verantwortung und ein Umfeld, in dem technische Entscheidungen ernst genommen werden.' },
      { question: 'Wo sehen Sie sich in zwei Jahren?', answer: 'Als jemand, der nicht nur liefert, sondern das Team auch technisch voranbringt.' },
    ],
  };
}

// Robust JSON extractor — handles markdown fences, leading text, trailing text
function extractJSON(raw) {
  // Try 1: direct parse
  try { return JSON.parse(raw.trim()); } catch {}
  // Try 2: strip markdown fences
  try {
    const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
    return JSON.parse(stripped);
  } catch {}
  // Try 3: extract first {...} block (handles leading/trailing text)
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch {}
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { jobOffer: rawJob, cv: rawCV } = req.body;

    if (!rawJob || !rawCV) return res.status(400).json({ error: 'Stellenangebot und Lebenslauf sind erforderlich.' });

    const jobOffer = sanitize(rawJob);
    const cv = sanitize(rawCV);

    if (jobOffer.length < 30 || cv.length < 30) return res.status(400).json({ error: 'Eingabe zu kurz. Bitte vollständigere Informationen eingeben.' });

    const inputLang = detectLang(jobOffer + ' ' + cv);

    if (!process.env.ANTHROPIC_API_KEY) {
      await new Promise(r => setTimeout(r, 2000));
      return res.status(200).json({ ...mockResponse(), mock: true, inputLang });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: buildPrompt(jobOffer, cv, inputLang) }],
    });

    const raw = message.content[0]?.text || '';
    const parsed = extractJSON(raw);

    if (!parsed) {
      console.error('[generate] JSON extraction failed. Raw:', raw.slice(0, 400));
      return res.status(500).json({ error: 'Analyse konnte nicht verarbeitet werden. Bitte erneut versuchen.' });
    }

    return res.status(200).json({ ...parsed, mock: false, inputLang });

  } catch (err) {
    console.error('[generate] Error:', err?.message, '| Status:', err?.status);
    if (err?.status === 401) return res.status(500).json({ error: 'API-Schlüssel ungültig.' });
    if (err?.status === 429) return res.status(500).json({ error: 'Zu viele Anfragen. Bitte kurz warten.' });
    if (err?.message?.includes('credit')) return res.status(500).json({ error: 'Dienst vorübergehend nicht verfügbar. Bitte später erneut versuchen.' });
    return res.status(500).json({ error: 'Interner Fehler. Bitte erneut versuchen.' });
  }
}
