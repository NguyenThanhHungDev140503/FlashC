import React from 'react';
import { TextInput, Text, View } from 'react-native';
import { cn } from '@/utils/cn';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  className?: string;
  inputClassName?: string;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  numberOfLines = 1,
  autoCapitalize = 'sentences',
  keyboardType = 'default',
  className,
  inputClassName,
}: InputProps) {
  return (
    <View className={cn('mb-4', className)}>
      {label && (
        <Text className="text-gray-700 text-base font-medium mb-2">
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        className={cn(
          'border-2 rounded-lg px-4 py-3 text-base',
          error 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300 bg-white focus:border-primary-500',
          multiline && 'min-h-[100px] text-top',
          inputClassName
        )}
        placeholderTextColor="#9ca3af"
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}