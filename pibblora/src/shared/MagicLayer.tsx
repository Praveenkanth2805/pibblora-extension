import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from './StoreContext';
import { petIcons, cursorEmoji } from './theme';

const getCornerPos = (corner: string) => {
  const margin = 40;
  const w = window.innerWidth;
  const h = window.innerHeight;
  switch (corner) {
    case 'RB': return { x: w - 100 - margin, y: h - 100 - margin };
    case 'LB': return { x: margin, y: h - 100 - margin };
    case 'LT': return { x: margin, y: margin };
    case 'RT': return { x: w - 100 - margin, y: margin };
    default: return { x: 0, y: 0 };
  }
};

export function MagicLayer() {
  const { settings } = useStore();
  
  const [isIdle, setIsIdle] = useState(false);
  // Initialize directly at RB to prevent starting from Top-Left
  const [pos, setPos] = useState(() => getCornerPos('RB'));
  const [fade, setFade] = useState(0); 
  const [isTeleporting, setIsTeleporting] = useState(false);
  const currentCorner = useRef('RB');
  const walkTimer = useRef<any>(null);
  const idleTimer = useRef<any>(null);
  const lastX = useRef(0);
  const lastY = useRef(0);

  // Fade in on mount
  useEffect(() => {
    const t = setTimeout(() => setFade(1), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleResize = () => setPos(getCornerPos(isIdle ? currentCorner.current : 'RB'));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isIdle]);

  const resetIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (isIdle) {
      setIsIdle(false);
      if (walkTimer.current) clearTimeout(walkTimer.current);
      setFade(0); // Fade out
      setTimeout(() => {
        setIsTeleporting(true);
        currentCorner.current = 'RB';
        setPos(getCornerPos('RB'));
        setTimeout(() => {
          setFade(1); // Fade in at RB
          setIsTeleporting(false);
        }, 50);
      }, 300); 
    }
    idleTimer.current = setTimeout(() => setIsIdle(true), 30000);
  }, [isIdle]);

  useEffect(() => {
    if (!settings.pet.enabled) return;
    const events = ['mousemove', 'mousedown', 'scroll', 'keydown', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetIdle));
    resetIdle();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetIdle));
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (walkTimer.current) clearTimeout(walkTimer.current);
    };
  }, [resetIdle, settings.pet.enabled]);

  useEffect(() => {
    if (!isIdle || !settings.pet.enabled) return;
    const walkSequence = () => {
      const roll = Math.random();
      const action = roll < 0.4 ? 'reverse' : roll < 0.7 ? 'teleport' : 'forward';
      
      if (action === 'teleport') {
        setFade(0); setIsTeleporting(true);
        walkTimer.current = setTimeout(() => {
          const corners = ['RB', 'LB', 'LT', 'RT'];
          currentCorner.current = corners[Math.floor(Math.random() * corners.length)];
          setPos(getCornerPos(currentCorner.current));
          setFade(1); setIsTeleporting(false);
          walkTimer.current = setTimeout(walkSequence, 10000);
        }, 300);
      } else {
        const seq = ['RB', 'LB', 'LT', 'RT'];
        let idx = seq.indexOf(currentCorner.current);
        if (action === 'forward') idx = (idx + 1) % seq.length;
        else idx = (idx - 1 + seq.length) % seq.length;
        
        currentCorner.current = seq[idx];
        setPos(getCornerPos(currentCorner.current));
        walkTimer.current = setTimeout(walkSequence, 10000);
      }
    };
    walkTimer.current = setTimeout(walkSequence, 10000);
    return () => { if (walkTimer.current) clearTimeout(walkTimer.current); };
  }, [isIdle, settings.pet.enabled]);

  useEffect(() => {
    if (!settings.cursor.enabled) return;
    document.body.style.cursor = settings.cursor.customCursor ? 'none' : 'auto';

    const onClick = (e: MouseEvent) => {
      const ripple = document.createElement('div');
      Object.assign(ripple.style, {
        position: 'fixed', left: `${e.clientX}px`, top: `${e.clientY}px`,
        width: '20px', height: '20px', borderRadius: '50%',
        border: `2px solid ${settings.cursor.color.includes('gradient') ? 'var(--c-primary)' : settings.cursor.color}`, 
        pointerEvents: 'none', zIndex: '999999', transform: 'translate(-50%, -50%) scale(1)',
        transition: 'all 0.5s ease-out'
      });
      document.body.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.transform = 'translate(-50%, -50%) scale(4)';
        ripple.style.opacity = '0';
      });
      setTimeout(() => ripple.remove(), 500);
    };

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - lastX.current;
      const dy = e.clientY - lastY.current;
      if (Math.sqrt(dx * dx + dy * dy) < 10) return;
      lastX.current = e.clientX;
      lastY.current = e.clientY;

      const dot = document.createElement('div');
      Object.assign(dot.style, {
        position: 'fixed', left: `${e.clientX}px`, top: `${e.clientY}px`,
        pointerEvents: 'none', zIndex: '999999', transform: 'translate(-50%, -50%)',
        transition: 'opacity 0.6s ease, transform 0.6s ease'
      });

      if (settings.cursor.style === 'neon') {
        Object.assign(dot.style, {
          width: `${settings.cursor.size}px`, height: `${settings.cursor.size}px`,
          borderRadius: '50%', background: settings.cursor.color,
          boxShadow: `0 0 15px rgba(255,255,255,0.6), 0 0 30px rgba(0,0,0,0.1)`
        });
      } else if (settings.cursor.style === 'trail') {
        Object.assign(dot.style, {
          width: `${settings.cursor.size * 0.4}px`, height: `${settings.cursor.size * 0.4}px`,
          borderRadius: '50%', background: settings.cursor.color.includes('gradient') ? '#C9B6FF' : settings.cursor.color
        });
      } else {
        dot.textContent = cursorEmoji[settings.cursor.style] || '✨';
        Object.assign(dot.style, {
          fontSize: `${settings.cursor.size}px`, color: settings.cursor.color.includes('gradient') ? '#C9B6FF' : settings.cursor.color
        });
      }

      document.body.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.opacity = '0';
        dot.style.transform = 'translate(-50%, -50%) translateY(-30px) scale(0.5)';
      });
      setTimeout(() => dot.remove(), 700);
    };

    window.addEventListener('click', onClick);
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('click', onClick);
      window.removeEventListener('mousemove', onMove);
      document.body.style.cursor = 'auto';
    };
  }, [settings.cursor]);

  if (!settings.pet.enabled) return null;

  const animate = settings.pet.animation === 'bounce' ? { y: [0, -20, 0] } :
                  settings.pet.animation === 'float'  ? { y: [0, -10, 0], rotate: [-5, 5, -5] } :
                                                        { rotate: [-15, 15, -15] };
  const iconSrc = settings.pet.customImage ? settings.pet.customImage : petIcons[settings.pet.type]?.src;
  const walkDuration = settings.pet.type === 'snail' ? 35 : settings.pet.type === 'spider' ? 5 : 10;

  return (
    <div style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none', zIndex: 99999 }}>
      <motion.div
        animate={{ x: pos.x, y: pos.y, opacity: fade }}
        transition={{ 
          x: { duration: isTeleporting ? 0 : walkDuration, ease: 'linear' }, 
          y: { duration: isTeleporting ? 0 : walkDuration, ease: 'linear' },
          opacity: { duration: 0.3 }
        }}
      >
        <motion.div
          animate={animate}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.2))' }}
        >
          <img src={iconSrc} alt={settings.pet.type} style={{ width: settings.pet.size, height: 'auto', objectFit: 'contain' }} />
        </motion.div>
      </motion.div>
    </div>
  );
}