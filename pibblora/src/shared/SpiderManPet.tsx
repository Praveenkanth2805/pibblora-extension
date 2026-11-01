import { motion } from 'framer-motion';
import type { PetAnimation } from './types';
import { petIcons } from './theme';

export function SpiderManPet({ 
  isIdle, 
  animation, 
  position, 
  visible,
  size = 64
}: { 
  isIdle: boolean; 
  animation: PetAnimation; 
  position: { x: number; y: number }; 
  visible: boolean; 
  size?: number;
}) {
  if (!visible) return null;

  const icon = petIcons['spiderman'];

  // Animation logic for bouncing/floating the image
  const animate = animation === 'bounce' ? { y: [0, -20, 0] } :
                  animation === 'float'  ? { y: [0, -10, 0], rotate: [-5, 5, -5] } :
                                            { rotate: [-15, 15, -15] };

  return (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      transition={{ 
        // 7 seconds duration when idle (moving), instant snap when event happens
        x: { duration: isIdle ? 7 : 0, ease: 'linear' }, 
        y: { duration: isIdle ? 7 : 0, ease: 'linear' }
      }}
      style={{ 
        position: 'fixed', 
        left: 0, 
        top: 0, 
        pointerEvents: 'none', 
        zIndex: 99999 
      }}
    >
      <motion.div
        animate={animate}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.2))' }}
      >
        <img 
          src={icon?.src || '/spider.png'} 
          alt="spiderman" 
          style={{ width: size, height: 'auto', objectFit: 'contain' }} 
        />
      </motion.div>
    </motion.div>
  );
}