import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { formatDate } from "../utils/utils";
import { useTranslation } from "../../../i18n/I18nContext";

const UserManagement = ({ users, onDeleteUser }) => {
  const [filterRole, setFilterRole] = useState("all");
  const { t } = useTranslation();

  const filteredUsers =
    filterRole === "all"
      ? users
      : users.filter((user) => user.role === filterRole);

  return (
    <div>
      <h4 className="mb-4">{t("admin.tabs.users")}</h4>

      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-end mb-3">
            <div
              className="btn-group"
              role="group"
              aria-label={t("admin.users.filter")}
            >
              <button
                className={`btn ${filterRole === "all" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setFilterRole("all")}
              >
                <i className="bi bi-people me-1"></i>
                {t("common.all")}
              </button>
              <button
                className={`btn ${filterRole === "USER" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setFilterRole("USER")}
              >
                <i className="bi bi-person me-1"></i>
                User
              </button>
              <button
                className={`btn ${filterRole === "ADMIN" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setFilterRole("ADMIN")}
              >
                <i className="bi bi-shield-check me-1"></i>
                Admin
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>{t("auth.username")}</th>
                  <th>{t("auth.email")}</th>
                  <th>{t("auth.role")}</th>
                  <th>{t("admin.users.registered")}</th>
                  <th>{t("common.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`badge ${user.role === "ADMIN" ? "bg-danger" : "bg-primary"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>{formatDate(user.joinedAt)}</td>
                    <td>
                      {user.role !== "ADMIN" && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                t("admin.users.confirmDelete", {
                                  name: user.username,
                                }),
                              )
                            ) {
                              onDeleteUser(user.id);
                            }
                          }}
                        >
                          <FaTrash className="me-1" /> {t("common.delete")}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
