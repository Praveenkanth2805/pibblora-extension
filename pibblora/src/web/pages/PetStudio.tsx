import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../shared/StoreContext';
import { Card, Field, PageHeader, Section, Toggle } from '../../shared/ui';
import { PetPreview } from '../../shared/PetPreview';
import type { PetAnimation, PetType } from '../../shared/types';
import { petIcons } from '../../shared/theme';

// Added 'spiderman' here
const types: PetType[] = ['cat', 'bunny', 'star', 'blob', 'pikachu', 'snail', 'spider', 'spiderman'];
const animations: PetAnimation[] = ['bounce', 'float', 'wiggle'];
const colors = ['#C9B6FF', '#FFC9DE', '#BDE7FF', '#C6F4DC', '#FFE0B2', '#FFA6C9', '#7DD3FC'];

export default function PetStudio() {
  const { settings, update } = useStore();
  const p = settings.pet;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isTesting, setIsTesting] = useState(false);
const testTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const stopTest = () => {
  if (testTimerRef.current) {
    clearTimeout(testTimerRef.current);
    testTimerRef.current = null;
  }
  setIsTesting(false);
  window.dispatchEvent(new Event('pibblora:pet-test-stop'));
};

const handleTest = () => {
  if (isTesting) {
    stopTest();
    return;
  }

  setIsTesting(true);
  window.dispatchEvent(new Event('pibblora:pet-test'));

  testTimerRef.current = setTimeout(stopTest, 15000);
};

useEffect(() => {
  return () => {
    if (testTimerRef.current) clearTimeout(testTimerRef.current);
  };
}, []);

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
    <>
      <PageHeader title="Pet Studio" subtitle="Design the companion that follows your cursor."
        back={<Link to="/dashboard" className="mt-1.5 opacity-70 hover:opacity-100"><ArrowLeft size={18} /></Link>} />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <PetPreview type={p.type} animation={p.animation} size={p.size} color={p.color} customImage={p.customImage} />
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-semibold">Pet enabled</span>
            <Toggle checked={p.enabled} label="Enable pet" onChange={v => update(s => ({ ...s, pet: { ...s.pet, enabled: v } }))} />
          </div>
        </Card>
        <Card>
          <Section title="Character">
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {types.map(t => {
                const icon = petIcons[t];
                const isActive = p.type === t && !p.customImage;
                return (
                  <button key={t} onClick={() => update(s => ({ ...s, pet: { ...s.pet, type: t, customImage: '' } }))}
                    className={`rounded-2xl border p-2 flex items-center justify-center transition ${isActive ? 'ring-2' : ''}`}
                    style={{ background: isActive ? 'var(--c-primary)' : 'transparent', borderColor: 'var(--c-border)' }}>
                    <img src={icon.src} alt={t} className="h-8 w-8 object-contain" />
                  </button>
                );
              })}
              
              <button onClick={() => fileInputRef.current?.click()}
                className={`rounded-2xl border p-2 flex items-center justify-center transition ${p.type === 'custom' ? 'ring-2' : ''}`}
                style={{ background: p.type === 'custom' ? 'var(--c-primary)' : 'transparent', borderColor: 'var(--c-border)' }}>
                {p.customImage ? (
                  <img src={p.customImage} alt="Custom" className="h-8 w-8 object-contain" />
                ) : (
                  <Upload size={20} className="opacity-70" />
                )}
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
            </div>
          </Section>
          <Section title="Animation">
            <div className="flex gap-2">
              {animations.map(a => (
                <button key={a} onClick={() => update(s => ({ ...s, pet: { ...s.pet, animation: a } }))}
                  className="rounded-full border px-4 py-1.5 text-sm capitalize"
                  style={{ background: p.animation === a ? 'var(--c-accent)' : 'transparent', borderColor: 'var(--c-border)' }}>
                  {a}
                </button>
              ))}
            </div>

            <div className="mt-4">
<button
  onClick={handleTest}
  disabled={!p.enabled}
  className="w-full rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
  style={{
    background: isTesting ? '#EF4444' : 'var(--c-primary)',
    color: isTesting ? '#FFFFFF' : 'var(--c-text)',
  }}
>
  {isTesting ? '■ Stop Animation' : '▶ Test Animation'}
</button>

  <p className="mt-2 text-xs text-center opacity-60">
    Preview your pet animation without waiting for inactivity.
  </p>
</div>
          </Section>
          
          <Section title="Look">
            <Field label={`Size: ${p.size}px`}>
              <input type="range" min={32} max={120} value={p.size}
                onChange={e => update(s => ({ ...s, pet: { ...s.pet, size: +e.target.value } }))}
                className="w-full accent-[color:var(--c-primary)]" />
            </Field>
            <div className="mt-3 flex flex-wrap gap-2">
              {colors.map(c => (
                <button key={c} onClick={() => update(s => ({ ...s, pet: { ...s.pet, color: c } }))}
                  className="h-8 w-8 rounded-full border-2"
                  style={{ background: c, borderColor: p.color === c ? 'var(--c-text)' : 'transparent' }} />
              ))}
            </div>
          </Section>
        </Card>
      </div>
    </>
  );
}