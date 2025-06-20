// app/ergebnis/[id]/page.tsx - FINALE, KORRIGIERTE VERSION

"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import './ergebnis.css';

// ... (die 'interface'-Definitionen bleiben gleich) ...

export default function ErgebnisSeite() {
  const params = useParams();
  const gameId = params.id as string;
  const [ergebnisse, setErgebnisse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Korrekter Typ für den Fehler-Zustand

  // KORREKTUR: Wir sagen TypeScript, dass dieser Ref entweder 'null' oder eine NodeJS.Timeout enthalten kann.
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
          }
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Ein unbekannter Fehler ist aufgetreten.');
          }
          if (intervalRef.current) clearInterval(intervalRef.current);
        } finally {
            // Wir setzen den Ladezustand nur beim allerersten Laden auf false
            if(isLoading) setIsLoading(false);
        }
      };

      fetchResults();
      intervalRef.current = setInterval(fetchResults, 3000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [gameId]);

  // ... (der Rest des Codes für die Anzeige bleibt exakt gleich)
}