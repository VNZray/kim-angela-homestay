import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

import type { User } from "../types/User";
interface AuthContextType {
  user?: User | null;
  loading?: boolean;
  login?: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<User>;
  logout?: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(
    async (
      email: string,
      password: string,
      rememberMe?: boolean
    ): Promise<User> => {
      // Placeholder implementation, replace with your actual login logic
      const user: User = { email, password, rememberMe };
      setLoading(false);
      setUser(user);
      return user;
    },
    []
  );

  const logout = useCallback(() => {}, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
