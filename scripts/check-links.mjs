import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
const root = resolve('out');
async function walk(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...(await walk(p)));
    else if (p.endsWith('.html')) result.push(p);
  }
  return result;
}
const pages = new Map();
for (const file of await walk(root))
  pages.set(file, await readFile(file, 'utf8'));
let checked = 0;
const failures = [];
for (const [file, html] of pages) {
  for (const match of html.matchAll(/<a\b[^>]*?href="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (/^(?:[a-z]+:|\/\/)/i.test(href)) continue;
    const url = new URL(
      href,
      'https://local.test/' + file.slice(root.length + 1).replaceAll('\\', '/'),
    );
    let target = resolve(root, '.' + decodeURIComponent(url.pathname));
    try {
      if ((await stat(target)).isDirectory())
        target = join(target, 'index.html');
      await stat(target);
    } catch {
      failures.push(`${file}: missing ${href}`);
      continue;
    }
    checked++;
    if (url.hash && pages.has(target)) {
      const ids = [...pages.get(target).matchAll(/\bid="([^"]+)"/g)].map(
        (m) => m[1],
      );
      if (!ids.includes(decodeURIComponent(url.hash.slice(1))))
        failures.push(`${file}: missing anchor ${href}`);
    }
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `${pages.size} HTML files; ${checked} internal links and anchors passed.`,
  );
