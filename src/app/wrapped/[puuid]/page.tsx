'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { processMatches, AggregateStats, Match } from '@/lib/stats-processor';
import { Loader2 } from 'lucide-react';
import WrappedSlides from '@/components/wrapped/WrappedSlides';
import DevMode from '@/components/DevMode';

export default function WrappedPage() {
      const params = useParams();
      const puuid = params.puuid as string;

      const [loading, setLoading] = useState(true);
      const [progress, setProgress] = useState(0);
      const [status, setStatus] = useState('Initializing...');
      const [stats, setStats] = useState<AggregateStats | null>(null);
      const [matches, setMatches] = useState<Match[]>([]);
      const [error, setError] = useState('');

      const hasFetched = useRef(false);

      const CACHE_VERSION = '1.0.1'; // Increment this when stats structure changes

      const loadFromCache = () => {
            const cachedData = localStorage.getItem(`poro-wrapped-${puuid}`);
            if (cachedData) {
                  try {
                        const parsed = JSON.parse(cachedData);
                        // Check version and essential new fields to ensure compatibility
                        if (parsed.stats && parsed.matches && parsed.version === CACHE_VERSION && parsed.stats.abilityCasts) {
                              setStats(parsed.stats);
                              setMatches(parsed.matches);
                              setLoading(false);
                              return true;
                        }
                  } catch (e) {
                        console.error("Failed to parse cached data", e);
                        localStorage.removeItem(`poro-wrapped-${puuid}`);
                  }
            }
            return false;
      };

      useEffect(() => {
            if (hasFetched.current) return;
            hasFetched.current = true;

            const fetchData = async () => {
                  try {
                        // Check local storage first
                        if (loadFromCache()) return;

                        setStatus('Fetching Match History...');
                        // 1. Fetch Match IDs
                        let allMatchIds: string[] = [];
                        let start = 0;
                        const count = 100;
                        let keepFetching = true;

                        // One year ago in milliseconds
                        const ONE_YEAR_AGO = Date.now() - (365 * 24 * 60 * 60 * 1000);

                        while (keepFetching) {
                              const res = await fetch(`/api/riot/matches/ids?puuid=${puuid}&start=${start}&count=${count}`);
                              if (!res.ok) throw new Error('Failed to fetch match IDs');
                              const ids = await res.json();

                              if (ids.length === 0) {
                                    keepFetching = false;
                              } else {
                                    allMatchIds = [...allMatchIds, ...ids];
                                    start += count;
                                    setStatus(`Found ${allMatchIds.length} matches...`);

                                    // Safety break to prevent infinite loops if something goes wrong, 
                                    // but high enough to cover most active players (2000 games/year is ~5.5 games/day)
                                    if (allMatchIds.length >= 2000) {
                                          keepFetching = false;
                                    }

                                    await new Promise(r => setTimeout(r, 100));
                              }
                        }

                        setStatus(`Fetching details for ${allMatchIds.length} matches...`);

                        // 2. Fetch Match Details (Batching)
                        const fetchedMatches: Match[] = [];
                        const BATCH_SIZE = 5;
                        let reachedTimeLimit = false;

                        for (let i = 0; i < allMatchIds.length; i += BATCH_SIZE) {
                              if (reachedTimeLimit) break;

                              const batch = allMatchIds.slice(i, i + BATCH_SIZE);
                              const promises = batch.map(id =>
                                    fetch(`/api/riot/matches/details?matchId=${id}`).then(res => {
                                          if (!res.ok) return null;
                                          return res.json();
                                    })
                              );

                              const results = await Promise.all(promises);
                              const validResults = results.filter((r): r is Match => r !== null);

                              // Check dates
                              for (const match of validResults) {
                                    if (match.info.gameCreation < ONE_YEAR_AGO) {
                                          reachedTimeLimit = true;
                                    } else {
                                          fetchedMatches.push(match);
                                    }
                              }

                              // If we hit the time limit, we stop adding matches but we still might have some valid ones in this batch
                              // The loop break happens after this iteration

                              setProgress(Math.round(((i + BATCH_SIZE) / allMatchIds.length) * 100));
                              setStatus(`Processed ${fetchedMatches.length} matches (Last 365 Days)...`);

                              await new Promise(r => setTimeout(r, 500));
                        }

                        // 3. Process Stats
                        setStatus('Calculating Stats...');
                        const calculatedStats = processMatches(fetchedMatches, puuid);

                        // Save to local storage
                        try {
                              localStorage.setItem(`poro-wrapped-${puuid}`, JSON.stringify({
                                    puuid,
                                    stats: calculatedStats,
                                    matches: fetchedMatches,
                                    timestamp: Date.now(),
                                    version: CACHE_VERSION
                              }));
                        } catch (e) {
                              console.error("Failed to save to local storage (likely quota exceeded)", e);
                              // Fallback: Try saving only stats if full data fails
                              try {
                                    localStorage.setItem(`poro-wrapped-${puuid}`, JSON.stringify({
                                          puuid,
                                          stats: calculatedStats,
                                          matches: [], // Empty matches to save space, but keep structure
                                          timestamp: Date.now(),
                                          version: CACHE_VERSION
                                    }));
                              } catch (retryError) {
                                    console.error("Failed to save even just stats", retryError);
                              }
                        }

                        setStats(calculatedStats);
                        setMatches(fetchedMatches);
                        setLoading(false);

                  } catch (err: any) {
                        console.error(err);
                        setError(err.message);
                        setLoading(false);
                  }
            };

            fetchData();
      }, [puuid]);

      return (
            <div className="min-h-screen bg-[#0a0a0c] text-white">
                  {loading && (
                        <div className="min-h-screen flex flex-col items-center justify-center">
                              <div className="w-full max-w-md px-6 text-center">
                                    <h2 className="text-2xl font-bold mb-4 text-yellow-500">Generating Your Wrapped</h2>
                                    <p className="text-gray-400 mb-8">{status}</p>

                                    <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                                          <div
                                                className="bg-yellow-500 h-full transition-all duration-500 ease-out"
                                                style={{ width: `${progress}%` }}
                                          />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">{progress}%</p>
                              </div>
                        </div>
                  )}

                  {error && !loading && (
                        <div className="min-h-screen flex items-center justify-center">
                              <div className="text-center">
                                    <h1 className="text-4xl font-bold text-red-500 mb-4">Error</h1>
                                    <p className="text-gray-400">{error}</p>
                              </div>
                        </div>
                  )}

                  {!loading && !error && stats && <WrappedSlides stats={stats} />}

                  <DevMode puuid={puuid} onCacheUpdate={() => loadFromCache()} />
            </div>
      );
}
