import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useUsageLimit } from '../lib/useUsageLimit';
import LoadingOverlay from '../components/LoadingOverlay';
import MatchScore from '../components/MatchScore';
import EditableSection from '../components/EditableSection';
import ProModal from '../components/ProModal';
import Footer from '../components/Footer';

const MAX_CHARS = 500;

/* ── Theme toggle ── */
function ThemeToggle({ theme, onToggle }) {
  return (
    <button onClick={onToggle} title={theme === 'dark' ? 'Heller Modus' : 'Dunkler Modus'} style={{
      width: 38, height: 38, borderRadius: 10,
      border: '1px solid var(--border)', background: 'var(--bg-3)',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 17, transition: 'all 0.15s', color: 'var(--text-muted)',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}

/* ── Char counter ── */
function CharCounter({ value, max }) {
  const left = max - value.length;
  const pct  = value.length / max;
  const color = pct > 0.9 ? 'var(--red)' : pct > 0.7 ? 'var(--amber)' : 'var(--text-dim)';
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color, fontFamily: 'var(--font-mono)', transition: 'color 0.2s' }}>
          {left > 0 ? `Verbleibende Zeichen: ${left}` : '⚠ Limit erreicht'}
        </span>
        <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          {value.length}/{max}
        </span>
      </div>
      <div style={{ height: 3, borderRadius: 2, background: 'var(--bg-3)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${Math.min(100, pct * 100)}%`,
          background: color, borderRadius: 2, transition: 'width 0.1s, background 0.2s',
        }} />
      </div>
    </div>
  );
}

/* ── Language badge ── */
const LANGS = [
  { code: 'de', flag: '/flags/de.svg', label: 'DE' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'pt', flag: '🇵🇹', label: 'PT' },
  { code: 'fr', flag: '🇫🇷', label: 'FR' },
  { code: 'tr', flag: '🇹🇷', label: 'TR' },
];

function LangBadges() {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginTop: 14 }}>
      {LANGS.map(l => (
        <span key={l.code} style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 20,
          background: 'var(--bg-3)', border: '1px solid var(--border)',
          fontSize: 12, color: 'var(--text-muted)', fontWeight: 500,
          userSelect: 'none',
        }}>
          <span style={{ fontSize: 14 }}>{l.flag}</span>{l.label}
        </span>
      ))}
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '4px 10px', borderRadius: 20,
        background: 'var(--accent-bg)', border: '1px solid var(--accent-border)',
        fontSize: 12, color: 'var(--accent)', fontWeight: 600,
      }}>
        → Output auf Deutsch
      </span>
    </div>
  );
}

/* ── Limit banner ── */
function LimitBanner({ onOpenPro }) {
  return (
    <div style={{
      background: 'var(--bg-2)', border: '1px solid var(--accent-border)',
      borderRadius: 'var(--radius-lg)', padding: '36px 28px',
      textAlign: 'center', boxShadow: 'var(--shadow)',
      animation: 'slideUp 0.4s ease',
    }}>
      <div style={{ fontSize: 40, marginBottom: 14 }}>🚀</div>
      <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
        Du hast das kostenlose Limit erreicht.
      </p>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>
        Ich teste gerade dieses Tool 🚀<br />
        Wenn du JobScoutAI ohne Limits nutzen möchtest, melde dich hier 👇
      </p>
      <button onClick={onOpenPro} style={{
        padding: '12px 32px', background: 'var(--accent)', color: '#fff',
        border: 'none', borderRadius: 'var(--radius)',
        fontSize: 15, fontWeight: 700, cursor: 'pointer',
        boxShadow: '0 4px 14px var(--accent-border)', transition: 'opacity 0.15s',
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        PRO-Warteliste beitreten →
      </button>
    </div>
  );
}

/* ── Textarea ── */
function InputField({ label, icon, value, onChange, placeholder }) {
  return (
    <div>
      <label style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontWeight: 600, fontSize: 13, color: 'var(--text)', marginBottom: 8,
      }}>
        <span style={{ fontSize: 16 }}>{icon}</span>{label}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value.slice(0, MAX_CHARS))}
        placeholder={placeholder}
        style={{
          width: '100%', minHeight: 200,
          background: 'var(--bg-2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', color: 'var(--text)',
          fontFamily: 'var(--font-mono)', fontSize: 13,
          padding: '14px 16px', resize: 'vertical', outline: 'none',
          lineHeight: 1.65, transition: 'border-color 0.15s, box-shadow 0.15s',
          boxShadow: 'none',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-bg)'; }}
        onBlur={e =>  { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none'; }}
      />
      <CharCounter value={value} max={MAX_CHARS} />
    </div>
  );
}

/* ════════════════════════════════════════════ */
export default function Home() {
  const [theme,    setTheme]    = useState('dark');
  const [jobOffer, setJobOffer] = useState('');
  const [cv,       setCv]       = useState('');
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [showPro,  setShowPro]  = useState(false);
  const [langHint, setLangHint] = useState('');
  const [editCV,    setEditCV]  = useState('');
  const [editCover, setEditCover] = useState('');
  const [editQA,    setEditQA]  = useState([]);
  const resultsRef = useRef(null);
  const { remaining, limitReached, incrementUsage, loaded, FREE_LIMIT, count } = useUsageLimit();

  /* Apply theme to <html> */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /* Language hint */
  useEffect(() => {
    const text = jobOffer + ' ' + cv;
    const es = (text.match(/\b(y|el|la|con|para|que|en|de|experiencia|empresa|trabajo)\b/gi) || []).length;
    const de = (text.match(/\b(und|ich|wir|für|mit|von|ist|sind|Stelle|Erfahrung|Kenntnisse)\b/gi) || []).length;
    if      (es > 4) setLangHint('🇪🇸 Spanisch erkannt → Ergebnis auf Deutsch');
    else if (de > 4) setLangHint('');
    else if (text.length > 100) setLangHint('🌍 Andere Sprache erkannt → Ergebnis auf Deutsch');
    else setLangHint('');
  }, [jobOffer, cv]);

  async function handleGenerate() {
    if (!jobOffer.trim() || !cv.trim()) { setError('Bitte beide Felder ausfüllen.'); return; }
    if (limitReached) { setShowPro(true); return; }
    setError('');
    setLoading(true);
    const newCount = incrementUsage();
    if (newCount > FREE_LIMIT) { setLoading(false); setShowPro(true); return; }
    try {
      const res  = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobOffer, cv }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Fehler. Bitte erneut versuchen.'); setLoading(false); return; }
      setResult(data); setEditCV(data.optimizedCV || ''); setEditCover(data.coverLetter || ''); setEditQA(data.interviewQA || []);
      setLoading(false);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch { setError('Netzwerkfehler. Bitte prüfe deine Verbindung.'); setLoading(false); }
  }

  async function regen(section) {
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobOffer, cv }) });
      const data = await res.json();
      if (!res.ok) return;
      if (section === 'cv')    setEditCV(data.optimizedCV || '');
      if (section === 'cover') setEditCover(data.coverLetter || '');
      if (section === 'qa')    setEditQA(data.interviewQA || []);
    } catch {}
  }

  function simplify(section) {
    const text  = section === 'cv' ? editCV : editCover;
    const lines = text.split('\n');
    const short = lines.slice(0, Math.max(3, Math.ceil(lines.length * 0.65))).join('\n');
    if (section === 'cv')    setEditCV(short);
    if (section === 'cover') setEditCover(short);
  }

  const isReady = jobOffer.trim().length >= 30 && cv.trim().length >= 30 && !limitReached;

  return (
    <>
      <Head>
        <title>JobScoutAI – Bewerbung optimieren mit KI</title>
        <meta name="description" content="CV optimieren, Anschreiben generieren, Interview-Vorbereitung. Eingabe in jeder Sprache – Ausgabe auf professionellem Deutsch." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <LoadingOverlay active={loading} />
      <ProModal open={showPro} onClose={() => setShowPro(false)} />

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* ── Header ── */}
        <header style={{
          borderBottom: '1px solid var(--border)', background: 'var(--bg-1)',
          position: 'sticky', top: 0, zIndex: 100,
          backdropFilter: 'blur(12px)',
          boxShadow: '0 1px 0 var(--border)',
        }}>
          <div style={{
            maxWidth: 900, margin: '0 auto', padding: '0 24px',
            height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 34, height: 34, borderRadius: 9,
                background: 'var(--accent)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 18,
                boxShadow: '0 2px 8px var(--accent-border)',
              }}>🎯</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', color: 'var(--text)', lineHeight: 1.1 }}>
                  JobScoutAI
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  beta · KI-Bewerbungsoptimierung
                </div>
              </div>
            </div>

            {/* Right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Usage dots */}
              {loaded && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {[...Array(FREE_LIMIT)].map((_, i) => (
                    <span key={i} style={{
                      width: 8, height: 8, borderRadius: '50%', display: 'block',
                      background: i < count ? 'var(--border-bright)' : 'var(--accent)',
                      transition: 'background 0.3s',
                    }} />
                  ))}
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, marginLeft: 4,
                    color: remaining === 0 ? 'var(--red)' : 'var(--text-dim)',
                  }}>
                    {remaining} frei
                  </span>
                </div>
              )}
              <ThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
              <button onClick={() => setShowPro(true)} style={{
                padding: '7px 16px', borderRadius: 9,
                border: '1px solid var(--accent-border)', background: 'var(--accent-bg)',
                color: 'var(--accent)', fontFamily: 'var(--font-sans)',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-bg)'; e.currentTarget.style.color = 'var(--accent)'; }}
              >
                PRO ↗
              </button>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, maxWidth: 900, margin: '0 auto', padding: '48px 24px', width: '100%' }}>

          {/* ── Hero ── */}
          <div style={{ textAlign: 'center', marginBottom: 48, animation: 'slideUp 0.5s ease' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 20,
              background: 'var(--accent-bg)', border: '1px solid var(--accent-border)',
              fontSize: 12, fontWeight: 600, color: 'var(--accent)', marginBottom: 16,
            }}>
              🇩🇪 KI-Bewerbungsoptimierung für Deutschland
            </div>
            <h1 style={{
              fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 800,
              letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14, color: 'var(--text)',
            }}>
              Dein CV. Auf Deutsch.<br />
              <span style={{ color: 'var(--accent)' }}>In Sekunden.</span>
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              Füge Stellenangebot und Lebenslauf ein –{' '}
              <strong style={{ color: 'var(--text)', fontWeight: 600 }}>in jeder Sprache</strong>.
              JobScoutAI optimiert deinen CV und bereitet dich auf das Interview vor –
              alles auf <strong style={{ color: 'var(--accent)', fontWeight: 600 }}>professionellem Deutsch</strong>.
            </p>
            <LangBadges />
          </div>

          {/* ── Limit banner or inputs ── */}
          {loaded && limitReached ? (
            <LimitBanner onOpenPro={() => setShowPro(true)} />
          ) : (
            <>
              {/* Lang hint */}
              {langHint && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 14px', borderRadius: 8, marginBottom: 16,
                  background: 'var(--amber-bg)', border: '1px solid var(--amber)33',
                  fontSize: 13, color: 'var(--amber)', fontWeight: 500,
                  animation: 'fadeIn 0.3s ease',
                }}>
                  {langHint}
                </div>
              )}

              {/* Input grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 8 }} className="input-grid">
                <InputField
                  label="Stellenangebot"
                  icon="📋"
                  value={jobOffer}
                  onChange={setJobOffer}
                  placeholder="Stellenbeschreibung einfügen… (Deutsch, Español, English – egal)"
                />
                <InputField
                  label="Lebenslauf / CV"
                  icon="📄"
                  value={cv}
                  onChange={setCv}
                  placeholder="CV einfügen… in jeder Sprache – wird auf Deutsch optimiert"
                />
              </div>

              <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-dim)', marginBottom: 24, fontFamily: 'var(--font-mono)' }}>
                Maximal 500 Zeichen pro Feld · Eine Kurzversion reicht für präzise Ergebnisse
              </p>

              {error && (
                <div style={{
                  padding: '11px 16px', borderRadius: 8, marginBottom: 20,
                  background: 'var(--red-bg)', border: '1px solid var(--red)33',
                  color: 'var(--red)', fontSize: 13, fontWeight: 500,
                  animation: 'fadeIn 0.3s ease',
                }}>
                  ⚠ {error}
                </div>
              )}

              {/* CTA */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 56 }}>
                <button
                  onClick={handleGenerate}
                  disabled={!isReady || loading}
                  style={{
                    padding: '14px 44px', borderRadius: 12,
                    background: isReady ? 'var(--accent)' : 'var(--bg-3)',
                    border: `1px solid ${isReady ? 'var(--accent)' : 'var(--border)'}`,
                    color: isReady ? '#fff' : 'var(--text-dim)',
                    fontSize: 15, fontWeight: 700, cursor: isReady ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    boxShadow: isReady ? '0 4px 16px var(--accent-border)' : 'none',
                  }}
                  onMouseEnter={e => { if (isReady) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
                >
                  {loading ? '↻ Analysiere…' : '🎯 Jetzt analysieren'}
                </button>
              </div>
            </>
          )}

          {/* ── Results ── */}
          {result && (
            <div ref={resultsRef} style={{ animation: 'slideUp 0.4s ease' }}>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{
                  fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  Analyse abgeschlossen
                  {result.mock && <span style={{ color: 'var(--amber)', background: 'var(--amber-bg)', padding: '1px 7px', borderRadius: 4, fontSize: 10 }}>Demo-Modus</span>}
                  {result.inputLang === 'es' && <span style={{ color: 'var(--accent)' }}>🇪🇸→🇩🇪</span>}
                  {result.inputLang === 'other' && <span style={{ color: 'var(--accent)' }}>🌍→🇩🇪</span>}
                </span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>

              {/* Match score card */}
              <div style={{
                background: 'var(--bg-2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '24px',
                marginBottom: 16, boxShadow: 'var(--shadow)',
              }}>
                <MatchScore score={result.matchScore} strengths={result.strengths} gaps={result.gaps} tips={result.tips} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <EditableSection title="Optimierter Lebenslauf" icon="📄" content={editCV} onContentChange={setEditCV} onRegenerate={() => regen('cv')} onSimplify={() => simplify('cv')} />
                <EditableSection title="Anschreiben" icon="✉️" content={editCover} onContentChange={setEditCover} onRegenerate={() => regen('cover')} onSimplify={() => simplify('cover')} />
                <EditableSection title="5 Interviewfragen & Antworten" icon="🎯" content={editQA} onContentChange={setEditQA} onRegenerate={() => regen('qa')} isQA />
              </div>

              <div style={{ textAlign: 'center', marginTop: 36 }}>
                <button onClick={() => { setResult(null); setJobOffer(''); setCv(''); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{
                    padding: '9px 24px', borderRadius: 9,
                    border: '1px solid var(--border)', background: 'var(--bg-3)',
                    color: 'var(--text-muted)', fontSize: 13, fontWeight: 500,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  ↩ Neue Analyse starten
                </button>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>

      <style>{`
        @media (max-width: 640px) { .input-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
