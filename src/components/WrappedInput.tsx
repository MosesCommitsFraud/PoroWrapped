'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';

export default function WrappedInput() {
      const [riotId, setRiotId] = useState('');
      const [loading, setLoading] = useState(false);
      const router = useRouter();
      const containerRef = useRef<HTMLDivElement>(null);
      const glowRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
            const container = containerRef.current;
            const glow = glowRef.current;
            if (!container || !glow) return;

            // Set default position (right side)
            // Glow width is 204px
            // Let's set it to roughly center it on the right edge initially or a bit off-center
            // Reference said "static glow on the right side"
            // If button width is dynamic, we might want to just calculate on mount/resize
            // For now, let's just initialize it to a "right" position based on container width
            const rect = container.getBoundingClientRect();
            // Default to right side: width - 50px (just inside right edge)
            const defaultX = rect.width - 102; // center of glow at right edge
            
            glow.style.transform = `translateX(${defaultX}px) translateZ(0)`;

            const handleMouseMove = (e: MouseEvent) => {
                  const rect = container.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  glow.style.transition = 'none'; // Disable transition for instant tracking
                  glow.style.transform = `translateX(${x - 102}px) translateZ(0)`;
            };

            const handleMouseLeave = () => {
                 const rect = container.getBoundingClientRect();
                 const defaultX = rect.width - 60; // Reset to right side
                 glow.style.transition = 'transform 0.5s ease-out'; // Smooth return
                 glow.style.transform = `translateX(${defaultX}px) translateZ(0)`;
            };

            // Initial set
            handleMouseLeave();

            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseleave', handleMouseLeave);
            
            return () => {
                container.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('mouseleave', handleMouseLeave);
            };
      }, []);

      const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);

            const parts = riotId.split('#');
            if (parts.length < 2) {
                  alert("Please use format Name#Tag");
                  setLoading(false);
                  return;
            }

            const gameName = parts[0].trim();
            const tagLine = parts[1].trim();

            router.push(`/profile/${encodeURIComponent(`${gameName}-${tagLine}`)}`);
      };

      return (
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
                  <div className="relative">
                        <input
                              type="text"
                              value={riotId}
                              onChange={(e) => setRiotId(e.target.value)}
                              placeholder="GameName #TagLine"
                              className="w-full bg-white/10 border border-transparent rounded-xl py-4 px-6 pl-12 text-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted text-white"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
                  </div>

                  <div className="relative inline-flex items-center z-10 w-full" ref={containerRef}>
                        {/* Blur Borders */}
                        <div className="border-button-light-blur absolute left-1/2 top-1/2 h-[calc(100%+9px)] w-[calc(100%+9px)] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform opacity-100 pointer-events-none">
                              <div className="border-button-light relative h-full w-full rounded-full"></div>
                        </div>
                        <div className="border-button-light-blur absolute left-1/2 top-1/2 h-[calc(100%+9px)] w-[calc(100%+9px)] -translate-x-1/2 -translate-y-1/2 scale-x-[-1] transform rounded-full will-change-transform opacity-0 pointer-events-none">
                              <div className="border-button-light relative h-full w-full rounded-full"></div>
                        </div>

                        {/* Main Button Content */}
                        <button
                              type="submit"
                              disabled={loading}
                              className="w-full transition-colors duration-200 transition-all duration-200 uppercase font-bold flex items-center justify-center h-14 px-16 text-lg text-black -tracking-[0.015em] relative z-10 overflow-hidden rounded-full border border-white/60 bg-[#d1d1d1] space-x-1 px-16 sm:pl-[59px] sm:pr-[52px] hover:bg-white"
                        >
                               {/* Glow Effect Container - MOVED INSIDE BUTTON for clipping */}
                              <div className="absolute -z-10 flex w-[204px] items-center justify-center pointer-events-none left-0 top-0 h-full" 
                                    ref={glowRef} 
                                    style={{ transform: 'translateX(0px) translateZ(0px)' }}>
                                    <div className="absolute top-1/2 h-[121px] w-[121px] -translate-y-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,#FFFFF5_3.5%,_#FFAA81_26.5%,#FFDA9F_37.5%,rgba(255,170,129,0.50)_49%,rgba(210,106,58,0.00)_92.5%)]"></div>
                                    <div className="absolute top-1/2 h-[103px] w-[204px] -translate-y-1/2 bg-[radial-gradient(43.3%_44.23%_at_50%_49.51%,_#FFFFF7_29%,_#FFFACD_48.5%,_#F4D2BF_60.71%,rgba(214,211,210,0.00)_100%)] blur-[5px]"></div>
                              </div>

                              {loading ? (
                                    <>
                                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                          Searching...
                                    </>
                              ) : (
                                    <>
                                          <span className="relative z-10">Search Summoner</span>
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 9" className="h-[9px] w-[17px] text-black ml-2 relative z-10">
                                                <path fill="currentColor" fillRule="evenodd" d="m12.495 0 4.495 4.495-4.495 4.495-.99-.99 2.805-2.805H0v-1.4h14.31L11.505.99z" clipRule="evenodd"></path>
                                          </svg>
                                    </>
                              )}
                        </button>
                  </div>
            </form>
      );
}
