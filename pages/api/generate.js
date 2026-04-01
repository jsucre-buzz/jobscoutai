// POST /api/generate – JobScoutAI
// API key server-side only, never exposed to client
// Future: add NextAuth session + Stripe plan check here

import Anthropic from '@anthropic-ai/sdk';

const MAX_INPUT_CHARS = 500; // per field – cost control

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, MAX_INPUT_CHARS);
}

// Detect input language for UI feedback
function detectLang(text) {
  const de = /\b(die|der|das|und|ich|wir|für|mit|von|auf|ist|sind|haben|werden|Stelle|Erfahrung|Kenntnisse|Aufgaben)\b/gi;
  const es = /\b(y|el|la|los|las|con|para|por|que|en|de|un|una|experiencia|conocimientos|empresa)\b/gi;
  const deCount = (text.match(de) || []).length;
  const esCount = (text.match(es) || []).length;
  if (deCount > esCount) return 'de';
  if (esCount > deCount) return 'es';
  return 'other';
}

function buildPrompt(jobOffer, cv, inputLang) {
  const langNote = inputLang === 'de'
    ? 'Die Eingaben sind auf Deutsch.'
    : inputLang === 'es'
    ? 'Die Eingaben sind auf Spanisch. Übersetze und verarbeite alles – die Ausgabe muss auf natürlichem, professionellem Deutsch sein.'
    : 'Die Eingaben können in einer anderen Sprache sein. Verarbeite sie und gib alles auf professionellem Deutsch aus.';

  return `Du bist ein erfahrener Karriereberater in Deutschland mit tiefem Verständnis des deutschen Arbeitsmarkts.

${langNote}

WICHTIG: Alle Ausgaben AUSSCHLIESSLICH auf Deutsch. Natürlicher, direkter Ton – keine Unternehmensfloskeln. Klingt wie ein erfahrener Mensch, nicht wie eine KI.

Analysiere das Stellenangebot und den Lebenslauf. Antworte NUR mit einem gültigen JSON-Objekt (kein Markdown, keine Erklärungen):

{
  "matchScore": <Ganzzahl 0-100>,
  "strengths": [<3-4 kurze Stärken auf Deutsch>],
  "gaps": [<2-3 ehrliche Lücken auf Deutsch>],
  "tips": [<3 konkrete, umsetzbare Tipps auf Deutsch>],
  "optimizedCV": "<Lebenslauf neu geschrieben auf Deutsch, an diese Stelle angepasst, max 400 Wörter, professionelles deutsches Format>",
  "coverLetter": "<Anschreiben max 6 Zeilen, direkter menschlicher Ton, kein 'Sehr geehrte Damen und Herren', spezifisch für diese Stelle>",
  "interviewQA": [
    {"question": "<realistische Frage für DIESE Stelle>", "answer": "<persönliche Antwort basierend auf dem CV, 2 Sätze, klingt menschlich>"},
    {"question": "<Frage>", "answer": "<Antwort>"},
    {"question": "<Frage>", "answer": "<Antwort>"},
    {"question": "<Frage>", "answer": "<Antwort>"},
    {"question": "<Frage>", "answer": "<Antwort>"}
  ]
}

Regeln:
- matchScore: ehrliche Bewertung, kein Schönreden
- optimizedCV: echte Fakten behalten, deutschen Stil anpassen, Keywords der Stelle einbauen
- coverLetter: max 6 Zeilen, konkret, persönlich, kein Bullshit
- interviewQA: Fragen die ein echter HR-Manager in Deutschland stellen würde
- Klingt wie ein Mensch, nicht wie eine KI. Direkt. Ehrlich. Nützlich.

---STELLENANGEBOT---
${jobOffer}

---LEBENSLAUF---
${cv}`;
}

function mockResponse() {
  return {
    matchScore: 71,
    strengths: ['Technische Grundkenntnisse vorhanden', 'Praktische Projekterfahrung', 'Lernbereitschaft erkennbar'],
    gaps: ['Spezifische Branchenerfahrung fehlt', 'Zertifizierungen nicht erwähnt'],
    tips: ['Zahlen und Ergebnisse konkret nennen', 'Keywords aus der Stellenanzeige direkt übernehmen', 'Anschreiben auf diese Firma zuschneiden'],
    optimizedCV: `Max Mustermann\nmax@email.de | +49 123 456789\n\nPROFIL\nEntwickler mit 4 Jahren Erfahrung in Webprojekten. Schwerpunkt auf sauberen, wartbaren Code und pragmatische Lösungen.\n\nERFAHRUNG\nSoftware Developer – Beispiel GmbH (2021–heute)\n• Entwicklung und Wartung von Webanwendungen\n• Enge Zusammenarbeit mit dem Produktteam\n\nAUSBILDUNG\nB.Sc. Informatik – Universität Musterstadt (2021)\n\nKENNTNISSE\nJavaScript, React, Node.js, Git, SQL`,
    coverLetter: `Hallo,\n\ndie ausgeschriebene Stelle passt gut zu dem, was ich in den letzten Jahren gemacht habe – konkret die Kombination aus [Technologie] und der Arbeit in kleinen, direkten Teams.\n\nBei Beispiel GmbH habe ich [konkretes Ergebnis] erreicht. Ich arbeite strukturiert, kommuniziere offen und liefere.\n\nGerne mehr in einem kurzen Gespräch.\n\nMax Mustermann`,
    interviewQA: [
      { question: 'Was hat Sie an dieser Stelle konkret angesprochen?', answer: 'Die Kombination aus technischer Tiefe und der Möglichkeit, direkt Einfluss auf das Produkt zu nehmen. Das entspricht genau meiner Arbeitsweise.' },
      { question: 'Beschreiben Sie ein Projekt, auf das Sie stolz sind.', answer: 'Bei Beispiel GmbH habe ich ein System refaktoriert, das die Ladezeiten um 45% verbessert hat. Das Ergebnis war direkt messbar und hat das Team entlastet.' },
      { question: 'Wie gehen Sie mit unklaren Anforderungen um?', answer: 'Ich frage früh nach, lieber einmal zu oft als einmal zu wenig. Unklarheit am Anfang kostet am Ende viel mehr Zeit.' },
      { question: 'Warum möchten Sie wechseln?', answer: 'Ich suche mehr Verantwortung und ein Umfeld, in dem technische Entscheidungen ernst genommen werden.' },
      { question: 'Wo sehen Sie sich in zwei Jahren?', answer: 'Als jemand, der nicht nur liefert, sondern das Team auch technisch voranbringt – durch Code Reviews, Dokumentation und klare Architekturentscheidungen.' },
    ],
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { jobOffer: rawJob, cv: rawCV } = req.body;

    if (!rawJob || !rawCV) {
      return res.status(400).json({ error: 'Stellenangebot und Lebenslauf sind erforderlich.' });
    }

    const jobOffer = sanitize(rawJob);
    const cv = sanitize(rawCV);

    if (jobOffer.length < 30 || cv.length < 30) {
      return res.status(400).json({ error: 'Eingabe zu kurz. Bitte vollständigere Informationen eingeben.' });
    }

    const inputLang = detectLang(jobOffer + ' ' + cv);

    // Demo mode – no API key
    if (!process.env.ANTHROPIC_API_KEY) {
      await new Promise(r => setTimeout(r, 2000));
      return res.status(200).json({ ...mockResponse(), mock: true, inputLang });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001', // fast + cheap, ideal for this use case
      max_tokens: 1500,                    // cost control
      messages: [{ role: 'user', content: buildPrompt(jobOffer, cv, inputLang) }],
    });

    const raw = message.content[0]?.text || '';

    let parsed;
    try {
      const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('[generate] JSON parse failed:', raw.slice(0, 300));
      return res.status(500).json({ error: 'KI-Antwort konnte nicht verarbeitet werden. Bitte erneut versuchen.' });
    }

    return res.status(200).json({ ...parsed, mock: false, inputLang });

  } catch (err) {
    console.error('[generate] Error:', err?.message);
    console.error('[generate] Status:', err?.status);

    if (err?.status === 401) return res.status(500).json({ error: 'API-Schlüssel ungültig. Bitte Konfiguration prüfen.' });
    if (err?.status === 429) return res.status(500).json({ error: 'Zu viele Anfragen. Bitte kurz warten.' });
    if (err?.message?.includes('credit')) return res.status(500).json({ error: 'Dienst vorübergehend nicht verfügbar. Bitte später erneut versuchen.' });

    return res.status(500).json({ error: 'Interner Fehler. Bitte erneut versuchen.' });
  }
}
