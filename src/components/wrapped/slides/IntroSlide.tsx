'use client';

import { AggregateStats } from '@/lib/stats-processor';
import { motion } from 'framer-motion';

export default function IntroSlide({ stats }: { stats: AggregateStats }) {
      return (
            <div className="flex flex-col items-center justify-center text-center space-y-8">
                  <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", duration: 1.5 }}
                        className="w-48 h-48 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 p-1"
                  >
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                              {/* Placeholder for Summoner Icon - we didn't fetch it in stats processor but we can add it later */}
                              <span className="text-6xl">👋</span>
                        </div>
                  </motion.div>

                  <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                  >
                        <h1 className="text-5xl font-bold mb-2">Welcome Back!</h1>
                        <p className="text-2xl text-gray-400">Here is your season in review.</p>
                  </motion.div>

                  <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="grid grid-cols-2 gap-8 mt-8"
                  >
                        <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm">
                              <p className="text-gray-400 text-sm uppercase tracking-wider">Games Played</p>
                              <p className="text-4xl font-bold text-yellow-500">{stats.totalGames}</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm">
                              <p className="text-gray-400 text-sm uppercase tracking-wider">Time Played</p>
                              <p className="text-4xl font-bold text-yellow-500">{(stats.totalTimePlayed / 3600).toFixed(1)}h</p>
                        </div>
                  </motion.div>
            </div>
      );
}
