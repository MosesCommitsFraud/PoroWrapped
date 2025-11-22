"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Sword, Shield, Eye } from 'lucide-react';

interface MatchProps {
      match: any;
      puuid: string;
}

// Simple cache for static data
const staticDataCache: { spells: any; runes: any } = { spells: null, runes: null };

export default function MatchHistory({ match, puuid }: MatchProps) {
      const [expanded, setExpanded] = useState(false);
      const [spells, setSpells] = useState<any>(null);
      const [runes, setRunes] = useState<any>(null);

      useEffect(() => {
            const fetchData = async () => {
                  if (!staticDataCache.spells) {
                        const res = await fetch('https://ddragon.leagueoflegends.com/cdn/14.23.1/data/en_US/summoner.json');
                        const data = await res.json();
                        staticDataCache.spells = data.data;
                  }
                  if (!staticDataCache.runes) {
                        const res = await fetch('https://ddragon.leagueoflegends.com/cdn/14.23.1/data/en_US/runesReforged.json');
                        staticDataCache.runes = await res.json();
                  }
                  setSpells(staticDataCache.spells);
                  setRunes(staticDataCache.runes);
            };
            fetchData();
      }, []);

      const participant = match.info.participants.find((p: any) => p.puuid === puuid);
      if (!participant) return null;

      const isWin = participant.win;
      const gameDuration = match.info.gameDuration;
      const minutes = Math.floor(gameDuration / 60);
      const seconds = gameDuration % 60;
      const kda = ((participant.kills + participant.assists) / Math.max(1, participant.deaths)).toFixed(2);
      const cs = participant.totalMinionsKilled + participant.neutralMinionsKilled;
      const csPerMin = (cs / (gameDuration / 60)).toFixed(1);

      const getSpellImage = (spellId: number) => {
            if (!spells) return null;
            for (const key in spells) {
                  if (spells[key].key == spellId) {
                        return `https://ddragon.leagueoflegends.com/cdn/14.23.1/img/spell/${spells[key].id}.png`;
                  }
            }
            return null;
      };

      const getRuneImage = (styleId: number, runeId: number) => {
            if (!runes) return null;
            // Primary Rune
            for (const tree of runes) {
                  if (tree.id === styleId) {
                        for (const slot of tree.slots) {
                              for (const rune of slot.runes) {
                                    if (rune.id === runeId) {
                                          return `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`;
                                    }
                              }
                        }
                  }
            }
            return null;
      };

      return (
            <Card className={cn(
                  "mb-2 border-l-4 transition-all overflow-hidden",
                  isWin ? "border-l-primary bg-primary/5" : "border-l-red-500 bg-red-500/5"
            )}>
                  <div
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5"
                        onClick={() => setExpanded(!expanded)}
                  >
                        <div className="flex items-center gap-4">
                              <div className="flex flex-col items-center w-16">
                                    <span className={cn("font-bold text-sm", isWin ? "text-primary" : "text-red-500")}>
                                          {isWin ? "Victory" : "Defeat"}
                                    </span>
                                    <span className="text-xs text-muted">{match.info.gameMode}</span>
                                    <span className="text-xs text-muted">{minutes}:{seconds.toString().padStart(2, '0')}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                    <div className="relative w-12 h-12">
                                          <div className="w-12 h-12 bg-black rounded-full overflow-hidden border border-white/10">
                                                <img
                                                      src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${participant.championName}.png`}
                                                      alt={participant.championName}
                                                      className="w-full h-full object-cover"
                                                />
                                          </div>
                                          <div className="absolute -bottom-1 -right-1 bg-black text-xs px-1 rounded border border-white/10">
                                                {participant.champLevel}
                                          </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                          <div className="flex gap-1">
                                                <img src={getSpellImage(participant.summoner1Id) || ''} className="w-5 h-5 rounded bg-black/50" alt="Spell 1" />
                                                <img src={getSpellImage(participant.summoner2Id) || ''} className="w-5 h-5 rounded bg-black/50" alt="Spell 2" />
                                          </div>
                                          <div className="flex gap-1">
                                                <img src={getRuneImage(participant.perks.styles[0].style, participant.perks.styles[0].selections[0].perk) || ''} className="w-5 h-5 rounded-full bg-black/50" alt="Rune" />
                                          </div>
                                    </div>
                              </div>

                              <div className="flex flex-col w-24">
                                    <div className="flex gap-1 justify-center">
                                          <span className="font-bold text-white">{participant.kills}</span>
                                          <span className="text-muted">/</span>
                                          <span className="font-bold text-red-400">{participant.deaths}</span>
                                          <span className="text-muted">/</span>
                                          <span className="font-bold text-white">{participant.assists}</span>
                                    </div>
                                    <span className="text-xs text-muted text-center">{kda} KDA</span>
                              </div>
                        </div>

                        <div className="flex items-center gap-6">
                              <div className="flex flex-col items-end text-right min-w-[80px]">
                                    <span className="text-sm text-muted">CS {cs} ({csPerMin})</span>
                                    <div className="flex gap-1 mt-1">
                                          {[0, 1, 2, 3, 4, 5, 6].map(i => {
                                                const item = participant[`item${i}`];
                                                return item ? (
                                                      <div key={i} className="w-6 h-6 bg-black rounded border border-white/10 overflow-hidden">
                                                            <img src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${item}.png`} alt="" className="w-full h-full" />
                                                      </div>
                                                ) : <div key={i} className="w-6 h-6 bg-white/5 rounded" />
                                          })}
                                    </div>
                              </div>
                              {expanded ? <ChevronUp size={20} className="text-muted" /> : <ChevronDown size={20} className="text-muted" />}
                        </div>
                  </div>

                  {expanded && (
                        <div className="border-t border-white/5 p-4 bg-black/20">
                              <div className="grid grid-cols-1 gap-4">
                                    {/* Team 1 */}
                                    <TeamTable participants={match.info.participants.filter((p: any) => p.teamId === 100)} teamName="Blue Team" maxDamage={Math.max(...match.info.participants.map((p: any) => p.totalDamageDealtToChampions))} />

                                    {/* Objectives */}
                                    <div className="flex justify-center gap-8 py-2 border-y border-white/5">
                                          {/* Placeholder for objectives if needed, or just spacing */}
                                          <span className="text-xs text-muted uppercase tracking-widest">Match Details</span>
                                    </div>

                                    {/* Team 2 */}
                                    <TeamTable participants={match.info.participants.filter((p: any) => p.teamId === 200)} teamName="Red Team" maxDamage={Math.max(...match.info.participants.map((p: any) => p.totalDamageDealtToChampions))} />
                              </div>
                        </div>
                  )}
            </Card>
      );
}

function TeamTable({ participants, teamName, maxDamage }: { participants: any[], teamName: string, maxDamage: number }) {
      return (
            <div>
                  <h4 className={cn("text-xs font-bold mb-2 uppercase", teamName === "Blue Team" ? "text-blue-400" : "text-red-400")}>{teamName}</h4>
                  <div className="space-y-1">
                        {participants.map((p: any) => (
                              <div key={p.puuid} className="grid grid-cols-12 gap-2 items-center text-xs p-1 hover:bg-white/5 rounded">
                                    <div className="col-span-3 flex items-center gap-2">
                                          <img src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${p.championName}.png`} className="w-6 h-6 rounded-full" alt={p.championName} />
                                          <span className="truncate text-white/80">{p.riotIdGameName}</span>
                                    </div>
                                    <div className="col-span-2 text-center text-white/80">
                                          {p.kills}/{p.deaths}/{p.assists}
                                    </div>
                                    <div className="col-span-3 flex items-center gap-1">
                                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-red-500 h-full" style={{ width: `${(p.totalDamageDealtToChampions / maxDamage) * 100}%` }} />
                                          </div>
                                          <span className="text-[10px] text-muted w-8 text-right">{(p.totalDamageDealtToChampions / 1000).toFixed(1)}k</span>
                                    </div>
                                    <div className="col-span-1 text-center text-muted">
                                          {p.totalMinionsKilled + p.neutralMinionsKilled}
                                    </div>
                                    <div className="col-span-3 flex justify-end gap-0.5">
                                          {[0, 1, 2, 3, 4, 5].map(i => {
                                                const item = p[`item${i}`];
                                                return item ? (
                                                      <img key={i} src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${item}.png`} className="w-5 h-5 rounded border border-white/10" alt="" />
                                                ) : <div key={i} className="w-5 h-5 bg-white/5 rounded" />
                                          })}
                                    </div>
                              </div>
                        ))}
                  </div>
            </div>
      );
}
