import { Chrome, Download, Puzzle, Settings, CheckCircle2, Sparkles, History } from 'lucide-react';
import { Card, PageHeader, Button } from '../../shared/ui';

const RELEASES = [
  {
    version: 'v1.3.0',
    date: 'Latest Release',
    isLatest: true,
    url: 'https://github.com/Praveenkanth2805/pibblora-extension/releases/download/v1.3.0/pibblora-extension-v1-3-0.zip', // <-- v1.3.0 ZIP லிங்க்
    changes: [
      '🕸️ Spider Web Building (X to O sequence)',
      '🌙 Theme-based Trail Colors',
      '🐌 Realistic Snail Crawling (No teleporting)',
      '⚡ Code Optimization & Bug Fixes',
    ],
  },
  {
    version: 'v1.2.0',
    date: 'Previous Release',
    isLatest: false,
    url: 'https://github.com/Praveenkanth2805/pibblora-extension/releases/download/v1.2.0/pibblora-extension-v1-2-0.zip',
    changes: [
      '🌈 Dual Cursor Colors (Choose two colors to alternate)',
      '⚡ Super smooth cursor trails (Zero Lag)',
      '🕷️ Improved Spider-Man movement (Bounces left & right)',
      '🎨 UI Bug fixes for DreamTab & Popup',
    ],
  },
  {
    version: 'v1.1.0',
    date: 'Previous Release',
    isLatest: false,
    url: 'https://github.com/user-attachments/files/34231936/pibblora-extension-v1.1.0.zip',
    changes: [
      '🕷️ Added Spider-Man pet (with web swinging bounce)',
      '📸 Custom Pet image upload support',
      '✨ New Neon cursor with gradients',
      '🎨 DreamTab search bar & layout improvements',
    ],
  },
  {
    version: 'v1.0.0',
    date: 'Initial Release',
    isLatest: false,
    url: 'https://github.com/Praveenkanth2805/pibblora-extension/archive/refs/tags/v1.0.0.zip',
    changes: [
      '🐱 Original Pets (Cat, Bunny, Star, Blob, Pikachu)',
      '💫 Cursor trails (Stars, Hearts, Bubbles)',
      '🌙 DreamTab (Clock, Search, Widgets)',
      '🎨 Pastel & Dark themes',
    ],
  },
];

const steps = [
  { icon: Download, text: 'Download the ZIP file for your preferred version.' },
  { icon: Puzzle, text: 'Extract the ZIP to a folder.' },
  { icon: Chrome, text: 'Open Chrome and go to', isLink: true },
  { icon: Settings, text: 'Turn on "Developer mode" (top right).' },
  { icon: CheckCircle2, text: 'Click "Load unpacked" and select the folder.' },
];

export default function ExtensionPage() {
  return (
    <>
      <PageHeader 
        title="Get Pibblora for Chrome" 
        subtitle="Install manually via Developer Mode. No store required." 
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Left Side: App Info & Installation Steps */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="relative overflow-hidden flex flex-col items-center text-center py-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--c-primary)] to-[color:var(--c-accent)] opacity-10 pointer-events-none" />
            <div className="mb-4 shadow-lg rounded-3xl overflow-hidden">
              <img src="/pibblora.png" alt="Pibblora" className="w-20 h-20 object-cover" draggable={false} />
            </div>
            <h2 className="font-display text-2xl font-bold">Pibblora Extension</h2>
            <p className="mt-2 text-sm opacity-70 max-w-xs">
              Bring pets, cursor trails, and your dream tab to life.
            </p>
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
                    <div className="pt-1">
                      {s.isLink ? (
                        <p className="text-sm font-medium flex gap-1 items-center flex-wrap">
                          {s.text} 
                          <a href="chrome://extensions" target="_blank" rel="noreferrer" className="font-bold underline text-[color:var(--c-primary)]">
                            chrome://extensions
                          </a>
                        </p>
                      ) : (
                        <p className="text-sm font-medium">{s.text}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        {/* Right Side: Version History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <History size={20} className="opacity-70" />
            <h3 className="font-display text-xl font-bold">Version History</h3>
          </div>

          {RELEASES.map((release) => (
            <Card key={release.version} className={`relative overflow-hidden ${release.isLatest ? 'ring-2 ring-[color:var(--c-primary)]' : 'opacity-85 hover:opacity-100'} transition`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-xl font-bold">{release.version}</h4>
                    {release.isLatest && (
                      <span className="rounded-full bg-[color:var(--c-primary)] px-2 py-0.5 text-[10px] font-bold text-black uppercase tracking-wider">
                        Latest
                      </span>
                    )}
                  </div>
                  <p className="text-xs opacity-60 mt-0.5">{release.date}</p>
                </div>
                <a href={release.url} target="_blank" rel="noreferrer">
                  <Button variant={release.isLatest ? 'primary' : 'soft'} className="w-full sm:w-auto">
                    <Download size={16} /> Download
                  </Button>
                </a>
              </div>

              <div className="mt-4 rounded-xl bg-black/[0.03] p-4 text-sm" style={{ borderColor: 'var(--c-border)' }}>
                <ul className="space-y-1.5 opacity-80">
                  {release.changes.map((change, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[color:var(--c-primary)]">•</span>
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </>
  );
}