'use client';

import { AggregateStats } from '@/lib/stats-processor';
import { motion } from 'framer-motion';

interface SlideProps {
      stats: AggregateStats;
}

export default function SlideIntro({ stats }: SlideProps) {
      const hoursPlayed = Math.round(stats.totalTimePlayed / 3600);
      const winrate = stats.winrate.toFixed(1);

      return (
            <div className="flex flex-col items-center justify-center text-center space-y-12 w-full max-w-4xl">
                  <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                  >
                        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
                              YOUR 2025
                        </h1>
                        <h2 className="text-4xl md:text-6xl font-bold text-white">
                              LEAGUE WRAPPED
                        </h2>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                        <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4 }}
                              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
                        >
                              <div className="text-gray-400 text-lg mb-2">Total Games</div>
                              <div className="text-5xl font-bold text-white">{stats.totalGames}</div>
                              <div className="text-sm text-gray-500 mt-2">
                                    {stats.wins}W - {stats.losses}L
                              </div>
                        </motion.div>

                        <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 }}
                              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
                        >
                              <div className="text-gray-400 text-lg mb-2">Time Spent</div>
                              <div className="text-5xl font-bold text-blue-400">{hoursPlayed}h</div>
                              <div className="text-sm text-gray-500 mt-2">
                                    That's {(hoursPlayed / 24).toFixed(1)} days!
                              </div>
                        </motion.div>

                        <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 }}
                              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
                        >
                              <div className="text-gray-400 text-lg mb-2">Win Rate</div>
                              <div className={`text-5xl font-bold ${Number(winrate) >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                                    {winrate}%
                              </div>
                              <div className="text-sm text-gray-500 mt-2">
                                    Avg Game: {Math.round(stats.averageGameDuration / 60)}m
                              </div>
                        </motion.div>
                  </div>

                  <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-xl text-gray-400 italic"
                  >
                        "Another year, another grind."
                  </motion.div>
            </div>
      );
}
