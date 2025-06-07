import React from "react";
import { formatDate } from "../utils/utils";

const UserManagement = ({ users }) => (
  <div>
    <h4 className="mb-4">Benutzerverwaltung</h4>
    <div className="card">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Benutzername</th>
                <th>E-Mail</th>
                <th>Rolle</th>
                <th>Registriert am</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{formatDate(user.joinedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default UserManagement;