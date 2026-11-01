
import {
  Download,
  Chrome,
  Puzzle,
  Settings,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Card, Button } from "../../shared/ui";

const DOWNLOAD_URL =
  "https://github.com/user-attachments/files/34231936/pibblora-extension-v1.1.0.zip";

const EXTENSIONS_URL = "chrome://extensions";

const steps = [
  {
    icon: Download,
    text: "Download the ZIP file using the button below.",
  },
  {
    icon: Puzzle,
    text: "Extract the ZIP file to a folder on your computer.",
  },
  {
    icon: Chrome,
    text: (
      <>
        Open Chrome and go to{" "}
        <a
          href={EXTENSIONS_URL}
          className="font-medium text-primary underline underline-offset-4"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = EXTENSIONS_URL;
          }}
        >
          chrome://extensions
        </a>
      </>
    ),
  },
  {
    icon: Settings,
    text: 'Turn on "Developer mode" in the top-right corner.',
  },
  {
    icon: CheckCircle2,
    text: 'Click "Load unpacked" and select the extracted extension folder.',
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
          <Sparkles size={12} />
          Version 1.1.0 is here!
        </span>

        <h3 className="font-display text-2xl font-bold">
          Get Pibblora for Chrome
        </h3>

        <p className="mt-1 max-w-lg text-sm opacity-70">
          Customize your browsing experience with Spider-Man and Custom Pets.
          Install for free using Chrome Developer Mode.
        </p>

        <div className="mt-5 flex w-full flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button className="w-full sm:w-auto">
              <Download size={18} />
              Download Latest
            </Button>
          </a>

          <a
            href={EXTENSIONS_URL}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = EXTENSIONS_URL;
            }}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-primary underline underline-offset-4"
          >
            <Chrome size={16} />
            Open Chrome Extensions
          </a>
        </div>

        <div
          className="mt-6 w-full rounded-2xl border p-4 text-left text-xs"
          style={{
            borderColor: "var(--c-border)",
            background: "rgba(255,255,255,0.4)",
          }}
        >
          <p className="mb-3 font-semibold">
            Installation Steps
          </p>

          <ul className="space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <li
                  key={index}
                  className="flex items-start gap-2 opacity-80"
                >
                  <span className="mt-0.5 shrink-0">
                    <Icon size={14} />
                  </span>
                  <span>{step.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Card>
  );
}
