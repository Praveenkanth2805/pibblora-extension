
const BASE_URL = 'https://pibblora-extension.vercel.app';

const person = {
  '@type': 'Person',
  '@id': `${BASE_URL}/about#creator`,
  name: 'Praveenkanth G',
  jobTitle: 'Software Developer',
  url: 'https://praveenkanth-g.vercel.app/',
  sameAs: [
    'https://github.com/Praveenkanth2805',
    'https://www.instagram.com/praveenkanth2805/',
    'https://www.linkedin.com/in/praveenkanth2805',
    'https://praveenkanth-g.vercel.app/',
  ],
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'Pibblora',
      url: BASE_URL,
      description:
        'Pibblora creates playful browser customization experiences with virtual pets, custom cursor effects, pastel themes, widgets and a personalized new tab.',
      founder: {
        '@id': `${BASE_URL}/about#creator`,
      },
      sameAs: [
        'https://github.com/Praveenkanth2805/pibblora-extension',
        'https://pibblora-extension.vercel.app/',
      ],
    },
    {
      ...person,
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${BASE_URL}/#software`,
      name: 'Pibblora Chrome Extension',
      alternateName: 'Pibblora',
      applicationCategory: 'BrowserApplication',
      operatingSystem: 'Chrome',
      description:
        'A cute Chrome extension featuring animated virtual pets, custom cursor effects, customizable pastel themes, useful widgets and a dreamy new tab experience.',
      url: BASE_URL,
      creator: {
        '@id': `${BASE_URL}/about#creator`,
      },
      publisher: {
        '@id': `${BASE_URL}/#organization`,
      },
      brand: {
        '@id': `${BASE_URL}/#organization`,
      },
    },
  ],
};

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
