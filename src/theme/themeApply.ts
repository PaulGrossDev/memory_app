import { getSettings, getRuntimeState, getWinner } from '../state/gameState';
import { getThemeById, PLAYER_COLORS } from '../data/themes';
import { resolvePath } from '../utils/path';
import type { Theme } from '../types/game.types';

export function applyExitButtonTheme(theme: { exitButton: Theme['exitButton'] } | undefined): void {
  if (!theme?.exitButton) return;

  const btn = document.getElementById('btn-exit-game');
  const iconDefault = btn?.querySelector<HTMLImageElement>('.game__exit-icon--default');
  const iconHover = btn?.querySelector<HTMLImageElement>('.game__exit-icon--hover');
  const { icon: iconPath, fontFamily, fontWeight, fontSize, color, gap, padding, background, border, borderRadius, hover } = theme.exitButton;

  document.documentElement.style.setProperty('--exit-btn-font-family', fontFamily);
  document.documentElement.style.setProperty('--exit-btn-font-weight', String(fontWeight));
  document.documentElement.style.setProperty('--exit-btn-font-size', fontSize);
  document.documentElement.style.setProperty('--exit-btn-color', color);
  document.documentElement.style.setProperty('--exit-btn-gap', gap ?? '10px');
  document.documentElement.style.setProperty('--exit-btn-padding', padding ?? '12px 20px');
  document.documentElement.style.setProperty('--exit-btn-background', background ?? 'transparent');
  document.documentElement.style.setProperty('--exit-btn-border', border ?? 'none');
  document.documentElement.style.setProperty('--exit-btn-border-radius', borderRadius ?? '0');
  document.documentElement.style.setProperty('--exit-btn-hover-background', hover?.background ?? (background ?? 'transparent'));
  document.documentElement.style.setProperty('--exit-btn-hover-border', hover?.border ?? (border ?? 'none'));
  document.documentElement.style.setProperty('--exit-btn-hover-box-shadow', hover?.boxShadow ?? 'none');
  document.documentElement.style.setProperty('--exit-btn-hover-color', hover?.color ?? color);

  if (iconDefault) {
    iconDefault.src = resolvePath(iconPath);
    iconDefault.alt = '';
  }
  if (iconHover) {
    const hoverPath = hover?.iconHover ?? iconPath;
    iconHover.src = resolvePath(hoverPath);
    iconHover.alt = '';
  }
}

export function applyCurrentPlayerTheme(theme: Theme | undefined): void {
  const cp = theme?.currentPlayer;
  if (!cp) return;

  document.documentElement.style.setProperty('--current-player-font-family', cp.fontFamily);
  document.documentElement.style.setProperty('--current-player-font-weight', String(cp.fontWeight));
  document.documentElement.style.setProperty('--current-player-font-size', cp.fontSize);
  document.documentElement.style.setProperty('--current-player-color', cp.color);
}

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

export function applyScoreDisplayTheme(theme: Theme | undefined): void {
  const score = theme?.scoreDisplay;
  const scoreEl = document.getElementById('game-score');
  const iconBlue = scoreEl?.querySelector<HTMLImageElement>('.game__score-icon--blue');
  const iconOrange = scoreEl?.querySelector<HTMLImageElement>('.game__score-icon--orange');
  if (!score || !scoreEl) return;

  scoreEl.classList.remove('game__score--label', 'game__score--figure');
  scoreEl.classList.add(score.type === 'label' ? 'game__score--label' : 'game__score--figure');

  document.documentElement.style.setProperty('--score-display-bg', score.background ?? 'transparent');
  document.documentElement.style.setProperty('--score-display-gap', score.gap ?? '20px');
  document.documentElement.style.setProperty('--score-display-padding', score.padding ?? '17px 20px');
  document.documentElement.style.setProperty('--score-display-border-radius', score.borderRadius ?? '0');
  document.documentElement.style.setProperty('--score-item-gap', score.itemGap ?? '4px');
  document.documentElement.style.setProperty('--score-font-family', score.fontFamily ?? 'Red Rose');
  document.documentElement.style.setProperty('--score-font-weight', String(score.fontWeight ?? 700));
  document.documentElement.style.setProperty('--score-font-size', score.fontSize ?? '24px');
  document.documentElement.style.setProperty('--score-color-blue', score.colorBlue ?? '#2BB1FF');
  document.documentElement.style.setProperty('--score-color-orange', score.colorOrange ?? '#F58E39');

  if (score.order === 'orange-first') {
    document.documentElement.style.setProperty('--score-order-blue', '2');
    document.documentElement.style.setProperty('--score-order-orange', '1');
  } else {
    document.documentElement.style.setProperty('--score-order-blue', '1');
    document.documentElement.style.setProperty('--score-order-orange', '2');
  }

  if (score.type === 'label') {
    if (iconBlue) iconBlue.src = resolvePath('/assets/icons/label-blue.svg');
    if (iconOrange) iconOrange.src = resolvePath('/assets/icons/label-orange.svg');
  } else {
    if (iconBlue) iconBlue.src = resolvePath('/assets/icons/figure-blue.svg');
    if (iconOrange) iconOrange.src = resolvePath('/assets/icons/figure-orange.svg');
  }
}

const BOARD_GRID: Record<string, { cols: number; rows: number }> = {
  '16': { cols: 4, rows: 4 },
  '24': { cols: 6, rows: 4 },
  '36': { cols: 6, rows: 6 },
};

export function applyBoardTheme(theme: Theme | undefined): void {
  const grid = BOARD_GRID[getSettings().boardSize] ?? BOARD_GRID['16'];
  document.documentElement.style.setProperty('--board-columns', `repeat(${grid.cols}, auto)`);
  document.documentElement.style.setProperty('--board-rows', `repeat(${grid.rows}, auto)`);
  document.documentElement.style.setProperty('--board-gap', theme?.boardGap ?? '6px');
}

export function applyExitConfirmModalTheme(theme: Theme | undefined): void {
  const modal = theme?.exitConfirmModal;
  if (!modal) return;

  document.documentElement.style.setProperty('--exit-confirm-bg', modal.background ?? '#FFFFFF');
  document.documentElement.style.setProperty('--exit-confirm-radius', modal.borderRadius ?? '0');
  document.documentElement.style.setProperty('--exit-confirm-text-align', modal.textAlign ?? 'left');
  document.documentElement.style.setProperty('--exit-confirm-text-max-width', modal.textMaxWidth ?? 'none');
  document.documentElement.style.setProperty('--exit-confirm-animation', modal.animation ? `exit-${modal.animation}` : 'none');
  document.documentElement.style.setProperty('--exit-confirm-animation-duration', modal.animationDuration ?? '300ms');
  document.documentElement.style.setProperty('--exit-confirm-animation-timing', modal.animationTimingFunction ?? 'ease-out');
  document.documentElement.style.setProperty('--exit-confirm-font-family', modal.fontFamily);
  document.documentElement.style.setProperty('--exit-confirm-font-weight', String(modal.fontWeight));
  document.documentElement.style.setProperty('--exit-confirm-font-size', modal.fontSize);
  document.documentElement.style.setProperty('--exit-confirm-color', modal.color);

  const cancel = modal.cancelButton;
  const cancelBtn = document.getElementById('btn-exit-cancel');
  if (cancel && cancelBtn) {
    cancelBtn.textContent = cancel.text;
    document.documentElement.style.setProperty('--exit-cancel-gap', cancel.gap ?? '0');
    document.documentElement.style.setProperty('--exit-cancel-padding', cancel.padding ?? '12px 20px');
    document.documentElement.style.setProperty('--exit-cancel-bg', cancel.background ?? '#e5e7eb');
    document.documentElement.style.setProperty('--exit-cancel-border', cancel.border ?? 'none');
    document.documentElement.style.setProperty('--exit-cancel-radius', cancel.borderRadius ?? '8px');
    document.documentElement.style.setProperty('--exit-cancel-shadow', cancel.boxShadow ?? 'none');
    document.documentElement.style.setProperty('--exit-cancel-font-family', cancel.fontFamily);
    document.documentElement.style.setProperty('--exit-cancel-font-weight', String(cancel.fontWeight));
    document.documentElement.style.setProperty('--exit-cancel-font-size', cancel.fontSize);
    document.documentElement.style.setProperty('--exit-cancel-color', cancel.color);
  }

  const confirm = modal.confirmButton;
  const confirmBtn = document.getElementById('btn-exit-confirm');
  if (confirm && confirmBtn) {
    confirmBtn.textContent = confirm.text;
    document.documentElement.style.setProperty('--exit-confirm-btn-gap', confirm.gap ?? '0');
    document.documentElement.style.setProperty('--exit-confirm-btn-padding', confirm.padding ?? '12px 20px');
    document.documentElement.style.setProperty('--exit-confirm-btn-bg', confirm.background ?? '#ef4444');
    document.documentElement.style.setProperty('--exit-confirm-btn-border', confirm.border ?? 'none');
    document.documentElement.style.setProperty('--exit-confirm-btn-radius', confirm.borderRadius ?? '8px');
    document.documentElement.style.setProperty('--exit-confirm-btn-shadow', confirm.boxShadow ?? 'none');
    document.documentElement.style.setProperty('--exit-confirm-btn-font-family', confirm.fontFamily);
    document.documentElement.style.setProperty('--exit-confirm-btn-font-weight', String(confirm.fontWeight));
    document.documentElement.style.setProperty('--exit-confirm-btn-font-size', confirm.fontSize);
    document.documentElement.style.setProperty('--exit-confirm-btn-color', confirm.color);
  }
}

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

export function applyGameOverScoreTheme(theme: Theme | undefined): void {
  const score = theme?.scoreDisplay;
  const scoreEl = document.getElementById('game-over-score');
  const iconBlue = scoreEl?.querySelector<HTMLImageElement>('.game__score-icon--blue');
  const iconOrange = scoreEl?.querySelector<HTMLImageElement>('.game__score-icon--orange');
  if (!score || !scoreEl) return;

  scoreEl.classList.remove('game__score--label', 'game__score--figure');
  scoreEl.classList.add(score.type === 'label' ? 'game__score--label' : 'game__score--figure');

  if (score.type === 'label') {
    if (iconBlue) iconBlue.src = resolvePath('/assets/icons/label-blue.svg');
    if (iconOrange) iconOrange.src = resolvePath('/assets/icons/label-orange.svg');
  } else {
    if (iconBlue) iconBlue.src = resolvePath('/assets/icons/figure-blue.svg');
    if (iconOrange) iconOrange.src = resolvePath('/assets/icons/figure-orange.svg');
  }
}

export function applyWinnerButtonTheme(theme: Theme | undefined): void {
  const btn = theme?.winnerButton;
  const btnEl = document.getElementById('btn-home');
  const winnerEl = document.getElementById('winner');
  if (!winnerEl) return;

  if (btn && btnEl) {
    btnEl.textContent = btn.text;
    winnerEl.style.setProperty('--winner-btn-font-family', btn.fontFamily);
    winnerEl.style.setProperty('--winner-btn-font-weight', String(btn.fontWeight));
    winnerEl.style.setProperty('--winner-btn-font-size', btn.fontSize);
    winnerEl.style.setProperty('--winner-btn-color', btn.color);
    winnerEl.style.setProperty('--winner-btn-padding', btn.padding ?? '12px 20px');
    winnerEl.style.setProperty('--winner-btn-background', btn.background ?? 'transparent');
    winnerEl.style.setProperty('--winner-btn-border', btn.border ?? 'none');
    winnerEl.style.setProperty('--winner-btn-border-radius', btn.borderRadius ?? '0');
    winnerEl.style.setProperty('--winner-btn-box-shadow', btn.boxShadow ?? 'none');
    winnerEl.style.setProperty('--winner-btn-letter-spacing', btn.letterSpacing ?? 'normal');
  } else if (btnEl) {
    btnEl.textContent = 'Zur Startseite';
  }
}

export function applyWinnerIconTheme(theme: Theme | undefined): void {
  const icon = theme?.winnerIcon;
  const winnerEl = document.getElementById('winner');
  if (!winnerEl) return;

  if (icon) {
    winnerEl.style.setProperty('--winner-icon-width', icon.width ?? '200px');
    winnerEl.style.setProperty('--winner-icon-border', icon.border ?? 'none');
    const c = icon.container;
    winnerEl.style.setProperty('--winner-icon-container-padding', c?.padding ?? '0');
    winnerEl.style.setProperty('--winner-icon-container-background', c?.background ?? 'transparent');
    winnerEl.style.setProperty('--winner-icon-container-box-shadow', c?.boxShadow ?? 'none');
  } else {
    winnerEl.style.setProperty('--winner-icon-width', '200px');
    winnerEl.style.setProperty('--winner-icon-border', 'none');
    winnerEl.style.setProperty('--winner-icon-container-padding', '0');
    winnerEl.style.setProperty('--winner-icon-container-background', 'transparent');
    winnerEl.style.setProperty('--winner-icon-container-box-shadow', 'none');
  }
}

export function applyWinnerNameTheme(theme: Theme | undefined): void {
  const name = theme?.winnerName;
  const winnerEl = document.getElementById('winner');
  if (!name || !winnerEl) return;

  winnerEl.style.setProperty('--winner-name-font-family', name.fontFamily);
  winnerEl.style.setProperty('--winner-name-font-weight', String(name.fontWeight));
  winnerEl.style.setProperty('--winner-name-font-size', name.fontSize);
  winnerEl.style.setProperty('--winner-name-text-align', name.textAlign ?? 'center');
  winnerEl.style.setProperty('--winner-name-text-transform', name.textTransform ?? 'none');
  winnerEl.style.setProperty('--winner-name-letter-spacing', name.letterSpacing ?? 'normal');
  winnerEl.style.setProperty('--winner-name-box-shadow', name.boxShadow ?? 'none');
  winnerEl.style.setProperty('--winner-name-text-shadow', name.textShadow ?? 'none');

  const winner = getWinner();
  if (name.color) {
    winnerEl.style.setProperty('--winner-name-color', name.color);
  } else if (winner === 'blue' && name.colorBlue) {
    winnerEl.style.setProperty('--winner-name-color', name.colorBlue);
  } else if (winner === 'orange' && name.colorOrange) {
    winnerEl.style.setProperty('--winner-name-color', name.colorOrange);
  } else {
    winnerEl.style.setProperty('--winner-name-color', name.colorBlue ?? name.colorOrange ?? '#ffffff');
  }
}

export function applyWinnerIntroTheme(theme: Theme | undefined): void {
  const intro = theme?.winnerIntro;
  const introEl = document.getElementById('winner-intro');
  const winnerEl = document.getElementById('winner');
  if (!intro || !introEl || !winnerEl) return;

  introEl.textContent = 'The winner is';
  winnerEl.style.setProperty('--winner-intro-font-family', intro.fontFamily);
  winnerEl.style.setProperty('--winner-intro-font-weight', String(intro.fontWeight));
  winnerEl.style.setProperty('--winner-intro-font-size', intro.fontSize);
  winnerEl.style.setProperty('--winner-intro-color', intro.color);
  winnerEl.style.setProperty('--winner-intro-line-height', intro.lineHeight ?? 'normal');
}
