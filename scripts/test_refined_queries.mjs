import fs from 'fs';

const queries = [
  { id: 'maruti-brezza', search: '"Maruti Suzuki Brezza" OR "Vitara Brezza"' },
  { id: 'tata-punch', search: '"Tata Punch"' },
  { id: 'maruti-swift', search: '"Suzuki Swift" 2024 OR "Maruti Swift"' },
  { id: 'maruti-baleno', search: '"Suzuki Baleno" OR "Maruti Baleno"' },
  { id: 'maruti-wagonr', search: '"Maruti Wagon" OR "Wagon R"' },
  { id: 'maruti-fronx', search: '"Suzuki Fronx"' },
  { id: 'maruti-ertiga', search: '"Suzuki Ertiga"' },
  { id: 'hyundai-venue', search: '"Hyundai Venue"' },
  { id: 'hyundai-exter', search: '"Hyundai Exter"' },
  { id: 'hyundai-i20', search: '"Hyundai i20"' },
  { id: 'hyundai-grand-i10-nios', search: '"Grand i10" OR "i10 Nios"' },
  { id: 'tata-tiago', search: '"Tata Tiago"' },
  { id: 'tata-altroz', search: '"Tata Altroz"' },
  { id: 'mahindra-xuv-3xo', search: '"XUV 3XO" OR "XUV300"' },
  { id: 'mahindra-scorpio-n', search: '"Scorpio-N" OR "Scorpio N"' },
  { id: 'toyota-glanza', search: '"Toyota Glanza"' },
  { id: 'toyota-hyryder', search: '"Urban Cruiser Hyryder" OR "Hyryder"' },
  { id: 'honda-amaze', search: '"Honda Amaze"' },
  { id: 'honda-city', search: '"Honda City" sedan' },
  { id: 'kia-sonet', search: '"Kia Sonet"' },
  { id: 'kia-seltos', search: '"Kia Seltos"' },
  { id: 'tata-tiago-ev', search: '"Tiago EV"' },
  { id: 'tata-punch-ev', search: '"Punch EV"' },
  { id: 'tata-nexon-ev', search: '"Nexon EV"' },
  { id: 'mg-windsor-ev', search: '"Cloud EV" OR "Windsor EV"' },
];

async function check() {
  for (const q of queries) {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q.search)}&gsrnamespace=6&prop=imageinfo&iiprop=url|size|extmetadata&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': 'CarconomyResearch/1.0 (contact@carconomy.in)' } });
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    console.log(`=== ${q.id} (query: ${q.search}) ===`);
    for (const p of pages.slice(0, 4)) {
      const info = p.imageinfo?.[0];
      if (!info) continue;
      const meta = info.extmetadata || {};
      console.log(`- ${p.title} (${info.width}x${info.height})`);
      console.log(`  URL: ${info.url}`);
      console.log(`  License: ${meta.LicenseShortName?.value || 'unknown'} | Artist: ${meta.Artist?.value?.replace(/<[^>]+>/g, '').trim() || 'unknown'}`);
    }
  }
}

check();
