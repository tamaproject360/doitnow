# Doitnow

> **"Kerjakan sekarang untuk hidup lebih baik"**

A premium productivity & task management app built with React Native (Expo) that embodies Apple's design excellence. Created for busy professionals who demand speed, minimalism, and a sense of achievement.

## ✨ Features

### Core Functionality

- **Today Dashboard**: Your command center for daily tasks with real-time progress tracking
- **Smart Categories**: Organize tasks with customizable icons and colors
- **Productivity Analytics**: Visual heatmap showing your 30-day task completion history
- **Offline-First**: All data stored locally using SQLite—works completely offline
- **Zero Friction**: Lightning-fast task creation with bottom sheet modal

### Design Philosophy

**The "Invisible UI" Approach**

- Pure white canvas with high-contrast text for outdoor readability
- Energetic orange accent (#FF6B00) reserved for action moments
- Quiet luxury aesthetic inspired by iOS Notes
- Adrenaline-pumping micro-interactions and animations

**Thumb-Zone First Architecture**

- All critical actions reachable within bottom 40% of screen
- 56px FAB positioned at bottom-right for easy thumb access
- Bottom tab bar with glassmorphism blur effect
- All touch targets exceed 44px minimum for accessibility

### Premium Interactions

- **Spring Physics Animations**: 60fps smooth animations using Reanimated 3
- **Haptic Feedback**: Tactile responses on task completion (iOS/Android)
- **Micro-Wins**: Satisfying visual feedback on every completed task
- **Gesture-Driven**: Intuitive swipe, tap, and scroll interactions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Run on your device**
   - **iOS**: Press `i` in the terminal or scan QR code with Camera app
   - **Android**: Press `a` or scan QR code with Expo Go app
   - **Web**: Press `w` to open in browser

## 🎨 Design System

### Color Palette

```javascript
Canvas (Background):    #FFFFFF  // Pure White
Surface (Secondary):    #F9F9F9  // Soft Grey
Primary Accent:         #FF6B00  // Energetic Orange
Success:                #34C759  // System Green
Text Primary:           #1C1C1E  // Deep Black
Text Secondary:         #8E8E93  // iOS Gray
Separator:              #E5E5EA  // Subtle Line
```

### Typography

- **Headings**: Bold, -0.5px letter spacing, tight leading
- **Body**: 17px (1.4 line height) for optimal mobile readability
- **Labels**: 12px Medium, uppercase for hierarchy

### Spacing System

Based on 8px grid for consistent rhythm throughout the app.

## 🏗️ Architecture

### Tech Stack

- **Framework**: React Native (Expo SDK 54)
- **Routing**: Expo Router v6 (file-based)
- **State Management**: Zustand (fast, minimal boilerplate)
- **Database**: SQLite (expo-sqlite) - Local offline storage
- **Animations**: React Native Reanimated 3
- **Icons**: Ionicons (@expo/vector-icons)

### Project Structure

```
doitnow/
├── app/
│   ├── _layout.tsx           # Root layout with database initialization
│   ├── (tabs)/              # Bottom tab navigation
│   │   ├── _layout.tsx      # Tab bar configuration
│   │   ├── index.tsx        # Today screen
│   │   ├── categories.tsx   # Categories management
│   │   ├── profile.tsx      # Stats & productivity heatmap
│   │   └── settings.tsx     # App preferences
│   └── +not-found.tsx       # 404 page
├── components/
│   ├── FAB.tsx              # Floating Action Button
│   ├── TaskCard.tsx         # Task list item
│   ├── ProgressBar.tsx      # Animated progress indicator
│   └── BottomSheet.tsx      # Modal for quick actions
├── lib/
│   └── database.ts          # SQLite database service
├── store/
│   └── useStore.ts          # Zustand global state
└── assets/
    └── images/              # App icons and images
```

## 💾 Local Storage

### How It Works

Doitnow uses **SQLite** for local data storage, providing:

- **Complete Offline Access**: All features work without internet
- **Fast Performance**: Native SQLite queries for instant data access
- **Privacy First**: Your data never leaves your device
- **Reliable Storage**: Persistent data storage using expo-sqlite

### Benefits

- **Privacy**: Your data stays on your device
- **Speed**: No network latency—instant task management
- **Offline Ready**: Works anywhere, anytime
- **No Account Required**: Start using immediately

### Data Storage

All data is stored in a local SQLite database (`doitnow.db`) including:
- Tasks with completion status and timestamps
- Custom categories with icons and colors
- Daily productivity statistics for heatmap

## 📊 Database Schema

### Tables

**tasks**
- `id` (text): Unique identifier
- `title` (text): Task description
- `is_completed` (integer): Completion status (0/1)
- `completed_at` (text): ISO timestamp when completed
- `due_date` (text): Optional deadline
- `reminder_time` (text): Optional reminder
- `category_id` (text): Optional category reference
- `order_index` (integer): Custom ordering
- `created_at` / `updated_at`: ISO timestamps

**categories**
- `id` (text): Unique identifier
- `name` (text): Category name
- `icon` (text): Ionicon name
- `color` (text): Hex color code
- `order_index` (integer): Custom ordering
- `created_at`: ISO timestamp

**user_stats**
- `id` (text): Unique identifier
- `date` (text): Statistics date (YYYY-MM-DD)
- `tasks_completed` (integer): Completed count
- `tasks_created` (integer): Created count
- `created_at` / `updated_at`: ISO timestamps

### Features

- **Foreign Key Constraints**: Maintains data integrity
- **Automatic Timestamps**: Created/updated timestamps
- **Indexed Queries**: Fast lookups on frequently queried fields
- **WAL Mode**: Write-Ahead Logging for better performance

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start Expo dev server
npm run build:web        # Build for web deployment

# Type Checking
npm run typecheck        # Run TypeScript compiler check

# Code Quality
npm run lint             # Run ESLint
```

## 🎯 Quality Checklist

✅ Touch targets exceed 44px minimum
✅ High contrast text readable outdoors
✅ One-thumb navigation (bottom zone controls)
✅ No hover logic (mobile-only interactions)
✅ Safe area respected (home indicator)
✅ Orange FAB stands out against white background
✅ Haptic feedback on task completion
✅ 60fps animations with spring physics
✅ Offline-first with local SQLite storage
✅ Progressive enhancement (works on web)

## 🚧 Future Enhancements

- [ ] Task reminders with local notifications
- [ ] Due date scheduling with calendar integration
- [ ] Task priority levels (High, Medium, Low)
- [ ] Subtasks and task dependencies
- [ ] Data export/import (JSON/CSV)
- [ ] Dark mode support
- [ ] Widget for iOS/Android home screens
- [ ] Siri/Google Assistant shortcuts
- [ ] Task search and filtering
- [ ] Recurring tasks

## 📱 Platform Support

- **iOS**: Full support with iOS 13+
- **Android**: Full support with Android 10+
- **Web**: Progressive Web App (limited features)

## 🤝 Contributing

This is a demonstration project showcasing premium mobile app design. Feel free to:

- Fork and customize for your needs
- Report bugs or suggest features
- Share your productivity insights

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

**Design Inspiration**
- Apple iOS Notes (minimal, quiet luxury)
- Todoist (clean task management)
- Things 3 (premium interactions)

**Built With**
- [Expo](https://expo.dev) - React Native framework
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) - Local database
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Animations

---

**Doitnow** - Do it now for a better life 🚀
