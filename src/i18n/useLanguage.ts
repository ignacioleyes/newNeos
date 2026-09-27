import { useContext } from "react";
import { LanguageContext } from "./langContext";
import type { Localized } from "./types";
import type { Messages } from "./strings";

function useLanguageContext() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return ctx;
}

/** Returns the current language + setter. */
export function useLang() {
  const { lang, setLang, toggle } = useLanguageContext();
  return { lang, setLang, toggle };
}

/**
 * Returns the full messages tree for the current language.
 * Usage: const m = useT(); m.hero.titleA
 */
export function useT(): Messages {
  return useLanguageContext().m;
}

/**
 * Returns a helper that picks the value for the current language
 * from a Localized<T> object stored in data files.
 */
export function useTr() {
  const { lang } = useLanguageContext();
  return function tr<T>(value: Localized<T>): T {
    return value[lang];
  };
}
