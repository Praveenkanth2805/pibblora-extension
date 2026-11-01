import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import type { Settings } from './types';
import { defaultSettings, loadSettings, saveSettings, subscribe } from './storage';
import { applyTheme } from './theme';

interface Store { settings: Settings; update: (updater: (s: Settings) => Settings) => void; ready: boolean; }
const Ctx = createContext<Store>({ settings: defaultSettings, update: () => {}, ready: false });

export function StoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadSettings().then(s => { if (!cancelled) { setSettings(s); setReady(true); } });
    const unsub = subscribe(s => setSettings(s));
    return () => { cancelled = true; unsub(); };
  }, []);

  useEffect(() => { if (ready) applyTheme(settings.theme.preset); }, [settings.theme.preset, ready]);

  const update = useCallback((updater: (s: Settings) => Settings) => {
    setSettings(prev => { const next = updater(prev); saveSettings(next); return next; });
  }, []);

  return <Ctx.Provider value={{ settings, update, ready }}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);