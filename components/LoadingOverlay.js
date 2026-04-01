import { useState, useEffect } from 'react';

const PHASES = [
  { id: 1, label: 'Stellenangebot analysieren' },
  { id: 2, label: 'Lebenslauf lesen & übersetzen' },
  { id: 3, label: 'Match-Score berechnen' },
  { id: 4, label: 'CV auf Deutsch optimieren' },
  { id: 5, label: 'Anschreiben verfassen' },
  { id: 6, label: 'Interviewfragen generieren' },
];

export default function LoadingOverlay({ active }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active) { setPhase(0); return; }
    setPhase(1);
    const iv = setInterval(() => {
      setPhase(p => { if (p >= PHASES.length) { clearInterval(iv); return p; } return p + 1; });
    }, 900);
    return () => clearInterval(iv);
  }, [active]);

  if (!active) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 28,
      animation: 'overlayIn 0.2s ease',
    }}>
      {/* Card */}
      <div style={{
        background: 'var(--bg-1)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '32px 40px',
        boxShadow: 'var(--shadow-lg)', minWidth: 340,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
      }}>
        {/* Spinner */}
        <div style={{ position: 'relative', width: 56, height: 56 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            border: '3px solid var(--border)',
            borderTop: '3px solid var(--accent)',
            animation: 'spin 0.9s linear infinite',
          }} />
          <span style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>🎯</span>
        </div>

        {/* Phases */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
          {PHASES.map((p, i) => {
            const idx = i + 1;
            const done = phase > idx;
            const current = phase === idx;
            return (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                opacity: phase < idx ? 0.3 : 1, transition: 'opacity 0.3s',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600,
                  background: done ? 'var(--accent)' : current ? 'var(--accent-bg)' : 'var(--bg-3)',
                  border: `2px solid ${done || current ? 'var(--accent)' : 'var(--border)'}`,
                  color: done ? '#fff' : current ? 'var(--accent)' : 'var(--text-dim)',
                  transition: 'all 0.3s',
                }}>
                  {done ? '✓' : idx}
                </div>
                <span style={{
                  fontSize: 13, fontWeight: current ? 600 : 400,
                  color: done ? 'var(--accent)' : current ? 'var(--text)' : 'var(--text-dim)',
                  transition: 'color 0.3s',
                }}>
                  {p.label}
                </span>
                {current && (
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}>
                    {[0,1,2].map(d => (
                      <span key={d} style={{
                        width: 4, height: 4, borderRadius: '50%',
                        background: 'var(--accent)', display: 'block',
                        animation: 'dotBounce 1.2s ease infinite',
                        animationDelay: `${d * 0.2}s`,
                      }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p style={{
          fontSize: 12, color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)', marginTop: 4,
        }}>
          KI analysiert… einen Moment bitte.
        </p>
      </div>
    </div>
  );
}
