
import { motion } from 'framer-motion';
import {
  Github,
  Globe,
  Heart,
  Sparkles,
  ExternalLink,
  Instagram,
  Linkedin,
  ArrowUpRight,
  Code2,
  ShieldCheck,
} from 'lucide-react';
import { Card, PageHeader } from '../../shared/ui';
import { ExtensionDownload } from '../components/ExtensionDownload';

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/Praveenkanth2805',
    icon: Github,
    handle: '@Praveenkanth2805',
    description: 'Explore my projects',
  },
  {
    label: 'Portfolio',
    href: 'https://praveenkanth-g.vercel.app/',
    icon: Globe,
    handle: 'Visit portfolio',
    description: 'My work and journey',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/praveenkanth2805/',
    icon: Instagram,
    handle: '@praveenkanth2805',
    description: 'A glimpse into my world',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/praveenkanth2805',
    icon: Linkedin,
    handle: 'Connect with me',
    description: 'Let’s grow together',
  },
];

const features = [
  {
    icon: Sparkles,
    title: 'Animated experiences',
    description: 'Bring your browsing to life with playful visual details.',
  },
  {
    icon: Globe,
    title: 'Personalized new tab',
    description: 'Themes, shortcuts, and useful widgets in one place.',
  },
  {
    icon: Code2,
    title: 'Made for everyday use',
    description: 'Thoughtful tools that make every new tab more useful.',
  },
];

const tags = ['Personalization', 'Creativity', 'Productivity'];

export default function About() {
  return (
    <>
      <PageHeader
        title="About Pibblora"
        subtitle="A little magic in every click."
      />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative isolate space-y-5"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-8 -top-8 -z-10 h-48 w-48 rounded-full opacity-20 blur-[90px]"
          style={{ background: 'var(--c-primary)' }}
        />

        <div className="grid gap-5 xl:grid-cols-3">
          <div className="min-w-0 space-y-5 xl:col-span-2">
            <Card>
              <div
                className="relative overflow-hidden rounded-3xl border p-5 sm:p-7"
                style={{
                  borderColor: 'var(--c-border)',
                  background:
                    'linear-gradient(135deg, var(--c-surface), var(--c-bg))',
                }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-15 blur-3xl"
                  style={{ background: 'var(--c-primary)' }}
                />

                <div className="relative">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl pibblora-gradient text-ink shadow-lg">
                      <Sparkles size={23} />
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-55">
                        Meet your new tab
                      </p>
                      <p className="mt-1 text-xs opacity-65">
                        Personalize your browsing
                      </p>
                    </div>
                  </div>

                  <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                    A Little Magic in Every Click
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 opacity-75">
                    Pibblora makes everyday browsing more personal and
                    enjoyable with animated companions, custom cursors,
                    beautiful themes, personalized new tabs, and handy
                    widgets. It brings creativity and convenience together
                    in one delightful experience.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border px-3 py-1.5 text-[11px] font-medium"
                        style={{
                          borderColor: 'var(--c-border)',
                          background: 'var(--c-surface)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-50">
                  What makes it special
                </p>
                <h3 className="mt-2 font-display text-xl font-bold">
                  Small details. Better browsing.
                </h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {features.map(({ icon: Icon, title, description }, index) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.07, duration: 0.3 }}
                    className="rounded-2xl border p-4 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                    style={{ borderColor: 'var(--c-border)' }}
                  >
                    <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl pibblora-gradient text-ink">
                      <Icon size={19} />
                    </div>

                    <h4 className="text-sm font-semibold">{title}</h4>
                    <p className="mt-2 text-xs leading-6 opacity-65">
                      {description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl pibblora-gradient text-ink">
                  <Heart size={21} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold">
                    Made with care
                  </h3>
                  <p className="mt-2 text-sm leading-6 opacity-75">
                    Pibblora is built around a simple idea: the little things
                    you see every day should feel a little more like you.
                  </p>
                  <p className="mt-3 text-xs font-medium opacity-55">
                    Pibblora — A Little Magic in Every Click.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="min-w-0 space-y-5">
            <Card>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-50">
                    The creator
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold">
                    Created by
                  </h3>
                </div>
                <Sparkles size={19} className="shrink-0 opacity-50" />
              </div>

              <div
                className="rounded-2xl border p-4"
                style={{
                  borderColor: 'var(--c-border)',
                  background: 'var(--c-bg)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl pibblora-gradient font-display text-xl font-bold text-ink shadow-md">
                    PK
                  </div>

                  <div className="min-w-0">
                    <h4 className="truncate font-display font-bold">
                      Praveenkanth G
                    </h4>
                    <p className="mt-1 text-xs opacity-60">
                      Software Developer
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 opacity-75">
                  Building creative digital experiences with modern web
                  technologies and a passion for thoughtful design.
                </p>

                <a
                  href="https://praveenkanth-g.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
                  style={{ borderColor: 'var(--c-border)' }}
                >
                  Explore my portfolio
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </Card>

            <Card>
              <div className="mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-50">
                  Let’s connect
                </p>
                <h3 className="mt-1 font-display text-lg font-bold">
                  Find me online
                </h3>
              </div>

              <div className="space-y-2">
                {socials.map(
                  (
                    { label, href, icon: Icon, handle, description },
                    index,
                  ) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label}: ${handle}`}
                      initial={{ opacity: 0, x: 8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05, duration: 0.25 }}
                      className="group flex min-w-0 items-center gap-3 rounded-2xl border p-3 transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
                      style={{ borderColor: 'var(--c-border)' }}
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl pibblora-gradient text-ink transition group-hover:scale-105">
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{label}</p>
                        <p className="mt-0.5 truncate text-[10px] opacity-55">
                          {handle}
                        </p>
                        <p className="truncate text-[10px] opacity-45">
                          {description}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={15}
                        className="shrink-0 opacity-40 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </motion.a>
                  ),
                )}
              </div>

              <div className="mt-4 flex items-center gap-2 text-[10px] opacity-50">
                <ExternalLink size={12} />
                Opens in a new tab
              </div>
            </Card>
          </div>
        </div>

        <section aria-label="Download Pibblora extension">
          <ExtensionDownload />
        </section>

        <footer
          className="flex flex-col items-center justify-between gap-3 rounded-2xl border px-4 py-4 text-center sm:flex-row sm:text-left"
          style={{
            borderColor: 'var(--c-border)',
            background: 'var(--c-surface)',
          }}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="shrink-0 opacity-60" />
            <p className="text-xs opacity-65">
              Built to make your everyday browsing more personal.
            </p>
          </div>

          <p className="text-[10px] font-medium opacity-50">
            © {new Date().getFullYear()} Pibblora
          </p>
        </footer>
      </motion.div>
    </>
  );
}
