// app/ergebnis/[id]/page.tsx

"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import './ergebnis.css';

// ... (die 'interface'-Definitionen bleiben gleich)

export default function ErgebnisSeite() {
  const params = useParams();
  const gameId = params.id as string;
  const [ergebnisse, setErgebnisse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (gameId) {
      const fetchResults = async () => {
        try {
          const response = await fetch(`/api/games/${gameId}/results`);
          if (!response.ok) {
            throw new Error('Ergebnisse konnten nicht geladen werden.');
          }
          const data = await response.json();
          setErgebnisse(data);
          
          if (data.isComplete) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsLoading(false);
          }
        } catch (err) {
          setError(err.message);
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsLoading(false);
        }
      };

      fetchResults();
      intervalRef.current = setInterval(fetchResults, 3000);

      return () => clearInterval(intervalRef.current);
    }
  }, [gameId]);

  if (isLoading) {
    return <div className="ergebnis-container"><h1>Ergebnisse werden geladen...</h1></div>;
  }
  if (error) {
    return <div className="ergebnis-container"><h1>Fehler: {error}</h1></div>;
  }
  if (!ergebnisse) {
    return <div className="ergebnis-container"><h1>Keine Ergebnisse gefunden.</h1></div>;
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