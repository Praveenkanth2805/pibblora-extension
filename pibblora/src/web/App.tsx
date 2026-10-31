import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Cat, MousePointer2, Palette, LayoutGrid, Settings as Cog, Info, Download } from 'lucide-react';
import { MagicLayer } from '../shared/MagicLayer';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import PetStudio from './pages/PetStudio';
import CursorStudio from './pages/CursorStudio';
import ThemeStudio from './pages/ThemeStudio';
import WidgetManager from './pages/WidgetManager';
import SettingsPage from './pages/Settings';
import About from './pages/About';
import ExtensionPage from './pages/ExtensionPage';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pet', label: 'Pet Studio', icon: Cat },
  { to: '/cursor', label: 'Cursor Studio', icon: MousePointer2 },
  { to: '/theme', label: 'Theme Studio', icon: Palette },
  { to: '/widgets', label: 'Widgets', icon: LayoutGrid },
  // { to: '/settings', label: 'Settings', icon: Cog },
  { to: '/extension', label: 'Get Extension', icon: Download },
  { to: '/about', label: 'About', icon: Info },
];

function Shell({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b backdrop-blur-md"
        style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
            {/* Changed to Image Logo */}
            <img src="/pibblora.png" draggable={false} alt="Pibblora" className="h-9 w-9 rounded-2xl object-cover shadow-sm" />
            Pibblora
          </Link>
          <nav className="hidden gap-1 md:flex" aria-label="Primary">
            {nav.map(n => {
              const Active = loc.pathname === n.to;
              const Icon = n.icon;
              return (
                <Link key={n.to} to={n.to}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${Active ? 'font-semibold' : 'opacity-70 hover:opacity-100'}`}
                  style={Active ? { background: 'var(--c-primary)' } : undefined}>
                  <Icon size={14} /> {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      
      <main className="mx-auto w-full max-w-6xl px-4 py-8 flex-1">{children}</main>
      
      <footer className="mx-auto w-full max-w-6xl px-4 pb-8 pt-4 text-center text-xs opacity-60">
        <p>© {new Date().getFullYear()} Praveenkanth G. All rights reserved.</p>
        <p className="mt-1">Pibblora · A Little Magic in Every Click</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <>
      <MagicLayer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Shell><Dashboard /></Shell>} />
        <Route path="/pet" element={<Shell><PetStudio /></Shell>} />
        <Route path="/cursor" element={<Shell><CursorStudio /></Shell>} />
        <Route path="/theme" element={<Shell><ThemeStudio /></Shell>} />
        <Route path="/widgets" element={<Shell><WidgetManager /></Shell>} />
        <Route path="/settings" element={<Shell><SettingsPage /></Shell>} />
        <Route path="/extension" element={<Shell><ExtensionPage /></Shell>} />
        <Route path="/about" element={<Shell><About /></Shell>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}