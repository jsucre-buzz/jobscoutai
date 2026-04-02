import { useState } from 'react';
import Icon from '../lib/icons';

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(text); }
    catch { const el = document.createElement('textarea'); el.value = text; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} style={{
      display: 'flex', alignItems: 'center', gap: 5,
      fontFamily: 'var(--font-mono)', fontSize: 11, padding: '5px 11px',
      borderRadius: 7, border: `1px solid ${copied ? 'var(--accent)' : 'var(--border-bright)'}`,
      background: copied ? 'var(--accent)' : 'transparent',
      color: copied ? '#fff' : 'var(--text-muted)',
      cursor: 'pointer', transition: 'all 0.2s',
    }}>
      <Icon name={copied ? 'check' : 'copy'} size={13} color={copied ? '#fff' : 'var(--text-muted)'} />
      {copied ? 'Kopiert' : 'Kopieren'}
    </button>
  );
}

function ActionBtn({ onClick, loading, iconName, label, color }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      display: 'flex', alignItems: 'center', gap: 5,
      fontFamily: 'var(--font-mono)', fontSize: 11, padding: '5px 11px',
      borderRadius: 7, border: `1px solid ${color}44`,
      background: 'transparent', color: loading ? 'var(--text-dim)' : color,
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.5 : 1, transition: 'all 0.15s',
    }}
      onMouseEnter={e => { if (!loading) e.currentTarget.style.background = `${color}12`; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {loading
        ? <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}><Icon name="refresh" size={13} color={color}/></span>
        : <Icon name={iconName} size={13} color={color}/>}
      {label}
    </button>
  );
}

export default function EditableSection({ title, iconName, content, onContentChange, onRegenerate, onSimplify, isQA = false }) {
  const [busy, setBusy] = useState(false);
  async function regen() { if (!onRegenerate) return; setBusy(true); await onRegenerate(); setBusy(false); }
  async function simplify() { if (!onSimplify) return; setBusy(true); await onSimplify(); setBusy(false); }

  const card = {
    background: 'var(--bg-2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    boxShadow: 'var(--shadow)', animation: 'fadeIn 0.4s ease',
    opacity: busy ? 0.7 : 1, transition: 'opacity 0.2s',
  };
  const header = {
    padding: '13px 18px', borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 8, background: 'var(--bg-3)',
  };

  if (isQA && Array.isArray(content)) {
    return (
      <div style={card}>
        <div style={header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
            <Icon name={iconName} size={16} color="var(--accent)"/>
            {title}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <CopyBtn text={content.map((qa, i) => `F${i+1}: ${qa.question}\nA: ${qa.answer}`).join('\n\n')} />
            {onRegenerate && <ActionBtn onClick={regen} loading={busy} iconName="refresh" label="Neu" color="var(--accent)" />}
          </div>
        </div>
        {content.map((qa, i) => (
          <div key={i} style={{ padding: '16px 18px', borderBottom: i < content.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 7, padding: '2px 8px', borderRadius: 5, background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', fontSize: 11, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
              F{i+1}
            </div>
            <textarea value={qa.question} onChange={e => { const u = [...content]; u[i] = { ...u[i], question: e.target.value }; onContentChange(u); }}
              style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, resize: 'none', outline: 'none', marginBottom: 8, lineHeight: 1.5 }} rows={2} />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 7, padding: '2px 8px', borderRadius: 5, background: 'var(--amber-bg)', border: '1px solid var(--amber)33', fontSize: 11, fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>
              A
            </div>
            <textarea value={qa.answer} onChange={e => { const u = [...content]; u[i] = { ...u[i], answer: e.target.value }; onContentChange(u); }}
              style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: 13, resize: 'none', outline: 'none', lineHeight: 1.6 }} rows={3} />
          </div>
        ))}
      </div>
    );
  }

  const text = typeof content === 'string' ? content : '';
  return (
    <div style={card}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
          <Icon name={iconName} size={16} color="var(--accent)"/>
          {title}
          {busy && <span style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-mono)', animation: 'pulse 1s infinite' }}>lädt…</span>}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{text.length} Zeichen</span>
          <CopyBtn text={text} />
          {onSimplify   && <ActionBtn onClick={simplify} loading={busy} iconName="simplify" label="Kürzen"  color="var(--amber)" />}
          {onRegenerate && <ActionBtn onClick={regen}    loading={busy} iconName="refresh"  label="Neu"     color="var(--accent)" />}
        </div>
      </div>
      <textarea value={text} onChange={e => onContentChange(e.target.value)} style={{
        width: '100%', minHeight: 160, background: 'transparent', border: 'none',
        color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 13,
        lineHeight: 1.7, padding: '16px 18px', resize: 'vertical', outline: 'none',
      }} />
    </div>
  );
}
