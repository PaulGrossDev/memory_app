/**
 * Memory-Spiel – Einstiegspunkt
 * Startet die App und verbindet die Navigation.
 */

import './styles/main.scss';
import {
  getSettings,
  setSettings,
  resetRuntimeState,
  getRuntimeState,
  addScore,
  switchPlayer,
  addFlippedIndex,
  clearFlippedIndices,
  addMatchedPair,
  areAllPairsMatched,
  setLocked,
} from './state/gameState';
import { THEMES, getThemeById, PLAYER_COLORS } from './data/themes';
import type { ThemeId, Theme } from './types/game.types';

// ============================================
// Navigation – einfache Seitenwechsel-Logik
// ============================================

/** Alle möglichen Seiten-IDs */
type PageId = 'home' | 'settings' | 'game' | 'game-over' | 'winner';

/** Setzt Hintergrundfarben und Exit-Button-Styling je nach Seite und Theme */
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
      updateWinnerDisplay();
    }
  } else {
    bgColor = '#303131';
    headerBg = 'transparent';
  }

  document.body.style.backgroundColor = bgColor;
  document.documentElement.style.setProperty('--color-header-bg', headerBg);
}

/** Wendet das Theme-Styling auf den Exit-Button an (Icon, Schrift, Button-Container) */
function applyExitButtonTheme(theme: { exitButton: Theme['exitButton'] } | undefined): void {
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

  const base = import.meta.env.BASE_URL;
  const resolvePath = (p: string): string => {
    const path = p.startsWith('/') ? p.slice(1) : p;
    const baseUrl = base === '/' ? window.location.origin + '/' : window.location.origin + base;
    return new URL(path, baseUrl).href;
  };

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

/** Wendet das Theme-Styling auf die "Current player:" Anzeige an */
function applyCurrentPlayerTheme(theme: Theme | undefined): void {
  const cp = theme?.currentPlayer;
  if (!cp) return;

  document.documentElement.style.setProperty('--current-player-font-family', cp.fontFamily);
  document.documentElement.style.setProperty('--current-player-font-weight', String(cp.fontWeight));
  document.documentElement.style.setProperty('--current-player-font-size', cp.fontSize);
  document.documentElement.style.setProperty('--current-player-color', cp.color);
}

/** Wendet das Theme-Styling auf den Spieler-Indikator an (label oder figure mit BG) */
function applyPlayerIndicatorTheme(theme: Theme | undefined): void {
  const indicator = theme?.playerIndicator;
  const indicatorEl = document.getElementById('game-player-indicator');
  const iconEl = indicatorEl?.querySelector<HTMLImageElement>('.game__player-icon');
  if (!indicator || !indicatorEl || !iconEl) return;

  const base = import.meta.env.BASE_URL;
  const resolvePath = (p: string): string => {
    const path = p.startsWith('/') ? p.slice(1) : p;
    const baseUrl = base === '/' ? window.location.origin + '/' : window.location.origin + base;
    return new URL(path, baseUrl).href;
  };

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

/** Aktualisiert die Score-Anzeige (Blue/Orange) aus dem Laufzeit-Zustand */
function updateScoreDisplay(): void {
  const { scoreBlue, scoreOrange } = getRuntimeState();
  const elBlue = document.getElementById('score-blue');
  const elOrange = document.getElementById('score-orange');
  if (elBlue) elBlue.textContent = String(scoreBlue);
  if (elOrange) elOrange.textContent = String(scoreOrange);
}

/** Aktualisiert den Spieler-Indikator (Icon/Farbe) auf den aktuellen Spieler */
function updateCurrentPlayerIndicator(): void {
  const indicatorEl = document.getElementById('game-player-indicator');
  const iconEl = indicatorEl?.querySelector<HTMLImageElement>('.game__player-icon');
  if (!indicatorEl || !iconEl) return;

  const currentPlayer = getRuntimeState().currentPlayer;
  const base = import.meta.env.BASE_URL;
  const resolvePath = (p: string): string => {
    const path = p.startsWith('/') ? p.slice(1) : p;
    const baseUrl = base === '/' ? window.location.origin + '/' : window.location.origin + base;
    return new URL(path, baseUrl).href;
  };

  if (indicatorEl.classList.contains('game__player-indicator--label')) {
    const iconPath = currentPlayer === 'blue' ? '/assets/icons/label-blue.svg' : '/assets/icons/label-orange.svg';
    iconEl.src = resolvePath(iconPath);
  } else {
    document.documentElement.style.setProperty('--player-indicator-bg', PLAYER_COLORS[currentPlayer]);
  }
}

/** Wendet das Theme-Styling auf die Punktestand-Anzeige an */
function applyScoreDisplayTheme(theme: Theme | undefined): void {
  const score = theme?.scoreDisplay;
  const scoreEl = document.getElementById('game-score');
  const iconBlue = scoreEl?.querySelector<HTMLImageElement>('.game__score-icon--blue');
  const iconOrange = scoreEl?.querySelector<HTMLImageElement>('.game__score-icon--orange');
  if (!score || !scoreEl) return;

  const base = import.meta.env.BASE_URL;
  const resolvePath = (p: string): string => {
    const path = p.startsWith('/') ? p.slice(1) : p;
    const baseUrl = base === '/' ? window.location.origin + '/' : window.location.origin + base;
    return new URL(path, baseUrl).href;
  };

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

/** Wendet das Theme-Styling auf das Exit-Bestätigungs-Modal an (Titeltext + Buttons) */
function applyExitConfirmModalTheme(theme: Theme | undefined): void {
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

/** Zeigt das Exit-Bestätigungs-Modal an */
function showExitConfirmModal(): void {
  const modal = document.getElementById('exit-confirm-modal');
  if (modal) {
    modal.classList.add('exit-confirm--visible');
    modal.setAttribute('aria-hidden', 'false');
  }
}

/** Blendet das Exit-Bestätigungs-Modal aus */
function hideExitConfirmModal(): void {
  const modal = document.getElementById('exit-confirm-modal');
  if (modal) {
    modal.classList.remove('exit-confirm--visible');
    modal.setAttribute('aria-hidden', 'true');
  }
}

/** Grid-Konfiguration je nach Brettgröße: 16→4×4, 24→6×4, 36→6×6 */
const BOARD_GRID: Record<string, { cols: number; rows: number }> = {
  '16': { cols: 4, rows: 4 },
  '24': { cols: 6, rows: 4 },
  '36': { cols: 6, rows: 6 },
};

/** Wendet das Theme-Styling auf das Spielbrett an (Grid, Gap) */
function applyBoardTheme(theme: Theme | undefined): void {
  const grid = BOARD_GRID[getSettings().boardSize] ?? BOARD_GRID['16'];
  document.documentElement.style.setProperty('--board-columns', `repeat(${grid.cols}, auto)`);
  document.documentElement.style.setProperty('--board-rows', `repeat(${grid.rows}, auto)`);
  document.documentElement.style.setProperty('--board-gap', theme?.boardGap ?? '6px');
}

/** Erzeugt den Karten-Dateinamen für einen Index (0 = base.png, 1 = base (1).png) */
function getCardFileName(baseName: string, index: number): string {
  return index === 0 ? `${baseName}.png` : `${baseName} (${index}).png`;
}

/** Rendert das Memory-Spielfeld mit gemischten Karten */
function renderGameBoard(): void {
  const boardEl = document.getElementById('game-board');
  const theme = getThemeById(getSettings().theme);
  if (!boardEl || !theme?.cardsPath || !theme.cardBaseName || !theme.backsitePath) return;

  const boardSize = getSettings().boardSize;
  const pairCount = parseInt(boardSize, 10) / 2;
  const baseName = theme.cardBaseName;

  const base = import.meta.env.BASE_URL;
  const resolvePath = (p: string): string => {
    const path = p.startsWith('/') ? p.slice(1) : p;
    const baseUrl = base === '/' ? window.location.origin + '/' : window.location.origin + base;
    return new URL(path, baseUrl).href;
  };

  const cardIndices: number[] = [];
  for (let i = 0; i < pairCount; i++) {
    cardIndices.push(i, i);
  }
  for (let i = cardIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardIndices[i], cardIndices[j]] = [cardIndices[j], cardIndices[i]];
  }

  const backsiteUrl = resolvePath(theme.backsitePath);
  const cardsPath = theme.cardsPath.endsWith('/') ? theme.cardsPath : theme.cardsPath + '/';

  boardEl.innerHTML = '';
  cardIndices.forEach((index, i) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'game__card';
    card.dataset.index = String(i);
    card.dataset.pairId = String(index);

    const inner = document.createElement('span');
    inner.className = 'game__card-inner';

    const faceBack = document.createElement('span');
    faceBack.className = 'game__card-face game__card-face--back';
    const imgBack = document.createElement('img');
    imgBack.src = backsiteUrl;
    imgBack.alt = '';
    imgBack.setAttribute('aria-hidden', 'true');
    faceBack.appendChild(imgBack);

    const faceFront = document.createElement('span');
    faceFront.className = 'game__card-face game__card-face--front';
    const imgFront = document.createElement('img');
    imgFront.src = resolvePath(cardsPath + getCardFileName(baseName, index));
    imgFront.alt = '';
    imgFront.setAttribute('aria-hidden', 'true');
    faceFront.appendChild(imgFront);

    inner.appendChild(faceBack);
    inner.appendChild(faceFront);
    card.appendChild(inner);
    boardEl.appendChild(card);
  });
}

/** Karte umdrehen (Rückseite → Vorderseite) */
function flipCard(cardEl: HTMLButtonElement): void {
  cardEl.classList.add('game__card--flipped');
}

/** Karte wieder zudecken (Vorderseite → Rückseite) */
function unflipCard(cardEl: HTMLButtonElement): void {
  cardEl.classList.remove('game__card--flipped');
}

/** Rendert den "GAME OVER" Titel je nach Theme (SVG-Buchstaben oder Text) */
function renderGameOverTitle(theme: Theme | undefined): void {
  const container = document.getElementById('game-over-title');
  if (!container || !theme?.gameOverTitle) return;

  const base = import.meta.env.BASE_URL;
  const resolvePath = (p: string): string => {
    const path = p.startsWith('/') ? p.slice(1) : p;
    const baseUrl = base === '/' ? window.location.origin + '/' : window.location.origin + base;
    return new URL(path, baseUrl).href;
  };

  container.innerHTML = '';
  container.className = 'game-over__title';

  const title = theme.gameOverTitle;
  if (title.type === 'svg-letters') {
    container.classList.add('game-over__title--svg');
    const letters = ['g', 'a', 'm', 'e', 'o', 'v', 'e', 'r'];
    const iconsPath = title.iconsPath.endsWith('/') ? title.iconsPath : title.iconsPath + '/';
    letters.forEach((letter, i) => {
      const img = document.createElement('img');
      img.src = resolvePath(iconsPath + letter + '.svg');
      img.alt = '';
      img.className = 'game-over__letter';
      img.setAttribute('aria-hidden', 'true');
      if (title.dropShadow) {
        const shadows = title.dropShadow.split(',').map((s) => s.trim());
        img.style.filter = shadows.map((s) => `drop-shadow(${s})`).join(' ');
      }
      container.appendChild(img);
      if (i === 3) {
        const space = document.createElement('span');
        space.className = 'game-over__space';
        space.setAttribute('aria-hidden', 'true');
        container.appendChild(space);
      }
    });
  } else {
    container.classList.add('game-over__title--text');
    const span = document.createElement('span');
    span.textContent = 'GAME OVER';
    span.className = 'game-over__title-text';
    container.appendChild(span);
    document.documentElement.style.setProperty('--game-over-font-family', title.fontFamily);
    document.documentElement.style.setProperty('--game-over-font-weight', String(title.fontWeight));
    document.documentElement.style.setProperty('--game-over-font-size', title.fontSize);
    document.documentElement.style.setProperty('--game-over-color', title.color);
    document.documentElement.style.setProperty('--game-over-text-shadow', title.textShadow ?? 'none');
    document.documentElement.style.setProperty('--game-over-letter-spacing', title.letterSpacing ?? 'normal');
  }
}

/** Wendet das Theme-Styling auf die Game-Over-Score-Anzeige an (label/figure, Icons) */
function applyGameOverScoreTheme(theme: Theme | undefined): void {
  const score = theme?.scoreDisplay;
  const scoreEl = document.getElementById('game-over-score');
  const iconBlue = scoreEl?.querySelector<HTMLImageElement>('.game__score-icon--blue');
  const iconOrange = scoreEl?.querySelector<HTMLImageElement>('.game__score-icon--orange');
  if (!score || !scoreEl) return;

  const base = import.meta.env.BASE_URL;
  const resolvePath = (p: string): string => {
    const path = p.startsWith('/') ? p.slice(1) : p;
    const baseUrl = base === '/' ? window.location.origin + '/' : window.location.origin + base;
    return new URL(path, baseUrl).href;
  };

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

/** Aktualisiert die Punktestand-Anzeige auf der Game-Over-Seite */
function updateGameOverScore(): void {
  const { scoreBlue, scoreOrange } = getRuntimeState();
  const elBlue = document.getElementById('game-over-score-blue');
  const elOrange = document.getElementById('game-over-score-orange');
  if (elBlue) elBlue.textContent = String(scoreBlue);
  if (elOrange) elOrange.textContent = String(scoreOrange);
}

/** Wendet das Theme-Styling auf den Gewinner-Namen (Blue/Orange) an */
function applyWinnerNameTheme(theme: Theme | undefined): void {
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

/** Wendet das Theme-Styling auf den "The winner is" Text an */
function applyWinnerIntroTheme(theme: Theme | undefined): void {
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

/** Wendet das Theme-Styling auf den "Final score" Text an */
function applyGameOverFinalScoreTheme(theme: Theme | undefined): void {
  const finalScore = theme?.gameOverFinalScore;
  const el = document.getElementById('game-over-final-score');
  if (!finalScore || !el) return;

  el.textContent = 'Final score';
  document.documentElement.style.setProperty('--game-over-final-score-font-family', finalScore.fontFamily);
  document.documentElement.style.setProperty('--game-over-final-score-font-weight', String(finalScore.fontWeight));
  document.documentElement.style.setProperty('--game-over-final-score-font-size', finalScore.fontSize);
  document.documentElement.style.setProperty('--game-over-final-score-color', finalScore.color);
}

/** Ermittelt den Gewinner aus dem aktuellen Score */
function getWinner(): 'blue' | 'orange' | 'draw' {
  const { scoreBlue, scoreOrange } = getRuntimeState();
  if (scoreBlue > scoreOrange) return 'blue';
  if (scoreOrange > scoreBlue) return 'orange';
  return 'draw';
}

/** Aktualisiert die Gewinner-Anzeige (Intro + Titel + Farbe) */
function updateWinnerDisplay(): void {
  const winner = getWinner();
  const theme = getThemeById(getSettings().theme);
  const introEl = document.getElementById('winner-intro');
  const titleEl = document.getElementById('winner-title');
  if (!titleEl) return;

  const name = theme?.winnerName;
  const winnerEl = document.getElementById('winner');
  if (winner === 'blue') {
    if (introEl) introEl.textContent = 'The winner is';
    titleEl.textContent = 'Blue Player';
    if (winnerEl) {
      if (name?.colorBlue) winnerEl.style.setProperty('--winner-name-color', name.colorBlue);
      else if (name?.color) winnerEl.style.setProperty('--winner-name-color', name.color);
    }
  } else if (winner === 'orange') {
    if (introEl) introEl.textContent = 'The winner is';
    titleEl.textContent = 'Orange Player';
    if (winnerEl) {
      if (name?.colorOrange) winnerEl.style.setProperty('--winner-name-color', name.colorOrange);
      else if (name?.color) winnerEl.style.setProperty('--winner-name-color', name.color);
    }
  } else {
    if (introEl) introEl.textContent = '';
    titleEl.textContent = "It's a draw!";
    if (winnerEl && name?.color) winnerEl.style.setProperty('--winner-name-color', name.color);
  }
}

/** Zeigt die Game-Over-Seite und wechselt nach delay zur Winner-Page mit Animation */
function showGameOver(): void {
  showPage('game-over');
  const theme = getThemeById(getSettings().theme);
  const config = theme?.gameOverToWinner ?? {
    delayMs: 1200,
    animation: 'move-in-top',
    durationMs: 500,
    easing: 'ease-out',
  };
  const timeoutId = window.setTimeout(() => {
    transitionToWinner(config);
  }, config.delayMs);
  (window as unknown as { _gameOverTimeout?: number })._gameOverTimeout = timeoutId;
}

/** Wechselt von Game Over zur Winner-Page mit theme-spezifischer Animation */
function transitionToWinner(config: {
  animation: 'move-in-top' | 'move-in-bottom' | 'dissolve' | 'scale-in';
  durationMs: number;
  easing: string;
}): void {
  const gameOverPage = document.getElementById('game-over');
  const winnerPage = document.getElementById('winner');
  const winnerContent = document.getElementById('winner-content');
  if (!gameOverPage || !winnerPage || !winnerContent) return;

  gameOverPage.classList.remove('page--visible');
  winnerPage.classList.add('page--visible');
  applyPageBackground('winner');

  winnerContent.classList.remove(
    'winner__content--move-in-top',
    'winner__content--move-in-bottom',
    'winner__content--dissolve',
    'winner__content--scale-in'
  );
  winnerContent.classList.add(`winner__content--${config.animation}`);
  document.documentElement.style.setProperty(
    '--winner-animation-duration',
    `${config.durationMs}ms`
  );
  document.documentElement.style.setProperty(
    '--winner-animation-easing',
    config.easing
  );
}

/** Behandelt Klick auf eine Karte */
function handleCardClick(e: Event): void {
  const card = (e.target as HTMLElement).closest<HTMLButtonElement>('.game__card');
  if (!card) return;

  const index = parseInt(card.dataset.index ?? '-1', 10);
  const pairId = parseInt(card.dataset.pairId ?? '-1', 10);
  if (index < 0) return;

  const state = getRuntimeState();
  if (state.isLocked) return;
  if (state.matchedPairIds.has(pairId)) return;
  if (state.flippedIndices.includes(index)) return;
  if (state.flippedIndices.length >= 2) return;

  flipCard(card);
  addFlippedIndex(index);

  const newState = getRuntimeState();
  if (newState.flippedIndices.length === 2) {
    setLocked(true);
    const [idx0, idx1] = newState.flippedIndices;
    const card0 = document.querySelector<HTMLButtonElement>(`[data-index="${idx0}"]`);
    const card1 = document.querySelector<HTMLButtonElement>(`[data-index="${idx1}"]`);
    const pairId0 = parseInt(card0?.dataset.pairId ?? '-1', 10);
    const pairId1 = parseInt(card1?.dataset.pairId ?? '-1', 10);

    if (pairId0 === pairId1) {
      addScore(newState.currentPlayer);
      addMatchedPair(pairId0);
      clearFlippedIndices();
      setLocked(false);
      updateScoreDisplay();

      if (areAllPairsMatched()) {
        showGameOver();
      }
    } else {
      setTimeout(() => {
        if (card0) unflipCard(card0);
        if (card1) unflipCard(card1);
        clearFlippedIndices();
        switchPlayer();
        updateCurrentPlayerIndicator();
        setLocked(false);
      }, 800);
    }
  }
}

/** Zeigt die gewünschte Seite an und blendet die anderen aus */
function showPage(pageId: PageId): void {
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

/** Zeigt die Theme-Vorschau für das angegebene Theme */
function showThemePreview(themeId: ThemeId): void {
  const panes = document.querySelectorAll<HTMLElement>('.settings__preview-pane');
  panes.forEach((pane) => {
    const isActive = pane.getAttribute('data-theme') === themeId;
    pane.classList.toggle('settings__preview-pane--active', isActive);
  });
}

/** Theme-Anzeigename aus ID */
function getThemeDisplayName(themeId: ThemeId): string {
  const theme = THEMES.find((t) => t.id === themeId);
  return theme?.name ?? themeId;
}

/** Board-Size-Anzeige */
function getBoardSizeDisplay(boardSize: string): string {
  const map: Record<string, string> = {
    '16': '16 cards',
    '24': '24 cards',
    '36': '36 cards',
  };
  return map[boardSize] ?? boardSize;
}

/** Aktualisiert die Start-Leiste mit den aktuellen Auswahlen */
function updateStartBar(): void {
  const themeRadio = document.querySelector<HTMLInputElement>('input[name="theme"]:checked');
  const playerRadio = document.querySelector<HTMLInputElement>('input[name="player"]:checked');
  const boardRadio = document.querySelector<HTMLInputElement>('input[name="board"]:checked');

  const themeEl = document.getElementById('start-theme');
  const playerEl = document.getElementById('start-player');
  const boardEl = document.getElementById('start-board');

  if (themeEl && themeRadio) {
    themeEl.textContent = getThemeDisplayName(themeRadio.value as ThemeId);
  }

  if (playerEl && playerRadio) {
    const color = playerRadio.value as 'blue' | 'orange';
    playerEl.textContent = color === 'blue' ? 'Blue' : 'Orange';
    playerEl.classList.remove('settings__start-item--player-blue', 'settings__start-item--player-orange');
    playerEl.classList.add(color === 'blue' ? 'settings__start-item--player-blue' : 'settings__start-item--player-orange');
  }

  if (boardEl && boardRadio) {
    boardEl.textContent = getBoardSizeDisplay(boardRadio.value);
  }
}

/** Liest die aktuell ausgewählten Settings aus dem Formular */
function readSettingsFromForm(): void {
  const themeRadio = document.querySelector<HTMLInputElement>('input[name="theme"]:checked');
  const playerRadio = document.querySelector<HTMLInputElement>('input[name="player"]:checked');
  const boardRadio = document.querySelector<HTMLInputElement>('input[name="board"]:checked');

  const theme = (themeRadio?.value ?? 'code-vibes') as ThemeId;
  const playerColor = (playerRadio?.value ?? 'blue') as 'blue' | 'orange';
  const boardSize = (boardRadio?.value ?? '16') as '16' | '24' | '36';

  setSettings({
    theme,
    playerColor,
    boardSize,
  });
}

// ============================================
// Event-Listener
// ============================================

/** Event-Delegation für Karten-Klicks (einmalig beim Start) */
function setupGameBoardListeners(): void {
  const boardEl = document.getElementById('game-board');
  boardEl?.addEventListener('click', handleCardClick);
}

/** Shortcut: Ctrl+Shift+G springt zum Game-Over-Screen (nur im Spiel) */
function setupGameOverShortcut(): void {
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

function setupNavigation(): void {
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
      showPage('home');
    });
  }

  const exitModalBackdrop = document.querySelector('.exit-confirm__backdrop');
  if (exitModalBackdrop) {
    exitModalBackdrop.addEventListener('click', hideExitConfirmModal);
  }

  if (btnHome) {
    btnHome.addEventListener('click', () => showPage('home'));
  }
}

/** Theme-Hover: Beim Hovern über eine Theme-Option die passende Vorschau anzeigen */
function setupSettingsThemeHover(): void {
  const themeLabels = document.querySelectorAll<HTMLElement>('#settings-themes .settings__radio');
  const themesGroup = document.getElementById('settings-themes');

  themeLabels.forEach((label) => {
    const input = label.querySelector<HTMLInputElement>('input[name="theme"]');
    if (!input) return;

    label.addEventListener('mouseenter', () => {
      showThemePreview(input.value as ThemeId);
    });
  });

  themesGroup?.addEventListener('mouseleave', () => {
    const checked = document.querySelector<HTMLInputElement>('input[name="theme"]:checked');
    if (checked) {
      showThemePreview(checked.value as ThemeId);
    }
  });
}

/** Theme-Change: Bei Auswahl über Radio die Vorschau aktualisieren */
function setupSettingsThemeChange(): void {
  const themeRadios = document.querySelectorAll<HTMLInputElement>('input[name="theme"]');
  themeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      showThemePreview(radio.value as ThemeId);
      updateStartBar();
    });
  });
}

/** Settings-Änderungen: Start-Leiste aktualisieren */
function setupStartBarUpdates(): void {
  const allRadios = document.querySelectorAll<HTMLInputElement>('#settings input[type="radio"]');
  allRadios.forEach((radio) => {
    radio.addEventListener('change', updateStartBar);
  });
}

// ============================================
// App starten
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupGameBoardListeners();
  setupGameOverShortcut();
  setupSettingsThemeHover();
  setupSettingsThemeChange();
  setupStartBarUpdates();
  showThemePreview(getSettings().theme);
  updateStartBar();
});
