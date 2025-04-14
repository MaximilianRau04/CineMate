import React, { useState } from "react";
import axios from "axios";
import '../assets/login.css';

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });

      // Speichere den Token im LocalStorage
      localStorage.setItem("token", response.data.token || response.data);
      setSuccess("Login erfolgreich! Sie werden weitergeleitet...");

      // Weiterleiten nach kurzem Delay
      setTimeout(() => {
        window.location.href = "/movies";
      }, 1500);
    } catch (error) {
      setError("Ungültige Anmeldedaten! Bitte versuche es erneut.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Einfache Validierung
    if (password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen lang sein");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        username,
        email,
        password,
      });
      
      setSuccess("Registrierung erfolgreich! Sie können sich jetzt anmelden.");
      // Nach der Registrierung zur Anmeldeform wechseln
      setTimeout(() => {
        setIsLogin(true);
      }, 2000);
    } catch (error) {
      setError("Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.");
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="form-header">
          <h2>{isLogin ? "Anmelden" : "Registrieren"}</h2>
          <div className="logo">CineMate</div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <div className="form-group">
            <label htmlFor="username">Benutzername</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Benutzername eingeben"
            />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="email">E-Mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="E-Mail Adresse eingeben"
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Passwort eingeben"
            />
          </div>
          
          <button type="submit" className="submit-btn">
            {isLogin ? "Einloggen" : "Registrieren"}
          </button>
        </form>
        
        <div className="form-footer">
          <p>
            {isLogin
              ? "Noch kein Konto?"
              : "Bereits registriert?"}
            <button onClick={toggleForm} className="toggle-btn">
              {isLogin ? "Jetzt registrieren" : "Anmelden"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;