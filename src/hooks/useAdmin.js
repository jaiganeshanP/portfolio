import { useState, useCallback } from "react";

const ADMIN_PASSWORD = "jai@admin"; // ← change this
const SESSION_KEY    = "admin_session";

export function useAdmin() {
  const [isAdmin,    setIsAdmin]    = useState(() => sessionStorage.getItem(SESSION_KEY) === "true");
  const [loginError, setLoginError] = useState("");

  const login = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setIsAdmin(true);
      setLoginError("");
      return true;
    }
    setLoginError("That password took a coffee break. Try again. ☕");
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAdmin(false);
    setLoginError("");
  }, []);

  return { isAdmin, login, logout, loginError, setLoginError };
}
