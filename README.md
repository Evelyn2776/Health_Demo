# Nigerian Health & Fitness App

## Overview

A comprehensive health and fitness application tailored specifically for Nigerian users. This app provides personalized health tracking, Nigerian food calorie calculation, activity monitoring, water intake tracking, and intelligent recommendations based on Nigerian cuisine, climate, and cultural considerations.

## Features

### 🍽️ Food & Nutrition Tracking
- **Nigerian Dish Database**: Pre-loaded with common Nigerian foods (Jollof Rice, Eba, Amala, Pounded Yam, etc.)
- **Calorie & Nutrient Calculation**: Accurate tracking of calories, protein, carbs, and fats
- **Multiple Input Methods**:
  - Manual entry with autocomplete
  - Food scanning using AI (camera-based)
  - Barcode scanning for packaged foods
  - Voice input
- **Portion Size Guides**: Nigerian-specific portion sizes (wraps, plates, cups, etc.)
- **AI-Powered Food Recognition**: Analyze food images to detect ingredients and estimate nutrition
- **Custom Food Creation**: Add your own Nigerian dishes to the database

### 🏃 Activity & Step Tracking
- **Automatic Step Counting**: Uses device sensors to track steps
- **Activity Logging**: Manual entry for various activities including:
  - Walking, Running, Cycling
  - Swimming, Gym workouts
  - Traditional Nigerian activities (farming, dancing, etc.)
- **Calorie Burn Calculation**: Automatic calculation based on activity type and duration
- **Exercise Database**: Pre-loaded with common exercises
- **GPS Tracking**: For outdoor activities (optional)

### 💧 Water Intake Management
- **Smart Water Goals**: Calculated based on:
  - Body weight
  - Activity level
  - Climate/temperature (adjusts for Nigerian weather)
  - Special conditions (menstruation, pregnancy, breastfeeding)
- **Intake Tracking**: Log water consumption throughout the day
- **Reminders**: Notifications to drink water at optimal times
- **Visualization**: Charts and progress tracking

### 📊 Personalized Health Metrics
- **Daily Calorie Needs**: Calculated using:
  - Mifflin-St Jeor BMR equation
  - Activity level multipliers
  - Weight goals (lose, maintain, gain)
  - Special conditions adjustments
- **Weight Management**:
  - Current and target weight tracking
  - Progress visualization
  - Predicted weight based on current trends
- **Body Composition**:
  - Photo-based body tracking
  - Body measurements (neck, waist, hips, arms, thighs)
  - Body fat estimation
- **BMI Calculation**: With Nigerian-specific interpretations

### 🎯 Smart Recommendations
- **Food Suggestions**:
  - Nigerian-specific meal plans
  - Based on calorie needs and health goals
  - Climate-adapted suggestions
  - Special condition considerations (menstruation, medication, pregnancy)
  - Dietary restriction support
- **Exercise Recommendations**:
  - Personalized workout plans
  - Based on fitness level and goals
  - Nigerian-friendly exercises
  - Time-based suggestions
- **Portion Guidance**: Visual guides for Nigerian food portions

### 🔔 Notifications & Alerts
- **Calorie Alerts**: Warnings when over or under daily limits
- **Water Reminders**: Regular reminders to stay hydrated
- **Activity Reminders**: Sedentary alerts and move suggestions
- **Progress Updates**: Weekly and monthly summaries

### 👤 User Profiles
- **Personal Information**: Age, gender, height, weight
- **Health Conditions**: Track allergies, medical conditions, medications
- **Special Conditions**:
  - Menstrual cycle tracking
  - Pregnancy status
  - Breastfeeding status
- **Lifestyle Factors**: Occupation, activity level, dietary preferences

### 📱 Mobile Features
- **Offline Mode**: Basic features work without internet connection
- **Data Sync**: Automatic synchronization when connection is restored
- **Barcode Scanner**: Quick food entry using product barcodes
- **Camera Integration**: For food scanning and body photos
- **Push Notifications**: For reminders and alerts

### 🎨 UI/UX Features
- **Color Scheme**: Balanced shades of green and purple
- **Theme Support**: Light mode, dark mode, and auto mode
- **Responsive Design**: Works on all mobile devices
- **Intuitive Navigation**: Easy-to-use interface

## Technology Stack

### Frontend (Mobile)
- **React Native** with Expo
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **UI Components**: NativeBase
- **Charts**: React Native Chart Kit, Victory Native
- **Camera**: Expo Camera, Barcode Scanner
- **Sensors**: Expo Sensors (for step counting)
- **Storage**: AsyncStorage for offline data

### Backend
- **Node.js** with Express
- **Authentication**: Firebase Auth or JWT
- **Database**: Firebase Firestore (primary) or MongoDB
- **AI/ML**: TensorFlow.js for food recognition
- **APIs**: Weather API for climate data

### AI/ML Features
- **Computer Vision**: Food recognition from images
- **NLP**: Food name parsing and ingredient detection
- **Predictive Analytics**: Weight prediction and calorie calculation

## Project Structure

```
nigerian-health-app/
├── docs/
│   ├── REQUIREMENTS.md        # Detailed requirements specification
│   └── ARCHITECTURE.md        # System architecture documentation
├── frontend/
│   ├── App.js                 # Main application entry point
│   ├── app.json               # Expo configuration
│   ├── package.json           # Dependencies
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── screens/           # Application screens
│       │   ├── auth/           # Authentication screens
│       │   ├── main/          # Main application screens
│       │   ├── food/          # Food-related screens
│       │   ├── activity/      # Activity-related screens
│       │   ├── water/         # Water-related screens
│       │   ├── health/        # Health-related screens
│       │   ├── recommendations/ # Recommendation screens
│       │   ├── history/       # History and analytics screens
│       │   └── settings/      # Settings screens
│       ├── navigation/        # Navigation configuration
│       ├── context/           # React context providers
│       ├── redux/            # Redux store and slices
│       ├── services/          # API service layers
│       ├── utils/             # Utility functions
│       ├── hooks/             # Custom React hooks
│       └── styles/            # Global styles and themes
├── backend/
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── controllers/          # Route controllers
│   └── server.js             # Server entry point
└── README.md                 # This file
```

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android/iOS device or emulator
- Firebase account (for backend services)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/nigerian-health-app.git
   cd nigerian-health-app
   ```

2. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Set up Firebase**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore Database, and Storage
   - Add your Firebase config to the app

4. **Configure the app**:
   - Update `app.json` with your app details
   - Configure API keys and endpoints

5. **Run the app**:
   ```bash
   expo start
   ```
   - Scan the QR code with Expo Go app on your device
   - Or run on Android/iOS emulator

### Backend Setup

1. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**:
   - Create a `.env` file with database connection strings
   - Configure API keys for external services

3. **Start the server**:
   ```bash
   npm start
   ```

## Nigerian-Specific Features

### Food Database
The app includes a comprehensive database of Nigerian foods with accurate nutritional information:

- **Swallow Foods**: Eba, Amala, Pounded Yam, Fufu, Semo
- **Soups**: Egusi, Ogbono, Vegetable, Okra, Ewedu
- **Rice Dishes**: Jollof Rice, Fried Rice, Coconut Rice, Ofada Rice
- **Proteins**: Moi Moi, Akara, Beans Pudding, Suya, Pepper Soup
- **Snacks**: Puff Puff, Chin Chin, Plantain Chips, Boli
- **Drinks**: Zobo, Kunu, Palm Wine, Tiger Nut Milk
- **Breakfast**: Pap (Ogi), Akara, Yam with Egg

### Climate Adaptation
The app adjusts recommendations based on Nigerian climate:
- **Hot Weather**: Increases water intake recommendations
- **Dry Season**: Adjusts calorie needs based on temperature
- **Regional Differences**: Different recommendations for different Nigerian regions

### Cultural Considerations
- **Local Measurements**: Support for local units (cups, wraps, plates)
- **Cultural Practices**: Accounts for fasting periods, celebrations
- **Language Support**: English and major Nigerian languages (Yoruba, Igbo, Hausa)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Food
- `GET /api/foods` - List foods
- `GET /api/foods/search` - Search foods
- `GET /api/foods/:id` - Get food details
- `POST /api/foods/scan` - Scan food from image
- `POST /api/foods/barcode` - Get food by barcode
- `POST /api/foods` - Add custom food

### Activity
- `GET /api/activities` - List activities
- `POST /api/activity-logs` - Log activity
- `GET /api/activity-logs` - Get activity logs

### Water
- `POST /api/water` - Log water intake
- `GET /api/water` - Get water data

### Health
- `POST /api/health-metrics` - Log health metrics
- `GET /api/health-metrics` - Get health metrics

## Calculations

### Daily Calorie Needs
```javascript
// Mifflin-St Jeor Equation
if (gender === 'male') {
  bmr = 10 * weight + 6.25 * height - 5 * age + 5;
} else {
  bmr = 10 * weight + 6.25 * height - 5 * age - 161;
}

// Activity Multipliers
const multipliers = {
  sedentary: 1.2,
  'lightly active': 1.375,
  'moderately active': 1.55,
  'very active': 1.725,
  'extra active': 1.9,
};

tdee = bmr * multipliers[activityLevel];

// Adjust for goals
const adjustments = {
  lose: -500,    // 0.5kg loss per week
  maintain: 0,
  gain: 500,    // 0.5kg gain per week
};

calorieGoal = tdee + adjustments[weightGoal];
```

### Water Intake
```javascript
// Base calculation: 30-35ml per kg of body weight
let waterGoal = weight * 35;

// Activity adjustment
const activityAdjustments = {
  sedentary: 0,
  'lightly active': 250,
  'moderately active': 500,
  'very active': 750,
  'extra active': 1000,
};
waterGoal += activityAdjustments[activityLevel];

// Temperature adjustment (for every degree above 25°C)
if (temperature > 25) {
  waterGoal += (temperature - 25) * 50;
}

// Special conditions
if (pregnancyStatus) waterGoal += 300;
if (breastfeeding) waterGoal += 700;
if (menstrualCycle.isTracking) waterGoal += 200;
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact:
- Email: support@nigerianhealthapp.com
- Website: https://nigerianhealthapp.com

## Acknowledgments

- Special thanks to all contributors
- Nutrition data sourced from various Nigerian food databases
- AI/ML models trained on Nigerian cuisine images
- Weather data from OpenWeather API

---

**Made with ❤️ for Nigeria**

*Version 1.0.0 | Last Updated: October 27, 2026*
