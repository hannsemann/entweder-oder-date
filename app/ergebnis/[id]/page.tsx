// app/ergebnis/[id]/page.tsx - FINALE VERSION

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
    if (!gameId) return;

    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/games/${gameId}/results`);
        if (!response.ok) {
            // Versuche, eine spezifischere Fehlermeldung zu bekommen
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
    return <div className="ergebnis-container"><h1>Keine Ergebnisse gefunden.</h1></div>;
  }

  if (!ergebnisse.isComplete) {
    // ... Warte-Modus
  }

  // ... Finale Auswertung
}