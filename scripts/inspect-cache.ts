
import fs from 'fs';
import path from 'path';

const cacheDir = path.resolve(process.cwd(), 'data/cache');
const files = fs.readdirSync(cacheDir).filter(f => f.endsWith('.json'));

if (files.length === 0) {
      console.log('No cache files found.');
      process.exit(0);
}

const filePath = path.join(cacheDir, files[0]);
console.log(`Reading ${filePath}...`);

const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const p = data.info.participants[0];

console.log('--- Participant Keys ---');
console.log(Object.keys(p).sort().join(', '));

console.log('\n--- Specific Stats ---');
console.log('Gold:', p.goldEarned);
console.log('Vision:', p.visionScore, 'Wards Placed:', p.wardsPlaced, 'Wards Killed:', p.wardsKilled);
console.log('Damage:', p.totalDamageDealtToChampions);
console.log('Runes:', JSON.stringify(p.perks, null, 2));

console.log('\n--- Team Keys ---');
console.log(Object.keys(data.info.teams[0]).sort().join(', '));
console.log('Objectives:', JSON.stringify(data.info.teams[0].objectives, null, 2));
