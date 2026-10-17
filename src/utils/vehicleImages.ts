import { Vehicle } from '../types';

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
  'tata-nexon': {
    id: 'tata-nexon',
    model: "Tata Nexon",
    file: "/vehicles/tata-nexon.webp",
    status: 'verified',
    sourceUrl: "Local verified catalogue media asset",
    licence: "Editorial / Media Asset",
    attribution: "Tata Motors Media",
    reason: null,
  },
  'hyundai-creta': {
    id: 'hyundai-creta',
    model: "Hyundai Creta",
    file: "/vehicles/hyundai-creta.webp",
    status: 'verified',
    sourceUrl: "Local verified catalogue media asset",
    licence: "Editorial / Media Asset",
    attribution: "Hyundai Motor India Media",
    reason: null,
  },
  'mahindra-xuv700': {
    id: 'mahindra-xuv700',
    model: "Mahindra XUV700",
    file: "/vehicles/mahindra-xuv700.webp",
    status: 'verified',
    sourceUrl: "Local verified catalogue media asset",
    licence: "Editorial / Media Asset",
    attribution: "Mahindra & Mahindra Media",
    reason: null,
  },
  'toyota-fortuner': {
    id: 'toyota-fortuner',
    model: "Toyota Fortuner",
    file: "/vehicles/toyota-fortuner.webp",
    status: 'verified',
    sourceUrl: "Local verified catalogue media asset",
    licence: "Editorial / Media Asset",
    attribution: "Toyota Bharat Media",
    reason: null,
  },
  'toyota-camry': {
    id: 'toyota-camry',
    model: "Toyota Camry",
    file: "/vehicles/toyota-camry.webp",
    status: 'verified',
    sourceUrl: "Local verified catalogue media asset",
    licence: "Editorial / Media Asset",
    attribution: "Toyota Bharat Media",
    reason: null,
  },
  'skoda-superb': {
    id: 'skoda-superb',
    model: "Skoda Superb",
    file: "/vehicles/skoda-superb.webp",
    status: 'verified',
    sourceUrl: "Local verified catalogue media asset",
    licence: "Editorial / Media Asset",
    attribution: "Škoda Auto India Media",
    reason: null,
  },
  'bmw-3-series': {
    id: 'bmw-3-series',
    model: "BMW 3 Series",
    file: "/vehicles/bmw-3-series.webp",
    status: 'verified',
    sourceUrl: "Local verified catalogue media asset",
    licence: "Editorial / Media Asset",
    attribution: "BMW India Media",
    reason: null,
  },
  'mercedes-c-class': {
    id: 'mercedes-c-class',
    model: "Mercedes-Benz C-Class",
    file: "/vehicles/mercedes-c-class.webp",
    status: 'verified',
    sourceUrl: "Local verified catalogue media asset",
    licence: "Editorial / Media Asset",
    attribution: "Mercedes-Benz India Media",
    reason: null,
  },
  'audi-a4': {
    id: 'audi-a4',
    model: "Audi A4",
    file: "/vehicles/audi-a4.webp",
    status: 'verified',
    sourceUrl: "Local verified catalogue media asset",
    licence: "Editorial / Media Asset",
    attribution: "Audi India Media",
    reason: null,
  },
  'porsche-macan': {
    id: 'porsche-macan',
    model: "Porsche Macan",
    file: "/vehicles/porsche-macan.webp",
    status: 'verified',
    sourceUrl: "Local verified catalogue media asset",
    licence: "Editorial / Media Asset",
    attribution: "Porsche India Media",
    reason: null,
  },
  'bmw-i4': {
    id: 'bmw-i4',
    model: "BMW i4",
    file: "/vehicles/bmw-i4.webp",
    status: 'verified',
    sourceUrl: "Local verified catalogue media asset",
    licence: "Editorial / Media Asset",
    attribution: "BMW India Media",
    reason: null,
  },
  'maruti-brezza': {
    id: 'maruti-brezza',
    model: "Maruti Suzuki Brezza",
    file: "/vehicles/maruti-brezza.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2022_Maruti_Suzuki_Brezza_ZXi%2B_(India)_front_view_01.png",
    licence: "CC BY 3.0",
    attribution: "DriveSpark",
    reason: null,
  },
  'tata-punch': {
    id: 'tata-punch',
    model: "Tata Punch",
    file: "/vehicles/tata-punch.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2021_Tata_Punch_Creative_(India)_front_view_01.png",
    licence: "CC BY 3.0",
    attribution: "Athira Murali / DriveSpark",
    reason: null,
  },
  'maruti-swift': {
    id: 'maruti-swift',
    model: "Maruti Suzuki Swift",
    file: "/vehicles/maruti-swift.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Suzuki_Swift_(2024)_hybrid_IMG_2582.jpg",
    licence: "CC BY-SA 4.0",
    attribution: "Alexander-93",
    reason: null,
  },
  'maruti-baleno': {
    id: 'maruti-baleno',
    model: "Maruti Suzuki Baleno",
    file: "/vehicles/maruti-baleno.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2016_Suzuki_Baleno_SZ5_Boosterjet_1.0_Front.jpg",
    licence: "CC BY-SA 4.0",
    attribution: "Makizox",
    reason: null,
  },
  'maruti-wagonr': {
    id: 'maruti-wagonr',
    model: "Maruti Suzuki WagonR",
    file: "/vehicles/maruti-wagonr.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2020_Maruti_Suzuki_Wagon_R_VXi_(O)_(India)_front_view.png",
    licence: "CC BY 3.0",
    attribution: "Riding Hub",
    reason: null,
  },
  'maruti-wagonr-cng': {
    id: 'maruti-wagonr-cng',
    model: "Maruti Suzuki WagonR CNG",
    file: "/vehicles/maruti-wagonr.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2020_Maruti_Suzuki_Wagon_R_VXi_(O)_(India)_front_view.png",
    licence: "CC BY 3.0",
    attribution: "Riding Hub (Inherited from Maruti Suzuki WagonR)",
    reason: null,
  },
  'maruti-fronx': {
    id: 'maruti-fronx',
    model: "Maruti Suzuki Fronx",
    file: "/vehicles/maruti-fronx.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2023_Suzuki_Fronx_1.2_Delta%2B_(India)_front_view.png",
    licence: "CC BY 3.0",
    attribution: "HARSHIT 0008",
    reason: null,
  },
  'maruti-ertiga': {
    id: 'maruti-ertiga',
    model: "Maruti Suzuki Ertiga",
    file: "/vehicles/maruti-ertiga.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Suzuki_Ertiga_1.5_GLX_Hybrid_2023_(1).jpg",
    licence: "CC BY-SA 4.0",
    attribution: "Ethan Llamas",
    reason: null,
  },
  'hyundai-venue': {
    id: 'hyundai-venue',
    model: "Hyundai Venue",
    file: "/vehicles/hyundai-venue.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2020_Hyundai_Venue_Ultimate_2019-12-13_2.jpg",
    licence: "CC BY-SA 4.0",
    attribution: "SsmIntrigue",
    reason: null,
  },
  'hyundai-exter': {
    id: 'hyundai-exter',
    model: "Hyundai Exter",
    file: "/vehicles/hyundai-exter.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2023_Hyundai_Exter.jpg",
    licence: "CC BY 4.0",
    attribution: "Dibyam Das",
    reason: null,
  },
  'hyundai-i20': {
    id: 'hyundai-i20',
    model: "Hyundai i20",
    file: "/vehicles/hyundai-i20.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2018_Hyundai_i20_SE_MPi_1.2_Front.jpg",
    licence: "CC BY-SA 4.0",
    attribution: "Vauxford",
    reason: null,
  },
  'hyundai-grand-i10-nios': {
    id: 'hyundai-grand-i10-nios',
    model: "Hyundai Grand i10 NIOS",
    file: "/vehicles/hyundai-grand-i10-nios.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2021_Hyundai_Grand_i10_Nios_1.0AT_Standard_red_front_view_in_Brunei.jpg",
    licence: "CC BY-SA 4.0",
    attribution: "AIMHO'S REBELLION 8490s",
    reason: null,
  },
  'tata-tiago': {
    id: 'tata-tiago',
    model: "Tata Tiago",
    file: "/vehicles/tata-tiago.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2022_Tata_Tiago_XZA%2B_front_20230512.jpg",
    licence: "CC BY-SA 4.0",
    attribution: "Dairokkan9",
    reason: null,
  },
  'tata-altroz': {
    id: 'tata-altroz',
    model: "Tata Altroz",
    file: "/vehicles/tata-altroz.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tata_Altroz_front_20230617.jpg",
    licence: "CC BY-SA 4.0",
    attribution: "Dairokkan9",
    reason: null,
  },
  'mahindra-xuv-3xo': {
    id: 'mahindra-xuv-3xo',
    model: "Mahindra XUV 3XO",
    file: "/vehicles/mahindra-xuv-3xo.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2025_Mahindra_XUV_3XO_AX7L_front.jpg",
    licence: "CC BY-SA 4.0",
    attribution: "LuvsMG481",
    reason: null,
  },
  'mahindra-scorpio-n': {
    id: 'mahindra-scorpio-n',
    model: "Mahindra Scorpio-N",
    file: "/vehicles/mahindra-scorpio-n.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2024_Mahindra_Scorpio_Z8L_front.jpg",
    licence: "CC BY-SA 4.0",
    attribution: "LuvsMG481",
    reason: null,
  },
  'toyota-glanza': {
    id: 'toyota-glanza',
    model: "Toyota Glanza",
    file: "/vehicles/toyota-glanza.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Toyota_Glanza_2022_Facelift.jpg",
    licence: "CC BY-SA 4.0",
    attribution: "AcrobatZ",
    reason: null,
  },
  'toyota-hyryder': {
    id: 'toyota-hyryder',
    model: "Toyota Urban Cruiser Hyryder",
    file: "/vehicles/toyota-hyryder.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2022_Toyota_Urban_Cruiser_Hyryder_V_Hybrid_(India)_front_view.jpg",
    licence: "CC BY 3.0",
    attribution: "DriveSpark",
    reason: null,
  },
  'honda-amaze': {
    id: 'honda-amaze',
    model: "Honda Amaze",
    file: "/vehicles/honda-amaze.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Honda_Amaze_(front).png",
    licence: "CC BY-SA 4.0",
    attribution: "Agratsa",
    reason: null,
  },
  'honda-city': {
    id: 'honda-city',
    model: "Honda City",
    file: "/vehicles/honda-city.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2014_Honda_City_(GM6_MY14)_VTi_sedan_(2015-07-15)_01.jpg",
    licence: "Public domain",
    attribution: "OSX",
    reason: null,
  },
  'kia-sonet': {
    id: 'kia-sonet',
    model: "Kia Sonet",
    file: "/vehicles/kia-sonet.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Kia_Sonet_front_view_(India)_01.png",
    licence: "CC BY 3.0",
    attribution: "DriveSpark",
    reason: null,
  },
  'kia-seltos': {
    id: 'kia-seltos',
    model: "Kia Seltos",
    file: "/vehicles/kia-seltos.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Kia_Seltos_001.jpg",
    licence: "CC BY-SA 4.0",
    attribution: "JustAnotherCarDesigner",
    reason: null,
  },
  'tata-tiago-ev': {
    id: 'tata-tiago-ev',
    model: "Tata Tiago EV",
    file: "/vehicles/tata-tiago-ev.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2022_Tata_Tiago_EV_IB_XZ%2B_Tech_LR_front_view.png",
    licence: "CC BY 3.0",
    attribution: "DriveSpark",
    reason: null,
  },
  'tata-punch-ev': {
    id: 'tata-punch-ev',
    model: "Tata Punch EV",
    file: "/vehicles/tata-punch-ev.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tata_punch.ev.jpg",
    licence: "CC0 / Public Domain",
    attribution: "VideshiBhaktNRI",
    reason: null,
  },
  'tata-nexon-ev': {
    id: 'tata-nexon-ev',
    model: "Tata Nexon EV",
    file: "/vehicles/tata-nexon-ev.webp",
    status: 'verified',
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2020_Tata_Nexon_EV_(India)_front_view.png",
    licence: "CC BY 3.0",
    attribution: "DriveSpark",
    reason: null,
  },
  'mg-windsor-ev': {
    id: 'mg-windsor-ev',
    model: "MG Windsor EV",
    file: "/vehicles/mg-windsor-ev.webp",
    status: 'verified',
    sourceUrl: "User-supplied verified MG Motor India launch press asset",
    licence: "Official Press / Media Asset",
    attribution: "JSW MG Motor India Media",
    reason: null,
  },
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
