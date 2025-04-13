import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Setze das JWT in den Header für die Anfrage
    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;

    // Anfrage an eine geschützte Route
    axios
      .get("http://localhost:8080/api/protected")
      .then((response) => {
        setUserData(response.data); // Hier würdest du die geschützten Daten verarbeiten
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen der geschützten Daten", error);
      });
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {userData ? (
        <div>
          <h3>Willkommen zurück, {userData.username}!</h3>
          {/* Weitere geschützte Daten anzeigen */}
        </div>
      ) : (
        <p>Lade geschützte Daten...</p>
      )}
    </div>
  );
};

export default Dashboard;
