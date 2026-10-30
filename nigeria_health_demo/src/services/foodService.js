// Food Service
// Handles all food-related API calls and local operations

import axios from 'axios';
import { Platform } from 'react-native';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-api-url.com/api';

// Nigerian food database (local fallback)
const NIGERIAN_FOODS = [
  {
    id: 'jollof-rice',
    name: 'Jollof Rice',
    alternativeNames: ['Jollof', 'Party Jollof'],
    category: 'Rice Dishes',
    region: 'All',
    description: 'A popular West African one-pot rice dish cooked with tomatoes, peppers, onions, and spices.',
    ingredients: ['Rice', 'Tomatoes', 'Red Bell Peppers', 'Onions', 'Tomato Paste', 'Vegetable Oil', 'Chicken Stock', 'Thyme', 'Curry Powder', 'Bay Leaves'],
    nutritionPer100g: {
      calories: 350,
      protein: 8.5,
      carbohydrates: 65,
      sugar: 3,
      fat: 5.2,
      saturatedFat: 1.2,
      fiber: 2.5,
      sodium: 250,
      vitamins: {
        vitaminA: 500,
        vitaminC: 15,
        vitaminD: 0,
      },
      minerals: {
        calcium: 40,
        iron: 2.5,
        potassium: 200,
      },
    },
    portionSizes: [
      { name: '1 cup', weight: 200, description: 'Standard serving cup' },
      { name: '1 plate', weight: 300, description: 'Medium plate serving' },
      { name: '1 large plate', weight: 400, description: 'Large plate serving' },
    ],
    cookingMethod: 'Boiled',
    preparationTime: 60,
    difficulty: 'medium',
    isPopular: true,
    tags: ['lunch', 'dinner', 'party', 'popular'],
    imageUrl: null,
  },
  {
    id: 'eba-egusi',
    name: 'Eba with Egusi Soup',
    alternativeNames: ['Gari with Egusi', 'Eba and Egusi'],
    category: 'Swallow Foods',
    region: 'All',
    description: 'Eba (fermented cassava) served with Egusi (melon seed) soup.',
    ingredients: ['Gari', 'Melon Seeds', 'Leafy Vegetables', 'Palm Oil', 'Fish', 'Meat', 'Crayfish', 'Locust Beans', 'Stock Cubes'],
    nutritionPer100g: {
      calories: 450,
      protein: 12,
      carbohydrates: 70,
      sugar: 2,
      fat: 10,
      saturatedFat: 4,
      fiber: 5,
      sodium: 300,
      vitamins: {
        vitaminA: 800,
        vitaminC: 20,
        vitaminD: 10,
      },
      minerals: {
        calcium: 120,
        iron: 4,
        potassium: 350,
      },
    },
    portionSizes: [
      { name: '1 wrap', weight: 250, description: 'Standard wrap of eba' },
      { name: '2 wraps', weight: 500, description: 'Two wraps of eba' },
      { name: '1 bowl', weight: 300, description: 'Bowl of eba with soup' },
    ],
    cookingMethod: 'Boiled',
    preparationTime: 45,
    difficulty: 'medium',
    isPopular: true,
    tags: ['lunch', 'dinner', 'traditional', 'popular'],
    imageUrl: null,
  },
  {
    id: 'amala-ewedu',
    name: 'Amala with Ewedu Soup',
    alternativeNames: ['Yam Amala with Ewedu', 'Black Amala'],
    category: 'Swallow Foods',
    region: 'Yoruba',
    description: 'Dark-colored swallow made from yam or cassava flour, served with slimy Ewedu (jute leaves) soup.',
    ingredients: ['Yam Flour', 'Jute Leaves', 'Locust Beans', 'Palm Oil', 'Meat', 'Fish', 'Crayfish'],
    nutritionPer100g: {
      calories: 400,
      protein: 10,
      carbohydrates: 75,
      sugar: 1,
      fat: 6,
      saturatedFat: 2,
      fiber: 6,
      sodium: 200,
      vitamins: {
        vitaminA: 1000,
        vitaminC: 25,
        vitaminK: 50,
      },
      minerals: {
        calcium: 150,
        iron: 5,
        potassium: 400,
      },
    },
    portionSizes: [
      { name: '1 wrap', weight: 250, description: 'Standard wrap of amala' },
      { name: '2 wraps', weight: 500, description: 'Two wraps of amala' },
    ],
    cookingMethod: 'Boiled',
    preparationTime: 60,
    difficulty: 'medium',
    isPopular: true,
    tags: ['lunch', 'dinner', 'yoruba', 'traditional'],
    imageUrl: null,
  },
  {
    id: 'puff-puff',
    name: 'Puff Puff',
    alternativeNames: ['Puffpuff', 'African Donut'],
    category: 'Snacks',
    region: 'All',
    description: 'Deep-fried dough balls, similar to donuts but without a hole.',
    ingredients: ['Flour', 'Sugar', 'Yeast', 'Vegetable Oil', 'Nutmeg', 'Salt'],
    nutritionPer100g: {
      calories: 180,
      protein: 3,
      carbohydrates: 25,
      sugar: 10,
      fat: 8,
      saturatedFat: 1.5,
      fiber: 1,
      sodium: 150,
      vitamins: {
        vitaminA: 0,
        vitaminC: 0,
        vitaminB1: 0.1,
      },
      minerals: {
        calcium: 20,
        iron: 1,
        potassium: 50,
      },
    },
    portionSizes: [
      { name: '1 piece', weight: 50, description: 'Single puff puff' },
      { name: '5 pieces', weight: 250, description: 'Standard serving' },
      { name: '10 pieces', weight: 500, description: 'Large serving' },
    ],
    cookingMethod: 'Deep Fried',
    preparationTime: 30,
    difficulty: 'easy',
    isPopular: true,
    tags: ['snack', 'dessert', 'street food', 'popular'],
    imageUrl: null,
  },
  {
    id: 'zobo',
    name: 'Zobo Drink',
    alternativeNames: ['Hibiscus Tea', 'Sobo'],
    category: 'Drinks',
    region: 'All',
    description: 'A refreshing drink made from dried hibiscus leaves, rich in vitamin C.',
    ingredients: ['Dried Hibiscus Leaves', 'Ginger', 'Garlic', 'Pineapple', 'Sugar'],
    nutritionPer100g: {
      calories: 50,
      protein: 0.5,
      carbohydrates: 12,
      sugar: 10,
      fat: 0,
      saturatedFat: 0,
      fiber: 0.5,
      sodium: 10,
      vitamins: {
        vitaminC: 30,
        vitaminA: 100,
      },
      minerals: {
        calcium: 20,
        iron: 1.5,
        potassium: 100,
      },
    },
    portionSizes: [
      { name: '1 cup', weight: 250, description: 'Standard cup' },
      { name: '1 glass', weight: 300, description: 'Standard glass' },
      { name: '1 bottle', weight: 500, description: 'Plastic bottle' },
    ],
    cookingMethod: 'Brewed',
    preparationTime: 10,
    difficulty: 'easy',
    isPopular: true,
    tags: ['drink', 'refreshment', 'vitamin c', 'traditional'],
    imageUrl: null,
  },
];

// Food service object
const foodService = {
  // Get list of foods
  getFoods: async (params = {}) => {
    try {
      // In production, this would be an actual API call
      // const response = await axios.get(`${API_BASE_URL}/foods`, { params });
      // return response.data;

      // For demo purposes, return Nigerian foods
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let foods = [...NIGERIAN_FOODS];
      
      // Apply filters if provided
      if (params.category) {
        foods = foods.filter(food => food.category === params.category);
      }
      if (params.region) {
        foods = foods.filter(food => food.region === params.region);
      }
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        foods = foods.filter(food => 
          food.name.toLowerCase().includes(searchLower) ||
          food.alternativeNames.some(name => name.toLowerCase().includes(searchLower))
        );
      }
      
      return {
        success: true,
        foods,
        count: foods.length,
      };
    } catch (error) {
      console.error('Get foods error:', error);
      throw new Error('Failed to fetch foods');
    }
  },

  // Search foods
  searchFoods: async (query) => {
    try {
      // In production, this would be an actual API call
      // const response = await axios.get(`${API_BASE_URL}/foods/search`, { params: { q: query } });
      // return response.data;

      await new Promise(resolve => setTimeout(resolve, 500));
      
      const searchLower = query.toLowerCase();
      const results = NIGERIAN_FOODS.filter(food => 
        food.name.toLowerCase().includes(searchLower) ||
        food.alternativeNames.some(name => name.toLowerCase().includes(searchLower)) ||
        food.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchLower))
      );
      
      return {
        success: true,
        results,
        count: results.length,
      };
    } catch (error) {
      console.error('Search foods error:', error);
      throw new Error('Search failed');
    }
  },

  // Get food by ID
  getFoodById: async (foodId) => {
    try {
      // In production, this would be an actual API call
      // const response = await axios.get(`${API_BASE_URL}/foods/${foodId}`);
      // return response.data;

      await new Promise(resolve => setTimeout(resolve, 500));
      
      const food = NIGERIAN_FOODS.find(f => f.id === foodId);
      
      if (!food) {
        throw new Error('Food not found');
      }
      
      return {
        success: true,
        food,
      };
    } catch (error) {
      console.error('Get food by ID error:', error);
      throw new Error('Failed to get food details');
    }
  },

  // Scan food from image
  scanFood: async (imageData) => {
    try {
      // In production, this would call an AI service
      // const formData = new FormData();
      // formData.append('image', imageData);
      // const response = await axios.post(`${API_BASE_URL}/foods/scan`, formData);
      // return response.data;

      // For demo purposes, simulate food scanning
      console.log('Scanning food image...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return a random Nigerian food
      const randomFood = NIGERIAN_FOODS[Math.floor(Math.random() * NIGERIAN_FOODS.length)];
      
      return {
        success: true,
        food: randomFood,
        confidence: 0.85 + Math.random() * 0.15,
        message: 'Food scanned successfully',
      };
    } catch (error) {
      console.error('Scan food error:', error);
      throw new Error('Failed to scan food');
    }
  },

  // Scan barcode
  scanBarcode: async (barcode) => {
    try {
      // In production, this would call a barcode API
      // const response = await axios.get(`${API_BASE_URL}/foods/barcode/${barcode}`);
      // return response.data;

      console.log('Scanning barcode:', barcode);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, return a sample food or create a custom one
      const food = NIGERIAN_FOODS.find(f => f.id === barcode.toLowerCase()) || {
        id: barcode,
        name: 'Packaged Food',
        category: 'Packaged',
        nutritionPer100g: {
          calories: 200,
          protein: 5,
          carbohydrates: 30,
          fat: 8,
        },
        portionSizes: [{ name: '1 serving', weight: 100 }],
      };
      
      return {
        success: true,
        food,
        message: 'Barcode scanned successfully',
      };
    } catch (error) {
      console.error('Scan barcode error:', error);
      throw new Error('Failed to scan barcode');
    }
  },

  // Add custom food
  addCustomFood: async (foodData) => {
    try {
      // In production, this would be an actual API call
      // const response = await axios.post(`${API_BASE_URL}/foods`, foodData);
      // return response.data;

      console.log('Adding custom food:', foodData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newFood = {
        id: `custom-${Date.now()}`,
        ...foodData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      return {
        success: true,
        food: newFood,
        message: 'Custom food added successfully',
      };
    } catch (error) {
      console.error('Add custom food error:', error);
      throw new Error('Failed to add custom food');
    }
  },

  // Log food intake
  logFoodIntake: async (logData) => {
    try {
      // In production, this would be an actual API call
      // const response = await axios.post(`${API_BASE_URL}/food-logs`, logData);
      // return response.data;

      console.log('Logging food intake:', logData);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newLog = {
        id: `log-${Date.now()}`,
        ...logData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      return {
        success: true,
        log: newLog,
        message: 'Food logged successfully',
      };
    } catch (error) {
      console.error('Log food intake error:', error);
      throw new Error('Failed to log food intake');
    }
  },

  // Get food logs
  getFoodLogs: async (params = {}) => {
    try {
      // In production, this would be an actual API call
      // const response = await axios.get(`${API_BASE_URL}/food-logs`, { params });
      // return response.data;

      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, return sample logs
      const sampleLogs = [
        {
          id: 'log-1',
          userId: 'demo-user-1',
          date: new Date(),
          mealType: 'breakfast',
          items: [
            {
              foodId: 'jollof-rice',
              amount: 1,
              unit: 'plate',
              calories: 350,
              protein: 8.5,
              carbohydrates: 65,
              fat: 5.2,
            },
          ],
          totalCalories: 350,
          totalProtein: 8.5,
          totalCarbohydrates: 65,
          totalFat: 5.2,
          createdAt: new Date(),
        },
        {
          id: 'log-2',
          userId: 'demo-user-1',
          date: new Date(),
          mealType: 'lunch',
          items: [
            {
              foodId: 'eba-egusi',
              amount: 2,
              unit: 'wrap',
              calories: 450 * 2,
              protein: 12 * 2,
              carbohydrates: 70 * 2,
              fat: 10 * 2,
            },
          ],
          totalCalories: 900,
          totalProtein: 24,
          totalCarbohydrates: 140,
          totalFat: 20,
          createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        },
      ];
      
      return {
        success: true,
        logs: sampleLogs,
        count: sampleLogs.length,
      };
    } catch (error) {
      console.error('Get food logs error:', error);
      throw new Error('Failed to get food logs');
    }
  },

  // Get food summary
  getFoodSummary: async (params = {}) => {
    try {
      // In production, this would be an actual API call
      // const response = await axios.get(`${API_BASE_URL}/food-logs/summary`, { params });
      // return response.data;

      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, return sample summary
      return {
        success: true,
        summary: {
          daily: {
            calories: 1250,
            protein: 32.5,
            carbohydrates: 205,
            fat: 25.2,
            count: 2,
          },
          weekly: {
            calories: 8750,
            protein: 227.5,
            carbohydrates: 1435,
            fat: 176.4,
            count: 14,
          },
        },
      };
    } catch (error) {
      console.error('Get food summary error:', error);
      throw new Error('Failed to get food summary');
    }
  },

  // Get Nigerian food recommendations
  getNigerianFoodRecommendations: async (params = {}) => {
    try {
      // In production, this would be an actual API call
      // const response = await axios.get(`${API_BASE_URL}/recommendations/food`, { params });
      // return response.data;

      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, return popular Nigerian foods
      const recommendations = NIGERIAN_FOODS
        .filter(food => food.isPopular)
        .slice(0, 5)
        .map(food => ({
          ...food,
          recommendationReason: `Based on your ${params.preferences?.weightGoal || 'maintenance'} goal`,
        }));
      
      return {
        success: true,
        recommendations,
        count: recommendations.length,
      };
    } catch (error) {
      console.error('Get recommendations error:', error);
      throw new Error('Failed to get recommendations');
    }
  },
};

export default foodService;
