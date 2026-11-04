import { Settings, DEFAULTS, KEY } from './types';
import { mountCursor } from './cursor';
import { mountPet, removePet, setTheme } from './pet';

let styleEl: HTMLStyleElement | null = null;
let cleanupFns: (() => void)[] = [];
let appRoot: HTMLDivElement | null = null;

// Function to get or create a safe root element for React Hydration
export function getAppRoot() {
  if (!appRoot) {
    appRoot = document.createElement('div');
    appRoot.id = 'pibblora-root';
    Object.assign(appRoot.style, {
      position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
      pointerEvents: 'none', zIndex: '2147483647'
    });
    // Append to <html> instead of <body> to avoid React hydration mismatch
    document.documentElement.appendChild(appRoot);
  }
  return appRoot;
}

function injectStyle() {
  if (styleEl) return;
  styleEl = document.createElement('style');
  styleEl.id = 'pibblora-style';
  styleEl.textContent = `
    .pibblora-pet-container { position: fixed; top: 0; left: 0; z-index: 2147483646; pointer-events: none; opacity: 0; transition: opacity 0.3s ease; }
    .pibblora-pet-inner { filter: drop-shadow(0 6px 10px rgba(0,0,0,0.2)); user-select: none; }
    @keyframes pibblora-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
    @keyframes pibblora-float  { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-8px) rotate(3deg)} }
    @keyframes pibblora-wiggle { 0%,100%{transform:rotate(-10deg)} 50%{transform:rotate(10deg)} }
  `;
  document.head.appendChild(styleEl);
}

function apply(s: Settings) {
  setTheme(s.theme.preset); 
  injectStyle();
  mountPet(s, cleanupFns);
  mountCursor(s, cleanupFns);
}

function teardown() {
  removePet();
  cleanupFns.forEach(fn => fn());
  cleanupFns = [];
}

async function getSettings(): Promise<Settings> {
  try {
    const r = await chrome.storage.local.get(KEY);
    return { ...DEFAULTS, ...(r[KEY] || {}) };
  } catch { return DEFAULTS; }
}

async function boot() {
  const s = await getSettings();
  apply(s);

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes[KEY]?.newValue) {
      teardown();
      apply({ ...DEFAULTS, ...changes[KEY].newValue });
    }
  });
}

if (!(window as any).__pibbloraInjected) {
  (window as any).__pibbloraInjected = true;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}