import fs from 'fs';
import path from 'path';
import { processMatches } from '../src/lib/stats-processor';

const CACHE_DIR = path.join(process.cwd(), 'data', 'cache');

async function testStats() {
      console.log('Starting Stats Verification...');

      // Get all files in cache
      const files = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith('.json'));

      if (files.length === 0) {
            console.error('No cached matches found. Please run the app and fetch some matches first.');
            return;
      }

      console.log(`Found ${files.length} cached matches.`);

      // Load matches
      const matches = [];
      for (const file of files) {
            try {
                  const content = JSON.parse(fs.readFileSync(path.join(CACHE_DIR, file), 'utf-8'));
                  matches.push(content);
            } catch (e) {
                  console.error(`Failed to parse ${file}`, e);
            }
      }

      // Find the most frequent PUUID (likely the main user)
      const puuidCounts: Record<string, number> = {};

      for (const match of matches) {
            if (!match.info?.participants) continue;
            for (const p of match.info.participants) {
                  puuidCounts[p.puuid] = (puuidCounts[p.puuid] || 0) + 1;
            }
      }

      let targetPuuid = '';
      let maxCount = 0;
      for (const [puuid, count] of Object.entries(puuidCounts)) {
            if (count > maxCount) {
                  maxCount = count;
                  targetPuuid = puuid;
            }
      }

      if (!targetPuuid) {
            console.error('Could not determine a target PUUID.');
            return;
      }

      console.log(`Identified Main User PUUID: ${targetPuuid} (${maxCount} games)`);

      try {
            const stats = processMatches(matches, targetPuuid);

            console.log('---------------------------------------------------');
            console.log('STATS GENERATED SUCCESSFULLY');
            console.log('---------------------------------------------------');
            console.log(`Total Games: ${stats.totalGames}`);
            console.log(`Winrate: ${stats.winrate.toFixed(1)}%`);
            console.log(`KDA: ${stats.kda.toFixed(2)}`);
            console.log(`First Bloods: ${stats.combat.firstBloods}`);
            console.log(`Pentas: ${stats.totalMultiKills.penta}`);
            console.log(`Dragons: ${stats.objectives.dragons}`);
            console.log(`Scuttles: ${stats.objectives.scuttles}`);
            console.log(`Unique Teammates: ${stats.social.uniqueTeammates}`);

            if (stats.best.bestFriend.name) {
                  console.log(`Best Friend: ${stats.best.bestFriend.name} (${stats.best.bestFriend.wins} wins)`);
            }
            if (stats.nemesis.worstEnemy.name) {
                  console.log(`Nemesis: ${stats.nemesis.worstEnemy.name} (${stats.nemesis.worstEnemy.losses} losses)`);
            }

            console.log('---------------------------------------------------');
            console.log('Verification Complete.');

      } catch (error) {
            console.error('Error processing stats:', error);
      }
}

testStats();
