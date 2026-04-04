import { useState } from 'react';
import Icon from '../lib/icons';

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div onClick={e => { if (e.target===e.currentTarget) onClose(); }} style={{ position:'fixed',inset:0,zIndex:3000,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,animation:'overlayIn 0.2s ease' }}>
      <div style={{ background:'var(--bg-1)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',width:'100%',maxWidth:600,maxHeight:'82vh',overflowY:'auto',animation:'modalIn 0.25s ease',padding:'28px',boxShadow:'var(--shadow-lg)' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22 }}>
          <h3 style={{ fontWeight:700,fontSize:18,color:'var(--text)' }}>{title}</h3>
          <button onClick={onClose} style={{ background:'none',border:'1px solid var(--border)',color:'var(--text-muted)',width:32,height:32,borderRadius:8,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center' }}>×</button>
        </div>
        <div style={{ fontSize:14,color:'var(--text-muted)',lineHeight:1.8 }}>{children}</div>
      </div>
    </div>
  );
}

function Sec({ title, children }) {
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ fontFamily:'var(--font-mono)',fontSize:11,fontWeight:600,color:'var(--accent)',letterSpacing:'0.07em',textTransform:'uppercase',marginBottom:8 }}>{title}</div>
      {children}
    </div>
  );
}

const LINKS = [
  { key:'impressum',  label:'Impressum',    icon:'warning' },
  { key:'privacy',    label:'Datenschutz',  icon:'lock' },
  { key:'terms',      label:'AGB',          icon:'doc' },
  { key:'disclaimer', label:'Disclaimer',   icon:'info' },
];

export default function Footer() {
  const [modal, setModal] = useState(null);

  return (
    <>
      <footer style={{ borderTop:'1px solid var(--border)',background:'var(--bg-1)',marginTop:60 }}>
        {/* Top row */}
        <div style={{ maxWidth:900,margin:'0 auto',padding:'28px 24px 0' }}>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16,marginBottom:20 }}>

            {/* App brand */}
            <div style={{ display:'flex',alignItems:'center',gap:10 }}>
              <img src="/logo.svg" width="32" height="32" alt="JS" style={{ borderRadius:8,flexShrink:0 }} />
              <div>
                <div style={{ fontWeight:700,fontSize:15,color:'var(--text)',lineHeight:1.2 }}>JobScoutAI</div>
                <div style={{ fontSize:11,color:'var(--text-muted)',fontFamily:'var(--font-mono)' }}>KI-Bewerbungsoptimierung</div>
              </div>
            </div>

            {/* Personal badge */}
            <div style={{ display:'flex',alignItems:'center',gap:8,padding:'6px 12px',borderRadius:9,background:'var(--bg-3)',border:'1px solid var(--border)' }}>
              <div style={{ width:26,height:26,borderRadius:6,background:'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                <span style={{ fontSize:10,fontWeight:800,color:'#fff',fontFamily:'var(--font-mono)',letterSpacing:'-0.5px' }}>JS</span>
              </div>
              <div>
                <div style={{ fontSize:12,fontWeight:600,color:'var(--text)',lineHeight:1.2 }}>José Sucre</div>
                <div style={{ fontSize:10,color:'var(--text-muted)',fontFamily:'var(--font-mono)' }}>Developer · Burglengenfeld</div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height:1,background:'var(--border)',marginBottom:20 }} />

          {/* Links row */}
          <div style={{ display:'flex',gap:24,flexWrap:'wrap',marginBottom:20 }}>
            {LINKS.map(l => (
              <button key={l.key} onClick={() => setModal(l.key)} style={{
                display:'flex',alignItems:'center',gap:6,
                background:'none',border:'none',cursor:'pointer',
                fontSize:14,fontWeight:500,color:'var(--text-muted)',
                padding:0,transition:'color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <Icon name={l.icon} size={14} color="currentColor" />
                {l.label}
              </button>
            ))}
          </div>

          {/* Bottom */}
          <div style={{ height:1,background:'var(--border)',marginBottom:16 }} />
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8,paddingBottom:24 }}>
            <span style={{ fontSize:13,fontWeight:500,color:'var(--text-muted)' }}>© 2026 JobScoutAI – Alle Rechte vorbehalten</span>
            <span style={{ fontSize:12,color:'var(--text-dim)',fontFamily:'var(--font-mono)' }}>Kein Tracking · Keine Datenspeicherung</span>
          </div>
        </div>
      </footer>

      {/* IMPRESSUM */}
      <Modal open={modal==='impressum'} onClose={() => setModal(null)} title="Impressum">
        <Sec title="Angaben gemäß § 5 TMG">
          <p style={{marginBottom:4}}><strong style={{color:'var(--text)'}}>JobScoutAI</strong></p>
          <p>Betreiber: José Sucre</p>
          <p>Brunnmühstraße 33A</p>
          <p>93133 Burglengenfeld, Deutschland</p>
          <p style={{marginTop:8}}>E-Mail: <a href="mailto:josemsucre@gmail.com" style={{color:'var(--accent)',textDecoration:'none'}}>josemsucre@gmail.com</a></p>
        </Sec>
        <Sec title="Umsatzsteuer">
          <p>USt-IdNr. gemäß § 27a UStG: <span style={{color:'var(--amber)',fontFamily:'var(--font-mono)',fontSize:12}}>in Vorbereitung</span></p>
        </Sec>
        <Sec title="Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV">
          <p>José Sucre, Brunnmühstraße 33A, 93133 Burglengenfeld</p>
        </Sec>
        <Sec title="Streitschlichtung">
          <p>Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: ec.europa.eu/consumers/odr. Wir nehmen nicht an Streitbeilegungsverfahren teil.</p>
        </Sec>
        <div style={{marginTop:16,padding:'10px 14px',background:'var(--amber-bg)',border:'1px solid var(--amber)33',borderRadius:'var(--radius)',fontFamily:'var(--font-mono)',fontSize:11,color:'var(--amber)'}}>
          ⚠ USt-IdNr. wird nach Registrierung ergänzt.
        </div>
      </Modal>

      {/* DATENSCHUTZ */}
      <Modal open={modal==='privacy'} onClose={() => setModal(null)} title="Datenschutzerklärung">
        <Sec title="1. Keine Datenspeicherung">
          <p><strong style={{color:'var(--accent)'}}>JobScoutAI speichert keine Eingaben dauerhaft.</strong> Stellenangebote und Lebensläufe werden ausschließlich zur KI-Analyse gesendet und danach verworfen.</p>
        </Sec>
        <Sec title="2. Verarbeitung durch Dritte">
          <p>Texte werden an die <strong style={{color:'var(--text)'}}>Anthropic API</strong> zur Verarbeitung übermittelt. Anthropic verarbeitet Daten gemäß anthropic.com/privacy. Keine weitere Weitergabe.</p>
        </Sec>
        <Sec title="3. Lokale Speicherung (localStorage)">
          <p>Nur ein anonymer Nutzungszähler (wie viele kostenlose Analysen heute genutzt wurden). Kein Name, keine E-Mail, keine persönlichen Daten.</p>
        </Sec>
        <Sec title="4. Cookies & Tracking">
          <p>Keine Tracking-Cookies, keine Analytics, keine Werbecookies.</p>
        </Sec>
        <Sec title="5. Kontakt">
          <p><a href="mailto:josemsucre@gmail.com" style={{color:'var(--accent)',textDecoration:'none'}}>josemsucre@gmail.com</a></p>
        </Sec>
        <div style={{marginTop:16,padding:'10px 14px',background:'var(--amber-bg)',border:'1px solid var(--amber)33',borderRadius:'var(--radius)',fontFamily:'var(--font-mono)',fontSize:11,color:'var(--amber)'}}>
          ⚠ DSGVO-konforme Vollversion wird vor kostenpflichtigem Launch ergänzt.
        </div>
      </Modal>

      {/* AGB */}
      <Modal open={modal==='terms'} onClose={() => setModal(null)} title="Allgemeine Geschäftsbedingungen">
        <Sec title="1. Betreiber">
          <p>José Sucre, Brunnmühstraße 33A, 93133 Burglengenfeld, Deutschland.</p>
        </Sec>
        <Sec title="2. Leistung">
          <p>JobScoutAI ist ein KI-Hilfswerkzeug zur Bewerbungsoptimierung. Die kostenlose Version erlaubt 3 Analysen/Tag. Eine kostenpflichtige Version ist in Vorbereitung.</p>
        </Sec>
        <Sec title="3. Nutzungsbedingungen">
          <p>Ausschließlich für legale, persönliche Bewerbungszwecke. Automatisierter Zugriff ist untersagt.</p>
        </Sec>
        <Sec title="4. Widerrufsrecht">
          <p>Da derzeit keine kostenpflichtigen Leistungen angeboten werden, entfällt das Widerrufsrecht. Nach Launch des PRO-Plans gilt 14 Tage Widerrufsrecht gemäß § 355 BGB.</p>
        </Sec>
        <Sec title="5. Haftungsausschluss">
          <p>JobScoutAI haftet nicht für Entscheidungen auf Basis der generierten Inhalte. Die Ausgaben sind KI-Vorschläge, keine professionelle Rechts- oder Karriereberatung.</p>
        </Sec>
        <Sec title="6. Recht & Gerichtsstand">
          <p>Es gilt deutsches Recht. Gerichtsstand: Burglengenfeld, Deutschland.</p>
        </Sec>
      </Modal>

      {/* DISCLAIMER */}
      <Modal open={modal==='disclaimer'} onClose={() => setModal(null)} title="Disclaimer">
        <Sec title="Kein Erfolgsversprechen">
          <p><strong style={{color:'var(--text)'}}>JobScoutAI garantiert weder eine Anstellung noch eine Einladung zum Vorstellungsgespräch.</strong> Die Ausgaben sind KI-generierte Vorschläge und ersetzen nicht professionelle Karriereberatung.</p>
        </Sec>
        <Sec title="Qualität">
          <p>Die Qualität hängt von der Vollständigkeit der Eingaben ab. Kurze oder ungenaue Texte führen zu weniger präzisen Ergebnissen.</p>
        </Sec>
        <Sec title="Datenschutz">
          <p>Alle Texte werden nach der Analyse verworfen. Kein Verlauf, kein Profil, keine Weitergabe.</p>
        </Sec>
        <p style={{marginTop:16,fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-dim)'}}>
          Kontakt: josemsucre@gmail.com · Burglengenfeld, Bayern
        </p>
      </Modal>
    </>
  );
}
