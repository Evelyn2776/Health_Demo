import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../services/authService';

// Async thunks for user operations

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      await AsyncStorage.setItem('userToken', response.token);
      return response.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      await AsyncStorage.setItem('userToken', response.token);
      return response.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      await AsyncStorage.removeItem('userToken');
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadUser = createAsyncThunk(
  'user/load',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return rejectWithValue('No token found');
      }
      const response = await authService.getCurrentUser(token);
      return response.user;
    } catch (error) {
      await AsyncStorage.removeItem('userToken');
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue, getState }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await authService.updateProfile(token, profileData);
      return response.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updatePreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await authService.updatePreferences(token, preferences);
      return response.preferences;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  preferences: {
    activityLevel: 'moderately active',
    weightGoal: 'maintain',
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
    bloodType: '',
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

// Create slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Update local preferences (without API call)
    updateLocalPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    // Update local health info (without API call)
    updateLocalHealthInfo: (state, action) => {
      state.healthInfo = { ...state.healthInfo, ...action.payload };
    },
    // Set theme
    setTheme: (state, action) => {
      state.preferences.theme = action.payload;
    },
    // Temporary login for demo purposes
    tempLogin: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Login failed';
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Registration failed';
    });

    // Logout
    builder.addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Logout failed';
    });

    // Load user
    builder.addCase(loadUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    });
    builder.addCase(loadUser.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    });

    // Update profile
    builder.addCase(updateUserProfile.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.user = { ...state.user, ...action.payload };
      state.isLoading = false;
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Update failed';
    });

    // Update preferences
    builder.addCase(updateUserPreferences.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUserPreferences.fulfilled, (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
      state.isLoading = false;
    });
    builder.addCase(updateUserPreferences.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Update failed';
    });
  },
});

// Export actions and reducer
export const {
  clearError,
  updateLocalPreferences,
  updateLocalHealthInfo,
  setTheme,
  tempLogin,
} = userSlice.actions;

export default userSlice.reducer;
