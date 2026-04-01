import { useEffect, useState } from 'react';

function scoreColor(s) {
  if (s >= 75) return 'var(--accent)';
  if (s >= 50) return 'var(--amber)';
  return 'var(--red)';
}
function scoreLabel(s) {
  if (s >= 75) return 'Starke Übereinstimmung';
  if (s >= 50) return 'Gute Übereinstimmung';
  return 'Geringe Übereinstimmung';
}

function Column({ title, items, accent, bg }) {
  return (
    <div style={{
      background: bg, border: `1px solid ${accent}33`,
      borderRadius: 'var(--radius)', padding: '16px', flex: 1, minWidth: 160,
      animation: 'fadeIn 0.5s ease',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: accent,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, display: 'inline-block' }} />
        {title}
      </div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {(items || []).map((item, i) => (
          <li key={i} style={{
            fontSize: 13, color: 'var(--text)', paddingLeft: 14,
            position: 'relative', lineHeight: 1.45,
          }}>
            <span style={{
              position: 'absolute', left: 2, top: 7,
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

export default function MatchScore({ score, strengths, gaps, tips }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const target = score || 0;
    let step = 0; const steps = 60;
    const iv = setInterval(() => {
      step++;
      const eased = 1 - Math.pow(1 - step / steps, 3);
      setDisplayed(Math.round(eased * target));
      if (step >= steps) clearInterval(iv);
    }, 1200 / 60);
    return () => clearInterval(iv);
  }, [score]);

  const color = scoreColor(score);

  return (
    <div style={{ animation: 'slideUp 0.4s ease' }}>
      {/* Score row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
        <div style={{
          fontSize: 52, fontWeight: 800, color,
          lineHeight: 1, letterSpacing: '-0.03em', fontFamily: 'var(--font-sans)',
        }}>
          {displayed}<span style={{ fontSize: 24, opacity: 0.6 }}>%</span>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Match Score</div>
          <div style={{ fontSize: 13, color, fontWeight: 500 }}>{scoreLabel(score)}</div>
        </div>
      </div>

      {/* Bar */}
      <div style={{
        height: 8, borderRadius: 4, background: 'var(--bg-3)',
        marginBottom: 20, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${displayed}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 4, transition: 'width 0.016s linear',
        }} />
      </div>

      {/* 3 columns */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Column title="Stärken"  items={strengths} accent="var(--accent)" bg="var(--accent-bg)" />
        <Column title="Lücken"   items={gaps}      accent="var(--red)"    bg="var(--red-bg)" />
        <Column title="Tipps"    items={tips}      accent="var(--amber)"  bg="var(--amber-bg)" />
      </div>
    </div>
  );
}
