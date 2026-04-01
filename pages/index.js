import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useUsageLimit } from '../lib/useUsageLimit';
import LoadingOverlay from '../components/LoadingOverlay';
import MatchScore from '../components/MatchScore';
import EditableSection from '../components/EditableSection';
import ProModal from '../components/ProModal';
import Footer from '../components/Footer';

const MAX_CHARS = 500;

const LANG_FLAGS = { de: '🇩🇪', es: '🇪🇸', other: '🌍' };
const LANG_LABELS = { de: 'Deutsch erkannt', es: 'Español erkannt → Output auf Deutsch', other: 'Sprache erkannt → Output auf Deutsch' };

function CharBar({ value, max }) {
  const pct = value.length / max;
  const color = pct > 0.9 ? 'var(--red)' : pct > 0.7 ? 'var(--amber)' : 'var(--green)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 2, background: 'var(--bg-3)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(100, pct * 100)}%`, height: '100%', background: color, transition: 'width 0.1s, background 0.2s' }} />
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color, minWidth: 52, textAlign: 'right' }}>
        {value.length}/{max}
      </span>
    </div>
  );
}

function LimitBanner({ onOpenPro }) {
  return (
    <div style={{
      background: 'var(--bg-2)', border: '1px solid var(--green)33',
      borderRadius: 'var(--radius-lg)', padding: '28px',
      textAlign: 'center', animation: 'slideUp 0.4s ease',
    }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
      <p style={{
        fontFamily: 'var(--font-sans)', fontSize: 15,
        color: 'var(--text)', lineHeight: 1.7, marginBottom: 6,
      }}>
        Du hast das kostenlose Limit erreicht.
      </p>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
        Ich teste gerade dieses Tool 🚀<br />
        Wenn du es ohne Limits nutzen möchtest, melde dich hier 👇
      </p>
      <button
        onClick={onOpenPro}
        style={{
          padding: '11px 28px',
          background: 'var(--green)', color: 'var(--bg)',
          border: 'none', borderRadius: 'var(--radius)',
          fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700,
          cursor: 'pointer', transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        PRO-Warteliste beitreten →
      </button>
    </div>
  );
}

export default function Home() {
  const [jobOffer, setJobOffer] = useState('');
  const [cv, setCv] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPro, setShowPro] = useState(false);
  const [inputLang, setInputLang] = useState('de');
  const [editCV, setEditCV] = useState('');
  const [editCover, setEditCover] = useState('');
  const [editQA, setEditQA] = useState([]);
  const resultsRef = useRef(null);

  const { remaining, limitReached, incrementUsage, loaded, FREE_LIMIT, count } = useUsageLimit();

  async function handleGenerate() {
    if (!jobOffer.trim() || !cv.trim()) {
      setError('Bitte beide Felder ausfüllen.');
      return;
    }
    if (limitReached) { setShowPro(true); return; }

    setError('');
    setLoading(true);

    const newCount = incrementUsage();
    if (newCount > FREE_LIMIT) {
      setLoading(false);
      setShowPro(true);
      return;
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobOffer, cv }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Fehler. Bitte erneut versuchen.');
        setLoading(false);
        return;
      }

      setResult(data);
      setEditCV(data.optimizedCV || '');
      setEditCover(data.coverLetter || '');
      setEditQA(data.interviewQA || []);
      setInputLang(data.inputLang || 'de');
      setLoading(false);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

    } catch {
      setError('Netzwerkfehler. Verbindung prüfen.');
      setLoading(false);
    }
  }

  async function regenSection(section) {
    if (!result) return;
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobOffer, cv }),
      });
      const data = await res.json();
      if (!res.ok) return;
      if (section === 'cv') setEditCV(data.optimizedCV || '');
      if (section === 'cover') setEditCover(data.coverLetter || '');
      if (section === 'qa') setEditQA(data.interviewQA || []);
    } catch { }
  }

  function simplify(section) {
    const text = section === 'cv' ? editCV : editCover;
    const lines = text.split('\n');
    const shorter = lines.slice(0, Math.max(3, Math.ceil(lines.length * 0.65))).join('\n');
    if (section === 'cv') setEditCV(shorter);
    if (section === 'cover') setEditCover(shorter);
  }

  const isReady = jobOffer.trim().length >= 30 && cv.trim().length >= 30 && !limitReached;

  // Detect language on-the-fly for hint
  const [hint, setHint] = useState('');
  useEffect(() => {
    const text = jobOffer + ' ' + cv;
    const es = (text.match(/\b(y|el|la|con|para|que|en|de|experiencia|empresa)\b/gi) || []).length;
    const de = (text.match(/\b(und|ich|wir|für|mit|von|ist|sind|Stelle|Erfahrung)\b/gi) || []).length;
    if (es > 3) setHint('🌍 Eingabe auf Spanisch erkannt – Output wird auf Deutsch generiert');
    else if (de > 3) setHint('');
    else if (text.length > 80) setHint('🌍 Andere Sprache erkannt – Output wird auf Deutsch generiert');
    else setHint('');
  }, [jobOffer, cv]);

  return (
    <>
      <Head>
        <title>JobScoutAI – Bewerbung optimieren mit KI</title>
        <meta name="description" content="CV optimieren, Anschreiben generieren und Interview-Vorbereitung – in Sekunden. Eingabe in jeder Sprache, Ausgabe auf professionellem Deutsch." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <LoadingOverlay active={loading} lang="de" />
      <ProModal open={showPro} onClose={() => setShowPro(false)} />

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <header style={{
          borderBottom: '1px solid var(--border)', background: 'var(--bg-1)',
          position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)',
        }}>
          <div style={{
            maxWidth: 900, margin: '0 auto', padding: '0 24px',
            height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>🎯</span>
              <span style={{
                fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, var(--text), var(--green))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>JobScoutAI</span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)',
                background: 'var(--green-bg)', border: '1px solid var(--green)33',
                padding: '2px 6px', borderRadius: 3,
              }}>beta</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {loaded && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {[...Array(FREE_LIMIT)].map((_, i) => (
                    <span key={i} style={{
                      width: 7, height: 7, borderRadius: '50%', display: 'block',
                      background: i < count ? 'var(--border-bright)' : 'var(--green)',
                      boxShadow: i < count ? 'none' : '0 0 4px var(--green)',
                    }} />
                  ))}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: remaining === 0 ? 'var(--red)' : 'var(--text-dim)', marginLeft: 4 }}>
                    {remaining} kostenlos
                  </span>
                </div>
              )}
              <button onClick={() => setShowPro(true)} style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                padding: '5px 12px', borderRadius: 5,
                border: '1px solid var(--green)44', background: 'var(--green-bg)',
                color: 'var(--green)', cursor: 'pointer', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--green)'; e.currentTarget.style.color = 'var(--bg)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--green-bg)'; e.currentTarget.style.color = 'var(--green)'; }}
              >
                PRO ↗
              </button>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, maxWidth: 900, margin: '0 auto', padding: '40px 24px', width: '100%' }}>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: 44, animation: 'slideUp 0.5s ease' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)',
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14,
            }}>
              KI-BEWERBUNGSOPTIMIERUNG FÜR DEUTSCHLAND
            </div>
            <h1 style={{
              fontSize: 'clamp(26px, 5vw, 44px)', fontWeight: 800,
              letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14,
            }}>
              Dein CV. Auf Deutsch.<br />
              <span style={{
                background: 'linear-gradient(90deg, var(--green), var(--green-dim))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>In Sekunden.</span>
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 540, margin: '0 auto', lineHeight: 1.6 }}>
              Füge Stellenangebot und Lebenslauf ein – <strong style={{ color: 'var(--text)' }}>in jeder Sprache</strong>.
              JobScoutAI optimiert deinen CV, schreibt ein Anschreiben und bereitet dich auf das Interview vor –
              alles auf <strong style={{ color: 'var(--green)' }}>professionellem Deutsch</strong>.
            </p>

            {/* Language badges */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
              {[
                { flag: '🇩🇪', label: 'Deutsch' },
                { flag: '🇪🇸', label: 'Español' },
                { flag: '🇬🇧', label: 'English' },
                { flag: '🇵🇹', label: 'Português' },
                { flag: '🇫🇷', label: 'Français' },
                { flag: '🌍', label: 'Weitere' },
              ].map(b => (
                <span key={b.label} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  padding: '3px 8px', borderRadius: 4,
                  background: 'var(--bg-3)', border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                }}>
                  {b.flag} {b.label}
                </span>
              ))}
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                padding: '3px 8px', borderRadius: 4,
                background: 'var(--green-bg)', border: '1px solid var(--green)44',
                color: 'var(--green)',
              }}>
                → Output immer auf Deutsch
              </span>
            </div>
          </div>

          {/* Limit reached banner */}
          {loaded && limitReached ? (
            <LimitBanner onOpenPro={() => setShowPro(true)} />
          ) : (
            <>
              {/* Language hint */}
              {hint && (
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  color: 'var(--amber)', background: 'var(--amber-bg)',
                  border: '1px solid var(--amber)33', borderRadius: 'var(--radius)',
                  padding: '8px 14px', marginBottom: 14, animation: 'fadeIn 0.3s ease',
                }}>
                  {hint}
                </div>
              )}

              {/* Input grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 }} className="input-grid">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      📋 Stellenangebot
                    </label>
                  </div>
                  <textarea
                    value={jobOffer}
                    onChange={e => setJobOffer(e.target.value.slice(0, MAX_CHARS))}
                    placeholder="Stellenbeschreibung einfügen… (Deutsch, Español, English – egal)"
                    style={{
                      width: '100%', minHeight: 220,
                      background: 'var(--bg-2)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)', color: 'var(--text)',
                      fontFamily: 'var(--font-mono)', fontSize: 13,
                      padding: '14px 16px', resize: 'vertical', outline: 'none',
                      lineHeight: 1.6, transition: 'border-color 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--green)44'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <div style={{ marginTop: 6 }}><CharBar value={jobOffer} max={MAX_CHARS} /></div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      📄 Lebenslauf / CV
                    </label>
                  </div>
                  <textarea
                    value={cv}
                    onChange={e => setCv(e.target.value.slice(0, MAX_CHARS))}
                    placeholder="CV einfügen… in jeder Sprache – wird auf Deutsch optimiert"
                    style={{
                      width: '100%', minHeight: 220,
                      background: 'var(--bg-2)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)', color: 'var(--text)',
                      fontFamily: 'var(--font-mono)', fontSize: 13,
                      padding: '14px 16px', resize: 'vertical', outline: 'none',
                      lineHeight: 1.6, transition: 'border-color 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--green)44'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <div style={{ marginTop: 6 }}><CharBar value={cv} max={MAX_CHARS} /></div>
                </div>
              </div>

              {/* 500 char note */}
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--text-dim)', textAlign: 'center', marginBottom: 20,
              }}>
                max. 500 Zeichen pro Feld · Kurzversion reicht für präzise Ergebnisse
              </p>

              {error && (
                <div style={{
                  background: 'var(--red-bg)', border: '1px solid var(--red)33',
                  borderRadius: 'var(--radius)', padding: '10px 16px',
                  color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: 13,
                  marginBottom: 16, animation: 'fadeIn 0.3s ease',
                }}>
                  ⚠ {error}
                </div>
              )}

              {/* CTA */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 52 }}>
                <button
                  onClick={handleGenerate}
                  disabled={!isReady || loading}
                  style={{
                    padding: '14px 40px',
                    background: isReady && !loading ? 'var(--green)' : 'var(--bg-3)',
                    border: `1px solid ${isReady && !loading ? 'var(--green)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)',
                    color: isReady && !loading ? 'var(--bg)' : 'var(--text-dim)',
                    fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700,
                    cursor: isReady && !loading ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease', letterSpacing: '-0.01em',
                    animation: isReady && !loading ? 'glow 2s ease infinite' : 'none',
                  }}
                  onMouseEnter={e => { if (isReady && !loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
                >
                  {loading ? '↻ Analysiere…' : '🎯 Jetzt analysieren'}
                </button>
              </div>
            </>
          )}

          {/* Results */}
          {result && (
            <div ref={resultsRef} style={{ animation: 'slideUp 0.4s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Analyse abgeschlossen
                  {result.mock && <span style={{ color: 'var(--amber)', marginLeft: 8 }}>[Demo-Modus]</span>}
                  {result.inputLang === 'es' && <span style={{ color: 'var(--green)', marginLeft: 8 }}>🇪🇸→🇩🇪 übersetzt</span>}
                  {result.inputLang === 'other' && <span style={{ color: 'var(--green)', marginLeft: 8 }}>🌍→🇩🇪 übersetzt</span>}
                </span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>

              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: 16 }}>
                <MatchScore score={result.matchScore} strengths={result.strengths} gaps={result.gaps} tips={result.tips} lang="de" />
              </div>

              <div style={{ marginBottom: 16 }}>
                <EditableSection title="Optimierter Lebenslauf (Deutsch)" icon="📄" content={editCV} onContentChange={setEditCV} onRegenerate={() => regenSection('cv')} onSimplify={() => simplify('cv')} lang="de" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <EditableSection title="Anschreiben" icon="✉️" content={editCover} onContentChange={setEditCover} onRegenerate={() => regenSection('cover')} onSimplify={() => simplify('cover')} lang="de" />
              </div>
              <EditableSection title="5 Interviewfragen mit Antworten" icon="🎯" content={editQA} onContentChange={setEditQA} onRegenerate={() => regenSection('qa')} lang="de" isQA />

              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <button onClick={() => { setResult(null); setJobOffer(''); setCv(''); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 12, padding: '8px 20px', borderRadius: 5, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  ↩ Neue Analyse
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
