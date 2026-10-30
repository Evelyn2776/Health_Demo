import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, loginUser, logoutUser, tempLogin } from '../redux/slices/userSlice';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, user, error } = useSelector((state) => state.user);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await dispatch(loadUser());
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Login function
  const login = async (credentials) => {
    try {
      await dispatch(loginUser(credentials));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      // For demo purposes, we'll use tempLogin
      // In production, use dispatch(registerUser(userData))
      await dispatch(tempLogin(userData));
      await AsyncStorage.setItem('userToken', 'demo-token');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await dispatch(logoutUser());
      await AsyncStorage.removeItem('userToken');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Demo login for quick testing
  const demoLogin = async () => {
    const demoUser = {
      id: 'demo-user',
      email: 'demo@example.com',
      profile: {
        firstName: 'Demo',
        lastName: 'User',
        gender: 'male',
        dateOfBirth: new Date(1990, 0, 1),
        height: 175,
        currentWeight: 75,
        targetWeight: 70,
      },
      preferences: {
        activityLevel: 'moderately active',
        weightGoal: 'lose',
        dietaryRestrictions: [],
        unitSystem: 'metric',
        theme: 'auto',
      },
    };
    
    await dispatch(tempLogin(demoUser));
    await AsyncStorage.setItem('userToken', 'demo-token');
    return { success: true };
  };

  // Clear error
  const clearError = () => {
    // This will be handled by Redux
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    error,
    isInitialized,
    login,
    register,
    logout,
    demoLogin,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
