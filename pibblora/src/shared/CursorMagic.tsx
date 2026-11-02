import { useEffect } from 'react';
import { useStore } from './StoreContext';
import { cursorEmoji } from './theme';

export function CursorMagic() {
  const { settings } = useStore();

  useEffect(() => {
    if (!settings.cursor.enabled) return;

    let mainCursorEl: HTMLDivElement | null = null;
    let styleEl: HTMLStyleElement | null = null;
    let dualCounter = 0;

    if (settings.cursor.customCursor) {
      styleEl = document.createElement('style');
      styleEl.innerHTML = '* { cursor: none !important; }';
      document.head.appendChild(styleEl);

      mainCursorEl = document.createElement('div');
      Object.assign(mainCursorEl.style, {
        position: 'fixed', left: '0', top: '0', pointerEvents: 'none', zIndex: '999999',
        transform: 'translate3d(0,0,0) translate(-50%, -50%)', borderRadius: '50%',
        background: settings.cursor.color.startsWith('#') ? settings.cursor.color : '#C9B6FF',
        width: `${settings.cursor.size * 0.6}px`, height: `${settings.cursor.size * 0.6}px`,
        transition: 'width 0.2s, height 0.2s',
        willChange: 'transform'
      });
      document.body.appendChild(mainCursorEl);
    }

    const onClick = (e: MouseEvent) => {
      const ripple = document.createElement('div');
      Object.assign(ripple.style, {
        position: 'fixed', left: '0', top: '0',
        transform: `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(1)`,
        width: '20px', height: '20px', borderRadius: '50%',
        border: `2px solid ${settings.cursor.color.includes('gradient') ? 'var(--c-primary)' : settings.cursor.color}`, 
        pointerEvents: 'none', zIndex: '999999',
        transition: 'all 0.5s ease-out',
        willChange: 'transform, opacity'
      });
      document.body.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(4)`;
        ripple.style.opacity = '0';
      });
      setTimeout(() => ripple.remove(), 500);
    };

    let lastTime = 0;
    let lastX = 0;
    let lastY = 0;

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

        const startColor = settings.cursor.color;
        const endColor = settings.cursor.dualColor ? settings.cursor.color2 : settings.cursor.color;

        const dot = document.createElement('div');
        
        let extraStyles = {};
        if (settings.cursor.style === 'neon') {
          extraStyles = {
            width: `${settings.cursor.size}px`, height: `${settings.cursor.size}px`,
            borderRadius: '50%', background: startColor,
            boxShadow: `0 0 15px ${startColor}, 0 0 30px ${startColor}`
          };
        } else if (settings.cursor.style === 'trail') {
          extraStyles = {
            width: `${settings.cursor.size * 0.4}px`, height: `${settings.cursor.size * 0.4}px`,
            borderRadius: '50%', background: startColor.includes('gradient') ? '#C9B6FF' : startColor
          };
        } else {
          dot.textContent = cursorEmoji[settings.cursor.style] || '✨';
          extraStyles = {
            fontSize: `${settings.cursor.size}px`, 
            color: startColor.includes('gradient') ? '#C9B6FF' : startColor
          };
        }

        Object.assign(dot.style, {
          position: 'fixed', left: '0', top: '0',
          transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`,
          pointerEvents: 'none', zIndex: '999998',
          transition: 'opacity 0.6s ease, transform 0.6s ease, background-color 0.6s ease, box-shadow 0.6s ease, color 0.6s ease',
          willChange: 'transform, opacity',
          ...extraStyles
        });

        document.body.appendChild(dot);
        void dot.offsetWidth; 

        requestAnimationFrame(() => {
          dot.style.opacity = '0';
          dot.style.transform = `translate3d(${x}px, ${y - 30}px, 0) translate(-50%, -50%) scale(0.5)`;
          
          if (settings.cursor.dualColor) {
            if (settings.cursor.style === 'neon') {
              dot.style.background = endColor;
              dot.style.boxShadow = `0 0 15px ${endColor}, 0 0 30px ${endColor}`;
            } else if (settings.cursor.style === 'trail') {
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

    window.addEventListener('click', onClick);
    window.addEventListener('mousemove', onMove, { passive: true });
    
    return () => {
      window.removeEventListener('click', onClick);
      window.removeEventListener('mousemove', onMove);
      if (mainCursorEl) mainCursorEl.remove();
      if (styleEl) styleEl.remove();
    };
  }, [settings.cursor]);

  return null; // Renders nothing, just handles DOM events
}