import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
} from 'react-native';
import { useStore } from '@/store/useStore';
import { BottomSheet } from '@/components/BottomSheet';
import { FAB } from '@/components/FAB';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const CATEGORY_ICONS = [
  'briefcase-outline',
  'home-outline',
  'fitness-outline',
  'heart-outline',
  'cart-outline',
  'book-outline',
  'trophy-outline',
  'people-outline',
];

const CATEGORY_COLORS = [
  '#FF6B00',
  '#34C759',
  '#007AFF',
  '#FF3B30',
  '#5856D6',
  '#FF9500',
  '#AF52DE',
  '#FF2D55',
];

export default function CategoriesScreen() {
  const { categories, tasks, fetchCategories, addCategory } = useStore();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('folder-outline');
  const [selectedColor, setSelectedColor] = useState('#FF6B00');

  useEffect(() => {
    fetchCategories();
  }, []);

  const categoriesWithCounts = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      taskCount: tasks.filter((t) => t.category_id === category.id).length,
    }));
  }, [categories, tasks]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    await addCategory(newCategoryName.trim(), selectedIcon, selectedColor);
    setNewCategoryName('');
    setSelectedIcon('folder-outline');
    setSelectedColor('#FF6B00');
    setIsAddModalVisible(false);
  };

  const handleCategoryPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const renderCategoryCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={handleCategoryPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon as any} size={28} color="#FFFFFF" />
      </View>
      <Text style={styles.categoryName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.taskCount}>
        {item.taskCount} {item.taskCount === 1 ? 'task' : 'tasks'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>Organize your tasks</Text>
      </View>

      {categoriesWithCounts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-open-outline" size={64} color="#8E8E93" />
          <Text style={styles.emptyTitle}>No categories yet</Text>
          <Text style={styles.emptySubtitle}>
            Create categories to organize your tasks
          </Text>
        </View>
      ) : (
        <FlatList
          data={categoriesWithCounts}
          keyExtractor={(item) => item.id}
          renderItem={renderCategoryCard}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB onPress={() => setIsAddModalVisible(true)} />

      <BottomSheet
        visible={isAddModalVisible}
        onClose={() => {
          setIsAddModalVisible(false);
          setNewCategoryName('');
          setSelectedIcon('folder-outline');
          setSelectedColor('#FF6B00');
        }}
        height={500}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>New Category</Text>

          <TextInput
            style={styles.input}
            placeholder="Category name"
            placeholderTextColor="#8E8E93"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            autoFocus
            maxLength={30}
          />

          <Text style={styles.sectionLabel}>Icon</Text>
          <View style={styles.iconGrid}>
            {CATEGORY_ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconOption,
                  selectedIcon === icon && styles.iconOptionSelected,
                ]}
                onPress={() => setSelectedIcon(icon)}
              >
                <Ionicons name={icon as any} size={24} color="#1C1C1E" />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Color</Text>
          <View style={styles.colorGrid}>
            {CATEGORY_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorOptionSelected,
                ]}
                onPress={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.addButton,
              !newCategoryName.trim() && styles.addButtonDisabled,
            ]}
            onPress={handleAddCategory}
            disabled={!newCategoryName.trim()}
          >
            <Text style={styles.addButtonText}>Create Category</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 120,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    padding: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 8,
    textAlign: 'center',
  },
  taskCount: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 17,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 17,
    color: '#8E8E93',
    marginTop: 16,
  },
  modalContent: {
    flex: 1,
    paddingTop: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  input: {
    fontSize: 17,
    color: '#1C1C1E',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  iconOption: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionSelected: {
    borderColor: '#FF6B00',
    backgroundColor: '#FFF5F0',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#1C1C1E',
  },
  addButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    minHeight: 56,
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
