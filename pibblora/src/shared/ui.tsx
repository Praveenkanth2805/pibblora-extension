import { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl p-6 shadow-[0_10px_40px_-14px_rgba(68,59,82,0.18)] border backdrop-blur-sm ${className}`}
      style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}>
      {children}
    </div>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'soft' };
export function Button({ variant = 'primary', className = '', children, ...rest }: BtnProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';
  const styles: Record<string, string> = {
    primary: 'text-[color:var(--c-text)] shadow-md hover:brightness-105',
    ghost: 'border',
    soft: 'border',
  };
  const inline: React.CSSProperties = variant === 'primary'
    ? { background: 'var(--c-primary)' }
    : variant === 'soft'
      ? { background: 'var(--c-accent)', borderColor: 'var(--c-border)', color: 'var(--c-text)' }
      : { borderColor: 'var(--c-border)', color: 'var(--c-text)' };
  return (
    <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
      className={`${base} ${styles[variant]} ${className}`} style={inline} {...(rest as any)}>
      {children}
    </motion.button>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative h-7 w-12 rounded-full transition"
      style={{ background: checked ? 'var(--c-primary)' : 'rgba(150,140,170,0.35)' }}>
      <span className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition"
        style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }} />
    </button>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold opacity-80">{label}</span>
      {children}
      {hint && <span className="text-xs opacity-60">{hint}</span>}
    </label>
  );
}

export function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {subtitle && <p className="text-sm opacity-70">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export function PageHeader({ title, subtitle, back }: { title: string; subtitle?: string; back?: ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      {back}
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm opacity-70">{subtitle}</p>}
      </div>
    </div>
  );
}