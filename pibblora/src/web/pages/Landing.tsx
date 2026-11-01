import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cat, MousePointer2, Palette, LayoutGrid, Chrome } from 'lucide-react';
import { Button, Card } from '../../shared/ui';
import { ExtensionDownload } from '../components/ExtensionDownload';

const features = [
  { icon: Cat, title: 'Browser Buddy', desc: 'Animated companions that live on your pages.' },
  { icon: MousePointer2, title: 'Cursor Magic', desc: 'Stars, hearts, bubbles — trailing your every click.' },
  { icon: Palette, title: 'Theme Studio', desc: 'Pastel palettes and cozy dark mode.' },
  { icon: LayoutGrid, title: 'Widgets', desc: 'Timer, notes, checklist — a calmer new tab.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          {/* Changed to Image Logo */}
          <img src="/pibblora.png" draggable={false} alt="Pibblora" className="h-9 w-9 rounded-2xl object-cover shadow-sm" />
          Pibblora
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/about" className="text-sm opacity-70 hover:opacity-100">About</Link>
          <Link to="/dashboard"><Button>Open Dashboard</Button></Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pt-10 md:pt-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: 'var(--c-primary)' }}>
              <Chrome size={12} /> Chrome Extension · Local-first
            </span>
            <h1 className="mt-4 font-display text-5xl font-bold leading-tight">
              A Little Magic in Every Click.
            </h1>
            <p className="mt-4 max-w-md text-base opacity-75">
              Pibblora turns your browser into a soft, playful place — with animated pets,
              cursor sparkles, pastel themes, and a dreamy new tab.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/dashboard"><Button>Open Dashboard</Button></Link>
              <Link to="/pet"><Button variant="soft">Try Pet Studio</Button></Link>
            </div>
          </div>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="grid gap-4 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 200 }}>
                <Card>
                  <div className="mb-3 grid h-10 w-10 place-items-center rounded-2xl" style={{ background: 'var(--c-primary)' }}>
                    <Icon size={18} />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{title}</h3>
                  <p className="mt-1 text-sm opacity-70">{desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 pb-16 space-y-6">
        <ExtensionDownload />

        <Card className="text-center">
          <h2 className="font-display text-2xl font-bold">Ready to sprinkle some magic?</h2>
          <p className="mt-1 text-sm opacity-70">Everything is customizable. Nothing is locked away.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link to="/dashboard"><Button>Get Started</Button></Link>
            <Link to="/theme"><Button variant="ghost">Explore Themes</Button></Link>
          </div>
        </Card>
      </section>
    </div>
  );
}