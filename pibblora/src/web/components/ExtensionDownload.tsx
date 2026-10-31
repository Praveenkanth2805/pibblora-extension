import { Download, Chrome, Puzzle, Settings, CheckCircle2 } from "lucide-react";
import { Card, Button } from "../../shared/ui";

//github relese link
const DOWNLOAD_URL =
  "https://github.com/Praveenkanth2805/pibblora-extension/archive/refs/tags/v1.0.0.zip";

const steps = [
  {
    icon: Download,
    text: "Download the ZIP file using the button below.",
    shortText: "Download ZIP",
  },
  {
    icon: Puzzle,
    text: "Extract the ZIP to a folder on your computer.",
    shortText: "Extract ZIP",
  },
  {
    icon: Chrome,
    text: (
      <>
        Open Chrome and go to{" "}
        <a
          href="chrome://extensions"
          className="text-primary underline font-medium cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "chrome://extensions";
          }}
        >
          chrome://extensions
        </a>
      </>
    ),
    shortText: "Open Chrome Extensions",
  },
  {
    icon: Settings,
    text: 'Turn on "Developer mode" (top right corner).',
    shortText: "Enable Developer Mode",
  },
  {
    icon: CheckCircle2,
    text: 'Click "Load unpacked" and select the extracted folder.',
    shortText: "Load unpacked",
  },
];
export function ExtensionDownload() {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full pibblora-gradient opacity-20 blur-2xl" />
      <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left">
        <span
          className="mb-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: "var(--c-primary)" }}
        >
          <Chrome size={12} /> Free & Open Source
        </span>
        <h3 className="font-display text-2xl font-bold">
          Get Pibblora for Chrome
        </h3>
        <p className="mt-1 max-w-lg text-sm opacity-70">
          Install manually via Developer Mode. No Chrome Web Store required.
        </p>

        <div className="mt-5 flex w-full flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noreferrer"
            className="shrink-0"
          >
            <Button className="w-full sm:w-auto">
              <Download size={18} /> Download Extension
            </Button>
          </a>
          <div className="flex flex-1 flex-wrap justify-center gap-2 text-xs sm:justify-start">
            {steps.slice(0, 3).map((s, i) => (
              <div key={i} className="flex items-center gap-1 opacity-70">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-black/10 text-[10px]">
                  {i + 1}
                </span>
                {s.shortText}
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-6 w-full rounded-2xl border p-4 text-left text-xs"
          style={{
            borderColor: "var(--c-border)",
            background: "rgba(255,255,255,0.4)",
          }}
        >
          <p className="font-semibold mb-2">Detailed Installation Steps:</p>
          <ul className="space-y-2">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={i} className="flex items-start gap-2 opacity-80">
                  <span className="mt-0.5">
                    <Icon size={14} />
                  </span>
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
