'use client';

import { AggregateStats } from '@/lib/stats-processor';
import { motion } from 'framer-motion';
import { Users, Heart, Skull } from 'lucide-react';

interface SlideProps {
      stats: AggregateStats;
}

export default function SlideSocial({ stats }: SlideProps) {
      const friendsList = Object.entries(stats.social.friends)
            .sort(([, a], [, b]) => b.games - a.games)
            .slice(0, 3);

      return (
            <div className="flex flex-col items-center justify-center w-full max-w-5xl h-full p-4">
                  <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-pink-500 mb-12"
                  >
                        SOCIAL CIRCLE
                  </motion.h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
                        {/* Friends Stats */}
                        <motion.div
                              initial={{ x: -50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="bg-gray-900/50 p-8 rounded-3xl border border-pink-500/20"
                        >
                              <div className="flex items-center gap-3 mb-6">
                                    <Users className="text-pink-400" />
                                    <h3 className="text-2xl font-bold text-white">The Squad</h3>
                              </div>

                              <div className="space-y-6">
                                    {friendsList.length > 0 ? (
                                          friendsList.map(([name, data], idx) => (
                                                <div key={name} className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl">
                                                      <div className="flex items-center gap-4">
                                                            <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold">
                                                                  {idx + 1}
                                                            </div>
                                                            <div className="font-bold text-white">{name.split('#')[0]}</div>
                                                      </div>
                                                      <div className="text-right">
                                                            <div className="text-sm text-gray-400">{data.games} Games</div>
                                                            <div className={`text-xs font-bold ${((data.wins / data.games) >= 0.5) ? 'text-green-400' : 'text-red-400'}`}>
                                                                  {((data.wins / data.games) * 100).toFixed(0)}% WR
                                                            </div>
                                                      </div>
                                                </div>
                                          ))
                                    ) : (
                                          <div className="text-center text-gray-500 py-8">
                                                Playing solo? No frequent friends found.
                                          </div>
                                    )}
                              </div>
                        </motion.div>

                        {/* Nemesis & Best Friend */}
                        <div className="flex flex-col gap-8">
                              {stats.best.bestFriend.name && (
                                    <motion.div
                                          initial={{ x: 50, opacity: 0 }}
                                          animate={{ x: 0, opacity: 1 }}
                                          transition={{ delay: 0.3 }}
                                          className="bg-gray-900/50 p-6 rounded-3xl border border-pink-500/20 flex-1 flex flex-col justify-center items-center text-center"
                                    >
                                          <Heart className="text-pink-500 mb-4 w-12 h-12" fill="currentColor" />
                                          <div className="text-gray-400 uppercase text-sm mb-2">Bestie</div>
                                          <div className="text-3xl font-bold text-white mb-1">
                                                {stats.best.bestFriend.name.split('#')[0]}
                                          </div>
                                          <div className="text-pink-400 font-bold">
                                                {stats.best.bestFriend.wins} Wins Together
                                          </div>
                                    </motion.div>
                              )}

                              {stats.nemesis.worstEnemy.name && (
                                    <motion.div
                                          initial={{ x: 50, opacity: 0 }}
                                          animate={{ x: 0, opacity: 1 }}
                                          transition={{ delay: 0.4 }}
                                          className="bg-gray-900/50 p-6 rounded-3xl border border-red-500/20 flex-1 flex flex-col justify-center items-center text-center"
                                    >
                                          <Skull className="text-red-500 mb-4 w-12 h-12" />
                                          <div className="text-gray-400 uppercase text-sm mb-2">Nemesis</div>
                                          <div className="text-3xl font-bold text-white mb-1">
                                                {stats.nemesis.worstEnemy.name.split('#')[0]}
                                          </div>
                                          <div className="text-red-400 font-bold">
                                                Lost {stats.nemesis.worstEnemy.losses} times to them
                                          </div>
                                    </motion.div>
                              )}
                        </div>
                  </div>

                  <div className="flex justify-between w-full text-sm text-gray-500 px-4">
                        <div>Unique Teammates: {stats.social.uniqueTeammates}</div>
                        <div>Unique Enemies: {stats.social.uniqueEnemies}</div>
                  </div>
            </div>
      );
}
