import type { GameSettings, PlayerColor } from '../types/game.types';

let currentSettings: GameSettings = {
  theme: 'code-vibes',
  playerColor: 'blue',
  boardSize: '16',
};

export interface GameRuntimeState {
  scoreBlue: number;
  scoreOrange: number;
  currentPlayer: PlayerColor;
  flippedIndices: number[];
  matchedPairIds: Set<number>;
  isLocked: boolean;
}

let runtimeState: GameRuntimeState = {
  scoreBlue: 0,
  scoreOrange: 0,
  currentPlayer: 'blue',
  flippedIndices: [],
  matchedPairIds: new Set(),
  isLocked: false,
};

/**
 * Liefert eine Kopie der aktuellen Spiel-Einstellungen.
 */
export function getSettings(): GameSettings {
  return { ...currentSettings };
}

/**
 * Setzt die Spiel-Einstellungen.
 *
 * @param settings - Neue Einstellungen
 */
export function setSettings(settings: GameSettings): void {
  currentSettings = { ...settings };
}

/**
 * Liefert eine Kopie des aktuellen Laufzeit-Zustands.
 */
export function getRuntimeState(): GameRuntimeState {
  return { ...runtimeState, matchedPairIds: new Set(runtimeState.matchedPairIds) };
}

export function resetRuntimeState(): void {
  runtimeState = {
    scoreBlue: 0,
    scoreOrange: 0,
    currentPlayer: currentSettings.playerColor,
    flippedIndices: [],
    matchedPairIds: new Set(),
    isLocked: false,
  };
}

/**
 * Erhöht den Score des angegebenen Spielers um 1.
 *
 * @param player - 'blue' oder 'orange'
 */
export function addScore(player: PlayerColor): void {
  if (player === 'blue') runtimeState.scoreBlue++;
  else runtimeState.scoreOrange++;
}

/** Wechselt den aktuellen Spieler */
export function switchPlayer(): void {
  runtimeState.currentPlayer = runtimeState.currentPlayer === 'blue' ? 'orange' : 'blue';
}

/**
 * Fügt einen Index zu den umgedrehten Karten hinzu.
 *
 * @param index - Index der Karte
 */
export function addFlippedIndex(index: number): void {
  if (!runtimeState.flippedIndices.includes(index)) {
    runtimeState.flippedIndices = [...runtimeState.flippedIndices, index];
  }
}

/**
 * Leert die Liste der umgedrehten Karten.
 */
export function clearFlippedIndices(): void {
  runtimeState.flippedIndices = [];
}

export function addMatchedPair(pairId: number): void {
  runtimeState.matchedPairIds.add(pairId);
}

/**
 * Prüft, ob alle Kartenpaare gefunden wurden.
 */
export function areAllPairsMatched(): boolean {
  const pairCount = parseInt(currentSettings.boardSize, 10) / 2;
  return runtimeState.matchedPairIds.size === pairCount;
}

export function setLocked(locked: boolean): void {
  runtimeState.isLocked = locked;
}

/**
 * Ermittelt den Gewinner anhand der Scores.
 *
 * @returns 'blue' | 'orange' | 'draw'
 */
export function getWinner(): PlayerColor | 'draw' {
  const { scoreBlue, scoreOrange } = runtimeState;
  if (scoreBlue > scoreOrange) return 'blue';
  if (scoreOrange > scoreBlue) return 'orange';
  return 'draw';
}
