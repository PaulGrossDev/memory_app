/**
 * Memory-Spiel – Einstiegspunkt
 */

import './styles/main.scss';
import { getSettings } from './state/gameState';
import {
  setupNavigation,
  setupGameBoardListeners,
  setupGameOverShortcut,
} from './navigation/navigation';
import {
  showThemePreview,
  updateStartBar,
  setupSettingsThemeHover,
  setupSettingsThemeChange,
  setupStartBarUpdates,
} from './settings/settings';

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
