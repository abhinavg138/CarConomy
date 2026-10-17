import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const VEHICLES_TO_FETCH = [
  { id: 'maruti-brezza', query: 'Maruti Suzuki Brezza 2022 OR Brezza front', preferred: 'Brezza' },
  { id: 'tata-punch', query: 'Tata Punch front OR Tata Punch exterior', preferred: 'Punch' },
  { id: 'maruti-swift', query: 'Suzuki Swift 2024 front OR Maruti Swift exterior', preferred: 'Swift' },
  { id: 'maruti-baleno', query: 'Suzuki Baleno 2022 front OR Maruti Baleno', preferred: 'Baleno' },
  { id: 'maruti-wagonr', query: 'Maruti Wagon R 2019 OR Suzuki Wagon R front', preferred: 'Wagon' },
  { id: 'maruti-fronx', query: 'Suzuki Fronx OR Maruti Suzuki Fronx', preferred: 'Fronx' },
  { id: 'maruti-ertiga', query: 'Suzuki Ertiga 2019 OR Maruti Ertiga front', preferred: 'Ertiga' },
  { id: 'hyundai-venue', query: 'Hyundai Venue front exterior', preferred: 'Venue' },
  { id: 'hyundai-exter', query: 'Hyundai Exter front OR Hyundai Exter exterior', preferred: 'Exter' },
  { id: 'hyundai-i20', query: 'Hyundai i20 2020 front OR Hyundai i20 exterior', preferred: 'i20' },
  { id: 'hyundai-grand-i10-nios', query: 'Hyundai Grand i10 Nios OR Hyundai i10 Nios', preferred: 'Nios' },
  { id: 'tata-tiago', query: 'Tata Tiago front OR Tata Tiago exterior', preferred: 'Tiago' },
  { id: 'tata-altroz', query: 'Tata Altroz front OR Tata Altroz exterior', preferred: 'Altroz' },
  { id: 'mahindra-xuv-3xo', query: 'Mahindra XUV 3XO OR Mahindra XUV300 front', preferred: 'XUV' },
  { id: 'mahindra-scorpio-n', query: 'Mahindra Scorpio-N front OR Mahindra Scorpio N', preferred: 'Scorpio' },
  { id: 'toyota-glanza', query: 'Toyota Glanza front OR Toyota Glanza 2022', preferred: 'Glanza' },
  { id: 'toyota-hyryder', query: 'Toyota Urban Cruiser Hyryder OR Toyota Hyryder', preferred: 'Hyryder' },
  { id: 'honda-amaze', query: 'Honda Amaze 2018 front OR Honda Amaze exterior', preferred: 'Amaze' },
  { id: 'honda-city', query: 'Honda City 2020 front OR Honda City sedan exterior', preferred: 'City' },
  { id: 'kia-sonet', query: 'Kia Sonet front OR Kia Sonet exterior', preferred: 'Sonet' },
  { id: 'kia-seltos', query: 'Kia Seltos front OR Kia Seltos 2023', preferred: 'Seltos' },
  { id: 'tata-tiago-ev', query: 'Tata Tiago EV front OR Tata Tiago EV exterior', preferred: 'Tiago' },
  { id: 'tata-punch-ev', query: 'Tata Punch EV front OR Tata Punch EV exterior', preferred: 'Punch' },
  { id: 'tata-nexon-ev', query: 'Tata Nexon EV front OR Tata Nexon EV exterior', preferred: 'Nexon' },
  { id: 'mg-windsor-ev', query: 'MG Windsor EV OR Wuling Cloud EV front', preferred: 'Windsor' },
];

async function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url|size|extmetadata|mime&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'CarconomyResearch/1.0 (contact@carconomy.in)' } });
  const data = await res.json();
  const pages = data.query?.pages || {};
  const candidates = [];
  for (const k in pages) {
    const p = pages[k];
    const info = p.imageinfo?.[0];
    if (!info) continue;
    const title = p.title || '';
    const mime = info.mime || '';
    if (!mime.startsWith('image/')) continue;
    if (title.toLowerCase().includes('interior') || title.toLowerCase().includes('dashboard') || title.toLowerCase().includes('engine') || title.toLowerCase().includes('rear') || title.toLowerCase().includes('wheel')) {
      continue;
    }
    const width = info.width || 0;
    const height = info.height || 0;
    if (width < 600 || height < 400) continue; // Skip thumbnails
    const meta = info.extmetadata || {};
    candidates.push({
      title,
      url: info.url,
      width,
      height,
      license: meta.LicenseShortName?.value || meta.License?.value || 'CC BY-SA / PD',
      artist: meta.Artist?.value?.replace(/<[^>]+>/g, '').trim() || 'Wikimedia Commons contributor',
      description: meta.ImageDescription?.value?.replace(/<[^>]+>/g, '').trim() || title,
    });
  }
  return candidates;
}

async function run() {
  console.log('Searching Wikimedia Commons for vehicle candidates...');
  for (const item of VEHICLES_TO_FETCH) {
    try {
      const candidates = await searchCommons(item.query);
      console.log(`\n[${item.id}] Query: "${item.query}" -> Found ${candidates.length} candidates`);
      if (candidates.length > 0) {
        // Sort by width / quality
        candidates.sort((a, b) => b.width - a.width);
        const top = candidates[0];
        console.log(`  Top candidate: ${top.title}`);
        console.log(`  URL: ${top.url}`);
        console.log(`  License: ${top.license} | Artist: ${top.artist}`);
      } else {
        console.log(`  No candidate found on first pass.`);
      }
    } catch (err) {
      console.error(`  Error searching for ${item.id}:`, err.message);
    }
  }
}

run();
