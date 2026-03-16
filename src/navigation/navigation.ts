/**
 * Navigation – Seitenwechsel, Modals, Event-Setup
 */

import { getSettings } from '../state/gameState';
import { getThemeById } from '../data/themes';
import type { ThemeId } from '../types/game.types';
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
  handleCardClick,
} from '../game/gameBoard';
import { setSettings, resetRuntimeState } from '../state/gameState';
import {
  showThemePreview,
  updateStartBar,
  readSettingsFromForm,
} from '../settings/settings';

export type PageId = 'home' | 'settings' | 'game' | 'game-over' | 'winner';

function applyPageBackground(pageId: PageId): void {
  let bgColor: string;
  let headerBg: string;

  if (pageId === 'home') {
    bgColor = '#303131';
    headerBg = 'transparent';
  } else if (pageId === 'settings') {
    bgColor = '#ffffff';
    headerBg = 'transparent';
  } else if (pageId === 'game' || pageId === 'game-over' || pageId === 'winner') {
    const theme = getThemeById(getSettings().theme);
    bgColor =
      pageId === 'winner'
        ? (theme?.winnerBackground ?? theme?.gameOverBackground ?? theme?.pageBackground ?? '#303131')
        : pageId === 'game-over'
          ? (theme?.gameOverBackground ?? theme?.pageBackground ?? '#303131')
          : (theme?.pageBackground ?? '#303131');
    headerBg = theme?.headerBackground ?? 'transparent';
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
    } else if (pageId === 'winner') {
      applyWinnerIntroTheme(theme);
      applyWinnerNameTheme(theme);
      applyWinnerIconTheme(theme);
      applyWinnerButtonTheme(theme);
      updateWinnerDisplay();
    }
  } else {
    bgColor = '#303131';
    headerBg = 'transparent';
  }

  document.body.style.backgroundColor = bgColor;
  document.documentElement.style.setProperty('--color-header-bg', headerBg);
}

/** Zeigt die gewünschte Seite an und blendet die anderen aus */
export function showPage(pageId: PageId): void {
  const pages = document.querySelectorAll<HTMLElement>('.page');
  const targetPage = document.getElementById(pageId);

  if (!targetPage) {
    console.warn(`Seite "${pageId}" nicht gefunden.`);
    return;
  }

  pages.forEach((page) => {
    page.classList.remove('page--visible');
  });

  targetPage.classList.add('page--visible');
  applyPageBackground(pageId);
}

/** Zeigt das Exit-Bestätigungs-Modal an */
export function showExitConfirmModal(): void {
  const modal = document.getElementById('exit-confirm-modal');
  if (modal) {
    modal.classList.add('exit-confirm--visible');
    modal.setAttribute('aria-hidden', 'false');
  }
}

/** Blendet das Exit-Bestätigungs-Modal aus */
export function hideExitConfirmModal(): void {
  const modal = document.getElementById('exit-confirm-modal');
  if (modal) {
    modal.classList.remove('exit-confirm--visible');
    modal.setAttribute('aria-hidden', 'true');
  }
}

const GAME_OVER_TO_WINNER_DELAY_MS = 1200;
const GAME_OVER_TO_WINNER_ANIMATION_MS = 500;

/** Zeigt die Game-Over-Seite und wechselt nach 1200ms mit Animation zur Winner-Page */
export function showGameOver(): void {
  showPage('game-over');
  const timeoutId = window.setTimeout(() => {
    const app = document.getElementById('app');
    const gameOverPage = document.getElementById('game-over');
    const winnerPage = document.getElementById('winner');
    if (!app || !gameOverPage || !winnerPage) return;

    applyPageBackground('winner');
    winnerPage.classList.add('page--visible');
    app.classList.add('page--game-over-to-winner');
    document.documentElement.classList.add('page--game-over-to-winner');
    document.body.classList.add('page--game-over-to-winner');

    window.setTimeout(() => {
      app.classList.remove('page--game-over-to-winner');
      document.documentElement.classList.remove('page--game-over-to-winner');
      document.body.classList.remove('page--game-over-to-winner');
      gameOverPage.classList.remove('page--visible');
    }, GAME_OVER_TO_WINNER_ANIMATION_MS);
  }, GAME_OVER_TO_WINNER_DELAY_MS);
  (window as unknown as { _gameOverTimeout?: number })._gameOverTimeout = timeoutId;
}

/** Event-Delegation für Karten-Klicks */
export function setupGameBoardListeners(): void {
  const boardEl = document.getElementById('game-board');
  boardEl?.addEventListener('click', handleCardClick);
}

/** Shortcut: Ctrl+Shift+G springt zum Game-Over-Screen */
export function setupGameOverShortcut(): void {
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key?.toLowerCase() === 'g') {
      const gamePage = document.getElementById('game');
      if (gamePage?.classList.contains('page--visible')) {
        e.preventDefault();
        hideExitConfirmModal();
        showGameOver();
      }
    }
  });
}

/** Navigation und Exit-Modal Event-Listener */
export function setupNavigation(): void {
  const btnStart = document.getElementById('btn-start');
  const btnStartGame = document.getElementById('btn-start-game');
  const btnExitGame = document.getElementById('btn-exit-game');
  const btnHome = document.getElementById('btn-home');

  if (btnStart) {
    btnStart.addEventListener('click', () => showPage('settings'));
  }

  if (btnStartGame) {
    btnStartGame.addEventListener('click', () => {
      readSettingsFromForm();
      resetRuntimeState();
      showPage('game');
    });
  }

  if (btnExitGame) {
    btnExitGame.addEventListener('click', showExitConfirmModal);
  }

  const btnExitCancel = document.getElementById('btn-exit-cancel');
  const btnExitConfirm = document.getElementById('btn-exit-confirm');
  if (btnExitCancel) {
    btnExitCancel.addEventListener('click', hideExitConfirmModal);
  }
  if (btnExitConfirm) {
    btnExitConfirm.addEventListener('click', () => {
      hideExitConfirmModal();
      showPage('settings');
    });
  }

  const exitModalBackdrop = document.querySelector('.exit-confirm__backdrop');
  if (exitModalBackdrop) {
    exitModalBackdrop.addEventListener('click', hideExitConfirmModal);
  }

  if (btnHome) {
    btnHome.addEventListener('click', () => showPage('settings'));
  }
}
