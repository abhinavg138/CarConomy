import fs from 'fs';

let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

const replacements = [
  ['/vehicles/tata-nexon.jpg', '/vehicles/tata-nexon.webp'],
  ['/vehicles/maruti-brezza.jpg', '/vehicles/maruti-brezza.webp'],
  ['/vehicles/tata-punch.jpg', '/vehicles/tata-punch.webp'],
  ['/vehicles/maruti-swift.jpg', '/vehicles/maruti-swift.webp'],
  ['/vehicles/maruti-baleno.jpg', '/vehicles/maruti-baleno.webp'],
  ['/vehicles/maruti-wagonr.jpg', '/vehicles/maruti-wagonr.webp'],
  ['/vehicles/maruti-wagonr-cng.jpg', '/vehicles/maruti-wagonr.webp'],
  ['/vehicles/maruti-fronx.jpg', '/vehicles/maruti-fronx.webp'],
  ['/vehicles/maruti-ertiga.jpg', '/vehicles/maruti-ertiga.webp'],
  ['/vehicles/hyundai-creta.jpg', '/vehicles/hyundai-creta.webp'],
  ['/vehicles/hyundai-venue.jpg', '/vehicles/hyundai-venue.webp'],
  ['/vehicles/hyundai-exter.jpg', '/vehicles/hyundai-exter.webp'],
  ['/vehicles/hyundai-i20.jpg', '/vehicles/hyundai-i20.webp'],
  ['/vehicles/hyundai-grand-i10-nios.jpg', '/vehicles/hyundai-grand-i10-nios.webp'],
  ['/vehicles/tata-tiago.jpg', '/vehicles/tata-tiago.webp'],
  ['/vehicles/tata-altroz.jpg', '/vehicles/tata-altroz.webp'],
  ['/vehicles/mahindra-xuv-3xo.jpg', '/vehicles/mahindra-xuv-3xo.webp'],
  ['/vehicles/mahindra-scorpio-n.jpg', '/vehicles/mahindra-scorpio-n.webp'],
  ['/vehicles/mahindra-xuv700.png', '/vehicles/mahindra-xuv700.webp'],
  ['/vehicles/toyota-glanza.jpg', '/vehicles/toyota-glanza.webp'],
  ['/vehicles/toyota-hyryder.jpg', '/vehicles/toyota-hyryder.webp'],
  ['/vehicles/honda-amaze.jpg', '/vehicles/honda-amaze.webp'],
  ['/vehicles/honda-city.jpg', '/vehicles/honda-city.webp'],
  ['/vehicles/kia-sonet.jpg', '/vehicles/kia-sonet.webp'],
  ['/vehicles/kia-seltos.jpg', '/vehicles/kia-seltos.webp'],
  ['/vehicles/tata-tiago-ev.jpg', '/vehicles/tata-tiago-ev.webp'],
  ['/vehicles/tata-punch-ev.jpg', '/vehicles/tata-punch-ev.webp'],
  ['/vehicles/tata-nexon-ev.jpg', '/vehicles/tata-nexon-ev.webp'],
  ['/vehicles/toyota-fortuner.jpg', '/vehicles/toyota-fortuner.webp'],
  ['/vehicles/toyota-camry.jpg', '/vehicles/toyota-camry.webp'],
  ['/vehicles/skoda-superb.jpg', '/vehicles/skoda-superb.webp'],
  ['/vehicles/bmw-3-series.jpg', '/vehicles/bmw-3-series.webp'],
  ['/vehicles/mercedes-c-class.jpg', '/vehicles/mercedes-c-class.webp'],
  ['/vehicles/audi-a4.jpg', '/vehicles/audi-a4.webp'],
  ['/vehicles/porsche-macan.jpg', '/vehicles/porsche-macan.webp'],
  ['/vehicles/bmw-i4.jpg', '/vehicles/bmw-i4.webp'],
];

for (const [oldPath, newPath] of replacements) {
  content = content.replaceAll(oldPath, newPath);
}

// Remove mock placeholder for mg-windsor-ev so it gets labelled neutral fallback
content = content.replace(
  /id:\s*'mg-windsor-ev',\s*make:\s*'MG',\s*model:\s*'Windsor EV',\s*image:\s*'[^\']*',\s*images:\s*\{[^}]*\},/,
  "id: 'mg-windsor-ev',\n    make: 'MG',\n    model: 'Windsor EV',"
);

fs.writeFileSync('src/data/mockData.ts', content, 'utf8');
console.log('Successfully updated mockData.ts');
