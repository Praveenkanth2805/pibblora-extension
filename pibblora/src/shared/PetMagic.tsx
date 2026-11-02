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


function SpiderWeb({ color, phase }: { color: string; phase: number }) {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const resize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const { width, height } = size;
  const cx = width / 2;
  const cy = height / 2;
  const spokes = 24;
  const rings = 12;

  const boundary = Array.from({ length: spokes }, (_, i) => {
    const angle = (i / spokes) * Math.PI * 2;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    const scale = Math.min(
      (width / 2) / Math.max(Math.abs(dx), 0.0001),
      (height / 2) / Math.max(Math.abs(dy), 0.0001)
    );

    return {
      x: cx + dx * scale,
      y: cy + dy * scale,
    };
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 49,
        overflow: 'hidden',
      }}
    >
      <g
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.95"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 3px ${color})` }}
      >
        {boundary.map((point, i) => (
          <motion.line
            key={`silk-${i}`}
            x1={cx}
            y1={cy}
            x2={point.x}
            y2={point.y}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: phase >= 1 ? 1 : 0 }}
            transition={{
              duration: 1.4,
              delay: i * 0.035,
              ease: 'easeInOut',
            }}
          />
        ))}

        {Array.from({ length: rings }, (_, i) => {
          const progress = (i + 1) / rings;

          const points = boundary.map((point, j) => {
            const irregularity =
              1 + 0.012 * Math.sin(j * 2.3 + i);

            const t = progress * irregularity;

            return {
              x: cx + (point.x - cx) * t,
              y: cy + (point.y - cy) * t,
            };
          });

          let d = '';

          points.forEach((point, j) => {
            const next = points[(j + 1) % spokes];
            const mx = (point.x + next.x) / 2;
            const my = (point.y + next.y) / 2;

            d += `${j === 0 ? `M ${mx} ${my}` : ''} Q ${point.x} ${point.y} ${mx} ${my} `;
          });

          d += 'Z';

          return (
            <motion.path
              key={`spiral-${i}`}
              d={d}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: phase >= 2 ? 1 : 0,
                opacity: phase >= 2 ? 1 : 0,
              }}
              transition={{
                pathLength: {
                  duration: 1.2,
                  delay: 1.8 + i * 0.35,
                  ease: 'easeInOut',
                },
                opacity: { duration: 0.2 },
              }}
            />
          );
        })}
      </g>
    </svg>
  );
}


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
const webColor = presets[settings.theme.preset]?.primary || '#C9B6FF';

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
  if (!isIdle || !settings.pet.enabled || settings.pet.type !== 'spider') return;

  const firstTimer = setTimeout(() => {
    currentCorner.current = 'CENTER';
    setPos(getCornerPos('CENTER'));
    setWebPhase(1);
  }, 10000);

  return () => clearTimeout(firstTimer);
}, [isIdle, settings.pet.enabled, settings.pet.type]);


useEffect(() => {
  if (!isIdle || !settings.pet.enabled) return;

  let cancelled = false;

  const moveSpider = () => {
    if (cancelled) return;

    const corners = ['LT', 'RT', 'LB', 'RB', 'CENTER'];
    const next = corners[Math.floor(Math.random() * corners.length)];

    currentCorner.current = next;
    setPos(getCornerPos(next));
    walkTimer.current = setTimeout(moveSpider, 6000);
  };

  const walkSequence = () => {
    if (cancelled) return;

    const duration = settings.pet.type === 'spiderman' ? 7000 :
      settings.pet.type === 'snail' ? 35000 : 10000;

    if (settings.pet.type === 'spiderman') {
      const seq = ['RT', 'RB', 'RT', 'LT', 'LB', 'LT'];
      let idx = seq.indexOf(currentCorner.current);
      if (idx === -1) idx = 0;

      currentCorner.current = seq[(idx + 1) % seq.length];
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
        if (cancelled) return;

        const corners = ['RB', 'LB', 'LT', 'RT'];
        currentCorner.current = corners[Math.floor(Math.random() * corners.length)];
        setPos(getCornerPos(currentCorner.current));
        setFade(1);
        walkTimer.current = setTimeout(walkSequence, duration);
      }, 300);
    } else {
      const seq = ['RB', 'LB', 'LT', 'RT'];
      let idx = seq.indexOf(currentCorner.current);
      if (idx === -1) idx = 0;

      idx = action === 'forward'
        ? (idx + 1) % seq.length
        : (idx - 1 + seq.length) % seq.length;

      currentCorner.current = seq[idx];
      setPos(getCornerPos(currentCorner.current));
      walkTimer.current = setTimeout(walkSequence, duration);
    }
  };

  if (settings.pet.type === 'spider') {
    walkTimer.current = setTimeout(() => {
      if (cancelled) return;

      currentCorner.current = 'CENTER';
setPos(getCornerPos('CENTER'));

walkTimer.current = setTimeout(() => {
  if (cancelled) return;

  setWebPhase(1);

  walkTimer.current = setTimeout(() => {
    if (cancelled) return;

    setWebPhase(2);
    walkTimer.current = setTimeout(moveSpider, 9000);
  }, 2000);
}, 2000);
    }, 10000);
  } else {
    walkTimer.current = setTimeout(walkSequence, 10000);
  }

  return () => {
    cancelled = true;
    if (walkTimer.current) clearTimeout(walkTimer.current);
  };
}, [isIdle, settings.pet.enabled, settings.pet.type]);


  const animate = settings.pet.animation === 'bounce' ? { y: [0, -20, 0] } :
                  settings.pet.animation === 'float'  ? { y: [0, -10, 0], rotate: [-5, 5, -5] } :
                                                        { rotate: [-15, 15, -15] };
  const iconSrc = settings.pet.customImage ? settings.pet.customImage : petIcons[settings.pet.type]?.src;
  const walkDuration = settings.pet.type === 'snail' ? 35 : settings.pet.type === 'spiderman' ? 7 : 10;

  return (
    <div style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none', zIndex: 50 }}>
      
{settings.pet.type === 'spider' && webPhase > 0 && (
  <SpiderWeb color={webColor} phase={webPhase} />
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