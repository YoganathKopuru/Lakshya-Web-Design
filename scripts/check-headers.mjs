// vercel.json (Vercel) and public/_headers (Cloudflare Pages, Netlify) must
// send the same security and caching headers; fail if they drift apart.
import { readFile } from 'node:fs/promises';

const vercel = JSON.parse(await readFile('vercel.json', 'utf8'));
const fromVercel = new Map();
for (const rule of vercel.headers) {
  const path = rule.source.replace('(.*)', '*');
  for (const { key, value } of rule.headers)
    fromVercel.set(`${path} ${key.toLowerCase()}`, value);
}

const fromHeaders = new Map();
let path;
for (const line of (await readFile('public/_headers', 'utf8')).split('\n')) {
  if (!line.trim() || line.trimStart().startsWith('#')) continue;
  if (!/^\s/.test(line)) {
    path = line.trim();
    continue;
  }
  const at = line.indexOf(':');
  fromHeaders.set(
    `${path} ${line.slice(0, at).trim().toLowerCase()}`,
    line.slice(at + 1).trim(),
  );
}

const problems = [];
for (const key of new Set([...fromVercel.keys(), ...fromHeaders.keys()])) {
  const a = fromVercel.get(key);
  const b = fromHeaders.get(key);
  if (a === undefined) problems.push(`only in public/_headers: ${key}`);
  else if (b === undefined) problems.push(`only in vercel.json: ${key}`);
  else if (a !== b)
    problems.push(`differs: ${key}\n  vercel.json: ${a}\n  _headers:    ${b}`);
}
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(
  `${fromVercel.size} header rules match in vercel.json and public/_headers.`,
);
