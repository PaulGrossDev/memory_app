import {
  getSettings,
  getRuntimeState,
  getWinner,
  addScore,
  switchPlayer,
  addFlippedIndex,
  clearFlippedIndices,
  addMatchedPair,
  areAllPairsMatched,
  setLocked,
} from '../state/gameState';
import { getThemeById, PLAYER_COLORS } from '../data/themes';
import { resolvePath } from '../utils/path';
import type { Theme } from '../types/game.types';
import { showGameOver } from '../navigation/navigation';
import {
  getCardFileName,
  createShuffledCardIndices,
  createCardElement,
  applyWinnerNameColor,
  setWinnerIconSrc,
} from './gameBoardHelpers';

export { getCardFileName };

/**
 * Rendert das Spielfeld mit gemischten Karten basierend auf Theme und Board-Größe.
 */
export function renderGameBoard(): void {
  const boardEl = document.getElementById('game-board');
  const theme = getThemeById(getSettings().theme);
  if (!boardEl || !theme?.cardsPath || !theme.cardBaseName || !theme.backsitePath) return;

  const pairCount = parseInt(getSettings().boardSize, 10) / 2;
  const backsiteUrl = resolvePath(theme.backsitePath);
  const cardsPath = theme.cardsPath.endsWith('/') ? theme.cardsPath : theme.cardsPath + '/';

  boardEl.innerHTML = '';
  const cardIndices = createShuffledCardIndices(pairCount);
  const baseName = theme.cardBaseName;
  cardIndices.forEach((pairId, i) => {
    const card = createCardElement(i, pairId, backsiteUrl, cardsPath, baseName);
    boardEl.appendChild(card);
  });
}

function flipCard(cardEl: HTMLButtonElement): void {
  cardEl.classList.add('game__card--flipped');
}

function unflipCard(cardEl: HTMLButtonElement): void {
  cardEl.classList.remove('game__card--flipped');
}

function renderGameOverTitleSvgLetters(
  container: HTMLElement,
  iconsPath: string,
  dropShadow: string | undefined
): void {
  const letters = ['g', 'a', 'm', 'e', 'o', 'v', 'e', 'r'];
  letters.forEach((letter, i) => {
    const img = document.createElement('img');
    img.src = resolvePath(iconsPath + letter + '.svg');
    img.alt = '';
    img.className = 'game-over__letter';
    img.setAttribute('aria-hidden', 'true');
    if (dropShadow) {
      const shadows = dropShadow.split(',').map((s) => s.trim());
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
}

function renderGameOverTitleText(
  container: HTMLElement,
  title: Extract<NonNullable<Theme['gameOverTitle']>, { type: 'text' }>
): void {
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

/**
 * Rendert den Game-Over-Titel (SVG-Buchstaben oder Text) gemäß Theme.
 *
 * @param theme - Aktives Theme oder undefined
 */
export function renderGameOverTitle(theme: Theme | undefined): void {
  const container = document.getElementById('game-over-title');
  if (!container || !theme?.gameOverTitle) return;

  container.innerHTML = '';
  container.className = 'game-over__title';
  const title = theme.gameOverTitle;

  if (title.type === 'svg-letters') {
    container.classList.add('game-over__title--svg');
    const iconsPath = title.iconsPath.endsWith('/') ? title.iconsPath : title.iconsPath + '/';
    renderGameOverTitleSvgLetters(container, iconsPath, title.dropShadow);
  } else {
    container.classList.add('game-over__title--text');
    renderGameOverTitleText(container, title as Extract<NonNullable<Theme['gameOverTitle']>, { type: 'text' }>);
  }
}

/**
 * Aktualisiert die Score-Anzeige (Blau/Orange) im Spiel.
 */
export function updateScoreDisplay(): void {
  const { scoreBlue, scoreOrange } = getRuntimeState();
  const elBlue = document.getElementById('score-blue');
  const elOrange = document.getElementById('score-orange');
  if (elBlue) elBlue.textContent = String(scoreBlue);
  if (elOrange) elOrange.textContent = String(scoreOrange);
}

/**
 * Aktualisiert die Anzeige des aktuellen Spielers (Label oder Figure-Icon).
 */
export function updateCurrentPlayerIndicator(): void {
  const indicatorEl = document.getElementById('game-player-indicator');
  const iconEl = indicatorEl?.querySelector<HTMLImageElement>('.game__player-icon');
  if (!indicatorEl || !iconEl) return;

  const currentPlayer = getRuntimeState().currentPlayer;

  if (indicatorEl.classList.contains('game__player-indicator--label')) {
    const iconPath = currentPlayer === 'blue' ? '/assets/icons/label-blue.svg' : '/assets/icons/label-orange.svg';
    iconEl.src = resolvePath(iconPath);
  } else {
    document.documentElement.style.setProperty('--player-indicator-bg', PLAYER_COLORS[currentPlayer]);
  }
}

/**
 * Aktualisiert die Score-Anzeige auf der Game-Over-Seite.
 */
export function updateGameOverScore(): void {
  const { scoreBlue, scoreOrange } = getRuntimeState();
  const elBlue = document.getElementById('game-over-score-blue');
  const elOrange = document.getElementById('game-over-score-orange');
  if (elBlue) elBlue.textContent = String(scoreBlue);
  if (elOrange) elOrange.textContent = String(scoreOrange);
}

const WINNER_INTRO: Record<'blue' | 'orange' | 'draw', string> = {
  blue: 'The winner is',
  orange: 'The winner is',
  draw: '',
};

const WINNER_TITLE: Record<'blue' | 'orange' | 'draw', string> = {
  blue: 'Blue Player',
  orange: 'Orange Player',
  draw: "It's a draw!",
};

/**
 * Aktualisiert die Winner-Anzeige (Intro, Titel, Icon, Farbe) je nach Gewinner.
 */
export function updateWinnerDisplay(): void {
  const winner = getWinner();
  const theme = getThemeById(getSettings().theme);
  const introEl = document.getElementById('winner-intro');
  const titleEl = document.getElementById('winner-title');
  const iconEl = document.getElementById('winner-icon') as HTMLImageElement | null;
  const winnerEl = document.getElementById('winner');
  if (!titleEl) return;

  if (winnerEl) winnerEl.dataset.winner = winner;
  if (introEl) introEl.textContent = WINNER_INTRO[winner];
  titleEl.textContent = WINNER_TITLE[winner];

  setWinnerIconSrc(iconEl, theme?.winnerIcon, winner);
  applyWinnerNameColor(winnerEl, theme?.winnerName, winner);
}

function handleMatch(card0: HTMLButtonElement | null, card1: HTMLButtonElement | null, pairId0: number, pairId1: number): void {
  const state = getRuntimeState();
  if (pairId0 === pairId1) {
    addScore(state.currentPlayer);
    addMatchedPair(pairId0);
    clearFlippedIndices();
    setLocked(false);
    updateScoreDisplay();
    if (areAllPairsMatched()) showGameOver();
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

/**
 * Event-Handler für Kartenklicks. Prüft Spielregeln und verarbeitet Match/No-Match.
 *
 * @param e - Click-Event
 */
export function handleCardClick(e: Event): void {
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
    handleMatch(card0 ?? null, card1 ?? null, pairId0, pairId1);
  }
}
