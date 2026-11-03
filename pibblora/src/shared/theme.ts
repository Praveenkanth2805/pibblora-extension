import type { ThemePreset } from './types';

type Preset = { bg: string; text: string; primary: string; accent: string; surface: string; border: string };

export const presets: Record<ThemePreset, Preset> = {
  lavender: { bg: '#F5F0FF', text: '#443B52', primary: '#C9B6FF', accent: '#FFC9DE', surface: 'rgba(255,255,255,0.85)', border: 'rgba(255,255,255,0.65)' },
  pink:     { bg: '#FFF2F8', text: '#443B52', primary: '#FFC9DE', accent: '#C9B6FF', surface: 'rgba(255,255,255,0.85)', border: 'rgba(255,255,255,0.65)' },
  blue:     { bg: '#EFF9FF', text: '#443B52', primary: '#BDE7FF', accent: '#C6F4DC', surface: 'rgba(255,255,255,0.85)', border: 'rgba(255,255,255,0.65)' },
  mint:     { bg: '#EFFCF5', text: '#443B52', primary: '#C6F4DC', accent: '#BDE7FF', surface: 'rgba(255,255,255,0.85)', border: 'rgba(255,255,255,0.65)' },
  cream:    { bg: '#FFF5E8', text: '#443B52', primary: '#C9B6FF', accent: '#FFC9DE', surface: 'rgba(255,255,255,0.85)', border: 'rgba(255,255,255,0.65)' },
  dark:     { bg: '#1F1829', text: '#EDE4FF', primary: '#8B6FE0', accent: '#C9B6FF', surface: 'rgba(60,50,80,0.65)', border: 'rgba(130,110,180,0.4)' },
  devotional: { bg: '#FFF8E7', text: '#5C2A18', primary: '#E67E22', accent: '#F1C40F', surface: 'rgba(255,255,255,0.9)', border: 'rgba(230,126,34,0.3)' },
};

export function applyTheme(preset: ThemePreset) {
  const p = presets[preset] ?? presets.cream;
  const root = document.documentElement;
  root.style.setProperty('--c-bg', p.bg);
  root.style.setProperty('--c-text', p.text);
  root.style.setProperty('--c-primary', p.primary);
  root.style.setProperty('--c-accent', p.accent);
  root.style.setProperty('--c-surface', p.surface);
  root.style.setProperty('--c-border', p.border);
  document.body.style.background = p.bg;
  document.body.style.color = p.text;
}

export type PetIcon = { type: 'image'; src: string };

export const petIcons: Record<string, PetIcon> = {
  cat: { type: 'image', src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f431.svg' },
  bunny: { type: 'image', src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f430.svg' },
  star: { type: 'image', src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2b50.svg' },
  blob: { type: 'image', src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f47e.svg' },
  snail: { type: 'image', src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f40c.svg' },
  spider: { type: 'image', src: '/spider.png'  },
  
  // Local Image Path (நீங்க public/spiderman.png ல வச்சிருந்தா இது வேலை செய்யும்)
  spiderman: { type: 'image', src: '/spiderman.png' },
  
  pikachu: { type: 'image', src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
};

export const cursorEmoji: Record<string, string> = { stars: '✨', hearts: '💗', bubbles: '🫧', trail: '•', neon: '•' };