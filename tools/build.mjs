#!/usr/bin/env node
/**
 * Grow Within Today — zero-dependency page sync.
 *
 * The HTML pages are plain static files that can be deployed as they are.
 * This script keeps the shared parts consistent:
 *   - copies partials/header.html and partials/footer.html into every page
 *     (between the <!-- @header --> / <!-- @footer --> markers),
 *   - marks the current page in the navigation (aria-current),
 *   - writes canonical / Open Graph URLs, sitemap.xml and robots.txt
 *     once "siteUrl" is set in site.config.json,
 *   - sets the <base> of 404.html from "basePath".
 *
 * Usage:  node tools/build.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(join(ROOT, p), 'utf8');
const config = JSON.parse(read('site.config.json'));
const siteUrl = (config.siteUrl || '').replace(/\/+$/, '');
const basePath = ('/' + (config.basePath || '/').replace(/^\/+|\/+$/g, '') + '/').replace('//', '/');
const header = read('partials/header.html').trim();
const footer = read('partials/footer.html').trim();
const year = String(new Date().getFullYear());

const block = (html, name, content) => {
  const re = new RegExp(`<!-- @${name} -->[\\s\\S]*?<!-- /@${name} -->`);
  if (!re.test(html)) throw new Error(`Marker <!-- @${name} --> not found`);
  return html.replace(re, `<!-- @${name} -->\n${content}\n<!-- /@${name} -->`);
};

const fill = (tpl, root) => tpl
  .replaceAll('{{home}}', root || './')
  .replaceAll('{{root}}', root)
  .replaceAll('{{year}}', year);

const urlFor = file => siteUrl + '/' + file.replace(/index\.html$/, '');

let count = 0;
for (const page of config.pages) {
  const depth = page.file.split('/').length - 1;
  const root = '../'.repeat(depth);
  let html = read(page.file);
  let h = fill(header, root), f = fill(footer, root);
  const mark = s => s.replace(new RegExp(`data-nav="${page.nav}"`, 'g'), `data-nav="${page.nav}" aria-current="page"`);
  html = block(html, 'header', mark(h));
  html = block(html, 'footer', mark(f));

  const seo = siteUrl
    ? [`<link rel="canonical" href="${urlFor(page.file)}">`,
       `<meta property="og:url" content="${urlFor(page.file)}">`,
       `<meta property="og:image" content="${siteUrl}/assets/img/og-image.jpg">`].join('\n')
    : '<!-- Canonical and Open Graph URLs are added by tools/build.mjs once "siteUrl" is set in site.config.json -->';
  html = block(html, 'seo', seo);
  writeFileSync(join(ROOT, page.file), html);
  count++;
}

// 404 page: absolute base so its links work at any URL depth
let nf = read('404.html');
nf = block(nf, 'base', `<base href="${basePath}">`);
nf = block(nf, 'header', fill(header, ''));
nf = block(nf, 'footer', fill(footer, ''));
writeFileSync(join(ROOT, '404.html'), nf);

// robots.txt + sitemap.xml
let robots = 'User-agent: *\nAllow: /\n';
if (siteUrl) {
  robots += `\nSitemap: ${siteUrl}/sitemap.xml\n`;
  const today = new Date().toISOString().slice(0, 10);
  const urls = config.pages.map(p => `  <url>\n    <loc>${urlFor(p.file)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${p.priority}</priority>\n  </url>`).join('\n');
  writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}
writeFileSync(join(ROOT, 'robots.txt'), robots);

console.log(`Synced ${count} pages + 404.html` + (siteUrl ? ` · sitemap for ${siteUrl}` : ' · siteUrl not set (no canonical URLs / sitemap yet)'));
