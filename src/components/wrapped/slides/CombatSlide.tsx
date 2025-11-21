import React from 'react';
import { motion } from 'framer-motion';
import { AggregateStats } from '@/lib/stats-processor';
import { Sword, Shield, Heart, Zap } from 'lucide-react';

interface CombatSlideProps {
      stats: AggregateStats;
}

export default function CombatSlide({ stats }: CombatSlideProps) {
      const { combat } = stats;

      // Calculate percentages for bars (relative to the highest value to keep scale)
      const maxValue = Math.max(combat.totalDamageDealt, combat.totalDamageTaken, combat.totalMitigated, combat.totalHealing);

      const getPercent = (val: number) => Math.max(5, (val / maxValue) * 100);

      return (
            <div className="flex flex-col items-center justify-center w-full h-full">
                  <h2 className="text-4xl font-bold text-white mb-12 tracking-tight">Combat Performance</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">

                        {/* Damage Dealt */}
                        <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                              className="bg-white/5 p-6 rounded-2xl border border-white/10"
                        >
                              <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-red-500/20 rounded-lg text-red-500">
                                          <Sword size={24} />
                                    </div>
                                    <div>
                                          <h3 className="text-xl font-bold text-white">Damage Dealt</h3>
                                          <p className="text-sm text-gray-400">Total damage to champions</p>
                                    </div>
                              </div>
                              <div className="text-3xl font-bold text-red-400 mb-2">
                                    {(combat.totalDamageDealt / 1000).toFixed(1)}k
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                    <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: '100%' }}
                                          transition={{ duration: 1, delay: 0.4 }}
                                          className="bg-red-500 h-full rounded-full"
                                    />
                              </div>
                        </motion.div>

                        {/* Damage Taken */}
                        <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                              className="bg-white/5 p-6 rounded-2xl border border-white/10"
                        >
                              <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-gray-500/20 rounded-lg text-gray-400">
                                          <Shield size={24} />
                                    </div>
                                    <div>
                                          <h3 className="text-xl font-bold text-white">Damage Taken</h3>
                                          <p className="text-sm text-gray-400">Total damage received</p>
                                    </div>
                              </div>
                              <div className="text-3xl font-bold text-gray-300 mb-2">
                                    {(combat.totalDamageTaken / 1000).toFixed(1)}k
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                    <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${getPercent(combat.totalDamageTaken)}%` }}
                                          transition={{ duration: 1, delay: 0.5 }}
                                          className="bg-gray-500 h-full rounded-full"
                                    />
                              </div>
                        </motion.div>

                        {/* Self Mitigated */}
                        <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                              className="bg-white/5 p-6 rounded-2xl border border-white/10"
                        >
                              <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-orange-500/20 rounded-lg text-orange-500">
                                          <Shield size={24} />
                                    </div>
                                    <div>
                                          <h3 className="text-xl font-bold text-white">Self Mitigated</h3>
                                          <p className="text-sm text-gray-400">Damage blocked/reduced</p>
                                    </div>
                              </div>
                              <div className="text-3xl font-bold text-orange-400 mb-2">
                                    {(combat.totalMitigated / 1000).toFixed(1)}k
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                    <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${getPercent(combat.totalMitigated)}%` }}
                                          transition={{ duration: 1, delay: 0.6 }}
                                          className="bg-orange-500 h-full rounded-full"
                                    />
                              </div>
                        </motion.div>

                        {/* Healing */}
                        <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 }}
                              className="bg-white/5 p-6 rounded-2xl border border-white/10"
                        >
                              <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-green-500/20 rounded-lg text-green-500">
                                          <Heart size={24} />
                                    </div>
                                    <div>
                                          <h3 className="text-xl font-bold text-white">Total Healing</h3>
                                          <p className="text-sm text-gray-400">Restored health</p>
                                    </div>
                              </div>
                              <div className="text-3xl font-bold text-green-400 mb-2">
                                    {(combat.totalHealing / 1000).toFixed(1)}k
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                    <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${getPercent(combat.totalHealing)}%` }}
                                          transition={{ duration: 1, delay: 0.7 }}
                                          className="bg-green-500 h-full rounded-full"
                                    />
                              </div>
                        </motion.div>

                  </div>

                  <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mt-8 flex items-center gap-4 bg-purple-500/10 px-6 py-4 rounded-xl border border-purple-500/20"
                  >
                        <Zap className="text-purple-400" size={24} />
                        <div>
                              <p className="text-purple-200 font-semibold">Crowd Control Score</p>
                              <p className="text-2xl font-bold text-white">{combat.totalCCScore.toLocaleString()} <span className="text-sm font-normal text-gray-400">seconds of CC applied</span></p>
                        </div>
                  </motion.div>
            </div>
      );
}
