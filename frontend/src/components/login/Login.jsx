import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../toasts";

const LoginForm = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("USER");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  /**
   * real-time validation for password input
   */
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
   * @param {*} e - event object
   * @returns {Promise<void>}
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        success("Login erfolgreich!");
        setTimeout(() => {
          navigate("/explore");
          setIsLoggingIn(false);
        }, 2000);
      } else {
        showError(result.error || "Benutzername oder Passwort falsch.");
        setIsLoggingIn(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      showError("Ein unerwarteter Fehler ist aufgetreten.");
      setIsLoggingIn(false);
    }
  };

  /**
   * function to handle user registration
   * @param {*} e - event object
   * @returns {Promise<void>}
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

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
      const result = await register({
        username,
        email,
        password,
        role,
      });

      if (result.success) {
        success("Registrierung erfolgreich!");
        setTimeout(() => setIsLogin(true), 2000);
      } else {
        setError(result.error || "Registrierung fehlgeschlagen.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    }
  };

  /**
   * function to toggle between login and registration forms
   */
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
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
   * @returns {boolean} - true if the form is valid, false otherwise
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

        {error && <div className="alert alert-danger text-dark">{error}</div>}

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
                <div className="invalid-feedback d-block">{emailError}</div>
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
              <div className="invalid-feedback d-block">{passwordError}</div>
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
            disabled={!isFormValid() || isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Einloggen...
              </>
            ) : isLogin ? (
              "Einloggen"
            ) : (
              "Registrieren"
            )}
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
