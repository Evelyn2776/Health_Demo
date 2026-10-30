import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorMode, useColorModeValue, Icon, Box, Text } from 'native-base';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

// Import all screens
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';

import DashboardScreen from '../screens/main/DashboardScreen';
import FoodScreen from '../screens/food/FoodScreen';
import AddFoodScreen from '../screens/food/AddFoodScreen';
import FoodScannerScreen from '../screens/food/FoodScannerScreen';
import BarcodeScannerScreen from '../screens/food/BarcodeScannerScreen';
import FoodDetailsScreen from '../screens/food/FoodDetailsScreen';
import FoodLogScreen from '../screens/food/FoodLogScreen';
import NigerianFoodsScreen from '../screens/food/NigerianFoodsScreen';

import ActivityScreen from '../screens/activity/ActivityScreen';
import AddActivityScreen from '../screens/activity/AddActivityScreen';
import ActivityDetailsScreen from '../screens/activity/ActivityDetailsScreen';
import ExerciseScreen from '../screens/activity/ExerciseScreen';
import StepTrackerScreen from '../screens/activity/StepTrackerScreen';

import WaterScreen from '../screens/water/WaterScreen';
import AddWaterScreen from '../screens/water/AddWaterScreen';

import HealthScreen from '../screens/health/HealthScreen';
import WeightTrackerScreen from '../screens/health/WeightTrackerScreen';
import BodyMeasurementScreen from '../screens/health/BodyMeasurementScreen';
import HealthProfileScreen from '../screens/health/HealthProfileScreen';
import BodyPhotoScreen from '../screens/health/BodyPhotoScreen';

import RecommendationsScreen from '../screens/recommendations/RecommendationsScreen';
import FoodRecommendationsScreen from '../screens/recommendations/FoodRecommendationsScreen';
import ExerciseRecommendationsScreen from '../screens/recommendations/ExerciseRecommendationsScreen';

import HistoryScreen from '../screens/history/HistoryScreen';
import DailySummaryScreen from '../screens/history/DailySummaryScreen';
import WeeklySummaryScreen from '../screens/history/WeeklySummaryScreen';

import SettingsScreen from '../screens/settings/SettingsScreen';
import AccountSettingsScreen from '../screens/settings/AccountSettingsScreen';
import NotificationSettingsScreen from '../screens/settings/NotificationSettingsScreen';
import AppearanceSettingsScreen from '../screens/settings/AppearanceSettingsScreen';
import HealthSettingsScreen from '../screens/settings/HealthSettingsScreen';

// Create stack navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainTabNavigator = () => {
  const { colorMode } = useColorMode();
  const activeColor = useColorModeValue('primary.500', 'primary.400');
  const inactiveColor = useColorModeValue('gray.400', 'gray.500');
  const bgColor = useColorModeValue('white', 'dark.background');
  const borderColor = useColorModeValue('gray.200', 'dark.border');

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopWidth: 1,
          borderTopColor: borderColor,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Box alignItems="center">
              <Icon
                as={<Ionicons name="home-outline" />}
                color={color}
                size={size}
              />
              <Text fontSize="xs" color={color} mt={1}>
                Home
              </Text>
            </Box>
          ),
        }}
      />

      <Tab.Screen
        name="Food"
        component={FoodScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Box alignItems="center">
              <Icon
                as={<MaterialIcons name="restaurant-menu" />}
                color={color}
                size={size}
              />
              <Text fontSize="xs" color={color} mt={1}>
                Food
              </Text>
            </Box>
          ),
        }}
      />

      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Box alignItems="center">
              <Icon
                as={<FontAwesome5 name="running" />}
                color={color}
                size={size}
              />
              <Text fontSize="xs" color={color} mt={1}>
                Activity
              </Text>
            </Box>
          ),
        }}
      />

      <Tab.Screen
        name="Water"
        component={WaterScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Box alignItems="center">
              <Icon
                as={<MaterialIcons name="local-drink" />}
                color={color}
                size={size}
              />
              <Text fontSize="xs" color={color} mt={1}>
                Water
              </Text>
            </Box>
          ),
        }}
      />

      <Tab.Screen
        name="Health"
        component={HealthScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Box alignItems="center">
              <Icon
                as={<FontAwesome5 name="heartbeat" />}
                color={color}
                size={size}
              />
              <Text fontSize="xs" color={color} mt={1}>
                Health
              </Text>
            </Box>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main Stack (after login)
const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />

      {/* Food Stack */}
      <Stack.Screen name="AddFood" component={AddFoodScreen} />
      <Stack.Screen name="FoodScanner" component={FoodScannerScreen} />
      <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} />
      <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
      <Stack.Screen name="FoodLog" component={FoodLogScreen} />
      <Stack.Screen name="NigerianFoods" component={NigerianFoodsScreen} />

      {/* Activity Stack */}
      <Stack.Screen name="AddActivity" component={AddActivityScreen} />
      <Stack.Screen name="ActivityDetails" component={ActivityDetailsScreen} />
      <Stack.Screen name="Exercise" component={ExerciseScreen} />
      <Stack.Screen name="StepTracker" component={StepTrackerScreen} />

      {/* Water Stack */}
      <Stack.Screen name="AddWater" component={AddWaterScreen} />

      {/* Health Stack */}
      <Stack.Screen name="WeightTracker" component={WeightTrackerScreen} />
      <Stack.Screen name="BodyMeasurement" component={BodyMeasurementScreen} />
      <Stack.Screen name="HealthProfile" component={HealthProfileScreen} />
      <Stack.Screen name="BodyPhoto" component={BodyPhotoScreen} />

      {/* Recommendations Stack */}
      <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
      <Stack.Screen name="FoodRecommendations" component={FoodRecommendationsScreen} />
      <Stack.Screen name="ExerciseRecommendations" component={ExerciseRecommendationsScreen} />

      {/* History Stack */}
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="DailySummary" component={DailySummaryScreen} />
      <Stack.Screen name="WeeklySummary" component={WeeklySummaryScreen} />

      {/* Settings Stack */}
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="AppearanceSettings" component={AppearanceSettingsScreen} />
      <Stack.Screen name="HealthSettings" component={HealthSettingsScreen} />
    </Stack.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
