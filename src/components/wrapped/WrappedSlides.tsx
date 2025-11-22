'use client';

import { useState, useEffect, useCallback } from 'react';
import { AggregateStats } from '@/lib/stats-processor';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Slides
import SlideIntro from './SlideIntro';
import SlideCombat from './SlideCombat';
import SlideChampions from './SlideChampions';
import SlideGameplay from './SlideGameplay';
import SlideObjectives from './SlideObjectives';
import SlideSocial from './SlideSocial';
import SlideMisc from './SlideMisc';
import SlideHeatmap from './SlideHeatmap';
import SlideItems from './SlideItems';

interface WrappedSlidesProps {
      stats: AggregateStats;
}

export default function WrappedSlides({ stats }: WrappedSlidesProps) {
      const [currentSlide, setCurrentSlide] = useState(0);
      const [direction, setDirection] = useState(0);

      const slides = [
            { id: 'intro', component: <SlideIntro stats={stats} /> },
            { id: 'combat', component: <SlideCombat stats={stats} /> },
            { id: 'champions', component: <SlideChampions stats={stats} /> },
            { id: 'gameplay', component: <SlideGameplay stats={stats} /> },
            { id: 'objectives', component: <SlideObjectives stats={stats} /> },
            { id: 'social', component: <SlideSocial stats={stats} /> },
            { id: 'heatmap', component: <SlideHeatmap stats={stats} /> },
            { id: 'items', component: <SlideItems stats={stats} /> },
            { id: 'misc', component: <SlideMisc stats={stats} /> },
      ];

      const nextSlide = useCallback(() => {
            if (currentSlide < slides.length - 1) {
                  setDirection(1);
                  setCurrentSlide(prev => prev + 1);
            }
      }, [currentSlide, slides.length]);

      const prevSlide = useCallback(() => {
            if (currentSlide > 0) {
                  setDirection(-1);
                  setCurrentSlide(prev => prev - 1);
            }
      }, [currentSlide]);

      // Keyboard navigation
      useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                  if (e.key === 'ArrowRight') nextSlide();
                  if (e.key === 'ArrowLeft') prevSlide();
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
      }, [nextSlide, prevSlide]);

      const variants = {
            enter: (direction: number) => ({
                  x: direction > 0 ? 1000 : -1000,
                  opacity: 0
            }),
            center: {
                  zIndex: 1,
                  x: 0,
                  opacity: 1
            },
            exit: (direction: number) => ({
                  zIndex: 0,
                  x: direction < 0 ? 1000 : -1000,
                  opacity: 0
            })
      };

      return (
            <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0c] flex items-center justify-center">
                  {/* Background Elements */}
                  <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-5 pointer-events-none"></div>
                  <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]"></div>
                  <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]"></div>

                  {/* Slide Content */}
                  <div className="relative w-full max-w-6xl h-full max-h-[90vh] flex items-center justify-center p-4">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                              <motion.div
                                    key={currentSlide}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                          x: { type: "spring", stiffness: 300, damping: 30 },
                                          opacity: { duration: 0.2 }
                                    }}
                                    className="w-full h-full flex items-center justify-center"
                              >
                                    {slides[currentSlide].component}
                              </motion.div>
                        </AnimatePresence>
                  </div>

                  {/* Navigation Controls */}
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 z-50">
                        <button
                              onClick={prevSlide}
                              disabled={currentSlide === 0}
                              className={`p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all ${currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
                        >
                              <ChevronLeft size={24} />
                        </button>

                        <div className="flex gap-2">
                              {slides.map((_, index) => (
                                    <div
                                          key={index}
                                          className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-yellow-500' : 'w-2 bg-gray-700'}`}
                                    />
                              ))}
                        </div>

                        <button
                              onClick={nextSlide}
                              disabled={currentSlide === slides.length - 1}
                              className={`p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all ${currentSlide === slides.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
                        >
                              <ChevronRight size={24} />
                        </button>
                  </div>
            </div>
      );
}
