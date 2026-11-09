#!/usr/bin/env node
/**
 * Zero-dependency internal link checker.
 * Verifies that every internal href/src (and every #anchor) in the HTML pages resolves.
 * Usage:  node tools/check-links.mjs
 */
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    if (n.startsWith('.') || n === 'node_modules' || n === 'partials') continue;
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p); else if (n.endsWith('.html')) files.push(p);
  }
})(ROOT);

const ids = f => new Set([...readFileSync(f, 'utf8').matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
let errors = 0, checked = 0;

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const baseTag = html.match(/<base href="([^"]+)"/);
  for (const [, attr, raw] of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(raw) || raw.startsWith('{{')) continue;
    checked++;
    const [pathPart, hash] = raw.split('#');
    let target;
    if (!pathPart) target = file;
    else {
      const baseDir = baseTag ? ROOT : dirname(file); // 404.html uses <base> (site root)
      target = resolve(baseDir, pathPart.startsWith('/') ? '.' + pathPart : pathPart);
      if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    }
    const label = `${relative(ROOT, file)} → ${raw}`;
    if (!existsSync(target)) { console.error('✗ missing   ', label); errors++; continue; }
    if (hash && target.endsWith('.html') && !ids(target).has(hash)) { console.error('✗ no anchor ', label); errors++; }
  }
}
console.log(`${files.length} pages, ${checked} internal links checked, ${errors} problem(s).`);
process.exit(errors ? 1 : 0);
