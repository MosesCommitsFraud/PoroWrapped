import { NextRequest, NextResponse } from 'next/server';
import { getMatchDetails } from '@/lib/riot-api';

export async function GET(request: NextRequest) {
      const searchParams = request.nextUrl.searchParams;
      const matchId = searchParams.get('matchId');

      if (!matchId) {
            return NextResponse.json({ error: 'Missing matchId' }, { status: 400 });
      }

      try {
            const matchDetails = await getMatchDetails(matchId);
            return NextResponse.json(matchDetails);
      } catch (error: any) {
            console.error('Error fetching match details:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
      }
}
