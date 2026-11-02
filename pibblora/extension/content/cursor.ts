import { Settings, CURSOR_EMOJI, PRESET_COLORS } from './types';

export function mountCursor(s: Settings, cleanupFns: (() => void)[]) {
  if (!s.cursor.enabled) {
    document.body.style.cursor = 'auto';
    document.getElementById('pibblora-hide-cursor')?.remove();
    return;
  }

  let mainCursorEl: HTMLDivElement | null = null;
  let styleEl = document.getElementById('pibblora-hide-cursor');
  const activeThemePrimary = PRESET_COLORS[s.theme.preset] || PRESET_COLORS.cream;

  if (s.cursor.customCursor) {
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'pibblora-hide-cursor';
      styleEl.innerHTML = '* { cursor: none !important; }';
      document.head.appendChild(styleEl);
    }

    mainCursorEl = document.createElement('div');
    Object.assign(mainCursorEl.style, {
      position: 'fixed', left: '0', top: '0', pointerEvents: 'none', zIndex: '2147483647',
      transform: 'translate3d(0,0,0) translate(-50%, -50%)', borderRadius: '50%',
      background: s.cursor.style === 'trail' ? activeThemePrimary : (s.cursor.color.startsWith('#') ? s.cursor.color : '#C9B6FF'),
      width: `${s.cursor.size * 0.6}px`, height: `${s.cursor.size * 0.6}px`,
      transition: 'width 0.2s, height 0.2s', willChange: 'transform'
    });
    document.body.appendChild(mainCursorEl);
  } else {
    styleEl?.remove();
    document.body.style.cursor = 'auto';
  }

  const onClick = (e: MouseEvent) => {
    const ripple = document.createElement('div');
    Object.assign(ripple.style, {
      position: 'fixed', left: '0', top: '0',
      transform: `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(1)`,
      width: '20px', height: '20px', borderRadius: '50%',
      border: `2px solid ${s.cursor.color.includes('gradient') ? '#C9B6FF' : s.cursor.color}`, 
      pointerEvents: 'none', zIndex: '2147483647',
      transition: 'all 0.5s ease-out', willChange: 'transform, opacity'
    });
    document.body.appendChild(ripple);
    requestAnimationFrame(() => {
      ripple.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(4)`;
      ripple.style.opacity = '0';
    });
    setTimeout(() => ripple.remove(), 500);
  };

  let lastTime = 0, lastX = 0, lastY = 0;

  const onMove = (e: MouseEvent) => {
    if (mainCursorEl) {
      mainCursorEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    }

    const now = performance.now();
    if (now - lastTime < 30) return;
    lastTime = now;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let steps = Math.max(1, Math.floor(distance / 15));
    if (steps > 5) steps = 5; 

    for (let i = 1; i <= steps; i++) {
      const x = lastX + (dx * i) / steps;
      const y = lastY + (dy * i) / steps;

      const startColor = s.cursor.style === 'trail' ? activeThemePrimary : s.cursor.color;
      const endColor = s.cursor.dualColor ? s.cursor.color2 : startColor;

      const dot = document.createElement('div');
      let extraStyles = {};
      if (s.cursor.style === 'neon') {
        extraStyles = {
          width: `${s.cursor.size}px`, height: `${s.cursor.size}px`,
          borderRadius: '50%', background: startColor,
          boxShadow: `0 0 15px ${startColor}, 0 0 30px ${startColor}`
        };
      } else if (s.cursor.style === 'trail') {
        extraStyles = {
          width: `${s.cursor.size * 0.4}px`, height: `${s.cursor.size * 0.4}px`,
          borderRadius: '50%', background: startColor.includes('gradient') ? '#C9B6FF' : startColor
        };
      } else {
        dot.textContent = CURSOR_EMOJI[s.cursor.style] || '✨';
        extraStyles = { fontSize: `${s.cursor.size}px`, color: startColor.includes('gradient') ? '#C9B6FF' : startColor };
      }

      Object.assign(dot.style, {
        position: 'fixed', left: '0', top: '0',
        transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`,
        pointerEvents: 'none', zIndex: '2147483646',
        transition: 'opacity 0.6s ease, transform 0.6s ease, background-color 0.6s ease, box-shadow 0.6s ease, color 0.6s ease',
        willChange: 'transform, opacity', ...extraStyles
      });
      
      document.body.appendChild(dot);
      void dot.offsetWidth; 

      requestAnimationFrame(() => {
        dot.style.opacity = '0';
        dot.style.transform = `translate3d(${x}px, ${y - 30}px, 0) translate(-50%, -50%) scale(0.4)`;
        if (s.cursor.dualColor) {
          if (s.cursor.style === 'neon') {
            dot.style.background = endColor;
            dot.style.boxShadow = `0 0 15px ${endColor}, 0 0 30px ${endColor}`;
          } else if (s.cursor.style === 'trail') {
            dot.style.background = endColor.includes('gradient') ? '#C9B6FF' : endColor;
          } else {
            dot.style.color = endColor.includes('gradient') ? '#C9B6FF' : endColor;
          }
        }
      });
      setTimeout(() => dot.remove(), 700);
    }

    lastX = e.clientX;
    lastY = e.clientY;
  };

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('click', onClick);
  
  cleanupFns.push(() => {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('click', onClick);
    if (mainCursorEl) mainCursorEl.remove();
    if (styleEl) styleEl.remove();
    document.body.style.cursor = 'auto';
  });
}