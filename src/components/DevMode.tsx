'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Upload, Trash2, X, Terminal } from 'lucide-react';
import { processMatches, Match } from '@/lib/stats-processor';

interface DevModeProps {
      puuid?: string;
      onCacheUpdate?: () => void;
}

export default function DevMode({ puuid, onCacheUpdate }: DevModeProps) {
      const [isOpen, setIsOpen] = useState(false);
      const [cacheInfo, setCacheInfo] = useState<{ timestamp: number; size: string } | null>(null);
      const [isProcessing, setIsProcessing] = useState(false);
      const router = useRouter();

      const CACHE_KEY = puuid ? `poro-wrapped-${puuid}` : null;

      useEffect(() => {
            if (isOpen) {
                  checkCache();
            }
      }, [isOpen, puuid]);

      const checkCache = () => {
            if (!CACHE_KEY) {
                  setCacheInfo(null);
                  return;
            }

            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                  const size = (cached.length / 1024 / 1024).toFixed(2);
                  try {
                        const parsed = JSON.parse(cached);
                        setCacheInfo({
                              timestamp: parsed.timestamp,
                              size: `${size} MB`
                        });
                  } catch (e) {
                        setCacheInfo({ timestamp: 0, size: `${size} MB (Invalid JSON)` });
                  }
            } else {
                  setCacheInfo(null);
            }
      };

      const handleDownload = () => {
            if (!CACHE_KEY) return;
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return;

            const blob = new Blob([cached], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `poro-wrapped-cache-${puuid?.slice(0, 8) || 'data'}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
      };

      const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                  try {
                        const content = event.target?.result as string;
                        // Basic validation
                        const parsed = JSON.parse(content);
                        if (!parsed.stats || !parsed.matches) {
                              alert('Invalid cache file format. Missing stats or matches.');
                              return;
                        }

                        const targetPuuid = parsed.puuid || puuid;
                        if (!targetPuuid) {
                              alert('Could not determine PUUID from file. Please use files generated with the latest version.');
                              return;
                        }

                        const targetKey = `poro-wrapped-${targetPuuid}`;
                        localStorage.setItem(targetKey, content);

                        if (targetKey === CACHE_KEY) {
                              checkCache();
                              if (onCacheUpdate) onCacheUpdate();
                        } else {
                              // Redirect if we loaded a different user's data
                              router.push(`/wrapped/${targetPuuid}`);
                        }

                        alert('Cache restored successfully!');
                  } catch (error) {
                        console.error('Error parsing cache file:', error);
                        alert('Failed to parse cache file.');
                  }
            };
            reader.readAsText(file);
      };

      const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            setIsProcessing(true);
            const matches: Match[] = [];
            let processedCount = 0;

            try {
                  // 1. Read all files
                  for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        if (!file.name.endsWith('.json')) continue;

                        try {
                              const text = await file.text();
                              const data = JSON.parse(text);
                              // Validate it's a match DTO
                              if (data.metadata && data.info) {
                                    matches.push(data);
                              }
                        } catch (err) {
                              console.warn(`Failed to parse ${file.name}`, err);
                        }
                        processedCount++;
                  }

                  if (matches.length === 0) {
                        alert('No valid match JSON files found in the selected folder.');
                        setIsProcessing(false);
                        return;
                  }

                  // 2. Detect PUUID (Frequency Analysis)
                  // The user should be present in almost all matches.
                  const puuidCounts: Record<string, number> = {};
                  matches.forEach(match => {
                        match.metadata.participants.forEach(p => {
                              puuidCounts[p] = (puuidCounts[p] || 0) + 1;
                        });
                  });

                  // Find the PUUID with the highest count
                  let detectedPuuid = '';
                  let maxCount = 0;
                  for (const [p, count] of Object.entries(puuidCounts)) {
                        if (count > maxCount) {
                              maxCount = count;
                              detectedPuuid = p;
                        }
                  }

                  // If we have a prop PUUID, use it. Otherwise use detected.
                  const targetPuuid = puuid || detectedPuuid;

                  if (!targetPuuid) {
                        alert('Could not detect a common PUUID in the matches.');
                        setIsProcessing(false);
                        return;
                  }

                  if (puuid && targetPuuid !== puuid) {
                        if (!confirm(`Detected PUUID ${targetPuuid} seems to be the main user, but you are currently viewing ${puuid}. Use detected?`)) {
                              // Keep current
                        } else {
                              // Switch to detected
                        }
                  }

                  // 3. Generate Stats
                  const stats = processMatches(matches, targetPuuid);

                  // 4. Save to LocalStorage
                  const saveKey = `poro-wrapped-${targetPuuid}`;
                  const cacheData = {
                        puuid: targetPuuid,
                        stats,
                        matches, // Save full matches for now
                        timestamp: Date.now()
                  };

                  try {
                        localStorage.setItem(saveKey, JSON.stringify(cacheData));
                  } catch (e) {
                        console.error('Quota exceeded, saving stats only', e);
                        // Fallback
                        localStorage.setItem(saveKey, JSON.stringify({
                              puuid: targetPuuid,
                              stats,
                              matches: [],
                              timestamp: Date.now()
                        }));
                  }

                  // 5. Redirect if needed
                  if (targetPuuid !== puuid) {
                        router.push(`/wrapped/${targetPuuid}`);
                  } else {
                        checkCache();
                        if (onCacheUpdate) onCacheUpdate();
                        alert(`Processed ${matches.length} matches successfully!`);
                  }

            } catch (error) {
                  console.error('Error processing folder:', error);
                  alert('An error occurred while processing the folder.');
            } finally {
                  setIsProcessing(false);
            }
      };

      const handleClear = () => {
            if (!CACHE_KEY) return;
            if (confirm('Are you sure you want to clear the cache? This will reload the page.')) {
                  localStorage.removeItem(CACHE_KEY);
                  setCacheInfo(null);
                  window.location.reload();
            }
      };

      if (!isOpen) {
            return (
                  <button
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-4 right-4 bg-gray-800 text-gray-400 hover:text-white p-2 rounded-full shadow-lg border border-gray-700 transition-all z-[9999]"
                        title="Dev Mode"
                  >
                        <Terminal size={20} />
                  </button>
            );
      }

      return (
            <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-4 w-80 z-[9999] text-sm">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                        <h3 className="font-bold text-yellow-500 flex items-center gap-2">
                              <Terminal size={16} />
                              Dev Mode
                        </h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                              <X size={16} />
                        </button>
                  </div>

                  <div className="space-y-4">
                        <div className="bg-gray-800 p-3 rounded">
                              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Cache Status</p>
                              {cacheInfo ? (
                                    <div>
                                          <p className="text-green-400 font-mono">Active</p>
                                          <p className="text-gray-500 text-xs">Size: {cacheInfo.size}</p>
                                          <p className="text-gray-500 text-xs">
                                                Time: {new Date(cacheInfo.timestamp).toLocaleString()}
                                          </p>
                                    </div>
                              ) : (
                                    <p className="text-red-400 font-mono">{CACHE_KEY ? 'Empty' : 'No Profile Selected'}</p>
                              )}
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                              <button
                                    onClick={handleDownload}
                                    disabled={!cacheInfo}
                                    className="flex flex-col items-center justify-center gap-1 p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Download Cache"
                              >
                                    <Download size={16} />
                                    <span className="text-[10px]">Save</span>
                              </button>

                              <label
                                    className="flex flex-col items-center justify-center gap-1 p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 cursor-pointer transition-colors"
                                    title="Upload Cache"
                              >
                                    <Upload size={16} />
                                    <span className="text-[10px]">Load</span>
                                    <input type="file" accept=".json" onChange={handleUpload} className="hidden" />
                              </label>

                              <button
                                    onClick={handleClear}
                                    disabled={!cacheInfo}
                                    className="flex flex-col items-center justify-center gap-1 p-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Clear Cache"
                              >
                                    <Trash2 size={16} />
                                    <span className="text-[10px]">Clear</span>
                              </button>
                        </div>

                        <div className="pt-2 border-t border-gray-800">
                              <label
                                    className={`flex items-center justify-center gap-2 p-2 w-full rounded cursor-pointer transition-colors ${isProcessing ? 'bg-gray-700 cursor-wait' : 'bg-blue-900/30 hover:bg-blue-900/50 text-blue-400'}`}
                                    title="Load Folder"
                              >
                                    <Upload size={16} />
                                    <span className="text-[10px]">{isProcessing ? 'Processing...' : 'Load Match Folder'}</span>
                                    <input
                                          type="file"
                                          // @ts-ignore
                                          webkitdirectory=""
                                          directory=""
                                          onChange={handleFolderUpload}
                                          className="hidden"
                                          disabled={isProcessing}
                                    />
                              </label>
                        </div>
                  </div>
            </div>
      );
}
