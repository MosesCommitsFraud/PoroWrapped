"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MatchProps {
      match: any;
      puuid: string;
      version: string;
}

// Simple cache for static data
const staticDataCache: { spells: any; runes: any } = { spells: null, runes: null };

export default function MatchHistory({ match, puuid, version }: MatchProps) {
      const [expanded, setExpanded] = useState(false);
      const [spells, setSpells] = useState<any>(null);
      const [runes, setRunes] = useState<any>(null);

      useEffect(() => {
            const fetchData = async () => {
                  if (!staticDataCache.spells) {
                        const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/summoner.json`);
                        const data = await res.json();
                        staticDataCache.spells = data.data;
                  }
                  if (!staticDataCache.runes) {
                        const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/runesReforged.json`);
                        staticDataCache.runes = await res.json();
                  }
                  setSpells(staticDataCache.spells);
                  setRunes(staticDataCache.runes);
            };
            fetchData();
      }, [version]);

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
                        return `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spells[key].id}.png`;
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

      const getQueueName = (queueId: number) => {
            const queueNames: Record<number, string> = {
                  420: 'Ranked Solo',
                  440: 'Ranked Flex',
                  400: 'Normal Draft',
                  430: 'Normal Blind',
                  450: 'ARAM',
                  490: 'Quickplay',
                  1700: 'Arena',
                  1900: 'URF',
                  900: 'ARURF'
            };
            return queueNames[queueId] || 'Normal';
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
                                    <span className="text-xs text-muted whitespace-nowrap">{getQueueName(match.info.queueId)}</span>
                                    <span className="text-xs text-muted">{minutes}:{seconds.toString().padStart(2, '0')}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                    <div className="relative w-12 h-12">
                                          <div className="w-12 h-12 bg-black rounded-full overflow-hidden border border-white/10">
                                                <img
                                                      src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${participant.championName}.png`}
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
                                                            <img src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item}.png`} alt="" className="w-full h-full" />
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
                                    <TeamTable
                                          participants={match.info.participants.filter((p: any) => p.teamId === 100)}
                                          teamName="Blue Team"
                                          maxDamage={Math.max(...match.info.participants.map((p: any) => p.totalDamageDealtToChampions))}
                                          gameDuration={match.info.gameDuration}
                                          runes={runes}
                                          version={version}
                                    />

                                    {/* Objectives */}
                                    <div className="flex justify-center gap-8 py-4 border-y border-white/5 bg-black/20">
                                          <div className="flex gap-12 text-xs">
                                                <div className="flex flex-col items-end gap-1">
                                                      <span className="text-blue-400 font-bold uppercase tracking-wider mb-1">Blue Team</span>
                                                      <div className="flex gap-4 text-muted">
                                                            <span className="flex items-center gap-1"><span className="text-white">{match.info.teams[0].objectives.tower.kills}</span> Towers</span>
                                                            <span className="flex items-center gap-1"><span className="text-white">{match.info.teams[0].objectives.dragon.kills}</span> Dragons</span>
                                                            <span className="flex items-center gap-1"><span className="text-white">{match.info.teams[0].objectives.baron.kills}</span> Barons</span>
                                                            <span className="flex items-center gap-1"><span className="text-white">{match.info.teams[0].objectives.inhibitor.kills}</span> Inhibs</span>
                                                      </div>
                                                </div>
                                                <div className="w-px bg-white/10"></div>
                                                <div className="flex flex-col items-start gap-1">
                                                      <span className="text-red-400 font-bold uppercase tracking-wider mb-1">Red Team</span>
                                                      <div className="flex gap-4 text-muted">
                                                            <span className="flex items-center gap-1"><span className="text-white">{match.info.teams[1].objectives.tower.kills}</span> Towers</span>
                                                            <span className="flex items-center gap-1"><span className="text-white">{match.info.teams[1].objectives.dragon.kills}</span> Dragons</span>
                                                            <span className="flex items-center gap-1"><span className="text-white">{match.info.teams[1].objectives.baron.kills}</span> Barons</span>
                                                            <span className="flex items-center gap-1"><span className="text-white">{match.info.teams[1].objectives.inhibitor.kills}</span> Inhibs</span>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>

                                    {/* Team 2 */}
                                    <TeamTable
                                          participants={match.info.participants.filter((p: any) => p.teamId === 200)}
                                          teamName="Red Team"
                                          maxDamage={Math.max(...match.info.participants.map((p: any) => p.totalDamageDealtToChampions))}
                                          gameDuration={match.info.gameDuration}
                                          runes={runes}
                                          version={version}
                                    />
                              </div>
                        </div>
                  )}
            </Card>
      );
}

function TeamTable({ participants, teamName, maxDamage, gameDuration, runes, version }: { participants: any[], teamName: string, maxDamage: number, gameDuration: number, runes: any, version: string }) {
      const isBlue = teamName === "Blue Team";
      const headerColor = isBlue ? "text-blue-400" : "text-red-400";

      const getRuneImage = (styleId: number, runeId: number) => {
            if (!runes) return null;
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
            <div className="mb-4">
                  <div className="flex items-center justify-between mb-2 px-2">
                        <h4 className={cn("text-xs font-bold uppercase", headerColor)}>{teamName}</h4>
                        <div className="grid grid-cols-12 gap-2 text-[10px] text-muted uppercase tracking-wider w-full max-w-[calc(100%-100px)]">
                              <div className="col-span-3">KDA</div>
                              <div className="col-span-3">Damage</div>
                              <div className="col-span-2">CS</div>
                              <div className="col-span-2">Wards</div>
                              <div className="col-span-2">Items</div>
                        </div>
                  </div>
                  <div className="space-y-1">
                        {participants.map((p: any) => {
                              const cs = p.totalMinionsKilled + p.neutralMinionsKilled;
                              const csPerMin = (cs / (gameDuration / 60)).toFixed(1);
                              const kda = ((p.kills + p.assists) / Math.max(1, p.deaths)).toFixed(2);
                              const gold = (p.goldEarned / 1000).toFixed(1);
                              const keystoneUrl = getRuneImage(p.perks.styles[0].style, p.perks.styles[0].selections[0].perk);

                              return (
                                    <div key={p.puuid} className="flex items-center text-xs p-1 hover:bg-white/5 rounded transition-colors">
                                          {/* Champion & Name */}
                                          <div className="flex items-center gap-2 w-[140px] flex-shrink-0">
                                                <div className="relative">
                                                      <img src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${p.championName}.png`} className="w-8 h-8 rounded" alt={p.championName} />
                                                      <div className="absolute -bottom-1 -right-1 bg-black text-[10px] px-1 rounded border border-white/10 leading-none">
                                                            {p.champLevel}
                                                      </div>
                                                      {keystoneUrl && (
                                                            <img src={keystoneUrl} className="absolute -bottom-2 -left-2 w-5 h-5 rounded-full bg-black border border-white/10" alt="Keystone" />
                                                      )}
                                                </div>
                                                <div className="flex flex-col overflow-hidden pl-1">
                                                      <span className="truncate text-white font-medium text-sm">{p.riotIdGameName}</span>
                                                      <span className="text-[10px] text-muted truncate">#{p.riotIdTagline}</span>
                                                </div>
                                          </div>

                                          {/* Stats Grid */}
                                          <div className="grid grid-cols-12 gap-2 items-center flex-grow">
                                                {/* KDA */}
                                                <div className="col-span-3 flex flex-col">
                                                      <span className="text-white/90">{p.kills} / <span className="text-red-400">{p.deaths}</span> / {p.assists}</span>
                                                      <span className="text-[10px] text-muted">{kda} KDA</span>
                                                </div>

                                                {/* Damage */}
                                                <div className="col-span-3 flex flex-col justify-center">
                                                      <div className="text-white/90 text-xs">{(p.totalDamageDealtToChampions / 1000).toFixed(1)}k</div>
                                                      <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-0.5">
                                                            <div className="bg-red-500 h-full" style={{ width: `${(p.totalDamageDealtToChampions / maxDamage) * 100}%` }} />
                                                      </div>
                                                </div>

                                                {/* CS & Gold */}
                                                <div className="col-span-2 flex flex-col">
                                                      <span className="text-white/90">{cs} <span className="text-[10px] text-muted">({csPerMin})</span></span>
                                                      <span className="text-[10px] text-yellow-500">{gold}k Gold</span>
                                                </div>

                                                {/* Wards */}
                                                <div className="col-span-2 flex flex-col">
                                                      <span className="text-white/90">{p.visionScore} <span className="text-[10px] text-muted">Vis</span></span>
                                                      <span className="text-[10px] text-muted">{p.wardsPlaced} / {p.wardsKilled}</span>
                                                </div>

                                                {/* Items */}
                                                <div className="col-span-2 flex flex-wrap gap-0.5 justify-end content-center">
                                                      {[0, 1, 2, 3, 4, 5, 6].map(i => {
                                                            const item = p[`item${i}`];
                                                            return item ? (
                                                                  <img key={i} src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item}.png`} className="w-4 h-4 rounded border border-white/10" alt="" />
                                                            ) : <div key={i} className="w-4 h-4 bg-white/5 rounded" />
                                                      })}
                                                </div>
                                          </div>
                                    </div>
                              );
                        })}
                  </div>
            </div>
      );
}
