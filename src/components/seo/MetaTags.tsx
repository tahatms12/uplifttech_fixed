import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

interface MetaTagsProps {
  title: string;
  description: string;
  image?: string;
  type?: string;
  noIndex?: boolean;
  lang?: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  image = 'https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48m1OAWBxiNGcSDUwQEeuIMavWyFZ8B7RtLPpd',
  type = 'website',
  noIndex = false,
  lang = 'en'
}) => {
  const location = useLocation();
  const baseUrl = 'https://uplift-technologies.com';
  const canonicalUrl = `${baseUrl}${location.pathname}`;
  const fullTitle = `${title} | UPLIFT Technologies`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta charSet="utf-8" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots Meta */}
      <meta 
        name="robots" 
        content={noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'} 
      />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="en_GB" />
      <meta property="og:locale:alternate" content="en_CA" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Regional Alternates */}
      <link rel="alternate" href={`${baseUrl}/us${location.pathname}`} hrefLang="en-US" />
      <link rel="alternate" href={`${baseUrl}/uk${location.pathname}`} hrefLang="en-GB" />
      <link rel="alternate" href={`${baseUrl}/ca${location.pathname}`} hrefLang="en-CA" />
      <link rel="alternate" href={canonicalUrl} hrefLang="x-default" />
    </Helmet>
  );
};

export default MetaTags;