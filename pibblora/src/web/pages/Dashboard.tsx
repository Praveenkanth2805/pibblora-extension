import { Link } from 'react-router-dom';
import { Cat, MousePointer2, Palette, LayoutGrid, Settings as Cog } from 'lucide-react';
import { useStore } from '../../shared/StoreContext';
import { Card, PageHeader } from '../../shared/ui';
import { PetPreview } from '../../shared/PetPreview';
import { petIcons, cursorEmoji, presets } from '../../shared/theme';

const tiles = [
  { to: '/pet', icon: Cat, title: 'Pet Studio', desc: 'Customize your browser buddy.' },
  { to: '/cursor', icon: MousePointer2, title: 'Cursor Studio', desc: 'Pick a trail that feels like you.' },
  { to: '/theme', icon: Palette, title: 'Theme Studio', desc: 'Pastel or dark, your palette.' },
  { to: '/widgets', icon: LayoutGrid, title: 'Widget Manager', desc: 'Choose your DreamTab widgets.' },
  { to: '/settings', icon: Cog, title: 'Settings', desc: 'Import, export, or start fresh.' },
];

export default function Dashboard() {
  const { settings } = useStore();
  
  const currentPetIcon = petIcons[settings.pet.type] || petIcons.cat;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="A cozy overview of your Pibblora setup." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <h3 className="font-display text-lg font-semibold">Your Buddy</h3>
          <p className="text-xs opacity-70 capitalize">Currently: {settings.pet.type}</p>
          <div className="mt-3">
            <PetPreview type={settings.pet.type} animation={settings.pet.animation} size={settings.pet.size} color={settings.pet.color} />
          </div>
          <p className="mt-3 text-xs opacity-70">{settings.pet.enabled ? 'Enabled' : 'Disabled'}</p>
        </Card>
        <Card>
          <h3 className="font-display text-lg font-semibold">Cursor Magic</h3>
          <p className="text-xs opacity-70 capitalize">Style: {settings.cursor.style}</p>
          <div className="mt-3 flex h-40 items-center justify-center rounded-2xl" style={{ background: `${settings.cursor.color}22` }}>
            {settings.cursor.style === 'neon' ? (
              <div style={{ 
                width: settings.cursor.size * 2, height: settings.cursor.size * 2, 
                background: settings.cursor.color, borderRadius: '50%', 
                boxShadow: `0 0 15px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4)` 
              }} />
            ) : (
              <span style={{ fontSize: settings.cursor.size * 2 }}>{cursorEmoji[settings.cursor.style]}</span>
            )}
          </div>
          <p className="mt-3 text-xs opacity-70">{settings.cursor.enabled ? 'Enabled' : 'Disabled'}</p>
        </Card>
        <Card>
          <h3 className="font-display text-lg font-semibold">Theme</h3>
          <p className="text-xs opacity-70 capitalize">Preset: {settings.theme.preset}</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {Object.entries(presets).map(([k, p]) => (
              <div key={k} className="h-16 rounded-xl border" style={{ background: p.bg, borderColor: p.primary }} title={k} />
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map(({ to, icon: Icon, title, desc }) => (
          <Link key={to} to={to}>
            <Card className="h-full transition hover:-translate-y-1">
              <div className="mb-2 grid h-10 w-10 place-items-center rounded-2xl" style={{ background: 'var(--c-primary)' }}>
                <Icon size={18} />
              </div>
              <h3 className="font-display text-lg font-semibold">{title}</h3>
              <p className="text-sm opacity-70">{desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}