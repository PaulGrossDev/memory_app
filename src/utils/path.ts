/**
 * Löst einen relativen oder absoluten Pfad zur vollständigen URL auf.
 * Berücksichtigt die Vite-Base-URL (import.meta.env.BASE_URL).
 *
 * @param path - Relativer oder absoluter Pfad (z.B. '/assets/icon.svg')
 * @returns Vollständige URL des Pfads
 */
export function resolvePath(path: string): string {
  const base = import.meta.env.BASE_URL;
  const p = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = base === '/' ? window.location.origin + '/' : window.location.origin + base;
  return new URL(p, baseUrl).href;
}
