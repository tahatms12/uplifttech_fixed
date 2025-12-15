import fs from 'fs';
import path from 'path';

const baseUrl = 'https://uplift-technologies.com';
const rootDir = path.resolve(new URL('..', import.meta.url).pathname, '');

const readText = (relativePath) => fs.readFileSync(path.join(rootDir, relativePath), 'utf-8');

const extractUnique = (content, pattern) => {
  const matches = new Set();
  let match;
  while ((match = pattern.exec(content)) !== null) {
    matches.add(match[1]);
  }
  return Array.from(matches);
};

const roles = extractUnique(readText('src/data/roles.ts'), /slug:\s*'([^']+)'/g);
const pods = extractUnique(readText('src/data/pods.ts'), /slug:\s*'([^']+)'/g);
const candidates = extractUnique(readText('src/data/candidates.ts'), /id:\s*'([^']+)'/g);

const staticPaths = [
  '/',
  '/about',
  '/services',
  '/pricing',
  '/case-studies',
  '/careers',
  '/book',
  '/privacy',
  '/terms-of-service',
  '/compliance-security',
  '/candidates',
  '/apply',
  '/candidate-acknowledgement',
  '/payment'
];

const servicePaths = pods.map((slug) => `/services/${slug}`);
const rolePaths = roles.map((slug) => `/careers/${slug}`);
const candidatePaths = candidates.map((id) => `/candidates/${id}`);

const paths = Array.from(new Set([...staticPaths, ...servicePaths, ...rolePaths, ...candidatePaths]))
  .sort((a, b) => a.localeCompare(b));

const today = new Date().toISOString().split('T')[0];
const sitemapEntries = paths
  .map((route) => `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>\n    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n  </url>`)
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;

fs.writeFileSync(path.join(rootDir, 'public', 'sitemap.xml'), sitemap, 'utf-8');
fs.writeFileSync(
  path.join(rootDir, 'public', 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`,
  'utf-8'
);

console.log(`Generated sitemap with ${paths.length} routes.`);
