export type ThemePreset = 'lavender' | 'pink' | 'blue' | 'mint' | 'cream' | 'dark' | 'devotional';
export type PetType = 'cat' | 'bunny' | 'star' | 'blob' | 'pikachu' | 'snail' | 'spider' | 'spiderman' | 'custom';
export type PetAnimation = 'bounce' | 'float' | 'wiggle';
export type CursorStyle = 'stars' | 'hearts' | 'bubbles' | 'trail' | 'neon';

export interface ChecklistItem { id: string; text: string; done: boolean; }

export interface Settings {
  theme: { preset: ThemePreset };
  pet: { enabled: boolean; type: PetType; color: string; size: number; animation: PetAnimation; customImage?: string };
  cursor: { 
    enabled: boolean; 
    style: CursorStyle; 
    color: string; 
    dualColor: boolean; // NEW
    color2: string;     // NEW
    size: number; 
    customCursor: boolean 
  };
  widgets: { timer: boolean; notes: boolean; checklist: boolean; miniClock: boolean };
  dreamtab: {
    enabled: boolean;
    username: string;
    greeting: string;
    background: ThemePreset;
    showSearch: boolean;
    showClock: boolean;
    shortcuts: { id: string; label: string; url: string }[];
  };
  widgetsData: {
    note: string;
    checklist: ChecklistItem[];
    timerMinutes: number;
  };
}