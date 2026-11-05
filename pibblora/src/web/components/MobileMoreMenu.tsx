import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutGrid,
  Palette,
  Settings,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const moreNav = [
  { to: '/widgets', label: 'Widgets', icon: LayoutGrid },
  { to: '/theme', label: 'Themes', icon: Palette },
//   { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/privacy', label: 'Privacy Policy', icon: ShieldCheck },
  { to: '/about', label: 'About', icon: Info },
];

interface Props {
  open: boolean;
  pathname: string;
  onClose: () => void;
}

export default function MobileMoreMenu({ open, pathname, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute bottom-full right-0 z-50 mb-4 w-56 overflow-hidden rounded-3xl border shadow-2xl"
          style={{
            background: 'var(--c-surface)',
            borderColor: 'var(--c-border)',
            transformOrigin: 'bottom right',
          }}
        >
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider opacity-50">
              Explore Pibblora
            </div>

            {moreNav.map(n => {
              const Icon = n.icon;
              const active = pathname === n.to;

              return (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${
                    active ? 'font-semibold' : 'opacity-75 hover:opacity-100'
                  }`}
                  style={
                    active ? { background: 'var(--c-primary)' } : undefined
                  }
                >
                  <Icon size={18} />
                  {n.label}
                  {active && (
                    <span
                      className="ml-auto h-1.5 w-1.5 rounded-full"
                      style={{ background: 'var(--c-text)' }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}