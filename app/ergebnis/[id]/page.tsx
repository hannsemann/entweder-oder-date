// app/ergebnis/[id]/page.tsx

"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import './ergebnis.css';

interface ErgebnisZeile {
  questionText: string;
  playerA_answer: string;
  playerB_answer?: string;
  isMatch: boolean | null;
}
interface ErgebnisDaten {
  isComplete: boolean;
  matchPercentage?: number;
  results: ErgebnisZeile[];
}

export default function ErgebnisSeite() {
  const params = useParams();
  const gameId = params.id as string;
  const [ergebnisse, setErgebnisse] = useState<ErgebnisDaten | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!gameId) {
      setIsLoading(false);
      setError("Keine Spiel-ID gefunden.");
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/games/${gameId}/results`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unbekannter Serverfehler' }));
          throw new Error(errorData.error);
        }

        const data: ErgebnisDaten = await response.json();
        
        setErgebnisse(data);

        if (data.isComplete) {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ein unerwarteter Fehler ist aufgetreten.');
        }
        if (intervalRef.current) clearInterval(intervalRef.current);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
    intervalRef.current = setInterval(fetchResults, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gameId]);

  if (isLoading) {
    return (
        <div className="ergebnis-container">
            <div className="logo-image" style={{ width: '150px', height: '150px', margin: 'auto' }}>
                {/* Hier könntest du dein SVG-Logo als Komponente einfügen oder als <img> */}
            </div>
            <h1>Ergebnisse werden geladen...</h1>
        </div>
    );
  }

  if (error) {
    return <div className="ergebnis-container"><h1>Fehler: {error}</h1></div>;
  }

  if (!ergebnisse) {
    return <div className="ergebnis-container"><h1>Keine Ergebnisse für dieses Spiel gefunden.</h1></div>;
  }

  if (!ergebnisse.isComplete) {
    return (
        <div className="ergebnis-container">
          <h1>Du bist fertig!</h1>
          <p>Hier ist eine Zusammenfassung deiner Antworten:</p>
          <ul className="ergebnis-liste">
            {ergebnisse.results.map((r, index) => (
              <li className="ergebnis-item" key={index}>
                <span className="question-text">{r.questionText}</span>
                <div className="antworten-zeile">
                  <span className="your-answer">Deine Antwort: <strong>{r.playerA_answer}</strong></span>
                </div>
              </li>
            ))}
          </ul>
          <div className="warte-box">
            <h2>Warte auf dein Date...</h2>
            <p>Die Seite aktualisiert sich automatisch, sobald die Ergebnisse da sind.</p>
          </div>
        </div>
      );
  }

  return (
    <div className="ergebnis-container">
      <h1>Euer Ergebnis!</h1>
      <div className="match-score">{ergebnisse.matchPercentage}% Übereinstimmung</div>
      <p>Das sagen eure Antworten im Detail:</p>
      <ul className="ergebnis-liste final">
        {ergebnisse.results.map((r, index) => (
          <li className={`ergebnis-item ${r.isMatch ? 'match' : 'no-match'}`} key={index}>
            <span className="question-text">{r.questionText}</span>
            <div className="antworten-zeile final">
              <span className="your-answer">Du: <strong>{r.playerA_answer}</strong></span>
              <span className="date-answer">Dein Date: <strong>{r.playerB_answer}</strong></span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}