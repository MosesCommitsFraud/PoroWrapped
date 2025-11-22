'use client';

import { AggregateStats } from '@/lib/stats-processor';
import { motion } from 'framer-motion';
import { Sword, Skull, Crosshair, Trophy } from 'lucide-react';

interface SlideProps {
      stats: AggregateStats;
}

export default function SlideCombat({ stats }: SlideProps) {
      const kdaColor = stats.kda >= 3 ? 'text-yellow-400' : stats.kda >= 2 ? 'text-blue-400' : 'text-gray-400';

      return (
            <div className="flex flex-col items-center justify-center text-center space-y-8 w-full max-w-5xl">
                  <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold text-red-500 mb-8"
                  >
                        COMBAT REPORT
                  </motion.h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        {/* KDA Section */}
                        <motion.div
                              initial={{ x: -50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="bg-gray-900/50 p-8 rounded-3xl border border-red-500/20 flex flex-col items-center"
                        >
                              <div className="text-6xl font-black mb-2 flex items-center gap-4">
                                    <span className={kdaColor}>{stats.kda.toFixed(2)}</span>
                                    <span className="text-2xl text-gray-500 font-normal">KDA</span>
                              </div>
                              <div className="flex gap-8 text-xl text-gray-300 mt-4">
                                    <div className="flex flex-col items-center">
                                          <span className="text-green-400 font-bold">{stats.totalKills}</span>
                                          <span className="text-xs text-gray-500">KILLS</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                          <span className="text-red-400 font-bold">{stats.totalDeaths}</span>
                                          <span className="text-xs text-gray-500">DEATHS</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                          <span className="text-blue-400 font-bold">{stats.totalAssists}</span>
                                          <span className="text-xs text-gray-500">ASSISTS</span>
                                    </div>
                              </div>
                        </motion.div>

                        {/* Damage & First Bloods */}
                        <motion.div
                              initial={{ x: 50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="bg-gray-900/50 p-8 rounded-3xl border border-red-500/20 flex flex-col justify-center space-y-6"
                        >
                              <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                          <Sword className="text-red-500" />
                                          <span className="text-gray-300">Damage Dealt</span>
                                    </div>
                                    <span className="text-2xl font-bold text-white">
                                          {(stats.combat.totalDamageDealt / 1000000).toFixed(1)}M
                                    </span>
                              </div>
                              <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                          <Skull className="text-purple-500" />
                                          <span className="text-gray-300">First Bloods</span>
                                    </div>
                                    <span className="text-2xl font-bold text-white">
                                          {stats.combat.firstBloods}
                                    </span>
                              </div>
                              <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                          <Crosshair className="text-orange-500" />
                                          <span className="text-gray-300">CC Score</span>
                                    </div>
                                    <span className="text-2xl font-bold text-white">
                                          {Math.round(stats.combat.totalCCScore)}
                                    </span>
                              </div>
                        </motion.div>
                  </div>

                  {/* Multikills */}
                  <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="w-full grid grid-cols-4 gap-4"
                  >
                        {[
                              { label: 'Double', count: stats.totalMultiKills.double, color: 'text-blue-400' },
                              { label: 'Triple', count: stats.totalMultiKills.triple, color: 'text-purple-400' },
                              { label: 'Quadra', count: stats.totalMultiKills.quadra, color: 'text-red-400' },
                              { label: 'Penta', count: stats.totalMultiKills.penta, color: 'text-yellow-400' },
                        ].map((kill, idx) => (
                              <div key={idx} className="bg-gray-800/50 p-4 rounded-2xl border border-white/5">
                                    <div className={`text-3xl font-bold ${kill.color}`}>{kill.count}</div>
                                    <div className="text-xs text-gray-500 uppercase">{kill.label}</div>
                              </div>
                        ))}
                  </motion.div>

                  {stats.totalMultiKills.penta > 0 && (
                        <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200, delay: 1 }}
                              className="absolute top-0 right-0 rotate-12"
                        >
                              <Trophy size={64} className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                        </motion.div>
                  )}
            </div>
      );
}
