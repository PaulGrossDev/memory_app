import { THEMES } from '../data/themes';
import { setSettings } from '../state/gameState';
import type { ThemeId } from '../types/game.types';

export function showThemePreview(themeId: ThemeId): void {
  const panes = document.querySelectorAll<HTMLElement>('.settings__preview-pane');
  panes.forEach((pane) => {
    const isActive = pane.getAttribute('data-theme') === themeId;
    pane.classList.toggle('settings__preview-pane--active', isActive);
  });
}

export function getThemeDisplayName(themeId: ThemeId): string {
  const theme = THEMES.find((t) => t.id === themeId);
  return theme?.name ?? themeId;
}

export function getBoardSizeDisplay(boardSize: string): string {
  const map: Record<string, string> = {
    '16': '16 cards',
    '24': '24 cards',
    '36': '36 cards',
  };
  return map[boardSize] ?? boardSize;
}

export function updateStartBar(): void {
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

export function readSettingsFromForm(): void {
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

export function setupSettingsThemeHover(): void {
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

export function setupSettingsThemeChange(): void {
  const themeRadios = document.querySelectorAll<HTMLInputElement>('input[name="theme"]');
  themeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      showThemePreview(radio.value as ThemeId);
      updateStartBar();
    });
  });
}

export function setupStartBarUpdates(): void {
  const allRadios = document.querySelectorAll<HTMLInputElement>('#settings input[type="radio"]');
  allRadios.forEach((radio) => {
    radio.addEventListener('change', updateStartBar);
  });
}
