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
    const interval = setInterval(() => {
      setPhase(p => {
        if (p >= PHASES.length) { clearInterval(interval); return p; }
        return p + 1;
      });
    }, 900);
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.93)',
      backdropFilter: 'blur(8px)', zIndex: 1000,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 32,
      animation: 'overlayIn 0.2s ease',
    }}>
      <div style={{ position: 'relative', width: 72, height: 72 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          border: '2px solid var(--border)',
          borderTop: '2px solid var(--green)',
          animation: 'spin 1s linear infinite',
        }} />
        <span style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
        }}>🎯</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 300 }}>
        {PHASES.map((p, i) => {
          const idx = i + 1;
          const done = phase > idx;
          const current = phase === idx;
          const pending = phase < idx;
          return (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: pending ? 0.25 : 1, transition: 'opacity 0.3s' }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontFamily: 'var(--font-mono)',
                background: done ? 'var(--green)' : current ? 'var(--green-bg)' : 'var(--bg-3)',
                border: `1px solid ${done ? 'var(--green)' : current ? 'var(--green)' : 'var(--border)'}`,
                color: done ? 'var(--bg)' : current ? 'var(--green)' : 'var(--text-dim)',
                animation: current ? 'glow 1.2s ease infinite' : 'none',
              }}>
                {done ? '✓' : idx}
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: done ? 'var(--green)' : current ? 'var(--text)' : 'var(--text-dim)' }}>
                {p.label}
              </span>
              {current && (
                <span style={{ display: 'flex', gap: 3, marginLeft: 'auto' }}>
                  {[0,1,2].map(d => (
                    <span key={d} style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--green)', animation: `dotBounce 1.2s ease infinite`, animationDelay: `${d * 0.2}s`, display: 'block' }} />
                  ))}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
        KI analysiert auf Deutsch…
      </p>
    </div>
  );
}
