'use client';

import { AggregateStats } from '@/lib/stats-processor';
import { motion } from 'framer-motion';

interface SlideProps {
      stats: AggregateStats;
}

export default function SlideObjectives({ stats }: SlideProps) {
      return (
            <div className="flex flex-col items-center justify-center w-full max-w-5xl h-full p-4">
                  <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-orange-500 mb-12"
                  >
                        OBJECTIVE CONTROL
                  </motion.h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                        {[
                              { label: 'Dragons', count: stats.objectives.dragons, icon: '🐉', color: 'text-red-400', border: 'border-red-500/20' },
                              { label: 'Barons', count: stats.objectives.barons, icon: '👾', color: 'text-purple-400', border: 'border-purple-500/20' },
                              { label: 'Towers', count: stats.objectives.towers, icon: '🏰', color: 'text-blue-400', border: 'border-blue-500/20' },
                              { label: 'Heralds', count: stats.objectives.heralds, icon: '🐞', color: 'text-purple-300', border: 'border-purple-300/20' },
                        ].map((obj, idx) => (
                              <motion.div
                                    key={obj.label}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 + (idx * 0.1) }}
                                    className={`bg-gray-900/50 p-6 rounded-3xl border ${obj.border} flex flex-col items-center justify-center aspect-square`}
                              >
                                    <div className="text-4xl mb-4">{obj.icon}</div>
                                    <div className={`text-4xl font-bold ${obj.color} mb-2`}>{obj.count}</div>
                                    <div className="text-gray-400 uppercase text-sm tracking-wider">{obj.label}</div>
                              </motion.div>
                        ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-6">
                        <motion.div
                              initial={{ y: 50, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.6 }}
                              className="bg-gray-900/50 p-6 rounded-3xl border border-green-500/20 flex items-center justify-between"
                        >
                              <div>
                                    <div className="text-gray-400 text-sm uppercase mb-1">Scuttle Crabs</div>
                                    <div className="text-3xl font-bold text-green-400">{stats.objectives.scuttles}</div>
                              </div>
                              <div className="text-4xl">🦀</div>
                        </motion.div>

                        <motion.div
                              initial={{ y: 50, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.7 }}
                              className="bg-gray-900/50 p-6 rounded-3xl border border-yellow-500/20 flex items-center justify-between"
                        >
                              <div>
                                    <div className="text-gray-400 text-sm uppercase mb-1">Early Takedowns</div>
                                    <div className="text-xs text-gray-500 mb-2">Before 1st Camp Spawn</div>
                                    <div className="text-3xl font-bold text-yellow-400">{stats.objectives.earlyTakedowns}</div>
                              </div>
                              <div className="text-4xl">⚡</div>
                        </motion.div>
                  </div>
            </div>
      );
}
