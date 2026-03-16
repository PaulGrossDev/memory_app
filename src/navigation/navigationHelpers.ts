import { getSettings } from '../state/gameState';
import { getThemeById } from '../data/themes';
import type { Theme, PageId } from '../types/game.types';
import {
  applyExitButtonTheme,
  applyCurrentPlayerTheme,
  applyPlayerIndicatorTheme,
  applyScoreDisplayTheme,
  applyBoardTheme,
  applyExitConfirmModalTheme,
  applyGameOverFinalScoreTheme,
  applyGameOverScoreTheme,
  applyWinnerIntroTheme,
  applyWinnerNameTheme,
  applyWinnerIconTheme,
  applyWinnerButtonTheme,
} from '../theme/themeApply';
import {
  renderGameBoard,
  updateScoreDisplay,
  updateCurrentPlayerIndicator,
  renderGameOverTitle,
  updateGameOverScore,
  updateWinnerDisplay,
} from '../game/gameBoard';

const DEFAULT_BG = '#303131';
const DEFAULT_HEADER = 'transparent';

/**
 * Ermittelt Hintergrund- und Header-Farbe für eine Seite.
 *
 * @param pageId - Seiten-ID
 * @returns Objekt mit bgColor und headerBg
 */
export function getPageBackgroundColors(pageId: PageId): { bgColor: string; headerBg: string } {
  if (pageId === 'home') return { bgColor: DEFAULT_BG, headerBg: DEFAULT_HEADER };
  if (pageId === 'settings') return { bgColor: '#ffffff', headerBg: DEFAULT_HEADER };
  if (pageId !== 'game' && pageId !== 'game-over' && pageId !== 'winner') {
    return { bgColor: DEFAULT_BG, headerBg: DEFAULT_HEADER };
  }

  const theme = getThemeById(getSettings().theme);
  let bgColor: string;
  if (pageId === 'winner') {
    bgColor = theme?.winnerBackground ?? theme?.gameOverBackground ?? theme?.pageBackground ?? DEFAULT_BG;
  } else if (pageId === 'game-over') {
    bgColor = theme?.gameOverBackground ?? theme?.pageBackground ?? DEFAULT_BG;
  } else {
    bgColor = theme?.pageBackground ?? DEFAULT_BG;
  }
  const headerBg = theme?.headerBackground ?? DEFAULT_HEADER;
  return { bgColor, headerBg };
}

/** Verzögerung in ms vor der Transition von Game Over zur Winner-Seite. */
export const GAME_OVER_TO_WINNER_DELAY_MS = 1200;
const GAME_OVER_TO_WINNER_ANIMATION_MS = 500;

/**
 * Führt die Transition von Game Over zur Winner-Seite durch (Hintergrund, Theme, Animation).
 */
export function runGameOverToWinnerTransition(): void {
  const { bgColor, headerBg } = getPageBackgroundColors('winner');
  const theme = getThemeById(getSettings().theme);
  applyThemeForGamePage('winner', theme);
  document.body.style.backgroundColor = bgColor;
  document.documentElement.style.setProperty('--color-header-bg', headerBg);

  const app = document.getElementById('app');
  const gameOverPage = document.getElementById('game-over');
  const winnerPage = document.getElementById('winner');
  if (!app || !gameOverPage || !winnerPage) return;

  const themeId = getSettings().theme;
  winnerPage.classList.add('page--visible');
  app.classList.add('page--game-over-to-winner');
  app.dataset.transitionTheme = themeId;
  document.documentElement.classList.add('page--game-over-to-winner');
  document.body.classList.add('page--game-over-to-winner');

  window.setTimeout(() => {
    app.classList.remove('page--game-over-to-winner');
    delete app.dataset.transitionTheme;
    document.documentElement.classList.remove('page--game-over-to-winner');
    document.body.classList.remove('page--game-over-to-winner');
    gameOverPage.classList.remove('page--visible');
  }, GAME_OVER_TO_WINNER_ANIMATION_MS);
}

/**
 * Wendet Theme und Seiten-spezifische Logik für game, game-over oder winner an.
 *
 * @param pageId - 'game' | 'game-over' | 'winner'
 * @param theme - Aktives Theme
 */
export function applyThemeForGamePage(pageId: 'game' | 'game-over' | 'winner', theme: Theme | undefined): void {
  applyExitButtonTheme(theme);
  applyCurrentPlayerTheme(theme);
  applyPlayerIndicatorTheme(theme);
  applyScoreDisplayTheme(theme);
  applyBoardTheme(theme);
  applyExitConfirmModalTheme(theme);

  if (pageId === 'game') {
    renderGameBoard();
    updateScoreDisplay();
    updateCurrentPlayerIndicator();
  } else if (pageId === 'game-over') {
    renderGameOverTitle(theme);
    applyGameOverFinalScoreTheme(theme);
    applyGameOverScoreTheme(theme);
    updateGameOverScore();
    document.documentElement.style.setProperty('--game-over-title-gap', theme?.gameOverTitleGap ?? '104px');
  } else {
    const winnerEl = document.getElementById('winner');
    if (winnerEl) winnerEl.dataset.theme = getSettings().theme;
    applyWinnerIntroTheme(theme);
    applyWinnerNameTheme(theme);
    applyWinnerIconTheme(theme);
    applyWinnerButtonTheme(theme);
    updateWinnerDisplay();
  }
}
