// Extracts only the icons used in source into lib/icons-bundle.json so they
// render offline (no runtime Iconify API calls). Run: node scripts/generate-icons.mjs
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { getIconData } from '@iconify/utils';

const PREFIXES = ['logos', 'ph', 'simple-icons', 'vscode-icons', 'carbon'];

const sets = {};
for (const p of PREFIXES) {
  sets[p] = JSON.parse(
    readFileSync(`node_modules/@iconify-json/${p}/icons.json`, 'utf8')
  );
}

const files = ['portfolio.ts'];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(full)) files.push(full);
  }
}
['components', 'lib', 'pages'].forEach(walk);

const re = new RegExp(`(?:${PREFIXES.join('|')}):[a-z0-9-]+`, 'g');
const names = new Set();
for (const file of files) {
  const matches = readFileSync(file, 'utf8').match(re);
  if (matches) matches.forEach((n) => names.add(n));
}

const bundle = {};
const missing = [];
for (const name of [...names].sort()) {
  const [prefix, icon] = name.split(':');
  const data = getIconData(sets[prefix], icon);
  if (data) bundle[name] = data;
  else missing.push(name);
}

const json = JSON.stringify(bundle);
writeFileSync('lib/icons-bundle.json', json);
console.log(
  `✓ Bundled ${Object.keys(bundle).length} icons (${(json.length / 1024).toFixed(1)} KB) → lib/icons-bundle.json`
);
if (missing.length) {
  console.log(`✗ MISSING (${missing.length}): ${missing.join(', ')}`);
  process.exit(1);
}
console.log('✓ All used icons resolved offline.');
