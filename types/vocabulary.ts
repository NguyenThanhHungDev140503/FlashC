export interface VocabularyItem {
  id: string;
  word: string;
  meaning: string;
  createdAt: number;
  lastReviewed?: number;
}

export type SortOption = 'date' | 'alphabetical';

export interface VocabularyContextType {
  vocabulary: VocabularyItem[];
  addWord: (word: string, meaning: string) => Promise<boolean>;
  updateWord: (id: string, word: string, meaning: string) => Promise<boolean>;
  deleteWord: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  markAsReviewed: (id: string) => Promise<void>;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  isLoading: boolean;
  error: string | null;
}