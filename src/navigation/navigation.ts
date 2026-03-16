import { getSettings } from '../state/gameState';
import { getThemeById } from '../data/themes';
import type { PageId } from '../types/game.types';
import { handleCardClick } from '../game/gameBoard';
import { setSettings, resetRuntimeState } from '../state/gameState';
import {
  showThemePreview,
  updateStartBar,
  readSettingsFromForm,
} from '../settings/settings';

export type { PageId } from '../types/game.types';

import {
  getPageBackgroundColors,
  applyThemeForGamePage,
  runGameOverToWinnerTransition,
  GAME_OVER_TO_WINNER_DELAY_MS,
} from './navigationHelpers';

function applyPageBackground(pageId: PageId): void {
  const { bgColor, headerBg } = getPageBackgroundColors(pageId);

  if (pageId === 'game' || pageId === 'game-over' || pageId === 'winner') {
    const theme = getThemeById(getSettings().theme);
    applyThemeForGamePage(pageId, theme);
  }

  document.body.style.backgroundColor = bgColor;
  document.documentElement.style.setProperty('--color-header-bg', headerBg);
}

/**
 * Zeigt eine Seite an und blendet alle anderen aus.
 *
 * @param pageId - ID der anzuzeigenden Seite
 */
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

/**
 * Öffnet das Exit-Bestätigungs-Modal.
 */
export function showExitConfirmModal(): void {
  const modal = document.getElementById('exit-confirm-modal');
  if (modal) {
    modal.classList.add('exit-confirm--visible');
    modal.setAttribute('aria-hidden', 'false');
  }
}

/**
 * Schließt das Exit-Bestätigungs-Modal.
 */
export function hideExitConfirmModal(): void {
  const modal = document.getElementById('exit-confirm-modal');
  if (modal) {
    modal.classList.remove('exit-confirm--visible');
    modal.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Zeigt die Game-Over-Seite und startet nach Verzögerung die Transition zur Winner-Seite.
 */
export function showGameOver(): void {
  showPage('game-over');
  const timeoutId = window.setTimeout(runGameOverToWinnerTransition, GAME_OVER_TO_WINNER_DELAY_MS);
  (window as unknown as { _gameOverTimeout?: number })._gameOverTimeout = timeoutId;
}

/**
 * Registriert den Klick-Handler für das Spielfeld.
 */
export function setupGameBoardListeners(): void {
  const boardEl = document.getElementById('game-board');
  boardEl?.addEventListener('click', handleCardClick);
}

/**
 * Registriert den Shortcut Strg+Shift+G zum direkten Aufruf von Game Over.
 */
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

/**
 * Registriert alle Navigations-Event-Handler (Start, Exit, Home, etc.).
 */
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
