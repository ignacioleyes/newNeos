import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LANG, SUPPORTED_LANGS, type Lang, type Localized } from "./types";
import { messages, type Messages } from "./strings";

const STORAGE_KEY = "neos.lang";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  m: Messages;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLang(): Lang {
  if (typeof window === "undefined") return DEFAULT_LANG;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && (SUPPORTED_LANGS as string[]).includes(stored)) {
    return stored as Lang;
  }
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === "es" ? "en" : "es");
  }, [lang, setLang]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggle,
      m: messages[lang],
    }),
    [lang, setLang, toggle]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

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
