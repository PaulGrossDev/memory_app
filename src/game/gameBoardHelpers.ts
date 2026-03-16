import { resolvePath } from '../utils/path';
import type { Theme } from '../types/game.types';
import type { PlayerColor } from '../types/game.types';

/**
 * Erzeugt den Dateinamen für eine Kartenbild-Datei.
 *
 * @param baseName - Basisname der Karte (z.B. 'Cards 5')
 * @param index - Index des Kartenpaars (0 = ohne Suffix, sonst " (index)")
 * @returns Dateiname (z.B. 'Cards 5.png' oder 'Cards 5 (1).png')
 */
export function getCardFileName(baseName: string, index: number): string {
  return index === 0 ? `${baseName}.png` : `${baseName} (${index}).png`;
}

/**
 * Erzeugt ein Array von Karten-Indizes (jedes Paar doppelt) und mischt sie per Fisher-Yates.
 *
 * @param pairCount - Anzahl der Kartenpaare
 * @returns Gemischtes Array mit Indizes [0,0,1,1,2,2,...]
 */
export function createShuffledCardIndices(pairCount: number): number[] {
  const indices: number[] = [];
  for (let i = 0; i < pairCount; i++) {
    indices.push(i, i);
  }
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

/**
 * Erstellt ein DOM-Element für eine Spielkarte (Button mit Rück- und Vorderseite).
 *
 * @param index - Index der Karte im Board
 * @param pairId - ID des Kartenpaars
 * @param backsiteUrl - URL des Rückseitenbilds
 * @param cardsPath - Pfad zum Kartenordner
 * @param baseName - Basisname der Kartenbilder
 * @returns Button-Element mit Karten-Markup
 */
export function createCardElement(
  index: number,
  pairId: number,
  backsiteUrl: string,
  cardsPath: string,
  baseName: string
): HTMLButtonElement {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'game__card';
  card.dataset.index = String(index);
  card.dataset.pairId = String(pairId);

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
  imgFront.src = resolvePath(cardsPath + getCardFileName(baseName, pairId));
  imgFront.alt = '';
  imgFront.setAttribute('aria-hidden', 'true');
  faceFront.appendChild(imgFront);

  inner.appendChild(faceBack);
  inner.appendChild(faceFront);
  card.appendChild(inner);
  return card;
}

/**
 * Setzt die CSS-Variable --winner-name-color je nach Gewinner und Theme.
 *
 * @param winnerEl - Winner-Container-Element
 * @param name - Theme-WinnerName-Konfiguration
 * @param winner - Gewinner ('blue' | 'orange' | 'draw')
 */
export function applyWinnerNameColor(
  winnerEl: HTMLElement | null,
  name: NonNullable<Theme['winnerName']> | undefined,
  winner: PlayerColor | 'draw'
): void {
  if (!winnerEl || !name) return;
  if (winner === 'blue') {
    winnerEl.style.setProperty('--winner-name-color', name.colorBlue ?? name.color ?? '#ffffff');
  } else if (winner === 'orange') {
    winnerEl.style.setProperty('--winner-name-color', name.colorOrange ?? name.color ?? '#ffffff');
  } else {
    if (name.color) winnerEl.style.setProperty('--winner-name-color', name.color);
  }
}

/**
 * Setzt die Icon-Src und Sichtbarkeit des Winner-Icons je nach Gewinner.
 *
 * @param iconEl - Das Icon-Img-Element
 * @param icon - Theme-WinnerIcon-Konfiguration
 * @param winner - Gewinner ('blue' | 'orange' | 'draw')
 */
export function setWinnerIconSrc(
  iconEl: HTMLImageElement | null,
  icon: NonNullable<Theme['winnerIcon']> | undefined,
  winner: PlayerColor | 'draw'
): void {
  if (!iconEl) return;
  if (winner === 'blue') {
    iconEl.src = resolvePath(icon?.bluePath ?? icon?.path ?? '/assets/icons/figure-blue.svg');
    iconEl.style.display = icon ? 'block' : 'none';
  } else if (winner === 'orange') {
    iconEl.src = resolvePath(icon?.orangePath ?? icon?.path ?? '/assets/icons/figure-orange.svg');
    iconEl.style.display = icon ? 'block' : 'none';
  } else {
    iconEl.src = icon?.path ? resolvePath(icon.path) : '';
    iconEl.style.display = icon?.path ? 'block' : 'none';
  }
}
