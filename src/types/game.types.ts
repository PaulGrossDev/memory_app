/**
 * TypeScript-Typen für das Memory-Spiel
 * Zentrale Definitionen für Settings, Themes und Spielzustand.
 */

/** Spielerfarbe – entspricht der Auswahl in den Settings */
export type PlayerColor = 'blue' | 'orange';

/** Spielfeldgröße – 16 Karten (4×4), 24 Karten (4×6), 36 Karten (6×6) */
export type BoardSize = '16' | '24' | '36';

/** Theme-ID – entspricht den 4 Figma-Designvorlagen */
export type ThemeId = 'code-vibes' | 'gaming' | 'da-projects' | 'foods';

/** Einstellungen vor Spielstart – alle Auswahlen des Benutzers */
export interface GameSettings {
  theme: ThemeId;
  playerColor: PlayerColor;
  boardSize: BoardSize;
}

/** Theme-Definition – Farben, Name und Preview-Daten pro Design */
export interface Theme {
  id: ThemeId;
  name: string;
  /** Farben für das Theme (Hintergrund, Karten, Akzente) */
  colors: {
    primary: string;
    secondary: string;
    cardBg: string;
    accent: string;
  };
  /** Farben der 2 Preview-Karten (für die Vorschau links) */
  previewCardColors: [string, string];
  /** Bild-URLs für die Preview – optional, Platzhalter wenn nicht vorhanden */
  previewImages?: {
    image1: string;
    image2: string;
  };
}
