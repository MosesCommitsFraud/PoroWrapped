import React from 'react';
import { Card } from '@/components/ui/Card';

interface RankCardProps {
      queueType: string;
      tier: string;
      rank: string;
      lp: number;
      wins: number;
      losses: number;
      hotStreak?: boolean;
      veteran?: boolean;
      freshBlood?: boolean;
      inactive?: boolean;
      miniSeries?: {
            target: number;
            wins: number;
            losses: number;
            progress: string;
      };
}

export default function RankCard({ queueType, tier, rank, lp, wins, losses, hotStreak, veteran, freshBlood, inactive, miniSeries }: RankCardProps) {
      const winrate = Math.round((wins / (wins + losses)) * 100);
      const tierColor = {
            IRON: 'text-gray-400',
            BRONZE: 'text-orange-700',
            SILVER: 'text-gray-300',
            GOLD: 'text-yellow-400',
            PLATINUM: 'text-teal-400',
            EMERALD: 'text-emerald-500',
            DIAMOND: 'text-blue-400',
            MASTER: 'text-purple-400',
            GRANDMASTER: 'text-red-400',
            CHALLENGER: 'text-yellow-300',
      }[tier] || 'text-white';

      return (
            <Card className="flex flex-col gap-4 p-4 bg-card/50 border-white/5">
                  <div className="flex items-center gap-4">
                  <div className="w-16 h-16 relative">
                        {/* 
                           Using Community Dragon for rank icons.
                           Path: https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-{tier}.png
                        */}
                        <img 
                              src={`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-${tier.toLowerCase()}.png`} 
                              alt={tier}
                              className="w-full h-full object-contain"
                        />
                        {hotStreak && (
                              <div className="absolute -top-1 -right-1 text-lg" title="Hot Streak">🔥</div>
                        )}
                  </div>
                        <div>
                              <h3 className="text-sm text-muted font-medium uppercase tracking-wider flex items-center gap-2">
                                    {queueType}
                                    {inactive && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Inactive</span>}
                              </h3>
                              <div className={`text-xl font-bold ${tierColor}`}>
                                    {tier} {rank}
                              </div>
                              <div className="text-sm text-gray-400">
                                    <span className="text-white font-bold">{lp} LP</span> • {wins}W {losses}L ({winrate}%)
                              </div>
                        </div>
                  </div>

                  {/* Badges & Promos */}
                  {(veteran || freshBlood || miniSeries) && (
                        <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                              {veteran && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/20" title="Played 100+ games in this league">Veteran</span>}
                              {freshBlood && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/20" title="New to this league">Fresh Blood</span>}

                              {miniSeries && (
                                    <div className="flex items-center gap-1 ml-auto">
                                          <span className="text-xs text-muted mr-1">Promos:</span>
                                          {miniSeries.progress.split('').map((char: string, i: number) => (
                                                <div
                                                      key={i}
                                                      className={`w-2 h-2 rounded-full ${char === 'W' ? 'bg-green-500' :
                                                            char === 'L' ? 'bg-red-500' :
                                                                  'bg-gray-600'
                                                            }`}
                                                />
                                          ))}
                                    </div>
                              )}
                        </div>
                  )}
            </Card>
      );
}
