import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from './StoreContext';
import { petIcons } from './theme';

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

export default function PetMagic() {
  const { settings } = useStore();
  
  const [isIdle, setIsIdle] = useState(false);
  const [pos, setPos] = useState(() => getCornerPos('RB'));
  const [fade, setFade] = useState(0); 
  const [isTeleporting, setIsTeleporting] = useState(false);
  const currentCorner = useRef('RB');
  const walkTimer = useRef<any>(null);
  const idleTimer = useRef<any>(null);

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
      setTimeout(() => {
        setIsTeleporting(true);
        currentCorner.current = 'RB';
        setPos(getCornerPos('RB'));
        setTimeout(() => {
          setFade(1);
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
      const action = roll < 0.4 ? 'reverse' : roll < 0.7 ? 'teleport' : 'forward';
      
      if (action === 'teleport') {
        setFade(0); 
        setIsTeleporting(true);
        walkTimer.current = setTimeout(() => {
          const corners = ['RB', 'LB', 'LT', 'RT'];
          currentCorner.current = corners[Math.floor(Math.random() * corners.length)];
          setPos(getCornerPos(currentCorner.current));
          setFade(1);
          setIsTeleporting(false);
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
  }, [isIdle, settings.pet.enabled, settings.pet.type]);

  const animate = settings.pet.animation === 'bounce' ? { y: [0, -20, 0] } :
                  settings.pet.animation === 'float'  ? { y: [0, -10, 0], rotate: [-5, 5, -5] } :
                                                        { rotate: [-15, 15, -15] };
  const iconSrc = settings.pet.customImage ? settings.pet.customImage : petIcons[settings.pet.type]?.src;
  const walkDuration = settings.pet.type === 'snail' ? 35 : settings.pet.type === 'spider' ? 5 : settings.pet.type === 'spiderman' ? 7 : 10;

  return (
    <div style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none', zIndex: 50 }}>
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