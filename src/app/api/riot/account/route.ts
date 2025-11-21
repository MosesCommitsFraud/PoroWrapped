import { NextRequest, NextResponse } from 'next/server';
import { getAccountByRiotID, getSummonerByPUUID } from '@/lib/riot-api';

export async function POST(request: NextRequest) {
      try {
            const body = await request.json();
            const { gameName, tagLine } = body;

            if (!gameName || !tagLine) {
                  return NextResponse.json({ error: 'Missing gameName or tagLine' }, { status: 400 });
            }

            const account = await getAccountByRiotID(gameName, tagLine);
            const summoner = await getSummonerByPUUID(account.puuid);

            return NextResponse.json({ account, summoner });
      } catch (error: any) {
            console.error('Error fetching account:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
      }
}
