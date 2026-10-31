import { Chrome, Download, Puzzle, Settings, CheckCircle2, Sparkles } from 'lucide-react';
import { Card, PageHeader, Button } from '../../shared/ui';

const DOWNLOAD_URL = 'https://github.com/Praveenkanth2805/pibblora/archive/refs/heads/main.zip'; // உங்க ZIP லிங்க்

const steps = [
  { icon: Download, text: 'Download the ZIP file using the button above.' },
  { icon: Puzzle, text: 'Extract the ZIP to a folder on your computer.' },
  { icon: Chrome, text: 'Open Chrome and go to chrome://extensions' },
  { icon: Settings, text: 'Turn on "Developer mode" (top right corner).' },
  { icon: CheckCircle2, text: 'Click "Load unpacked" and select the extracted folder.' },
];

export default function ExtensionPage() {
  return (
    <>
      <PageHeader 
        title="Get Pibblora for Chrome" 
        subtitle="Install the magic manually via Developer Mode. No store required." 
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="relative overflow-hidden flex flex-col items-center text-center justify-center py-12">
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--c-primary)] to-[color:var(--c-accent)] opacity-10 pointer-events-none" />
          <div className="mb-4 grid h-20 w-20 place-items-center rounded-3xl pibblora-gradient text-ink shadow-lg">
            <Sparkles size={40} />
          </div>
          <h2 className="font-display text-2xl font-bold">Pibblora Extension</h2>
          <p className="mt-2 text-sm opacity-70 max-w-xs">
            Bring pets, cursor trails, and your dream tab to life on every website.
          </p>
          
          <a href={DOWNLOAD_URL} target="_blank" rel="noreferrer" className="mt-6">
            <Button className="px-8 py-3 text-lg shadow-xl hover:-translate-y-1 transition-transform">
              <Download size={20} /> Download ZIP
            </Button>
          </a>
          <p className="mt-3 text-xs opacity-50">Version 0.1.0 · Local-first · Free</p>
        </Card>

        <Card>
          <h3 className="font-display text-xl font-semibold mb-4">How to Install</h3>
          <ul className="space-y-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={i} className="flex items-start gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[color:var(--c-primary)]/20 text-[color:var(--c-primary)]">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.text}</p>
                    {i === 3 && (
                      <p className="text-xs opacity-60 mt-1">
                        Note: The "Developer mode" toggle is usually in the top-right corner of the Extensions page.
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </>
  );
}