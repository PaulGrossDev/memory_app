/**
 * TypeScript-Typen für das Memory-Spiel
 * Zentrale Definitionen für Settings, Themes und Spielzustand.
 */

/** Spielerfarbe – entspricht der Auswahl in den Settings */
export type PlayerColor = 'blue' | 'orange';

/** Spielfeldgröße – 16 Karten (4×4), 24 Karten (6×4), 36 Karten (6×6) */
export type BoardSize = '16' | '24' | '36';

/** Theme-ID – entspricht den 4 Figma-Designvorlagen */
export type ThemeId = 'code-vibes' | 'gaming' | 'da-projects' | 'foods';

/** Basis-Schriftstil – fontFamily, fontWeight, fontSize, color (Topic 11 Interfaces) */
export interface FontStyle {
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  color: string;
}

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
  /** Vollbild-Hintergrundfarbe beim Spiel (ganzer Bildschirm) */
  pageBackground: string;
  /** Hintergrundfarbe der Game-Over-Seite */
  gameOverBackground?: string;
  /** Hintergrundfarbe der Winner-Page (überschreibt gameOverBackground nur auf dieser Seite) */
  winnerBackground?: string;
  /** "The winner is" Text auf der Winner-Page – pro Theme unterschiedlich */
  winnerIntro?: FontStyle & { lineHeight?: string };
  /** Gewinner-Icon auf der Winner-Page – pro Theme unterschiedlich */
  winnerIcon?: {
    /** Fester Pfad (z.B. gaming: Trophäe für alle) */
    path?: string;
    /** Getrennte Pfade für Blue/Orange (z.B. code-vibes) */
    bluePath?: string;
    orangePath?: string;
    /** Breite: '200px', 'auto' für Originalgröße */
    width?: string;
    /** Border am Icon (z.B. projects: 6px solid #FFFFFF) – mit box-sizing: border-box innen */
    border?: string;
    /** Container um das Icon (z.B. foods: Padding, Hintergrund, Schatten) */
    container?: {
      padding?: string;
      background?: string;
      boxShadow?: string;
    };
  };
  /** Button "Zur Startseite" auf der Winner-Page – pro Theme unterschiedlich */
  winnerButton?: FontStyle & {
    text: string;
    padding?: string;
    background?: string;
    border?: string;
    borderRadius?: string;
    boxShadow?: string;
    letterSpacing?: string;
  };
  /** Gewinner-Name (Blue/Orange) auf der Winner-Page – pro Theme unterschiedlich */
  winnerName?: {
    fontFamily: string;
    fontWeight: number;
    fontSize: string;
    textAlign?: 'center';
    /** Einheitliche Farbe (projects, foods) */
    color?: string;
    /** Getrennte Farben für Blue/Orange (code-vibes, gaming) */
    colorBlue?: string;
    colorOrange?: string;
    textTransform?: 'uppercase' | 'none';
    letterSpacing?: string;
    boxShadow?: string;
    /** Schatten an den Buchstaben (z.B. gaming) */
    textShadow?: string;
  };
  /** Abstand zwischen GAME OVER Titel und Final score (px) */
  gameOverTitleGap?: string;
  /** "Final score" Text unter dem GAME OVER Titel */
  gameOverFinalScore?: FontStyle;
  /** "GAME OVER" Titel – SVG-Buchstaben (code-vibes) oder Text */
  gameOverTitle?: {
    type: 'svg-letters';
    iconsPath: string;
    /** filter: drop-shadow() – Komma-getrennt für mehrere Schichten */
    dropShadow?: string;
  } | {
    type: 'text';
    fontFamily: string;
    fontWeight: number;
    fontSize: string;
    color: string;
    /** text-shadow für Schatten an den Buchstaben (nicht am Container) */
    textShadow?: string;
    letterSpacing?: string;
  };
  /** Hintergrundfarbe des Spiel-Headers (Score, Spieler, Exit) */
  headerBackground: string;
  /** Exit-Button: Icon, Schrift und Button-Styling (pro Theme unterschiedlich) */
  exitButton: FontStyle & {
    icon: string;
    /** Button-Container: gap, padding, background, border, border-radius */
    gap?: string;
    padding?: string;
    background?: string;
    border?: string;
    borderRadius?: string;
    /** Hover-Zustand (optional, pro Theme) */
    hover?: {
      background?: string;
      border?: string;
      boxShadow?: string;
      /** Schriftfarbe beim Hover (z.B. weiß) */
      color?: string;
      /** Pfad zum Icon in Hover-Farbe (z.B. exit-hover.svg) */
      iconHover?: string;
    };
  };
  /** "Current player:" Anzeige im Spiel-Header – pro Theme unterschiedlich */
  currentPlayer?: FontStyle;
  /** Spieler-Indikator neben "Current player:" – Code vibes: label ohne BG, Rest: figure-white mit BG */
  playerIndicator?: {
    type: 'label' | 'figure';
    /** Nur bei figure: border-radius, padding */
    borderRadius?: string;
    padding?: string;
  };
  /** Punktestand-Anzeige links im Header */
  scoreDisplay?: {
    type: 'label' | 'figure';
    /** label: Blue/Orange Text sichtbar, figure: nur Icon+Zahl */
    background?: string;
    gap?: string;
    padding?: string;
    borderRadius?: string;
    /** Gap zwischen Icon/Label und Zahl innerhalb eines Items */
    itemGap?: string;
    /** Reihenfolge: 'blue-first' | 'orange-first' */
    order?: 'blue-first' | 'orange-first';
    fontFamily?: string;
    fontWeight?: number;
    fontSize?: string;
    colorBlue?: string;
    colorOrange?: string;
  };
  /** Basis-Pfad für Kartenbilder (z.B. /assets/themes/code-vibes/cards/) */
  cardsPath?: string;
  /** Basis-Name der Kartenbilder (z.B. "Cards 5" → Cards 5.png, Cards 5 (1).png) */
  cardBaseName?: string;
  /** Pfad zur Kartenrückseite */
  backsitePath?: string;
  /** Abstand zwischen Karten im Grid (px) */
  boardGap?: string;
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
  /** Exit-Bestätigungs-Modal: Styling für Titeltext und Buttons */
  exitConfirmModal?: {
    background?: string;
    borderRadius?: string;
    textAlign?: 'left' | 'center';
    textMaxWidth?: string;
    /** Animation beim Erscheinen: 'move-in-top' | 'move-in-bottom' | 'dissolve' */
    animation?: 'move-in-top' | 'move-in-bottom' | 'dissolve';
    animationDuration?: string;
    animationTimingFunction?: string;
    fontFamily: string;
    fontWeight: number;
    fontSize: string;
    color: string;
    /** Linker Button: "Back to game" / "No, back to game" */
    cancelButton?: {
      text: string;
      gap?: string;
      padding?: string;
      background?: string;
      border?: string;
      borderRadius?: string;
      boxShadow?: string;
      fontFamily: string;
      fontWeight: number;
      fontSize: string;
      color: string;
    };
    /** Rechter Button: "Exit Game" / "Yes, quit game" */
    confirmButton?: {
      text: string;
      gap?: string;
      padding?: string;
      background?: string;
      border?: string;
      borderRadius?: string;
      boxShadow?: string;
      fontFamily: string;
      fontWeight: number;
      fontSize: string;
      color: string;
    };
  };
}
