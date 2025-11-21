import React from 'react';
import { motion } from 'framer-motion';
import { AggregateStats } from '@/lib/stats-processor';
import { Eye, TowerControl, Map, Target } from 'lucide-react';

interface ObjectivesSlideProps {
      stats: AggregateStats;
}

export default function ObjectivesSlide({ stats }: ObjectivesSlideProps) {
      const { objectives, visionScore, averageVisionScore } = stats;

      const containerVariants = {
            hidden: { opacity: 0 },
            visible: {
                  opacity: 1,
                  transition: {
                        staggerChildren: 0.1
                  }
            }
      };

      const itemVariants = {
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
      };

      return (
            <div className="flex flex-col items-center justify-center w-full h-full">
                  <h2 className="text-4xl font-bold text-white mb-12 tracking-tight">Map Control & Vision</h2>

                  <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 gap-6 w-full max-w-4xl"
                  >
                        {/* Objectives Grid */}
                        <motion.div variants={itemVariants} className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center text-center">
                                    <div className="p-3 bg-red-500/20 rounded-full text-red-500 mb-2">
                                          <Target size={24} />
                                    </div>
                                    <span className="text-2xl font-bold text-white">{objectives.dragons}</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Dragons</span>
                              </div>
                              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center text-center">
                                    <div className="p-3 bg-purple-500/20 rounded-full text-purple-500 mb-2">
                                          <Target size={24} />
                                    </div>
                                    <span className="text-2xl font-bold text-white">{objectives.barons}</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Barons</span>
                              </div>
                              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center text-center">
                                    <div className="p-3 bg-blue-500/20 rounded-full text-blue-500 mb-2">
                                          <Map size={24} />
                                    </div>
                                    <span className="text-2xl font-bold text-white">{objectives.towers}</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Towers</span>
                              </div>
                              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center text-center">
                                    <div className="p-3 bg-pink-500/20 rounded-full text-pink-500 mb-2">
                                          <Target size={24} />
                                    </div>
                                    <span className="text-2xl font-bold text-white">{objectives.heralds}</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Heralds</span>
                              </div>
                        </motion.div>

                        {/* Vision Score */}
                        <motion.div variants={itemVariants} className="col-span-2 bg-gradient-to-r from-indigo-900/40 to-blue-900/40 p-8 rounded-2xl border border-indigo-500/30 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Eye size={120} />
                              </div>

                              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="text-center md:text-left">
                                          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2 justify-center md:justify-start">
                                                <Eye className="text-indigo-400" />
                                                Visionary
                                          </h3>
                                          <p className="text-gray-300 max-w-md">
                                                You've illuminated the rift, providing crucial information to your team.
                                          </p>
                                    </div>

                                    <div className="flex gap-8">
                                          <div className="text-center">
                                                <div className="text-4xl font-bold text-indigo-300 mb-1">{visionScore.toLocaleString()}</div>
                                                <div className="text-sm text-indigo-200/70 uppercase tracking-wider">Total Score</div>
                                          </div>
                                          <div className="text-center">
                                                <div className="text-4xl font-bold text-blue-300 mb-1">{averageVisionScore.toFixed(1)}</div>
                                                <div className="text-sm text-blue-200/70 uppercase tracking-wider">Avg per Game</div>
                                          </div>
                                    </div>
                              </div>
                        </motion.div>

                  </motion.div>
            </div>
      );
}
