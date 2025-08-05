import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddWordForm } from '@/components/AddWordForm';

export default function AddWordScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AddWordForm />
    </SafeAreaView>
  );
}