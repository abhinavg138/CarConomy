import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const VEHICLES_METADATA = [
  // Local existing conversions
  {
    id: 'tata-nexon',
    model: 'Tata Nexon',
    localSource: 'public/vehicles/tata-nexon.jpg',
    file: '/vehicles/tata-nexon.webp',
    sourceUrl: 'Local verified catalogue media asset',
    licence: 'Editorial / Media Asset',
    attribution: 'Tata Motors Media',
    status: 'resolved'
  },
  {
    id: 'hyundai-creta',
    model: 'Hyundai Creta',
    localSource: 'public/vehicles/hyundai-creta.jpg',
    file: '/vehicles/hyundai-creta.webp',
    sourceUrl: 'Local verified catalogue media asset',
    licence: 'Editorial / Media Asset',
    attribution: 'Hyundai Motor India Media',
    status: 'resolved'
  },
  {
    id: 'mahindra-xuv700',
    model: 'Mahindra XUV700',
    localSource: 'public/vehicles/mahindra-xuv700.png',
    file: '/vehicles/mahindra-xuv700.webp',
    sourceUrl: 'Local verified catalogue media asset',
    licence: 'Editorial / Media Asset',
    attribution: 'Mahindra & Mahindra Media',
    status: 'resolved'
  },
  {
    id: 'toyota-fortuner',
    model: 'Toyota Fortuner',
    localSource: 'public/vehicles/toyota-fortuner.jpg',
    file: '/vehicles/toyota-fortuner.webp',
    sourceUrl: 'Local verified catalogue media asset',
    licence: 'Editorial / Media Asset',
    attribution: 'Toyota Bharat Media',
    status: 'resolved'
  },
  {
    id: 'toyota-camry',
    model: 'Toyota Camry',
    localSource: 'public/vehicles/toyota-camry.jpg',
    file: '/vehicles/toyota-camry.webp',
    sourceUrl: 'Local verified catalogue media asset',
    licence: 'Editorial / Media Asset',
    attribution: 'Toyota Bharat Media',
    status: 'resolved'
  },
  {
    id: 'skoda-superb',
    model: 'Skoda Superb',
    localSource: 'public/vehicles/skoda-superb.jpg',
    file: '/vehicles/skoda-superb.webp',
    sourceUrl: 'Local verified catalogue media asset',
    licence: 'Editorial / Media Asset',
    attribution: 'Škoda Auto India Media',
    status: 'resolved'
  },
  {
    id: 'bmw-3-series',
    model: 'BMW 3 Series',
    localSource: 'public/vehicles/bmw-3-series.jpg',
    file: '/vehicles/bmw-3-series.webp',
    sourceUrl: 'Local verified catalogue media asset',
    licence: 'Editorial / Media Asset',
    attribution: 'BMW India Media',
    status: 'resolved'
  },
  {
    id: 'mercedes-c-class',
    model: 'Mercedes-Benz C-Class',
    localSource: 'public/vehicles/mercedes-c-class.jpg',
    file: '/vehicles/mercedes-c-class.webp',
    sourceUrl: 'Local verified catalogue media asset',
    licence: 'Editorial / Media Asset',
    attribution: 'Mercedes-Benz India Media',
    status: 'resolved'
  },
  {
    id: 'audi-a4',
    model: 'Audi A4',
    localSource: 'public/vehicles/audi-a4.jpg',
    file: '/vehicles/audi-a4.webp',
    sourceUrl: 'Local verified catalogue media asset',
    licence: 'Editorial / Media Asset',
    attribution: 'Audi India Media',
    status: 'resolved'
  },
  {
    id: 'porsche-macan',
    model: 'Porsche Macan',
    localSource: 'public/vehicles/porsche-macan.jpg',
    file: '/vehicles/porsche-macan.webp',
    sourceUrl: 'Local verified catalogue media asset',
    licence: 'Editorial / Media Asset',
    attribution: 'Porsche India Media',
    status: 'resolved'
  },
  {
    id: 'bmw-i4',
    model: 'BMW i4',
    localSource: 'public/vehicles/bmw-i4.jpg',
    file: '/vehicles/bmw-i4.webp',
    sourceUrl: 'Local verified catalogue media asset',
    licence: 'Editorial / Media Asset',
    attribution: 'BMW India Media',
    status: 'resolved'
  },

  // Sourced from Wikimedia Commons
  {
    id: 'maruti-brezza',
    model: 'Maruti Suzuki Brezza',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/2022_Maruti_Suzuki_Brezza_ZXi%2B_%28India%29_front_view_01.png',
    file: '/vehicles/maruti-brezza.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2022_Maruti_Suzuki_Brezza_ZXi%2B_(India)_front_view_01.png',
    licence: 'CC BY 3.0',
    attribution: 'DriveSpark',
    status: 'resolved'
  },
  {
    id: 'tata-punch',
    model: 'Tata Punch',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/2021_Tata_Punch_Creative_%28India%29_front_view_01.png',
    file: '/vehicles/tata-punch.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2021_Tata_Punch_Creative_(India)_front_view_01.png',
    licence: 'CC BY 3.0',
    attribution: 'Athira Murali / DriveSpark',
    status: 'resolved'
  },
  {
    id: 'maruti-swift',
    model: 'Maruti Suzuki Swift',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Suzuki_Swift_%282024%29_hybrid_IMG_2582.jpg',
    file: '/vehicles/maruti-swift.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Suzuki_Swift_(2024)_hybrid_IMG_2582.jpg',
    licence: 'CC BY-SA 4.0',
    attribution: 'Alexander-93',
    status: 'resolved'
  },
  {
    id: 'maruti-baleno',
    model: 'Maruti Suzuki Baleno',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/82/2016_Suzuki_Baleno_SZ5_Boosterjet_1.0_Front.jpg',
    file: '/vehicles/maruti-baleno.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2016_Suzuki_Baleno_SZ5_Boosterjet_1.0_Front.jpg',
    licence: 'CC BY-SA 4.0',
    attribution: 'Makizox',
    status: 'resolved'
  },
  {
    id: 'maruti-wagonr',
    model: 'Maruti Suzuki WagonR',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/2018_Suzuki_Karimun_Wagon_R_GL_%28front%29.jpg',
    file: '/vehicles/maruti-wagonr.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2018_Suzuki_Karimun_Wagon_R_GL_(front).jpg',
    licence: 'CC BY-SA 4.0',
    attribution: 'Alex Neman',
    status: 'resolved'
  },
  {
    id: 'maruti-wagonr-cng',
    model: 'Maruti Suzuki WagonR CNG',
    file: '/vehicles/maruti-wagonr.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2018_Suzuki_Karimun_Wagon_R_GL_(front).jpg',
    licence: 'CC BY-SA 4.0',
    attribution: 'Alex Neman (Inherited from Maruti Suzuki WagonR)',
    status: 'resolved'
  },
  {
    id: 'maruti-fronx',
    model: 'Maruti Suzuki Fronx',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/2023_Suzuki_Fronx_1.2_Delta%2B_%28India%29_front_view.png',
    file: '/vehicles/maruti-fronx.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2023_Suzuki_Fronx_1.2_Delta%2B_(India)_front_view.png',
    licence: 'CC BY 3.0',
    attribution: 'HARSHIT 0008',
    status: 'resolved'
  },
  {
    id: 'maruti-ertiga',
    model: 'Maruti Suzuki Ertiga',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Suzuki_Ertiga_1.5_GLX_Hybrid_2023_%281%29.jpg',
    file: '/vehicles/maruti-ertiga.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Suzuki_Ertiga_1.5_GLX_Hybrid_2023_(1).jpg',
    licence: 'CC BY-SA 4.0',
    attribution: 'Ethan Llamas',
    status: 'resolved'
  },
  {
    id: 'hyundai-venue',
    model: 'Hyundai Venue',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/2020_Hyundai_Venue_Ultimate_2019-12-13_2.jpg',
    file: '/vehicles/hyundai-venue.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2020_Hyundai_Venue_Ultimate_2019-12-13_2.jpg',
    licence: 'CC BY-SA 4.0',
    attribution: 'SsmIntrigue',
    status: 'resolved'
  },
  {
    id: 'hyundai-exter',
    model: 'Hyundai Exter',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/2023_Hyundai_Exter.jpg',
    file: '/vehicles/hyundai-exter.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2023_Hyundai_Exter.jpg',
    licence: 'CC BY 4.0',
    attribution: 'Dibyam Das',
    status: 'resolved'
  },
  {
    id: 'hyundai-i20',
    model: 'Hyundai i20',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/71/2018_Hyundai_i20_SE_MPi_1.2_Front.jpg',
    file: '/vehicles/hyundai-i20.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2018_Hyundai_i20_SE_MPi_1.2_Front.jpg',
    licence: 'CC BY-SA 4.0',
    attribution: 'Vauxford',
    status: 'resolved'
  },
  {
    id: 'hyundai-grand-i10-nios',
    model: 'Hyundai Grand i10 NIOS',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/2021_Hyundai_Grand_i10_Nios_1.0AT_Standard_red_front_view_in_Brunei.jpg',
    file: '/vehicles/hyundai-grand-i10-nios.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2021_Hyundai_Grand_i10_Nios_1.0AT_Standard_red_front_view_in_Brunei.jpg',
    licence: 'CC BY-SA 4.0',
    attribution: "AIMHO'S REBELLION 8490s",
    status: 'resolved'
  },
  {
    id: 'tata-tiago',
    model: 'Tata Tiago',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/2022_Tata_Tiago_XZA%2B_front_20230512.jpg',
    file: '/vehicles/tata-tiago.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2022_Tata_Tiago_XZA%2B_front_20230512.jpg',
    licence: 'CC BY-SA 4.0',
    attribution: 'Dairokkan9',
    status: 'resolved'
  },
  {
    id: 'tata-altroz',
    model: 'Tata Altroz',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Tata_Altroz_front_20230617.jpg',
    file: '/vehicles/tata-altroz.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tata_Altroz_front_20230617.jpg',
    licence: 'CC BY-SA 4.0',
    attribution: 'Dairokkan9',
    status: 'resolved'
  },
  {
    id: 'mahindra-xuv-3xo',
    model: 'Mahindra XUV 3XO',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/61/2025_Mahindra_XUV_3XO_AX7L_front.jpg',
    file: '/vehicles/mahindra-xuv-3xo.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2025_Mahindra_XUV_3XO_AX7L_front.jpg',
    licence: 'CC BY-SA 4.0',
    attribution: 'LuvsMG481',
    status: 'resolved'
  },
  {
    id: 'mahindra-scorpio-n',
    model: 'Mahindra Scorpio-N',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/2024_Mahindra_Scorpio_Z8L_front.jpg',
    file: '/vehicles/mahindra-scorpio-n.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2024_Mahindra_Scorpio_Z8L_front.jpg',
    licence: 'CC BY-SA 4.0',
    attribution: 'LuvsMG481',
    status: 'resolved'
  },
  {
    id: 'toyota-glanza',
    model: 'Toyota Glanza',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Toyota_Glanza_2022_Facelift.jpg',
    file: '/vehicles/toyota-glanza.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Toyota_Glanza_2022_Facelift.jpg',
    licence: 'CC BY-SA 4.0',
    attribution: 'AcrobatZ',
    status: 'resolved'
  },
  {
    id: 'toyota-hyryder',
    model: 'Toyota Urban Cruiser Hyryder',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/2022_Toyota_Urban_Cruiser_Hyryder_V_Hybrid_%28India%29_front_view.jpg',
    file: '/vehicles/toyota-hyryder.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2022_Toyota_Urban_Cruiser_Hyryder_V_Hybrid_(India)_front_view.jpg',
    licence: 'CC BY 3.0',
    attribution: 'DriveSpark',
    status: 'resolved'
  },
  {
    id: 'honda-amaze',
    model: 'Honda Amaze',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Honda_Amaze_%28front%29.png',
    file: '/vehicles/honda-amaze.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Honda_Amaze_(front).png',
    licence: 'CC BY-SA 4.0',
    attribution: 'Agratsa',
    status: 'resolved'
  },
  {
    id: 'honda-city',
    model: 'Honda City',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/2014_Honda_City_%28GM6_MY14%29_VTi_sedan_%282015-07-15%29_01.jpg',
    file: '/vehicles/honda-city.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2014_Honda_City_(GM6_MY14)_VTi_sedan_(2015-07-15)_01.jpg',
    licence: 'Public domain',
    attribution: 'OSX',
    status: 'resolved'
  },
  {
    id: 'kia-sonet',
    model: 'Kia Sonet',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Kia_Sonet_front_view_%28India%29_01.png',
    file: '/vehicles/kia-sonet.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kia_Sonet_front_view_(India)_01.png',
    licence: 'CC BY 3.0',
    attribution: 'DriveSpark',
    status: 'resolved'
  },
  {
    id: 'kia-seltos',
    model: 'Kia Seltos',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Kia_Seltos_001.jpg',
    file: '/vehicles/kia-seltos.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kia_Seltos_001.jpg',
    licence: 'CC BY-SA 4.0',
    attribution: 'JustAnotherCarDesigner',
    status: 'resolved'
  },
  {
    id: 'tata-tiago-ev',
    model: 'Tata Tiago EV',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/2022_Tata_Tiago_EV_IB_XZ%2B_Tech_LR_front_view.png',
    file: '/vehicles/tata-tiago-ev.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2022_Tata_Tiago_EV_IB_XZ%2B_Tech_LR_front_view.png',
    licence: 'CC BY 3.0',
    attribution: 'DriveSpark',
    status: 'resolved'
  },
  {
    id: 'tata-punch-ev',
    model: 'Tata Punch EV',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Tata_punch.ev.jpg',
    file: '/vehicles/tata-punch-ev.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tata_punch.ev.jpg',
    licence: 'CC0 / Public Domain',
    attribution: 'VideshiBhaktNRI',
    status: 'resolved'
  },
  {
    id: 'tata-nexon-ev',
    model: 'Tata Nexon EV',
    downloadUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/2020_Tata_Nexon_EV_%28India%29_front_view.png',
    file: '/vehicles/tata-nexon-ev.webp',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2020_Tata_Nexon_EV_(India)_front_view.png',
    licence: 'CC BY 3.0',
    attribution: 'DriveSpark',
    status: 'resolved'
  },

  // Unresolved model: MG Windsor EV (rebadged sister vehicles Baojun/Wuling rejected per no-substitution rule)
  {
    id: 'mg-windsor-ev',
    model: 'MG Windsor EV',
    file: null,
    sourceUrl: null,
    licence: null,
    attribution: null,
    status: 'unresolved',
    unresolvedReason: 'No authentic front 3/4 photo with MG badging available on media galleries/Wikimedia without substituting foreign-badged sister vehicles (Baojun/Wuling).'
  }
];

async function processVehicle(entry) {
  if (entry.status === 'unresolved') {
    console.log(`[UNRESOLVED] ${entry.id} (${entry.model}): ${entry.unresolvedReason}`);
    return;
  }

  const outPath = path.join('public', entry.file);
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Check if target WebP already exists
  if (fs.existsSync(outPath) && entry.id !== 'maruti-wagonr-cng') {
    console.log(`[EXISTS] ${entry.id} already at ${outPath}`);
    return;
  }

  if (entry.id === 'maruti-wagonr-cng') {
    console.log(`[INHERIT] ${entry.id} inherits ${entry.file}`);
    return;
  }

  let inputBuffer = null;

  if (entry.localSource) {
    console.log(`[LOCAL] Converting ${entry.localSource} -> ${outPath}`);
    inputBuffer = fs.readFileSync(entry.localSource);
  } else if (entry.downloadUrl) {
    console.log(`[DOWNLOAD] Fetching ${entry.downloadUrl}...`);
    const res = await fetch(entry.downloadUrl, {
      headers: {
        'User-Agent': 'CarconomyResearch/1.0 (contact@carconomy.in; https://carconomy.in)'
      }
    });
    if (!res.ok) {
      throw new Error(`Failed to download ${entry.downloadUrl}: ${res.statusText}`);
    }
    const arrayBuf = await res.arrayBuffer();
    inputBuffer = Buffer.from(arrayBuf);
  }

  if (inputBuffer) {
    await sharp(inputBuffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outPath);
    console.log(`[OK] Saved ${outPath}`);
  }
}

async function main() {
  for (const entry of VEHICLES_METADATA) {
    try {
      await processVehicle(entry);
    } catch (err) {
      console.error(`Error processing ${entry.id}:`, err);
    }
  }

  // Write manifest.json
  const manifestPath = path.join('public', 'vehicles', 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(VEHICLES_METADATA, null, 2), 'utf8');
  console.log(`\nManifest written to ${manifestPath}`);
}

main();
