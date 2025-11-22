import { NextRequest, NextResponse } from 'next/server';
import { getMatchIds } from '@/lib/riot-api';

export async function GET(request: NextRequest) {
      const searchParams = request.nextUrl.searchParams;
      const puuid = searchParams.get('puuid');
      const start = parseInt(searchParams.get('start') || '0');
      const count = parseInt(searchParams.get('count') || '100');
      const queue = searchParams.get('queue') ? parseInt(searchParams.get('queue')!) : undefined;

      if (!puuid) {
            return NextResponse.json({ error: 'Missing puuid' }, { status: 400 });
      }

      try {
            const matchIds = await getMatchIds(puuid, start, count, queue);
            return NextResponse.json(matchIds);
      } catch (error: any) {
            console.error('Error fetching match IDs:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
      }
}
