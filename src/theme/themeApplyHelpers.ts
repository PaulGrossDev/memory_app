import { resolvePath } from '../utils/path';

/**
 * Setzt mehrere CSS-Variablen auf document.documentElement.
 *
 * @param vars - Array von [Name, Wert]-Paaren
 */
export function setCssVars(vars: [string, string][]): void {
  for (const [name, value] of vars) {
    document.documentElement.style.setProperty(name, value);
  }
}

/**
 * Setzt mehrere CSS-Variablen auf ein bestimmtes HTMLElement.
 *
 * @param el - Zielelement
 * @param vars - Array von [Name, Wert]-Paaren
 */
export function setCssVarsOnElement(el: HTMLElement, vars: [string, string][]): void {
  for (const [name, value] of vars) {
    el.style.setProperty(name, value);
  }
}

/**
 * Setzt die Src der Score-Icons (Blau/Orange) je nach Typ (label oder figure).
 *
 * @param iconBlue - Blaues Icon-Element
 * @param iconOrange - Oranges Icon-Element
 * @param type - 'label' oder 'figure'
 */
export function setScoreIcons(
  iconBlue: HTMLImageElement | null,
  iconOrange: HTMLImageElement | null,
  type: 'label' | 'figure'
): void {
  const bluePath = type === 'label' ? '/assets/icons/label-blue.svg' : '/assets/icons/figure-blue.svg';
  const orangePath = type === 'label' ? '/assets/icons/label-orange.svg' : '/assets/icons/figure-orange.svg';
  if (iconBlue) iconBlue.src = resolvePath(bluePath);
  if (iconOrange) iconOrange.src = resolvePath(orangePath);
}
