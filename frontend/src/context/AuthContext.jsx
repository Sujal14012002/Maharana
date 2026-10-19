import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { TOKEN_KEY } from "../api/axios";
import { loginAdmin, checkAdmin } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {}
    setIsAdmin(false);
  }, []);

  // Server said "token invalid/expired" -> log out automatically
  useEffect(() => {
    window.addEventListener("mps-unauthorized", logout);
    return () => window.removeEventListener("mps-unauthorized", logout);
  }, [logout]);

  // On first load: if a token is saved, ask the server if it is still valid
  useEffect(() => {
    let token = null;
    try {
      token = localStorage.getItem(TOKEN_KEY);
    } catch (e) {}

    if (!token) {
      setChecking(false);
      return;
    }
    checkAdmin()
      .then(() => setIsAdmin(true))
      .catch((err) => {
        // Only forget the token if the server said it is invalid
        if (err.response?.status === 401) logout();
      })
      .finally(() => setChecking(false));
  }, [logout]);

  const login = async (username, password) => {
    const res = await loginAdmin(username, password);
    localStorage.setItem(TOKEN_KEY, res.data.token);
    setIsAdmin(true);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
