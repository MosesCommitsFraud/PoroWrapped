'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';

export default function WrappedInput() {
      const [riotId, setRiotId] = useState('');
      const [loading, setLoading] = useState(false);
      const router = useRouter();

      const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);

            // Basic parsing
            const parts = riotId.split('#');
            if (parts.length < 2) {
                  // Try to handle cases without # if possible, or just alert
                  // For now, assume user knows to put #
                  // If they don't, we could try to be smart or just let the profile page handle it (it will fail)
                  // Let's just redirect what they typed if it looks somewhat sane, or alert.
                  alert("Please use format Name#Tag");
                  setLoading(false);
                  return;
            }

            const gameName = parts[0].trim();
            const tagLine = parts[1].trim();

            // Construct URL: /profile/Name-Tag
            // We need to handle if Name contains hyphens?
            // The profile page splits by LAST hyphen.
            // So Name-With-Hyphens-Tag works.

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

                  <button
                        type="submit"
                        disabled={loading}
                        className="w-full border-button-light text-black font-semibold py-4 rounded-full transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                        {loading ? (
                              <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Searching...
                              </>
                        ) : (
                              'Search Summoner'
                        )}
                  </button>
            </form>
      );
}
