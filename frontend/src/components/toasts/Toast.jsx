import React, { useEffect, useState } from "react";
import { useTranslation } from "../../i18n/I18nContext";

const ICONS = {
  success: "bi-check-circle-fill",
  error: "bi-exclamation-octagon-fill",
  warning: "bi-exclamation-triangle-fill",
  info: "bi-info-circle-fill",
};

const Toast = ({ toast, onRemove }) => {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  const type = ICONS[toast.type] ? toast.type : "info";

  useEffect(() => {
    const showTimer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(showTimer);
  }, []);

  /**
   * Handles the close button click event.
   */
  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  return (
    <div
      className={`cm-toast cm-toast-${type}${show ? " is-visible" : ""}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <i className={`bi ${ICONS[type]} cm-toast-icon`} aria-hidden="true" />
      <div className="flex-grow-1">
        <strong className="cm-toast-title">{t(`toast.${type}`)}</strong>
        <span className="cm-toast-msg">{toast.message}</span>
      </div>
      <button
        onClick={handleClose}
        type="button"
        className="cm-toast-close"
        aria-label={t("common.close")}
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
