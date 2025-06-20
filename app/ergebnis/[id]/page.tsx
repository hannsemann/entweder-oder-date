// app/ergebnis/[id]/page.tsx - FINALE VERSION MIT POLLING

"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import './ergebnis.css';

// Definieren, wie die Ergebnis-Daten aussehen
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Referenz für unser Polling-Interval

  useEffect(() => {
    if (!gameId) {
        setIsLoading(false);
        setError("Keine Spiel-ID gefunden.");
        return;
    };

    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/games/${gameId}/results`);
        if (!response.ok) {
          // Wir versuchen, eine spezifischere Fehlermeldung zu bekommen
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || 'Ergebnisse konnten nicht vom Server geladen werden.');
        }

        const data: ErgebnisDaten = await response.json();
        
        setErgebnisse(data);
        // Setze den Ladezustand nur beim ersten erfolgreichen Laden auf false
        if(isLoading) setIsLoading(false);

        // Wenn das Spiel komplett ist, stoppen wir das Polling.
        if (data.isComplete) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      } catch (err: any) {
        console.error("Fehler beim Abrufen der Ergebnisse:", err);
        setError(err.message);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setIsLoading(false);
      }
    };

    // Führe den ersten Abruf sofort aus
    fetchResults();

    // Starte das Polling: Rufe fetchResults alle 3 Sekunden auf
    intervalRef.current = setInterval(fetchResults, 3000);

    // Aufräum-Funktion: Stoppt das Polling, wenn die Seite verlassen wird
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameId]);

  if (isLoading) {
    return <div className="ergebnis-container"><div className="lade-text">Ergebnisse werden geladen...</div></div>;
  }
  if (error) {
    return <div className="ergebnis-container"><div className="lade-text">Fehler: {error}</div></div>;
  }
  if (!ergebnisse) {
    return <div className="ergebnis-container"><div className="lade-text">Keine Spieldaten für dieses Spiel gefunden.</div></div>;
  }

  // ANZEIGE FÜR DEN WARTE-MODUS
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

  // ANZEIGE FÜR DIE FINALE AUSWERTUNG
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