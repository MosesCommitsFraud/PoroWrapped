'use client';

import { AggregateStats } from '@/lib/stats-processor';
import { motion } from 'framer-motion';
import { Skull, Clock, Target, Eye } from 'lucide-react';

export default function StatsSlide({ stats }: { stats: AggregateStats }) {
      return (
            <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
                  <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-16 text-yellow-500"
                  >
                        The Nitty Gritty
                  </motion.h2>

                  <div className="grid grid-cols-2 gap-12 w-full">
                        {/* Grey Screen Simulator */}
                        <motion.div
                              initial={{ x: -50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800 flex items-center gap-6"
                        >
                              <div className="p-4 bg-gray-800 rounded-2xl">
                                    <Skull className="w-12 h-12 text-gray-400" />
                              </div>
                              <div>
                                    <h3 className="text-gray-400 text-lg mb-1">Grey Screen Simulator</h3>
                                    <p className="text-4xl font-bold text-white">{(stats.totalTimeSpentDead / 60).toFixed(0)} min</p>
                                    <p className="text-sm text-gray-500 mt-1">Spent contemplating life choices</p>
                              </div>
                        </motion.div>

                        {/* KDA */}
                        <motion.div
                              initial={{ x: 50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800 flex items-center gap-6"
                        >
                              <div className="p-4 bg-yellow-500/10 rounded-2xl">
                                    <Target className="w-12 h-12 text-yellow-500" />
                              </div>
                              <div>
                                    <h3 className="text-gray-400 text-lg mb-1">KDA Ratio</h3>
                                    <p className="text-4xl font-bold text-white">{stats.kda.toFixed(2)}</p>
                                    <p className="text-sm text-gray-500 mt-1">{stats.totalKills} / {stats.totalDeaths} / {stats.totalAssists}</p>
                              </div>
                        </motion.div>

                        {/* CS */}
                        <motion.div
                              initial={{ x: -50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.4 }}
                              className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800 flex items-center gap-6"
                        >
                              <div className="p-4 bg-blue-500/10 rounded-2xl">
                                    <Clock className="w-12 h-12 text-blue-500" />
                              </div>
                              <div>
                                    <h3 className="text-gray-400 text-lg mb-1">Farming Simulator</h3>
                                    <p className="text-4xl font-bold text-white">{stats.totalCS.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500 mt-1">Minions harmed</p>
                              </div>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                              initial={{ x: 50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.5 }}
                              className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800 flex items-center gap-6"
                        >
                              <div className="p-4 bg-purple-500/10 rounded-2xl">
                                    <Eye className="w-12 h-12 text-purple-500" />
                              </div>
                              <div>
                                    <h3 className="text-gray-400 text-lg mb-1">Vision Score</h3>
                                    <p className="text-4xl font-bold text-white">{stats.visionScore.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500 mt-1">Map awareness (hopefully)</p>
                              </div>
                        </motion.div>
                  </div>
            </div>
      );
}
