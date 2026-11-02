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
export const SPIDERMAN_IMG = chrome.runtime.getURL('spider.png');

export const PET_ICONS: Record<string, string> = {
  cat: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f431.svg',
  bunny: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f430.svg',
  star: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2b50.svg',
  blob: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f47e.svg',
  snail: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f40c.svg',
  spider: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f577.svg',
  spiderman: SPIDERMAN_IMG, 
  pikachu: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
};

export const CURSOR_EMOJI: Record<string,string> = { stars: '✨', hearts: '💗', bubbles: '🫧', trail: '•', neon: '•' };
export const KEY = 'pibblora:settings';