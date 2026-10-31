import { useRef } from 'react';
import { Sparkles, Plus, LayoutTemplate, Upload } from 'lucide-react';
import { useStore } from '../shared/StoreContext';
import { PetPreview } from '../shared/PetPreview';
import { Toggle } from '../shared/ui';
import { cursorEmoji, petIcons, presets } from '../shared/theme';
import type { PetType, ThemePreset, CursorStyle } from '../shared/types';

// Added spiderman here
const petTypes: PetType[] = ['cat', 'bunny', 'star', 'blob', 'pikachu', 'snail', 'spider', 'spiderman'];
const cursorStyles: CursorStyle[] = ['stars', 'hearts', 'bubbles', 'trail', 'neon'];
const cursorColors = ['#FFC9DE', '#C9B6FF', '#BDE7FF', '#C6F4DC', '#FFE0B2'];
const cursorGradients = [
  'linear-gradient(45deg, #ff9a9e, #fecfef)',
  'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)',
];

export default function Popup() {
  const { settings, update } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openNewTab = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) chrome.tabs.create({ url: 'chrome://newtab' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      update(s => ({ ...s, pet: { ...s.pet, type: 'custom', customImage: base64, enabled: true } }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-[460px] w-[360px] p-4 pb-6">
      <header className="mb-4 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-2xl pibblora-gradient text-ink"><Sparkles size={18} /></span>
        <div>
          <h1 className="font-display text-lg font-bold leading-tight">Pibblora</h1>
          <p className="text-[11px] opacity-60">A Little Magic in Every Click</p>
        </div>
      </header>

      <div className="mb-4 rounded-2xl border p-3 space-y-3" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutTemplate size={16} className="opacity-70" />
            <span className="text-sm font-semibold">DreamTab (New Tab)</span>
          </div>
          <Toggle checked={settings.dreamtab.enabled} label="DreamTab enabled" onChange={v => update(s => ({ ...s, dreamtab: { ...s.dreamtab, enabled: v } }))} />
        </div>
        {settings.dreamtab.enabled && (
          <input type="text" placeholder="Your name (optional)" value={settings.dreamtab.username || ''} onChange={e => update(s => ({ ...s, dreamtab: { ...s.dreamtab, username: e.target.value } }))} className="w-full rounded-xl border bg-transparent px-3 py-1.5 text-xs outline-none" style={{ borderColor: 'var(--c-border)' }} />
        )}
      </div>

      <div className="mb-4 rounded-2xl border p-3" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Browser Buddy</span>
          <Toggle checked={settings.pet.enabled} label="Pet enabled" onChange={v => update(s => ({ ...s, pet: { ...s.pet, enabled: v } }))} />
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1 sm:grid-cols-4">
          {petTypes.map(t => {
            const icon = petIcons[t];
            const isActive = settings.pet.type === t && !settings.pet.customImage;
            return (
              <button key={t} onClick={() => update(s => ({ ...s, pet: { ...s.pet, type: t, customImage: '', enabled: true } }))} className="rounded-xl border p-1.5 flex items-center justify-center transition hover:scale-105" style={{ background: isActive ? 'var(--c-primary)' : 'transparent', borderColor: 'var(--c-border)' }}>
                <img src={icon.src} alt={t} className="h-5 w-5 object-contain" />
              </button>
            );
          })}
          <button onClick={() => fileInputRef.current?.click()} className="rounded-xl border p-1.5 flex items-center justify-center transition hover:scale-105" style={{ background: settings.pet.type === 'custom' ? 'var(--c-primary)' : 'transparent', borderColor: 'var(--c-border)' }} title="Upload Custom Pet">
            {settings.pet.customImage ? <img src={settings.pet.customImage} alt="Custom" className="h-5 w-5 object-contain rounded-sm" /> : <Upload size={16} className="opacity-70" />}
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
        </div>
        <div className="mt-2">
          <PetPreview type={settings.pet.type} animation={settings.pet.animation} size={40} color={settings.pet.color} customImage={settings.pet.customImage} />
        </div>
      </div>

      <div className="mb-4 rounded-2xl border p-3" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Cursor Magic</span>
          <Toggle checked={settings.cursor.enabled} label="Cursor enabled" onChange={v => update(s => ({ ...s, cursor: { ...s.cursor, enabled: v } }))} />
        </div>
        <div className="mt-2 flex gap-1">
          {cursorStyles.map(st => (
            <button key={st} onClick={() => update(s => ({ ...s, cursor: { ...s.cursor, style: st, enabled: true } }))} className="flex-1 rounded-xl border py-1 text-xs capitalize transition" style={{ background: settings.cursor.style === st ? 'var(--c-accent)' : 'transparent', borderColor: 'var(--c-border)' }}>
              {st === 'neon' ? 'Neon' : cursorEmoji[st]}
            </button>
          ))}
        </div>
        
        {settings.cursor.style === 'neon' && (
          <div className="mt-3 border-t pt-3" style={{ borderColor: 'var(--c-border)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-1.5">
                {cursorColors.map(c => (
                  <button key={c} onClick={() => update(s => ({ ...s, cursor: { ...s.cursor, color: c } }))} className="h-6 w-6 rounded-full transition-transform" style={{ background: c, border: settings.cursor.color === c ? '2px solid var(--c-text)' : '2px solid transparent', transform: settings.cursor.color === c ? 'scale(1.1)' : 'scale(1)' }} />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold opacity-70">Custom</span>
                <input type="color" value={settings.cursor.color.startsWith('#') ? settings.cursor.color : '#FFC9DE'} onChange={e => update(s => ({ ...s, cursor: { ...s.cursor, color: e.target.value } }))} className="h-6 w-6 cursor-pointer rounded-full border-0 bg-transparent p-0" />
              </div>
            </div>
            <div className="flex gap-1.5">
              {cursorGradients.map(g => (
                <button key={g} onClick={() => update(s => ({ ...s, cursor: { ...s.cursor, color: g } }))} className="h-6 w-full rounded-md transition-transform" style={{ background: g, border: settings.cursor.color === g ? '2px solid var(--c-text)' : '2px solid transparent' }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <button onClick={openNewTab} className="flex w-full items-center justify-center gap-1 rounded-full px-4 py-2 text-sm font-semibold shadow-md" style={{ background: 'var(--c-primary)' }}>
        <Plus size={14} /> Open DreamTab
      </button>
    </div>
  );
}