import React from 'react';
import { getAccountByRiotID, getSummonerByPUUID, getLeagueEntries, getMatchIds, getMatchDetails, aggregateStats, getChampionMastery, testRankFetch } from '@/lib/riot-api';
import RankCard from '@/components/RankCard';
import MatchHistory from '@/components/MatchHistory';
import ChampionStats from '@/components/ChampionStats';
import RecentlyPlayedWith from '@/components/RecentlyPlayedWith';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface PageProps {
      params: Promise<{ riotId: string }>;
}

export default async function ProfilePage({ params }: PageProps) {
      const { riotId } = await params;
      const decodedRiotId = decodeURIComponent(riotId);

      // Parse Name and Tag. Assumes format "Name-Tag"
      // Find the last hyphen to split, as names can contain hyphens
      const lastHyphenIndex = decodedRiotId.lastIndexOf('-');
      const gameName = decodedRiotId.substring(0, lastHyphenIndex);
      const tagLine = decodedRiotId.substring(lastHyphenIndex + 1);

      if (!gameName || !tagLine) {
            return <div className="text-center text-red-500 mt-10">Invalid Riot ID format. Please use Name-Tag.</div>;
      }

      try {
            const account = await getAccountByRiotID(gameName, tagLine);
            const summoner = await getSummonerByPUUID(account.puuid);

            let summonerId = summoner.id;

            // Workaround: If summoner.id is missing, try to get it from the last match
            if (!summonerId) {
                  console.log('[ProfilePage] Summoner ID missing, attempting to fetch from match history...');
                  try {
                        const matchIds = await getMatchIds(account.puuid, 0, 1);
                        if (matchIds.length > 0) {
                              const lastMatch = await getMatchDetails(matchIds[0]);
                              const participant = lastMatch.info.participants.find((p: any) => p.puuid === account.puuid);
                              if (participant) {
                                    summonerId = participant.summonerId;
                                    console.log('[ProfilePage] Found Summoner ID from match:', summonerId);
                              }
                        }
                  } catch (err) {
                        console.error('[ProfilePage] Failed to fetch summoner ID from match history:', err);
                  }
            }

            let leagueEntries: any[] = [];
            if (summonerId) {
                  try {
                        leagueEntries = await getLeagueEntries(summonerId);
                  } catch (err) {
                        console.error('[ProfilePage] Failed to fetch league entries:', err);
                        // Continue without rank data
                  }
            }

            // Fetch matches (last 20 for now to be fast, can increase later)
            const matchIds = await getMatchIds(account.puuid, 0, 20);
            const matches = await Promise.all(matchIds.map(id => getMatchDetails(id)));

            const { championStats, playedWith } = aggregateStats(matches, account.puuid);

            // Fetch Mastery
            let mastery: any[] = [];
            try {
                  mastery = await getChampionMastery(account.puuid);
            } catch (e) {
                  console.error('[ProfilePage] Failed to fetch mastery:', e);
            }

            // Debug Rank API
            await testRankFetch();

            // Calculate Fallback Stats
            const totalGames = matches.length;
            const totalWins = matches.filter(m => {
                  const p = m.info.participants.find((p: any) => p.puuid === account.puuid);
                  return p?.win;
            }).length;
            const winrate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

            // Calculate Average KDA
            let totalKills = 0, totalDeaths = 0, totalAssists = 0;
            matches.forEach(m => {
                  const p = m.info.participants.find((p: any) => p.puuid === account.puuid);
                  if (p) {
                        totalKills += p.kills;
                        totalDeaths += p.deaths;
                        totalAssists += p.assists;
                  }
            });
            const avgKda = totalDeaths > 0 ? ((totalKills + totalAssists) / totalDeaths).toFixed(2) : "Perfect";


            const soloRank = leagueEntries.find((e: any) => e.queueType === 'RANKED_SOLO_5x5');
            const flexRank = leagueEntries.find((e: any) => e.queueType === 'RANKED_FLEX_SR');

            return (
                  <div className="max-w-7xl mx-auto space-y-8">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                    <div className="relative">
                                          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary">
                                                <img
                                                      src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/profileicon/${summoner.profileIconId}.png`}
                                                      alt="Profile Icon"
                                                      className="w-full h-full object-cover"
                                                />
                                          </div>
                                          <div className="absolute -bottom-3 -right-3 bg-black text-white text-xs font-bold px-2 py-1 rounded-full border border-white/10">
                                                {summoner.summonerLevel}
                                          </div>
                                    </div>
                                    <div>
                                          <h1 className="text-4xl font-bold text-white tracking-tight">
                                                {account.gameName}
                                                <span className="text-muted text-2xl font-normal">#{account.tagLine}</span>
                                          </h1>
                                          <div className="flex gap-4 mt-2 text-sm text-muted">
                                                <span>Winrate: <span className="text-white font-bold">{winrate}%</span> ({totalWins}W {(totalGames - totalWins)}L)</span>
                                                <span>KDA: <span className="text-white font-bold">{avgKda}</span></span>
                                          </div>
                                    </div>
                              </div>

                              <Link href={`/wrapped/${account.puuid}`}>
                                    <Button variant="primary" size="lg" className="shadow-[0_0_20px_rgba(64,224,208,0.3)] hover:shadow-[0_0_30px_rgba(64,224,208,0.5)]">
                                          View Wrapped <ArrowRight size={20} />
                                    </Button>
                              </Link>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                              {/* Left Column: Stats & Ranks */}
                              <div className="lg:col-span-1 space-y-6">
                                    {soloRank ? (
                                          <RankCard
                                                queueType="Ranked Solo"
                                                tier={soloRank.tier}
                                                rank={soloRank.rank}
                                                lp={soloRank.leaguePoints}
                                                wins={soloRank.wins}
                                                losses={soloRank.losses}
                                          />
                                    ) : (
                                          <div className="p-4 rounded-lg bg-card/50 border border-white/5 text-center text-muted">
                                                Unranked Solo
                                                <div className="text-xs mt-1 opacity-50">Rank API Restricted</div>
                                          </div>
                                    )}

                                    {flexRank ? (
                                          <RankCard
                                                queueType="Ranked Flex"
                                                tier={flexRank.tier}
                                                rank={flexRank.rank}
                                                lp={flexRank.leaguePoints}
                                                wins={flexRank.wins}
                                                losses={flexRank.losses}
                                          />
                                    ) : (
                                          <div className="p-4 rounded-lg bg-card/50 border border-white/5 text-center text-muted">Unranked Flex</div>
                                    )}

                                    {/* Mastery Section */}
                                    {mastery.length > 0 && (
                                          <div className="p-4 rounded-lg bg-card/50 border border-white/5">
                                                <h3 className="text-sm font-bold text-muted mb-3 uppercase tracking-wider">Top Mastery</h3>
                                                <div className="space-y-3">
                                                      {mastery.map((m: any) => (
                                                            <div key={m.championId} className="flex items-center gap-3">
                                                                  {/* We need champion name from ID. Using a placeholder or need to fetch static data. 
                                                                      For now, let's rely on the fact that we can't easily map ID to Name without the static JSON.
                                                                      I'll use the ID for the image which usually works if it's the key, but DDragon uses Name for images.
                                                                      Actually, DDragon images use the 'id' string (e.g. 'Aatrox'), not the key (266).
                                                                      I will skip the image for now or use a generic placeholder to avoid broken images.
                                                                      Wait, I can use the static data cache I built in MatchHistory? No, that's client side.
                                                                      I'll just show the points and level for now.
                                                                  */}
                                                                  <div className="w-10 h-10 bg-black rounded-full border border-white/10 flex items-center justify-center text-xs font-bold">
                                                                        {m.championLevel}
                                                                  </div>
                                                                  <div>
                                                                        <div className="text-sm font-bold text-white">Champ {m.championId}</div>
                                                                        <div className="text-xs text-muted">{(m.championPoints / 1000).toFixed(0)}k pts</div>
                                                                  </div>
                                                            </div>
                                                      ))}
                                                </div>
                                          </div>
                                    )}

                                    <ChampionStats stats={championStats} />
                                    <RecentlyPlayedWith players={playedWith} />
                              </div>

                              {/* Right Column: Match History */}
                              <div className="lg:col-span-3 space-y-4">
                                    <h2 className="text-xl font-bold mb-4">Match History</h2>
                                    {matches.map((match) => (
                                          <MatchHistory key={match.metadata.matchId} match={match} puuid={account.puuid} />
                                    ))}
                              </div>
                        </div>
                  </div>
            );
      } catch (error) {
            console.error(error);
            return (
                  <div className="text-center mt-20">
                        <h2 className="text-2xl font-bold text-red-500 mb-4">Summoner not found or API error</h2>
                        <p className="text-muted">Please check the Riot ID and try again.</p>
                  </div>
            );
      }
}
