// app/spiel/[id]/page.tsx - INTELLIGENTE VERSION

"use client"; 

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './spiel.css';
import Image from 'next/image';
import type { Question } from '@/lib/questions';

interface GameData {
  questions: Question[];
  answers: {
    playerA: any[];
    playerB: any[];
  }
}

export default function SpielSeite() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;

  // NEU: Das Modal ist standardmäßig geschlossen.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [game, setGame] = useState<GameData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playerId] = useState(() => Math.random().toString(36).substring(2, 10));

  useEffect(() => {
    if (gameId) {
      const fetchGameData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/games/${gameId}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Spiel konnte nicht geladen werden.');
          }
          const data: GameData = await response.json();
          setGame(data);

          // NEU: Die intelligente Logik, um zu entscheiden, ob das Modal gezeigt wird.
          // Wir prüfen, ob schon jemand Antworten für Spieler A abgegeben hat.
          if (data.answers.playerA.length === 0) {
            // Wenn nicht, ist dies Spieler 1. Zeige das Modal.
            setIsModalOpen(true);
          }
          // Ansonsten (wenn Spieler 1 schon geantwortet hat), ist dies Spieler 2.
          // Das Modal bleibt geschlossen und das Spiel kann direkt losgehen.

        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchGameData();
    }
  }, [gameId]);

  const handleAnswer = async (answer: string) => {
    if (!game) return;
    const questionId = game.questions[currentQuestionIndex].id;
    try {
      await fetch(`/api/games/${gameId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, questionId, answer }),
      });
    } catch (error) {
      console.error("Fehler beim Senden der Antwort:", error);
    }
    if (currentQuestionIndex < game.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      router.push(`/ergebnis/${gameId}`);
    }
  };
  
  // Der Rest der Funktionen und der Anzeige-Logik bleibt fast identisch...
  const shareLink = typeof window !== 'undefined' ? `${window.location.origin}/spiel/${gameId}` : '';
  // in page.tsx
const copyLinkToClipboard = () => {
  navigator.clipboard.writeText(shareLink).then(() => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  });
};
  const handleCloseModal = () => setIsModalOpen(false);

  if (isLoading) return <div className="spiel-container"><div className="lade-text">Spiel wird geladen...</div></div>;
  if (error) return <div className="spiel-container"><div className="lade-text">Fehler: {error}</div></div>;
  if (!game) return <div className="spiel-container"><div className="lade-text">Keine Spieldaten gefunden.</div></div>;
  
  const currentQuestion = game.questions[currentQuestionIndex];
  if (!currentQuestion) return <div className="spiel-container"><div className="lade-text">Du hast alle Fragen beantwortet!</div></div>;
  
  const progress = ((currentQuestionIndex + 1) / game.questions.length) * 100;

  if (isModalOpen) {
    return (
      <>
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Dein Date einladen!</h2>
            <p>Kopier diesen Link und schick ihn an die Person, mit der du spielen willst.</p>
            <div className="link-container">
              <input type="text" value={shareLink} readOnly />
              <button className="copy-button" onClick={copyLinkToClipboard}>
                {isCopied ? <Image src="/check-icon.svg" alt="Kopiert!" width={20} height={20} /> : <Image src="/copy-icon.svg" alt="Kopieren" width={20} height={20} />}
              </button>
            </div>
            <div className="action-buttons">
              <button onClick={handleCloseModal} className="close-button">Spiel starten!</button>
            </div>
          </div>
        </div>
        <div className={`copy-toast ${isCopied ? 'show' : ''}`}>Link kopiert!</div>
      </>
    );
  }
  
  return (
    <div className="spiel-container">
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <main className="frage-main">
        <h1 className="frage-text">{currentQuestion.optionA} oder {currentQuestion.optionB}?</h1>
      </main>
      <div className="antwort-grid">
        <button className="antwort-button" onClick={() => handleAnswer(currentQuestion.optionA)}>{currentQuestion.optionA}</button>
        <button className="antwort-button" onClick={() => handleAnswer(currentQuestion.optionB)}>{currentQuestion.optionB}</button>
      </div>
    </div>
  );
}