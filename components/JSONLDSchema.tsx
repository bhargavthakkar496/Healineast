
export default function JSONLDSchema() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HealinginEast',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    sameAs: [],
    logo: (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000') + '/logo.png'
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}
