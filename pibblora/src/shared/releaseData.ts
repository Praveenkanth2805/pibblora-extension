export interface Release {
  version: string;
  date: string;
  isLatest: boolean;
  url: string;
  changes: string[];
}

export const RELEASES: Release[] = [
  {
    version: 'v1.4.0',
    date: 'Latest Release',
    isLatest: true,
    url: 'https://github.com/Praveenkanth2805/pibblora-extension/releases/download/v1.4.0/pibblora-extension-v1.4.0.zip', // <-- v1.4.0 லிங்க்
    changes: [
      '⚡ Ultra-lightweight build (Reduced by 50% size)',
      '📸 Converted all pet icons to local WebP (Instant Loading)',
      '📏 New Pet Size Slider directly in the Popup',
      '🕷️ Fixed Spider Web crawling & Hydration errors',
    ],
  },
  {
    version: 'v1.3.0',
    date: 'Previous Release',
    isLatest: false,
    url: 'https://github.com/Praveenkanth2805/pibblora-extension/releases/download/v1.3.0/pibblora-extension-v1.3.0.zip',
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
    url: 'https://github.com/Praveenkanth2805/pibblora-extension/releases/download/v1.2.0/pibblora-extension-v1.2.0.zip',
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
    url: 'https://github.com/Praveenkanth2805/pibblora-extension/releases/download/v1.1.0/pibblora-extension-v1.1.0.zip',
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
    url: 'https://github.com/Praveenkanth2805/pibblora-extension/releases/download/v1.0.0/pibblora-extension-v.1.0.0.zip',
    changes: [
      '🐱 Original Pets (Cat, Bunny, Star, Blob, Pikachu)',
      '💫 Cursor trails (Stars, Hearts, Bubbles)',
      '🌙 DreamTab (Clock, Search, Widgets)',
      '🎨 Pastel & Dark themes',
    ],
  },
];