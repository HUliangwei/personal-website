import en from './en';
import type { Dictionary, Locale } from './types';
import zh from './zh';

export const DEFAULT_LOCALE: Locale = 'zh';

const dictionaries: Record<Locale, Dictionary> = { zh, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function stripLocalePrefix(path: string): string {
  const [pathname] = path.split(/[?#]/, 1);
  const normalized = pathname === '/en' ? '/' : pathname.replace(/^\/en(?=\/)/, '');
  return normalized.replace(/\/$/, '') || '/';
}

export function localizedPath(path: string, locale: Locale): string {
  const route = stripLocalePrefix(path);
  if (locale === DEFAULT_LOCALE) return route;
  return route === '/' ? '/en' : `/en${route}`;
}

export function alternatePath(path: string): string {
  const locale: Locale = path === '/en' || path.startsWith('/en/') ? 'zh' : 'en';
  return localizedPath(path, locale);
}
