import fs from 'fs';
import path from 'path';

const root = path.resolve(new URL('.', import.meta.url).pathname, '..');

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const readFile = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), 'utf-8');

const redirectsPath = path.join(root, 'public', '_redirects');
const headersPath = path.join(root, 'public', '_headers');

assert(fs.existsSync(redirectsPath), 'Missing public/_redirects');
assert(fs.existsSync(headersPath), 'Missing public/_headers');

const redirects = readFile('public/_redirects');
assert(redirects.includes('/* /index.html 200'), 'Missing SPA fallback redirect');
assert(redirects.includes('http://* https://uplift-technologies.com/:splat 301!'), 'Missing HTTP->HTTPS redirect');
assert(
  redirects.includes('https://www.uplift-technologies.com/* https://uplift-technologies.com/:splat 301!'),
  'Missing www->apex redirect'
);

const headers = readFile('public/_headers');
assert(headers.includes('Strict-Transport-Security'), 'Missing HSTS header');
assert(headers.includes('X-Content-Type-Options: nosniff'), 'Missing X-Content-Type-Options header');
assert(headers.includes('Cache-Control: public,max-age=31536000,immutable'), 'Missing immutable asset caching');

assert(fs.existsSync(path.join(root, 'functions', 'api', '[...path].ts')), 'Missing API handler');
assert(!fs.existsSync(path.join(root, 'netlify.toml')), 'netlify.toml should be removed');
assert(!fs.existsSync(path.join(root, 'netlify')), 'netlify/ directory should be removed');

console.log('Cloudflare Pages validation checks passed.');
