'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';

export default function WrappedInput() {
      const [riotId, setRiotId] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      const router = useRouter();

      const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setError('');
            setLoading(true);

            try {
                  const [gameName, tagLine] = riotId.split('#');

                  if (!gameName || !tagLine) {
                        throw new Error('Please enter a valid Riot ID (e.g., Poro#EUW)');
                  }

                  const response = await fetch('/api/riot/account', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ gameName, tagLine }),
                  });

                  if (!response.ok) {
                        const data = await response.json();
                        throw new Error(data.error || 'Failed to find summoner');
                  }

                  const data = await response.json();
                  router.push(`/wrapped/${data.account.puuid}`);
            } catch (err: any) {
                  setError(err.message);
                  setLoading(false);
            }
      };

      return (
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
                  <div className="relative">
                        <input
                              type="text"
                              value={riotId}
                              onChange={(e) => setRiotId(e.target.value)}
                              placeholder="GameName #TagLine"
                              className="w-full bg-[#1c1c1f] border border-[#2c2c2f] rounded-xl py-4 px-6 pl-12 text-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-gray-600 text-white"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  </div>

                  {error && (
                        <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                              {error}
                        </div>
                  )}

                  <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                        {loading ? (
                              <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Summoning Poros...
                              </>
                        ) : (
                              'Generate Wrapped'
                        )}
                  </button>
            </form>
      );
}
