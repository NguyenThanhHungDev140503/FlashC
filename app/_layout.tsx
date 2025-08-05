import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { VocabularyProvider } from '@/contexts/VocabularyContext';
import '../global.css';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <VocabularyProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </VocabularyProvider>
  );
}