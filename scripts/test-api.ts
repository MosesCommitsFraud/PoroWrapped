
import axios from 'axios';

// Env vars will be loaded via --env-file flag
const API_KEY = process.env.RIOT_API_KEY?.trim();
const REGION = process.env.RIOT_REGION || 'europe';
const PLATFORM = process.env.RIOT_PLATFORM || 'euw1';

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
            // 1. Test Challenger League (Generic Permission Check)
            console.log('\n1. Testing Challenger League Fetch (Permission Check)...');
            const challengerUrl = `https://${PLATFORM}.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5`;
            try {
                  await axios.get(challengerUrl, { headers: { 'X-Riot-Token': API_KEY } });
                  console.log('✅ SUCCESS: API Key has access to League V4.');
            } catch (error: any) {
                  console.error(`❌ FAILED: ${error.response?.status} ${error.response?.statusText}`);
                  if (error.response?.status === 403) {
                        console.error('   -> This confirms the API Key does NOT have permission for League V4 endpoints.');
                        console.error('   -> Personal Keys usually HAVE this. Production keys might need specific approval.');
                        console.error('   -> Double check you copied the key correctly and it is not expired.');
                  }
            }

            // 2. Test Specific Summoner League Fetch (The one that failed)
            console.log('\n2. Testing Specific Summoner League Fetch...');
            const failingId = 'Hxy9tK3JEZ1ZMY8A-w0HzSPEBx9V0_xpoPZpXAYvEuCyc2nk';

            // A. Check if this ID is valid for Summoner V4
            console.log('   A. Fetching Summoner Details by ID...');
            const summonerUrl = `https://${PLATFORM}.api.riotgames.com/lol/summoner/v4/summoners/${failingId}`;
            try {
                  const sumRes = await axios.get(summonerUrl, { headers: { 'X-Riot-Token': API_KEY } });
                  console.log('      ✅ SUCCESS: Summoner found.');
                  console.log('      -> PUUID:', sumRes.data.puuid);
            } catch (error: any) {
                  console.error(`      ❌ FAILED: ${error.response?.status} ${error.response?.statusText}`);
            }

            // B. Check League Entries
            console.log('   B. Fetching League Entries by ID...');
            const leagueUrl = `https://${PLATFORM}.api.riotgames.com/lol/league/v4/entries/by-summoner/${failingId}`;
            try {
                  const res = await axios.get(leagueUrl, { headers: { 'X-Riot-Token': API_KEY } });
                  console.log('      ✅ SUCCESS: Fetched League Entries.');
                  console.log('      -> Entries:', res.data.length);
            } catch (error: any) {
                  console.error(`      ❌ FAILED: ${error.response?.status} ${error.response?.statusText}`);
            }

            // 3. Test Workaround Flow (Agurin#EUW)
            console.log('\n3. Testing Workaround Flow (Agurin#EUW)...');
            try {
                  // 1. Account
                  const accUrl = `https://${REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Agurin/EUW`;
                  const accRes = await axios.get(accUrl, { headers: { 'X-Riot-Token': API_KEY } });
                  const puuid = accRes.data.puuid;
                  console.log('   ✅ Account Found. PUUID:', puuid);

                  // 2. Summoner (Check if ID is missing)
                  const sumUrl = `https://${PLATFORM}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
                  const sumRes = await axios.get(sumUrl, { headers: { 'X-Riot-Token': API_KEY } });
                  console.log('   ℹ️ Summoner Response Keys:', Object.keys(sumRes.data));
                  if (!sumRes.data.id) {
                        console.log('   ⚠️ CONFIRMED: id is missing from Summoner v4 response.');
                  } else {
                        console.log('   ✅ id IS present in Summoner v4 response:', sumRes.data.id);
                  }

                  // 3. Match History
                  const matchIdsUrl = `https://${PLATFORM}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1`;
                  const matchIdsRes = await axios.get(matchIdsUrl, { headers: { 'X-Riot-Token': API_KEY } });
                  const matchId = matchIdsRes.data[0];
                  console.log('   ✅ Match ID:', matchId);

                  // 4. Match Details
                  const matchUrl = `https://${PLATFORM}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
                  const matchRes = await axios.get(matchUrl, { headers: { 'X-Riot-Token': API_KEY } });
                  const participant = matchRes.data.info.participants.find((p: any) => p.puuid === puuid);

                  if (participant) {
                        const matchSummonerId = participant.summonerId;
                        console.log('   ✅ Found Summoner ID from Match:', matchSummonerId);

                        // 5. League v4 with Match Summoner ID
                        console.log('   Testing League v4 with Match Summoner ID...');
                        const leagueUrl = `https://${PLATFORM}.api.riotgames.com/lol/league/v4/entries/by-summoner/${matchSummonerId}`;
                        try {
                              const lRes = await axios.get(leagueUrl, { headers: { 'X-Riot-Token': API_KEY } });
                              console.log('   ✅ SUCCESS: Fetched League Entries using Match ID.');
                              console.log('   -> Entries:', lRes.data.length);
                        } catch (error: any) {
                              console.error(`   ❌ FAILED to fetch League with Match ID: ${error.response?.status} ${error.response?.statusText}`);
                        }
                  } else {
                        console.error('   ❌ Could not find participant in match.');
                  }

            } catch (error: any) {
                  console.error(`   ❌ FAILED: ${error.response?.status} ${error.response?.statusText}`);
                  console.error('   -> URL:', error.config?.url);
            }

      } catch (error) {
            console.error('Unexpected error:', error);
      }
}

test();
