import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  Cat,
  MousePointer2,
  Menu,
  Download,
  X,
} from 'lucide-react';
import MobileMoreMenu from './MobileMoreMenu';

const mobileNav = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/pet', label: 'Pets', icon: Cat },
  { to: '/cursor', label: 'Cursor', icon: MousePointer2 },
  { to: '/extension', label: 'Get Extension', icon: Download },
];

const moreRoutes = [
  '/widgets',
  '/theme',
//   '/settings',
  '/privacy',
  '/about',
];

export default function MobileNavigation() {
  const loc = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  const isMoreActive = moreRoutes.includes(loc.pathname);

  useEffect(() => {
    setMoreOpen(false);
  }, [loc.pathname]);

  return (
    <>
      <AnimatePresence>
        {moreOpen && (
          <motion.button
            type="button"
            aria-label="Close navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMoreOpen(false)}
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px] md:hidden"
          />
        )}
      </AnimatePresence>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 px-3 md:hidden"
        aria-label="Mobile navigation"
        style={{
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        }}
      >
        <div className="relative mx-auto max-w-md">
          <MobileMoreMenu
            open={moreOpen}
            pathname={loc.pathname}
            onClose={() => setMoreOpen(false)}
          />

          <div
            className="relative rounded-[28px] border shadow-[0_8px_35px_rgba(70,40,100,0.14)] backdrop-blur-2xl"
            style={{
              background: 'var(--c-surface)',
              borderColor: 'var(--c-border)',
            }}
          >
            <div className="grid grid-cols-5 items-center px-2 py-2">
              {mobileNav.map(n => {
                const Icon = n.icon;
                const active = loc.pathname === n.to;

                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    aria-current={active ? 'page' : undefined}
                    className="relative flex min-w-0 flex-col items-center justify-center gap-1 py-1.5"
                  >
                    <motion.div
                      className="relative flex h-10 w-11 items-center justify-center rounded-2xl"
                      animate={{
                        y: active ? -5 : 0,
                        scale: active ? 1.05 : 1,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 25,
                      }}
                    >
                      {active && (
                        <motion.div
                          layoutId="mobileActiveIndicator"
                          className="absolute inset-0 rounded-2xl"
                          style={{
                            background:
                              'linear-gradient(135deg, #E9D5FF, #FBCFE8)',
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 350,
                            damping: 28,
                          }}
                        />
                      )}

                      <Icon
                        size={21}
                        strokeWidth={active ? 2.5 : 1.8}
                        className="relative z-10"
                        style={{
                          color: active ? '#7545A5' : 'var(--c-text)',
                          opacity: active ? 1 : 0.65,
                        }}
                      />
                    </motion.div>

                    <motion.span
                      animate={{
                        opacity: active ? 1 : 0.6,
                        y: active ? -2 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                      className="max-w-full truncate text-[10px] font-medium"
                      style={{
                        color: active ? 'var(--c-primary)' : 'var(--c-text)',
                      }}
                    >
                      {n.label}
                    </motion.span>

                    {active && (
                      <motion.div
                        layoutId="mobileActiveDot"
                        className="absolute -bottom-0.5 h-1 w-1 rounded-full"
                        style={{ background: 'var(--c-primary)' }}
                      />
                    )}
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={() => setMoreOpen(prev => !prev)}
                aria-expanded={moreOpen}
                aria-label="More navigation options"
                className="relative flex min-w-0 flex-col items-center justify-center gap-1 py-1.5"
              >
                <motion.div
                  className="relative flex h-10 w-11 items-center justify-center rounded-2xl"
                  animate={{
                    y: moreOpen || isMoreActive ? -5 : 0,
                    scale: moreOpen || isMoreActive ? 1.05 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 350,
                    damping: 25,
                  }}
                >
                  {(moreOpen || isMoreActive) && (
                    <motion.div
                      layoutId="mobileActiveIndicator"
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background:
                          'linear-gradient(135deg, #E9D5FF, #FBCFE8)',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 28,
                      }}
                    />
                  )}

                  <motion.div
                    className="relative z-10 flex items-center justify-center"
                    animate={{ rotate: moreOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {moreOpen ? (
                      <X size={21} style={{ color: '#7545A5' }} />
                    ) : (
                      <Menu
                        size={21}
                        style={{
                          color: isMoreActive ? '#7545A5' : 'var(--c-text)',
                          opacity: isMoreActive ? 1 : 0.65,
                        }}
                      />
                    )}
                  </motion.div>
                </motion.div>

                <span
                  className="text-[10px] font-medium"
                  style={{
                    color:
                      moreOpen || isMoreActive
                        ? 'var(--c-primary)'
                        : 'var(--c-text)',
                    opacity: moreOpen || isMoreActive ? 1 : 0.6,
                  }}
                >
                  More
                </span>

                {isMoreActive && !moreOpen && (
                  <motion.div
                    layoutId="mobileActiveDot"
                    className="absolute -bottom-0.5 h-1 w-1 rounded-full"
                    style={{ background: 'var(--c-primary)' }}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}