import fs from 'fs';
const text = fs.readFileSync('C:\\Users\\ag921\\.gemini\\antigravity-ide\\brain\\56d9bcd1-b5bc-4ebd-aa86-95473457f660\\.system_generated\\steps\\175\\content.md', 'utf8');
const urls = text.match(/https:\/\/stimg\.cardekho\.com\/images\/[^\s"\'<>]+/g) || [];
const unique = [...new Set(urls)];
console.log('Total Cardekho images found:', unique.length);
console.log(unique.filter(u => u.toLowerCase().includes('carexteriorimages') || u.toLowerCase().includes('windsor')).slice(0, 30));
