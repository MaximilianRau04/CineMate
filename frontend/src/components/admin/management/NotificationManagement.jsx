import { useState, useEffect } from "react";
import { Send, Users, User, Mail } from "lucide-react";
import api from "../../../utils/api";

const AdminNotificationPanel = () => {
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
        const { data: userData } = await api.get(
          "/admin/notifications/users",
        );
        setUsers(userData);
      } catch (err) {
        setError("Fehler beim Laden der Benutzerliste: " + err.message);
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
      setError("Titel und Nachricht sind erforderlich");
      return;
    }

    setSending(true);
    setError("");
    setSuccess("");

    try {
      const { data: result } = await api.post(
        "/admin/notifications/send",
        {
          title: formData.title,
          message: formData.message,
          targetUserId: formData.targetUserId || null,
        },
      );
      setSuccess(result);
      setFormData({ title: "", message: "", targetUserId: "" });
    } catch (err) {
      setError(
        err.response?.data || "Fehler beim Senden der Benachrichtigung: " + err.message,
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
        <h5 className="mb-0">📢 Benachrichtigungen senden</h5>
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
                <strong>Titel</strong>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Benachrichtigungstitel eingeben..."
                required
                disabled={sending}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="targetUserId" className="form-label">
                <strong>Empfänger</strong>
              </label>
              <select
                id="targetUserId"
                name="targetUserId"
                className="form-select"
                value={formData.targetUserId}
                onChange={handleInputChange}
                disabled={sending}
              >
                <option value="">📢 Alle Benutzer</option>
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
              <strong>Nachricht</strong>
            </label>
            <textarea
              id="message"
              name="message"
              className="form-control"
              rows="4"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Nachrichteninhalt eingeben..."
              required
              disabled={sending}
            />
            <div className="form-text">
              {formData.message.length}/1000 Zeichen
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              {formData.targetUserId ? (
                <span>
                  <User size={16} className="me-1" />
                  Wird an einen Benutzer gesendet
                </span>
              ) : (
                <span>
                  <Users size={16} className="me-1" />
                  Wird an alle {users.length} Benutzer gesendet
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
                  Wird gesendet...
                </>
              ) : (
                <>
                  <Send size={16} className="me-2" />
                  Benachrichtigung senden
                </>
              )}
            </button>
          </div>
        </form>

        <hr className="my-4" />

        <div className="bg-light p-3 rounded">
          <h6 className="mb-2">ℹ️ Hinweise:</h6>
          <ul className="mb-0 small text-muted">
            <li>
              Benachrichtigungen werden sowohl als Web- als auch als
              Email-Benachrichtigungen versendet
            </li>
            <li>
              Bei "Alle Benutzer" werden alle registrierten Nutzer
              benachrichtigt
            </li>
            <li>
              Spezifische Benutzer können über das Dropdown ausgewählt werden
            </li>
            <li>Der Versand erfolgt asynchron im Hintergrund</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationPanel;
