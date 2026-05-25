export type Lang = "es" | "en";

export const SUPPORTED_LANGS: Lang[] = ["es", "en"];

export const DEFAULT_LANG: Lang = "es";

/** Wrapper for content that exists in both languages. */
export type Localized<T> = { es: T; en: T };
