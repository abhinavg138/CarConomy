import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function main() {
  const mockText = fs.readFileSync('src/data/mockData.ts', 'utf8');
  const initialVehiclesText = mockText.substring(
    mockText.indexOf('export const INITIAL_VEHICLES'),
    mockText.indexOf('export const INITIAL_DRIVERS')
  );
  const blocks = initialVehiclesText.split(/\{\s*id:\s*'/).slice(1);
  const catalogue = blocks.map(b => {
    const id = b.split("'")[0];
    const make = (b.match(/make:\s*'([^']+)'/) || [])[1] || '';
    const model = (b.match(/model:\s*'([^']+)'/) || [])[1] || '';
    const fuelType = (b.match(/fuelType:\s*'([^']+)'/) || [])[1] || '';
    return { id, make, model, fuelType };
  });

  const manifest = JSON.parse(fs.readFileSync('public/vehicles/manifest.json', 'utf8'));
  const manifestMap = new Map(manifest.map(m => [m.id, m]));
  const registryText = fs.readFileSync('src/utils/vehicleImages.ts', 'utf8');
  const publicFiles = fs.readdirSync('public/vehicles');

  console.log('Public vehicles files:', publicFiles);
  console.log('Total catalogue items:', catalogue.length);

  const results = [];
  for (const c of catalogue) {
    const m = manifestMap.get(c.id);
    const inManifest = !!m;
    const inRegistry = registryText.includes(`'${c.id}':`);
    let fileExists = false;
    let decodes = false;
    let sourceUrl = m?.sourceUrl || null;
    let licence = m?.licence || null;
    let filePath = m?.file ? path.join('public', m.file) : null;

    if (filePath && fs.existsSync(filePath)) {
      fileExists = true;
      try {
        const meta = await sharp(filePath).metadata();
        if (meta.width && meta.height) decodes = true;
      } catch (e) {
        decodes = false;
      }
    }

    // Classification per prompt:
    // Done: file exists, decodes, has a manifest entry with a sourceUrl and licence, and is mapped in the registry.
    // Partial: any of the above is missing, or the manifest entry has no source or licence.
    // Pending: no file and no manifest entry.
    // Suspect: a file exists but the manifest does not clearly match the model, or the source URL does not name the model.
    // Also handle unresolved models (e.g. mg-windsor-ev)
    let status = 'Pending';
    if (!fileExists && !inManifest) {
      status = 'Pending';
    } else if (m?.status === 'unresolved' || m?.status === 'placeholder') {
      status = 'Unresolved';
    } else if (fileExists && decodes && sourceUrl && licence && inRegistry) {
      // Check if suspect: does sourceUrl or model clearly match?
      if (sourceUrl.startsWith('http') && !sourceUrl.toLowerCase().includes(c.model.toLowerCase().split(' ')[0]) && !sourceUrl.toLowerCase().includes(c.make.toLowerCase())) {
        status = 'Suspect';
      } else {
        status = 'Done';
      }
    } else {
      status = 'Partial';
    }

    results.push({
      id: c.id,
      make: c.make,
      model: c.model,
      fuelType: c.fuelType,
      fileExists,
      decodes,
      inManifest,
      inRegistry,
      sourceUrl,
      licence,
      manifestStatus: m?.status,
      reason: m?.reason || m?.unresolvedReason || null,
      status
    });
  }

  console.table(results.map(r => ({
    id: r.id,
    make: r.make,
    model: r.model,
    'file exists': r.fileExists,
    decodes: r.decodes,
    'in manifest': r.inManifest,
    'in registry': r.inRegistry,
    status: r.status
  })));

  const catalogueIds = new Set(catalogue.map(c => c.id));
  const manifestIds = new Set(manifest.map(m => m.id));
  console.log('\nManifest entries not in catalogue:', manifest.filter(m => !catalogueIds.has(m.id)).map(m => m.id));
  console.log('Public files:', publicFiles);
  console.log('\nSummary count:', {
    totalCatalogue: catalogue.length,
    done: results.filter(r => r.status === 'Done').length,
    unresolved: results.filter(r => r.status === 'Unresolved').length,
    pending: results.filter(r => r.status === 'Pending').length,
    partial: results.filter(r => r.status === 'Partial').length,
    suspect: results.filter(r => r.status === 'Suspect').length
  });
}

main().catch(console.error);
