import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../shared/StoreContext';
import { Card, Field, PageHeader, Section, Toggle } from '../../shared/ui';
import type { CursorStyle } from '../../shared/types';
import { cursorEmoji } from '../../shared/theme';

const styles: CursorStyle[] = ['stars', 'hearts', 'bubbles', 'trail', 'neon'];
const colors = ['#FFC9DE', '#C9B6FF', '#BDE7FF', '#C6F4DC', '#FFE0B2'];
const gradients = [
  'linear-gradient(45deg, #ff9a9e, #fecfef)',
  'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
];

export default function CursorStudio() {
  const { settings, update } = useStore();
  const c = settings.cursor;
  return (
    <>
      <PageHeader title="Cursor Studio" subtitle="A little sparkle every time you move." back={<Link to="/dashboard" className="mt-1.5 opacity-70 hover:opacity-100"><ArrowLeft size={18} /></Link>} />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="flex h-56 items-center justify-center rounded-2xl" style={{ background: `${c.color}22` }}>
            {c.style === 'neon' ? (
              <div style={{ 
                width: c.size * 2, height: c.size * 2, background: c.color, borderRadius: '50%', 
                boxShadow: `0 0 15px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4)` 
              }} />
            ) : (
              <span style={{ fontSize: c.size * 3 }}>{cursorEmoji[c.style]}</span>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-semibold">Cursor magic enabled</span>
            <Toggle checked={c.enabled} label="Enable cursor" onChange={v => update(s => ({ ...s, cursor: { ...s.cursor, enabled: v } }))} />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-semibold">Custom Cursor (Hide default)</span>
            <Toggle checked={c.customCursor} label="Custom cursor" onChange={v => update(s => ({ ...s, cursor: { ...s.cursor, customCursor: v } }))} />
          </div>
        </Card>
        <Card>
          <Section title="Style">
            <div className="grid grid-cols-2 gap-2">
              {styles.map(st => (
                <button key={st} onClick={() => update(s => ({ ...s, cursor: { ...s.cursor, style: st } }))}
                  className="rounded-2xl border p-3 text-left capitalize"
                  style={{ background: c.style === st ? 'var(--c-primary)' : 'transparent', borderColor: 'var(--c-border)' }}>
                  <span className="mr-2">{st === 'neon' ? '🔥' : cursorEmoji[st]}</span>
                  {st}
                </button>
              ))}
            </div>
          </Section>
          <Section title="Look">
            <Field label={`Size: ${c.size}px`}>
              <input type="range" min={10} max={40} value={c.size}
                onChange={e => update(s => ({ ...s, cursor: { ...s.cursor, size: +e.target.value } }))}
                className="w-full accent-[color:var(--c-primary)]" />
            </Field>
            
            <div className="mt-4">
              <span className="text-sm font-semibold mb-2 block">Preset Colors</span>
              <div className="flex flex-wrap gap-2">
                {colors.map(col => (
                  <button key={col} onClick={() => update(s => ({ ...s, cursor: { ...s.cursor, color: col } }))}
                    className="h-8 w-8 rounded-full border-2"
                    style={{ background: col, borderColor: c.color === col ? 'var(--c-text)' : 'transparent' }} aria-label={`Color ${col}`} />
                ))}
              </div>
            </div>

            <div className="mt-4">
              <span className="text-sm font-semibold mb-2 block">Custom Color</span>
              <div className="flex items-center gap-3">
                <input type="color" value={c.color.startsWith('#') ? c.color : '#FFC9DE'}
                  onChange={e => update(s => ({ ...s, cursor: { ...s.cursor, color: e.target.value } }))}
                  className="h-10 w-20 cursor-pointer rounded-xl border-0 bg-transparent p-0" aria-label="Custom color" />
                <span className="text-xs opacity-60">Pick any custom color for your cursor.</span>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-sm font-semibold mb-2 block">Neon Gradients</span>
              <div className="flex flex-wrap gap-2">
                {gradients.map(g => (
                  <button key={g} onClick={() => update(s => ({ ...s, cursor: { ...s.cursor, color: g } }))}
                    className="h-8 w-8 rounded-full border-2"
                    style={{ background: g, borderColor: c.color === g ? 'var(--c-text)' : 'transparent' }} aria-label="Gradient color" />
                ))}
              </div>
            </div>
          </Section>
        </Card>
      </div>
    </>
  );
}