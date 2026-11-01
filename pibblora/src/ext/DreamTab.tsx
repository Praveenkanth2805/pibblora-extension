import { useEffect, useMemo, useState, type FormEvent, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Plus, Trash2, Check, Timer as TimerIcon, StickyNote, ListChecks,
  Clock as ClockIcon, Sparkles, ArrowUpRight, Globe, RotateCcw, Play, Pause,
  Command, X, CalendarDays, Zap,
} from 'lucide-react';
import { useStore } from '../shared/StoreContext';
import { presets } from '../shared/theme';
import { MagicLayer } from '../shared/MagicLayer';
import type { ChecklistItem, ThemePreset } from '../shared/types';

type ThemeColors = {
  bg: string;
  surface: string;
  border: string;
  text: string;
  primary: string;
  accent: string;
};

const greetingFor = (hour: number) =>
  hour < 5 ? 'Still up' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

const glassStyle = (bg: ThemeColors): CSSProperties => ({
  background: bg.surface,
  borderColor: bg.border,
  color: bg.text,
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
});

const iconButtonStyle = (bg: ThemeColors): CSSProperties => ({
  borderColor: bg.border,
  color: bg.text,
});

function Clock({ textColor }: { textColor: string }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="text-center" style={{ color: textColor }}>
      <motion.div initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.8, ease: 'easeOut' }}>
        <p className="mb-2 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.38em] opacity-55 sm:text-xs">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: textColor }} />
          Your moment, your space
        </p>
        <h1 className="font-display text-6xl font-semibold tracking-[-0.075em] drop-shadow-sm sm:text-7xl md:text-8xl">
          {time}
        </h1>
        <p className="mt-2 flex items-center justify-center gap-2 text-sm font-medium opacity-65 sm:text-base">
          <CalendarDays size={15} /> {date}
        </p>
      </motion.div>
    </div>
  );
}

function SectionTitle({ icon, title, subtitle, bg }: { icon: React.ReactNode; title: string; subtitle?: string; bg: ThemeColors }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border" style={{ background: `${bg.primary}18`, borderColor: bg.border, color: bg.primary }}>
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[10px] opacity-55">{subtitle}</p>}
      </div>
    </div>
  );
}

function Notes({ bg }: { bg: ThemeColors }) {
  const { settings, update } = useStore();
  const note = settings.widgetsData.note ?? '';

  return (
    <motion.section whileHover={{ y: -2 }} className="flex flex-1 flex-col rounded-[24px] border p-4 shadow-lg shadow-black/[0.03]" style={glassStyle(bg)}>
      <SectionTitle icon={<StickyNote size={16} />} title="Quick notes" subtitle="Thoughts worth keeping" bg={bg} />
      <textarea
        value={note}
        onChange={(e) => update((s) => ({ ...s, widgetsData: { ...s.widgetsData, note: e.target.value } }))}
        rows={3}
        maxLength={10000}
        placeholder="Capture a thought..."
        className="w-full flex-1 resize-none rounded-xl border border-transparent bg-black/[0.025] p-3 text-sm leading-5 outline-none transition placeholder:opacity-40 focus:border-current/20 focus:outline-none focus:ring-0"
        style={{ color: bg.text }}
      />
      <p className="mt-2 text-right text-[9px] opacity-40">{note.length} chars</p>
    </motion.section>
  );
}

function Checklist({ bg }: { bg: ThemeColors }) {
  const { settings, update } = useStore();
  const [text, setText] = useState('');
  const items = settings.widgetsData.checklist ?? [];
  const completed = items.filter((item) => item.done).length;

  const add = () => {
    const value = text.trim();
    if (!value) return;
    const item: ChecklistItem = { id: crypto.randomUUID(), text: value, done: false };
    update((s) => ({ ...s, widgetsData: { ...s.widgetsData, checklist: [...s.widgetsData.checklist, item] } }));
    setText('');
  };

  return (
    <motion.section whileHover={{ y: -2 }} className="flex flex-1 flex-col rounded-[24px] border p-4 shadow-lg shadow-black/[0.03]" style={glassStyle(bg)}>
      <SectionTitle icon={<ListChecks size={16} />} title="Checklist" subtitle={`${completed} of ${items.length} done`} bg={bg} />
      
      <form onSubmit={(e) => { e.preventDefault(); add(); }} className="mb-2 flex gap-1.5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add task..."
          className="min-w-0 flex-1 rounded-xl border bg-black/[0.025] px-3 py-2 text-xs outline-none focus:border-current/30 focus:outline-none focus:ring-0"
          style={{ borderColor: bg.border }}
        />
        <button type="submit" disabled={!text.trim()} className="grid h-8 w-8 place-items-center rounded-xl disabled:opacity-35" style={{ background: bg.primary, color: '#fff' }}>
          <Plus size={16} />
        </button>
      </form>

      <ul className="max-h-32 flex-1 space-y-1 overflow-y-auto pr-1 dreamtab-scrollbar">
        {items.length === 0 && <li className="py-4 text-center text-[10px] opacity-45">Add your first task.</li>}
        {items.map((item) => (
          <li key={item.id} className="group flex items-center gap-2 rounded-lg px-1 py-1.5 transition hover:bg-black/[0.025]">
            <button
              onClick={() => update((s) => ({ ...s, widgetsData: { ...s.widgetsData, checklist: s.widgetsData.checklist.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i)) } }))}
              className="grid h-4 w-4 shrink-0 place-items-center rounded border transition"
              style={{ borderColor: item.done ? bg.primary : bg.border, background: item.done ? bg.primary : 'transparent', color: '#fff' }}
            >
              {item.done && <Check size={10} />}
            </button>
            <span className={`min-w-0 flex-1 truncate text-xs ${item.done ? 'line-through opacity-40' : 'opacity-85'}`}>{item.text}</span>
            <button onClick={() => update((s) => ({ ...s, widgetsData: { ...s.widgetsData, checklist: s.widgetsData.checklist.filter((i) => i.id !== item.id) } }))} className="opacity-0 transition group-hover:opacity-40 hover:text-red-500 hover:!opacity-100">
              <Trash2 size={12} />
            </button>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

function Timer({ bg }: { bg: ThemeColors }) {
  const { settings, update } = useStore();
  const total = Math.min(120, Math.max(1, Number(settings.widgetsData.timerMinutes) || 1)) * 60;
  const [left, setLeft] = useState(total);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => { setLeft(total); setRunning(false); setStarted(false); }, [total]);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setLeft((prev) => Math.max(0, prev - 1)), 1000);
    return () => window.clearInterval(id);
  }, [running]);
  useEffect(() => { if (left === 0 && running) { setRunning(false); setStarted(false); } }, [left, running]);

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const progress = total > 0 ? ((total - left) / total) * 100 : 0;

  return (
    <motion.section whileHover={{ y: -2 }} className="flex flex-1 flex-col rounded-[24px] border p-4 shadow-lg shadow-black/[0.03]" style={glassStyle(bg)}>
      <SectionTitle icon={<TimerIcon size={16} />} title="Timer" subtitle="Make time count" bg={bg} />
      
      <div className="relative mx-auto grid h-24 w-24 place-items-center">
        <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="51" fill="none" stroke={bg.border} strokeWidth="6" />
          <motion.circle cx="60" cy="60" r="51" fill="none" stroke={bg.primary} strokeWidth="6" strokeLinecap="round" strokeDasharray={2 * Math.PI * 51} animate={{ strokeDashoffset: 2 * Math.PI * 51 * (1 - progress / 100) }} transition={{ duration: 0.4 }} />
        </svg>
        <div className="text-center">
          <p className="font-display text-2xl font-semibold tracking-tight">{mm}:{ss}</p>
        </div>
      </div>

      <div className="mt-auto flex justify-center gap-1.5 pt-2">
        <button onClick={() => { if (left === 0) setLeft(total); setStarted(true); setRunning((v) => (left === 0 ? true : !v)); }} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold transition hover:brightness-110" style={{ background: bg.primary, color: '#fff' }}>
          {running ? <Pause size={11} /> : <Play size={11} />} {running ? 'Pause' : started ? 'Resume' : 'Start'}
        </button>
        <button onClick={() => { setLeft(total); setRunning(false); setStarted(false); }} className="grid h-7 w-7 place-items-center rounded-full border transition hover:bg-black/[0.04]" style={iconButtonStyle(bg)}>
          <RotateCcw size={12} />
        </button>
      </div>
    </motion.section>
  );
}

function MiniClock({ bg }: { bg: ThemeColors }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <motion.section whileHover={{ y: -2 }} className="flex flex-1 flex-col justify-between rounded-[24px] border p-4 shadow-lg shadow-black/[0.03]" style={glassStyle(bg)}>
      <SectionTitle icon={<ClockIcon size={16} />} title="Local time" subtitle="A moment of now" bg={bg} />
      <div className="py-2 text-center">
        <p className="font-display text-3xl font-semibold tracking-tight">
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="mt-1 text-[10px] opacity-55">{now.toLocaleDateString([], { weekday: 'long' })}</p>
      </div>
      <div className="flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px]" style={{ background: `${bg.primary}12` }}>
        <span className="h-1 w-1 rounded-full" style={{ background: bg.primary }} /> Your time zone
      </div>
    </motion.section>
  );
}

export default function DreamTab() {
  const { settings, update } = useStore();
  const [q, setQ] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const bg = (presets[settings.dreamtab.background] || presets.cream) as ThemeColors;
  const defaultGreeting = useMemo(() => greetingFor(new Date().getHours()), []);
  const displayName = settings.dreamtab.username ? `, ${settings.dreamtab.username}` : '';

  const enabledWidgets = [settings.widgets.miniClock, settings.widgets.timer, settings.widgets.notes, settings.widgets.checklist].filter(Boolean).length;

  useEffect(() => {
    if (settings && settings.dreamtab.enabled === false) window.location.replace('https://www.google.com');
  }, [settings]);

  useEffect(() => {
    document.title = settings.dreamtab.username ? `${settings.dreamtab.username}'s Tab` : 'DreamTab';
  }, [settings.dreamtab.username]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        document.getElementById('dreamtab-search')?.focus();
      }
      if (event.key === 'Escape') {
        setShowThemePicker(false);
        (document.activeElement as HTMLElement | null)?.blur();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (!settings.dreamtab.enabled) return null;

  const doSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = q.trim();
    if (!query) return;
    if (typeof chrome !== 'undefined' && chrome.search) chrome.search.query({ text: query });
    else window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  const addShortcut = () => {
    const label = window.prompt('Shortcut name?')?.trim();
    if (!label) return;
    const rawUrl = window.prompt('Website URL?')?.trim();
    if (!rawUrl) return;
    try {
      const url = new URL(/^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`);
      if (!['http:', 'https:'].includes(url.protocol)) return;
      update((s) => ({ ...s, dreamtab: { ...s.dreamtab, shortcuts: [...s.dreamtab.shortcuts, { id: crypto.randomUUID(), label: label.slice(0, 60), url: url.href }] } }));
    } catch { window.alert('Please enter a valid website URL.'); }
  };

  const removeShortcut = (id: string) => {
    update((s) => ({ ...s, dreamtab: { ...s.dreamtab, shortcuts: s.dreamtab.shortcuts.filter((shortcut) => shortcut.id !== id) } }));
  };

  const themes = Object.keys(presets) as ThemePreset[];

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden selection:bg-white/30" style={{ background: bg.bg, color: bg.text, fontFamily: 'inherit' }}>
      <style>{`
        @keyframes dreamtab-float-a { 0%, 100% { transform: translate3d(0, 0, 0) scale(1); } 50% { transform: translate3d(30px, 24px, 0) scale(1.08); } }
        @keyframes dreamtab-float-b { 0%, 100% { transform: translate3d(0, 0, 0) scale(1); } 50% { transform: translate3d(-24px, 34px, 0) scale(1.06); } }
        .dreamtab-scrollbar { scrollbar-width: thin; scrollbar-color: currentColor transparent; }
        .dreamtab-scrollbar::-webkit-scrollbar { width: 4px; }
        .dreamtab-scrollbar::-webkit-scrollbar-thumb { background: currentColor; border-radius: 99px; opacity: .25; }
        @media (prefers-reduced-motion: reduce) { .dreamtab-orb { animation: none !important; } }
      `}</style>

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="dreamtab-orb absolute -left-[18%] -top-[15%] h-[65vw] w-[65vw] rounded-full opacity-20 blur-[90px] sm:blur-[130px]" style={{ background: bg.primary, animation: 'dreamtab-float-a 16s ease-in-out infinite' }} />
        <div className="dreamtab-orb absolute -right-[20%] top-[18%] h-[55vw] w-[55vw] rounded-full opacity-20 blur-[90px] sm:blur-[130px]" style={{ background: bg.accent, animation: 'dreamtab-float-b 19s ease-in-out infinite' }} />
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(currentColor 0.65px, transparent 0.65px)', backgroundSize: '18px 18px' }} />
      </div>

      <MagicLayer />

      <header className="relative z-30 flex w-full shrink-0 items-center justify-between px-6 py-4">
        <a href="#dreamtab-home" className="group flex items-center gap-2.5 outline-none">
          <div className="grid h-8 w-8 place-items-center rounded-xl border shadow-sm transition-transform duration-300 group-hover:rotate-6" style={{ background: bg.surface, borderColor: bg.border }}>
            <Sparkles size={16} style={{ color: bg.primary }} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight">Pibblora</p>
            <p className="text-[8px] font-medium uppercase tracking-[0.24em] opacity-50">Your personal space</p>
          </div>
        </a>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button onClick={() => setShowThemePicker((v) => !v)} aria-label="Choose appearance" className="grid h-9 w-9 place-items-center rounded-xl border shadow-sm transition hover:-translate-y-0.5" style={{ background: bg.surface, borderColor: bg.border }}>
              <Sparkles size={16} />
            </button>
            {showThemePicker && (
              <div className="absolute right-0 top-10 z-50 w-60 rounded-2xl border p-3 shadow-2xl" style={glassStyle(bg)}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold">Choose your mood</p>
                  <button onClick={() => setShowThemePicker(false)} className="rounded-lg p-1 opacity-60 hover:opacity-100"><X size={14} /></button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {themes.map((theme) => (
                    <button key={theme} onClick={() => { update((s) => ({ ...s, dreamtab: { ...s.dreamtab, background: theme } })); setShowThemePicker(false); }} className="flex flex-col items-center gap-1 rounded-lg p-1.5 transition hover:bg-black/[0.04]">
                      <span className="grid h-7 w-7 place-items-center rounded-full border-2 shadow-sm" style={{ background: presets[theme].primary, borderColor: settings.dreamtab.background === theme ? bg.text : bg.border }}>
                        {settings.dreamtab.background === theme && <Check size={12} color="#fff" />}
                      </span>
                      <span className="max-w-full truncate text-[8px] capitalize opacity-70">{theme}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div id="dreamtab-home" className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-6 pb-28 justify-between overflow-hidden">
        
        <section className="flex flex-col items-center justify-center pt-4 shrink-0">
          {settings.dreamtab.showClock && <Clock textColor={bg.text} />}

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }} className="mt-3 text-center">
            <p className="text-lg font-medium tracking-tight opacity-80 sm:text-xl">
              {defaultGreeting}{displayName} <span className="ml-1 inline-block origin-bottom-right animate-[wave_2s_ease-in-out_infinite]">✨</span>
            </p>
          </motion.div>

          {settings.dreamtab.showSearch && (
            <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }} onSubmit={doSearch} className="mt-5 w-full max-w-xl">
              <div
                className="group flex items-center gap-2 rounded-full border p-1.5 pl-4 pr-2 transition duration-300"
                style={{
                  background: bg.surface,
                  borderColor: isTyping ? bg.primary : bg.border,
                  boxShadow: isTyping ? `0 0 0 4px ${bg.primary}18, 0 10px 30px -15px ${bg.primary}70` : '0 8px 30px -15px rgba(0,0,0,.15)',
                  backdropFilter: 'blur(26px)'
                }}
              >
                <Search size={18} className="shrink-0 transition" style={{ color: isTyping ? bg.primary : bg.text, opacity: isTyping ? 1 : 0.45 }} />
                <input
                  id="dreamtab-search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setIsTyping(false)}
                  placeholder="Search anything..."
                  // இங்க தான் Focus Outline-ஐ முழுசா நீக்கிட்டேன்
                  className="min-w-0 flex-1 bg-transparent py-1.5 text-sm outline-none border-none ring-0 focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none focus-visible:ring-0 appearance-none placeholder:opacity-40"
                  style={{ color: bg.text }}
                />
                <div className="hidden items-center gap-1 rounded-md border px-1.5 py-1 text-[9px] opacity-40 md:flex" style={{ borderColor: bg.border }}>
                  <Command size={10} /><span>K</span>
                </div>
                <button type="submit" disabled={!q.trim()} className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition hover:brightness-110 disabled:opacity-40" style={{ background: bg.primary, color: '#fff' }}>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </motion.form>
          )}

          {settings.dreamtab.shortcuts.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {settings.dreamtab.shortcuts.map((shortcut) => (
                <div key={shortcut.id} className="group relative flex items-center rounded-full border transition hover:-translate-y-0.5 hover:shadow-md" style={{ background: bg.surface, borderColor: bg.border }}>
                  <a href={shortcut.url} target="_blank" rel="noopener noreferrer" className="flex min-h-8 max-w-[150px] items-center gap-1.5 rounded-full py-1 pl-3 pr-2 text-xs font-medium">
                    <Globe size={12} style={{ color: bg.primary }} />
                    <span className="truncate">{shortcut.label}</span>
                  </a>
                  <button onClick={() => removeShortcut(shortcut.id)} className="mr-1.5 grid h-5 w-5 place-items-center rounded-full opacity-40 transition hover:bg-red-500/10 hover:text-red-500 hover:opacity-100">
                    <X size={10} />
                  </button>
                </div>
              ))}
              <button onClick={addShortcut} className="flex min-h-8 items-center gap-1 rounded-full border border-dashed px-3 py-1 text-xs font-medium transition hover:border-solid hover:opacity-100 opacity-70" style={{ borderColor: bg.border, color: bg.text }}>
                <Plus size={12} /> Add
              </button>
            </motion.div>
          )}
        </section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-auto pt-6 shrink-0">
          <div className="mb-3 flex items-end justify-between">
             <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.3em] opacity-40"><Zap size={10} /> Your space</p>
             <span className="text-[9px] font-medium opacity-50">{enabledWidgets} widgets active</span>
          </div>

          {enabledWidgets > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {settings.widgets.miniClock && <MiniClock bg={bg} />}
              {settings.widgets.timer && <Timer bg={bg} />}
              {settings.widgets.notes && <Notes bg={bg} />}
              {settings.widgets.checklist && <Checklist bg={bg} />}
            </div>
          ) : (
            <div className="rounded-2xl border px-4 py-8 text-center" style={glassStyle(bg)}>
               <Sparkles size={20} className="mx-auto mb-2 opacity-50" />
               <p className="text-xs opacity-50">Widgets are turned off. Enable them in settings.</p>
            </div>
          )}
        </motion.section>

      </div>
    </main>
  );
}