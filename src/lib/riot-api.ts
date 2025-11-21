import axios from 'axios';
import { RateLimiter } from 'limiter';

const API_KEY = process.env.RIOT_API_KEY;
const REGION = 'europe'; // Default to europe for routing (americas, asia, europe, sea)
const PLATFORM = 'euw1'; // Default to euw1 for summoner lookups

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

export async function getMatchIds(puuid: string, start: number = 0, count: number = 100) {
      const url = `https://${REGION}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`;
      return fetchRiotAPI<string[]>(url);
}

export async function getMatchDetails(matchId: string) {
      const url = `https://${REGION}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
      return fetchRiotAPI<any>(url);
}
