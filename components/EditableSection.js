import { useState, useRef } from 'react';

function CopyButton({ text, lang }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button onClick={handleCopy} style={{
      fontFamily: 'var(--font-mono)', fontSize: 11,
      padding: '4px 10px', borderRadius: 4,
      border: `1px solid ${copied ? 'var(--green)' : 'var(--border-bright)'}`,
      background: copied ? 'var(--green)' : 'transparent',
      color: copied ? 'var(--bg)' : 'var(--text-muted)',
      cursor: 'pointer', transition: 'all 0.2s ease',
      display: 'flex', alignItems: 'center', gap: 5,
    }}>
      {copied ? '✓' : '⎘'} {copied ? (lang === 'de' ? 'Kopiert!' : 'Copied!') : (lang === 'de' ? 'Kopieren' : 'Copy')}
    </button>
  );
}

function ActionButton({ onClick, loading, icon, label, color = 'var(--text-muted)', borderColor = 'var(--border-bright)' }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      fontFamily: 'var(--font-mono)', fontSize: 11,
      padding: '4px 10px', borderRadius: 4,
      border: `1px solid ${borderColor}`,
      background: 'transparent',
      color: loading ? 'var(--text-dim)' : color,
      cursor: loading ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', gap: 5,
      opacity: loading ? 0.5 : 1,
      transition: 'all 0.15s ease',
    }}
      onMouseEnter={e => { if (!loading) e.currentTarget.style.borderColor = color; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
    >
      {loading ? <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>↻</span> : icon} {label}
    </button>
  );
}

export default function EditableSection({
  title, icon, content, onContentChange,
  onRegenerate, onSimplify,
  lang = 'de', isQA = false, loading = false,
}) {
  const [sectionLoading, setSectionLoading] = useState(false);
  const textareaRef = useRef(null);

  async function handleRegen() {
    if (!onRegenerate) return;
    setSectionLoading(true);
    await onRegenerate();
    setSectionLoading(false);
  }

  async function handleSimplify() {
    if (!onSimplify) return;
    setSectionLoading(true);
    await onSimplify();
    setSectionLoading(false);
  }

  // For Q&A: render list of editable pairs
  if (isQA && Array.isArray(content)) {
    return (
      <div style={{
        background: 'var(--bg-2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        animation: 'fadeIn 0.4s ease',
      }}>
        <div style={{
          padding: '14px 18px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>{icon}</span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{title}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <CopyButton text={content.map((qa, i) => `Q${i+1}: ${qa.question}\nA: ${qa.answer}`).join('\n\n')} lang={lang} />
            {onRegenerate && (
              <ActionButton onClick={handleRegen} loading={sectionLoading}
                icon="↺" label={lang === 'de' ? 'Neu' : 'Regen'} />
            )}
          </div>
        </div>
        <div style={{ padding: '0' }}>
          {content.map((qa, i) => (
            <div key={i} style={{
              padding: '16px 18px',
              borderBottom: i < content.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--green)', marginBottom: 6,
                display: 'flex', gap: 8, alignItems: 'center',
              }}>
                <span style={{
                  background: 'var(--green-bg)', border: '1px solid var(--green)22',
                  borderRadius: 3, padding: '1px 6px',
                }}>Q{i+1}</span>
              </div>
              <textarea
                value={qa.question}
                onChange={e => {
                  const updated = [...content];
                  updated[i] = { ...updated[i], question: e.target.value };
                  onContentChange(updated);
                }}
                style={{
                  width: '100%', background: 'transparent',
                  border: 'none', color: 'var(--text)',
                  fontFamily: 'var(--font-sans)', fontSize: 14,
                  fontWeight: 600, resize: 'none',
                  outline: 'none', marginBottom: 8,
                  lineHeight: 1.5,
                }}
                rows={2}
              />
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--amber)', marginBottom: 6,
              }}>
                <span style={{
                  background: 'var(--amber-bg)', border: '1px solid var(--amber)22',
                  borderRadius: 3, padding: '1px 6px',
                }}>A</span>
              </div>
              <textarea
                value={qa.answer}
                onChange={e => {
                  const updated = [...content];
                  updated[i] = { ...updated[i], answer: e.target.value };
                  onContentChange(updated);
                }}
                style={{
                  width: '100%', background: 'transparent',
                  border: 'none', color: 'var(--text-muted)',
                  fontFamily: 'var(--font-sans)', fontSize: 13,
                  resize: 'none', outline: 'none',
                  lineHeight: 1.6,
                }}
                rows={3}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Standard text section
  const textValue = typeof content === 'string' ? content : '';
  const charCount = textValue.length;

  return (
    <div style={{
      background: 'var(--bg-2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      animation: 'fadeIn 0.4s ease',
      opacity: sectionLoading ? 0.7 : 1,
      transition: 'opacity 0.2s',
    }}>
      <div style={{
        padding: '14px 18px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>{icon}</span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{title}</span>
          {sectionLoading && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'var(--green)', animation: 'pulse 1s infinite',
            }}>
              {lang === 'de' ? 'lädt…' : 'loading…'}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--text-dim)',
          }}>{charCount} {lang === 'de' ? 'Zeichen' : 'chars'}</span>
          <CopyButton text={textValue} lang={lang} />
          {onSimplify && (
            <ActionButton onClick={handleSimplify} loading={sectionLoading}
              icon="◈" label={lang === 'de' ? 'Kürzen' : 'Simplify'}
              color="var(--amber)" borderColor="var(--amber)33" />
          )}
          {onRegenerate && (
            <ActionButton onClick={handleRegen} loading={sectionLoading}
              icon="↺" label={lang === 'de' ? 'Neu' : 'Regen'}
              color="var(--green)" borderColor="var(--green)33" />
          )}
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={textValue}
        onChange={e => onContentChange(e.target.value)}
        style={{
          width: '100%', minHeight: 160,
          background: 'transparent', border: 'none',
          color: 'var(--text)', fontFamily: 'var(--font-mono)',
          fontSize: 13, lineHeight: 1.7,
          padding: '16px 18px', resize: 'vertical',
          outline: 'none',
        }}
      />
    </div>
  );
}
