import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VocabularyProvider, useVocabulary } from '@/contexts/VocabularyContext';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn(),
}));

describe('VocabularyContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <VocabularyProvider>{children}</VocabularyProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('should provide initial empty vocabulary', async () => {
    const { result } = renderHook(() => useVocabulary(), { wrapper });

    await act(async () => {
      // Wait for loading to complete
    });

    expect(result.current.vocabulary).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should load vocabulary from AsyncStorage', async () => {
    const mockData = [
      {
        id: '1',
        word: 'test',
        meaning: 'thử nghiệm',
        createdAt: Date.now(),
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

    const { result } = renderHook(() => useVocabulary(), { wrapper });

    await act(async () => {
      // Wait for data to load
    });

    expect(result.current.vocabulary).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
  });

  it('should add new word successfully', async () => {
    const { result } = renderHook(() => useVocabulary(), { wrapper });

    await act(async () => {
      const success = await result.current.addWord('hello', 'xin chào');
      expect(success).toBe(true);
    });

    expect(result.current.vocabulary).toHaveLength(1);
    expect(result.current.vocabulary[0].word).toBe('hello');
    expect(result.current.vocabulary[0].meaning).toBe('xin chào');
  });

  it('should prevent duplicate words', async () => {
    const { result } = renderHook(() => useVocabulary(), { wrapper });

    await act(async () => {
      await result.current.addWord('hello', 'xin chào');
      const success = await result.current.addWord('HELLO', 'xin chào');
      expect(success).toBe(false);
    });

    expect(result.current.vocabulary).toHaveLength(1);
    expect(result.current.error).toBe('Từ này đã tồn tại');
  });

  it('should update word successfully', async () => {
    const { result } = renderHook(() => useVocabulary(), { wrapper });

    await act(async () => {
      await result.current.addWord('hello', 'xin chào');
      const wordId = result.current.vocabulary[0].id;
      const success = await result.current.updateWord(wordId, 'hi', 'chào');
      expect(success).toBe(true);
    });

    expect(result.current.vocabulary[0].word).toBe('hi');
    expect(result.current.vocabulary[0].meaning).toBe('chào');
  });

  it('should delete word successfully', async () => {
    const { result } = renderHook(() => useVocabulary(), { wrapper });

    await act(async () => {
      await result.current.addWord('hello', 'xin chào');
      const wordId = result.current.vocabulary[0].id;
      await result.current.deleteWord(wordId);
    });

    expect(result.current.vocabulary).toHaveLength(0);
  });

  it('should mark word as reviewed', async () => {
    const { result } = renderHook(() => useVocabulary(), { wrapper });

    await act(async () => {
      await result.current.addWord('hello', 'xin chào');
      const wordId = result.current.vocabulary[0].id;
      await result.current.markAsReviewed(wordId);
    });

    expect(result.current.vocabulary[0].lastReviewed).toBeDefined();
  });

  it('should clear all words', async () => {
    const { result } = renderHook(() => useVocabulary(), { wrapper });

    await act(async () => {
      await result.current.addWord('hello', 'xin chào');
      await result.current.addWord('world', 'thế giới');
      await result.current.clearAll();
    });

    expect(result.current.vocabulary).toHaveLength(0);
  });

  it('should sort vocabulary alphabetically', async () => {
    const { result } = renderHook(() => useVocabulary(), { wrapper });

    await act(async () => {
      await result.current.addWord('zebra', 'ngựa vằn');
      await result.current.addWord('apple', 'táo');
      result.current.setSortOption('alphabetical');
    });

    expect(result.current.vocabulary[0].word).toBe('apple');
    expect(result.current.vocabulary[1].word).toBe('zebra');
  });
});