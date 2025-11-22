'use client';

import { AggregateStats } from '@/lib/stats-processor';
import { motion } from 'framer-motion';

interface SlideProps {
      stats: AggregateStats;
}

export default function SlideItems({ stats }: SlideProps) {
      const topItems = Object.values(stats.items)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

      return (
            <div className="flex flex-col items-center justify-center w-full max-w-5xl h-full p-4">
                  <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-yellow-500 mb-12"
                  >
                        LEGENDARY ARSENAL
                  </motion.h2>

                  <div className="flex flex-wrap justify-center gap-8">
                        {topItems.map((item, index) => (
                              <motion.div
                                    key={item.id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 + (index * 0.1) }}
                                    className="flex flex-col items-center gap-4"
                              >
                                    <div className="relative group">
                                          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                                                <img
                                                      src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${item.id}.png`}
                                                      alt={`Item ${item.id}`}
                                                      className="w-full h-full object-cover"
                                                />
                                          </div>
                                          <div className="absolute -bottom-3 -right-3 bg-gray-900 text-yellow-400 font-bold px-3 py-1 rounded-full border border-gray-700">
                                                {item.count}
                                          </div>
                                    </div>
                                    <div className={`font-bold ${((item.wins / item.count) >= 0.5) ? 'text-green-400' : 'text-red-400'}`}>
                                          {((item.wins / item.count) * 100).toFixed(0)}% WR
                                    </div>
                              </motion.div>
                        ))}
                  </div>

                  <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-12 text-gray-500 text-sm"
                  >
                        *Most built items across all games
                  </motion.div>
            </div>
      );
}
