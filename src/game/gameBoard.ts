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
import { showPage, showGameOver } from '../navigation/navigation';

export function getCardFileName(baseName: string, index: number): string {
  return index === 0 ? `${baseName}.png` : `${baseName} (${index}).png`;
}

export function renderGameBoard(): void {
  const boardEl = document.getElementById('game-board');
  const theme = getThemeById(getSettings().theme);
  if (!boardEl || !theme?.cardsPath || !theme.cardBaseName || !theme.backsitePath) return;

  const boardSize = getSettings().boardSize;
  const pairCount = parseInt(boardSize, 10) / 2;
  const baseName = theme.cardBaseName;

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

function flipCard(cardEl: HTMLButtonElement): void {
  cardEl.classList.add('game__card--flipped');
}

function unflipCard(cardEl: HTMLButtonElement): void {
  cardEl.classList.remove('game__card--flipped');
}

export function renderGameOverTitle(theme: Theme | undefined): void {
  const container = document.getElementById('game-over-title');
  if (!container || !theme?.gameOverTitle) return;

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

export function updateScoreDisplay(): void {
  const { scoreBlue, scoreOrange } = getRuntimeState();
  const elBlue = document.getElementById('score-blue');
  const elOrange = document.getElementById('score-orange');
  if (elBlue) elBlue.textContent = String(scoreBlue);
  if (elOrange) elOrange.textContent = String(scoreOrange);
}

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

export function updateGameOverScore(): void {
  const { scoreBlue, scoreOrange } = getRuntimeState();
  const elBlue = document.getElementById('game-over-score-blue');
  const elOrange = document.getElementById('game-over-score-orange');
  if (elBlue) elBlue.textContent = String(scoreBlue);
  if (elOrange) elOrange.textContent = String(scoreOrange);
}

export function updateWinnerDisplay(): void {
  const winner = getWinner();
  const theme = getThemeById(getSettings().theme);
  const introEl = document.getElementById('winner-intro');
  const titleEl = document.getElementById('winner-title');
  const iconEl = document.getElementById('winner-icon') as HTMLImageElement | null;
  const winnerEl = document.getElementById('winner');
  if (!titleEl) return;

  if (winnerEl) winnerEl.dataset.winner = winner;

  const name = theme?.winnerName;
  const icon = theme?.winnerIcon;

  if (winner === 'blue') {
    if (introEl) introEl.textContent = 'The winner is';
    titleEl.textContent = 'Blue Player';
    if (iconEl) {
      if (icon) {
        iconEl.src = resolvePath(icon.bluePath ?? icon.path ?? '/assets/icons/figure-blue.svg');
        iconEl.style.display = 'block';
      } else {
        iconEl.style.display = 'none';
      }
    }
    if (winnerEl) {
      if (name?.colorBlue) winnerEl.style.setProperty('--winner-name-color', name.colorBlue);
      else if (name?.color) winnerEl.style.setProperty('--winner-name-color', name.color);
    }
  } else if (winner === 'orange') {
    if (introEl) introEl.textContent = 'The winner is';
    titleEl.textContent = 'Orange Player';
    if (iconEl) {
      if (icon) {
        iconEl.src = resolvePath(icon.orangePath ?? icon.path ?? '/assets/icons/figure-orange.svg');
        iconEl.style.display = 'block';
      } else {
        iconEl.style.display = 'none';
      }
    }
    if (winnerEl) {
      if (name?.colorOrange) winnerEl.style.setProperty('--winner-name-color', name.colorOrange);
      else if (name?.color) winnerEl.style.setProperty('--winner-name-color', name.color);
    }
  } else {
    if (introEl) introEl.textContent = '';
    titleEl.textContent = "It's a draw!";
    if (iconEl) {
      if (icon?.path) {
        iconEl.src = resolvePath(icon.path);
        iconEl.style.display = 'block';
      } else {
        iconEl.style.display = 'none';
      }
    }
    if (winnerEl && name?.color) winnerEl.style.setProperty('--winner-name-color', name.color);
  }
}

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
