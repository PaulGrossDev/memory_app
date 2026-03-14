/**
 * Theme-Daten – alle 4 Figma-Designvorlagen
 * Jedes Theme hat Farben und Preview-Bilder für die Settings-Vorschau.
 */

import type { Theme } from '../types/game.types';

export const THEMES: Theme[] = [
  {
    id: 'code-vibes',
    name: 'Code vibes theme',
    pageBackground: '#303131',
    headerBackground: 'transparent',
    exitButton: {
      icon: '/assets/themes/code-vibes/icons/exit.svg',
      fontFamily: 'Red Rose',
      fontWeight: 700,
      fontSize: '24px',
      color: '#FFFFFF',
      gap: '10px',
      padding: '16px 24px',
      background: '#86E9D633',
      border: '1px solid #4DD5BC',
      hover: {
        background: '#86E9D642',
        border: '1px solid #4DD5BC',
        boxShadow: '0 0 0 2px #4DD5BC, 4px 4px 6px 0px #4DD5BC33',
      },
    },
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
    pageBackground: '#294F60',
    headerBackground: '#FD96C933',
    exitButton: {
      icon: '/assets/themes/gaming/icons/exit.svg',
      fontFamily: 'Orbitron',
      fontWeight: 700,
      fontSize: '20px',
      color: '#FFFFFF',
      gap: '10px',
      padding: '12px 20px',
      background: '#ED1B7614',
      border: '2px solid #E71C4F',
      borderRadius: '10px',
      hover: {
        background: '#ED1B7624',
        border: '2px solid #E71C4F',
        boxShadow: '0 0 0 1px #E71C4F, 3px 3px 5px 0px #2F2E2E33',
        iconHover: '/assets/themes/gaming/icons/exit-hover.svg',
      },
    },
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
    pageBackground: '#FFFFFF',
    headerBackground: '#F0F3F4',
    exitButton: {
      icon: '/assets/themes/da-projects/icons/exit.svg',
      fontFamily: 'Figtree',
      fontWeight: 700,
      fontSize: '20px',
      color: '#1E7594',
      gap: '10px',
      padding: '12px 20px',
      background: '#BFE5F2',
      borderRadius: '10px',
      hover: {
        background: '#1E7594',
        boxShadow: '3px 3px 5px 0px #2F2E2E33',
        color: '#FFFFFF',
        iconHover: '/assets/themes/da-projects/icons/exit-hover.svg',
      },
    },
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
    pageBackground: '#FFFFFF',
    headerBackground: '#F0E5D9',
    exitButton: {
      icon: '/assets/themes/foods/icons/exit.svg',
      fontFamily: 'Delius Unicase',
      fontWeight: 700,
      fontSize: '16px',
      color: '#F3832D',
      gap: '10px',
      padding: '12px 20px',
      background: '#FFF9F2',
      border: '3px solid #F3832D',
      borderRadius: '10px',
      hover: {
        background: '#F3832D',
        boxShadow: '3px 3px 5px 0px #2F2E2E33',
        color: '#FFFFFF',
        iconHover: '/assets/themes/foods/icons/exit-hover.svg',
      },
    },
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

/** Theme anhand der ID finden */
export function getThemeById(themeId: string): Theme | undefined {
  return THEMES.find((t) => t.id === themeId);
}
