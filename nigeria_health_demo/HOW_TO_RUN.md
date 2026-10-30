# How to Run the Nigerian Health App Demo

## Quick Start

You have a working demo of the Nigerian Health & Fitness App! Here's how to run it:

---

## 🚀 Step 1: Install Dependencies

The dependencies are already installed, but if you need to reinstall:

```bash
cd /home/user/nigerian-health-demo
npm install --legacy-peer-deps --force
```

---

## 📱 Step 2: Start the App

### On your local machine:

```bash
# Navigate to the project directory
cd /home/user/nigerian-health-demo

# Start the Expo development server
npx expo start
```

This will start a development server at `http://localhost:19002`

### To run on your device:

1. **Install Expo Go** on your Android or iOS device:
   - [Android: Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS: App Store](https://apps.apple.com/us/app/expo-go/id982107779)

2. **Scan the QR code** displayed in your terminal with the Expo Go app

3. **Or use the web version**:
   - Press `w` in the terminal to open in browser
   - Or visit `http://localhost:19002` in your browser

---

## 👤 Step 3: Use the Demo App

### Login
Since we're in demo mode, you can:
1. Click "Demo Login" on the onboarding screen, OR
2. Use the pre-configured demo account

### Features to Try

#### 🏠 Dashboard
- View your daily progress (calories, water, steps)
- See notifications and alerts
- Quick actions for adding food, water, and activities

#### 🍽️ Food Tracking
- Browse popular Nigerian foods
- Search for foods
- Add food intake with portion sizes
- View nutrition information
- Try the demo food scanner

#### 💧 Water Tracker
- Log water intake
- Quick add buttons (250ml, 500ml, etc.)
- View daily water progress
- Get hydration reminders

#### 🏃 Activity Tracker
- Log activities (walking, running, etc.)
- View step count
- Track calories burned
- See activity history

#### 📊 Health Dashboard
- View BMI and weight trends
- Track health metrics
- Log weight measurements
- View body composition data

#### ⚙️ Settings
- Toggle dark/light mode
- Manage account preferences
- Configure notifications

---

## 🔧 Missing Features (Can Be Added)

The following features require additional packages to be installed:

### Camera Features
- Food Scanner: `npm install expo-camera`
- Barcode Scanner: `npm install expo-barcode-scanner`
- Image Picker: `npm install expo-image-picker expo-image-manipulator`

After installing, add these to `app.json` plugins:
```json
"plugins": [
  "expo-camera",
  "expo-barcode-scanner",
  "expo-image-picker",
  "expo-image-manipulator"
]
```

Then restart the app: `npx expo start -c`

### Step Counter
- Install: `npm install expo-sensors`
- Add to plugins: `"expo-sensors"`

### Location Services
- Install: `npm install expo-location`
- Add to plugins: `"expo-location"`

### Notifications
- Install: `npm install expo-notifications`
- Add to plugins: `"expo-notifications"`

---

## 🐛 Troubleshooting

### "Unable to resolve module"
Run:
```bash
npm install --legacy-peer-deps --force
```

### "Expo CLI not found"
Install Expo CLI globally:
```bash
npm install -g expo-cli
```

### "Node version not supported"
Expo requires Node.js v18 or later. You have v20.20.2, which is fine.

### App crashes on startup
Try clearing the cache:
```bash
npx expo start -c
```

### Android/iOS specific issues
Make sure you have:
- Android Studio (for Android)
- Xcode (for iOS, Mac only)
- Java JDK 11+

---

## 📝 Notes

- This is a **demo version** with simulated data
- All Nigerian foods are pre-loaded in the database
- Calorie calculations are based on standard Nigerian portion sizes
- Water goals adjust based on your profile
- The app works offline (data is stored locally)

---

## 🎯 What's Next?

To make this production-ready:

1. **Set up Firebase** (for real data storage):
   - Create a Firebase project
   - Enable Authentication & Firestore
   - Update the config in the app

2. **Add AI Features**:
   - Connect to a real food recognition API
   - Implement barcode scanning API

3. **Test on Real Devices**:
   - Test on Android and iOS
   - Fix any device-specific issues

4. **Deploy**:
   - Use Expo EAS to build
   - Submit to app stores

---

## 💬 Need Help?

Check the documentation:
- `/home/user/nigerian-health-app/README.md` - Complete project docs
- `/home/user/nigerian-health-app/docs/` - Architecture & requirements
- `/home/user/nigerian-health-app/DEPLOYMENT.md` - Deployment guide

---

**Happy Testing!** 🎉

*Last Updated: October 27, 2026*
