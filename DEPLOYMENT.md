# Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Nigerian Health & Fitness App to production.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Frontend Deployment](#frontend-deployment)
3. [Backend Deployment](#backend-deployment)
4. [Firebase Setup](#firebase-setup)
5. [App Store Submission](#app-store-submission)
6. [Post-Deployment](#post-deployment)

---

## Prerequisites

### Required Accounts
- [x] **Firebase Account** - For authentication, database, and cloud functions
- [x] **Expo Account** - For building and deploying the app
- [x] **Apple Developer Account** - For iOS app store submission ($99/year)
- [x] **Google Play Developer Account** - For Android app store submission ($25 one-time)
- [x] **Weather API Account** - For climate data (OpenWeather, WeatherAPI, etc.)

### Required Tools
- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- Git
- Android Studio (for Android builds)
- Xcode (for iOS builds, Mac only)

---

## Frontend Deployment

### Option 1: Expo EAS Build (Recommended)

#### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

#### 2. Log in to Expo
```bash
eas login
```

#### 3. Configure EAS
```bash
cd nigerian-health-app/frontend
eas build:init
```

Follow the prompts to configure:
- Project name
- App ID (com.yourcompany.nigerianhealth)
- Version
- Build platforms (Android and iOS)

#### 4. Update eas.json
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "simulator": false
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "path/to/service-account.json",
        "track": "production"
      },
      "ios": {
        "appleId": "your-apple-id",
        "appleAppId": "your-app-id",
        "ascAppId": "your-asc-app-id"
      }
    }
  }
}
```

#### 5. Build the App
```bash
# For Android
eas build --platform android

# For iOS
eas build --platform ios

# For both
eas build --platform all
```

#### 6. Download and Test
Once the build completes, download the APK/IPA files and test on real devices.

### Option 2: Bare React Native (Without Expo)

#### 1. Eject from Expo
```bash
npx expo eject
```

#### 2. Install Native Dependencies
Follow the instructions to install Android and iOS native dependencies.

#### 3. Build for Android
```bash
cd android
./gradlew assembleRelease
```

#### 4. Build for iOS
```bash
cd ios
pod install
npx react-native run-ios --configuration Release
```

---

## Backend Deployment

### Option 1: Firebase Functions

#### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

#### 2. Initialize Firebase
```bash
firebase login
firebase init functions
```

#### 3. Deploy Functions
```bash
cd backend
firebase deploy --only functions
```

### Option 2: Node.js with Express (Heroku, AWS, etc.)

#### 1. Install Dependencies
```bash
cd backend
npm install
```

#### 2. Configure Environment
Create a `.env` file:
```env
PORT=3000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
FIREBASE_CONFIG=your-firebase-config
WEATHER_API_KEY=your-weather-api-key
```

#### 3. Deploy to Heroku
```bash
# Install Heroku CLI
# heroku login
# heroku create nigerian-health-api
# git push heroku master
# heroku open
```

#### 4. Deploy to AWS
- Create an EC2 instance
- Install Node.js and npm
- Clone the repository
- Run `npm install` and `npm start`
- Set up PM2 for process management

---

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: "Nigerian Health App"
4. Enable Analytics (optional)
5. Click "Create Project"

### 2. Enable Services
1. **Authentication**
   - Enable Email/Password
   - Enable Google Sign-In (optional)
   - Enable Phone Authentication (optional)

2. **Firestore Database**
   - Start in test mode (for development)
   - Configure security rules for production

3. **Storage**
   - For storing user photos and food images

4. **Cloud Functions**
   - For backend logic (optional)

### 3. Configure Security Rules

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Food database is read-only for users
    match /foods/{foodId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admin can write
    }
    
    // User-specific data
    match /food-logs/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /activity-logs/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /water/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /health-metrics/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can only access their own files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public food images (read-only)
    match /food-images/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if false; // Only admin can upload
    }
  }
}
```

### 4. Update Frontend Configuration

Create a `firebaseConfig.js` file:
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
```

---

## App Store Submission

### Android (Google Play Store)

#### 1. Prepare App
1. Generate signed APK or App Bundle
2. Test thoroughly on multiple devices
3. Create screenshots (6.5" and 10" tablet)
4. Create feature graphic
5. Write app description

#### 2. Create App Listing
1. Go to [Google Play Console](https://play.google.com/console/)
2. Click "Create App"
3. Fill in app details:
   - App name
   - Default language
   - Category (Health & Fitness)
   - Email address

#### 3. Upload App
1. Upload the signed App Bundle (AAB)
2. Fill in store listing:
   - Short and long descriptions
   - High-quality screenshots
   - Feature graphic
   - App icons
   - Promotional images
   - Videos (optional)

#### 4. Content Rating
Complete the content rating questionnaire.

#### 5. Pricing & Distribution
- Select countries for distribution
- Set pricing (Free)
- Confirm target audience

#### 6. Submit for Review
- Review all information
- Click "Submit"
- Wait for approval (usually 1-3 days)

### iOS (Apple App Store)

#### 1. Prepare App
1. Archive the app using Xcode
2. Test on multiple iOS devices
3. Create screenshots (6.5" and 5.5" iPhone, 12.9" and 11" iPad)
4. Create app preview video
5. Write app description

#### 2. Create App in App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Click "My Apps" > "+" > "New App"
3. Fill in app details:
   - App name
   - Bundle ID (must match your app)
   - SKU
   - Primary language

#### 3. Upload App
1. Use Xcode to upload the archive
2. Or use Transporter app
3. Fill in app information:
   - Subtitle
   - Category (Health & Fitness)
   - Age rating
   - Copyright
   - Keywords
   - Description
   - What's New
   - App icons
   - Screenshots
   - App previews
   - Promotional text

#### 4. Pricing & Availability
- Select countries for distribution
- Set pricing (Free)
- Confirm availability date

#### 5. Submit for Review
- Review all information
- Click "Submit for Review"
- Wait for approval (usually 1-3 days)

---

## Post-Deployment

### 1. Monitor Performance
- Set up Firebase Analytics
- Monitor crash reports
- Track user engagement

### 2. Set Up CI/CD
Create GitHub Actions workflow:
```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      
      - name: Build Android
        run: |
          cd frontend
          eas build --platform android --non-interactive
      
      - name: Build iOS
        run: |
          cd frontend
          eas build --platform ios --non-interactive
```

### 3. Set Up Monitoring
- Firebase Performance Monitoring
- Sentry for error tracking
- Uptime monitoring

### 4. Marketing
- Create social media pages
- Set up app website
- Run promotional campaigns
- Collect user feedback

---

## Troubleshooting

### Common Issues

#### 1. Build Fails
- Check Node.js version (use v16 or later)
- Clear cache: `npm cache clean --force`
- Delete node_modules and reinstall
- Check for missing dependencies

#### 2. Firebase Connection Issues
- Verify API keys are correct
- Check network connectivity
- Ensure Firebase services are enabled
- Verify security rules

#### 3. App Store Rejection
- Fix all policy violations
- Provide all required information
- Ensure screenshots are high-quality
- Follow app store guidelines

#### 4. Performance Issues
- Optimize images
- Reduce bundle size
- Implement lazy loading
- Use memoization for expensive calculations

---

## Support

For deployment support:
- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

---

**Happy Deploying!** 🚀

*Last Updated: October 27, 2026*