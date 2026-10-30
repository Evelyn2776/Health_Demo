import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';
import { store, persistor } from './src/redux/store';
import { AuthProvider } from './src/context/AuthContext';
import { HealthDataProvider } from './src/context/HealthDataContext';

// Custom theme with green and purple color scheme
const theme = extendTheme({
  colors: {
    primary: {
      50: '#e8f5e9',
      100: '#c8e6c9',
      200: '#a5d6a7',
      300: '#81c784',
      400: '#66bb6a',
      500: '#4CAF50', // Primary green
      600: '#43a047',
      700: '#388e3c',
      800: '#2e7d32',
      900: '#1b5e20',
    },
    secondary: {
      50: '#f3e5f5',
      100: '#e1bee7',
      200: '#ce93d8',
      300: '#ba68c8',
      400: '#ab47bc',
      500: '#9C27B0', // Primary purple
      600: '#8e24aa',
      700: '#7b1fa2',
      800: '#6a1b9a',
      900: '#4a148c',
    },
    // Dark mode colors
    dark: {
      background: '#121212',
      card: '#1e1e1e',
      text: '#ffffff',
      border: '#333333',
    },
    // Light mode colors
    light: {
      background: '#ffffff',
      card: '#f5f5f5',
      text: '#121212',
      border: '#e0e0e0',
    },
  },
  config: {
    useSystemColorMode: true,
    initialColorMode: 'light',
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 8,
      },
      variants: {
        primary: {
          bg: 'primary.500',
          _pressed: { bg: 'primary.600' },
          _text: { color: 'white' },
        },
        secondary: {
          bg: 'secondary.500',
          _pressed: { bg: 'secondary.600' },
          _text: { color: 'white' },
        },
      },
    },
    Input: {
      baseStyle: {
        borderRadius: 8,
        borderWidth: 1,
      },
    },
    Card: {
      baseStyle: {
        borderRadius: 12,
        shadow: 2,
      },
    },
  },
});

// Custom color mode manager for NativeBase
const colorModeManager = {
  get: async () => {
    try {
      const value = await AsyncStorage.getItem('@color-mode');
      return value === 'dark' ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  },
  set: async (value) => {
    try {
      await AsyncStorage.setItem('@color-mode', value);
    } catch (e) {
      console.error('Failed to save color mode', e);
    }
  },
};

const App = () => {
  return (
    <SafeAreaProvider>
      <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AuthProvider>
              <HealthDataProvider>
                <NavigationContainer>
                  <StatusBar style="auto" />
                  <AppNavigator />
                </NavigationContainer>
              </HealthDataProvider>
            </AuthProvider>
          </PersistGate>
        </Provider>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
};

export default App;
