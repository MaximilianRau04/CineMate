import React, { useState, useEffect } from "react";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../toasts";
import { useTranslation } from "../../i18n/I18nContext";
import LanguageSwitcher from "../navigation/LanguageSwitcher";

const LoginForm = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const { t } = useTranslation();
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
        setPasswordError(t("auth.passwordTooShort"));
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
        setConfirmPasswordError(t("auth.passwordMismatch"));
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
        setEmailError(t("auth.invalidEmail"));
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
        success(t("auth.loginSuccess"));
        setTimeout(() => {
          navigate("/explore");
          setIsLoggingIn(false);
        }, 2000);
      } else {
        showError(result.error || t("auth.invalidCredentials"));
        setIsLoggingIn(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      showError(t("common.unexpectedError"));
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
      setError(t("auth.passwordTooShort"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.passwordMismatch"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t("auth.invalidEmail"));
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
        success(t("auth.registerSuccess"));
        setTimeout(() => setIsLogin(true), 2000);
      } else {
        setError(result.error || t("auth.registerFailed"));
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(t("common.unexpectedError"));
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

  const eyeToggle = (
    <button
      type="button"
      className="cm-eye"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={
        showPassword ? t("auth.hidePassword") : t("auth.showPassword")
      }
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  );

  return (
    <div className="cm-login">
      <div className="cm-login-top">
        <span className="cm-brand cm-login-brand">
          <span className="cm-brand-mark" aria-hidden="true" />
          <span>
            CINE<span className="cm-brand-accent">MATE</span>
          </span>
        </span>
        <LanguageSwitcher />
      </div>

      <section className="cm-login-hero">
        <div className="cm-eyebrow">{t("auth.heroEyebrow")}</div>
        <h1 className="cm-login-headline">
          {t("auth.heroLine1")}
          <span>{t("auth.heroLine2")}</span>
        </h1>
        <p className="cm-login-sub">{t("auth.heroSub")}</p>
      </section>

      <section className="cm-ticket" aria-labelledby="auth-title">
        <div className="cm-ticket-head">
          <div className="cm-eyebrow">
            {isLogin ? t("auth.admitOne") : t("auth.newMember")}
          </div>
          <h2 id="auth-title">
            {isLogin ? t("auth.signInTitle") : t("auth.registerTitle")}
          </h2>
        </div>

        <div className="cm-ticket-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={isLogin ? handleLogin : handleRegister} noValidate>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                {t("auth.username")}
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  {t("auth.email")}
                </label>
                <input
                  type="email"
                  className={`form-control${emailError ? " is-invalid" : ""}`}
                  id="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {emailError && (
                  <div className="invalid-feedback d-block">{emailError}</div>
                )}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                {t("auth.password")}
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control pe-5${!isLogin && passwordError ? " is-invalid" : ""}`}
                  id="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {eyeToggle}
              </div>
              {!isLogin && passwordError && (
                <div className="invalid-feedback d-block">{passwordError}</div>
              )}
            </div>

            {!isLogin && (
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  {t("auth.confirmPassword")}
                </label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control pe-5${confirmPasswordError ? " is-invalid" : ""}`}
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {eyeToggle}
                </div>
                {confirmPasswordError && (
                  <div className="invalid-feedback d-block">
                    {confirmPasswordError}
                  </div>
                )}
              </div>
            )}

            {!isLogin && (
              <div className="mb-3">
                <label htmlFor="role" className="form-label">
                  {t("auth.role")}
                </label>
                <select
                  id="role"
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="USER">{t("auth.roleUser")}</option>
                  <option value="ADMIN">{t("auth.roleAdmin")}</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 mt-2"
              disabled={!isFormValid() || isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {t("auth.signingIn")}
                </>
              ) : isLogin ? (
                t("auth.signIn")
              ) : (
                t("auth.createAccount")
              )}
            </button>
          </form>
        </div>

        <div className="cm-ticket-stub">
          <span>{isLogin ? t("auth.noAccount") : t("auth.haveAccount")}</span>
          <button
            type="button"
            onClick={toggleForm}
            className="btn btn-link p-0"
          >
            {isLogin ? t("auth.createAccount") : t("auth.signIn")}
          </button>
        </div>
      </section>
    </div>
  );
};

export default LoginForm;
