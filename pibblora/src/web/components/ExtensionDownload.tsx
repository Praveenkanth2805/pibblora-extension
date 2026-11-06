import { Download, Chrome, Puzzle, Settings, CheckCircle2, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Button } from '../../shared/ui';
import { RELEASES } from '../../shared/releaseData';

const steps = [
  { icon: Download, text: 'Download the ZIP file.' },
  { icon: Puzzle, text: 'Extract it to a folder.' },
  { icon: Chrome, text: 'Go to chrome://extensions' },
  { icon: Settings, text: 'Turn on Developer mode.' },
  { icon: CheckCircle2, text: 'Click Load unpacked.' },
];

export function ExtensionDownload() {
  // Automatically find the latest release
  const latestRelease = RELEASES.find(r => r.isLatest) || RELEASES[0];

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full pibblora-gradient opacity-20 blur-2xl" />
      <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left">
        
        <span className="mb-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: 'var(--c-primary)' }}>
          <Chrome size={12} /> Version {latestRelease.version} is here!
        </span>
        
        <h3 className="font-display text-2xl font-bold">Get Pibblora for Chrome</h3>
        <p className="mt-1 max-w-lg text-sm opacity-70">
          Install manually via Developer Mode. {latestRelease.changes[0]} & More!
        </p>
        
        {/* Buttons Section */}
        <div className="mt-5 flex w-full flex-col gap-3 sm:flex-row sm:items-center">
          <a href={latestRelease.url} target="_blank" rel="noreferrer" className="shrink-0">
            <Button className="w-full sm:w-auto">
              <Download size={18} /> Download Latest ({latestRelease.version})
            </Button>
          </a>
          
          <Link to="/extension" className="shrink-0">
            <Button variant="soft" className="w-full sm:w-auto">
              <History size={18} /> More Versions
            </Button>
          </Link>
        </div>

        {/* Steps Section */}
        <div className="mt-6 w-full rounded-2xl border p-4 text-left text-xs" style={{ borderColor: 'var(--c-border)', background: 'rgba(255,255,255,0.4)' }}>
          <p className="font-semibold mb-2">Installation Steps:</p>
          <ul className="space-y-2">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={i} className="flex items-start gap-2 opacity-80">
                  <span className="mt-0.5"><Icon size={14} /></span>
                  <span>{s.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Card>
  );
}
