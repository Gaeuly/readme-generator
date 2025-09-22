import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// Define the user data structure from GitHub
interface IUser {
  id: string;
  displayName: string;
  username: string;
  photos: { value: string }[];
}

// Define the context properties
interface IAuthContext {
  user: IUser | null;
  isLoading: boolean;
}

// Create the context
const AuthContext = createContext<IAuthContext>({
  user: null,
  isLoading: true,
});

// The main provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // This effect runs once when the app loads
  useEffect(() => {
    const checkUserStatus = async () => {
      // This is the professional way: read from environment variables
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
      
      try {
        const response = await fetch(`${backendUrl}/api/auth/user`, {
          credentials: 'include', // IMPORTANT: sends session cookies
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Could not fetch user status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []); // Empty array means this runs only once

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useAuth = () => {
  return useContext(AuthContext);
};