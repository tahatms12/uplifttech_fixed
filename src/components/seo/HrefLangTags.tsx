import React from 'react';
import { Helmet } from 'react-helmet';

interface HrefLangTagsProps {
  path: string;
  baseUrl?: string;
}

const HrefLangTags: React.FC<HrefLangTagsProps> = ({
  path,
  baseUrl = 'https://uplift-technologies.com'
}) => {
  // Remove leading and trailing slashes for consistency
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  
  // Generate URLs for each region
  const urls = {
    'x-default': `${baseUrl}/${cleanPath}`,
    'en-US': `${baseUrl}/us/${cleanPath}`,
    'en-GB': `${baseUrl}/uk/${cleanPath}`,
    'en-CA': `${baseUrl}/ca/${cleanPath}`
  };

  return (
    <Helmet>
      {/* Self-referencing canonical URL */}
      <link rel="canonical" href={urls['x-default']} />
      
      {/* Hreflang tags */}
      <link rel="alternate" href={urls['x-default']} hrefLang="x-default" />
      <link rel="alternate" href={urls['en-US']} hrefLang="en-US" />
      <link rel="alternate" href={urls['en-GB']} hrefLang="en-GB" />
      <link rel="alternate" href={urls['en-CA']} hrefLang="en-CA" />
    </Helmet>
  );
};

export default HrefLangTags;