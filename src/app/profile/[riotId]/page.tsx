import React from 'react';
import { getAccountByRiotID } from '@/lib/riot-api';
import { REGIONS, RegionKey } from '@/lib/regions';
import { redirect } from 'next/navigation';

interface PageProps {
      params: Promise<{ riotId: string }>;
      searchParams: Promise<{ region?: string }>;
}

export default async function ProfilePage({ params, searchParams }: PageProps) {
      const { riotId } = await params;
      const { region } = await searchParams;
      const regionKey = (region?.toUpperCase() || 'EUW') as RegionKey;

      if (!REGIONS[regionKey]) {
           console.warn(`Invalid region ${region}, defaulting to EUW`);
      }
      const selectedRegion = REGIONS[regionKey] ? regionKey : 'EUW';

      const decodedRiotId = decodeURIComponent(riotId);

      // Parse Name and Tag. Assumes format "Name-Tag"
      const lastHyphenIndex = decodedRiotId.lastIndexOf('-');
      const gameName = decodedRiotId.substring(0, lastHyphenIndex);
      const tagLine = decodedRiotId.substring(lastHyphenIndex + 1);

      if (!gameName || !tagLine) {
            return <div className="text-center text-red-500 mt-10">Invalid Riot ID format. Please use Name-Tag.</div>;
      }

      let account;
      try {
            account = await getAccountByRiotID(gameName, tagLine, selectedRegion);
      } catch (error) {
            console.error(error);
            return (
                  <div className="text-center mt-20">
                        <h2 className="text-2xl font-bold text-red-500 mb-4">Summoner not found or API error</h2>
                        <p className="text-muted">Please check the Riot ID and try again.</p>
                  </div>
            );
      }

      // Redirect to Wrapped page
      if (account) {
            redirect(`/wrapped/${account.puuid}`);
      }
}
