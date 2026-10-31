import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../shared/StoreContext';
import { Card, PageHeader, Section, Toggle } from '../../shared/ui';
import { DreamTabPreview } from '../components/DreamTabPreview';
import type { Settings } from '../../shared/types';

const items: { key: keyof Settings['widgets']; label: string; desc: string }[] = [
  { key: 'miniClock', label: 'Mini Clock', desc: 'Compact time display.' },
  { key: 'timer', label: 'Timer', desc: 'Focus countdown.' },
  { key: 'notes', label: 'Notes', desc: 'Quick scratchpad.' },
  { key: 'checklist', label: 'Checklist', desc: 'Small to-do list.' },
];

export default function WidgetManager() {
  const { settings, update } = useStore();
  return (
    <>
      <PageHeader title="Widget Manager" subtitle="Pick what shows up on your DreamTab." back={<Link to="/dashboard" className="mt-1.5 opacity-70 hover:opacity-100"><ArrowLeft size={18} /></Link>} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <Section title="DreamTab Widgets">
            <div className="divide-y" style={{ borderColor: 'var(--c-border)' }}>
              {items.map(it => (
                <div key={it.key} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-semibold">{it.label}</p>
                    <p className="text-xs opacity-70">{it.desc}</p>
                  </div>
                  <Toggle checked={settings.widgets[it.key]} label={it.label}
                    onChange={v => update(s => ({ ...s, widgets: { ...s.widgets, [it.key]: v } }))} />
                </div>
              ))}
            </div>
          </Section>
        </Card>

        <div className="space-y-4">
          <p className="text-sm font-semibold opacity-70">Live Preview (Using Current Theme)</p>
          {/* forceTheme-அ பாஸ் பண்ணினா தான் நாம யூஸ் பண்ற தீம் ப்ரிவியூ-ல வரும் */}
          <DreamTabPreview forceTheme={settings.theme.preset} />
          <p className="text-xs text-center opacity-50">
            * Changes here update instantly in the preview.
          </p>
        </div>
      </div>
    </>
  );
}