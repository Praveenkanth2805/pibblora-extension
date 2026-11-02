import { lazy, Suspense } from 'react';
import { useStore } from './StoreContext';
import { CursorMagic } from './CursorMagic';

// Lazy load PetMagic to reduce initial bundle size
const PetMagic = lazy(() => import('./PetMagic'));

export function MagicLayer() {
  const { settings } = useStore();

  return (
    <>
      {/* Cursor loads instantly if enabled */}
      {settings.cursor.enabled && <CursorMagic />}
      
      {/* Pet only loads when enabled, keeping initial load fast */}
      {settings.pet.enabled && (
        <Suspense fallback={null}>
          <PetMagic />
        </Suspense>
      )}
    </>
  );
}