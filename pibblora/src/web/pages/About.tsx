
import { motion, useReducedMotion } from 'framer-motion';
import {
  Github,
  Globe,
  Heart,
  Sparkles,
  ExternalLink,
  Instagram,
  Linkedin,
  ArrowUpRight,
  ShieldCheck,
  Palette,
  Zap,
  MousePointer2,
} from 'lucide-react';
import { PageHeader } from '../../shared/ui';
import { ExtensionDownload } from '../components/ExtensionDownload';
import SEO from '../../shared/SEO';

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/Praveenkanth2805',
    icon: Github,
    handle: '@Praveenkanth2805',
    color: 'from-slate-400/20 to-slate-500/5',
  },
  {
    label: 'Portfolio',
    href: 'https://praveenkanth-g.vercel.app/',
    icon: Globe,
    handle: 'Explore my work',
    color: 'from-blue-400/20 to-indigo-400/5',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/praveenkanth2805/',
    icon: Instagram,
    handle: '@praveenkanth2805',
    color: 'from-pink-400/20 to-orange-400/5',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/praveenkanth2805',
    icon: Linkedin,
    handle: 'Connect with me',
    color: 'from-sky-400/20 to-blue-400/5',
  },
];

const features = [
  {
    icon: Sparkles,
    title: 'Animated experiences',
    description: 'Playful companions and delightful motion for your browser.',
    theme: 'from-pink-400/20 to-purple-400/5',
    iconColor: 'text-pink-500',
  },
  {
    icon: Palette,
    title: 'Your personal space',
    description: 'Themes, shortcuts, and widgets in one beautiful new tab.',
    theme: 'from-violet-400/20 to-blue-400/5',
    iconColor: 'text-violet-500',
  },
  {
    icon: MousePointer2,
    title: 'Magical interactions',
    description: 'Custom cursors and tiny details that make browsing fun.',
    theme: 'from-orange-300/20 to-pink-400/5',
    iconColor: 'text-orange-500',
  },
  {
    icon: Zap,
    title: 'Everyday productivity',
    description: 'Useful tools that make each new tab work for you.',
    theme: 'from-cyan-400/20 to-blue-400/5',
    iconColor: 'text-cyan-600',
  },
];

const tags = ['Personalization', 'Creativity', 'Productivity'];

const cardBase =
  'group relative min-w-0 overflow-hidden rounded-[1.5rem] border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl';

const cardStyle = {
  borderColor: 'var(--c-border)',
  background: 'var(--c-surface)',
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  const reduceMotion = useReducedMotion();

  return (
    <>
    <SEO
      title="Pibblora Extension – Cute Chrome Browser Customization"
      description="Discover Pibblora Chrome Extension. Customize your browser with virtual pets, magical cursor effects, pastel themes, widgets and a dreamy new tab."
      path="/about"
    />
      <PageHeader
        title="About Pibblora"
        subtitle="A little magic in every click."
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: reduceMotion ? 0 : 0.07,
            },
          },
        }}
        className="relative isolate space-y-5 pb-4"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 -z-10 h-64 w-64 rounded-full opacity-20 blur-[100px]"
          style={{ background: 'var(--c-primary)' }}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[minmax(110px,auto)]">
          {/* Hero */}
          <motion.section
            variants={fadeUp}
            className={`${cardBase} p-6 sm:p-8 lg:col-span-8 lg:row-span-2`}
            style={{
              ...cardStyle,
              background:
                'linear-gradient(135deg, var(--c-surface), var(--c-bg))',
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20 blur-3xl"
              style={{ background: 'var(--c-primary)' }}
            />

            <div className="relative flex min-h-[260px] flex-col justify-between gap-8">
              <div>
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em]"
                  style={{
                    borderColor: 'var(--c-border)',
                    background: 'var(--c-bg)',
                  }}
                >
                  <Sparkles size={13} />
                  A creative browser experience
                </span>

                <h2 className="mt-6 max-w-xl font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  A Little Magic in{' '}
                  <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                    Every Click.
                  </span>
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 opacity-70">
                  Make your browser feel like yours. Discover animated
                  companions, custom cursors, dreamy themes, personalized
                  new tabs, and handy widgets — all in one playful space.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border px-3 py-1.5 text-[10px] font-medium transition-colors hover:bg-white/10"
                    style={{
                      borderColor: 'var(--c-border)',
                      background: 'var(--c-bg)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <motion.div
              aria-hidden="true"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="pointer-events-none absolute -right-10 bottom-3 hidden h-40 w-40 rounded-full border border-dashed opacity-30 md:block"
              style={{ borderColor: 'var(--c-primary)' }}
            />

            <Sparkles
              aria-hidden="true"
              size={32}
              className="pointer-events-none absolute bottom-10 right-12 hidden opacity-40 md:block"
            />
          </motion.section>

          {/* Creator */}
          <motion.section
            variants={fadeUp}
            className={`${cardBase} p-5 sm:p-6 lg:col-span-4 lg:row-span-2`}
            style={{
              ...cardStyle,
              background:
                'linear-gradient(145deg, #E9DFF9, var(--c-surface))',
            }}
          >
            <div className="flex min-h-[260px] flex-col justify-between gap-7">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-800/60">
                  The creator
                </span>
                <Sparkles size={19} className="text-purple-700/50" />
              </div>

              <div>
                <div className="mb-5 grid h-16 w-16 place-items-center rounded-[1.35rem] border border-white/70 bg-white/60 font-display text-2xl font-bold text-purple-800 shadow-sm backdrop-blur">
                  PK
                </div>

                <h3 className="font-display text-xl font-bold text-purple-950">
                  Praveenkanth G
                </h3>

                <p className="mt-1 text-xs font-medium text-purple-900/60">
                  Software Developer
                </p>

                <p className="mt-3 text-xs leading-6 text-purple-950/65">
                  Building creative digital experiences through modern web
                  technologies and thoughtful design.
                </p>
              </div>

              <a
                href="https://praveenkanth-g.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-purple-900/10 bg-white/40 px-4 py-3 text-xs font-semibold text-purple-950 transition-colors hover:bg-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                Explore portfolio
                <ArrowUpRight size={16} />
              </a>
            </div>
          </motion.section>

          {/* Features */}
          {features.map(
            ({ icon: Icon, title, description, theme, iconColor }) => (
              <motion.section
                key={title}
                variants={fadeUp}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className={`${cardBase} p-5 lg:col-span-3`}
                style={cardStyle}
              >
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${theme}`}
                />

                <div className="relative">
                  <div
                    className={`mb-5 grid h-11 w-11 place-items-center rounded-2xl border border-white/50 bg-white/60 ${iconColor}`}
                  >
                    <Icon size={21} />
                  </div>

                  <h3 className="text-sm font-bold">{title}</h3>

                  <p className="mt-2 text-xs leading-6 opacity-65">
                    {description}
                  </p>
                </div>
              </motion.section>
            ),
          )}

          {/* Philosophy */}
          <motion.section
            variants={fadeUp}
            className={`${cardBase} p-6 lg:col-span-5`}
            style={{
              ...cardStyle,
              background:
                'linear-gradient(135deg, #F5DDE8, var(--c-surface))',
            }}
          >
            <div className="flex min-h-[150px] flex-col justify-between gap-5">
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/50">
                  <Heart size={22} className="text-rose-500" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-900/50">
                  The philosophy
                </span>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-rose-950">
                  Made with care.
                </h3>
                <p className="mt-2 max-w-sm text-xs leading-6 text-rose-950/65">
                  The little things you see every day should feel a little
                  more like you.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Social links */}
          <motion.section
            variants={fadeUp}
            className={`${cardBase} p-5 sm:p-6 lg:col-span-7`}
            style={cardStyle}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">
                  Let’s connect
                </p>
                <h3 className="mt-1 font-display text-lg font-bold">
                  Find me online
                </h3>
              </div>

              <ExternalLink size={18} className="shrink-0 opacity-40" />
            </div>

            <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
              {socials.map(
                ({ label, href, icon: Icon, handle, color }, index) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label}: ${handle}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.3,
                      delay: reduceMotion ? 0 : index * 0.05,
                    }}
                    className="group flex min-w-0 items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-black/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                    style={{ borderColor: 'var(--c-border)' }}
                  >
                    <div
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${color}`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold">{label}</p>
                      <p className="truncate text-[10px] opacity-55">
                        {handle}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={14}
                      className="shrink-0 opacity-40 transition-opacity group-hover:opacity-100"
                    />
                  </motion.a>
                ),
              )}
            </div>
          </motion.section>

          {/* Download */}
          <motion.section
            variants={fadeUp}
            className="min-w-0 lg:col-span-12"
            aria-label="Download Pibblora extension"
          >
            <ExtensionDownload />
          </motion.section>

          {/* Footer */}
          <motion.footer
            variants={fadeUp}
            className={`${cardBase} flex flex-col items-center justify-between gap-3 px-5 py-4 sm:flex-row lg:col-span-12`}
            style={cardStyle}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="shrink-0 opacity-60" />
              <p className="text-center text-xs opacity-65 sm:text-left">
                Built to make your everyday browsing more personal.
              </p>
            </div>

            <p className="text-[10px] font-medium opacity-50">
              © {new Date().getFullYear()} Pibblora
            </p>
          </motion.footer>
        </div>
      </motion.div>
    </>
  );
}
