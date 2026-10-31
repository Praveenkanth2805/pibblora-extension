import { useRef, useState } from 'react';
import { ArrowLeft, Download, Upload, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../shared/StoreContext';
import { Button, Card, PageHeader, Section } from '../../shared/ui';
import { defaultSettings, saveSettings } from '../../shared/storage';

export default function SettingsPage() {
  const { settings, update } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'pibblora-settings.json'; a.click();
    URL.revokeObjectURL(url);
    setMsg('Exported.');
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        update(() => ({ ...defaultSettings, ...parsed }));
        setMsg('Imported.');
      } catch { setMsg('Invalid file.'); }
    };
    reader.readAsText(file);
  };

  const reset = () => {
    update(() => ({ ...defaultSettings }));
    setMsg('Reset to defaults.');
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Backup, restore, or start fresh." back={<Link to="/dashboard" className="mt-1.5 opacity-70 hover:opacity-100"><ArrowLeft size={18} /></Link>} />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <Section title="Backup">
            <div className="flex flex-wrap gap-2">
              <Button onClick={exportJson}><Download size={16} /> Export</Button>
              <Button variant="soft" onClick={() => fileRef.current?.click()}><Upload size={16} /> Import</Button>
              <input ref={fileRef} type="file" accept="application/json" hidden
                onChange={e => e.target.files?.[0] && importJson(e.target.files[0])} />
            </div>
          </Section>
          <Section title="Reset">
            <Button variant="ghost" onClick={reset}><RotateCcw size={16} /> Reset to defaults</Button>
          </Section>
          {msg && <p className="text-sm opacity-70">{msg}</p>}
        </Card>
        <Card>
          <Section title="About this setup">
            <p className="text-sm opacity-75">
              Everything on Pibblora is stored locally. The website uses <code className="rounded bg-black/10 px-1">localStorage</code>;
              the extension uses <code className="rounded bg-black/10 px-1">chrome.storage</code>. No account, no backend.
            </p>
          </Section>
        </Card>
      </div>
    </>
  );
}