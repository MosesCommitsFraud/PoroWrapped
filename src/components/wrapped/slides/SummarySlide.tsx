'use client';

import { AggregateStats } from '@/lib/stats-processor';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SummarySlide({ stats }: { stats: AggregateStats }) {
      return (
            <div className="flex flex-col items-center justify-center text-center space-y-8">
                  <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 1 }}
                  >
                        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
                              GG WP!
                        </h1>
                        <p className="text-2xl text-gray-400">See you on the Rift.</p>
                  </motion.div>

                  <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/10 max-w-md w-full"
                  >
                        <div className="flex justify-between items-center mb-6">
                              <span className="text-gray-400">Winrate</span>
                              <span className={`text-2xl font-bold ${stats.winrate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                                    {stats.winrate.toFixed(1)}%
                              </span>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                              <span className="text-gray-400">Total Games</span>
                              <span className="text-2xl font-bold">{stats.totalGames}</span>
                        </div>
                        <div className="flex justify-between items-center">
                              <span className="text-gray-400">Playtime</span>
                              <span className="text-2xl font-bold">{(stats.totalTimePlayed / 3600).toFixed(0)}h</span>
                        </div>
                  </motion.div>

                  <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                  >
                        <Link
                              href="/"
                              className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors"
                        >
                              Check Another Summoner
                        </Link>
                  </motion.div>
            </div>
      );
}
