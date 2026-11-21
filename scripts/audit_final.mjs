import fs from 'fs';

const t = fs.readFileSync('src/data/mockData.ts', 'utf8');
const s = t.indexOf('export const INITIAL_VEHICLES');
const e = t.indexOf('export const INITIAL_DRIVERS');
const ids = [...t.substring(s, e).matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]);

const regText = fs.readFileSync('src/utils/vehicleImages.ts', 'utf8');
const regIds = [...regText.matchAll(/'([^']+)':\s*\{/g)].map(m => m[1]);

// Parse per-entry: find each entry block then grab file value (either null or a string in single or double quotes)
const regFileMap = {};
for (const id of regIds) {
  // Find the entry block start
  const blockStart = regText.indexOf(`'${id}': {`);
  const blockEnd = regText.indexOf('\n  },', blockStart);
  const block = regText.substring(blockStart, blockEnd);
  // Match file: null or file: "..." or file: '...'
  const fileMatch = block.match(/file:\s*(?:null|["']([^"']+)["'])/);
  if (fileMatch) {
    regFileMap[id] = fileMatch[1] || null; // undefined group means null
  }
}

const webpFiles = fs.readdirSync('public/vehicles').filter(f => f.endsWith('.webp'));

console.log(`\n=== CATALOGUE: ${ids.length} | REGISTRY: ${regIds.length} entries | DISK: ${webpFiles.length} webp ===\n`);

const rows = ids.map(id => {
  const inReg = regIds.includes(id);
  const file = inReg ? (regFileMap[id] || null) : undefined;
  const localName = file ? file.replace('/vehicles/', '') : null;
  const onDisk = localName ? fs.existsSync('public/vehicles/' + localName) : false;
  let status;
  if (!inReg) status = 'MISSING-REG';
  else if (file === null) status = 'NULL-FILE';
  else if (!onDisk) status = 'FILE-MISSING';
  else status = 'OK';
  return { id, file: localName || 'null', onDisk, status };
});

const ok = rows.filter(r => r.status === 'OK');
const problems = rows.filter(r => r.status !== 'OK');

console.log(`OK: ${ok.length}  |  Problems: ${problems.length}\n`);

if (problems.length) {
  console.log('--- PROBLEMS ---');
  console.table(problems.map(r => ({ id: r.id, file: r.file, status: r.status })));
}

console.log('\n--- FULL TABLE ---');
console.table(rows.map(r => ({ id: r.id, file: r.file, onDisk: r.onDisk, status: r.status })));

// Orphaned webp files (on disk but no catalogue entry points to them)
const usedFiles = new Set(rows.map(r => r.file).filter(f => f !== 'null'));
const unusedWebp = webpFiles.filter(f => !usedFiles.has(f));
if (unusedWebp.length) {
  console.log('\n--- UNUSED webp files on disk ---');
  unusedWebp.forEach(f => console.log(' ', f));
}
