/**
 * Theme-Daten – alle 4 Figma-Designvorlagen
 * Jedes Theme hat Farben und Preview-Bilder für die Settings-Vorschau.
 */

import type { Theme } from '../types/game.types';

export const THEMES: Theme[] = [
  {
    id: 'code-vibes',
    name: 'Code vibes theme',
    colors: {
      primary: '#2dd4bf',
      secondary: '#f97316',
      cardBg: '#f8fafc',
      accent: '#FFDD47',
    },
    previewCardColors: ['#2dd4bf', '#f8fafc'],
    previewImages: {
      image1: '/assets/themes/code-vibes-card1.svg',
      image2: '/assets/themes/code-vibes-card2.svg',
    },
  },
  {
    id: 'gaming',
    name: 'Gaming theme',
    colors: {
      primary: '#6366f1',
      secondary: '#ec4899',
      cardBg: '#1e293b',
      accent: '#FFDD47',
    },
    previewCardColors: ['#6366f1', '#ec4899'],
    previewImages: {
      image1: '/assets/themes/gaming-card1.svg',
      image2: '/assets/themes/gaming-card2.svg',
    },
  },
  {
    id: 'da-projects',
    name: 'DA Projects theme',
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      cardBg: '#fefce8',
      accent: '#FFDD47',
    },
    previewCardColors: ['#3b82f6', '#10b981'],
    previewImages: {
      image1: '/assets/themes/da-projects-card1.svg',
      image2: '/assets/themes/da-projects-card2.svg',
    },
  },
  {
    id: 'foods',
    name: 'Foods theme',
    colors: {
      primary: '#f59e0b',
      secondary: '#ef4444',
      cardBg: '#fef3c7',
      accent: '#FFDD47',
    },
    previewCardColors: ['#f59e0b', '#ef4444'],
    previewImages: {
      image1: '/assets/themes/foods-card1.svg',
      image2: '/assets/themes/foods-card2.svg',
    },
  },
];
