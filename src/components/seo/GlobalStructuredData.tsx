import React from 'react';
import StructuredData from './StructuredData';

const baseUrl = 'https://uplift-technologies.com';

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Uplift Technologies',
  url: baseUrl,
  sameAs: ['https://www.linkedin.com/company/uplift-technologies-intl/']
};

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Uplift Technologies',
  url: baseUrl
};

const service = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Healthcare operations support',
  description: 'Front office support, clinical and care coordination support, revenue cycle support, and medical scribe services delivered by Uplift Technologies.',
  provider: {
    '@type': 'Organization',
    name: 'Uplift Technologies',
    url: baseUrl
  }
};

const GlobalStructuredData: React.FC = () => (
  <>
    <StructuredData data={organization} />
    <StructuredData data={website} />
    <StructuredData data={service} />
  </>
);

export default GlobalStructuredData;
