// app/page.tsx - FINALE VERSION

"use client"; 
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Startseite() {
  const router = useRouter();

  const handleCreateGame = async (paketName: string) => {
    try {
      const response = await fetch('/api/games/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paket: paketName }),
      });
      const data = await response.json();
      if (data.gameId) {
        router.push(`/spiel/${data.gameId}`);
      }
    } catch (error) {
      console.error("Fehler beim Erstellen des Spiels:", error);
      alert("Ups, da ist etwas schiefgelaufen.");
    }
  };

  return (
    <div className="start-page-layout">
        <h1 className="title">
          Schluss mit Smalltalk.
        </h1>
        <p className="description">
          15 ehrliche Fragen, keine Ausreden. Findet heraus, ob ihr auf einer Wellenlänge funkt oder auf verschiedenen Planeten unterwegs seid.
        </p>
        <div className="grid">
          <div className="card" onClick={() => handleCreateGame('schnelles-vorspiel')}>
            <h2>
              Das schnelle Vorspiel 
              <Image src="/arrow-yellow.svg" alt="Pfeil nach rechts" width={24} height={24} />
            </h2>
            <p>10 lockere Fragen, um das Eis zu brechen.</p>
          </div>
          <div className="card" onClick={() => handleCreateGame('schonungslos-ehrlich')}>
            <h2>
              Schonungslos ehrlich 
              <Image src="/arrow-yellow.svg" alt="Pfeil nach rechts" width={24} height={24} />
            </h2>
            <p>20 Fragen, die in die Tiefe gehen.</p>
          </div>
          <div className="card" onClick={() => handleCreateGame('crash-test')}>
            <h2>
              Der Kompatibilitäts-Crash-Test 
              <Image src="/arrow-yellow.svg" alt="Pfeil nach rechts" width={24} height={24} />
            </h2>
            <p>15 abgedrehte Szenarien und absurde Entscheidungen.</p>
          </div>
        </div>
    </div>
  );
}