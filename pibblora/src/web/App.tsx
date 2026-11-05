
import { lazy, Suspense, type ReactNode } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Cat,
  MousePointer2,
  Palette,
  LayoutGrid,
  Info,
  Download,
} from 'lucide-react';
import { MagicLayer } from '../shared/MagicLayer';
import Landing from './pages/Landing';
import MobileNavigation from './components/MobileNavigation';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { HelmetProvider } from 'react-helmet-async';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const PetStudio = lazy(() => import('./pages/PetStudio'));
const CursorStudio = lazy(() => import('./pages/CursorStudio'));
const ThemeStudio = lazy(() => import('./pages/ThemeStudio'));
const WidgetManager = lazy(() => import('./pages/WidgetManager'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const About = lazy(() => import('./pages/About'));
const ExtensionPage = lazy(() => import('./pages/ExtensionPage'));

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pet', label: 'Pet Studio', icon: Cat },
  { to: '/cursor', label: 'Cursor Studio', icon: MousePointer2 },
  { to: '/theme', label: 'Theme Studio', icon: Palette },
  { to: '/widgets', label: 'Widgets', icon: LayoutGrid },
  { to: '/extension', label: 'Get Extension', icon: Download },
  { to: '/about', label: 'About', icon: Info },
];

function Shell({ children }: { children: ReactNode }) {
  const loc = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-md"
        style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <img
              src="/pibblora.png"
              draggable={false}
              alt="Pibblora"
              width="36"
              height="36"
              className="h-9 w-9 rounded-2xl object-cover shadow-sm"
            />
            Pibblora
          </Link>

          <nav className="hidden gap-1 md:flex" aria-label="Primary">
            {nav.map(n => {
              const active = loc.pathname === n.to;
              const Icon = n.icon;

              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${active ? 'font-semibold' : 'opacity-70 hover:opacity-100'}`}
                  style={active ? { background: 'var(--c-primary)' } : undefined}
                >
                  <Icon size={14} />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pt-8 pb-36 md:pb-8 flex-1">
        {children}
      </main>

      <footer className="mx-auto w-full max-w-6xl px-4 pb-32 pt-4 text-center text-xs opacity-60 md:pb-8">
        <div className="mb-2 flex flex-wrap items-center justify-center gap-4">
          <Link to="/privacy" className="transition-colors hover:text-[color:var(--c-primary)]">
            Privacy Policy
          </Link>
          <span>·</span>
          <Link to="/about" className="transition-colors hover:text-[color:var(--c-primary)]">
            About
          </Link>
        </div>
        <p>© {new Date().getFullYear()} Praveenkanth G. All rights reserved.</p>
        <p className="mt-1">Pibblora · A Little Magic in Every Click</p>
      </footer>

      <MobileNavigation />
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent"
        aria-label="Loading page"
      />
    </div>
  );
}

export default function App() {
  return (
    <>
    <HelmetProvider>
      <MagicLayer />

      <Suspense fallback={<PageLoader />}>
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
          <Route path="/privacy" element={<Shell><PrivacyPolicy /></Shell>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      </HelmetProvider>
    </>
  );
}
