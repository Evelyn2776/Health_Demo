import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getFoodSummary,
  getFoodLogs,
  getNigerianFoodRecommendations,
} from '../redux/slices/foodSlice';
import {
  getActivityLogs,
  getStepData,
} from '../redux/slices/activitySlice';
import {
  getWaterData,
  calculateWaterGoal,
} from '../redux/slices/waterSlice';
import {
  getHealthMetrics,
  calculateCalorieNeeds,
  calculateBMICategory,
} from '../redux/slices/healthSlice';
import { Alert } from 'react-native';

// Create Health Data Context
const HealthDataContext = createContext();

// Helper functions for calculations
const calculateDailyCalorieNeeds = (user) => {
  if (!user) return 2000; // Default value

  const { profile, preferences, healthInfo } = user;
  const { weight, height, dateOfBirth, gender } = profile;
  const { activityLevel, weightGoal } = preferences;

  // Calculate age
  const birthDate = new Date(dateOfBirth);
  const age = new Date().getFullYear() - birthDate.getFullYear();

  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    'lightly active': 1.375,
    'moderately active': 1.55,
    'very active': 1.725,
    'extra active': 1.9,
  };

  const tdee = bmr * activityMultipliers[activityLevel];

  // Adjust for weight goal
  const goalAdjustments = {
    lose: -500, // 0.5kg loss per week
    maintain: 0,
    gain: 500, // 0.5kg gain per week
  };

  const adjustedCalories = tdee + goalAdjustments[weightGoal];

  // Adjust for special conditions
  let finalCalories = adjustedCalories;
  if (healthInfo.pregnancyStatus) {
    finalCalories += 300; // Additional calories during pregnancy
  }
  if (healthInfo.breastfeeding) {
    finalCalories += 500; // Additional calories while breastfeeding
  }

  return Math.round(finalCalories);
};

const calculateWaterGoal = (user, temperature, activityLevel) => {
  if (!user) return 2500; // Default value in ml

  const { profile } = user;
  const { weight } = profile;

  // Base calculation: 30-35ml per kg of body weight
  let waterGoal = weight * 35;

  // Adjust for activity level
  const activityAdjustments = {
    sedentary: 0,
    'lightly active': 250,
    'moderately active': 500,
    'very active': 750,
    'extra active': 1000,
  };
  waterGoal += activityAdjustments[activityLevel] || 0;

  // Adjust for temperature (assuming temperature is in Celsius)
  if (temperature > 25) {
    const tempAdjustment = (temperature - 25) * 50; // 50ml per degree above 25C
    waterGoal += Math.min(tempAdjustment, 1000); // Max 1000ml adjustment
  }

  // Adjust for special conditions
  if (user.healthInfo?.pregnancyStatus) {
    waterGoal += 300;
  }
  if (user.healthInfo?.breastfeeding) {
    waterGoal += 700;
  }
  if (user.healthInfo?.menstrualCycle?.isTracking) {
    // During period, increase water intake
    waterGoal += 200;
  }

  return Math.round(waterGoal);
};

const calculateBMICategory = (weight, height) => {
  if (!weight || !height) return { bmi: 0, category: 'Unknown' };

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  let category;
  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi < 25) {
    category = 'Normal weight';
  } else if (bmi < 30) {
    category = 'Overweight';
  } else {
    category = 'Obese';
  }

  return { bmi: bmi.toFixed(1), category };
};

const getNutritionStatus = (intake, goal) => {
  const percentage = (intake / goal) * 100;
  
  if (percentage < 75) {
    return { status: 'under', message: 'You need to eat more', color: 'red' };
  } else if (percentage > 125) {
    return { status: 'over', message: 'You have exceeded your limit', color: 'red' };
  } else if (percentage > 100) {
    return { status: 'good', message: 'You are on track', color: 'yellow' };
  } else {
    return { status: 'good', message: 'You are on track', color: 'green' };
  }
};

// Health Data Provider Component
export const HealthDataProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, preferences } = useSelector((state) => state.user);
  const { foodLogs, dailySummary } = useSelector((state) => state.food);
  const { activityLogs, stepData } = useSelector((state) => state.activity);
  const { waterData } = useSelector((state) => state.water);
  const { healthMetrics } = useSelector((state) => state.health);

  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2000);
  const [dailyWaterGoal, setDailyWaterGoal] = useState(2500);
  const [nutritionStatus, setNutritionStatus] = useState(null);
  const [bmiData, setBmiData] = useState({ bmi: 0, category: 'Unknown' });
  const [isLoading, setIsLoading] = useState(true);
  const [temperature, setTemperature] = useState(25); // Default temperature in Celsius

  // Calculate daily goals
  useEffect(() => {
    if (user) {
      const calorieGoal = calculateDailyCalorieNeeds(user);
      const waterGoal = calculateWaterGoal(user, temperature, preferences.activityLevel);
      
      setDailyCalorieGoal(calorieGoal);
      setDailyWaterGoal(waterGoal);
      
      // Calculate BMI
      if (user.profile?.weight && user.profile?.height) {
        setBmiData(calculateBMICategory(user.profile.weight, user.profile.height));
      }
    }
  }, [user, temperature, preferences.activityLevel]);

  // Update nutrition status
  useEffect(() => {
    if (dailySummary.calories > 0 && dailyCalorieGoal > 0) {
      setNutritionStatus(getNutritionStatus(dailySummary.calories, dailyCalorieGoal));
    }
  }, [dailySummary.calories, dailyCalorieGoal]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Load food summary
        await dispatch(getFoodSummary({ period: 'daily' }));
        
        // Load activity summary
        await dispatch(getActivityLogs({ period: 'daily' }));
        
        // Load water data
        await dispatch(getWaterData({ period: 'daily' }));
        
        // Load health metrics
        await dispatch(getHealthMetrics({ period: 'recent' }));
        
        // Load Nigerian food recommendations
        if (user) {
          await dispatch(
            getNigerianFoodRecommendations({
              userId: user.id,
              preferences: user.preferences,
              healthInfo: user.healthInfo,
            })
          );
        }
      } catch (error) {
        console.error('Error loading health data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [dispatch, user]);

  // Check calorie limit and notify
  const checkCalorieLimit = () => {
    if (dailySummary.calories > dailyCalorieGoal * 1.1) {
      return {
        alert: true,
        message: `You have exceeded your daily calorie limit by ${Math.round(
          dailySummary.calories - dailyCalorieGoal
        )} calories`,
        type: 'over',
      };
    } else if (dailySummary.calories < dailyCalorieGoal * 0.75) {
      return {
        alert: true,
        message: `You are under your daily calorie goal by ${Math.round(
          dailyCalorieGoal - dailySummary.calories
        )} calories`,
        type: 'under',
      };
    }
    return { alert: false };
  };

  // Check water intake and notify
  const checkWaterIntake = () => {
    const totalWater = waterData?.totalIntake || 0;
    const percentage = (totalWater / dailyWaterGoal) * 100;

    if (percentage < 25) {
      return {
        alert: true,
        message: `You have only consumed ${Math.round(percentage)}% of your daily water goal`,
        type: 'reminder',
      };
    }
    return { alert: false };
  };

  // Get progress towards goals
  const getProgress = () => {
    return {
      calories: {
        consumed: dailySummary.calories,
        goal: dailyCalorieGoal,
        percentage: Math.min((dailySummary.calories / dailyCalorieGoal) * 100, 100),
      },
      water: {
        consumed: waterData?.totalIntake || 0,
        goal: dailyWaterGoal,
        percentage: Math.min(((waterData?.totalIntake || 0) / dailyWaterGoal) * 100, 100),
      },
      steps: {
        taken: stepData?.steps || 0,
        goal: 10000, // Default step goal
        percentage: Math.min(((stepData?.steps || 0) / 10000) * 100, 100),
      },
    };
  };

  // Get weight trend
  const getWeightTrend = () => {
    if (healthMetrics.length < 2) return { trend: 'stable', change: 0 };

    const sortedMetrics = [...healthMetrics].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const latest = sortedMetrics[0];
    const previous = sortedMetrics[1];

    if (!latest || !previous) return { trend: 'stable', change: 0 };

    const change = latest.weight - previous.weight;
    const trend = change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable';

    return { trend, change };
  };

  const value = {
    // Data
    user,
    preferences,
    foodLogs,
    dailySummary,
    activityLogs,
    stepData,
    waterData,
    healthMetrics,
    
    // Calculated values
    dailyCalorieGoal,
    dailyWaterGoal,
    nutritionStatus,
    bmiData,
    temperature,
    
    // States
    isLoading,
    
    // Functions
    setTemperature,
    checkCalorieLimit,
    checkWaterIntake,
    getProgress,
    getWeightTrend,
    calculateDailyCalorieNeeds,
    calculateWaterGoal,
    calculateBMICategory,
    getNutritionStatus,
    
    // Refresh functions
    refreshFoodData: () => dispatch(getFoodSummary({ period: 'daily' })),
    refreshActivityData: () => dispatch(getActivityLogs({ period: 'daily' })),
    refreshWaterData: () => dispatch(getWaterData({ period: 'daily' })),
    refreshHealthData: () => dispatch(getHealthMetrics({ period: 'recent' })),
    refreshRecommendations: () => {
      if (user) {
        dispatch(
          getNigerianFoodRecommendations({
            userId: user.id,
            preferences: user.preferences,
            healthInfo: user.healthInfo,
          })
        );
      }
    },
  };

  return (
    <HealthDataContext.Provider value={value}>
      {children}
    </HealthDataContext.Provider>
  );
};

// Custom hook to use Health Data Context
export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};

export default HealthDataContext;