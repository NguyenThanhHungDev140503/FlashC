import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VocabularyItem, VocabularyContextType, SortOption } from '@/types/vocabulary';
import { debounce } from '@/utils/debounce';

const STORAGE_KEY = '@vocabulary_data';
const BACKUP_KEY = '@vocabulary_backup';

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

export function VocabularyProvider({ children }: { children: React.ReactNode }) {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('date');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (data: VocabularyItem[]) => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        // Create backup
        await AsyncStorage.setItem(BACKUP_KEY, JSON.stringify(data));
      } catch (err) {
        console.error('Failed to save vocabulary data:', err);
        setError('Lỗi khi lưu dữ liệu');
      }
    }, 500),
    []
  );

  // Load data on mount
  useEffect(() => {
    loadVocabulary();
  }, []);

  // Auto-save when vocabulary changes
  useEffect(() => {
    if (!isLoading && vocabulary.length >= 0) {
      debouncedSave(vocabulary);
    }
  }, [vocabulary, isLoading, debouncedSave]);

  const loadVocabulary = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsedData = JSON.parse(data) as VocabularyItem[];
        setVocabulary(parsedData);
      } else {
        // Try to load from backup
        const backupData = await AsyncStorage.getItem(BACKUP_KEY);
        if (backupData) {
          const parsedBackup = JSON.parse(backupData) as VocabularyItem[];
          setVocabulary(parsedBackup);
        }
      }
    } catch (err) {
      console.error('Failed to load vocabulary data:', err);
      setError('Lỗi khi tải dữ liệu');
      
      // Try to recover from backup
      try {
        const backupData = await AsyncStorage.getItem(BACKUP_KEY);
        if (backupData) {
          const parsedBackup = JSON.parse(backupData) as VocabularyItem[];
          setVocabulary(parsedBackup);
          setError('Đã khôi phục từ bản sao lưu');
        }
      } catch (backupErr) {
        console.error('Failed to load backup data:', backupErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addWord = async (word: string, meaning: string): Promise<boolean> => {
    try {
      setError(null);
      
      // Check for duplicates
      const isDuplicate = vocabulary.some(
        item => item.word.toLowerCase() === word.toLowerCase()
      );
      
      if (isDuplicate) {
        setError('Từ này đã tồn tại');
        return false;
      }

      const newItem: VocabularyItem = {
        id: Date.now().toString(),
        word: word.trim(),
        meaning: meaning.trim(),
        createdAt: Date.now(),
      };

      setVocabulary(prev => [...prev, newItem]);
      return true;
    } catch (err) {
      console.error('Failed to add word:', err);
      setError('Lỗi khi thêm từ mới');
      return false;
    }
  };

  const updateWord = async (id: string, word: string, meaning: string): Promise<boolean> => {
    try {
      setError(null);
      
      // Check for duplicates (excluding current item)
      const isDuplicate = vocabulary.some(
        item => item.id !== id && item.word.toLowerCase() === word.toLowerCase()
      );
      
      if (isDuplicate) {
        setError('Từ này đã tồn tại');
        return false;
      }

      setVocabulary(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, word: word.trim(), meaning: meaning.trim() }
            : item
        )
      );
      return true;
    } catch (err) {
      console.error('Failed to update word:', err);
      setError('Lỗi khi cập nhật từ');
      return false;
    }
  };

  const deleteWord = async (id: string): Promise<void> => {
    try {
      setError(null);
      setVocabulary(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete word:', err);
      setError('Lỗi khi xóa từ');
    }
  };

  const clearAll = async (): Promise<void> => {
    try {
      setError(null);
      setVocabulary([]);
    } catch (err) {
      console.error('Failed to clear all words:', err);
      setError('Lỗi khi xóa tất cả từ');
    }
  };

  const markAsReviewed = async (id: string): Promise<void> => {
    try {
      setError(null);
      setVocabulary(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, lastReviewed: Date.now() }
            : item
        )
      );
    } catch (err) {
      console.error('Failed to mark as reviewed:', err);
      setError('Lỗi khi đánh dấu đã ôn tập');
    }
  };

  // Get sorted vocabulary
  const sortedVocabulary = React.useMemo(() => {
    const sorted = [...vocabulary];
    if (sortOption === 'alphabetical') {
      return sorted.sort((a, b) => a.word.localeCompare(b.word));
    } else {
      return sorted.sort((a, b) => b.createdAt - a.createdAt);
    }
  }, [vocabulary, sortOption]);

  const value: VocabularyContextType = {
    vocabulary: sortedVocabulary,
    addWord,
    updateWord,
    deleteWord,
    clearAll,
    markAsReviewed,
    sortOption,
    setSortOption,
    isLoading,
    error,
  };

  return (
    <VocabularyContext.Provider value={value}>
      {children}
    </VocabularyContext.Provider>
  );
}

export function useVocabulary() {
  const context = useContext(VocabularyContext);
  if (context === undefined) {
    throw new Error('useVocabulary must be used within a VocabularyProvider');
  }
  return context;
}