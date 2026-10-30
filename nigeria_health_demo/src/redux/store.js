import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userReducer from './slices/userSlice';
import foodReducer from './slices/foodSlice';
import activityReducer from './slices/activitySlice';
import waterReducer from './slices/waterSlice';
import healthReducer from './slices/healthSlice';
import uiReducer from './slices/uiSlice';

// Persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'ui'], // Only persist user and ui state
  blacklist: ['food', 'activity', 'water', 'health'], // Don't persist large data
};

// Combine reducers
const rootReducer = {
  user: userReducer,
  food: foodReducer,
  activity: activityReducer,
  water: waterReducer,
  health: healthReducer,
  ui: uiReducer,
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // Ignore persist actions
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

export default store;
