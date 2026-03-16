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

export function getSettings(): GameSettings {
  return { ...currentSettings };
}

export function setSettings(settings: GameSettings): void {
  currentSettings = { ...settings };
}

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

export function addScore(player: PlayerColor): void {
  if (player === 'blue') runtimeState.scoreBlue++;
  else runtimeState.scoreOrange++;
}

/** Wechselt den aktuellen Spieler */
export function switchPlayer(): void {
  runtimeState.currentPlayer = runtimeState.currentPlayer === 'blue' ? 'orange' : 'blue';
}

export function addFlippedIndex(index: number): void {
  if (!runtimeState.flippedIndices.includes(index)) {
    runtimeState.flippedIndices = [...runtimeState.flippedIndices, index];
  }
}

export function clearFlippedIndices(): void {
  runtimeState.flippedIndices = [];
}

export function addMatchedPair(pairId: number): void {
  runtimeState.matchedPairIds.add(pairId);
}

export function areAllPairsMatched(): boolean {
  const pairCount = parseInt(currentSettings.boardSize, 10) / 2;
  return runtimeState.matchedPairIds.size === pairCount;
}

export function setLocked(locked: boolean): void {
  runtimeState.isLocked = locked;
}

export function getWinner(): PlayerColor | 'draw' {
  const { scoreBlue, scoreOrange } = runtimeState;
  if (scoreBlue > scoreOrange) return 'blue';
  if (scoreOrange > scoreBlue) return 'orange';
  return 'draw';
}
