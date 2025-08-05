import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, Trash2, Import as SortAsc, Calendar, CircleAlert as AlertCircle, BookOpen } from 'lucide-react-native';
import { FlashCard } from '@/components/FlashCard';
import { EditWordModal } from '@/components/EditWordModal';
import { Button } from '@/components/ui/Button';
import { useVocabulary } from '@/contexts/VocabularyContext';
import { VocabularyItem } from '@/types/vocabulary';

export default function FlashcardsScreen() {
  const [editingItem, setEditingItem] = useState<VocabularyItem | null>(null);
  const [showSortOptions, setShowSortOptions] = useState(false);

  const {
    vocabulary,
    deleteWord,
    clearAll,
    markAsReviewed,
    sortOption,
    setSortOption,
    isLoading,
    error,
  } = useVocabulary();

  const stats = useMemo(() => {
    const total = vocabulary.length;
    const reviewed = vocabulary.filter(item => item.lastReviewed).length;
    const reviewedToday = vocabulary.filter(item => {
      if (!item.lastReviewed) return false;
      const today = new Date().toDateString();
      const reviewDate = new Date(item.lastReviewed).toDateString();
      return today === reviewDate;
    }).length;

    return { total, reviewed, reviewedToday };
  }, [vocabulary]);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa từ này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => deleteWord(id),
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Xóa tất cả từ vựng',
      'Bạn có chắc chắn muốn xóa tất cả từ vựng không? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa tất cả',
          style: 'destructive',
          onPress: clearAll,
        },
      ]
    );
  };

  const renderFlashcard = ({ item }: { item: VocabularyItem }) => (
    <FlashCard
      item={item}
      onEdit={setEditingItem}
      onDelete={handleDelete}
      onMarkReviewed={markAsReviewed}
    />
  );

  const renderHeader = () => (
    <View className="p-6 pb-4">
      {/* Stats */}
      <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <Text className="text-xl font-bold text-gray-900 mb-3 text-center">
          Thống kê học tập
        </Text>
        <View className="flex-row justify-around">
          <View className="items-center">
            <Text className="text-2xl font-bold text-primary-600">
              {stats.total}
            </Text>
            <Text className="text-gray-600 text-sm">Tổng từ</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-600">
              {stats.reviewed}
            </Text>
            <Text className="text-gray-600 text-sm">Đã ôn</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-blue-600">
              {stats.reviewedToday}
            </Text>
            <Text className="text-gray-600 text-sm">Hôm nay</Text>
          </View>
        </View>
      </View>

      {/* Controls */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity
          onPress={() => setShowSortOptions(!showSortOptions)}
          className="flex-row items-center bg-white px-4 py-2 rounded-lg shadow-sm"
        >
          {sortOption === 'date' ? (
            <Calendar size={20} color="#6b7280" />
          ) : (
            <SortAsc size={20} color="#6b7280" />
          )}
          <Text className="ml-2 text-gray-700 font-medium">
            {sortOption === 'date' ? 'Ngày tạo' : 'A-Z'}
          </Text>
        </TouchableOpacity>

        {vocabulary.length > 0 && (
          <TouchableOpacity
            onPress={handleClearAll}
            className="flex-row items-center bg-red-50 px-4 py-2 rounded-lg"
          >
            <Trash2 size={18} color="#dc2626" />
            <Text className="ml-2 text-red-600 font-medium">Xóa tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Sort Options */}
      {showSortOptions && (
        <View className="bg-white rounded-lg shadow-sm p-3 mb-4">
          <TouchableOpacity
            onPress={() => {
              setSortOption('date');
              setShowSortOptions(false);
            }}
            className={`flex-row items-center p-2 rounded-lg ${
              sortOption === 'date' ? 'bg-primary-50' : ''
            }`}
          >
            <Calendar 
              size={20} 
              color={sortOption === 'date' ? '#2563eb' : '#6b7280'} 
            />
            <Text 
              className={`ml-3 ${
                sortOption === 'date' 
                  ? 'text-primary-600 font-semibold' 
                  : 'text-gray-700'
              }`}
            >
              Sắp xếp theo ngày tạo
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => {
              setSortOption('alphabetical');
              setShowSortOptions(false);
            }}
            className={`flex-row items-center p-2 rounded-lg ${
              sortOption === 'alphabetical' ? 'bg-primary-50' : ''
            }`}
          >
            <SortAsc 
              size={20} 
              color={sortOption === 'alphabetical' ? '#2563eb' : '#6b7280'} 
            />
            <Text 
              className={`ml-3 ${
                sortOption === 'alphabetical' 
                  ? 'text-primary-600 font-semibold' 
                  : 'text-gray-700'
              }`}
            >
              Sắp xếp theo A-Z
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex-row items-center">
          <AlertCircle size={20} color="#dc2626" />
          <Text className="text-red-700 ml-2 flex-1">
            {error}
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View className="flex-1 justify-center items-center p-6">
      <BookOpen size={64} color="#d1d5db" />
      <Text className="text-xl font-semibold text-gray-500 mt-4 mb-2">
        Chưa có từ vựng nào
      </Text>
      <Text className="text-gray-400 text-center mb-6">
        Hãy thêm từ vựng mới để bắt đầu học tập
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-600 mt-4">Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={vocabulary}
        renderItem={renderFlashcard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ 
          flexGrow: 1,
          paddingBottom: 20 
        }}
        showsVerticalScrollIndicator={false}
      />

      <EditWordModal
        visible={!!editingItem}
        onClose={() => setEditingItem(null)}
        item={editingItem}
      />
    </SafeAreaView>
  );
}