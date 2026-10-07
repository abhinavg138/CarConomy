# Carconomy — Android Guide & Architecture

This document describes how Carconomy runs as a native Android application using Capacitor, preserving the existing React/Vite engine and UI without duplicating logic.

---

## 1. Architecture Overview

```
React / Vite UI + Financial Engine (TypeScript)
               ↓  npm run build
            dist/
               ↓  npx cap sync android
     android/app/src/main/assets/public
               ↓
    Capacitor Android Shell (WebView)
               ↓
        Android Studio / Gradle
               ↓
     APK / AAB (Debug / Release)
```

- **Identity**:
  - Application Name: `Carconomy`
  - Android Package ID: `com.abhinav.carconomy`
  - Default Orientation: Portrait
  - Primary Theme: Deep automotive dark (`#08090C`, `#090C11`, `#CCFF00`)
- **Single Source of Truth**:
  - All calculation logic (`src/utils/calculator.ts`), models, tabs, 3D viewers, and UI elements remain in React/Vite.
  - Capacitor plugins bridge Android hardware back button, status bar styling, splash screen, and keyboard behavior.

---

## 2. Prerequisites

1. **Node.js**: v18+ or v20+ recommended.
2. **Java Development Kit (JDK)**: JDK 17 or JDK 21.
3. **Android Studio**: Android Studio Ladybug / Meerkat (2024+) with:
   - Android SDK Platform (API 34 or API 35 recommended)
   - Android SDK Build-Tools (34.0.0+)
   - Android SDK Command-line Tools
   - Android Emulator (or a physical device with USB debugging enabled)

---

## 3. Quick Start & Workflow

### Development & Synchronization
Whenever you modify the React application in `src/`, synchronize the assets into the Android native project:

```bash
# 1. Build the web production bundle
npm run build

# 2. Sync web assets and plugins to the Android project
npx cap sync android
```

### Opening in Android Studio
To open the Android Studio project directly:

```bash
npx cap open android
```
*(Alternatively, launch Android Studio manually and open the `android` folder).*

---

## 4. Building the Android Application

### Via Command Line (Gradle)

On Windows (PowerShell):
```powershell
# Set JAVA_HOME if not in global environment (e.g. Adoptium or Android Studio JBR)
$env:JAVA_HOME = "C:\Users\<user>\.gradle\jdks\eclipse_adoptium-21-amd64-windows.2"

# Build Debug APK
cd android
.\gradlew.bat assembleDebug
```

On macOS / Linux:
```bash
cd android
./gradlew assembleDebug
```

### Output Location
- **Debug APK**:
  `android/app/build/outputs/apk/debug/app-debug.apk`

### Via Android Studio
1. Launch Android Studio with `npx cap open android`.
2. Wait for Gradle sync to complete.
3. Select `app` configuration in the toolbar.
4. Click **Run** (`Shift + F10`) to deploy to a connected emulator or physical device.
5. Or select **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate the APK.

---

## 5. Native Shell Features Implemented

1. **Launcher Icons**:
   - Custom automotive-fintech Carconomy badge with neon lime accent (`#CCFF00`) and carbon background (`#08090C`).
   - Sized for all standard densities: `mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi` (square, round, and adaptive foreground).
2. **Splash Screen**:
   - Custom minimal dark launch screen displaying the Carconomy emblem.
   - Configured with zero startup delay (`launchAutoHide: true`, `launchShowDuration: 1500ms`, `fade`).
3. **Hardware Back Button Handling**:
   - Priority 1: Closes any open modal (Add Car sheet, Keep vs Sell modal, etc.).
   - Priority 2: Returns to the root Home dashboard from sub-tabs.
   - Priority 3: Exits app cleanly only when already at the root.
4. **Edge-to-Edge & Safe Areas**:
   - Viewport configured with `viewport-fit=cover`.
   - CSS safe-area insets (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`) applied to navbar and bottom bars.
   - Dark status bar (`#08090C`) and navigation bar (`#090C11`) with light icons.
5. **Keyboard Resilience**:
   - Capacitor Keyboard plugin set to `body` resize mode to keep active financial inputs visible without squishing fixed navigation.
6. **Offline First**:
   - Bundled vehicle photography under `/vehicles/` in `public/` is fully packaged into the APK.
   - Core financial simulation runs 100% offline with zero remote API dependencies.

---

## 6. Testing on Emulator or Device

To test on an Android emulator or connected device:

```bash
# Check connected adb devices
adb devices

# Install debug APK
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# Launch app directly
adb shell am start -n com.abhinav.carconomy/com.abhinav.carconomy.MainActivity
```

### Verification Checklist
- [x] Launch and splash screen transition to Home.
- [x] Vehicle catalog images render from bundled assets.
- [x] Slider adjustments (daily km, fuel price) dynamically recalculate costs and fit gauge.
- [x] Keep vs Sell scenario calculation behaves accurately.
- [x] Hardware back button dismisses modals before exiting.
- [x] Dark status and navigation bars blend seamlessly into the UI.

---

## 7. Release Build (Signing)

To generate a signed release Android App Bundle (AAB) or APK for Google Play:

1. Generate a keystore:
   ```bash
   keytool -genkey -v -keystore carconomy-release.jks -alias carconomy -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Configure `android/app/build.gradle` signingConfigs with keystore details or environment variables.
3. Build the bundle:
   ```powershell
   cd android
   .\gradlew.bat bundleRelease
   ```
4. Output will be generated at:
   `android/app/build/outputs/bundle/release/app-release.aab`
