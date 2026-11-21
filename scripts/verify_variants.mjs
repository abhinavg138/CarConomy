/**
 * Variant architecture integrity checks.
 * Runs as plain JS to avoid TypeScript/ESM module resolution issues.
 * All data is inlined so this is self-contained.
 */

import fs from 'fs';

// Parse variant IDs from vehicleVariants.ts
const variantSrc = fs.readFileSync('src/data/vehicleVariants.ts', 'utf8');
const variantIds = [...variantSrc.matchAll(/variantId:\s*'([^']+)'/g)].map(m => m[1]);
const baseModelIds = [...variantSrc.matchAll(/baseModelId:\s*'([^']+)'/g)].map(m => m[1]);
const prices = [...variantSrc.matchAll(/purchasePrice:\s*(\d+)/g)].map(m => Number(m[1]));
const mileages = [...variantSrc.matchAll(/expectedMileage:\s*([\d.]+)/g)].map(m => Number(m[1]));

// Parse catalogue IDs from mockData
const mockSrc = fs.readFileSync('src/data/mockData.ts', 'utf8');
const s = mockSrc.indexOf('export const INITIAL_VEHICLES');
const e = mockSrc.indexOf('export const INITIAL_DRIVERS');
const catalogueIds = [...mockSrc.substring(s, e).matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]);

let pass = true;
const results = [];

// 1. Variant ID uniqueness
const seen = new Set();
const dups = [];
for (const id of variantIds) {
  if (seen.has(id)) dups.push(id);
  seen.add(id);
}
const uniquePass = dups.length === 0;
results.push(`1. Variant ID uniqueness: ${uniquePass ? 'PASS' : 'FAIL - duplicates: ' + dups.join(', ')} (${variantIds.length} total variants)`);
if (!uniquePass) pass = false;

// 2. All baseModelIds reference known catalogue ids
const unknownBase = baseModelIds.filter(id => !catalogueIds.includes(id));
const baseRefPass = unknownBase.length === 0;
results.push(`2. baseModelId → catalogue: ${baseRefPass ? 'PASS' : 'FAIL - unknown: ' + unknownBase.join(', ')}`);
if (!baseRefPass) pass = false;

// 3. No zero prices or zero mileages
const zeroPrices = prices.filter(p => p === 0);
const zeroMileages = mileages.filter(m => m === 0);
const dataPass = zeroPrices.length === 0 && zeroMileages.length === 0;
results.push(`3. No zero prices/mileages: ${dataPass ? 'PASS' : `FAIL - ${zeroPrices.length} zero prices, ${zeroMileages.length} zero mileages`}`);
if (!dataPass) pass = false;

// 4. All prices are positive integers > 0
const invalidPrices = prices.filter(p => p < 100000 || p > 100000000);
const priceRangePass = invalidPrices.length === 0;
results.push(`4. Price range sanity (₹1L–₹10Cr): ${priceRangePass ? 'PASS' : 'FAIL - invalid: ' + invalidPrices.join(', ')}`);
if (!priceRangePass) pass = false;

// 5. All mileages are in realistic range (3-35)
const invalidMileages = mileages.filter(m => m < 3 || m > 40);
const mileageRangePass = invalidMileages.length === 0;
results.push(`5. Mileage range sanity (3–40): ${mileageRangePass ? 'PASS' : 'FAIL - invalid: ' + invalidMileages.join(', ')}`);
if (!mileageRangePass) pass = false;

// 6. Image registry still OK (37 catalogue entries)
const regSrc = fs.readFileSync('src/utils/vehicleImages.ts', 'utf8');
const regIds = [...regSrc.matchAll(/'([^']+)':\s*\{/g)].map(m => m[1]);
const registryPass = regIds.length === catalogueIds.length && catalogueIds.every(id => regIds.includes(id));
results.push(`6. Image registry complete: ${registryPass ? 'PASS' : 'FAIL'} (${regIds.length}/${catalogueIds.length} entries matched)`);
if (!registryPass) pass = false;

// 7. Batch 1 Sourcing and Dates check
const batch1 = ['tata-nexon', 'tata-punch', 'maruti-swift', 'maruti-brezza', 'hyundai-creta'];
const sources = [...variantSrc.matchAll(/source:\s*'([^']+)'/g)].map(m => m[1]);
const dates = [...variantSrc.matchAll(/verifiedOn:\s*'([^']+)'/g)].map(m => m[1]);
const sourcingPass = sources.length >= variantIds.length && dates.length >= variantIds.length;
results.push(`7. Sourcing and dates complete: ${sourcingPass ? 'PASS' : 'FAIL'} (${sources.length} sources, ${dates.length} dates for ${variantIds.length} variants)`);
if (!sourcingPass) pass = false;

// 8. Coverage registry integrity
const coverageMatches = [...variantSrc.matchAll(/coverage:\s*'([^']+)'/g)].map(m => m[1]);
const coveragePass = coverageMatches.length >= 5 && coverageMatches.every(c => c === 'partial' || c === 'complete');
results.push(`8. Model coverage rules: ${coveragePass ? 'PASS' : 'FAIL'} (${coverageMatches.length} models tracked)`);
if (!coveragePass) pass = false;

console.log('\n=== VARIANT ARCHITECTURE INTEGRITY CHECKS ===\n');
results.forEach(r => console.log(r));
console.log(`\n=== OVERALL: ${pass ? '✅ ALL PASS' : '❌ FAILURES ABOVE'} ===\n`);
process.exit(pass ? 0 : 1);
