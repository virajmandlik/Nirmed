import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'medical' | 'disposal';
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'medical' | 'disposal') => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: 'medical' | 'disposal',
    department?: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Backend-to-frontend role mapping
const mapUserTypeToRole = (userType: string): 'medical' | 'disposal' => {
  // Add logging to debug the role mapping
  console.log('Mapping userType to role:', userType);
  return userType === 'medical_staff' ? 'medical' : 'disposal';
};

// Frontend-to-backend mapping
const mapRoleToUserType = (role: 'medical' | 'disposal'): string => {
  // Add logging to debug the role mapping
  console.log('Mapping role to userType:', role);
  return role === 'medical' ? 'medical_staff' : 'disposal_staff';
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authService.getProfile();
          if (response.success && response.user) {
            const userData = response.user;
            setUser({
              id: userData._id || userData.id,
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              role: mapUserTypeToRole(userData.userType),
              department: userData.department,
            });
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, role: 'medical' | 'disposal') => {
    setLoading(true);
    try {
      const userType = mapRoleToUserType(role);
      const response = await authService.login(email, password, userType);

      if (response.success && response.token && response.user) {
        localStorage.setItem('token', response.token);

        const userData = response.user;
        const mappedUser: User = {
          id: userData._id || userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: mapUserTypeToRole(userData.userType),
          department: userData.department,
        };

        setUser(mappedUser);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: 'medical' | 'disposal',
    department?: string
  ) => {
    setLoading(true);
    try {
      const userType = mapRoleToUserType(role);
      const newUser = {
        email,
        password,
        firstName,
        lastName,
        userType,
        department,
      };

      const response = await authService.register(newUser);

      if (response.success && response.token && response.user) {
        localStorage.setItem('token', response.token);

        const userData = response.user;
        const mappedUser: User = {
          id: userData._id || userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: mapUserTypeToRole(userData.userType),
          department: userData.department,
        };

        setUser(mappedUser);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
