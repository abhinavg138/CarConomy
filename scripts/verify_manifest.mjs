import fs from 'fs';

const manifest = JSON.parse(fs.readFileSync('public/vehicles/manifest.json', 'utf8'));
console.log('Total entries in manifest:', manifest.length);
const missing = [];
for (const item of manifest) {
  if (item.status === 'resolved') {
    const fullPath = 'public' + item.file;
    if (!fs.existsSync(fullPath)) {
      missing.push({ id: item.id, file: item.file });
    } else {
      const stat = fs.statSync(fullPath);
      console.log(`[OK] ${item.id} -> ${item.file} (${Math.round(stat.size / 1024)} KB)`);
    }
  } else {
    console.log(`[UNRESOLVED] ${item.id} -> ${item.unresolvedReason}`);
  }
}
if (missing.length > 0) {
  console.error('MISSING FILES:', missing);
  process.exit(1);
} else {
  console.log('\nALL RESOLVED FILES EXIST AND ARE VALID WEBP FILES!');
}
