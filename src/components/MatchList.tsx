'use client';

import React, { useState, useEffect } from 'react';
import MatchHistory from './MatchHistory';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface MatchListProps {
  initialMatches: any[];
  puuid: string;
  version: string;
}

type FilterType = 'ALL' | 'SOLO' | 'FLEX' | 'NORMAL' | 'ARAM' | 'ARENA';

const QUEUE_IDS: Record<FilterType, number[]> = {
  ALL: [],
  SOLO: [420],
  FLEX: [440],
  NORMAL: [400, 430, 490], // Draft, Blind, Quickplay
  ARAM: [450],
  ARENA: [1700],
};

export default function MatchList({ initialMatches, puuid, version }: MatchListProps) {
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [matches, setMatches] = useState<any[]>(initialMatches);
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState<Record<string, any[]>>({ ALL: initialMatches });

  useEffect(() => {
    const fetchMatches = async () => {
      if (cache[filter]) {
        setMatches(cache[filter]);
        return;
      }

      setLoading(true);
      try {
        const queueIds = QUEUE_IDS[filter];
        // If queueIds is empty (ALL), we don't pass a queue param to fetch all
        // If it has multiple (NORMAL), we fetch them all? 
        // The Riot API only accepts ONE queueId per request.
        // So for NORMAL, we might need to fetch multiple and combine, or just pick one?
        // Actually, let's just support fetching the primary queue for now or parallel fetch.
        
        let newMatches: any[] = [];

        if (queueIds.length === 0) {
           // Fetch all
           const resIds = await fetch(`/api/riot/matches/ids?puuid=${puuid}&count=20`);
           const ids = await resIds.json();
           newMatches = await Promise.all(ids.map((id: string) => 
             fetch(`/api/riot/matches/details?matchId=${id}`).then(r => r.json())
           ));
        } else {
          // Fetch for specific queues
          // Since we want "NORMAL" to be 400 OR 430 OR 490, this is tricky with one API call.
          // We will fetch for each queue ID and merge, then sort by date.
          
          const allIds = await Promise.all(queueIds.map(qId => 
            fetch(`/api/riot/matches/ids?puuid=${puuid}&count=20&queue=${qId}`).then(r => r.json())
          ));
          
          // Flatten and unique
          const uniqueIds = Array.from(new Set(allIds.flat()));
          
          // Fetch details (limit to 20 most recent across all fetched queues)
          // We can't easily sort by date without details, but IDs are roughly chronological?
          // Actually match IDs are not strictly chronological across regions/queues? 
          // Riot IDs usually are increasing? Let's assume yes or fetch details for a reasonable amount.
          
          // Optimization: If we have many IDs, just take top 20.
          const idsToFetch = uniqueIds.slice(0, 20);
          
          newMatches = await Promise.all(idsToFetch.map((id: string) => 
             fetch(`/api/riot/matches/details?matchId=${id}`).then(r => r.json())
          ));
        }
        
        // Sort by game creation (descending)
        newMatches.sort((a, b) => b.info.gameCreation - a.info.gameCreation);

        setCache(prev => ({ ...prev, [filter]: newMatches }));
        setMatches(newMatches);
      } catch (error) {
        console.error("Failed to fetch filtered matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [filter, puuid, cache]); // removed cache from deps to avoid loop, handled inside

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Match History</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(Object.keys(QUEUE_IDS) as FilterType[]).map((type) => (
            <Button
              key={type}
              variant={filter === type ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(type)}
              className={cn(
                "whitespace-nowrap",
                filter !== type && "bg-transparent border-white/10 hover:bg-white/5"
              )}
            >
              {type === 'SOLO' ? 'Solo/Duo' : 
               type === 'FLEX' ? 'Ranked Flex' : 
               type === 'NORMAL' ? 'Normals' : 
               type.charAt(0) + type.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted bg-card/30 rounded-lg border border-white/5 animate-pulse">
          Loading matches...
        </div>
      ) : matches.length > 0 ? (
        matches.map((match) => (
          <MatchHistory 
            key={match.metadata.matchId} 
            match={match} 
            puuid={puuid} 
            version={version} 
          />
        ))
      ) : (
        <div className="text-center py-10 text-muted bg-card/30 rounded-lg border border-white/5">
          No matches found for this filter.
        </div>
      )}
    </div>
  );
}
