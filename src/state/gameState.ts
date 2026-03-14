/**
 * Spielzustand – zentrale Speicherung der Einstellungen
 * Wird beim Start des Spiels genutzt.
 */

import type { GameSettings } from '../types/game.types';

/** Aktuelle Einstellungen (Standardwerte passend zum Design) */
let currentSettings: GameSettings = {
  theme: 'code-vibes',
  playerColor: 'blue',
  boardSize: '16',
};

/** Gibt die gespeicherten Einstellungen zurück */
export function getSettings(): GameSettings {
  return { ...currentSettings };
}

/** Speichert neue Einstellungen */
export function setSettings(settings: GameSettings): void {
  currentSettings = { ...settings };
}
