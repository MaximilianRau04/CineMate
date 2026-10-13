import { useState, useEffect } from "react";
import { Send, Users, User, Mail } from "lucide-react";
import api from "../../../utils/api";
import { useTranslation } from "../../../i18n/I18nContext";

const AdminNotificationPanel = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    targetUserId: "",
  });
  const [users, setUsers] = useState([]);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    /**
     * loads the list of users for the notification dropdown
     */
    const loadUsers = async () => {
      try {
        const { data: userData } = await api.get("/admin/notifications/users");
        setUsers(userData);
      } catch (err) {
        setError(t("admin.notify.loadUsersError", { message: err.message }));
      }
    };

    loadUsers();
  }, []);

  /**
   * handles the form submission for sending notifications
   * @param {*} e
   * @returns {Promise<void>}
   * @throws {Error} if the request fails or validation fails
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      setError(t("admin.notify.required"));
      return;
    }

    setSending(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/admin/notifications/send", {
        title: formData.title,
        message: formData.message,
        targetUserId: formData.targetUserId || null,
      });
      setSuccess(
        formData.targetUserId
          ? t("admin.notify.sentOne")
          : t("admin.notify.sentAll"),
      );
      setFormData({ title: "", message: "", targetUserId: "" });
    } catch (err) {
      setError(
        err.response?.data ||
          t("admin.notify.sendError", { message: err.message }),
      );
    } finally {
      setSending(false);
    }
  };

  // handles input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center">
        <Mail className="me-2" size={20} />
        <h5 className="mb-0">{t("admin.notify.title")}</h5>
      </div>
      <div className="card-body">
        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
            ></button>
          </div>
        )}

        {success && (
          <div
            className="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            {success}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccess("")}
            ></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="title" className="form-label">
                <strong>{t("admin.fields.title")}</strong>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleInputChange}
                placeholder={t("admin.notify.titlePlaceholder")}
                required
                disabled={sending}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="targetUserId" className="form-label">
                <strong>{t("admin.notify.recipient")}</strong>
              </label>
              <select
                id="targetUserId"
                name="targetUserId"
                className="form-select"
                value={formData.targetUserId}
                onChange={handleInputChange}
                disabled={sending}
              >
                <option value="">{t("admin.notify.allUsers")}</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    👤 {user.username} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              <strong>{t("admin.notify.message")}</strong>
            </label>
            <textarea
              id="message"
              name="message"
              className="form-control"
              rows="4"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={t("admin.notify.messagePlaceholder")}
              required
              disabled={sending}
            />
            <div className="form-text">
              {t("lists.form.chars", {
                count: formData.message.length,
                max: 1000,
              })}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              {formData.targetUserId ? (
                <span>
                  <User size={16} className="me-1" />
                  {t("admin.notify.toOne")}
                </span>
              ) : (
                <span>
                  <Users size={16} className="me-1" />
                  {t("admin.notify.toAll", { count: users.length })}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                sending || !formData.title.trim() || !formData.message.trim()
              }
            >
              {sending ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  {t("forum.sending")}
                </>
              ) : (
                <>
                  <Send size={16} className="me-2" />
                  {t("admin.notify.send")}
                </>
              )}
            </button>
          </div>
        </form>

        <hr className="my-4" />

        <div className="bg-light p-3 rounded">
          <h6 className="mb-2">{t("notificationSettings.notes")}</h6>
          <ul className="mb-0 small text-muted">
            <li>{t("admin.notify.note1")}</li>
            <li>{t("admin.notify.note2")}</li>
            <li>{t("admin.notify.note3")}</li>
            <li>{t("admin.notify.note4")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationPanel;
