import axios from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";

type User = {
  id: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
}
const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/me`,
        {
          withCredentials: true,
        }
      );

      const userData = response.data;
      setUser(userData);
      setIsAuthenticated(true);
    } catch (e) {
      console.log(e);
      setUser(null);
      setIsAuthenticated(false);
    }
  };
  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
