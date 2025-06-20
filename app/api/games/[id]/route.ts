// app/api/games/[id]/route.ts - FINALE VERSION

import { NextResponse } from 'next/server';
import { games } from '@/lib/gameStore';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id;
    const game = games[gameId];

    if (!game) {
      return NextResponse.json({ error: 'Spiel nicht gefunden' }, { status: 404 });
    }

    // Wenn das Spiel gefunden wird, senden wir die Spieldaten mit dem Status 200 (OK).
    return NextResponse.json(game, { status: 200 });

  } catch (error) {
    console.error('Fehler beim Abrufen des Spiels:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}