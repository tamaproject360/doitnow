import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { database } from '@/lib/database';
import { useStore } from '@/store/useStore';

export default function RootLayout() {
  useFrameworkReady();
  const { fetchTasks, fetchCategories, fetchUserStats } = useStore();

  useEffect(() => {
    // Initialize database and load data
    const initializeApp = async () => {
      try {
        await database.init();
        await Promise.all([
          fetchTasks(),
          fetchCategories(),
          fetchUserStats(),
        ]);
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
