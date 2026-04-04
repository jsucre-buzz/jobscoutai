import { useState, useEffect } from 'react';
import Icon from '../lib/icons';

const PHASES = [
  { id: 1, label: 'Stellenangebot analysieren',      icon: 'doc' },
  { id: 2, label: 'Lebenslauf lesen & übersetzen',   icon: 'doc' },
  { id: 3, label: 'Match-Score berechnen',           icon: 'chart' },
  { id: 4, label: 'CV auf Deutsch optimieren',       icon: 'doc' },
  { id: 5, label: 'Anschreiben verfassen',           icon: 'mail' },
  { id: 6, label: 'Interviewfragen generieren',      icon: 'question' },
];

export default function LoadingOverlay({ active }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!active) { setPhase(0); return; }
    setPhase(1);
    const iv = setInterval(() => setPhase(p => { if (p >= PHASES.length) { clearInterval(iv); return p; } return p + 1; }), 900);
    return () => clearInterval(iv);
  }, [active]);

  if (!active) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'overlayIn 0.2s ease' }}>
      <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px 36px', boxShadow: 'var(--shadow-lg)', minWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>

        {/* Logo spinner */}
        <div style={{ position: 'relative', width: 60, height: 60 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2.5px solid var(--border)', borderTop: '2.5px solid var(--accent)', animation: 'spin 0.9s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.svg" width="36" height="36" alt="JS" style={{ borderRadius: 6 }} />
          </div>
        </div>

        {/* Phases */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          {PHASES.map((p, i) => {
            const idx = i + 1;
            const done = phase > idx;
            const current = phase === idx;
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: phase < idx ? 0.25 : 1, transition: 'opacity 0.3s' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? 'var(--accent)' : current ? 'var(--accent-bg)' : 'var(--bg-3)', border: `2px solid ${done || current ? 'var(--accent)' : 'var(--border)'}`, transition: 'all 0.3s' }}>
                  {done
                    ? <Icon name="check" size={12} color="#fff"/>
                    : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: current ? 'var(--accent)' : 'var(--text-dim)' }}>{idx}</span>}
                </div>
                <span style={{ fontSize: 13, fontWeight: current ? 600 : 400, color: done ? 'var(--accent)' : current ? 'var(--text)' : 'var(--text-dim)', flex: 1, transition: 'color 0.3s' }}>
                  {p.label}
                </span>
                {current && (
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[0,1,2].map(d => <span key={d} style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', display: 'block', animation: 'dotBounce 1.2s ease infinite', animationDelay: `${d*0.2}s` }} />)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          KI analysiert… einen Moment bitte.
        </p>
      </div>
    </div>
  );
}
