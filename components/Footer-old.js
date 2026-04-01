import { useState } from 'react';

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 3000,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, animation: 'overlayIn 0.2s ease',
      }}
    >
      <div style={{
        background: 'var(--bg-1)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 620,
        maxHeight: '82vh', overflowY: 'auto',
        animation: 'modalIn 0.25s ease', padding: '28px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: 18 }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid var(--border)',
            color: 'var(--text-muted)', width: 30, height: 30,
            borderRadius: 6, cursor: 'pointer', fontSize: 16,
          }}>×</button>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.8 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'var(--green)', letterSpacing: '0.08em',
        textTransform: 'uppercase', marginBottom: 8,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export default function Footer() {
  const [modal, setModal] = useState(null);

  return (
    <>
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px 0', marginTop: 60,
        background: 'var(--bg-1)',
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto', padding: '0 24px',
          display: 'flex', flexWrap: 'wrap', gap: 16,
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text-dim)',
          }}>
            © 2026 JobScoutAI – Alle Rechte vorbehalten
          </div>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { key: 'impressum', label: 'Impressum' },
              { key: 'privacy', label: 'Datenschutz' },
              { key: 'terms', label: 'AGB' },
              { key: 'disclaimer', label: 'Disclaimer' },
            ].map(item => (
              <button key={item.key} onClick={() => setModal(item.key)} style={{
                background: 'none', border: 'none',
                color: 'var(--text-dim)', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 11,
                textDecoration: 'underline', textUnderlineOffset: 3,
                transition: 'color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-muted)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* IMPRESSUM */}
      <Modal open={modal === 'impressum'} onClose={() => setModal(null)} title="Impressum">
        <Section title="Angaben gemäß § 5 TMG">
          <p><strong style={{ color: 'var(--text)' }}>JobScoutAI</strong></p>
          <p>Betreiber: [Dein vollständiger Name]</p>
          <p>Adresse: [Straße Hausnummer], [PLZ] [Stadt], Deutschland</p>
          <p>E-Mail: [deine@email.de]</p>
        </Section>
        <Section title="Umsatzsteuer">
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:{' '}
            <span style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>
              [in Vorbereitung]
            </span>
          </p>
        </Section>
        <Section title="Verantwortlich für den Inhalt">
          <p>[Dein vollständiger Name], Anschrift wie oben</p>
        </Section>
        <Section title="Streitschlichtung">
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <span style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
              https://ec.europa.eu/consumers/odr
            </span>
          </p>
          <p style={{ marginTop: 8 }}>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </Section>
        <div style={{
          marginTop: 16, padding: '10px 14px',
          background: 'var(--amber-bg)', border: '1px solid var(--amber)33',
          borderRadius: 'var(--radius)', fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--amber)',
        }}>
          ⚠ Impressum noch nicht vollständig — wird vor dem offiziellen Launch vervollständigt.
        </div>
      </Modal>

      {/* DATENSCHUTZ */}
      <Modal open={modal === 'privacy'} onClose={() => setModal(null)} title="Datenschutzerklärung">
        <Section title="1. Keine Datenspeicherung">
          <p>
            <strong style={{ color: 'var(--green)' }}>
              JobScoutAI speichert keine deiner Eingaben dauerhaft.
            </strong>{' '}
            Weder im kostenlosen noch im zukünftigen PRO-Plan werden Stellenangebote,
            Lebensläufe oder generierte Inhalte auf unseren Servern gespeichert.
            Nach der Verarbeitung durch die KI werden alle Daten verworfen.
          </p>
        </Section>
        <Section title="2. Was passiert mit deinen Texten">
          <p>
            Die eingegebenen Texte werden ausschließlich zur Analyse an die{' '}
            <strong style={{ color: 'var(--text)' }}>Anthropic API</strong> (USA) übermittelt.
            Anthropic verarbeitet diese Daten gemäß ihrer eigenen Datenschutzrichtlinie
            (anthropic.com/privacy). Es findet keine Weitergabe an Dritte statt.
          </p>
        </Section>
        <Section title="3. Lokale Speicherung (localStorage)">
          <p>
            Im Browser wird ausschließlich ein anonymer Nutzungszähler gespeichert,
            der festhält wie viele Analysen heute durchgeführt wurden (max. 3 kostenlos).
            Kein Name, keine E-Mail, keine persönlichen Daten.
          </p>
        </Section>
        <Section title="4. Cookies">
          <p>
            Diese Seite verwendet keine Tracking-Cookies, keine Analytics,
            keine Werbecookies. Keine Weitergabe an Werbenetzwerke.
          </p>
        </Section>
        <Section title="5. Empfehlung">
          <p>
            Gib keine sensiblen persönlichen Daten ein, die über das für eine
            Bewerbung Notwendige hinausgehen.
          </p>
        </Section>
        <Section title="6. Kontakt Datenschutz">
          <p>Bei Fragen: [deine@email.de]</p>
        </Section>
        <div style={{
          marginTop: 16, padding: '10px 14px',
          background: 'var(--amber-bg)', border: '1px solid var(--amber)33',
          borderRadius: 'var(--radius)', fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--amber)',
        }}>
          ⚠ DSGVO-konforme Vollversion wird vor dem offiziellen Launch ergänzt.
        </div>
      </Modal>

      {/* AGB */}
      <Modal open={modal === 'terms'} onClose={() => setModal(null)} title="Allgemeine Geschäftsbedingungen (AGB)">
        <Section title="1. Geltungsbereich">
          <p>
            Diese AGB gelten für die Nutzung von JobScoutAI unter [deine-domain.de].
            Betreiber ist [Dein Name], [Adresse].
          </p>
        </Section>
        <Section title="2. Leistungsbeschreibung">
          <p>
            JobScoutAI ist ein KI-gestütztes Hilfswerkzeug zur Bewerbungsoptimierung.
            Die kostenlose Version erlaubt 3 Analysen pro Tag. Eine kostenpflichtige
            Version ist in Vorbereitung.
          </p>
        </Section>
        <Section title="3. Nutzungsbedingungen">
          <p>
            Die Nutzung ist ausschließlich für legale, persönliche Bewerbungszwecke erlaubt.
            Die Erstellung von Inhalten für Dritte ist nur mit deren ausdrücklichem
            Einverständnis gestattet. Automatisierter Zugriff (Bots, Scraper) ist untersagt.
          </p>
        </Section>
        <Section title="4. Widerrufsrecht (§ 312g BGB)">
          <p>
            Da derzeit keine kostenpflichtigen Leistungen angeboten werden, entfällt das
            Widerrufsrecht bis zum Launch des PRO-Plans. Nach Einführung kostenpflichtiger
            Dienste gilt ein Widerrufsrecht von{' '}
            <strong style={{ color: 'var(--text)' }}>14 Tagen</strong> gemäß § 355 BGB.
            Eine Widerrufsbelehrung wird vor dem Launch ergänzt.
          </p>
        </Section>
        <Section title="5. Haftungsausschluss">
          <p>
            JobScoutAI übernimmt keine Haftung für Entscheidungen, die auf Basis der
            generierten Inhalte getroffen werden. Die KI-Ausgaben sind Vorschläge,
            keine professionelle Rechts- oder Karriereberatung.
          </p>
        </Section>
        <Section title="6. Geistiges Eigentum">
          <p>
            Plattform, Design und Code sind urheberrechtlich geschützt.
            © 2026 JobScoutAI – Alle Rechte vorbehalten.
          </p>
        </Section>
        <Section title="7. Anwendbares Recht">
          <p>
            Es gilt deutsches Recht. Gerichtsstand ist [deine Stadt], Deutschland.
          </p>
        </Section>
        <div style={{
          marginTop: 16, padding: '10px 14px',
          background: 'var(--amber-bg)', border: '1px solid var(--amber)33',
          borderRadius: 'var(--radius)', fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--amber)',
        }}>
          ⚠ AGB werden vor Aktivierung des kostenpflichtigen Plans von einem Rechtsanwalt geprüft.
        </div>
      </Modal>

      {/* DISCLAIMER */}
      <Modal open={modal === 'disclaimer'} onClose={() => setModal(null)} title="Disclaimer">
        <Section title="KI-Hilfswerkzeug — kein Erfolgsversprechen">
          <p>
            <strong style={{ color: 'var(--text)' }}>
              JobScoutAI garantiert weder eine Anstellung noch eine Einladung zum Vorstellungsgespräch.
            </strong>
          </p>
          <p style={{ marginTop: 10 }}>
            Die generierten Inhalte — optimierter Lebenslauf, Anschreiben, Interviewantworten
            und Match Score — sind KI-generierte Vorschläge. Sie dienen als Orientierung und
            ersetzen nicht die Einschätzung von HR-Experten oder Karrierecoaches.
          </p>
        </Section>
        <Section title="Qualität der Ausgaben">
          <p>
            Die Qualität hängt direkt von der Vollständigkeit und Genauigkeit der eingegebenen
            Informationen ab. Unvollständige oder ungenaue Eingaben führen zu weniger präzisen Ergebnissen.
          </p>
        </Section>
        <Section title="Keine dauerhafte Datenspeicherung">
          <p>
            Alle eingegebenen Texte (Stellenangebot, Lebenslauf) werden ausschließlich für
            die KI-Analyse verwendet und danach verworfen. Es wird kein Bewerbungsverlauf
            gespeichert, kein Profil angelegt, keine Daten weitergegeben.
          </p>
        </Section>
      </Modal>
    </>
  );
}
