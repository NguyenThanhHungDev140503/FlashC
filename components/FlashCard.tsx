import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { VocabularyItem } from '@/types/vocabulary';

interface FlashCardProps {
  item: VocabularyItem;
  onEdit: (item: VocabularyItem) => void;
  onDelete: (id: string) => void;
  onMarkReviewed: (id: string) => void;
}

const { width } = Dimensions.get('window');

export function FlashCard({ item, onEdit, onDelete, onMarkReviewed }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipValue = useSharedValue(0);

  const handleFlip = () => {
    const newFlippedState = !isFlipped;
    
    flipValue.value = withTiming(newFlippedState ? 1 : 0, { duration: 600 }, () => {
      if (newFlippedState) {
        runOnJS(onMarkReviewed)(item.id);
      }
    });
    
    setIsFlipped(newFlippedState);
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipValue.value, [0, 1], [0, 180]);
    const opacity = interpolate(flipValue.value, [0, 0.5, 1], [1, 0, 0]);
    
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipValue.value, [0, 1], [180, 360]);
    const opacity = interpolate(flipValue.value, [0, 0.5, 1], [0, 0, 1]);
    
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('vi-VN');
  };

  return (
    <View className="mb-6 mx-4" style={{ width: width - 32 }}>
      <TouchableOpacity onPress={handleFlip} activeOpacity={0.9}>
        <View className="relative" style={{ height: 220, width: '100%' }}>
          {/* Front Side - English Word */}
          <Animated.View
            style={[frontAnimatedStyle, { width: '100%' }]}
            className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-gray-200"
          >
            <View className="flex-1 justify-center items-center px-6 py-4">
              <Text className="text-3xl font-bold text-primary-700 text-center mb-4">
                {item.word}
              </Text>
              <View className="bg-primary-50 px-4 py-2 rounded-full">
                <Text className="text-primary-600 text-sm font-medium">
                  Nhấn để xem nghĩa
                </Text>
              </View>
            </View>
            
            {/* Footer - Creation Date */}
            <View className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <Text className="text-xs text-gray-500">
                Tạo ngày: {formatDate(item.createdAt)}
              </Text>
            </View>
          </Animated.View>

          {/* Back Side - Vietnamese Meaning */}
          <Animated.View
            style={[backAnimatedStyle, { width: '100%' }]}
            className="absolute inset-0 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl shadow-lg border border-secondary-200"
          >
            <View className="flex-1 justify-center items-center px-6 py-4">
              <Text className="text-2xl font-semibold text-secondary-700 text-center mb-4 leading-relaxed">
                {item.meaning}
              </Text>
              <View className="bg-secondary-200 px-4 py-2 rounded-full">
                <Text className="text-secondary-700 text-sm font-medium">
                  Nghĩa tiếng Việt
                </Text>
              </View>
            </View>
            
            {/* Footer - Review Info */}
            <View className="px-6 py-4 border-t border-secondary-200 bg-secondary-50 rounded-b-2xl">
              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-gray-500">
                  Tạo: {formatDate(item.createdAt)}
                </Text>
                {item.lastReviewed && (
                  <View className="flex-row items-center bg-green-100 px-2 py-1 rounded-full">
                    <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    <Text className="text-xs text-green-700 font-medium">
                      Ôn: {formatDate(item.lastReviewed)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>
        </View>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View className="flex-row justify-center mt-5 space-x-6">
        <TouchableOpacity
          onPress={() => onEdit(item)}
          className="bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-full shadow-sm border border-blue-200 flex-row items-center"
          activeOpacity={0.7}
        >
          <Edit size={18} color="#2563eb" />
          <Text className="text-blue-600 font-medium ml-2 text-sm">Sửa</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => onDelete(item.id)}
          className="bg-red-50 hover:bg-red-100 px-6 py-3 rounded-full shadow-sm border border-red-200 flex-row items-center"
          activeOpacity={0.7}
        >
          <Trash2 size={18} color="#dc2626" />
          <Text className="text-red-600 font-medium ml-2 text-sm">Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}