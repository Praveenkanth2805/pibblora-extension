import type { Settings } from './types';

const KEY = 'pibblora:settings';

export const defaultSettings: Settings = {
  theme: { preset: 'cream' },
  pet: { enabled: false, type: 'cat', color: '#C9B6FF', size: 64, animation: 'bounce', customImage: '' },
  cursor: { enabled: false, style: 'stars', color: '#FFC9DE', size: 18, customCursor: false },
  widgets: { timer: true, notes: true, checklist: true, miniClock: true },
  dreamtab: {
    enabled: true,
    username: '',
    greeting: 'Hello',
    background: 'cream',
    showSearch: true,
    showClock: true,
    shortcuts: [
      { id: '1', label: 'YouTube', url: 'https://youtube.com' },
      { id: '2', label: 'GitHub', url: 'https://github.com' },
    ],
  },
  widgetsData: { note: '', checklist: [], timerMinutes: 5 },
};

const hasChrome = (): boolean =>
  typeof chrome !== 'undefined' && !!chrome?.storage?.local;

export async function loadSettings(): Promise<Settings> {
  try {
    if (hasChrome()) {
      const r = await chrome.storage.local.get(KEY);
      return mergeDefaults(r[KEY]);
    }
    const raw = localStorage.getItem(KEY);
    return mergeDefaults(raw ? JSON.parse(raw) : null);
  } catch {
    return { ...defaultSettings };
  }
}

export async function saveSettings(s: Settings): Promise<void> {
  try {
    if (hasChrome()) await chrome.storage.local.set({ [KEY]: s });
    else localStorage.setItem(KEY, JSON.stringify(s));
  } catch { /* noop */ }
}

export function subscribe(cb: (s: Settings) => void): () => void {
  if (hasChrome() && chrome.storage.onChanged) {
    const listener = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
      if (area === 'local' && changes[KEY]?.newValue) cb(mergeDefaults(changes[KEY].newValue));
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }
  const handler = (e: StorageEvent) => {
    if (e.key === KEY && e.newValue) cb(mergeDefaults(JSON.parse(e.newValue)));
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

function mergeDefaults(s: any): Settings {
  if (!s) return { ...defaultSettings };
  return {
    ...defaultSettings, ...s,
    theme: { ...defaultSettings.theme, ...(s.theme || {}) },
    pet: { ...defaultSettings.pet, ...(s.pet || {}) },
    cursor: { ...defaultSettings.cursor, ...(s.cursor || {}) },
    widgets: { ...defaultSettings.widgets, ...(s.widgets || {}) },
    dreamtab: { ...defaultSettings.dreamtab, ...(s.dreamtab || {}) },
    widgetsData: { ...defaultSettings.widgetsData, ...(s.widgetsData || {}) },
  };
}