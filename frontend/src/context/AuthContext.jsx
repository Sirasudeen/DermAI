import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  checkAuthStatus,
  loginUser,
  logoutUser,
  signupUser,
} from "../helpers/api-communicator";

const AuthContext = createContext(null);

/*
 * The session is resolved once on mount. The old version re-checked on every
 * route change and pushed /login from inside the provider; guarding is now
 * ProtectedRoute's job, which keeps navigation out of this file entirely.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    checkAuthStatus()
      .then((data) => {
        if (!active) return;
        if (data?.user) {
          setUser({ name: data.user.name, email: data.user.email });
          setStatus("in");
        } else {
          setStatus("out");
        }
      })
      .catch(() => {
        if (active) setStatus("out");
      });

    return () => {
      active = false;
    };
  }, []);

  const adopt = useCallback((data) => {
    if (!data?.user) throw new Error("Signed in, but the session did not come back.");
    setUser({ name: data.user.name, email: data.user.email });
    setStatus("in");
  }, []);

  const login = useCallback(
    async (email, password) => {
      await loginUser(email, password);
      adopt(await checkAuthStatus());
    },
    [adopt]
  );

  const signup = useCallback(
    async (name, email, password) => {
      await signupUser(name, email, password);
      adopt(await checkAuthStatus());
    },
    [adopt]
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setStatus("out");
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: status === "in",
      isChecking: status === "checking",
      login,
      signup,
      logout,
    }),
    [user, status, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
