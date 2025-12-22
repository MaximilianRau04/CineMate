import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext();

/**
 * Custom hook to access authentication context.
 * @returns {Object} The context value containing authentication state and methods.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * AuthProvider component to provide authentication context.
 * @param {*} param0
 * @returns {JSX.Element} The provider component wrapping its children.
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Function to reset all auth state
  const resetAuthState = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  }, []);

  // Function to log out the user and clear localStorage
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");

    resetAuthState();
  }, [resetAuthState]);

  /**
   * Validates the user's token and sets the authentication state.
   * @returns {Promise<void>}
   */
  const validateToken = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      resetAuthState();
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        setIsLoading(false);

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userRole", userData.role);
        localStorage.setItem("userId", userData.id);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      logout();
    }
  }, [logout, resetAuthState]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  /**
   * Logs in the user with the provided credentials.
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<Object>} The result of the login attempt.
   */
  const login = async (username, password) => {
    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login fehlgeschlagen");
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userId", data.user.id);

      setUser(data.user);
      setIsAuthenticated(true);
      setIsLoading(false);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };

  /**
   * Registers a new user.
   * @param {Object} userData - The data of the user to register.
   * @returns {Promise<Object>} The result of the registration attempt.
   */
  const register = async (userData) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registrierung fehlgeschlagen");
      }

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    register,
    validateToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
