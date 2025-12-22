const Modal = ({
  show,
  title,
  children,
  onClose,
  onSave,
  saveText = "Speichern",
}) => {
  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            {onSave && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onSave}
              >
                {saveText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
