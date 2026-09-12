import Head from 'next/head';
import { seoData, profile, socialLinks } from '@/portfolio';

export default function SEO() {
  const base = (seoData.url || '').replace(/\/$/, '');
  const ogImage = seoData.image?.startsWith('http')
    ? seoData.image
    : `${base}${seoData.image ?? ''}`;

  const sameAs = [
    socialLinks.linkedin,
    socialLinks.github,
    socialLinks.kaggle,
    socialLinks.medium,
  ].filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.headline,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dallas',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    url: seoData.url,
    image: ogImage,
    sameAs,
    worksFor: { '@type': 'Organization', name: 'Qentelli Solutions' },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Vardhaman College of Engineering',
    },
    knowsAbout: [
      'Generative AI',
      'AI Agents',
      'Agentic Workflows',
      'Retrieval Augmented Generation',
      'Model Context Protocol',
      'Large Language Models',
      'Amazon Bedrock',
      'Solutions Architecture',
      'Amazon Web Services',
      'Data Engineering',
      'Distributed Systems',
      'Python',
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'AWS Certified Solutions Architect – Associate',
        recognizedBy: { '@type': 'Organization', name: 'Amazon Web Services' },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'AWS Certified Cloud Practitioner',
        recognizedBy: { '@type': 'Organization', name: 'Amazon Web Services' },
      },
    ],
  };

  /** ProfilePage wrapper so search engines read this as a person's profile. */
  const profilePageLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: seoData.title,
    description: seoData.description,
    url: seoData.url,
    mainEntity: { '@type': 'Person', name: profile.name, url: seoData.url },
  };

  return (
    <Head>
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords.join(', ')} />
      <meta name="author" content={seoData.author} />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#0B0D10" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {seoData.url && <link rel="canonical" href={seoData.url} />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      {seoData.url && <meta property="og:url" content={seoData.url} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:width" content="1200" />}
      {ogImage && <meta property="og:image:height" content="630" />}
      {ogImage && (
        <meta
          property="og:image:alt"
          content={`${profile.name} — ${profile.headline}`}
        />
      )}
      <meta property="og:site_name" content={profile.name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {ogImage && (
        <meta
          name="twitter:image:alt"
          content={`${profile.name} — ${profile.headline}`}
        />
      )}

      <link rel="icon" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/favicon.png" />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageLd) }}
      />
    </Head>
  );
}
