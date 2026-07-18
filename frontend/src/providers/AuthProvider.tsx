"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { clearToken, getToken, setToken } from "@/lib/api-client";
import { UserRole, UserStatus } from "@/lib/enums";

// Re-export so consumers can import from a single place
export { UserRole, UserStatus };

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  campusId?: number | null;
  vendorApprovalStatus?: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** Persist token + user after a successful login/register */
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY = "auth_user";

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Start with null/loading on both server and client to avoid hydration mismatch.
  // useEffect runs only on the client, after hydration is complete.
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(USER_KEY);
      const token = getToken();
      if (stored && token) {
        setUser(JSON.parse(stored) as AuthUser);
      }
    } catch {
      // Corrupted storage – clear it
      sessionStorage.removeItem(USER_KEY);
      clearToken();
    }
    setIsLoading(false);
  }, []);

  // No async loading phase – state is resolved in the initializer above.
  // const isLoading = false;

  const login = useCallback((token: string, incoming: AuthUser) => {
    setToken(token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(incoming));
    setUser(incoming);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    sessionStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// ─── Role helpers ─────────────────────────────────────────────────────────────

export function useRequireRole(allowed: UserRole | UserRole[]) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const roles = Array.isArray(allowed) ? allowed : [allowed];
  return {
    user,
    isLoading,
    isAuthenticated,
    hasRole: !!user && roles.includes(user.role),
  };
}
