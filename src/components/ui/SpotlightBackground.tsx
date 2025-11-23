"use client";

import React, { useEffect, useRef, useState } from "react";

export function SpotlightBackground() {
      const containerRef = useRef<HTMLDivElement>(null);
      const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

      useEffect(() => {
            const handleMouseMove = (event: MouseEvent) => {
                  setMousePosition({ x: event.clientX, y: event.clientY });
            };

            window.addEventListener("mousemove", handleMouseMove);

            return () => {
                  window.removeEventListener("mousemove", handleMouseMove);
            };
      }, []);

      return (
            <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0a0a0a]">
                  {/* Base dark background */}
                  <div className="absolute inset-0 bg-[#0a0a0a]" />

                  {/* Riot Asset Background (Hidden by default, revealed by spotlight) */}
                  <div
                        className="absolute inset-0 bg-cover bg-center opacity-30 transition-opacity duration-500"
                        style={{
                              backgroundImage: "url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Sylas_0.jpg')", // Example Riot asset
                              maskImage: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
                              WebkitMaskImage: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
                        }}
                  />

                  {/* Glowy Orbs (Huly style) */}
                  <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[120px]" />
                  <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[120px]" />

                  {/* Mouse Follower Glow */}
                  <div
                        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-[80px]"
                        style={{
                              left: mousePosition.x,
                              top: mousePosition.y,
                              width: '300px',
                              height: '300px'
                        }}
                  />
            </div>
      );
}
