import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import en from "./locales/en";
import de from "./locales/de";

const STORAGE_KEY = "cinemate.lang";

export const LANGUAGES = {
  en: { label: "English", short: "EN", locale: "en-US", messages: en },
  de: { label: "Deutsch", short: "DE", locale: "de-DE", messages: de },
};

const I18nContext = createContext(null);

/**
 * Resolves a dot separated key ("nav.explore") inside a messages object.
 * @param {Object} messages
 * @param {string} key
 * @returns {*} the value or undefined
 */
const lookup = (messages, key) =>
  key
    .split(".")
    .reduce(
      (node, part) =>
        node && typeof node === "object" ? node[part] : undefined,
      messages,
    );

/**
 * Replaces {placeholders} in a message with values from params.
 */
const interpolate = (message, params) =>
  params
    ? message.replace(/\{(\w+)\}/g, (match, name) =>
        params[name] !== undefined && params[name] !== null
          ? String(params[name])
          : match,
      )
    : message;

const readStoredLanguage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && LANGUAGES[stored]) return stored;
  } catch {
    // storage unavailable, fall through to default
  }
  return "en";
};

/**
 * Global translation provider. Stores the selected language in localStorage
 * and keeps <html lang> in sync.
 */
export const I18nProvider = ({ children }) => {
  const [lang, setLangState] = useState(readStoredLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const setLang = useCallback((next) => {
    if (LANGUAGES[next]) setLangState(next);
  }, []);

  const value = useMemo(() => {
    const { messages, locale } = LANGUAGES[lang];

    /**
     * Translates a key. Supports {param} interpolation and plural objects
     * ({ one, other }) selected by params.count.
     */
    const t = (key, params) => {
      let message = lookup(messages, key);
      if (message === undefined) message = lookup(en, key);
      if (message === undefined) return key;

      if (typeof message === "object" && params?.count !== undefined) {
        message = params.count === 1 ? message.one : message.other;
      }
      if (typeof message !== "string") return key;
      return interpolate(message, params);
    };

    /**
     * Returns true when a key exists for the active language (or English).
     */
    const has = (key) =>
      lookup(messages, key) !== undefined || lookup(en, key) !== undefined;

    const formatDate = (value, options) => {
      if (!value) return t("common.unknown");
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) return t("common.unknown");
      return date.toLocaleDateString(locale, options);
    };

    const formatDateTime = (value, options) => {
      if (!value) return t("common.unknown");
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) return t("common.unknown");
      return date.toLocaleString(
        locale,
        options || {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      );
    };

    const formatNumber = (value, options) =>
      Number(value).toLocaleString(locale, options);

    /**
     * Relative time like "5 minutes ago" / "vor 5 Minuten".
     */
    const formatRelative = (value) => {
      if (!value) return "";
      const date = value instanceof Date ? value : new Date(value);
      const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
      const abs = Math.abs(diffSeconds);
      if (abs < 60) return rtf.format(diffSeconds, "second");
      if (abs < 3600) return rtf.format(Math.round(diffSeconds / 60), "minute");
      if (abs < 86400)
        return rtf.format(Math.round(diffSeconds / 3600), "hour");
      if (abs < 604800)
        return rtf.format(Math.round(diffSeconds / 86400), "day");
      return formatDate(date);
    };

    return {
      lang,
      locale,
      setLang,
      t,
      has,
      formatDate,
      formatDateTime,
      formatNumber,
      formatRelative,
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

/**
 * Access translations: const { t, lang, setLang, formatDate } = useTranslation();
 */
export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
};
