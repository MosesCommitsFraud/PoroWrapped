import React from 'react';
import { motion } from 'framer-motion';
import { AggregateStats } from '@/lib/stats-processor';
import { Users, MessageCircle, Flame, Frown } from 'lucide-react';

interface SocialSlideProps {
      stats: AggregateStats;
}

export default function SocialSlide({ stats }: SocialSlideProps) {
      const { teammates, pings, streaks } = stats;

      // Sort teammates by games played
      const topTeammates = Object.values(teammates)
            .sort((a, b) => b.games - a.games)
            .slice(0, 3);

      const containerVariants = {
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      };

      const itemVariants = {
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
      };

      return (
            <div className="flex flex-col items-center justify-center w-full h-full">
                  <h2 className="text-4xl font-bold text-white mb-12 tracking-tight">Social & Playstyle</h2>

                  <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
                  >

                        {/* Top Teammates */}
                        <motion.div variants={itemVariants} className="bg-white/5 p-6 rounded-2xl border border-white/10">
                              <div className="flex items-center gap-3 mb-4">
                                    <Users className="text-blue-400" size={24} />
                                    <h3 className="text-xl font-bold text-white">Squad Goals</h3>
                              </div>

                              <div className="space-y-4">
                                    {topTeammates.length > 0 ? topTeammates.map((tm, idx) => (
                                          <div key={tm.name} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-xs">
                                                            {idx + 1}
                                                      </div>
                                                      <span className="font-medium text-white truncate max-w-[120px]">{tm.name}</span>
                                                </div>
                                                <div className="text-right">
                                                      <div className="text-sm font-bold text-white">{tm.games} Games</div>
                                                      <div className="text-xs text-gray-400">{((tm.wins / tm.games) * 100).toFixed(0)}% WR</div>
                                                </div>
                                          </div>
                                    )) : (
                                          <div className="text-center text-gray-500 py-8">No duo partners found... playing solo?</div>
                                    )}
                              </div>
                        </motion.div>

                        {/* Pings */}
                        <motion.div variants={itemVariants} className="bg-white/5 p-6 rounded-2xl border border-white/10">
                              <div className="flex items-center gap-3 mb-4">
                                    <MessageCircle className="text-yellow-400" size={24} />
                                    <h3 className="text-xl font-bold text-white">Communication Style</h3>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-3 rounded-lg text-center">
                                          <div className="text-2xl font-bold text-red-400">{pings.danger + pings.getBack}</div>
                                          <div className="text-xs text-gray-400 uppercase">Danger Pings</div>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg text-center">
                                          <div className="text-2xl font-bold text-blue-400">{pings.onMyWay + pings.assist}</div>
                                          <div className="text-xs text-gray-400 uppercase">On My Way</div>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg text-center">
                                          <div className="text-2xl font-bold text-yellow-400">{pings.missing}</div>
                                          <div className="text-xs text-gray-400 uppercase">"Missing" (?)</div>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg text-center">
                                          <div className="text-2xl font-bold text-purple-400">{pings.total}</div>
                                          <div className="text-xs text-gray-400 uppercase">Total Pings</div>
                                    </div>
                              </div>
                        </motion.div>

                        {/* Streaks */}
                        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 grid grid-cols-2 gap-6">
                              <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 p-6 rounded-2xl border border-green-500/20 flex items-center justify-between">
                                    <div>
                                          <div className="text-sm text-green-300 uppercase tracking-wider mb-1">Best Win Streak</div>
                                          <div className="text-4xl font-bold text-white">{streaks.longestWin}</div>
                                    </div>
                                    <Flame className="text-green-500" size={48} />
                              </div>

                              <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 p-6 rounded-2xl border border-red-500/20 flex items-center justify-between">
                                    <div>
                                          <div className="text-sm text-red-300 uppercase tracking-wider mb-1">Worst Loss Streak</div>
                                          <div className="text-4xl font-bold text-white">{streaks.longestLoss}</div>
                                    </div>
                                    <Frown className="text-red-500" size={48} />
                              </div>
                        </motion.div>

                  </motion.div>
            </div>
      );
}
