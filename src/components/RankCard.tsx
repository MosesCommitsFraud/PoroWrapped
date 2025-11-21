import React from 'react';
import { Card } from '@/components/ui/Card';

interface RankCardProps {
      queueType: string;
      tier: string;
      rank: string;
      lp: number;
      wins: number;
      losses: number;
}

export default function RankCard({ queueType, tier, rank, lp, wins, losses }: RankCardProps) {
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
            <Card className="flex items-center gap-4 p-4 bg-card/50 border-white/5">
                  <div className="w-16 h-16 bg-black/30 rounded-full flex items-center justify-center">
                        {/* Placeholder for Rank Icon */}
                        <span className={`font-bold text-xl ${tierColor}`}>{tier[0]}</span>
                  </div>
                  <div>
                        <h3 className="text-sm text-muted font-medium uppercase tracking-wider">{queueType}</h3>
                        <div className={`text-xl font-bold ${tierColor}`}>
                              {tier} {rank}
                        </div>
                        <div className="text-sm text-gray-400">
                              <span className="text-white font-bold">{lp} LP</span> • {wins}W {losses}L ({winrate}%)
                        </div>
                  </div>
            </Card>
      );
}
