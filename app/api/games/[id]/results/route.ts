// app/api/games/[id]/results/route.ts

import { NextResponse } from 'next/server';
import { games } from '@/lib/gameStore';
import { questionPacks } from '@/lib/questions';
import type { Question } from '@/lib/questions';

export const dynamic = 'force-dynamic';

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

    const totalQuestions = game.questions.length;
    const playerAAnswers = game.answers.playerA || [];
    const playerBAnswers = game.answers.playerB || [];

    if (playerAAnswers.length < totalQuestions || playerBAnswers.length < totalQuestions) {
      const originalQuestions = questionPacks[game.packName as keyof typeof questionPacks]?.questions || [];
      const results = playerAAnswers.map((ansA: { questionId: string, answer: string }) => {
        const question = originalQuestions.find(q => q.id === ansA.questionId);
        const questionText = question ? `${question.optionA} oder ${question.optionB}?` : 'Unbekannte Frage';
        return { questionText, playerA_answer: ansA.answer };
      });
      return NextResponse.json({ isComplete: false, results });
    }

    let matches = 0;
    const detailedResults = game.questions.map((question: Question) => {
      const answerA = playerAAnswers.find((a: any) => a.questionId === question.id)?.answer;
      const answerB = playerBAnswers.find((a: any) => a.questionId === question.id)?.answer;
      const isMatch = answerA === answerB;
      if (isMatch) matches++;
      return {
        questionText: `${question.optionA} oder ${question.optionB}?`,
        playerA_answer: answerA,
        playerB_answer: answerB,
        isMatch,
      };
    });
    const matchPercentage = Math.round((matches / totalQuestions) * 100);
    return NextResponse.json({
      isComplete: true,
      matchPercentage,
      results: detailedResults,
    });

  } catch (error) {
    console.error('Fehler beim Abrufen der Ergebnisse:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}