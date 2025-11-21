import React from 'react';
import { getAccountByRiotID, getSummonerByPUUID, getLeagueEntries, getMatchIds, getMatchDetails, aggregateStats } from '@/lib/riot-api';
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
            const leagueEntries = await getLeagueEntries(summoner.id);

            // Fetch matches (last 20 for now to be fast, can increase later)
            const matchIds = await getMatchIds(account.puuid, 0, 20);
            const matches = await Promise.all(matchIds.map(id => getMatchDetails(id)));

            const { championStats, playedWith } = aggregateStats(matches, account.puuid);

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
                                          <Button variant="outline" size="sm" className="mt-2">
                                                Update
                                          </Button>
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
                                          <div className="p-4 rounded-lg bg-card/50 border border-white/5 text-center text-muted">Unranked Solo</div>
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
