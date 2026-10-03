import { loadLocale } from 'wuchale/load-utils';
import { locales, type Locale } from '../locales/data.js';
// Side-effect import: registers the catalog loaders that `loadLocale` drives.
import '../locales/main.loader.svelte.js';

const LOCALE_KEY = 'pixzip_locale';

function fromStore(): Locale | null {
  try {
    const saved = localStorage.getItem(LOCALE_KEY);
    return (locales as string[]).includes(saved ?? '') ? (saved as Locale) : null;
  } catch {
    return null;
  }
}

function fromSystem(): Locale {
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

const settings = $state({ current: fromStore() ?? fromSystem() });

async function apply(locale: Locale) {
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  await loadLocale(locale);
}

/** Must be awaited before `App.svelte` is imported: app state translates while its module runs. */
export async function initLocale(): Promise<void> {
  await apply(settings.current);
}

export function currentLocale(): Locale {
  return settings.current;
}

export async function selectLocale(next: Locale): Promise<void> {
  if (next === settings.current) return;
  settings.current = next;
  try {
    localStorage.setItem(LOCALE_KEY, next);
  } catch {
    // Storage can throw in private or quota-exceeded contexts.
  }
  await apply(next);
}
