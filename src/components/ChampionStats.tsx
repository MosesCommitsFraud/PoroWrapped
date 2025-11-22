import React from 'react';
import { Card } from '@/components/ui/Card';

interface ChampionStatsProps {
      stats: {
            name: string;
            games: number;
            wins: number;
            kills: number;
            deaths: number;
            assists: number;
      }[];
      version: string;
}

export default function ChampionStats({ stats, version }: ChampionStatsProps) {
      return (
            <Card className="p-4 space-y-4">
                  <h3 className="font-bold text-lg text-primary">Champion Stats</h3>
                  <div className="space-y-3">
                        {stats.slice(0, 5).map((champ) => {
                              const winrate = Math.round((champ.wins / champ.games) * 100);
                              const kda = ((champ.kills + champ.assists) / Math.max(1, champ.deaths)).toFixed(2);

                              return (
                                    <div key={champ.name} className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                                                      <img
                                                            src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.name}.png`}
                                                            alt={champ.name}
                                                            className="w-full h-full object-cover"
                                                      />
                                                </div>
                                                <div>
                                                      <div className="font-bold text-sm">{champ.name}</div>
                                                      <div className="text-xs text-muted">{champ.games} Games</div>
                                                </div>
                                          </div>
                                          <div className="text-right">
                                                <div className={`text-sm font-bold ${winrate >= 50 ? 'text-primary' : 'text-muted'}`}>
                                                      {winrate}% WR
                                                </div>
                                                <div className="text-xs text-muted">{kda} KDA</div>
                                          </div>
                                    </div>
                              );
                        })}
                  </div>
            </Card>
      );
}
