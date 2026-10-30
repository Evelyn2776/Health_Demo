# Nigerian Health & Fitness App - System Architecture

## Overview
This document outlines the technical architecture for the Nigerian Health & Fitness application, designed to provide comprehensive health tracking with Nigerian-specific features.

---

## 1. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                │
│  ┌─────────────────────┐  ┌─────────────────────┐                  │
│  │   Mobile App         │  │   Web App           │                  │
│  │  (React Native)      │  │  (React.js)         │                  │
│  └──────────┬───────────┘  └──────────┬───────────┘                  │
│             │                              │                              │
│             └──────────────┬──────────────────────┘                  │
│                          │ (API Calls)                             │
└──────────────────────────┼──────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                 │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  RESTful API (Node.js/Express) or Firebase Functions              ││
│  │  - Authentication Middleware                                       ││
│  │  - Request Validation                                               ││
│  │  - Rate Limiting                                                    ││
│  │  - CORS Handling                                                    ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           SERVICE LAYER                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │  User Service │  │ Food Service  │  │ Activity      │               │
│  │               │  │               │  │ Service       │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │Water Service  │  │Recommendation│  │ Analytics     │               │
│  │               │  │Service        │  │ Service       │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│  ┌──────────────┐  ┌──────────────┐                                  │
│  │ Weather       │  │ AI/ML Service  │                                  │
│  │ Integration   │  │ (Food         │                                  │
│  │               │  │ Recognition,  │                                  │
│  └──────────────┘  │ Predictions)  │                                  │
│                     └──────────────┘                                  │
└─────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                     │
│  ┌──────────────────────┐  ┌──────────────────────┐                │
│  │   Primary Database    │  │   Secondary Database   │                │
│  │   (Firestore/MongoDB) │  │   (Cache/Redis)        │                │
│  │   - User Data         │  │   - Frequently Accessed│                │
│  │   - Food Database     │  │    Data               │                │
│  │   - Activity Logs     │  │   - Session Data       │                │
│  │   - Health Metrics    │  │                       │                │
│  └──────────────────────┘  └──────────────────────┘                │
│  ┌──────────────────────┐                                            │
│  │   File Storage        │                                            │
│  │   (Firebase Storage/  │                                            │
│  │    AWS S3)            │                                            │
│  │   - User Photos       │                                            │
│  │   - Food Images       │                                            │
│  │   - Body Progress     │                                            │
│  └──────────────────────┘                                            │
└─────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │ Weather API   │  │ Nutrition API │  │ Authentication│               │
│  │ (OpenWeather, │  │ (USDA, etc.)  │  │ (Firebase     │               │
│  │  etc.)        │  │               │  │  Auth, JWT)    │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│  ┌──────────────┐  ┌──────────────┐                                  │
│  │ Barcode API   │  │ Payment       │                                  │
│  │               │  │ Gateway       │                                  │
│  └──────────────┘  └──────────────┘                                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Frontend (Mobile)
- **Framework**: React Native (Expo for easier development)
- **State Management**: Redux Toolkit or Zustand
- **Navigation**: React Navigation
- **UI Components**: NativeBase or custom components
- **Styling**: Styled Components or Tailwind CSS
- **Forms**: React Hook Form
- **Charts**: React Native Chart Kit or Victory
- **Camera**: React Native Camera or Expo Camera
- **Barcode Scanner**: React Native Barcode Scanner
- **Step Counter**: React Native Pedometer

### 2.2 Frontend (Web)
- **Framework**: React.js (Next.js for SSR)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS or Material UI
- **Forms**: React Hook Form
- **Charts**: Chart.js or Recharts

### 2.3 Backend
- **Runtime**: Node.js
- **Framework**: Express.js or NestJS
- **Authentication**: Firebase Auth or JWT with Passport.js
- **Validation**: Joi or Zod
- **File Upload**: Multer
- **API Documentation**: Swagger/OpenAPI

### 2.4 Database
- **Primary**: Firebase Firestore (for real-time sync and offline support)
  - OR MongoDB (if more control is needed)
- **Cache**: Redis
- **Search**: Algolia or Elasticsearch (for food search)

### 2.5 AI/ML Services
- **Computer Vision**: TensorFlow.js or Python-based backend
- **NLP**: Natural library or custom models
- **Predictive Analytics**: Python with scikit-learn

### 2.6 DevOps & Infrastructure
- **Hosting**: Vercel (frontend), Firebase Hosting, or AWS
- **Backend Hosting**: Firebase Functions, AWS Lambda, or Heroku
- **CI/CD**: GitHub Actions or GitLab CI
- **Monitoring**: Firebase Performance Monitoring or Sentry
- **Analytics**: Firebase Analytics or Mixpanel

---

## 3. Database Schema

### 3.1 Collections/Tables

#### Users Collection
```javascript
{
  uid: String, // Firebase Auth UID
  email: String,
  passwordHash: String, // Only if not using Firebase Auth
  profile: {
    firstName: String,
    lastName: String,
    gender: String, // 'male', 'female', 'other'
    dateOfBirth: Date,
    height: Number, // in cm
    currentWeight: Number, // in kg
    targetWeight: Number, // in kg
    bodyFatPercentage: Number, // optional
    bodyMeasurements: {
      neck: Number, // cm
      waist: Number, // cm
      hips: Number, // cm
      arms: Number, // cm
      thighs: Number // cm
    },
    profilePicture: String, // URL
    bodyPhotos: [{
      url: String,
      date: Date,
      notes: String
    }]
  },
  healthInfo: {
    bloodType: String,
    allergies: [String],
    medicalConditions: [String],
    medications: [{
      name: String,
      dosage: String,
      frequency: String
    }],
    menstrualCycle: {
      isTracking: Boolean,
      lastPeriodDate: Date,
      cycleLength: Number, // days
      periodLength: Number // days
    },
    pregnancyStatus: Boolean,
    breastfeeding: Boolean
  },
  preferences: {
    activityLevel: String, // 'sedentary', 'lightly active', 'moderately active', 'very active'
    weightGoal: String, // 'lose', 'maintain', 'gain'
    dietaryRestrictions: [String],
    preferredCuisine: [String], // e.g., ['yoruba', 'igbo', 'hausa']
    unitSystem: String, // 'metric', 'imperial'
    theme: String, // 'light', 'dark', 'auto'
    notificationSettings: {
      calorieAlerts: Boolean,
      waterReminders: Boolean,
      activityReminders: Boolean,
      dailySummary: Boolean,
      weeklyReport: Boolean
    }
  },
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

#### Food Database Collection
```javascript
{
  id: String,
  name: String,
  alternativeNames: [String],
  category: String, // 'swallow', 'soup', 'rice', 'protein', 'snack', 'drink', etc.
  region: String, // 'north', 'south', 'east', 'west' or specific states
  description: String,
  ingredients: [{
    name: String,
    amount: Number,
    unit: String
  }],
  nutritionPer100g: {
    calories: Number,
    protein: Number, // g
    carbohydrates: Number, // g
    sugar: Number, // g
    fat: Number, // g
    saturatedFat: Number, // g
    fiber: Number, // g
    sodium: Number, // mg
    vitamins: {
      vitaminA: Number, // IU
      vitaminC: Number, // mg
      vitaminD: Number, // IU
      // etc.
    },
    minerals: {
      calcium: Number, // mg
      iron: Number, // mg
      potassium: Number, // mg
      // etc.
    }
  },
  portionSizes: [{
    name: String, // e.g., '1 cup', '1 plate', '1 wrap'
    weight: Number, // grams
    description: String
  }],
  cookingMethod: String,
  preparationTime: Number, // minutes
  difficulty: String, // 'easy', 'medium', 'hard'
  isPopular: Boolean,
  tags: [String],
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### User Food Log Collection
```javascript
{
  id: String,
  userId: String,
  date: Date,
  mealType: String, // 'breakfast', 'lunch', 'dinner', 'snack'
  items: [{
    foodId: String, // reference to Food Database
    customFood: { // if custom food
      name: String,
      nutrition: Object // similar to food database
    },
    amount: Number,
    unit: String, // 'g', 'kg', 'cup', 'plate', 'wrap', etc.
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fat: Number,
    notes: String,
    imageUrl: String, // if scanned
    scannedAt: Date
  }],
  totalCalories: Number,
  totalProtein: Number,
  totalCarbohydrates: Number,
  totalFat: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Activity Database Collection
```javascript
{
  id: String,
  name: String,
  alternativeNames: [String],
  category: String, // 'cardio', 'strength', 'flexibility', 'nigerian traditional'
  description: String,
  caloriesPerMinute: Number, // base value
  metValue: Number, // Metabolic Equivalent
  intensity: String, // 'low', 'moderate', 'high'
  equipmentNeeded: [String],
  musclesWorked: [String],
  instructions: String,
  videoUrl: String,
  imageUrl: String,
  tags: [String]
}
```

#### User Activity Log Collection
```javascript
{
  id: String,
  userId: String,
  date: Date,
  activityId: String, // reference to Activity Database
  customActivity: { // if custom activity
    name: String,
    caloriesPerMinute: Number
  },
  duration: Number, // minutes
  intensity: String, // 'low', 'moderate', 'high'
  caloriesBurned: Number,
  distance: Number, // km (if applicable)
  steps: Number, // for walking/running
  notes: String,
  gpsData: { // optional
    path: [{
      lat: Number,
      lng: Number,
      timestamp: Date
    }],
    mapImage: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Step Tracking Collection
```javascript
{
  id: String,
  userId: String,
  date: Date,
  steps: Number,
  distance: Number, // km
  caloriesBurned: Number,
  activeMinutes: Number,
  hourlyData: [{
    hour: Number, // 0-23
    steps: Number
  }],
  createdAt: Date
}
```

#### Water Intake Collection
```javascript
{
  id: String,
  userId: String,
  date: Date,
  totalIntake: Number, // ml
  goal: Number, // ml
  entries: [{
    amount: Number, // ml
    time: Date,
    notes: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### Health Metrics Collection
```javascript
{
  id: String,
  userId: String,
  date: Date,
  weight: Number, // kg
  bodyFatPercentage: Number,
  bodyMeasurements: {
    neck: Number,
    waist: Number,
    hips: Number,
    arms: Number,
    thighs: Number
  },
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  heartRate: Number,
  notes: String,
  createdAt: Date
}
```

#### Recommendations Collection
```javascript
{
  id: String,
  userId: String,
  type: String, // 'food', 'exercise', 'meal_plan', 'workout_plan'
  title: String,
  description: String,
  items: [Object], // varies by type
  generatedAt: Date,
  expiresAt: Date,
  isRead: Boolean,
  rating: Number // user rating (1-5)
}
```

#### Notifications Collection
```javascript
{
  id: String,
  userId: String,
  title: String,
  message: String,
  type: String, // 'calorie_alert', 'water_reminder', 'activity_reminder', 'daily_summary'
  data: Object, // additional data for the notification
  isRead: Boolean,
  scheduledAt: Date,
  deliveredAt: Date,
  createdAt: Date
}
```

---

## 4. API Endpoints

### 4.1 Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/verify-otp` - OTP verification
- `GET /api/auth/me` - Get current user

### 4.2 Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/preferences` - Update user preferences
- `PUT /api/users/:id/health-info` - Update health information
- `POST /api/users/:id/body-photos` - Upload body photo
- `GET /api/users/:id/body-photos` - Get body photos
- `DELETE /api/users/:id/body-photos/:photoId` - Delete body photo

### 4.3 Food
- `GET /api/foods` - List foods (with filters)
- `GET /api/foods/search` - Search foods
- `GET /api/foods/:id` - Get food details
- `POST /api/foods` - Create custom food (admin/user)
- `PUT /api/foods/:id` - Update food
- `DELETE /api/foods/:id` - Delete food
- `POST /api/foods/scan` - Scan food from image
- `POST /api/foods/barcode` - Get food by barcode
- `POST /api/foods/analyze` - Analyze food from image

### 4.4 Food Log
- `GET /api/food-logs` - Get user's food logs
- `GET /api/food-logs/:id` - Get food log details
- `POST /api/food-logs` - Create food log entry
- `PUT /api/food-logs/:id` - Update food log entry
- `DELETE /api/food-logs/:id` - Delete food log entry
- `GET /api/food-logs/summary` - Get food summary (daily/weekly/monthly)

### 4.5 Activities
- `GET /api/activities` - List activities
- `GET /api/activities/search` - Search activities
- `GET /api/activities/:id` - Get activity details
- `POST /api/activities` - Create custom activity (admin)
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### 4.6 Activity Log
- `GET /api/activity-logs` - Get user's activity logs
- `GET /api/activity-logs/:id` - Get activity log details
- `POST /api/activity-logs` - Create activity log entry
- `PUT /api/activity-logs/:id` - Update activity log entry
- `DELETE /api/activity-logs/:id` - Delete activity log entry
- `GET /api/activity-logs/summary` - Get activity summary

### 4.7 Steps
- `GET /api/steps` - Get step data
- `GET /api/steps/:date` - Get steps for specific date
- `POST /api/steps` - Log steps (manual or automatic)
- `GET /api/steps/summary` - Get step summary

### 4.8 Water
- `GET /api/water` - Get water intake data
- `GET /api/water/:date` - Get water intake for specific date
- `POST /api/water` - Log water intake
- `PUT /api/water/:id` - Update water intake entry
- `DELETE /api/water/:id` - Delete water intake entry
- `GET /api/water/summary` - Get water intake summary
- `POST /api/water/reminder` - Set water reminder

### 4.9 Health Metrics
- `GET /api/health-metrics` - Get health metrics
- `GET /api/health-metrics/:date` - Get health metrics for specific date
- `POST /api/health-metrics` - Log health metrics
- `PUT /api/health-metrics/:id` - Update health metrics
- `DELETE /api/health-metrics/:id` - Delete health metrics
- `GET /api/health-metrics/trends` - Get health trends
- `GET /api/health-metrics/predictions` - Get weight predictions

### 4.10 Recommendations
- `GET /api/recommendations` - Get recommendations
- `GET /api/recommendations/food` - Get food recommendations
- `GET /api/recommendations/exercise` - Get exercise recommendations
- `GET /api/recommendations/meal-plan` - Get meal plan
- `GET /api/recommendations/workout-plan` - Get workout plan
- `POST /api/recommendations/rate` - Rate a recommendation

### 4.11 Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `POST /api/notifications/test` - Test notification (debug)

### 4.12 Weather
- `GET /api/weather` - Get current weather for user's location
- `GET /api/weather/:location` - Get weather for specific location

### 4.13 Analytics
- `GET /api/analytics/daily` - Daily analytics
- `GET /api/analytics/weekly` - Weekly analytics
- `GET /api/analytics/monthly` - Monthly analytics
- `GET /api/analytics/export` - Export analytics data

---

## 5. Security Architecture

### 5.1 Authentication Flow
1. User registers with email/password or social login
2. JWT token is generated and returned
3. Token is stored securely on the device
4. Token is sent with each API request in the Authorization header
5. Server validates token on each request
6. Token expires after a set time (e.g., 1 hour)
7. Refresh token can be used to get a new access token

### 5.2 Data Protection
- All sensitive data encrypted at rest
- HTTPS for all communications
- Input validation on all API endpoints
- Rate limiting to prevent abuse
- CORS configured to only allow trusted domains

### 5.3 Authorization
- Role-based access control (User, Admin)
- User can only access their own data
- Admin can access all data (for support)

---

## 6. AI/ML Architecture

### 6.1 Food Recognition
```
Input: Food Image
    ↓
Preprocessing: Resize, normalize
    ↓
Feature Extraction: CNN (MobileNet, EfficientNet)
    ↓
Classification: Identify food type
    ↓
Portion Estimation: Estimate serving size
    ↓
Ingredient Analysis: Predict ingredients
    ↓
Nutrition Calculation: Calculate nutritional values
    ↓
Output: Food identification with nutrition info
```

### 6.2 Calorie Prediction
```
Input: User data (weight, height, age, gender, activity level, goals)
    ↓
BMR Calculation: Mifflin-St Jeor Equation
    ↓
TDEE Calculation: BMR × Activity Multiplier
    ↓
Adjust for Goals: Add/subtract calories based on weight goal
    ↓
Adjust for Climate: Modify based on temperature
    ↓
Adjust for Special Conditions: Menstruation, medication, etc.
    ↓
Output: Personalized daily calorie target
```

### 6.3 Water Intake Calculation
```
Input: User data (weight, activity level, location)
    ↓
Base Calculation: Weight × 30-35 ml/kg
    ↓
Activity Adjustment: +500ml per hour of exercise
    ↓
Climate Adjustment: +200-500ml based on temperature
    ↓
Special Conditions: Adjust for menstruation, pregnancy, etc.
    ↓
Output: Personalized daily water goal
```

### 6.4 Weight Prediction
```
Input: Historical data (calorie intake, calories burned, water intake, weight)
    ↓
Trend Analysis: Calculate daily/weekly averages
    ↓
Model Training: Linear regression or time series forecasting
    ↓
Prediction: Forecast weight for future dates
    ↓
Output: Predicted weight trajectory
```

---

## 7. Performance Optimization

### 7.1 Caching Strategy
- **Client-side**: Cache food database, activity database locally
- **Server-side**: Redis cache for frequent queries
- **CDN**: Serve static assets (images, videos) via CDN

### 7.2 Data Synchronization
- **Offline-first**: Store data locally and sync when online
- **Conflict Resolution**: Timestamp-based or manual resolution
- **Delta Sync**: Only sync changed data

### 7.3 Image Optimization
- Compress images before upload
- Serve appropriately sized images based on device
- Use WebP format where supported

---

## 8. Deployment Architecture

### 8.1 Development Environment
- Local development with hot reloading
- Docker containers for backend services
- Emulators for Firebase services

### 8.2 Staging Environment
- Mirror of production for testing
- Automated deployment from main branch
- Used for QA and client demos

### 8.3 Production Environment
- Scalable cloud infrastructure
- Auto-scaling based on load
- Multiple availability zones for redundancy
- Backup and disaster recovery procedures

---

## 9. Monitoring and Analytics

### 9.1 Monitoring
- Application performance monitoring
- Error tracking (Sentry)
- Uptime monitoring
- API response times

### 9.2 Analytics
- User engagement metrics
- Feature usage statistics
- Retention rates
- Conversion funnels
- Custom events for key actions

---

*Document Version: 1.0*
*Last Updated: October 27, 2026*
*Prepared for: Nigerian Health & Fitness App Project*
