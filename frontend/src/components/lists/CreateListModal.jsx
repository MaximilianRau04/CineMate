import React, { useState } from "react";

const CreateListModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublic: true,
    tags: "",
    coverImageUrl: "",
  });
  const [loading, setLoading] = useState(false);

  /**
   * Handle input changes in the form.
   * @param {*} e
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /**
   * Handle form submission.
   * @param {*} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const listData = {
        title: formData.title,
        description: formData.description,
        isPublic: formData.isPublic,
        tags: tagsArray,
        coverImageUrl: formData.coverImageUrl || null,
      };

      await onSubmit(listData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-plus-circle me-2"></i>
              Neue Liste erstellen
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Title */}
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Titel <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength="100"
                  placeholder="z.B. Meine Top 10 Sci-Fi Filme"
                />
                <div className="form-text">
                  {formData.title.length}/100 Zeichen
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Beschreibung
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength="500"
                  placeholder="Beschreibe deine Liste..."
                ></textarea>
                <div className="form-text">
                  {formData.description.length}/500 Zeichen
                </div>
              </div>

              {/* Privacy */}
              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="isPublic">
                    <i className="bi bi-globe me-1"></i>
                    Öffentliche Liste
                  </label>
                </div>
                <div className="form-text">
                  {formData.isPublic
                    ? "Andere Nutzer können deine Liste sehen und liken."
                    : "Nur du kannst diese Liste sehen."}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-3">
                <label htmlFor="tags" className="form-label">
                  Tags
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Action, Komödie, 2024, ..."
                />
                <div className="form-text">
                  Trenne mehrere Tags mit Kommas. Diese helfen anderen, deine
                  Liste zu finden.
                </div>
              </div>

              {/* Cover Image URL */}
              <div className="mb-3">
                <label htmlFor="coverImageUrl" className="form-label">
                  Cover-Bild URL (optional)
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="coverImageUrl"
                  name="coverImageUrl"
                  value={formData.coverImageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
                <div className="form-text">
                  Wenn leer, wird das erste Poster aus der Liste verwendet.
                </div>
              </div>

              {/* Preview */}
              {formData.coverImageUrl && (
                <div className="mb-3">
                  <label className="form-label">Vorschau:</label>
                  <div className="text-center">
                    <img
                      src={formData.coverImageUrl}
                      alt="Cover Preview"
                      className="img-thumbnail"
                      style={{ maxHeight: "200px" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !formData.title.trim()}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Erstelle...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Liste erstellen
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListModal;
