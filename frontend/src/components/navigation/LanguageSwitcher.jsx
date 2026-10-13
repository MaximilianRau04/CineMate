import React from "react";
import { LANGUAGES, useTranslation } from "../../i18n/I18nContext";

/**
 * Segmented EN / DE switch. Persists the choice via the I18nProvider.
 */
const LanguageSwitcher = ({ className = "" }) => {
  const { lang, setLang, t } = useTranslation();

  return (
    <div
      className={`cm-lang ${className}`}
      role="group"
      aria-label={t("nav.language")}
    >
      {Object.entries(LANGUAGES).map(([code, { short, label }]) => (
        <button
          key={code}
          type="button"
          className={`cm-lang-option${lang === code ? " is-active" : ""}`}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          title={label}
        >
          {short}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
