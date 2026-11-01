import { motion } from 'framer-motion';
import type { PetAnimation, PetType } from './types';
import { petIcons } from './theme';

export function PetPreview({ type, animation, size, color, customImage }: { type: PetType; animation: PetAnimation; size: number; color: string; customImage?: string }) {
  const animate =
    animation === 'bounce' ? { y: [0, -size * 0.15, 0] } :
    animation === 'float'  ? { y: [0, -size * 0.1, 0], rotate: [-3, 3, -3] } :
                             { rotate: [-10, 10, -10] };
  
  const iconSrc = customImage ? customImage : (petIcons[type]?.src || petIcons.cat.src);

  return (
    <div className="flex h-40 items-center justify-center rounded-2xl"
      style={{ background: `radial-gradient(circle at 50% 60%, ${color}33, transparent 70%)` }}>
      <motion.div
        animate={animate}
        transition={{ duration: animation === 'wiggle' ? 1.2 : 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 8px 12px rgba(68,59,82,0.2))' }}
        aria-hidden
      >
        <img src={iconSrc} alt={type} style={{ width: size, height: 'auto', objectFit: 'contain' }} />
      </motion.div>
    </div>
  );
}