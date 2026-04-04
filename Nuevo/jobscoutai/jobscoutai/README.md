# ⚡ Job Copilot v3

KI-gestütztes Bewerbungsoptimierungstool. CV-Analyse, Match Score, Anschreiben, Interview-Vorbereitung.

## Lokale Entwicklung

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Umgebungsvariablen einrichten
cp .env.local.example .env.local
# Trage deinen Anthropic API Key ein

# 3. Entwicklungsserver starten
npm run dev
# → http://localhost:3000
```

> **Ohne API Key:** Das Tool läuft im Demo-Modus mit simulierten Antworten.

## Deployment auf Netlify

### Option A: Drag & Drop (einfach)
```bash
npm run build
# Dann den Ordner `.next` + alle Projektdateien als ZIP auf netlify.com droppen
```

### Option B: GitHub → Netlify (empfohlen)
1. Repository auf GitHub pushen
2. Auf netlify.com: "New site from Git" → GitHub → Repository auswählen
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Plugin hinzufügen: `@netlify/plugin-nextjs` (wird automatisch erkannt)
5. Umgebungsvariable setzen: `ANTHROPIC_API_KEY=sk-ant-...`

## Umgebungsvariablen (Netlify Dashboard → Site Settings → Env Vars)

| Variable | Beschreibung |
|---|---|
| `ANTHROPIC_API_KEY` | Pflicht für echte KI-Ausgaben |
| `NEXTAUTH_SECRET` | Für zukünftigen Google Login |
| `NEXTAUTH_URL` | Deine Netlify-Domain |
| `STRIPE_SECRET_KEY` | Für zukünftige Monetarisierung |

## Funktionen

- ✅ CV-Optimierung (jobspezifisch)
- ✅ Anschreiben (max. 6 Zeilen, direkt, kein Floskeln)
- ✅ 5 Interviewfragen mit personalisierten Antworten
- ✅ Match Score mit animierter Leiste
- ✅ Stärken / Lücken / Tipps (3 Spalten, dynamische Farben)
- ✅ Alles inline editierbar
- ✅ Copy / Regenerate / Simplify pro Sektion
- ✅ 6-Phasen Loading Animation
- ✅ Free Tier: 3 Analysen/Tag (localStorage)
- ✅ PRO Modal mit Plantabelle
- ✅ Google OAuth Platzhalter (NextAuth-ready)
- ✅ Deutscher Output bei deutschen Stellenangeboten
- ✅ Impressum, Datenschutz, Disclaimer, AGB

## Zukünftige Integrationen

### Google OAuth (NextAuth)
```bash
npm install next-auth
```
Implementierung in `pages/api/auth/[...nextauth].js`

### Stripe Payments
```bash
npm install stripe @stripe/stripe-js
```
Webhook in `pages/api/webhooks/stripe.js`

## Datenschutz & Sicherheit

- API Key nur server-side (Netlify Function)
- Keine persistente Speicherung von Nutzerdaten
- Inputs sanitisiert (max 8000 Zeichen, HTML stripped)
- Sicherheits-Header via `netlify.toml`

---

© 2026 Job Copilot – Alle Rechte vorbehalten
