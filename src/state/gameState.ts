/**
 * Spielzustand – zentrale Speicherung der Einstellungen und Laufzeit-Zustand
 */

import type { GameSettings, PlayerColor } from '../types/game.types';

/** Aktuelle Einstellungen (Standardwerte passend zum Design) */
let currentSettings: GameSettings = {
  theme: 'code-vibes',
  playerColor: 'blue',
  boardSize: '16',
};

/** Laufzeit-Spielzustand (Score, aktueller Spieler, umgedrehte Karten) */
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

/** Gibt die gespeicherten Einstellungen zurück */
export function getSettings(): GameSettings {
  return { ...currentSettings };
}

/** Speichert neue Einstellungen */
export function setSettings(settings: GameSettings): void {
  currentSettings = { ...settings };
}

/** Gibt den aktuellen Laufzeit-Zustand zurück */
export function getRuntimeState(): GameRuntimeState {
  return { ...runtimeState, matchedPairIds: new Set(runtimeState.matchedPairIds) };
}

/** Setzt den Laufzeit-Zustand für einen neuen Spielstart */
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

/** Fügt einen Punkt für den angegebenen Spieler hinzu */
export function addScore(player: PlayerColor): void {
  if (player === 'blue') runtimeState.scoreBlue++;
  else runtimeState.scoreOrange++;
}

/** Wechselt den aktuellen Spieler */
export function switchPlayer(): void {
  runtimeState.currentPlayer = runtimeState.currentPlayer === 'blue' ? 'orange' : 'blue';
}

/** Registriert eine umgedrehte Karte (Index im DOM) */
export function addFlippedIndex(index: number): void {
  if (!runtimeState.flippedIndices.includes(index)) {
    runtimeState.flippedIndices = [...runtimeState.flippedIndices, index];
  }
}

/** Leert die Liste der umgedrehten Karten */
export function clearFlippedIndices(): void {
  runtimeState.flippedIndices = [];
}

/** Markiert ein Paar als gefunden */
export function addMatchedPair(pairId: number): void {
  runtimeState.matchedPairIds.add(pairId);
}

/** Prüft, ob alle Paare gefunden wurden */
export function areAllPairsMatched(): boolean {
  const pairCount = parseInt(currentSettings.boardSize, 10) / 2;
  return runtimeState.matchedPairIds.size === pairCount;
}

/** Sperrt/entsperrt Klicks (während Vergleichs-Animation) */
export function setLocked(locked: boolean): void {
  runtimeState.isLocked = locked;
}

/** Ermittelt den Gewinner aus dem aktuellen Score */
export function getWinner(): PlayerColor | 'draw' {
  const { scoreBlue, scoreOrange } = runtimeState;
  if (scoreBlue > scoreOrange) return 'blue';
  if (scoreOrange > scoreBlue) return 'orange';
  return 'draw';
}
