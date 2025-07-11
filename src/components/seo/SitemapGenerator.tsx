import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SitemapGenerator: React.FC = () => {
  const location = useLocation();
  const baseUrl = 'https://uplift-technologies.com';

  useEffect(() => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      const currentUrl = `${baseUrl}${location.pathname}`;
      const timestamp = new Date().toISOString();
      
      console.debug(`
Sitemap Entry:
<url>
  <loc>${currentUrl}</loc>
  <lastmod>${timestamp.split('T')[0]}</lastmod>
  <changefreq>${location.pathname === '/' ? 'weekly' : 'monthly'}</changefreq>
  <priority>${location.pathname === '/' ? '1.0' : '0.8'}</priority>
</url>
      `);
    }
  }, [location]);

  return null;
};

export default SitemapGenerator;