"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { UserDto } from "@/types";
import { AuthService } from "@/services/auth";

interface AuthContextType {
  user: UserDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  setUser: (user: UserDto | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: UserDto | null;
}

export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  const [user, setUser] = useState<UserDto | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);

  const refreshUser = async () => {
    try {
      setIsLoading(true);

      // Cookie'ler otomatik gider; token server'da okunur. API route kullan ki backend'e token ile istek atılsın.
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();

      if (res.ok && data?.user) {
        setUser(data.user);
      } else {
        console.log("[AuthContext] Oturum yok veya kullanıcı alınamadı:", data?.message || res.status);
        setUser(null);
      }
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // Cookie silme ve redirect işlemi route handler'da yapılacak
    window.location.href = "/auth/logout";
  };

  useEffect(() => {
    // Eğer initialUser yoksa, client-side'da kullanıcı bilgilerini al
    if (!initialUser) {
      refreshUser();
    }
  }, [initialUser]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    refreshUser,
    setUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper hook for checking roles
export function useHasRole(roles: string[]) {
  const { user } = useAuth();

  if (!user) return false;

  // Admin kontrolü
  if (user.isManager && roles.includes("Admin")) return true;

  // User kontrolü (herkes user)
  if (roles.includes("User")) return true;

  return false;
}
