import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useVocabulary } from '@/contexts/VocabularyContext';

interface FormErrors {
  word?: string;
  meaning?: string;
}

export function AddWordForm() {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addWord, error } = useVocabulary();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!word.trim()) {
      newErrors.word = 'Vui lòng nhập từ tiếng Anh';
    } else if (word.trim().length < 2) {
      newErrors.word = 'Từ phải có ít nhất 2 ký tự';
    }

    if (!meaning.trim()) {
      newErrors.meaning = 'Vui lòng nhập nghĩa tiếng Việt';
    } else if (meaning.trim().length < 2) {
      newErrors.meaning = 'Nghĩa phải có ít nhất 2 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const success = await addWord(word, meaning);
      
      if (success) {
        setWord('');
        setMeaning('');
        setErrors({});
        Alert.alert('Thành công', 'Đã thêm từ mới vào bộ từ vựng!');
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi thêm từ mới');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setWord('');
    setMeaning('');
    setErrors({});
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        <View className="bg-white rounded-xl shadow-sm p-6">
          <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Thêm từ mới
          </Text>

          <Input
            label="Từ tiếng Anh *"
            value={word}
            onChangeText={setWord}
            placeholder="Nhập từ tiếng Anh..."
            error={errors.word}
            autoCapitalize="none"
          />

          <Input
            label="Nghĩa tiếng Việt *"
            value={meaning}
            onChangeText={setMeaning}
            placeholder="Nhập nghĩa tiếng Việt..."
            error={errors.meaning}
            multiline
            numberOfLines={3}
          />

          {error && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <Text className="text-red-700 text-center">
                {error}
              </Text>
            </View>
          )}

          <View className="flex-row space-x-3">
            <Button
              title="Xóa"
              onPress={clearForm}
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            />
            <Button
              title="Thêm từ"
              onPress={handleSubmit}
              loading={isSubmitting}
              className="flex-1"
            />
          </View>
        </View>

        <View className="mt-6 bg-blue-50 rounded-xl p-4">
          <Text className="text-blue-800 font-semibold mb-2">
            💡 Mẹo học từ vựng hiệu quả:
          </Text>
          <Text className="text-blue-700 text-sm leading-relaxed">
            • Thêm từ vựng thường xuyên mỗi ngày{'\n'}
            • Ôn tập bằng flashcard để ghi nhớ lâu{'\n'}
            • Sử dụng từ mới trong câu để hiểu rõ nghĩa{'\n'}
            • Phân loại từ theo chủ đề để dễ học
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}