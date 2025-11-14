import React from "react";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  authFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  user?: { username: string };
};

const AuthContext = React.createContext<AuthContextType | null>(null);

const TOKEN_KEY = "auth_token";

// Helper function to decode JWT and extract username
function decodeToken(token: string): { username: string; sub: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return { username: payload.username, sub: payload.sub };
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [token, setToken] = React.useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!token;
  const decoded = token ? decodeToken(token) : null;
  const username = decoded?.username || null;

  const saveToken = (t: string | null) => {
    setToken(t);
    try {
      if (t) localStorage.setItem(TOKEN_KEY, t);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {}
  };

  const login = async (username: string, password: string) => {
    // Use backend auth server during development
    // POST http://localhost:4001/api/auth/login expected to return { token }
    const res = await fetch("http://localhost:4001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Login failed");
    }

    const data = await res.json();
    if (!data.token) throw new Error("No token returned from server");
    saveToken(data.token);
  };

  const logout = () => {
    saveToken(null);
    navigate("/login", { replace: true });
  };

  const authFetch = (input: RequestInfo, init: RequestInit = {}) => {
    const headers = new Headers(init.headers ?? {});
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(input, { ...init, headers });
  };

  const value = React.useMemo(
    () => ({
      token,
      isAuthenticated,
      username,
      user: username ? { username } : undefined,
      login,
      logout,
      authFetch,
    }),
    [token, username]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthProvider;
