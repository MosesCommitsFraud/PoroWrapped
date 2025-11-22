'use client';

import React, { useState } from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { REGIONS, RegionKey } from '@/lib/regions';

export default function Navbar() {
      const [search, setSearch] = useState('');
      const [region, setRegion] = useState<RegionKey>('EUW');
      const [isRegionOpen, setIsRegionOpen] = useState(false);
      const router = useRouter();

      const handleSearch = (e: React.FormEvent) => {
            e.preventDefault();
            if (search.trim()) {
                  const [gameName, tagLine] = search.split('#');
                  if (gameName && tagLine) {
                        router.push(`/profile/${gameName}-${tagLine}?region=${region}`);
                  } else {
                        alert("Please use the format Name#Tag");
                  }
            }
      };

      return (
            <nav className="h-16 bg-black/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-50">
                  <div className="flex items-center gap-2 w-full max-w-xl relative z-50">
                        {/* Region Selector */}
                        <div className="relative">
                              <button 
                                    type="button"
                                    onClick={() => setIsRegionOpen(!isRegionOpen)}
                                    className="h-10 px-3 bg-white/10 hover:bg-white/20 rounded-full flex items-center gap-1 text-sm font-medium transition-colors"
                              >
                                    {region} <ChevronDown size={14} />
                              </button>
                              
                              {isRegionOpen && (
                                    <div className="absolute top-12 left-0 bg-card border border-white/10 rounded-lg py-2 min-w-[100px] shadow-xl backdrop-blur-xl bg-black/90">
                                          {(Object.keys(REGIONS) as RegionKey[]).map((r) => (
                                                <button
                                                      key={r}
                                                      onClick={() => {
                                                            setRegion(r);
                                                            setIsRegionOpen(false);
                                                      }}
                                                      className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                                                >
                                                      {r}
                                                </button>
                                          ))}
                                    </div>
                              )}
                        </div>

                        <form onSubmit={handleSearch} className="w-full">
                              <Input
                                    placeholder="Search for a summoner (Name#Tag)..."
                                    icon={<Search size={20} />}
                                    className="bg-white/10 border-transparent focus:bg-white/20 rounded-full h-10"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                              />
                        </form>
                  </div>

                  {/* Overlay to close dropdown when clicking outside */}
                  {isRegionOpen && (
                        <div 
                              className="fixed inset-0 z-40 bg-transparent" 
                              onClick={() => setIsRegionOpen(false)}
                        />
                  )}

                  <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-muted hover:text-white">
                              <Bell size={20} />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-full p-1">
                              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                                    <User size={18} />
                              </div>
                        </Button>
                  </div>
            </nav>
      );
}
