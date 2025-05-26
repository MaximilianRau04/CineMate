import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("USER");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (!isLogin && password.length > 0) {
      if (password.length < 6) {
        setPasswordError("Passwort muss mindestens 6 Zeichen lang sein.");
      } else {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
    }
  }, [password, isLogin]);

  /**
   * real-time validation for confirm password input
   */
  useEffect(() => {
    if (!isLogin && confirmPassword.length > 0) {
      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwörter stimmen nicht überein.");
      } else {
        setConfirmPasswordError("");
      }
    } else {
      setConfirmPasswordError("");
    }
  }, [password, confirmPassword, isLogin]);

  /**
   * real-time validation for email input
   */
  useEffect(() => {
    if (!isLogin && email.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("");
    }
  }, [email, isLogin]);

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
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", response.data.token || response.data);

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("userRole", response.data.user.role);
      }

      setSuccess("Login erfolgreich! Weiterleitung...");
      setTimeout(() => (window.location.href = "/explore"), 1500);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
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

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          username,
          email,
          password,
          role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Registrierung erfolgreich!");
      setTimeout(() => setIsLogin(true), 2000);
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);

      if (err.response?.status === 400) {
        const errorMessage = err.response.data?.message || err.response.data?.error || "Ungültige Eingabedaten.";
        setError(errorMessage);
      } else if (err.response?.status === 409) {
        setError("Benutzername oder E-Mail bereits vergeben.");
      } else {
        setError("Registrierung fehlgeschlagen. Bitte versuchen Sie es später erneut.");
      }
    }
  };

  /**
   * function to toggle between login and registration forms
   */
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setPasswordError("");
    setConfirmPasswordError("");
    setEmailError("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setEmail("");
  };

  /**
   * checks if the form is valid before submission
   * @returns {boolean}
   */
  const isFormValid = () => {
    if (isLogin) {
      return username.length > 0 && password.length > 0;
    } else {
      return (
        username.length > 0 &&
        email.length > 0 &&
        password.length >= 6 &&
        confirmPassword.length > 0 &&
        password === confirmPassword &&
        !emailError &&
        !passwordError &&
        !confirmPasswordError
      );
    }
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
              {emailError && (
                <div className="invalid-feedback d-block">
                  {emailError}
                </div>
              )}
            </div>
          )}

          {/* password */}
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">
              Passwort
            </label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
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
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#6c757d",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {!isLogin && passwordError && (
              <div className="invalid-feedback d-block">
                {passwordError}
              </div>
            )}
          </div>

          {/* confirm password if registration form */}
          {!isLogin && (
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Passwort wiederholen
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Passwort wiederholen"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#6c757d",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {confirmPasswordError && (
                <div className="invalid-feedback d-block">
                  {confirmPasswordError}
                </div>
              )}
            </div>
          )}

          {/* role selection if registration form */}
          {!isLogin && (
            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Rolle
              </label>
              <select
                id="role"
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          )}

          {/* submit button */}
          <button
            type="submit"
            className="btn btn-danger w-100"
            disabled={!isFormValid()}
          >
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