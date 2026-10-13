import { useTranslation } from "../../../i18n/I18nContext";
const Modal = ({ show, title, children, onClose, onSave, saveText }) => {
  const { t } = useTranslation();
  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(8, 4, 10, 0.75)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label={t("common.close")}
            ></button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              {t("common.cancel")}
            </button>
            {onSave && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onSave}
              >
                {saveText || t("common.save")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
