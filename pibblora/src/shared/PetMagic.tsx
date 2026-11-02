import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from './StoreContext';
import { petIcons, presets } from './theme';

const getCornerPos = (corner: string) => {
  const margin = 40;
  const w = window.innerWidth;
  const h = window.innerHeight;
  switch (corner) {
    case 'RB': return { x: w - 100 - margin, y: h - 100 - margin };
    case 'LB': return { x: margin, y: h - 100 - margin };
    case 'LT': return { x: margin, y: margin };
    case 'RT': return { x: w - 100 - margin, y: margin };
    case 'CENTER': return { x: w / 2 - 32, y: h / 2 - 32 };
    default: return { x: 0, y: 0 };
  }
};

export default function PetMagic() {
  const { settings } = useStore();
  
  const [isIdle, setIsIdle] = useState(false);
  const [pos, setPos] = useState(() => getCornerPos('RB'));
  const [fade, setFade] = useState(0); 
  const [isTeleporting, setIsTeleporting] = useState(false); // <-- Added missing state
  const [webPhase, setWebPhase] = useState(0); // 0: none, 1: X, 2: O
  const currentCorner = useRef('RB');
  const walkTimer = useRef<any>(null);
  const idleTimer = useRef<any>(null);

  // Theme-based Web Color
  const isDarkTheme = settings.theme.preset === 'dark';
  const webColor = isDarkTheme ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.25)';

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
      
      setFade(0); 
      setWebPhase(0);
      
      setTimeout(() => {
        currentCorner.current = 'RB';
        setPos(getCornerPos('RB'));
        setTimeout(() => setFade(1), 50);
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
      // Spider Custom Web Logic
      if (settings.pet.type === 'spider') {
        if (webPhase === 0) {
          setWebPhase(1);
          currentCorner.current = 'CENTER';
          setPos(getCornerPos('CENTER'));
          walkTimer.current = setTimeout(walkSequence, 2000);
        } else if (webPhase === 1) {
          setWebPhase(2);
          walkTimer.current = setTimeout(walkSequence, 5000);
        } else {
          const corners = ['LT', 'RT', 'LB', 'RB', 'CENTER'];
          const next = corners[Math.floor(Math.random() * corners.length)];
          currentCorner.current = next;
          setPos(getCornerPos(next));
          walkTimer.current = setTimeout(walkSequence, 6000);
        }
        return;
      }

      const duration = settings.pet.type === 'spiderman' ? 7000 : settings.pet.type === 'snail' ? 35000 : 10000;

      if (settings.pet.type === 'spiderman') {
        const seq = ['RT', 'RB', 'RT', 'LT', 'LB', 'LT']; 
        let idx = seq.indexOf(currentCorner.current);
        if (idx === -1) idx = 0; 
        
        idx = (idx + 1) % seq.length;
        currentCorner.current = seq[idx];
        setPos(getCornerPos(currentCorner.current));
        walkTimer.current = setTimeout(walkSequence, duration);
        return;
      }

      const roll = Math.random();
      const action = settings.pet.type === 'snail' 
        ? (roll < 0.5 ? 'reverse' : 'forward')
        : (roll < 0.4 ? 'reverse' : roll < 0.7 ? 'teleport' : 'forward');
      
      if (action === 'teleport') {
        setFade(0); 
        walkTimer.current = setTimeout(() => {
          const corners = ['RB', 'LB', 'LT', 'RT'];
          currentCorner.current = corners[Math.floor(Math.random() * corners.length)];
          setPos(getCornerPos(currentCorner.current));
          setFade(1);
          walkTimer.current = setTimeout(walkSequence, duration);
        }, 300);
      } else {
        const seq = ['RB', 'LB', 'LT', 'RT'];
        let idx = seq.indexOf(currentCorner.current);
        if (action === 'forward') idx = (idx + 1) % seq.length;
        else idx = (idx - 1 + seq.length) % seq.length;
        
        currentCorner.current = seq[idx];
        setPos(getCornerPos(currentCorner.current));
        walkTimer.current = setTimeout(walkSequence, duration);
      }
    };
    walkTimer.current = setTimeout(walkSequence, 10000);
    return () => { if (walkTimer.current) clearTimeout(walkTimer.current); };
  }, [isIdle, settings.pet.enabled, settings.pet.type, webPhase]);

  const animate = settings.pet.animation === 'bounce' ? { y: [0, -20, 0] } :
                  settings.pet.animation === 'float'  ? { y: [0, -10, 0], rotate: [-5, 5, -5] } :
                                                        { rotate: [-15, 15, -15] };
  const iconSrc = settings.pet.customImage ? settings.pet.customImage : petIcons[settings.pet.type]?.src;
  const walkDuration = settings.pet.type === 'snail' ? 35 : settings.pet.type === 'spiderman' ? 7 : 10;

  return (
    <div style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none', zIndex: 50 }}>
      
      {/* Spider Web (Theme Aware & X -> O Sequence) */}
      {settings.pet.type === 'spider' && (
        <svg style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 49, pointerEvents: 'none' }}>
          <g stroke={webColor} strokeWidth="1.5" fill="none">
            {/* Phase 1: X (Diagonals) */}
            <motion.line 
              x1="50%" y1="50%" x2="0%" y2="0%" 
              initial={{ pathLength: 0 }} animate={{ pathLength: webPhase >= 1 ? 1 : 0 }} transition={{ duration: 1.5, delay: 2 }} 
            />
            <motion.line 
              x1="50%" y1="50%" x2="100%" y2="0%" 
              initial={{ pathLength: 0 }} animate={{ pathLength: webPhase >= 1 ? 1 : 0 }} transition={{ duration: 1.5, delay: 2 }} 
            />
            <motion.line 
              x1="50%" y1="50%" x2="100%" y2="100%" 
              initial={{ pathLength: 0 }} animate={{ pathLength: webPhase >= 1 ? 1 : 0 }} transition={{ duration: 1.5, delay: 2 }} 
            />
            <motion.line 
              x1="50%" y1="50%" x2="0%" y2="100%" 
              initial={{ pathLength: 0 }} animate={{ pathLength: webPhase >= 1 ? 1 : 0 }} transition={{ duration: 1.5, delay: 2 }} 
            />
            {/* Phase 1: + (Cardinals) */}
            <motion.line 
              x1="50%" y1="50%" x2="50%" y2="0%" 
              initial={{ pathLength: 0 }} animate={{ pathLength: webPhase >= 1 ? 1 : 0 }} transition={{ duration: 1.5, delay: 3.5 }} 
            />
            <motion.line 
              x1="50%" y1="50%" x2="100%" y2="50%" 
              initial={{ pathLength: 0 }} animate={{ pathLength: webPhase >= 1 ? 1 : 0 }} transition={{ duration: 1.5, delay: 3.5 }} 
            />
            <motion.line 
              x1="50%" y1="50%" x2="50%" y2="100%" 
              initial={{ pathLength: 0 }} animate={{ pathLength: webPhase >= 1 ? 1 : 0 }} transition={{ duration: 1.5, delay: 3.5 }} 
            />
            <motion.line 
              x1="50%" y1="50%" x2="0%" y2="50%" 
              initial={{ pathLength: 0 }} animate={{ pathLength: webPhase >= 1 ? 1 : 0 }} transition={{ duration: 1.5, delay: 3.5 }} 
            />

            {/* Phase 2: O (Concentric Rings) */}
            <motion.polygon 
              points="50%,40% 57%,43% 60%,50% 57%,57% 50%,60% 43%,57% 40%,50% 43%,43%" 
              initial={{ pathLength: 0 }} animate={{ pathLength: webPhase >= 2 ? 1 : 0 }} transition={{ duration: 2, delay: 0 }} 
            />
            <motion.polygon 
              points="50%,25% 68%,32% 75%,50% 68%,68% 50%,75% 32%,68% 25%,50% 32%,32%" 
              initial={{ pathLength: 0 }} animate={{ pathLength: webPhase >= 2 ? 1 : 0 }} transition={{ duration: 2, delay: 1.5 }} 
            />
            <motion.polygon 
              points="50%,10% 80%,20% 90%,50% 80%,80% 50%,90% 20%,80% 10%,50% 20%,20%" 
              initial={{ pathLength: 0 }} animate={{ pathLength: webPhase >= 2 ? 1 : 0 }} transition={{ duration: 2, delay: 3 }} 
            />
          </g>
        </svg>
      )}

      <motion.div
        animate={{ x: pos.x, y: pos.y, opacity: fade }}
        transition={{ 
          x: { duration: isTeleporting ? 0 : (settings.pet.type === 'spiderman' ? 1.5 : walkDuration), ease: 'linear' }, 
          y: { duration: isTeleporting ? 0 : (settings.pet.type === 'spiderman' ? 1.5 : walkDuration), ease: settings.pet.type === 'spiderman' ? [0.68, -0.55, 0.265, 1.55] : 'linear' },
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