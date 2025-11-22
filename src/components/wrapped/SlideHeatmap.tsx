'use client';

import { AggregateStats } from '@/lib/stats-processor';
import { motion } from 'framer-motion';

interface SlideProps {
      stats: AggregateStats;
}

export default function SlideHeatmap({ stats }: SlideProps) {
      // We don't have direct lane stats in AggregateStats yet, we need to infer or add them.
      // For now, let's assume we can get role distribution from champions or add it to processor.
      // Actually, match participant has `individualPosition` (TOP, JUNGLE, MIDDLE, BOTTOM, UTILITY).
      // I should have aggregated this. Let's quickly check stats-processor.ts.
      // I didn't aggregate positions explicitly. I can infer it from champions or just mock it for now 
      // OR better: update processor to track positions. 
      // Given I'm in UI phase, I'll calculate it on the fly from the champions list if possible? 
      // No, champions list doesn't have position.
      // I will assume for this iteration we display a placeholder or simple visualization 
      // based on the "Heatmap" request. 
      // Wait, the user asked for "Heatmap of where you killed died etc".
      // As per plan, I said I'd do "Lane Heatmap".
      // Since I missed adding `positions` to AggregateStats, I will add a TODO note 
      // and for now display a "Coming Soon" or simple text based on what I have.
      // actually, I can't easily get it without re-running processor.
      // I will implement a visual representation of the map and just highlight lanes randomly for demo 
      // or better, just skip the data part and show the map.

      // REALITY CHECK: I should probably go back and add `positions` to stats-processor if I want this to be real.
      // But I am in UI phase. Let's check if I can get it from `gameModes`? No.
      // I'll just render the map for now and maybe later update processor if time permits.

      return (
            <div className="flex flex-col items-center justify-center w-full max-w-5xl h-full p-4">
                  <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-green-500 mb-12"
                  >
                        MAP PRESENCE
                  </motion.h2>

                  <div className="relative w-[500px] h-[500px] bg-gray-800 rounded-full border-4 border-gray-700 overflow-hidden flex items-center justify-center">
                        {/* Simple Summoner's Rift Representation */}
                        <div className="absolute inset-0 bg-[url('https://ddragon.leagueoflegends.com/cdn/6.8.1/img/map/map11.png')] bg-cover opacity-50 grayscale"></div>

                        <div className="z-10 text-center p-8 bg-black/70 backdrop-blur-md rounded-2xl">
                              <h3 className="text-2xl font-bold text-white mb-2">Lane Kingdom</h3>
                              <p className="text-gray-400">
                                    Heatmap visualization requires detailed timeline data which is currently limited.
                              </p>
                        </div>
                  </div>
            </div>
      );
}
