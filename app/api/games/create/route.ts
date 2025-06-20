// app/api/games/create/route.ts

import { NextResponse } from 'next/server';
import { questionPacks } from '@/lib/questions';
// NEU: Wir importieren unseren zentralen Speicher
import { games } from '@/lib/gameStore';

type ValidPackName = keyof typeof questionPacks;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const packName = body.paket as ValidPackName;

    if (!questionPacks[packName]) {
      return NextResponse.json({ error: 'Ungültiges Fragen-Paket' }, { status: 400 });
    }

    const gameId = Math.random().toString(36).substring(2, 8);
    const selectedPack = questionPacks[packName];

    // Wir benutzen jetzt das importierte 'games'-Objekt
    games[gameId] = {
      id: gameId,
      packName: packName,
      questions: selectedPack.questions,
      players: [],
      answers: { playerA: [], playerB: [] },
      createdAt: new Date(),
    };

    console.log(`Neues Spiel erstellt: ${gameId} mit Paket: ${packName}`);
    return NextResponse.json({ gameId });

  } catch (error) {
    console.error('Fehler in der API-Route:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}