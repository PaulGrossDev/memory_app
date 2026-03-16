import { getSettings, getRuntimeState, getWinner } from '../state/gameState';
import { PLAYER_COLORS } from '../data/themes';
import { resolvePath } from '../utils/path';
import { setCssVars, setCssVarsOnElement, setScoreIcons } from './themeApplyHelpers';
import type { Theme } from '../types/game.types';

function setExitButtonIcons(
  iconPath: string,
  hoverIcon: string | undefined,
  iconDefault: HTMLImageElement | null,
  iconHover: HTMLImageElement | null
): void {
  if (iconDefault) {
    iconDefault.src = resolvePath(iconPath);
    iconDefault.alt = '';
  }
  if (iconHover) {
    iconHover.src = resolvePath(hoverIcon ?? iconPath);
    iconHover.alt = '';
  }
}

/**
 * Wendet das Exit-Button-Theme an (Icons, Schrift, Farben).
 */
export function applyExitButtonTheme(theme: { exitButton: Theme['exitButton'] } | undefined): void {
  if (!theme?.exitButton) return;

  const btn = document.getElementById('btn-exit-game');
  const iconDefault = btn?.querySelector<HTMLImageElement>('.game__exit-icon--default');
  const iconHover = btn?.querySelector<HTMLImageElement>('.game__exit-icon--hover');
  const { icon: iconPath, fontFamily, fontWeight, fontSize, color, gap, padding, background, border, borderRadius, hover } = theme.exitButton;

  setCssVars([
    ['--exit-btn-font-family', fontFamily],
    ['--exit-btn-font-weight', String(fontWeight)],
    ['--exit-btn-font-size', fontSize],
    ['--exit-btn-color', color],
    ['--exit-btn-gap', gap ?? '10px'],
    ['--exit-btn-padding', padding ?? '12px 20px'],
    ['--exit-btn-background', background ?? 'transparent'],
    ['--exit-btn-border', border ?? 'none'],
    ['--exit-btn-border-radius', borderRadius ?? '0'],
    ['--exit-btn-hover-background', hover?.background ?? (background ?? 'transparent')],
    ['--exit-btn-hover-border', hover?.border ?? (border ?? 'none')],
    ['--exit-btn-hover-box-shadow', hover?.boxShadow ?? 'none'],
    ['--exit-btn-hover-color', hover?.color ?? color],
  ]);

  setExitButtonIcons(iconPath, hover?.iconHover, iconDefault ?? null, iconHover ?? null);
}

/**
 * Wendet das Current-Player-Theme an (Schrift, Farbe).
 */
export function applyCurrentPlayerTheme(theme: Theme | undefined): void {
  const cp = theme?.currentPlayer;
  if (!cp) return;

  setCssVars([
    ['--current-player-font-family', cp.fontFamily],
    ['--current-player-font-weight', String(cp.fontWeight)],
    ['--current-player-font-size', cp.fontSize],
    ['--current-player-color', cp.color],
  ]);
}

/**
 * Wendet das Player-Indicator-Theme an (Label oder Figure mit Styling).
 */
export function applyPlayerIndicatorTheme(theme: Theme | undefined): void {
  const indicator = theme?.playerIndicator;
  const indicatorEl = document.getElementById('game-player-indicator');
  const iconEl = indicatorEl?.querySelector<HTMLImageElement>('.game__player-icon');
  if (!indicator || !indicatorEl || !iconEl) return;

  indicatorEl.classList.remove('game__player-indicator--label', 'game__player-indicator--figure');

  const currentPlayer = getRuntimeState().currentPlayer;
  if (indicator.type === 'label') {
    indicatorEl.classList.add('game__player-indicator--label');
    const iconPath = currentPlayer === 'blue' ? '/assets/icons/label-blue.svg' : '/assets/icons/label-orange.svg';
    iconEl.src = resolvePath(iconPath);
    document.documentElement.style.removeProperty('--player-indicator-bg');
    document.documentElement.style.removeProperty('--player-indicator-border-radius');
    document.documentElement.style.removeProperty('--player-indicator-padding');
  } else {
    indicatorEl.classList.add('game__player-indicator--figure');
    iconEl.src = resolvePath('/assets/icons/figure-white.svg');
    document.documentElement.style.setProperty('--player-indicator-bg', PLAYER_COLORS[currentPlayer]);
    document.documentElement.style.setProperty('--player-indicator-border-radius', indicator.borderRadius ?? '8px');
    document.documentElement.style.setProperty('--player-indicator-padding', indicator.padding ?? '4px 8px');
  }
}

function applyScoreDisplayVars(score: NonNullable<Theme['scoreDisplay']>): void {
  const order = score.order === 'orange-first' ? { blue: '2', orange: '1' } : { blue: '1', orange: '2' };
  setCssVars([
    ['--score-display-bg', score.background ?? 'transparent'],
    ['--score-display-gap', score.gap ?? '20px'],
    ['--score-display-padding', score.padding ?? '17px 20px'],
    ['--score-display-border-radius', score.borderRadius ?? '0'],
    ['--score-item-gap', score.itemGap ?? '4px'],
    ['--score-font-family', score.fontFamily ?? 'Red Rose'],
    ['--score-font-weight', String(score.fontWeight ?? 700)],
    ['--score-font-size', score.fontSize ?? '24px'],
    ['--score-color-blue', score.colorBlue ?? '#2BB1FF'],
    ['--score-color-orange', score.colorOrange ?? '#F58E39'],
    ['--score-order-blue', order.blue],
    ['--score-order-orange', order.orange],
  ]);
}

/**
 * Wendet das Score-Display-Theme an (Layout, Farben, Icons).
 */
export function applyScoreDisplayTheme(theme: Theme | undefined): void {
  const score = theme?.scoreDisplay;
  const scoreEl = document.getElementById('game-score');
  const iconBlue = scoreEl?.querySelector<HTMLImageElement>('.game__score-icon--blue');
  const iconOrange = scoreEl?.querySelector<HTMLImageElement>('.game__score-icon--orange');
  if (!score || !scoreEl) return;

  scoreEl.classList.remove('game__score--label', 'game__score--figure');
  scoreEl.classList.add(score.type === 'label' ? 'game__score--label' : 'game__score--figure');
  applyScoreDisplayVars(score);
  setScoreIcons(iconBlue ?? null, iconOrange ?? null, score.type);
}

const BOARD_GRID: Record<string, { cols: number; rows: number }> = {
  '16': { cols: 4, rows: 4 },
  '24': { cols: 6, rows: 4 },
  '36': { cols: 6, rows: 6 },
};

/**
 * Wendet das Board-Theme an (Grid, Gap).
 */
export function applyBoardTheme(theme: Theme | undefined): void {
  const grid = BOARD_GRID[getSettings().boardSize] ?? BOARD_GRID['16'];
  document.documentElement.style.setProperty('--board-columns', `repeat(${grid.cols}, auto)`);
  document.documentElement.style.setProperty('--board-rows', `repeat(${grid.rows}, auto)`);
  document.documentElement.style.setProperty('--board-gap', theme?.boardGap ?? '6px');
}

function setExitModalCancelButton(cancel: NonNullable<Theme['exitConfirmModal']>['cancelButton'], btn: HTMLElement | null): void {
  if (!cancel || !btn) return;
  btn.textContent = cancel.text;
  setCssVars([
    ['--exit-cancel-gap', cancel.gap ?? '0'],
    ['--exit-cancel-padding', cancel.padding ?? '12px 20px'],
    ['--exit-cancel-bg', cancel.background ?? '#e5e7eb'],
    ['--exit-cancel-border', cancel.border ?? 'none'],
    ['--exit-cancel-radius', cancel.borderRadius ?? '8px'],
    ['--exit-cancel-shadow', cancel.boxShadow ?? 'none'],
    ['--exit-cancel-font-family', cancel.fontFamily],
    ['--exit-cancel-font-weight', String(cancel.fontWeight)],
    ['--exit-cancel-font-size', cancel.fontSize],
    ['--exit-cancel-color', cancel.color],
  ]);
}

function setExitModalConfirmButton(confirm: NonNullable<Theme['exitConfirmModal']>['confirmButton'], btn: HTMLElement | null): void {
  if (!confirm || !btn) return;
  btn.textContent = confirm.text;
  setCssVars([
    ['--exit-confirm-btn-gap', confirm.gap ?? '0'],
    ['--exit-confirm-btn-padding', confirm.padding ?? '12px 20px'],
    ['--exit-confirm-btn-bg', confirm.background ?? '#ef4444'],
    ['--exit-confirm-btn-border', confirm.border ?? 'none'],
    ['--exit-confirm-btn-radius', confirm.borderRadius ?? '8px'],
    ['--exit-confirm-btn-shadow', confirm.boxShadow ?? 'none'],
    ['--exit-confirm-btn-font-family', confirm.fontFamily],
    ['--exit-confirm-btn-font-weight', String(confirm.fontWeight)],
    ['--exit-confirm-btn-font-size', confirm.fontSize],
    ['--exit-confirm-btn-color', confirm.color],
  ]);
}

/**
 * Wendet das Exit-Confirm-Modal-Theme an (Container, Buttons).
 */
export function applyExitConfirmModalTheme(theme: Theme | undefined): void {
  const modal = theme?.exitConfirmModal;
  if (!modal) return;

  setCssVars([
    ['--exit-confirm-bg', modal.background ?? '#FFFFFF'],
    ['--exit-confirm-radius', modal.borderRadius ?? '0'],
    ['--exit-confirm-text-align', modal.textAlign ?? 'left'],
    ['--exit-confirm-text-max-width', modal.textMaxWidth ?? 'none'],
    ['--exit-confirm-animation', modal.animation ? `exit-${modal.animation}` : 'none'],
    ['--exit-confirm-animation-duration', modal.animationDuration ?? '300ms'],
    ['--exit-confirm-animation-timing', modal.animationTimingFunction ?? 'ease-out'],
    ['--exit-confirm-font-family', modal.fontFamily],
    ['--exit-confirm-font-weight', String(modal.fontWeight)],
    ['--exit-confirm-font-size', modal.fontSize],
    ['--exit-confirm-color', modal.color],
  ]);

  setExitModalCancelButton(modal.cancelButton, document.getElementById('btn-exit-cancel'));
  setExitModalConfirmButton(modal.confirmButton, document.getElementById('btn-exit-confirm'));
}

/**
 * Wendet das Game-Over-Final-Score-Theme an.
 */
export function applyGameOverFinalScoreTheme(theme: Theme | undefined): void {
  const finalScore = theme?.gameOverFinalScore;
  const el = document.getElementById('game-over-final-score');
  if (!finalScore || !el) return;

  el.textContent = 'Final score';
  document.documentElement.style.setProperty('--game-over-final-score-font-family', finalScore.fontFamily);
  document.documentElement.style.setProperty('--game-over-final-score-font-weight', String(finalScore.fontWeight));
  document.documentElement.style.setProperty('--game-over-final-score-font-size', finalScore.fontSize);
  document.documentElement.style.setProperty('--game-over-final-score-color', finalScore.color);
}

/**
 * Wendet das Score-Display-Theme auf der Game-Over-Seite an.
 */
export function applyGameOverScoreTheme(theme: Theme | undefined): void {
  const score = theme?.scoreDisplay;
  const scoreEl = document.getElementById('game-over-score');
  const iconBlue = scoreEl?.querySelector<HTMLImageElement>('.game__score-icon--blue');
  const iconOrange = scoreEl?.querySelector<HTMLImageElement>('.game__score-icon--orange');
  if (!score || !scoreEl) return;

  scoreEl.classList.remove('game__score--label', 'game__score--figure');
  scoreEl.classList.add(score.type === 'label' ? 'game__score--label' : 'game__score--figure');
  setScoreIcons(iconBlue ?? null, iconOrange ?? null, score.type);
}

function setWinnerButtonVars(winnerEl: HTMLElement, btn: NonNullable<Theme['winnerButton']>): void {
  setCssVarsOnElement(winnerEl, [
    ['--winner-btn-font-family', btn.fontFamily],
    ['--winner-btn-font-weight', String(btn.fontWeight)],
    ['--winner-btn-font-size', btn.fontSize],
    ['--winner-btn-color', btn.color],
    ['--winner-btn-padding', btn.padding ?? '12px 20px'],
    ['--winner-btn-background', btn.background ?? 'transparent'],
    ['--winner-btn-border', btn.border ?? 'none'],
    ['--winner-btn-border-radius', btn.borderRadius ?? '0'],
    ['--winner-btn-box-shadow', btn.boxShadow ?? 'none'],
    ['--winner-btn-letter-spacing', btn.letterSpacing ?? 'normal'],
  ]);
}

/**
 * Wendet das Winner-Button-Theme an (Text, Styling).
 */
export function applyWinnerButtonTheme(theme: Theme | undefined): void {
  const btn = theme?.winnerButton;
  const btnEl = document.getElementById('btn-home');
  const winnerEl = document.getElementById('winner');
  if (!winnerEl) return;

  if (btn && btnEl) {
    btnEl.textContent = btn.text;
    setWinnerButtonVars(winnerEl, btn);
  } else if (btnEl) {
    btnEl.textContent = 'Zur Startseite';
  }
}

function setWinnerIconVars(winnerEl: HTMLElement, icon: NonNullable<Theme['winnerIcon']> | null): void {
  const c = icon?.container;
  setCssVarsOnElement(winnerEl, [
    ['--winner-icon-width', icon?.width ?? '200px'],
    ['--winner-icon-border', icon?.border ?? 'none'],
    ['--winner-icon-container-padding', c?.padding ?? '0'],
    ['--winner-icon-container-background', c?.background ?? 'transparent'],
    ['--winner-icon-container-box-shadow', c?.boxShadow ?? 'none'],
  ]);
}

/**
 * Wendet das Winner-Icon-Theme an (Größe, Container).
 */
export function applyWinnerIconTheme(theme: Theme | undefined): void {
  const winnerEl = document.getElementById('winner');
  if (!winnerEl) return;
  setWinnerIconVars(winnerEl, theme?.winnerIcon ?? null);
}

function getWinnerNameColor(name: NonNullable<Theme['winnerName']>): string {
  const winner = getWinner();
  if (name.color) return name.color;
  if (winner === 'blue' && name.colorBlue) return name.colorBlue;
  if (winner === 'orange' && name.colorOrange) return name.colorOrange;
  return name.colorBlue ?? name.colorOrange ?? '#ffffff';
}

/**
 * Wendet das Winner-Name-Theme an (Schrift, Farbe je nach Gewinner).
 */
export function applyWinnerNameTheme(theme: Theme | undefined): void {
  const name = theme?.winnerName;
  const winnerEl = document.getElementById('winner');
  if (!name || !winnerEl) return;

  setCssVarsOnElement(winnerEl, [
    ['--winner-name-font-family', name.fontFamily],
    ['--winner-name-font-weight', String(name.fontWeight)],
    ['--winner-name-font-size', name.fontSize],
    ['--winner-name-text-align', name.textAlign ?? 'center'],
    ['--winner-name-text-transform', name.textTransform ?? 'none'],
    ['--winner-name-letter-spacing', name.letterSpacing ?? 'normal'],
    ['--winner-name-box-shadow', name.boxShadow ?? 'none'],
    ['--winner-name-text-shadow', name.textShadow ?? 'none'],
    ['--winner-name-color', getWinnerNameColor(name)],
  ]);
}

/**
 * Wendet das Winner-Intro-Theme an (Schrift, Farbe).
 */
export function applyWinnerIntroTheme(theme: Theme | undefined): void {
  const intro = theme?.winnerIntro;
  const introEl = document.getElementById('winner-intro');
  const winnerEl = document.getElementById('winner');
  if (!intro || !introEl || !winnerEl) return;

  introEl.textContent = 'The winner is';
  setCssVarsOnElement(winnerEl, [
    ['--winner-intro-font-family', intro.fontFamily],
    ['--winner-intro-font-weight', String(intro.fontWeight)],
    ['--winner-intro-font-size', intro.fontSize],
    ['--winner-intro-color', intro.color],
    ['--winner-intro-line-height', intro.lineHeight ?? 'normal'],
  ]);
}
