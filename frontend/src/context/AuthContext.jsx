import { useEffect, useState, createContext, useContext } from "react";
import { getCurrentUser, logoutUser } from "@/services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const refreshUser = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data.user);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
