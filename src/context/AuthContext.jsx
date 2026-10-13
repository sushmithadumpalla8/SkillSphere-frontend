import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('skillsphere_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('skillsphere_user');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (credentials) => {
    const response = await loginApi(credentials);
    const data = response.data;
    const userData = {
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      studentId: data.studentId,
      instructorId: data.instructorId,
    };

    localStorage.setItem('skillsphere_token', data.token);
    localStorage.setItem('skillsphere_user', JSON.stringify(userData));

    setToken(data.token);
    setUser(userData);
    return userData;
  };

  const register = async (registerData) => {
    const response = await registerApi(registerData);
    const data = response.data;
    const userData = {
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      studentId: data.studentId,
      instructorId: data.instructorId,
    };

    localStorage.setItem('skillsphere_token', data.token);
    localStorage.setItem('skillsphere_user', JSON.stringify(userData));

    setToken(data.token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('skillsphere_token');
    localStorage.removeItem('skillsphere_user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;
  const isStudent = user?.role === 'STUDENT';
  const isInstructor = user?.role === 'INSTRUCTOR';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isStudent,
        isInstructor,
        isAdmin,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
