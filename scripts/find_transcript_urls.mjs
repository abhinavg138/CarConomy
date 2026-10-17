import fs from 'fs';
const transcript = fs.readFileSync('C:\\Users\\ag921\\.gemini\\antigravity-ide\\brain\\56d9bcd1-b5bc-4ebd-aa86-95473457f660\\.system_generated\\logs\\transcript_full.jsonl', 'utf8');

const matches = transcript.match(/https?:\/\/[^\s"\'<>]+(?:jpg|png|webp|jpeg)/gi) || [];
const unique = [...new Set(matches)];
console.log('Images mentioned in transcript:');
console.log(unique.filter(u => u.toLowerCase().includes('windsor') || u.toLowerCase().includes('acko') || u.toLowerCase().includes('cardekho') || u.toLowerCase().includes('carwale')));
