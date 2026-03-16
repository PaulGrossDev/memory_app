export type PlayerColor = 'blue' | 'orange';
export type BoardSize = '16' | '24' | '36';
export type ThemeId = 'code-vibes' | 'gaming' | 'da-projects' | 'foods';
export type PageId = 'home' | 'settings' | 'game' | 'game-over' | 'winner';

export interface FontStyle {
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  color: string;
}

export interface GameSettings {
  theme: ThemeId;
  playerColor: PlayerColor;
  boardSize: BoardSize;
}

export interface Theme {
  id: ThemeId;
  name: string;
  pageBackground: string;
  gameOverBackground?: string;
  winnerBackground?: string;
  winnerIntro?: FontStyle & { lineHeight?: string };
  winnerIcon?: {
    path?: string;
    bluePath?: string;
    orangePath?: string;
    width?: string;
    border?: string;
    container?: {
      padding?: string;
      background?: string;
      boxShadow?: string;
    };
  };
  winnerButton?: FontStyle & {
    text: string;
    padding?: string;
    background?: string;
    border?: string;
    borderRadius?: string;
    boxShadow?: string;
    letterSpacing?: string;
  };
  winnerName?: {
    fontFamily: string;
    fontWeight: number;
    fontSize: string;
    textAlign?: 'center';
    color?: string;
    colorBlue?: string;
    colorOrange?: string;
    textTransform?: 'uppercase' | 'none';
    letterSpacing?: string;
    boxShadow?: string;
    textShadow?: string;
  };
  gameOverTitleGap?: string;
  gameOverFinalScore?: FontStyle;
  gameOverTitle?: {
    type: 'svg-letters';
    iconsPath: string;
    dropShadow?: string;
  } | {
    type: 'text';
    fontFamily: string;
    fontWeight: number;
    fontSize: string;
    color: string;
    textShadow?: string;
    letterSpacing?: string;
  };
  headerBackground: string;
  exitButton: FontStyle & {
    icon: string;
    gap?: string;
    padding?: string;
    background?: string;
    border?: string;
    borderRadius?: string;
    hover?: {
      background?: string;
      border?: string;
      boxShadow?: string;
      color?: string;
      iconHover?: string;
    };
  };
  currentPlayer?: FontStyle;
  playerIndicator?: {
    type: 'label' | 'figure';
    borderRadius?: string;
    padding?: string;
  };
  scoreDisplay?: {
    type: 'label' | 'figure';
    background?: string;
    gap?: string;
    padding?: string;
    borderRadius?: string;
    itemGap?: string;
    order?: 'blue-first' | 'orange-first';
    fontFamily?: string;
    fontWeight?: number;
    fontSize?: string;
    colorBlue?: string;
    colorOrange?: string;
  };
  cardsPath?: string;
  cardBaseName?: string;
  backsitePath?: string;
  boardGap?: string;
  colors: {
    primary: string;
    secondary: string;
    cardBg: string;
    accent: string;
  };
  previewCardColors: [string, string];
  previewImages?: {
    image1: string;
    image2: string;
  };
  exitConfirmModal?: {
    background?: string;
    borderRadius?: string;
    textAlign?: 'left' | 'center';
    textMaxWidth?: string;
    animation?: 'move-in-top' | 'move-in-bottom' | 'dissolve';
    animationDuration?: string;
    animationTimingFunction?: string;
    fontFamily: string;
    fontWeight: number;
    fontSize: string;
    color: string;
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
