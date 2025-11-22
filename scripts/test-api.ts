
import fs from 'fs';
import path from 'path';
import axios from 'axios';

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
// Default to EUW params for testing the failing case
const REGION = 'europe';
const PLATFORM = 'euw1';

console.log('--- Riot API Test ---');
console.log(`API Key Present: ${!!API_KEY}`);
console.log(`Region: ${REGION}`);
console.log(`Platform: ${PLATFORM}`);

if (!API_KEY) {
      console.error('ERROR: RIOT_API_KEY is missing.');
      process.exit(1);
}

async function test() {
      try {
            const failingId = 'Hxy9tK3JEZ1ZMY8A-w0HzSPEBx9V0_xpoPZpXAYvEuCyc2nk';

            // 1. Check Summoner V4 explicitly for the failing ID
            console.log('\n1. Checking Summoner V4 for ID:', failingId);
            try {
                  const url = `https://${PLATFORM}.api.riotgames.com/lol/summoner/v4/summoners/${failingId}`;
                  const res = await axios.get(url, { headers: { 'X-Riot-Token': API_KEY } });
                  console.log('   ✅ Found Summoner. PUUID:', res.data.puuid);
                  console.log('   Keys:', Object.keys(res.data));
            } catch (e: any) {
                  console.error(`   ❌ Failed: ${e.response?.status} ${e.response?.statusText}`);
            }

            // 2. Check League V4 for the failing ID on EUW1
            console.log('\n2. Checking League V4 for ID on EUW1:', failingId);
            try {
                  const url = `https://${PLATFORM}.api.riotgames.com/lol/league/v4/entries/by-summoner/${failingId}`;
                  const res = await axios.get(url, { headers: { 'X-Riot-Token': API_KEY } });
                  console.log('   ✅ Success. Entries:', res.data.length);
            } catch (e: any) {
                  console.error(`   ❌ Failed: ${e.response?.status} ${e.response?.statusText}`);
            }

            // 3. Check League V4 for the failing ID on EUN1 (Just in case)
            console.log('\n3. Checking League V4 for ID on EUN1:');
            try {
                  const url = `https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${failingId}`;
                  const res = await axios.get(url, { headers: { 'X-Riot-Token': API_KEY } });
                  console.log('   ✅ Success on EUN1. Entries:', res.data.length);
            } catch (e: any) {
                  console.error(`   ❌ Failed on EUN1: ${e.response?.status} ${e.response?.statusText}`);
            }

            // 4. Check Match V5 (Correct Region) to see if we can retrieve a fresh ID
            console.log('\n4. Fetching Account PUUID (Agurin#EUW) to trace fresh ID...');
            try {
                  const accUrl = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Agurin/EUW`;
                  const accRes = await axios.get(accUrl, { headers: { 'X-Riot-Token': API_KEY } });
                  const puuid = accRes.data.puuid;
                  console.log('   PUUID:', puuid);

                  const matchUrl = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1`;
                  const matchRes = await axios.get(matchUrl, { headers: { 'X-Riot-Token': API_KEY } });
                  const matchId = matchRes.data[0];
                  console.log('   Latest Match:', matchId);

                  const detailUrl = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`;
                  const detailRes = await axios.get(detailUrl, { headers: { 'X-Riot-Token': API_KEY } });
                  const p = detailRes.data.info.participants.find((p: any) => p.puuid === puuid);
                  console.log('   Summoner ID in Match:', p.summonerId);
                  
                  if (p.summonerId !== failingId) {
                        console.log('   ⚠️  ID MISMATCH! The ID in the match is different from the failing one.');
                        console.log('   Failing:', failingId);
                        console.log('   Fresh:  ', p.summonerId);
                  } else {
                        console.log('   IDs match.');
                  }

            } catch (e: any) {
                  console.error('   Failed in Step 4:', e.message);
            }

      } catch (e) {
            console.error(e);
      }
}

test();
