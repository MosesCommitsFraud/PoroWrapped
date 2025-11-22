
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Env vars will be loaded via --env-file flag
const API_KEY = process.env.RIOT_API_KEY?.trim();
const PLATFORM = process.env.RIOT_PLATFORM || 'euw1';
const REGION = process.env.RIOT_REGION || 'europe';

if (!API_KEY) {
      console.error('ERROR: RIOT_API_KEY is missing.');
      process.exit(1);
}

async function fetchMatch() {
      try {
            // 1. Get Agurin's PUUID
            console.log('Fetching PUUID...');
            const accUrl = `https://${REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Agurin/EUW`;
            const accRes = await axios.get(accUrl, { headers: { 'X-Riot-Token': API_KEY } });
            const puuid = accRes.data.puuid;

            // 2. Get Last Match ID
            console.log('Fetching Match ID...');
            const matchIdsUrl = `https://${PLATFORM}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1`;
            const matchIdsRes = await axios.get(matchIdsUrl, { headers: { 'X-Riot-Token': API_KEY } });
            const matchId = matchIdsRes.data[0];

            // 3. Get Match Details
            console.log(`Fetching Match Details for ${matchId}...`);
            const matchUrl = `https://${PLATFORM}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
            const matchRes = await axios.get(matchUrl, { headers: { 'X-Riot-Token': API_KEY } });

            // 4. Save to file
            const outputPath = path.resolve(process.cwd(), 'match-debug.json');
            fs.writeFileSync(outputPath, JSON.stringify(matchRes.data, null, 2));
            console.log(`Saved match data to ${outputPath}`);

      } catch (error: any) {
            console.error('Error:', error.response?.status, error.response?.statusText);
            console.error(error.response?.data);
      }
}

fetchMatch();
