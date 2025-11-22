import axios from 'axios';
import { RateLimiter } from 'limiter';

const API_KEY = process.env.RIOT_API_KEY?.trim();
const REGION = process.env.RIOT_REGION || 'europe';
const PLATFORM = process.env.RIOT_PLATFORM || 'euw1';

// Rate limiters
// 20 requests per 1 second
// 100 requests per 2 minutes
const secondLimiter = new RateLimiter({ tokensPerInterval: 20, interval: "second" });
const minuteLimiter = new RateLimiter({ tokensPerInterval: 100, interval: 120000 });

export async function fetchRiotAPI<T>(url: string, region: string = REGION): Promise<T> {
      if (!API_KEY) {
            throw new Error('RIOT_API_KEY is not set');
      }

      // Check cache for match details (optimization)
      // We only cache match details as they are immutable. 
      // Summoner data changes, so we don't cache it long-term or handle it differently.
      // For now, simple URL-based caching for specific endpoints could be risky if not careful.
      // Let's implement specific caching in the wrapper functions instead.

      await secondLimiter.removeTokens(1);
      await minuteLimiter.removeTokens(1);

      try {
            const response = await axios.get<T>(url, {
                  headers: {
                        'X-Riot-Token': API_KEY,
                  },
            });
            return response.data;
      } catch (error: any) {
            if (axios.isAxiosError(error)) {
                  console.error(`[RiotAPI] Error fetching ${url}: ${error.response?.status} ${error.response?.statusText}`);
                  if (error.response?.status === 429) {
                        console.warn('Rate limit exceeded, retrying after delay...');
                        const retryAfter = parseInt(error.response.headers['retry-after'] || '1', 10);
                        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                        return fetchRiotAPI<T>(url, region);
                  }
            }
            throw error;
      }
}

export async function getAccountByRiotID(gameName: string, tagLine: string) {
      const url = `https://${REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
      return fetchRiotAPI<{ puuid: string; gameName: string; tagLine: string }>(url);
}

export async function getSummonerByPUUID(puuid: string) {
      const url = `https://${PLATFORM}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
      return fetchRiotAPI<any>(url, PLATFORM);
}

export async function getMatchIds(puuid: string, start: number = 0, count: number = 100, queue?: number) {
      let url = `https://${REGION}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`;
      if (queue) {
            url += `&queue=${queue}`;
      }
      return fetchRiotAPI<string[]>(url);
}

export async function getMatchDetails(matchId: string) {
      const url = `https://${REGION}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
      return fetchRiotAPI<any>(url);
}

export async function getLeagueEntries(summonerId: string) {
      const url = `https://${PLATFORM}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;
      return fetchRiotAPI<any[]>(url, PLATFORM);
}

// Helper to aggregate stats from a list of matches
export function aggregateStats(matches: any[], puuid: string) {
      const championStats: Record<string, { name: string, games: number, wins: number, kills: number, deaths: number, assists: number }> = {};
      const playedWith: Record<string, { name: string, games: number, wins: number }> = {};

      matches.forEach(match => {
            const participant = match.info.participants.find((p: any) => p.puuid === puuid);
            if (!participant) return;

            const win = participant.win ? 1 : 0;

            // Champion Stats
            const champName = participant.championName;
            if (!championStats[champName]) {
                  championStats[champName] = { name: champName, games: 0, wins: 0, kills: 0, deaths: 0, assists: 0 };
            }
            championStats[champName].games++;
            championStats[champName].wins += win;
            championStats[champName].kills += participant.kills;
            championStats[champName].deaths += participant.deaths;
            championStats[champName].assists += participant.assists;

            // Recently Played With
            match.info.participants.forEach((p: any) => {
                  if (p.puuid === puuid) return;
                  // simple key using riotId if available, else summonerName
                  const key = p.riotIdGameName ? `${p.riotIdGameName}#${p.riotIdTagLine}` : p.summonerName;

                  if (!playedWith[key]) {
                        playedWith[key] = { name: key, games: 0, wins: 0 };
                  }
                  playedWith[key].games++;
                  // If the main player won, and this player was on the SAME team, they won together.
                  // If they were on opposite teams, main player win means this player lost.
                  if (p.teamId === participant.teamId) {
                        playedWith[key].wins += win;
                  } else {
                        // opponent
                  }
            });
      });

      return {
            championStats: Object.values(championStats).sort((a, b) => b.games - a.games),
            playedWith: Object.values(playedWith).sort((a, b) => b.games - a.games).slice(0, 20) // Top 20
      };
}

export async function getChampionMastery(puuid: string) {
      const url = `https://${PLATFORM}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=3`;
      return fetchRiotAPI<any[]>(url, PLATFORM);
}

// Test function to debug 403 error
export async function testRankFetch() {
      // Faker's Summoner ID (EUW) - just a random high elo player or a known ID if possible.
      // Actually, let's use a hardcoded known valid ID from a different region or just try to fetch the challenger league to see if permissions work.
      // Fetching Challenger League for Solo Queue
      const url = `https://${PLATFORM}.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5`;
      try {
            console.log('[RiotAPI] Testing Challenger League fetch...');
            await fetchRiotAPI(url, PLATFORM);
            console.log('[RiotAPI] Challenger League fetch SUCCESS');
            return true;
      } catch (e: any) {
            console.error('[RiotAPI] Challenger League fetch FAILED:', e.response?.status);
            return false;
      }
}

export async function getLatestDataDragonVersion() {
      const url = 'https://ddragon.leagueoflegends.com/api/versions.json';
      const versions = await axios.get<string[]>(url);
      return versions.data[0];
}