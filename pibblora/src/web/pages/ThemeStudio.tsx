import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../shared/StoreContext';
import { Card, PageHeader, Section } from '../../shared/ui';
import { presets } from '../../shared/theme';
import { DreamTabPreview } from '../components/DreamTabPreview'; // <-- NEW
import type { ThemePreset } from '../../shared/types';
import SEO from '../../shared/SEO';

export default function ThemeStudio() {
  const { settings, update } = useStore();
  return (
    <>
    <SEO
      title="Pibblora Extension – Cute Chrome Browser Customization"
      description="Discover Pibblora Chrome Extension. Customize your browser with virtual pets, magical cursor effects, pastel themes, widgets and a dreamy new tab."
      path="/theme"
    />
      <PageHeader title="Theme Studio" subtitle="Soft pastel palettes and a cozy dark mode." back={<Link to="/dashboard" className="mt-1.5 opacity-70 hover:opacity-100"><ArrowLeft size={18} /></Link>} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <Section title="Preset">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {(Object.keys(presets) as ThemePreset[]).map(k => {
                const active = settings.theme.preset === k;
                const p = presets[k];
                return (
                  <button key={k} onClick={() => update(s => ({ ...s, theme: { preset: k } }))}
                    className={`rounded-2xl border p-3 text-left transition ${active ? 'ring-2 ring-offset-2' : ''}`}
                    style={{ background: p.bg, color: p.text, borderColor: p.primary, boxShadow: active ? `0 0 0 2px ${p.primary}` : undefined }}
                    aria-pressed={active}>
                    <div className="mb-2 flex gap-1">
                      <span className="h-4 w-4 rounded-full" style={{ background: p.primary }} />
                      <span className="h-4 w-4 rounded-full" style={{ background: p.accent }} />
                    </div>
                    <span className="capitalize font-semibold">{k}</span>
                  </button>
                );
              })}
            </div>
          </Section>
        </Card>

        {/* Right Side: Live Preview (Forced to active theme) */}
        <div className="space-y-4">
          <p className="text-sm font-semibold opacity-70">Theme Preview</p>
          <DreamTabPreview forceTheme={settings.theme.preset} />
          <p className="text-xs text-center opacity-50">
            * This is how your DreamTab and widgets will look with this theme.
          </p>
        </div>
      </div>
    </>
  );
}