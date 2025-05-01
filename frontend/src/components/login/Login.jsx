import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

/**
 * LoginForm component for user authentication
 * @returns {JSX.Element}
 */
const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /**
   * function to handle user login
   * @param {*} e
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          username,
          password,
        }
      );

      localStorage.setItem("token", response.data.token || response.data);
      setSuccess("Login erfolgreich! Weiterleitung...");
      setTimeout(() => (window.location.href = "/explore"), 1500);
    } catch (err) {
      setError("Ungültige Anmeldedaten.");
    }
  };

  /**
   * function to handle user registration
   * @param {*} e
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        username,
        email,
        password,
      });
      setSuccess("Registrierung erfolgreich!");
      setTimeout(() => setIsLogin(true), 2000);
    } catch (err) {
      setError("Registrierung fehlgeschlagen.");
    }
  };

  /**
   * function to toggle between login and registration forms
   */
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white">
      <div
        className="card p-4 shadow-lg m-10"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="text-center mb-3">
          {isLogin ? "Anmelden" : "Registrieren"}
        </h2>
        <div className="text-center mb-4 fw-bold fs-4 text-danger">
          CineMate
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* username */}
        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Benutzername
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Benutzername"
            />
          </div>

          {/* email if registration form */}
          {!isLogin && (
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                E-Mail
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="E-Mail"
              />
            </div>
          )}

          {/* password */}
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">
              Passwort
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control pe-5" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Passwort"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                top: "70%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#6c757d", 
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* submit button */}
          <button type="submit" className="btn btn-danger w-100">
            {isLogin ? "Einloggen" : "Registrieren"}
          </button>
        </form>

        {/* toggle link */}
        <div className="text-center mt-3">
          <small>
            {isLogin ? "Noch kein Konto?" : "Bereits registriert?"}
            <button onClick={toggleForm} className="btn btn-link p-0 ms-2">
              {isLogin ? "Registrieren" : "Anmelden"}
            </button>
          </small>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
