'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AggregateStats } from '@/lib/stats-processor';
import Slide from './Slide';
import IntroSlide from './slides/IntroSlide';
import ChampionsSlide from './slides/ChampionsSlide';
import ItemsSlide from './slides/ItemsSlide';
import StatsSlide from './slides/StatsSlide';
import CombatSlide from './slides/CombatSlide';
import ObjectivesSlide from './slides/ObjectivesSlide';
import SocialSlide from './slides/SocialSlide';
import ActivitySlide from './slides/ActivitySlide';
import SummarySlide from './slides/SummarySlide';

interface WrappedSlidesProps {
      stats: AggregateStats;
}

export default function WrappedSlides({ stats }: WrappedSlidesProps) {
      const [currentSlide, setCurrentSlide] = useState(0);
      const [direction, setDirection] = useState(0);

      // We don't pass onNext/onPrev to children anymore as navigation is handled here
      // But we can pass them if we want internal buttons. For now, let's keep it simple.
      const slides = [
            <IntroSlide key="intro" stats={stats} />,
            <ChampionsSlide key="champs" stats={stats} />,
            <ItemsSlide key="items" stats={stats} />,
            <CombatSlide key="combat" stats={stats} />,
            <ObjectivesSlide key="objectives" stats={stats} />,
            <SocialSlide key="social" stats={stats} />,
            <ActivitySlide key="activity" stats={stats} />,
            <StatsSlide key="stats" stats={stats} />,
            <SummarySlide key="summary" stats={stats} />,
      ];

      const nextSlide = () => {
            if (currentSlide < slides.length - 1) {
                  setDirection(1);
                  setCurrentSlide(prev => prev + 1);
            }
      };

      const prevSlide = () => {
            if (currentSlide > 0) {
                  setDirection(-1);
                  setCurrentSlide(prev => prev - 1);
            }
      };

      // Keyboard navigation
      useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                  if (e.key === 'ArrowRight') nextSlide();
                  if (e.key === 'ArrowLeft') prevSlide();
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
      }, [currentSlide]);

      return (
            <div className="relative w-full h-screen bg-[#0a0a0c] overflow-hidden">
                  {/* Progress Bar */}
                  <div className="absolute top-0 left-0 w-full h-1 flex gap-1 z-50 px-2 pt-2">
                        {slides.map((_, index) => (
                              <div
                                    key={index}
                                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${index <= currentSlide ? 'bg-white' : 'bg-gray-700'
                                          }`}
                              />
                        ))}
                  </div>

                  {/* Slides */}
                  <div className="relative w-full h-full">
                        {slides.map((slide, index) => (
                              <Slide key={index} isActive={currentSlide === index} direction={direction}>
                                    {slide}
                              </Slide>
                        ))}
                  </div>

                  {/* Navigation Controls */}
                  <div className="absolute bottom-8 left-0 w-full flex justify-between px-12 z-50">
                        <button
                              onClick={prevSlide}
                              disabled={currentSlide === 0}
                              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-0 transition-all"
                        >
                              <ChevronLeft className="w-8 h-8" />
                        </button>
                        <button
                              onClick={nextSlide}
                              disabled={currentSlide === slides.length - 1}
                              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-0 transition-all"
                        >
                              <ChevronRight className="w-8 h-8" />
                        </button>
                  </div>
            </div>
      );
}
