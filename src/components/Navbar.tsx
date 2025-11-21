'use client';

import React, { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Navbar() {
      const [search, setSearch] = useState('');
      const router = useRouter();

      const handleSearch = (e: React.FormEvent) => {
            e.preventDefault();
            if (search.trim()) {
                  // Basic parsing for GameName#TagLine
                  const [gameName, tagLine] = search.split('#');
                  if (gameName && tagLine) {
                        router.push(`/profile/${gameName}-${tagLine}`);
                  } else {
                        // Fallback or error handling - for now just push what we have, 
                        // but the profile page expects a specific format.
                        // Let's assume user inputs Name#Tag
                        alert("Please use the format Name#Tag");
                  }
            }
      };

      return (
            <nav className="h-16 bg-black/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-50">
                  <div className="flex items-center gap-4 w-full max-w-xl">
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
