/**
 * Memory-Spiel – Einstiegspunkt
 * Startet die App und verbindet die Navigation.
 */

import './styles/main.scss';
import { getSettings, setSettings } from './state/gameState';
import { THEMES, getThemeById, PLAYER_COLORS } from './data/themes';
import type { ThemeId, Theme } from './types/game.types';

// ============================================
// Navigation – einfache Seitenwechsel-Logik
// ============================================

/** Alle möglichen Seiten-IDs */
type PageId = 'home' | 'settings' | 'game' | 'game-over';

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
  } else if (pageId === 'game' || pageId === 'game-over') {
    const theme = getThemeById(getSettings().theme);
    bgColor = theme?.pageBackground ?? '#303131';
    headerBg = theme?.headerBackground ?? 'transparent';
    applyExitButtonTheme(theme);
    applyCurrentPlayerTheme(theme);
    applyPlayerIndicatorTheme(theme);
    applyScoreDisplayTheme(theme);
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

  const playerColor = getSettings().playerColor;
  const base = import.meta.env.BASE_URL;
  const resolvePath = (p: string): string => {
    const path = p.startsWith('/') ? p.slice(1) : p;
    const baseUrl = base === '/' ? window.location.origin + '/' : window.location.origin + base;
    return new URL(path, baseUrl).href;
  };

  indicatorEl.classList.remove('game__player-indicator--label', 'game__player-indicator--figure');

  if (indicator.type === 'label') {
    indicatorEl.classList.add('game__player-indicator--label');
    const iconPath = playerColor === 'blue' ? '/assets/icons/label-blue.svg' : '/assets/icons/label-orange.svg';
    iconEl.src = resolvePath(iconPath);
    document.documentElement.style.removeProperty('--player-indicator-bg');
    document.documentElement.style.removeProperty('--player-indicator-border-radius');
    document.documentElement.style.removeProperty('--player-indicator-padding');
  } else {
    indicatorEl.classList.add('game__player-indicator--figure');
    iconEl.src = resolvePath('/assets/icons/figure-white.svg');
    document.documentElement.style.setProperty('--player-indicator-bg', PLAYER_COLORS[playerColor]);
    document.documentElement.style.setProperty('--player-indicator-border-radius', indicator.borderRadius ?? '8px');
    document.documentElement.style.setProperty('--player-indicator-padding', indicator.padding ?? '4px 8px');
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
      showPage('game');
    });
  }

  if (btnExitGame) {
    btnExitGame.addEventListener('click', () => showPage('home'));
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
  setupSettingsThemeHover();
  setupSettingsThemeChange();
  setupStartBarUpdates();
  showThemePreview(getSettings().theme);
  updateStartBar();
});
