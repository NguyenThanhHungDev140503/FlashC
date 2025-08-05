import React, { useState, useEffect } from 'react';
import { Alert, View, Text } from 'react-native';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { VocabularyItem } from '@/types/vocabulary';
import { useVocabulary } from '@/contexts/VocabularyContext';

interface EditWordModalProps {
  visible: boolean;
  onClose: () => void;
  item: VocabularyItem | null;
}

interface FormErrors {
  word?: string;
  meaning?: string;
}

export function EditWordModal({ visible, onClose, item }: EditWordModalProps) {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateWord, error } = useVocabulary();

  useEffect(() => {
    if (item) {
      setWord(item.word);
      setMeaning(item.meaning);
      setErrors({});
    }
  }, [item]);

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
    if (!item || !validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const success = await updateWord(item.id, word, meaning);
      
      if (success) {
        Alert.alert('Thành công', 'Đã cập nhật từ vựng!');
        onClose();
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật từ vựng');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Modal visible={visible} onClose={handleClose} title="Chỉnh sửa từ vựng">
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
          title="Hủy"
          onPress={handleClose}
          variant="outline"
          className="flex-1"
          disabled={isSubmitting}
        />
        <Button
          title="Lưu"
          onPress={handleSubmit}
          loading={isSubmitting}
          className="flex-1"
        />
      </View>
    </Modal>
  );
}