import fs from 'fs';
import path from 'path';

// 1. Read existing manifest
const rawManifest = JSON.parse(fs.readFileSync('public/vehicles/manifest.json', 'utf8'));

// 2. Format entries to exact schema:
// { id, model, file, status: "verified" | "unresolved" | "placeholder", sourceUrl, licence, attribution, reason }
const cleanManifest = rawManifest.map(item => {
  if (item.id === 'maruti-wagonr') {
    return {
      id: 'maruti-wagonr',
      model: 'Maruti Suzuki WagonR',
      file: '/vehicles/maruti-wagonr.webp',
      status: 'verified',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:2020_Maruti_Suzuki_Wagon_R_VXi_(O)_(India)_front_view.png',
      licence: 'CC BY 3.0',
      attribution: 'Riding Hub',
      reason: null
    };
  }

  if (item.id === 'maruti-wagonr-cng') {
    return {
      id: 'maruti-wagonr-cng',
      model: 'Maruti Suzuki WagonR CNG',
      file: '/vehicles/maruti-wagonr.webp',
      status: 'verified',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:2020_Maruti_Suzuki_Wagon_R_VXi_(O)_(India)_front_view.png',
      licence: 'CC BY 3.0',
      attribution: 'Riding Hub (Inherited from Maruti Suzuki WagonR)',
      reason: null
    };
  }

  if (item.id === 'mg-windsor-ev') {
    return {
      id: 'mg-windsor-ev',
      model: 'MG Windsor EV',
      file: null,
      status: 'unresolved',
      sourceUrl: null,
      licence: null,
      attribution: null,
      reason: item.reason || item.unresolvedReason || 'No authentic front 3/4 photo with MG badging available on media galleries/Wikimedia without substituting foreign-badged sister vehicles (Baojun/Wuling).'
    };
  }

  return {
    id: item.id,
    model: item.model,
    file: item.file || null,
    status: item.status === 'resolved' ? 'verified' : (item.status || 'verified'),
    sourceUrl: item.sourceUrl || null,
    licence: item.licence || null,
    attribution: item.attribution || null,
    reason: item.reason || item.unresolvedReason || null
  };
});

fs.writeFileSync('public/vehicles/manifest.json', JSON.stringify(cleanManifest, null, 2), 'utf8');
console.log('Updated public/vehicles/manifest.json with', cleanManifest.length, 'entries');

// 3. Update src/utils/vehicleImages.ts
const tsContent = `import { Vehicle } from '../types';

export interface VehiclePhotoRecord {
  id: string;
  model: string;
  file: string | null;
  status: 'verified' | 'unresolved' | 'placeholder';
  sourceUrl: string | null;
  licence: string | null;
  attribution: string | null;
  reason: string | null;
}

/**
 * Single Image Registry for Carconomy.
 * Maps stable vehicle IDs directly to verified locally stored WebP assets.
 * Variants inherit model ID image per specification.
 * Unresolved models return null, triggering a labelled neutral placeholder.
 */
export const VEHICLE_IMAGE_REGISTRY: Record<string, VehiclePhotoRecord> = {
${cleanManifest.map(m => `  '${m.id}': {
    id: '${m.id}',
    model: ${JSON.stringify(m.model)},
    file: ${m.file ? JSON.stringify(m.file) : 'null'},
    status: '${m.status}',
    sourceUrl: ${m.sourceUrl ? JSON.stringify(m.sourceUrl) : 'null'},
    licence: ${m.licence ? JSON.stringify(m.licence) : 'null'},
    attribution: ${m.attribution ? JSON.stringify(m.attribution) : 'null'},
    reason: ${m.reason ? JSON.stringify(m.reason) : 'null'},
  },`).join('\n')}
};

/**
 * Resolves the verified photo for a vehicle model by stable ID.
 * Returns null if the model is unresolved or custom without a mapped photo.
 */
export function getVehicleImage(
  vehicleOrId: Vehicle | string,
  angle: 'hero' | 'front' | 'rear' | 'side' | 'interior' = 'hero'
): string | null {
  const id = typeof vehicleOrId === 'string' ? vehicleOrId : vehicleOrId.id;
  const entry = VEHICLE_IMAGE_REGISTRY[id];

  if (angle === 'hero') {
    if (entry?.status === 'verified' && entry.file) {
      return entry.file;
    }
    if (typeof vehicleOrId === 'object') {
      return vehicleOrId.images?.hero || vehicleOrId.image || null;
    }
    return null;
  }

  // Specific angle handling if available on vehicle object
  if (typeof vehicleOrId === 'object' && vehicleOrId.images?.[angle]) {
    return vehicleOrId.images[angle]!;
  }

  return null;
}
`;

fs.writeFileSync('src/utils/vehicleImages.ts', tsContent, 'utf8');
console.log('Updated src/utils/vehicleImages.ts');
