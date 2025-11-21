import React from 'react';
import { motion } from 'framer-motion';
import { AggregateStats } from '@/lib/stats-processor';
import { Clock, Calendar, Gamepad2 } from 'lucide-react';

interface ActivitySlideProps {
      stats: AggregateStats;
}

export default function ActivitySlide({ stats }: ActivitySlideProps) {
      const { activity, gameModes } = stats;

      // Helper to get max value for scaling
      const maxHourly = Math.max(...Object.values(activity.hourly), 1);
      const maxDaily = Math.max(...Object.values(activity.daily), 1);

      const hours = Array.from({ length: 24 }, (_, i) => i);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      const getHourlyOpacity = (count: number) => Math.max(0.2, count / maxHourly);
      const getDailyOpacity = (count: number) => Math.max(0.2, count / maxDaily);

      return (
            <div className="flex flex-col items-center justify-center w-full h-full">
                  <h2 className="text-4xl font-bold text-white mb-12 tracking-tight">Activity & Habits</h2>

                  <div className="grid grid-cols-1 gap-8 w-full max-w-4xl">

                        {/* Hourly Heatmap */}
                        <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="bg-white/5 p-6 rounded-2xl border border-white/10"
                        >
                              <div className="flex items-center gap-3 mb-4">
                                    <Clock className="text-blue-400" size={24} />
                                    <h3 className="text-xl font-bold text-white">Peak Hours</h3>
                              </div>

                              <div className="flex items-end justify-between h-32 gap-1">
                                    {hours.map(hour => {
                                          const count = activity.hourly[hour] || 0;
                                          return (
                                                <div key={hour} className="flex-1 flex flex-col items-center group relative">
                                                      <div
                                                            className="w-full bg-blue-500 rounded-t-sm transition-all duration-500"
                                                            style={{
                                                                  height: `${(count / maxHourly) * 100}%`,
                                                                  opacity: getHourlyOpacity(count)
                                                            }}
                                                      />
                                                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black/80 text-white text-xs p-1 rounded whitespace-nowrap z-10">
                                                            {hour}:00 - {count} games
                                                      </div>
                                                </div>
                                          );
                                    })}
                              </div>
                              <div className="flex justify-between mt-2 text-xs text-gray-500 px-1">
                                    <span>12 AM</span>
                                    <span>6 AM</span>
                                    <span>12 PM</span>
                                    <span>6 PM</span>
                                    <span>11 PM</span>
                              </div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {/* Daily Heatmap */}
                              <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white/5 p-6 rounded-2xl border border-white/10"
                              >
                                    <div className="flex items-center gap-3 mb-4">
                                          <Calendar className="text-green-400" size={24} />
                                          <h3 className="text-xl font-bold text-white">Weekly Routine</h3>
                                    </div>

                                    <div className="flex justify-between items-end h-32 gap-2">
                                          {days.map((day, idx) => {
                                                const count = activity.daily[idx] || 0;
                                                return (
                                                      <div key={day} className="flex-1 flex flex-col items-center gap-2 group relative">
                                                            <div
                                                                  className="w-full bg-green-500 rounded-md transition-all duration-500"
                                                                  style={{
                                                                        height: `${(count / maxDaily) * 100}%`,
                                                                        opacity: getDailyOpacity(count)
                                                                  }}
                                                            />
                                                            <span className="text-xs text-gray-400">{day}</span>
                                                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black/80 text-white text-xs p-1 rounded whitespace-nowrap z-10">
                                                                  {count} games
                                                            </div>
                                                      </div>
                                                );
                                          })}
                                    </div>
                              </motion.div>

                              {/* Game Modes */}
                              <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white/5 p-6 rounded-2xl border border-white/10 overflow-y-auto max-h-[250px]"
                              >
                                    <div className="flex items-center gap-3 mb-4">
                                          <Gamepad2 className="text-purple-400" size={24} />
                                          <h3 className="text-xl font-bold text-white">Game Modes</h3>
                                    </div>

                                    <div className="space-y-3">
                                          {Object.values(gameModes).sort((a, b) => b.games - a.games).map(mode => (
                                                <div key={mode.name} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                                      <span className="font-medium text-white">{mode.name}</span>
                                                      <div className="text-right">
                                                            <div className="text-sm font-bold text-white">{mode.games} Games</div>
                                                            <div className="text-xs text-gray-400">{((mode.wins / mode.games) * 100).toFixed(0)}% WR</div>
                                                      </div>
                                                </div>
                                          ))}
                                    </div>
                              </motion.div>
                        </div>

                  </div>
            </div>
      );
}
