import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: UserCredentials) => Promise<{ message: string } | null>;
}

type UserCredentials = {
  email: string;
  password: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (credentials: UserCredentials) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        credentials,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

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
    <AuthContext.Provider value={{ user, isAuthenticated, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used with AuthProvider");
  }
  return context;
};

export default AuthProvider;
