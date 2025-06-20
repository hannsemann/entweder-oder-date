// app/api/games/[id]/answer/route.ts - MINIMALER TEST-CODE

import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const gameId = params.id;
  
  // Wir loggen nur, um zu sehen, dass die Funktion aufgerufen wird.
  console.log(`Minimaler Test für Spiel-ID: ${gameId} wurde aufgerufen.`);
  
  // Wir schicken immer eine Erfolgs-Nachricht zurück.
  return NextResponse.json({ success: true, message: `Test für Spiel ${gameId} erfolgreich.` });
}