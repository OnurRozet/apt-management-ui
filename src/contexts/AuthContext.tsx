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

// Cookie'den değer okuma helper fonksiyonu
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
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

      // Cookie'den apartmentNumber'ı oku
      const apartmentNumber = getCookie("apartment_number");

      if (!apartmentNumber) {
        console.log("[AuthContext] apartment_number cookie bulunamadı");
        setUser(null);
        return;
      }

      console.log(
        "[AuthContext] Kullanıcı bilgileri alınıyor:",
        apartmentNumber,
      );
      const response = await AuthService.getMe(apartmentNumber);

      if (response.data?.isSuccess) {
        setUser(response.data.resultObject);
      } else {
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
