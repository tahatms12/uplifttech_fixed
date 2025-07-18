import React from 'react';
import { Helmet } from 'react-helmet';

interface SeoHeadProps {
  title: string;
  description: string;
  pathname: string;
  slug: string;
}

const SeoHead: React.FC<SeoHeadProps> = ({ title, description, pathname, slug }) => {
  const fullTitle = `${title} | Uplift Technologies`;
  const canonicalUrl = `https://uplift-technologies.com${pathname}`;
  const ogImage = `https://uplift-technologies.com/assets/og/${slug}.jpg`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <link rel="canonical" href={canonicalUrl} />
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <script type="application/ld+json">
        {`{
          "@context":"https://schema.org",
          "@type":"WebPage",
          "url":"${canonicalUrl}",
          "name":"${fullTitle}",
          "description":"${description}",
          "inLanguage":"en"
        }`}
      </script>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
    </Helmet>
  );
};

export default SeoHead;
