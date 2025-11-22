'use client';

import { AggregateStats } from '@/lib/stats-processor';
import { motion } from 'framer-motion';

interface SlideProps {
      stats: AggregateStats;
}

export default function SlideChampions({ stats }: SlideProps) {
      const topChampions = Object.values(stats.champions)
            .sort((a, b) => b.games - a.games)
            .slice(0, 3);

      return (
            <div className="flex flex-col items-center justify-center w-full max-w-6xl h-full">
                  <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-yellow-500 mb-12"
                  >
                        YOUR MAIN SQUAD
                  </motion.h2>

                  <div className="flex flex-col md:flex-row items-end justify-center gap-8 w-full px-4">
                        {topChampions.map((champ, index) => {
                              const isFirst = index === 0;
                              const height = isFirst ? 'h-[500px]' : 'h-[400px]';
                              const order = isFirst ? 'order-2' : index === 1 ? 'order-1' : 'order-3';
                              const delay = isFirst ? 0.4 : index === 1 ? 0.2 : 0.6;

                              return (
                                    <motion.div
                                          key={champ.name}
                                          initial={{ opacity: 0, y: 100 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay, type: 'spring', stiffness: 100 }}
                                          className={`${order} relative group w-full md:w-1/3 max-w-[350px]`}
                                    >
                                          <div className={`relative ${height} rounded-3xl overflow-hidden border-4 ${isFirst ? 'border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)]' : 'border-gray-700'} bg-gray-800`}>
                                                {/* Champion Image Background */}
                                                <div
                                                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                                      style={{ backgroundImage: `url(https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ.name}_0.jpg)` }}
                                                >
                                                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                                </div>

                                                {/* Stats Overlay */}
                                                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                                                      <h3 className="text-3xl font-bold text-white uppercase">{champ.name}</h3>

                                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                  <div className="text-gray-400">Games</div>
                                                                  <div className="text-xl font-bold text-white">{champ.games}</div>
                                                            </div>
                                                            <div>
                                                                  <div className="text-gray-400">Win Rate</div>
                                                                  <div className={`text-xl font-bold ${(champ.wins / champ.games) >= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                                                                        {((champ.wins / champ.games) * 100).toFixed(1)}%
                                                                  </div>
                                                            </div>
                                                            <div>
                                                                  <div className="text-gray-400">KDA</div>
                                                                  <div className="text-xl font-bold text-blue-400">
                                                                        {((champ.kills + champ.assists) / Math.max(1, champ.deaths)).toFixed(2)}
                                                                  </div>
                                                            </div>
                                                            <div>
                                                                  <div className="text-gray-400">CS/Game</div>
                                                                  <div className="text-xl font-bold text-yellow-400">
                                                                        {(champ.cs / champ.games).toFixed(1)}
                                                                  </div>
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>

                                          {/* Rank Badge */}
                                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-1 rounded-full font-bold border border-gray-700">
                                                #{index + 1}
                                          </div>
                                    </motion.div>
                              );
                        })}
                  </div>
            </div>
      );
}
