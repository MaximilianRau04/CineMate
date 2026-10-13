import React, { useState } from "react";
import { useTranslation } from "../../i18n/I18nContext";

const EditListModal = ({ list, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: list.title || "",
    description: list.description || "",
    isPublic: list.public || false,
    tags: list.tags ? list.tags.join(", ") : "",
    coverImageUrl: list.coverImageUrl || "",
  });
  const [loading, setLoading] = useState(false);

  /**
   * Handle form field changes.
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
      style={{ backgroundColor: "rgba(8, 4, 10, 0.75)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-pencil me-2"></i>
              {t("lists.editList")}
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
                  {t("lists.form.title")} <span className="text-danger">*</span>
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
                />
                <div className="form-text">
                  {t("lists.form.chars", {
                    count: formData.title.length,
                    max: 100,
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  {t("lists.form.description")}
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength="500"
                ></textarea>
                <div className="form-text">
                  {t("lists.form.chars", {
                    count: formData.description.length,
                    max: 500,
                  })}
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
                    {t("lists.form.public")}
                  </label>
                </div>
                <div className="form-text">
                  {formData.isPublic
                    ? t("lists.form.publicHint")
                    : t("lists.form.privateHint")}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-3">
                <label htmlFor="tags" className="form-label">
                  {t("lists.form.tags")}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder={t("lists.form.tagsPlaceholder")}
                />
                <div className="form-text">{t("lists.form.tagsHint")}</div>
              </div>

              {/* Cover Image URL */}
              <div className="mb-3">
                <label htmlFor="coverImageUrl" className="form-label">
                  {t("lists.form.coverUrl")}
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
              </div>

              {/* Preview */}
              {formData.coverImageUrl && (
                <div className="mb-3">
                  <label className="form-label">
                    {t("lists.form.preview")}
                  </label>
                  <div className="text-center">
                    <img
                      src={formData.coverImageUrl}
                      alt=""
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
                {t("common.cancel")}
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
                    {t("common.saving")}
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    {t("lists.form.saveChanges")}
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

export default EditListModal;
