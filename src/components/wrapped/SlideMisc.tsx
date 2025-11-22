'use client';

import { AggregateStats } from '@/lib/stats-processor';
import { motion } from 'framer-motion';
import { Snowflake, Swords } from 'lucide-react';

interface SlideProps {
      stats: AggregateStats;
}

export default function SlideMisc({ stats }: SlideProps) {
      const blueGames = stats.sideSelection.blue.games;
      const blueWins = stats.sideSelection.blue.wins;
      const redGames = stats.sideSelection.red.games;
      const redWins = stats.sideSelection.red.wins;

      const blueWR = blueGames > 0 ? (blueWins / blueGames) * 100 : 0;
      const redWR = redGames > 0 ? (redWins / redGames) * 100 : 0;

      return (
            <div className="flex flex-col items-center justify-center w-full max-w-5xl h-full p-4">
                  <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-gray-300 mb-12"
                  >
                        THE BATTLEFIELD
                  </motion.h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
                        {/* Side Selection */}
                        <motion.div
                              initial={{ x: -50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="bg-gray-900/50 p-8 rounded-3xl border border-gray-700"
                        >
                              <h3 className="text-2xl font-bold text-white mb-6 text-center">Side Selection</h3>

                              <div className="flex gap-4 h-48">
                                    {/* Blue Side */}
                                    <div className="flex-1 flex flex-col items-center justify-end relative group">
                                          <div className="text-blue-400 font-bold mb-2">{blueWR.toFixed(1)}% WR</div>
                                          <div className="w-full bg-blue-900/30 rounded-t-xl relative overflow-hidden h-full">
                                                <motion.div
                                                      initial={{ height: 0 }}
                                                      animate={{ height: `${blueWR}%` }}
                                                      transition={{ delay: 0.5, duration: 1 }}
                                                      className="absolute bottom-0 w-full bg-blue-500"
                                                />
                                          </div>
                                          <div className="mt-2 text-blue-300 font-bold">BLUE SIDE</div>
                                          <div className="text-xs text-gray-500">{blueGames} Games</div>
                                    </div>

                                    {/* Red Side */}
                                    <div className="flex-1 flex flex-col items-center justify-end relative group">
                                          <div className="text-red-400 font-bold mb-2">{redWR.toFixed(1)}% WR</div>
                                          <div className="w-full bg-red-900/30 rounded-t-xl relative overflow-hidden h-full">
                                                <motion.div
                                                      initial={{ height: 0 }}
                                                      animate={{ height: `${redWR}%` }}
                                                      transition={{ delay: 0.5, duration: 1 }}
                                                      className="absolute bottom-0 w-full bg-red-500"
                                                />
                                          </div>
                                          <div className="mt-2 text-red-300 font-bold">RED SIDE</div>
                                          <div className="text-xs text-gray-500">{redGames} Games</div>
                                    </div>
                              </div>
                        </motion.div>

                        {/* Game Modes */}
                        <motion.div
                              initial={{ x: 50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="bg-gray-900/50 p-8 rounded-3xl border border-gray-700 flex flex-col justify-center"
                        >
                              <h3 className="text-2xl font-bold text-white mb-6 text-center">Mode Mastery</h3>

                              <div className="space-y-6">
                                    {/* ARAM */}
                                    <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl">
                                          <div className="flex items-center gap-3">
                                                <Snowflake className="text-cyan-400" />
                                                <div>
                                                      <div className="font-bold text-white">ARAM</div>
                                                      <div className="text-xs text-gray-400">{stats.aram.games} Games</div>
                                                </div>
                                          </div>
                                          <div className="text-right">
                                                <div className="text-cyan-400 font-bold">{stats.aram.snowballsHit}</div>
                                                <div className="text-xs text-gray-500">Snowballs Hit</div>
                                          </div>
                                    </div>

                                    {/* Arena */}
                                    <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl">
                                          <div className="flex items-center gap-3">
                                                <Swords className="text-orange-400" />
                                                <div>
                                                      <div className="font-bold text-white">Arena</div>
                                                      <div className="text-xs text-gray-400">{stats.arena.games} Games</div>
                                                </div>
                                          </div>
                                          <div className="text-right">
                                                <div className="text-orange-400 font-bold">{stats.arena.placements[1] || 0}</div>
                                                <div className="text-xs text-gray-500">1st Places</div>
                                          </div>
                                    </div>
                              </div>
                        </motion.div>
                  </div>
            </div>
      );
}
