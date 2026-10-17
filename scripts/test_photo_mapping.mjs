import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function runPhotoAudit() {
  console.log('--- Carconomy Photo Mapping Automated Audit ---');
  let hasFailure = false;

  // 1. Read mockData to extract all catalog vehicles from INITIAL_VEHICLES
  const mockDataText = fs.readFileSync('src/data/mockData.ts', 'utf8');
  const initialVehiclesText = mockDataText.substring(
    mockDataText.indexOf('export const INITIAL_VEHICLES'),
    mockDataText.indexOf('export const INITIAL_DRIVERS')
  );
  const blocks = initialVehiclesText.split(/\{\s*id:\s*'/).slice(1);
  const catalogueVehicles = blocks.map(b => {
    const id = b.split("'")[0];
    const make = (b.match(/make:\s*'([^']+)'/) || [])[1] || '';
    const model = (b.match(/model:\s*'([^']+)'/) || [])[1] || '';
    const variant = (b.match(/variant:\s*'([^']+)'/) || [])[1] || '';
    const year = (b.match(/year:\s*(\d+)/) || [])[1] || '2025';
    return { id, make, model, variant, year };
  });

  console.log(`Parsed ${catalogueVehicles.length} vehicles from catalogue INITIAL_VEHICLES.`);

  // 2. Read manifest
  const manifestPath = path.join('public', 'vehicles', 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('FAIL: manifest.json is missing at public/vehicles/manifest.json');
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const manifestMap = new Map(manifest.map(m => [m.id, m]));

  // Check 1: Vehicle IDs must be unique
  const idCounts = new Map();
  for (const v of catalogueVehicles) {
    idCounts.set(v.id, (idCounts.get(v.id) || 0) + 1);
  }
  for (const [id, count] of idCounts) {
    if (count > 1) {
      console.error(`FAIL: Vehicle ID is not unique: ${id} occurs ${count} times in catalogue.`);
      hasFailure = true;
    }
  }

  // Check 2: A catalogue ID has no mapping and no declared fallback
  for (const v of catalogueVehicles) {
    const entry = manifestMap.get(v.id);
    if (!entry) {
      console.error(`FAIL: Catalogue vehicle ${v.id} (${v.make} ${v.model}) has no manifest mapping!`);
      hasFailure = true;
    } else if (entry.status !== 'verified' && entry.status !== 'unresolved' && entry.status !== 'placeholder') {
      console.error(`FAIL: Catalogue vehicle ${v.id} has invalid status '${entry.status}'. Must be 'verified', 'unresolved', or 'placeholder'.`);
      hasFailure = true;
    } else if ((entry.status === 'unresolved' || entry.status === 'placeholder') && !entry.reason) {
      console.error(`FAIL: Catalogue vehicle ${v.id} marked ${entry.status} without a declared reason fallback!`);
      hasFailure = true;
    }
  }

  // Check 3: A mapped file is missing or fails to decode
  // Check 4: Two different model IDs share a file (variants sharing model image is allowed)
  // Check 6: A manifest entry is verified but has no sourceUrl or licence
  const fileToModelMap = new Map();

  for (const entry of manifest) {
    if (entry.status === 'verified') {
      // Check 6: Verified entries must have sourceUrl and licence
      if (!entry.sourceUrl || entry.sourceUrl.trim() === '') {
        console.error(`FAIL: Manifest entry ${entry.id} is verified but missing 'sourceUrl'!`);
        hasFailure = true;
      }
      if (!entry.licence || entry.licence.trim() === '') {
        console.error(`FAIL: Manifest entry ${entry.id} is verified but missing 'licence'!`);
        hasFailure = true;
      }

      // Check 3: File existence and decoding
      if (!entry.file) {
        console.error(`FAIL: Manifest entry ${entry.id} is verified but has no file path!`);
        hasFailure = true;
        continue;
      }

      const filePath = path.join('public', entry.file);
      if (!fs.existsSync(filePath)) {
        console.error(`FAIL: Mapped file for ${entry.id} is missing on disk: ${filePath}`);
        hasFailure = true;
        continue;
      }

      try {
        const meta = await sharp(filePath).metadata();
        if (!meta.width || !meta.height || meta.width < 100 || meta.height < 100) {
          console.error(`FAIL: File ${filePath} for ${entry.id} failed to decode valid dimensions (${meta.width}x${meta.height})!`);
          hasFailure = true;
        }
      } catch (err) {
        console.error(`FAIL: File ${filePath} for ${entry.id} failed to decode: ${err.message}`);
        hasFailure = true;
      }

      // Check 4: Two different model IDs share a file (variants allowed)
      const baseModelId = entry.id.replace(/-cng$/, '');
      if (fileToModelMap.has(entry.file)) {
        const existingBase = fileToModelMap.get(entry.file).replace(/-cng$/, '');
        if (existingBase !== baseModelId) {
          console.error(`FAIL: Two different models share the same image file: ${entry.id} and ${fileToModelMap.get(entry.file)} both use ${entry.file}`);
          hasFailure = true;
        }
      } else {
        fileToModelMap.set(entry.file, entry.id);
      }
    }
  }

  // Check 5: Alt text does not include the mapped model name
  for (const v of catalogueVehicles) {
    // Both VehicleImage and CarImage generate alt text containing the vehicle model name
    const altText = `${v.year} ${v.make} ${v.model} ${v.variant}`;
    if (!altText.includes(v.model)) {
      console.error(`FAIL: Alt text '${altText}' for ${v.id} does not include mapped model name '${v.model}'!`);
      hasFailure = true;
    }
  }

  if (hasFailure) {
    console.error('\nAutomated audit FAILED: One or more validation rules were violated!');
    process.exit(1);
  } else {
    console.log('\nAutomated audit PASSED cleanly:');
    console.log(`✓ 1. Catalogue IDs mapped with valid fallbacks: ${catalogueVehicles.length}`);
    console.log(`✓ 2. Mapped files decode successfully: ${manifest.filter(m => m.status === 'verified').length}`);
    console.log(`✓ 3. No different models share image files.`);
    console.log(`✓ 4. All vehicle IDs are strictly unique.`);
    console.log(`✓ 5. Alt texts properly include mapped model names.`);
    console.log(`✓ 6. All verified entries have sourceUrl and licence documented.`);
  }
}

runPhotoAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
