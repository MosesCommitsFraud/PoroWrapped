'use client';

import { AggregateStats } from '@/lib/stats-processor';
import { motion } from 'framer-motion';

export default function ItemsSlide({ stats }: { stats: AggregateStats }) {
      const topItems = Object.values(stats.items)
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);

      return (
            <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
                  <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-12 text-yellow-500"
                  >
                        Your Favorite Toys
                  </motion.h2>

                  <div className="grid grid-cols-3 gap-8">
                        {topItems.map((item, index) => (
                              <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm flex flex-col items-center hover:bg-white/10 transition-colors"
                              >
                                    <div className="relative w-24 h-24 mb-4">
                                          <img
                                                src={`https://ddragon.leagueoflegends.com/cdn/14.22.1/img/item/${item.id}.png`}
                                                alt={`Item ${item.id}`}
                                                className="w-full h-full rounded-xl shadow-lg"
                                                onError={(e) => {
                                                      (e.target as HTMLImageElement).src = 'https://ddragon.leagueoflegends.com/cdn/14.22.1/img/item/1001.png'; // Boots fallback
                                                }}
                                          />
                                          <div className="absolute -top-2 -right-2 bg-yellow-500 text-black font-bold w-8 h-8 flex items-center justify-center rounded-full text-sm">
                                                {index + 1}
                                          </div>
                                    </div>

                                    <div className="text-center">
                                          <p className="text-2xl font-bold">{item.count}</p>
                                          <p className="text-gray-400 text-sm">Times Built</p>
                                          <p className="text-green-400 text-sm mt-1">{((item.wins / item.count) * 100).toFixed(0)}% WR</p>
                                    </div>
                              </motion.div>
                        ))}
                  </div>
            </div>
      );
}
