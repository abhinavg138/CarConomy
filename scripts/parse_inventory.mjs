import fs from 'fs';

const text = fs.readFileSync('src/data/mockData.ts', 'utf8');
const blocks = text.split(/\{\s*id:\s*'/).slice(1);
const vehicles = blocks.map(b => {
  const id = b.split("'")[0];
  const make = (b.match(/make:\s*'([^']+)'/) || [])[1] || '';
  const model = (b.match(/model:\s*'([^']+)'/) || [])[1] || '';
  const fuelType = (b.match(/fuelType:\s*'([^']+)'/) || [])[1] || '';
  const type = (b.match(/type:\s*'([^']+)'/) || [])[1] || '';
  const image = (b.match(/image:\s*'([^']+)'/) || [])[1] || '';
  const hero = (b.match(/hero:\s*'([^']+)'/) || [])[1] || '';
  return { id, make, model, type, fuelType, currentImage: image || hero || 'none' };
});

console.log(`Total: ${vehicles.length}`);
console.table(vehicles);
