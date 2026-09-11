"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Dictionary, Lang } from "@/data/i18n/types";
import { LANG_STORAGE_KEY } from "./langBoot";

type LanguageContextValue = {
  lang: Lang;
  dict: Dictionary;
  setLang: (lang: Lang) => void;
  toggle: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLang(value: unknown): value is Lang {
  return value === "en" || value === "ar";
}

export function LanguageProvider({
  children,
  dictionaries,
}: {
  children: React.ReactNode;
  /** Current dictionaries — includes any content saved through /admin. */
  dictionaries: Record<Lang, Dictionary>;
}) {
  // Start on English so the server render and the first client render agree.
  // A stored preference is adopted right after mount (the boot script has
  // already fixed <html dir> to avoid a layout flash).
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (isLang(stored)) setLangState(stored);
    } catch {
      /* storage unavailable — stay on the default */
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggle = useCallback(
    () => setLangState((prev) => (prev === "ar" ? "en" : "ar")),
    [],
  );

  return (
    <LanguageContext.Provider
      value={{ lang, dict: dictionaries[lang], setLang, toggle }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return ctx;
}
