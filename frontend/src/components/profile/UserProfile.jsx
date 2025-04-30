import React, { useEffect, useState } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/users/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Benutzer konnte nicht geladen werden.");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p className="text-center mt-5">🔄 Benutzer wird geladen...</p>;
  if (error)
    return <p className="text-center text-danger mt-5">❌ Fehler: {error}</p>;

  const { id, username, email, bio, avatarUrl, joinedAt } = user;
  const fallbackAvatar = "https://via.placeholder.com/150?text=Kein+Bild";

  const formattedDate = new Date(joinedAt).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="row g-0">
          <div className="col-md-4 text-center bg-dark text-white p-4">
            <img
              src={avatarUrl}
              alt={username}
              className="img-fluid rounded-circle shadow-sm mb-3"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src = fallbackAvatar;
              }}
            />
            <div className="small text-muted">Profilbild</div>
          </div>

          <div className="col-md-8 p-4">
            <h2 className="mb-3">{username}</h2>
            <p className="text-muted mb-1">
              <strong>Email:</strong> {email}
            </p>
            {bio && (
              <p className="text-muted mb-3">
                <strong>Über mich:</strong> {bio}
              </p>
            )}
            <p className="text-muted mb-0">
              <strong>Beigetreten:</strong> {formattedDate}
            </p>
            <p className="text-muted">
              <strong>User ID:</strong> {id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
