import { useEffect, useState, type CSSProperties } from 'react';
import { Search, Timer, StickyNote, ListChecks, Clock, Play, RotateCcw, Check } from 'lucide-react';
import { useStore } from '../../shared/StoreContext';
import { presets } from '../../shared/theme';
import type { ThemePreset } from '../../shared/types';
import { motion } from 'framer-motion';
import { petIcons } from '../../shared/theme';

type ThemeColors = { bg: string; surface: string; border: string; text: string; primary: string; accent: string };

const glassStyle = (bg: ThemeColors): CSSProperties => ({
  background: bg.surface,
  borderColor: bg.border,
  color: bg.text,
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
});

function SectionTitle({ icon, title, bg }: { icon: React.ReactNode; title: string; bg: ThemeColors }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <div className="grid h-6 w-6 place-items-center rounded-lg border" style={{ background: `${bg.primary}18`, borderColor: bg.border, color: bg.primary }}>
        {icon}
      </div>
      <h3 className="text-[11px] font-semibold tracking-tight">{title}</h3>
    </div>
  );
}

export function DreamTabPreview({ forceTheme }: { forceTheme?: ThemePreset }) {
  const { settings } = useStore();
  const [now, setNow] = useState(new Date());
  const [isTesting, setIsTesting] = useState(false);
  
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const activeTheme = forceTheme || settings.dreamtab.background;
  const bg = (presets[activeTheme] || presets.cream) as ThemeColors;
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleTestMove = () => {
    if (isTesting) return;
    setIsTesting(true);
    setTimeout(() => setIsTesting(false), 8000);
  };

  const isSpider = settings.pet.type === 'spiderman';
  
  // Spider goes RB -> RT -> LT -> LB -> RB
  // Other pets go RB -> LB -> LT -> RT -> RB
  const leftPath = isSpider 
    ? ['85%', '85%', '10%', '10%', '85%'] 
    : ['85%', '10%', '10%', '85%', '85%'];
  const topPath = isSpider 
    ? ['85%', '10%', '10%', '85%', '85%'] 
    : ['85%', '85%', '10%', '10%', '85%'];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border shadow-lg" style={{ borderColor: bg.border }}>
      {/* Browser Window Header */}
      <div className="absolute top-0 left-0 w-full h-8 bg-black/10 flex items-center justify-between px-4 z-10 backdrop-blur-md">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <span className="ml-2 text-[10px] font-semibold opacity-50">Live Preview</span>
        </div>
        
        {/* Test Button */}
        {settings.pet.enabled && (
          <button 
            onClick={handleTestMove}
            disabled={isTesting}
            className="px-2 py-0.5 text-[9px] font-bold rounded bg-black/10 hover:bg-black/20 transition disabled:opacity-50"
          >
            {isTesting ? 'Moving...' : 'Test Pet Move'}
          </button>
        )}
      </div>

      {/* Mini DreamTab Content */}
      <div className="min-h-[360px] pt-12 pb-6 px-4 flex flex-col items-center transition-colors duration-500 relative" style={{ background: bg.bg, color: bg.text }}>
        
        {settings.dreamtab.showClock && (
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight">{time}</h1>
            <p className="text-[10px] opacity-70 mt-1">{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        )}

        {settings.dreamtab.showSearch && (
          <div className="mt-4 w-full max-w-sm flex items-center gap-2 rounded-full border px-3 py-2 opacity-80 shadow-sm"
            style={{ background: bg.surface, borderColor: bg.border }}>
            <Search size={12} className="opacity-50" />
            <span className="text-[11px] opacity-50">Search the web...</span>
          </div>
        )}

        <div className="mt-4 flex gap-1.5 flex-wrap justify-center">
          {settings.dreamtab.shortcuts.slice(0, 3).map(s => (
            <span key={s.id} className="rounded-full border px-3 py-1 text-[10px]"
              style={{ background: bg.surface, borderColor: bg.border }}>
              {s.label}
            </span>
          ))}
        </div>

        {/* Pet Image - Initial Fade-in at Bottom Right, Moves only when testing */}
        {settings.pet.enabled && (
          <motion.img
            src={petIcons[settings.pet.type]?.src}
            draggable={false}
            className="absolute w-8 h-8 object-contain pointer-events-none z-20 drop-shadow-md"
            initial={{ opacity: 0, left: '85%', top: '85%' }}
            animate={
              isTesting 
                ? { left: leftPath, top: topPath, opacity: 1 }
                : { left: '85%', top: '85%', opacity: 1 }
            }
            transition={{ 
              duration: isTesting ? 8 : 0.5, 
              ease: 'linear' 
            }}
          />
        )}

        {/* Widgets Grid */}
        <div className="mt-6 grid w-full grid-cols-2 gap-2 max-w-sm">
          {settings.widgets.miniClock && (
            <div className="rounded-xl border p-2.5 shadow-sm" style={glassStyle(bg)}>
              <SectionTitle icon={<Clock size={12} />} title="Local Time" bg={bg} />
              <p className="font-display text-lg font-bold mt-1">{time}</p>
            </div>
          )}
          
          {settings.widgets.timer && (
            <div className="rounded-xl border p-2.5 shadow-sm flex flex-col items-center" style={glassStyle(bg)}>
              <div className="w-full mb-1"><SectionTitle icon={<Timer size={12} />} title="Timer" bg={bg} /></div>
              <div className="relative grid h-14 w-14 place-items-center mt-1">
                <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r="51" fill="none" stroke={bg.border} strokeWidth="8" />
                  <circle cx="60" cy="60" r="51" fill="none" stroke={bg.primary} strokeWidth="8" strokeLinecap="round" strokeDasharray={2 * Math.PI * 51} strokeDashoffset={2 * Math.PI * 51 * 0.2} />
                </svg>
                <p className="font-display text-xs font-bold">05:00</p>
              </div>
              <div className="flex gap-1 mt-2">
                 <button className="px-2 py-0.5 rounded-full text-[8px] font-bold text-white" style={{background: bg.primary}}><Play size={8} className="inline"/> Start</button>
                 <button className="px-1.5 py-0.5 rounded-full border text-[8px]" style={{borderColor: bg.border}}><RotateCcw size={8} /></button>
              </div>
            </div>
          )}

          {settings.widgets.notes && (
            <div className="rounded-xl border p-2.5 shadow-sm flex flex-col" style={glassStyle(bg)}>
              <SectionTitle icon={<StickyNote size={12} />} title="Notes" bg={bg} />
              <div className="w-full flex-1 rounded bg-black/5 mt-1 border border-dashed" style={{ borderColor: bg.border }} />
            </div>
          )}

          {settings.widgets.checklist && (
            <div className="rounded-xl border p-2.5 shadow-sm flex flex-col" style={glassStyle(bg)}>
              <SectionTitle icon={<ListChecks size={12} />} title="Checklist" bg={bg} />
              <div className="w-full flex-1 flex flex-col gap-1 mt-1">
                <div className="flex items-center gap-1">
                  <div className="h-2.5 w-2.5 rounded border flex items-center justify-center" style={{ borderColor: bg.primary, background: bg.primary }}>
                    <Check size={8} className="text-white" />
                  </div>
                  <span className="text-[9px] line-through opacity-50">Task 1</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2.5 w-2.5 rounded border" style={{ borderColor: bg.border }} />
                  <span className="text-[9px] opacity-80">Task 2</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}