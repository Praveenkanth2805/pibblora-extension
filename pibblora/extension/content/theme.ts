export function applyTheme(preset: string) {
  const map: Record<string,string> = {
    lavender: '#F5F0FF', pink: '#FFF2F8', blue: '#EFF9FF',
    mint: '#EFFCF5', cream: '#FFF5E8', dark: '#1F1829', devotional: '#FFF8E7'
  };
  const existing = document.getElementById('pibblora-tint');
  existing?.remove();
  if (preset === 'cream') return;
  const tint = document.createElement('div');
  tint.id = 'pibblora-tint';
  tint.style.cssText = `
    position: fixed; inset: 0; pointer-events: none;
    z-index: 2147483644; mix-blend-mode: multiply;
    background: ${map[preset] ?? '#FFF5E8'};
    opacity: 0.12;
  `;
  document.documentElement.appendChild(tint);
}

// Web color logic based on theme
export function getWebColor(preset: string) {
  return preset === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.5)';
}