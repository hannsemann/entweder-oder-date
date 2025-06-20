// Wir nutzen das globale Objekt von Node.js, um unseren Speicher abzulegen.
// Dieses Objekt überlebt die Hot-Reloads des Entwicklungs-Servers.
const globalForGames = globalThis as unknown as {
  games: { [key: string]: any };
};

// Wir prüfen, ob unser Speicher schon im globalen Objekt existiert.
// Wenn nicht (beim allerersten Start), erstellen wir ihn.
if (!globalForGames.games) {
  globalForGames.games = {};
}

// Wir exportieren die Referenz auf diesen "sicheren" Speicherort.
export const games = globalForGames.games;