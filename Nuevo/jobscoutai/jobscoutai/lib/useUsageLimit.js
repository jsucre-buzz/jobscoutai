// ─────────────────────────────────────────────
// JobScoutAI – Usage Limit System
// localStorage key: jcv3_usage
// Max free attempts: 3
// Future: replace checkLimit() with server-side
//         session check (NextAuth + Stripe)
// ─────────────────────────────────────────────

const STORAGE_KEY = 'jcv3_usage';
const FREE_LIMIT = 3;

// Obfuscated to make casual reset harder
// (not bulletproof – real protection = server-side)
function encode(n) {
  return btoa(`jsa_${n}_${navigator.userAgent.slice(0, 8)}`);
}
function decode(str) {
  try {
    const raw = atob(str);
    const match = raw.match(/^jsa_(\d+)_/);
    return match ? parseInt(match[1], 10) : 0;
  } catch {
    return 0;
  }
}

export function initUsage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, encode(0));
      return 0;
    }
    return decode(stored);
  } catch {
    return 0;
  }
}

export function incrementUsage() {
  try {
    const current = initUsage();
    const next = current + 1;
    localStorage.setItem(STORAGE_KEY, encode(next));
    return next;
  } catch {
    return 1;
  }
}

export function checkLimit() {
  try {
    const current = initUsage();
    return {
      count: current,
      remaining: Math.max(0, FREE_LIMIT - current),
      limitReached: current >= FREE_LIMIT,
      FREE_LIMIT,
    };
  } catch {
    return { count: 0, remaining: FREE_LIMIT, limitReached: false, FREE_LIMIT };
  }
}

// ─── React hook ───────────────────────────────
import { useState, useEffect } from 'react';

export function useUsageLimit() {
  const [state, setState] = useState({
    count: 0, remaining: FREE_LIMIT,
    limitReached: false, FREE_LIMIT, loaded: false,
  });

  useEffect(() => {
    const s = checkLimit();
    setState({ ...s, loaded: true });
  }, []);

  function increment() {
    const newCount = incrementUsage();
    const newState = {
      count: newCount,
      remaining: Math.max(0, FREE_LIMIT - newCount),
      limitReached: newCount >= FREE_LIMIT,
      FREE_LIMIT, loaded: true,
    };
    setState(newState);
    return newCount;
  }

  return { ...state, incrementUsage: increment };
}
