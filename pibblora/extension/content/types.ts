export interface Settings {
  theme: { preset: string };
  pet: { enabled: boolean; type: string; color: string; size: number; animation: string };
  cursor: { enabled: boolean; style: string; color: string; dualColor: boolean; color2: string; size: number; customCursor: boolean };
}

export const DEFAULTS: Settings = {
  theme: { preset: 'cream' },
  pet: { enabled: false, type: 'cat', color: '#C9B6FF', size: 64, animation: 'bounce' },
  cursor: { enabled: false, style: 'stars', color: '#FFC9DE', dualColor: false, color2: '#C9B6FF', size: 18, customCursor: false },
};

export const PRESET_COLORS: Record<string, string> = {
  lavender: '#C9B6FF', pink: '#FFC9DE', blue: '#BDE7FF',
  mint: '#C6F4DC', cream: '#C9B6FF', dark: '#8B6FE0', devotional: '#E67E22'
};

// Locally hosted image for Spiderman
export const PET_ICONS: Record<string, string> = {
  cat: chrome.runtime.getURL('cat.webp'),
  bunny: chrome.runtime.getURL('bunny.webp'),
  star: chrome.runtime.getURL('star.webp'),
  blob: chrome.runtime.getURL('blob.webp'),
  snail: chrome.runtime.getURL('snail.webp'),
  spider: chrome.runtime.getURL('spider.webp'),
  spiderman: chrome.runtime.getURL('spiderman.webp'), 
  pikachu: chrome.runtime.getURL('pikachu.webp'),
};

export const CURSOR_EMOJI: Record<string,string> = { stars: '✨', hearts: '💗', bubbles: '🫧', trail: '•', neon: '•' };
export const KEY = 'pibblora:settings';