# Changelog

## [2026-01-19] - Upgrade ke Expo SDK 52

### Perubahan Utama

#### Upgrade SDK
- ✅ Upgrade dari Expo SDK 54 ke SDK 52
- ✅ Update React Native dari 0.81.4 ke 0.76.9
- ✅ Update React dari 19.1.0 ke 18.3.1 (sesuai requirement SDK 52)
- ✅ Update React DOM dari 19.1.0 ke 18.3.1

#### Package Updates
- `@expo/vector-icons`: 15.0.2 → 14.0.4
- `@react-native-async-storage/async-storage`: 2.2.0 → 1.23.1
- `@shopify/flash-list`: 2.2.0 → 1.7.3
- `expo-blur`: 15.0.7 → 14.0.3
- `expo-camera`: 17.0.8 → 16.0.18
- `expo-constants`: 18.0.9 → 17.0.8
- `expo-font`: 14.0.8 → 13.0.4
- `expo-haptics`: 15.0.7 → 14.0.1
- `expo-linear-gradient`: 15.0.7 → 14.0.2
- `expo-linking`: 8.0.8 → 7.0.5
- `expo-router`: 6.0.8 → 4.0.22
- `expo-splash-screen`: 31.0.10 → 0.29.24
- `expo-sqlite`: 16.0.10 → 15.1.4
- `expo-status-bar`: 3.0.8 → 2.0.1
- `expo-symbols`: 1.0.7 → 0.2.2
- `expo-system-ui`: 6.0.7 → 4.0.9
- `expo-web-browser`: 15.0.7 → 14.0.2
- `react-native-gesture-handler`: 2.28.0 → 2.20.2
- `react-native-reanimated`: 4.1.2 → 3.16.1
- `react-native-safe-area-context`: 5.6.1 → 4.12.0
- `react-native-screens`: 4.16.0 → 4.4.0
- `react-native-svg`: 15.12.1 → 15.8.0
- `react-native-web`: 0.21.1 → 0.19.13
- `react-native-webview`: 13.15.0 → 13.12.5
- `@types/react`: 19.1.14 → 18.3.12

#### Konfigurasi
- ✅ Update `app.json`:
  - Mengubah nama aplikasi dari "bolt-expo-nativewind" ke "doitnow"
  - Mengubah slug dari "bolt-expo-nativewind" ke "doitnow"
  - Menambahkan `bundleIdentifier` untuk iOS: "com.doitnow.app"
  - Menambahkan `package` untuk Android: "com.doitnow.app"
  - Menambahkan konfigurasi `adaptiveIcon` untuk Android
  - Mengkonfigurasi `expo-splash-screen` plugin dengan proper settings
  - Menghapus plugin `expo-web-browser` yang menyebabkan error
  - Mempertahankan `newArchEnabled: true` untuk New Architecture

#### Fitur SDK 52
- ✅ New Architecture enabled by default
- ✅ React Native 0.76 dengan peningkatan performa
- ✅ iOS deployment target minimum: iOS 15.1
- ✅ Android minSdkVersion: 24, compileSdkVersion: 35
- ✅ Dukungan untuk React Navigation v7
- ✅ Improved splash screen dengan Android 12+ SplashScreen API

#### Perbaikan
- ✅ Mengatasi konflik peer dependencies dengan flag `--legacy-peer-deps`
- ✅ Semua 17 checks dari `expo-doctor` berhasil passed
- ✅ Tidak ada issues terdeteksi

### Catatan Penting
- Aplikasi sekarang menggunakan Expo SDK 52 dengan New Architecture enabled
- Semua dependencies sudah kompatibel dengan SDK 52
- Proyek siap untuk development dan production build

### Langkah Selanjutnya
- Jalankan `npm run dev` untuk memulai development server
- Untuk iOS: Jalankan `npx pod-install` jika ada folder ios
- Untuk production build: Gunakan EAS Build atau `npx expo run:ios/android`
