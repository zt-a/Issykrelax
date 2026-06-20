import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  apiRequest,
  loginRequest,
  clearTokens,
  isAuthenticated,
} from "../services/api";
import type { UserResponse } from "../types/api";

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  userRoles: string[];
  hasRole: (role: string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (data: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
  }) => Promise<void>;
  registerOwner: (data: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    business_phone: string;
  }) => Promise<void>;
  registerProvider: (data: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    role_slug: string;
  }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function deriveRoles(user: UserResponse | null): string[] {
  if (!user) return [];
  const roles: string[] = [];
  if (user.role === "admin") roles.push("admin", "moderator");
  if (user.role === "owner") roles.push("owner");
  if (user.role === "moderator") roles.push("moderator");
  if (user.role === "driver") roles.push("driver");
  if (user.role === "guide") roles.push("guide");
  if (user.role === "activity_provider") roles.push("activity_provider");
  if (user.role === "restaurant_partner") roles.push("restaurant_partner");
  if (user.role === "agency") roles.push("agency");
  if (user.role === "concierge") roles.push("concierge");
  if (user.role === "translator") roles.push("translator");
  roles.push("tourist");
  return roles;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const userRoles = deriveRoles(user);
  const hasRole = (role: string) => userRoles.includes(role);

  const fetchMe = useCallback(async () => {
    try {
      const data = await apiRequest<UserResponse>("/auth/me");
      setUser(data);
    } catch {
      clearTokens();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchMe().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchMe]);

  const login = async (email: string, password: string) => {
    await loginRequest(email, password);
    await fetchMe();
  };

  const registerUser = async (data: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
  }) => {
    await apiRequest("/auth/register-user", {
      method: "POST",
      body: data,
      auth: false,
    });
    await login(data.email, data.password);
  };

  const registerOwner = async (data: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    business_phone: string;
  }) => {
    await apiRequest("/auth/register-owner", {
      method: "POST",
      body: data,
      auth: false,
    });
    await login(data.email, data.password);
  };

  const registerProvider = async (data: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    role_slug: string;
  }) => {
    await apiRequest("/auth/register-provider", {
      method: "POST",
      body: data,
      auth: false,
    });
    await login(data.email, data.password);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const refresh = async () => {
    await fetchMe();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, userRoles, hasRole, login, registerUser, registerOwner, registerProvider, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
