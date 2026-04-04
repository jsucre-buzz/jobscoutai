import { useEffect, useState } from 'react';
import Icon from '../lib/icons';

const FEATURES = [
  { icon: 'target',  label: 'Unbegrenzte Analysen pro Tag' },
  { icon: 'doc',     label: 'PDF Export (CV + Anschreiben)' },
  { icon: 'chart',   label: 'Bewerbungs-Tracker' },
  { icon: 'refresh', label: 'Unbegrenzte Regenerierungen' },
  { icon: 'pro',     label: 'PayPal & Kreditkarte' },
  { icon: 'check',   label: 'Keine Datenspeicherung (auch PRO)' },
];

const PENDING_LEGAL = [
  'Impressum mit vollständiger Adresse',
  'AGB gemäß BGB',
  'Widerrufsrecht (14 Tage)',
  'DSGVO-konforme Datenschutzerklärung',
  'Umsatzsteuer-ID (in Vorbereitung)',
];

export default function ProModal({ open, onClose, openForm }) {
  const [email, setEmail] = useState('');
  const [sent,  setSent]  = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  function handleSubmit() {
    if (!email.trim()) return;
    if (openForm) openForm(email.trim());
    setSent(true);
    setTimeout(() => { setSent(false); setEmail(''); }, 3000);
  }

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'overlayIn 0.2s ease' }}>
      <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', animation: 'modalIn 0.25s ease', boxShadow: 'var(--shadow-lg)' }}>

        {/* Header */}
        <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: 'var(--amber-bg)', border: '1px solid var(--amber)33', fontSize: 11, fontWeight: 600, color: 'var(--amber)', marginBottom: 10 }}>
              In Kürze verfügbar
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 6, letterSpacing: '-0.02em' }}>
              JobScoutAI PRO
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Trag dich in die Warteliste ein – wir melden uns beim Launch.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
        </div>

        {/* Waitlist form */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', background: 'var(--accent-bg)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--accent)', marginBottom: 12, letterSpacing: '0.06em' }}>
            WARTELISTE
          </div>
          {sent ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 9, background: 'var(--bg-1)', border: '1px solid var(--accent-border)', color: 'var(--accent)', fontSize: 14, fontWeight: 600 }}>
              <Icon name="check" size={18} color="var(--accent)" />
              Danke! Wir melden uns beim PRO-Launch.
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="deine@email.de"
                style={{ flex: 1, background: 'var(--bg-1)', border: '1px solid var(--border-bright)', borderRadius: 9, padding: '10px 14px', color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 13, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e  => e.target.style.borderColor = 'var(--border-bright)'}
              />
              <button onClick={handleSubmit} style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'opacity 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Eintragen
              </button>
            </div>
          )}
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginTop: 8 }}>
            Kein Spam. Nur eine Nachricht beim Launch.
          </p>
        </div>

        {/* Features */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginBottom: 14, letterSpacing: '0.06em' }}>
            WAS KOMMT IM PRO-PLAN
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 14px', borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                <Icon name={f.icon} size={15} color="var(--accent)" />
                <span style={{ fontSize: 13, color: 'var(--text)', flex: 1 }}>{f.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)', background: 'var(--amber-bg)', padding: '2px 7px', borderRadius: 4 }}>bald</span>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Icon name="check" size={18} color="var(--accent)" style={{ marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Keine Datenspeicherung — in keinem Plan</div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Weder Free noch PRO speichern deine Texte dauerhaft. Alles wird nach der Analyse verworfen. Kein Profil, kein Verlauf, keine Weitergabe.
            </p>
          </div>
        </div>

        {/* Legal pending */}
        <div style={{ padding: '16px 28px 24px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Rechtliches — in Vorbereitung
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {PENDING_LEGAL.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid var(--border-bright)', flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            © 2026 JobScoutAI – José Sucre · Alle Rechte vorbehalten
          </p>
        </div>

      </div>
    </div>
  );
}
