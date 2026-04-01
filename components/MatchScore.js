import { useEffect, useState } from 'react';

function scoreColor(score) {
  if (score >= 75) return 'var(--green)';
  if (score >= 50) return 'var(--amber)';
  return 'var(--red)';
}

function scoreLabel(score, lang) {
  if (lang === 'de') {
    if (score >= 75) return 'Starke Übereinstimmung';
    if (score >= 50) return 'Gute Übereinstimmung';
    return 'Geringe Übereinstimmung';
  }
  if (score >= 75) return 'Strong match';
  if (score >= 50) return 'Good match';
  return 'Low match';
}

function Column({ title, items, accent, bg }) {
  return (
    <div style={{
      background: bg, border: `1px solid ${accent}22`,
      borderRadius: 'var(--radius)', padding: '16px',
      flex: 1, animation: 'fadeIn 0.5s ease',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: accent, letterSpacing: '0.1em',
        textTransform: 'uppercase', marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, display: 'inline-block' }} />
        {title}
      </div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(items || []).map((item, i) => (
          <li key={i} style={{
            fontSize: 13, color: 'var(--text)',
            paddingLeft: 12, position: 'relative',
            lineHeight: 1.4,
          }}>
            <span style={{
              position: 'absolute', left: 0, top: 6,
              width: 4, height: 4, borderRadius: '50%',
              background: accent, display: 'block',
            }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MatchScore({ score, strengths, gaps, tips, lang = 'de' }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const target = score || 0;
    const duration = 1200;
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * target));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [score]);

  const color = scoreColor(score);

  return (
    <div style={{ animation: 'slideUp 0.5s ease' }}>
      {/* Score header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 20,
        marginBottom: 20,
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 52, fontWeight: 500,
          color, lineHeight: 1, letterSpacing: '-0.02em',
          textShadow: `0 0 30px ${color}44`,
        }}>
          {displayed}
          <span style={{ fontSize: 22, opacity: 0.7 }}>%</span>
        </div>
        <div>
          <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>
            Match Score
          </div>
          <div style={{ fontSize: 12, color: color, fontFamily: 'var(--font-mono)' }}>
            {scoreLabel(score, lang)}
          </div>
        </div>
      </div>

      {/* Animated bar */}
      <div style={{
        height: 8, borderRadius: 4,
        background: 'var(--bg-3)',
        marginBottom: 24,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${displayed}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 4,
          transition: 'width 0.016s linear',
          boxShadow: `0 0 12px ${color}66`,
        }} />
      </div>

      {/* 3 columns */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Column
          title={lang === 'de' ? 'Stärken' : 'Strengths'}
          items={strengths}
          accent="var(--green)"
          bg="var(--green-bg)"
        />
        <Column
          title={lang === 'de' ? 'Lücken' : 'Gaps'}
          items={gaps}
          accent="var(--red)"
          bg="var(--red-bg)"
        />
        <Column
          title="Tipps"
          items={tips}
          accent="var(--amber)"
          bg="var(--amber-bg)"
        />
      </div>
    </div>
  );
}
