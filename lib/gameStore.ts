// lib/gameStore.ts - Robuste Version für die Entwicklung

// Wir nutzen das globale Objekt, um den Zustand über Hot-Reloads hinweg zu speichern
const globalForGames = globalThis as unknown as { games: { [key: string]: any } };

// Wenn 'games' im globalen Objekt nicht existiert, initialisieren wir es
if (!globalForGames.games) {
  globalForGames.games = {};
}

// Wir exportieren die Referenz auf das globale 'games'-Objekt
export const games = globalForGames.games;