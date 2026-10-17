import fs from 'fs';

const targeted = [
  { id: 'hyundai-grand-i10-nios', search: '"Grand i10 Nios" OR "i10 Nios" OR "Grand i10"' },
  { id: 'mahindra-scorpio-n', search: '"Scorpio-N" OR "Scorpio N" OR "Mahindra Scorpio"' },
  { id: 'maruti-wagonr', search: '"Maruti Suzuki Wagon R" OR "Maruti Wagon R"' },
  { id: 'maruti-swift', search: '"Maruti Suzuki Swift" OR "Maruti Swift"' },
  { id: 'maruti-brezza', search: '"Maruti Brezza" OR "Maruti Suzuki Brezza" 2022' },
  { id: 'maruti-baleno', search: '"Maruti Baleno" OR "Maruti Suzuki Baleno"' },
  { id: 'mg-windsor-ev', search: '"MG Windsor" OR "Windsor EV"' },
  { id: 'toyota-glanza', search: '"Toyota Glanza"' },
  { id: 'honda-city', search: '"Honda City" (India OR 2020 OR 2021 OR 2022 OR 2023)' },
  { id: 'tata-nexon-ev', search: '"Nexon EV" OR "Tata Nexon EV"' }
];

async function run() {
  for (const item of targeted) {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(item.search)}&gsrnamespace=6&prop=imageinfo&iiprop=url|size|extmetadata&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': 'CarconomyResearch/1.0 (contact@carconomy.in)' } });
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    console.log(`\n=== ${item.id} ===`);
    if (pages.length === 0) {
      console.log('No results.');
      continue;
    }
    for (const p of pages.slice(0, 5)) {
      const info = p.imageinfo?.[0];
      if (!info) continue;
      const meta = info.extmetadata || {};
      console.log(`- ${p.title} (${info.width}x${info.height})`);
      console.log(`  URL: ${info.url}`);
      console.log(`  License: ${meta.LicenseShortName?.value || 'unknown'} | Artist: ${meta.Artist?.value?.replace(/<[^>]+>/g, '').trim() || 'unknown'}`);
    }
  }
}

run();
