"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type UserRole = "user" | "renter" | "admin" | null;

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRoleState] = useState<UserRole>(() => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("userRole");
      return savedRole ? JSON.parse(savedRole) : null;
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticatedState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isAuthenticated") === "true";
    }
    return false;
  });

  // Wrapper functions to update both state and localStorage
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("userRole", JSON.stringify(newRole));
    }
  };

  const setIsAuthenticated = (value: boolean) => {
    setIsAuthenticatedState(value);
    if (typeof window !== "undefined") {
      localStorage.setItem("isAuthenticated", String(value));
    }
  };

  // Hydration effect
  useEffect(() => {
    const initAuth = async () => {
      // Check if the stored values match the initial state
      const storedRole = localStorage.getItem("userRole");
      const storedAuth = localStorage.getItem("isAuthenticated");

      if (storedRole) {
        setRoleState(JSON.parse(storedRole));
      }
      if (storedAuth) {
        setIsAuthenticatedState(storedAuth === "true");
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ role, setRole, isAuthenticated, setIsAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
