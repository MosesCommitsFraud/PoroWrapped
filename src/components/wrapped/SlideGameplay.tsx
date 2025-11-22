'use client';

import { AggregateStats } from '@/lib/stats-processor';
import { motion } from 'framer-motion';
import { MousePointer2, Coins, Target, Zap } from 'lucide-react';

interface SlideProps {
      stats: AggregateStats;
}

export default function SlideGameplay({ stats }: SlideProps) {
      const totalCasts = stats.abilityCasts.q + stats.abilityCasts.w + stats.abilityCasts.e + stats.abilityCasts.r;

      return (
            <div className="flex flex-col items-center justify-center w-full max-w-6xl h-full p-4">
                  <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-purple-500 mb-8"
                  >
                        GAMEPLAY ANALYSIS
                  </motion.h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        {/* Ability Usage */}
                        <motion.div
                              initial={{ x: -50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="bg-gray-900/50 p-6 rounded-3xl border border-purple-500/20"
                        >
                              <div className="flex items-center gap-3 mb-6">
                                    <Zap className="text-yellow-400" />
                                    <h3 className="text-2xl font-bold text-white">Button Mashing</h3>
                              </div>

                              <div className="grid grid-cols-4 gap-4 text-center">
                                    {['Q', 'W', 'E', 'R'].map((key) => {
                                          const val = stats.abilityCasts[key.toLowerCase() as keyof typeof stats.abilityCasts];
                                          const percent = totalCasts > 0 ? (val / totalCasts) * 100 : 0;

                                          return (
                                                <div key={key} className="flex flex-col items-center gap-2">
                                                      <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-xl font-bold border border-gray-600">
                                                            {key}
                                                      </div>
                                                      <div className="h-32 w-full bg-gray-800 rounded-full relative overflow-hidden">
                                                            <motion.div
                                                                  initial={{ height: 0 }}
                                                                  animate={{ height: `${percent}%` }}
                                                                  transition={{ delay: 0.5, duration: 1 }}
                                                                  className="absolute bottom-0 w-full bg-purple-500"
                                                            />
                                                      </div>
                                                      <div className="text-xs text-gray-400">{val.toLocaleString()}</div>
                                                </div>
                                          );
                                    })}
                              </div>
                              <div className="text-center mt-4 text-gray-500 text-sm">
                                    Total Abilities Cast: {totalCasts.toLocaleString()}
                              </div>
                        </motion.div>

                        {/* Economy & Pings */}
                        <div className="flex flex-col gap-8">
                              {/* Economy */}
                              <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-gray-900/50 p-6 rounded-3xl border border-yellow-500/20 flex-1"
                              >
                                    <div className="flex items-center gap-3 mb-4">
                                          <Coins className="text-yellow-400" />
                                          <h3 className="text-2xl font-bold text-white">Economy</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                          <div className="bg-gray-800/50 p-4 rounded-xl">
                                                <div className="text-gray-400 text-sm">Avg Gold/Game</div>
                                                <div className="text-2xl font-bold text-yellow-400">
                                                      {Math.round(stats.averageGold).toLocaleString()}
                                                </div>
                                          </div>
                                          <div className="bg-gray-800/50 p-4 rounded-xl">
                                                <div className="text-gray-400 text-sm">Avg CS/Game</div>
                                                <div className="text-2xl font-bold text-blue-400">
                                                      {Math.round(stats.averageCS)}
                                                </div>
                                          </div>
                                          <div className="col-span-2 bg-gray-800/50 p-4 rounded-xl flex justify-between items-center">
                                                <span className="text-gray-400">Total Gold Earned</span>
                                                <span className="text-xl font-bold text-white">
                                                      {(stats.totalGold / 1000000).toFixed(2)}M
                                                </span>
                                          </div>
                                    </div>
                              </motion.div>

                              {/* Pings */}
                              <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-gray-900/50 p-6 rounded-3xl border border-blue-500/20 flex-1"
                              >
                                    <div className="flex items-center gap-3 mb-4">
                                          <Target className="text-blue-400" />
                                          <h3 className="text-2xl font-bold text-white">Communication</h3>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                          <span className="text-gray-300">Total Pings</span>
                                          <span className="text-2xl font-bold text-white">{stats.pings.total.toLocaleString()}</span>
                                    </div>
                                    <div className="space-y-2">
                                          {[
                                                { label: 'Missing (?)', val: stats.pings.missing, color: 'bg-yellow-500' },
                                                { label: 'On My Way', val: stats.pings.onMyWay, color: 'bg-blue-500' },
                                                { label: 'Danger', val: stats.pings.danger, color: 'bg-red-500' },
                                          ].map((ping) => (
                                                <div key={ping.label} className="flex items-center gap-2 text-sm">
                                                      <span className="w-24 text-gray-400">{ping.label}</span>
                                                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                            <div
                                                                  className={`h-full ${ping.color}`}
                                                                  style={{ width: `${(ping.val / Math.max(1, stats.pings.total)) * 100}%` }}
                                                            />
                                                      </div>
                                                      <span className="text-gray-300 w-12 text-right">{ping.val}</span>
                                                </div>
                                          ))}
                                    </div>
                              </motion.div>
                        </div>
                  </div>
            </div>
      );
}
