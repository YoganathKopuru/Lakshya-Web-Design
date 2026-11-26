/**
 * Colour themes. "Midnight" is the signature blend (deep night, the logo's
 * indigo-to-teal spectrum as light); "Clean" is the light Kelder layout in
 * its original colours, with the same motion and hero art in its own
 * palette. The choice lives on <html data-theme> so CSS can scope every
 * override, and in localStorage so it survives navigation.
 */
export const themes = [
  {
    id: 'midnight',
    name: 'Midnight',
    hint: 'Deep night with indigo-to-teal light',
    chrome: '#05060f',
  },
  {
    id: 'clean',
    name: 'Clean',
    hint: 'Light paper with navy accents',
    chrome: '#07063a',
  },
] as const;

export type ThemeId = (typeof themes)[number]['id'];

export const defaultTheme: ThemeId = 'midnight';
export const themeStorageKey = 'lakshya-theme';

export function isThemeId(value: unknown): value is ThemeId {
  return themes.some((theme) => theme.id === value);
}

export function currentTheme(): ThemeId {
  const value = document.documentElement.dataset.theme;
  return isThemeId(value) ? value : defaultTheme;
}

/**
 * Runs in <head> before first paint, so a returning visitor's choice is in
 * place before anything renders (no flash of the other theme).
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${themeStorageKey}');var c={${themes
  .map((theme) => `'${theme.id}':'${theme.chrome}'`)
  .join(
    ',',
  )}};if(c[t]){document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',c[t]);}}catch(e){}})();`;

/** Calls `listener` whenever the theme attribute changes. */
export function observeTheme(listener: (theme: ThemeId) => void) {
  const observer = new MutationObserver(() => listener(currentTheme()));
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}

/** Reads a colour token from the live theme, e.g. themeColor('--teal'). */
export function themeColor(token: string, fallback: string) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  return value || fallback;
}
