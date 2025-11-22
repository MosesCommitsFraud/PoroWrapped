
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { RateLimiter } from 'limiter';

// Load env manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
      const envConfig = fs.readFileSync(envPath, 'utf-8');
      envConfig.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                  process.env[key.trim()] = value.trim();
            }
      });
}

const API_KEY = process.env.RIOT_API_KEY?.trim();
const REGION = process.env.RIOT_REGION || 'europe';
const PLATFORM = process.env.RIOT_PLATFORM || 'euw1';

if (!API_KEY) {
      console.error('RIOT_API_KEY is missing from .env.local');
      process.exit(1);
}

const secondLimiter = new RateLimiter({ tokensPerInterval: 20, interval: "second" });

async function fetchRiotAPI(url: string) {
      await secondLimiter.removeTokens(1);
      try {
            const res = await axios.get(url, { headers: { 'X-Riot-Token': API_KEY } });
            return res.data;
      } catch (error: any) {
            console.error(`❌ Error fetching ${url}: ${error.response?.status} ${error.response?.statusText}`);
            throw error;
      }
}

async function debugProfile(gameName: string, tagLine: string) {
      console.log(`\n--- Debugging Profile for ${gameName}#${tagLine} ---`);

      try {
            // 1. Account
            console.log('1. Fetching Account...');
            const accUrl = `https://${REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
            const account = await fetchRiotAPI(accUrl);
            console.log('   ✅ Account PUUID:', account.puuid);

            // 2. Summoner (Standard)
            console.log('2. Fetching Summoner (Standard)...');
            const sumUrl = `https://${PLATFORM}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}`;
            const summoner = await fetchRiotAPI(sumUrl);
            console.log('   ✅ Summoner ID (from V4):', summoner.id);

            let summonerIdToUse = summoner.id;

            // 3. Match Workaround
            console.log('3. Attempting Match Workaround...');
            const matchIdsUrl = `https://${REGION}.api.riotgames.com/lol/match/v5/matches/by-puuid/${account.puuid}/ids?start=0&count=1`;
            const matchIds = await fetchRiotAPI(matchIdsUrl);

            if (matchIds.length > 0) {
                  console.log('   Found match ID:', matchIds[0]);
                  const matchUrl = `https://${REGION}.api.riotgames.com/lol/match/v5/matches/${matchIds[0]}`;
                  const match = await fetchRiotAPI(matchUrl);
                  const participant = match.info.participants.find((p: any) => p.puuid === account.puuid);

                  if (participant) {
                        console.log('   ✅ Summoner ID (from Match):', participant.summonerId);
                        summonerIdToUse = participant.summonerId;
                  } else {
                        console.log('   ⚠️ Participant not found in match.');
                  }
            } else {
                  console.log('   ⚠️ No matches found.');
            }

            // 4. League Entries
            console.log(`4. Fetching League Entries using ID: ${summonerIdToUse}...`);
            const leagueUrl = `https://${PLATFORM}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerIdToUse}`;
            try {
                  const entries = await fetchRiotAPI(leagueUrl);
                  console.log('   ✅ League Entries Found:', entries.length);
                  console.log(JSON.stringify(entries, null, 2));
            } catch (e) {
                  console.error('   ❌ Failed to fetch League Entries.');
            }

      } catch (error) {
            console.error('Fatal Error in Debug Script:', error);
      }
}

// Run with Agurin #EUW
debugProfile('Agurin', 'EUW');
