// Authentication Service
// Handles all authentication-related API calls

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL - in production, this would be your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-api-url.com/api';

// Demo user for testing
const DEMO_USER = {
  id: 'demo-user-1',
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
    notificationSettings: {
      calorieAlerts: true,
      waterReminders: true,
      activityReminders: true,
      dailySummary: true,
      weeklyReport: true,
    },
  },
  healthInfo: {
    bloodType: 'O+',
    allergies: [],
    medicalConditions: [],
    medications: [],
    menstrualCycle: {
      isTracking: false,
      lastPeriodDate: null,
      cycleLength: 28,
      periodLength: 5,
    },
    pregnancyStatus: false,
    breastfeeding: false,
  },
};

// Authentication service object
const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      // In production, this would be an actual API call
      // const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      // return response.data;

      // For demo purposes, simulate registration
      console.log('Registering user:', userData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return demo user with token
      return {
        success: true,
        user: DEMO_USER,
        token: 'demo-token-' + Math.random().toString(36).substr(2, 9),
        message: 'Registration successful',
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed. Please try again.');
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      // In production, this would be an actual API call
      // const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      // return response.data;

      // For demo purposes, simulate login
      console.log('Logging in user:', credentials);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return demo user with token
      return {
        success: true,
        user: DEMO_USER,
        token: 'demo-token-' + Math.random().toString(36).substr(2, 9),
        message: 'Login successful',
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid email or password');
    }
  },

  // Logout user
  logout: async () => {
    try {
      // In production, this would be an actual API call
      // await axios.post(`${API_BASE_URL}/auth/logout`);
      
      // Clear token from storage
      await AsyncStorage.removeItem('userToken');
      
      return { success: true, message: 'Logout successful' };
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed. Please try again.');
    }
  },

  // Get current user
  getCurrentUser: async (token) => {
    try {
      // In production, this would be an actual API call
      // const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // return response.data;

      // For demo purposes, return demo user
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        user: DEMO_USER,
        message: 'User retrieved successfully',
      };
    } catch (error) {
      console.error('Get current user error:', error);
      throw new Error('Failed to get user information');
    }
  },

  // Update user profile
  updateProfile: async (token, profileData) => {
    try {
      // In production, this would be an actual API call
      // const response = await axios.put(`${API_BASE_URL}/users/profile`, profileData, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // return response.data;

      // For demo purposes, simulate update
      console.log('Updating profile:', profileData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        user: { ...DEMO_USER, profile: { ...DEMO_USER.profile, ...profileData } },
        message: 'Profile updated successfully',
      };
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error('Failed to update profile');
    }
  },

  // Update user preferences
  updatePreferences: async (token, preferences) => {
    try {
      // In production, this would be an actual API call
      // const response = await axios.put(`${API_BASE_URL}/users/preferences`, preferences, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // return response.data;

      // For demo purposes, simulate update
      console.log('Updating preferences:', preferences);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        preferences: { ...DEMO_USER.preferences, ...preferences },
        message: 'Preferences updated successfully',
      };
    } catch (error) {
      console.error('Update preferences error:', error);
      throw new Error('Failed to update preferences');
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      // In production, this would be an actual API call
      // await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      
      console.log('Forgot password for:', email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Password reset link sent to your email',
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new Error('Failed to send password reset link');
    }
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    try {
      // In production, this would be an actual API call
      // const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, { email, otp });
      // return response.data;

      console.log('Verifying OTP for:', email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'OTP verified successfully',
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw new Error('Invalid OTP or expired');
    }
  },
};

export default authService;
