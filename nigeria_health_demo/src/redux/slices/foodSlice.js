import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import foodService from '../../services/foodService';

// Async thunks for food operations

export const fetchFoods = createAsyncThunk(
  'food/fetchFoods',
  async (params, { rejectWithValue }) => {
    try {
      const response = await foodService.getFoods(params);
      return response.foods;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchFoods = createAsyncThunk(
  'food/searchFoods',
  async (query, { rejectWithValue }) => {
    try {
      const response = await foodService.searchFoods(query);
      return response.results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getFoodById = createAsyncThunk(
  'food/getFoodById',
  async (foodId, { rejectWithValue }) => {
    try {
      const response = await foodService.getFoodById(foodId);
      return response.food;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const scanFood = createAsyncThunk(
  'food/scanFood',
  async (imageData, { rejectWithValue }) => {
    try {
      const response = await foodService.scanFood(imageData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const scanBarcode = createAsyncThunk(
  'food/scanBarcode',
  async (barcode, { rejectWithValue }) => {
    try {
      const response = await foodService.scanBarcode(barcode);
      return response.food;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCustomFood = createAsyncThunk(
  'food/addCustomFood',
  async (foodData, { rejectWithValue }) => {
    try {
      const response = await foodService.addCustomFood(foodData);
      return response.food;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logFoodIntake = createAsyncThunk(
  'food/logFoodIntake',
  async (logData, { rejectWithValue }) => {
    try {
      const response = await foodService.logFoodIntake(logData);
      return response.log;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getFoodLogs = createAsyncThunk(
  'food/getFoodLogs',
  async (params, { rejectWithValue }) => {
    try {
      const response = await foodService.getFoodLogs(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getFoodSummary = createAsyncThunk(
  'food/getFoodSummary',
  async (params, { rejectWithValue }) => {
    try {
      const response = await foodService.getFoodSummary(params);
      return response.summary;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getNigerianFoodRecommendations = createAsyncThunk(
  'food/getNigerianFoodRecommendations',
  async (params, { rejectWithValue }) => {
    try {
      const response = await foodService.getNigerianFoodRecommendations(params);
      return response.recommendations;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  foods: [],
  searchedFoods: [],
  selectedFood: null,
  scannedFood: null,
  foodLogs: [],
  dailySummary: {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    count: 0,
  },
  weeklySummary: {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
  },
  recommendations: [],
  isLoading: false,
  error: null,
  // Nigerian food categories
  nigerianCategories: [
    'Swallow Foods',
    'Soups',
    'Rice Dishes',
    'Proteins',
    'Snacks',
    'Drinks',
    'Breakfast',
  ],
  // Popular Nigerian foods for quick access
  popularNigerianFoods: [
    { name: 'Jollof Rice', category: 'Rice Dishes' },
    { name: 'Eba with Egusi Soup', category: 'Swallow Foods' },
    { name: 'Amala with Ewedu', category: 'Swallow Foods' },
    { name: 'Pounded Yam with Vegetable Soup', category: 'Swallow Foods' },
    { name: 'Fried Rice', category: 'Rice Dishes' },
    { name: 'Moi Moi', category: 'Proteins' },
    { name: 'Beans Pudding', category: 'Proteins' },
    { name: 'Puff Puff', category: 'Snacks' },
    { name: 'Chin Chin', category: 'Snacks' },
    { name: 'Zobo Drink', category: 'Drinks' },
    { name: 'Kunu', category: 'Drinks' },
    { name: 'Akara', category: 'Breakfast' },
    { name: 'Pap (Ogi)', category: 'Breakfast' },
  ],
};

// Create slice
const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Clear scanned food
    clearScannedFood: (state) => {
      state.scannedFood = null;
    },
    // Add local food log (for offline mode)
    addLocalFoodLog: (state, action) => {
      state.foodLogs = [action.payload, ...state.foodLogs];
      // Update daily summary
      state.dailySummary.calories += action.payload.calories;
      state.dailySummary.protein += action.payload.protein;
      state.dailySummary.carbohydrates += action.payload.carbohydrates;
      state.dailySummary.fat += action.payload.fat;
      state.dailySummary.count += 1;
    },
    // Remove local food log
    removeLocalFoodLog: (state, action) => {
      const logId = action.payload;
      const logToRemove = state.foodLogs.find(log => log.id === logId);
      if (logToRemove) {
        state.foodLogs = state.foodLogs.filter(log => log.id !== logId);
        // Update daily summary
        state.dailySummary.calories -= logToRemove.calories;
        state.dailySummary.protein -= logToRemove.protein;
        state.dailySummary.carbohydrates -= logToRemove.carbohydrates;
        state.dailySummary.fat -= logToRemove.fat;
        state.dailySummary.count -= 1;
      }
    },
    // Reset daily summary
    resetDailySummary: (state) => {
      state.dailySummary = {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        count: 0,
      };
    },
    // Set daily calorie goal
    setDailyCalorieGoal: (state, action) => {
      state.dailyCalorieGoal = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch foods
    builder.addCase(fetchFoods.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchFoods.fulfilled, (state, action) => {
      state.foods = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchFoods.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch foods';
    });

    // Search foods
    builder.addCase(searchFoods.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(searchFoods.fulfilled, (state, action) => {
      state.searchedFoods = action.payload;
      state.isLoading = false;
    });
    builder.addCase(searchFoods.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Search failed';
    });

    // Get food by ID
    builder.addCase(getFoodById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFoodById.fulfilled, (state, action) => {
      state.selectedFood = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getFoodById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to get food';
    });

    // Scan food
    builder.addCase(scanFood.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(scanFood.fulfilled, (state, action) => {
      state.scannedFood = action.payload;
      state.isLoading = false;
    });
    builder.addCase(scanFood.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Scan failed';
    });

    // Scan barcode
    builder.addCase(scanBarcode.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(scanBarcode.fulfilled, (state, action) => {
      state.scannedFood = action.payload;
      state.isLoading = false;
    });
    builder.addCase(scanBarcode.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Barcode scan failed';
    });

    // Add custom food
    builder.addCase(addCustomFood.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addCustomFood.fulfilled, (state, action) => {
      state.foods = [action.payload, ...state.foods];
      state.isLoading = false;
    });
    builder.addCase(addCustomFood.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to add food';
    });

    // Log food intake
    builder.addCase(logFoodIntake.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logFoodIntake.fulfilled, (state, action) => {
      state.foodLogs = [action.payload, ...state.foodLogs];
      state.isLoading = false;
    });
    builder.addCase(logFoodIntake.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to log food';
    });

    // Get food logs
    builder.addCase(getFoodLogs.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFoodLogs.fulfilled, (state, action) => {
      state.foodLogs = action.payload.logs;
      state.isLoading = false;
    });
    builder.addCase(getFoodLogs.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to get food logs';
    });

    // Get food summary
    builder.addCase(getFoodSummary.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFoodSummary.fulfilled, (state, action) => {
      state.dailySummary = action.payload.daily;
      state.weeklySummary = action.payload.weekly;
      state.isLoading = false;
    });
    builder.addCase(getFoodSummary.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to get summary';
    });

    // Get Nigerian food recommendations
    builder.addCase(getNigerianFoodRecommendations.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getNigerianFoodRecommendations.fulfilled, (state, action) => {
      state.recommendations = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getNigerianFoodRecommendations.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to get recommendations';
    });
  },
});

// Export actions and reducer
export const {
  clearError,
  clearScannedFood,
  addLocalFoodLog,
  removeLocalFoodLog,
  resetDailySummary,
  setDailyCalorieGoal,
} = foodSlice.actions;

export default foodSlice.reducer;
