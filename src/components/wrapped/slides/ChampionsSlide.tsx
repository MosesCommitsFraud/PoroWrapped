'use client';

import { AggregateStats } from '@/lib/stats-processor';
import { motion } from 'framer-motion';

export default function ChampionsSlide({ stats }: { stats: AggregateStats }) {
      const topChamps = Object.values(stats.champions)
            .sort((a, b) => b.games - a.games)
            .slice(0, 3);

      return (
            <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
                  <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-12 text-yellow-500"
                  >
                        Your Main Champions
                  </motion.h2>

                  <div className="grid grid-cols-3 gap-8 w-full">
                        {topChamps.map((champ, index) => (
                              <motion.div
                                    key={champ.name}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    className="relative group"
                              >
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10 rounded-2xl" />
                                    <img
                                          src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ.name.replace(/[^a-zA-Z]/g, '')}_0.jpg`}
                                          alt={champ.name}
                                          className="w-full h-[400px] object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                                          onError={(e) => {
                                                // Fallback for weird champ names (e.g. Wukong -> MonkeyKing, Kai'Sa -> Kaisa)
                                                // This is a basic fallback, might need a proper mapping
                                                (e.target as HTMLImageElement).src = 'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Poro_0.jpg';
                                          }}
                                    />

                                    <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                                          <h3 className="text-2xl font-bold mb-2">{champ.name}</h3>
                                          <div className="space-y-1 text-sm text-gray-300">
                                                <p>{champ.games} Games</p>
                                                <p>{((champ.wins / champ.games) * 100).toFixed(1)}% Winrate</p>
                                                <p>{((champ.kills + champ.assists) / Math.max(1, champ.deaths)).toFixed(2)} KDA</p>
                                          </div>
                                    </div>

                                    {index === 0 && (
                                          <div className="absolute -top-4 -right-4 bg-yellow-500 text-black font-bold px-4 py-2 rounded-full z-30 shadow-lg transform rotate-12">
                                                #1 MVP
                                          </div>
                                    )}
                              </motion.div>
                        ))}
                  </div>
            </div>
      );
}
