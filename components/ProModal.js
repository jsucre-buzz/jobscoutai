import { useEffect } from 'react';

const COMING_SOON_FEATURES = [
  { icon: '⚡', label: 'Unbegrenzte Analysen pro Tag' },
  { icon: '📄', label: 'PDF Export (CV + Anschreiben)' },
  { icon: '🎯', label: 'Bewerbungs-Tracker' },
  { icon: '🔁', label: 'Unbegrenzte Regenerierungen' },
  { icon: '📬', label: 'Zahlungsoptionen: PayPal & Kreditkarte' },
  { icon: '🔒', label: 'Keine Datenspeicherung (auch nicht im Pro-Plan)' },
];

const PENDING_LEGAL = [
  'Impressum mit vollständiger Adresse',
  'AGB gemäß BGB',
  'Widerrufsrecht (14 Tage)',
  'DSGVO-konforme Datenschutzerklärung',
  'Umsatzsteuer-ID (in Vorbereitung)',
];

export default function ProModal({ open, onClose, lang = 'de' }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', animation: 'overlayIn 0.2s ease',
      }}
    >
      <div style={{
        background: 'var(--bg-1)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 580,
        maxHeight: '90vh', overflowY: 'auto',
        animation: 'modalIn 0.25s ease',
      }}>

        {/* Header */}
        <div style={{
          padding: '24px 28px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--amber)', letterSpacing: '0.12em',
              textTransform: 'uppercase', marginBottom: 8,
              background: 'var(--amber-bg)', border: '1px solid var(--amber)33',
              display: 'inline-block', padding: '3px 8px', borderRadius: 4,
            }}>
              🚧 In Kürze verfügbar
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
              JobScoutAI PRO
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Wir arbeiten an der PRO-Version. Trag dich ein und wir benachrichtigen dich beim Launch.
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid var(--border)',
            color: 'var(--text-muted)', width: 32, height: 32,
            borderRadius: 6, cursor: 'pointer', fontSize: 16,
            flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        {/* Waitlist */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--green-bg)',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--green)', marginBottom: 10, letterSpacing: '0.08em',
          }}>
            📬 WARTELISTE BEITRETEN
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              placeholder="deine@email.de"
              style={{
                flex: 1, background: 'var(--bg-2)',
                border: '1px solid var(--border-bright)',
                borderRadius: 'var(--radius)', padding: '9px 12px',
                color: 'var(--text)', fontFamily: 'var(--font-mono)',
                fontSize: 13, outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--green)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-bright)'}
            />
            <button
              onClick={() => alert('Danke! Wir melden uns beim PRO-Launch.')}
              style={{
                padding: '9px 18px',
                background: 'var(--green)', color: 'var(--bg)',
                border: 'none', borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              Eintragen
            </button>
          </div>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--text-dim)', marginTop: 8,
          }}>
            🔒 Kein Spam. Nur eine Nachricht beim Launch.
          </p>
        </div>

        {/* Coming soon features */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text-dim)', marginBottom: 14, letterSpacing: '0.08em',
          }}>
            WAS KOMMT IM PRO-PLAN
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {COMING_SOON_FEATURES.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '8px 12px', borderRadius: 'var(--radius)',
                background: 'var(--bg-2)', border: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{f.icon}</span>
                <span style={{ fontSize: 13, color: 'var(--text)' }}>{f.label}</span>
                <span style={{
                  marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'var(--amber)', background: 'var(--amber-bg)',
                  border: '1px solid var(--amber)22',
                  padding: '2px 6px', borderRadius: 3, whiteSpace: 'nowrap',
                }}>
                  bald
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Data privacy notice */}
        <div style={{
          padding: '16px 28px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-2)',
        }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>🔒</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                Keine Datenspeicherung — in keinem Plan
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Weder im Free- noch im zukünftigen PRO-Plan werden deine Texte (Stellenangebot, Lebenslauf)
                dauerhaft gespeichert. Die Daten werden ausschließlich zur KI-Analyse gesendet und danach
                verworfen. Kein Profil, kein Verlauf, keine Weitergabe an Dritte.
              </p>
            </div>
          </div>
        </div>

        {/* Legal pending */}
        <div style={{ padding: '16px 28px 24px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--text-dim)', marginBottom: 10,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Rechtliches — in Vorbereitung
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {PENDING_LEGAL.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 12, color: 'var(--text-dim)',
                fontFamily: 'var(--font-mono)',
              }}>
                <span style={{
                  width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                  border: '1px solid var(--border-bright)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, color: 'var(--amber)',
                }}>○</span>
                {item}
              </div>
            ))}
          </div>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--text-dim)', marginTop: 12,
            borderTop: '1px solid var(--border)', paddingTop: 12,
          }}>
            © 2026 JobScoutAI – Alle Rechte vorbehalten
          </p>
        </div>

      </div>
    </div>
  );
}
