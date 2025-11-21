import React from 'react';
import { Card } from '@/components/ui/Card';

interface RecentlyPlayedWithProps {
      players: {
            name: string;
            games: number;
            wins: number;
      }[];
}

export default function RecentlyPlayedWith({ players }: RecentlyPlayedWithProps) {
      return (
            <Card className="p-4 space-y-4">
                  <h3 className="font-bold text-lg text-primary">Recently Played With</h3>
                  <div className="space-y-3">
                        {players.length === 0 ? (
                              <p className="text-sm text-muted">No recent premades found.</p>
                        ) : (
                              players.slice(0, 5).map((player) => {
                                    const winrate = Math.round((player.wins / player.games) * 100);

                                    return (
                                          <div key={player.name} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                                                            {player.name[0]}
                                                      </div>
                                                      <div className="truncate max-w-[100px]">
                                                            <div className="font-bold text-sm truncate" title={player.name}>{player.name.split('#')[0]}</div>
                                                            <div className="text-xs text-muted">{player.games} Games</div>
                                                      </div>
                                                </div>
                                                <div className="text-right">
                                                      <div className={`text-sm font-bold ${winrate >= 50 ? 'text-primary' : 'text-muted'}`}>
                                                            {winrate}% WR
                                                      </div>
                                                </div>
                                          </div>
                                    );
                              })
                        )}
                  </div>
            </Card>
      );
}
