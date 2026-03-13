/**
 * Memory-Spiel – Einstiegspunkt
 * Startet die App und verbindet die Navigation.
 */

import './styles/main.scss';

// ============================================
// Navigation – einfache Seitenwechsel-Logik
// ============================================

/** Alle möglichen Seiten-IDs */
type PageId = 'home' | 'settings' | 'game' | 'game-over';

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
}

/** Event-Listener für alle Navigations-Buttons */
function setupNavigation(): void {
  const btnStart = document.getElementById('btn-start');
  const btnStartGame = document.getElementById('btn-start-game');
  const btnExitGame = document.getElementById('btn-exit-game');
  const btnHome = document.getElementById('btn-home');

  if (btnStart) {
    btnStart.addEventListener('click', () => showPage('settings'));
  }

  if (btnStartGame) {
    btnStartGame.addEventListener('click', () => showPage('game'));
  }

  if (btnExitGame) {
    btnExitGame.addEventListener('click', () => showPage('home'));
  }

  if (btnHome) {
    btnHome.addEventListener('click', () => showPage('home'));
  }
}

// ============================================
// App starten
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  // Startseite ist per HTML bereits sichtbar
});
