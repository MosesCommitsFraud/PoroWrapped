import React from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface MatchProps {
      match: any; // using any for now, should define proper types later
      puuid: string;
}

export default function MatchHistory({ match, puuid }: MatchProps) {
      const participant = match.info.participants.find((p: any) => p.puuid === puuid);
      if (!participant) return null;

      const isWin = participant.win;
      const gameDuration = match.info.gameDuration;
      const minutes = Math.floor(gameDuration / 60);
      const seconds = gameDuration % 60;
      const kda = ((participant.kills + participant.assists) / Math.max(1, participant.deaths)).toFixed(2);
      const cs = participant.totalMinionsKilled + participant.neutralMinionsKilled;
      const csPerMin = (cs / (gameDuration / 60)).toFixed(1);

      return (
            <Card className={cn(
                  "flex items-center justify-between p-3 mb-2 border-l-4 transition-all hover:bg-white/5",
                  isWin ? "border-l-primary bg-primary/5" : "border-l-red-500 bg-red-500/5"
            )}>
                  <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center w-16">
                              <span className={cn("font-bold text-sm", isWin ? "text-primary" : "text-red-500")}>
                                    {isWin ? "Victory" : "Defeat"}
                              </span>
                              <span className="text-xs text-muted">{match.info.gameMode}</span>
                              <span className="text-xs text-muted">{minutes}:{seconds.toString().padStart(2, '0')}</span>
                        </div>

                        <div className="relative">
                              <div className="w-12 h-12 bg-black rounded-full overflow-hidden border border-white/10">
                                    <img
                                          src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${participant.championName}.png`}
                                          alt={participant.championName}
                                          className="w-full h-full object-cover"
                                    />
                              </div>
                              <div className="absolute -bottom-1 -right-1 bg-black text-xs px-1 rounded border border-white/10">
                                    {participant.champLevel}
                              </div>
                        </div>

                        <div className="flex flex-col">
                              <div className="flex gap-1">
                                    <span className="font-bold text-white">{participant.kills}</span>
                                    <span className="text-muted">/</span>
                                    <span className="font-bold text-red-400">{participant.deaths}</span>
                                    <span className="text-muted">/</span>
                                    <span className="font-bold text-white">{participant.assists}</span>
                              </div>
                              <span className="text-xs text-muted">{kda} KDA</span>
                        </div>
                  </div>

                  <div className="flex flex-col items-end text-right min-w-[80px]">
                        <span className="text-sm text-muted">CS {cs} ({csPerMin})</span>
                        <div className="flex gap-1 mt-1">
                              {/* Items placeholder - just showing first 3 for compactness */}
                              {[0, 1, 2].map(i => {
                                    const item = participant[`item${i}`];
                                    return item ? (
                                          <div key={i} className="w-6 h-6 bg-black rounded border border-white/10 overflow-hidden">
                                                <img src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${item}.png`} alt="" className="w-full h-full" />
                                          </div>
                                    ) : <div key={i} className="w-6 h-6 bg-white/5 rounded" />
                              })}
                        </div>
                  </div>
            </Card>
      );
}
