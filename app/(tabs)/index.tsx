import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useStore } from '@/store/useStore';
import { TaskCard } from '@/components/TaskCard';
import { ProgressBar } from '@/components/ProgressBar';
import { FAB } from '@/components/FAB';
import { BottomSheet } from '@/components/BottomSheet';
import { Ionicons } from '@expo/vector-icons';

export default function TodayScreen() {
  const { tasks, fetchTasks, fetchCategories, toggleTask, addTask } =
    useStore();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const todayTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (task.is_completed) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !task.due_date || new Date(task.due_date) >= today;
    });
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return tasks.filter((task) => task.is_completed);
  }, [tasks]);

  const completedCount = completedTasks.length;
  const totalCount = tasks.length;

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle.trim());
    setNewTaskTitle('');
    setIsAddModalVisible(false);
  };

  const getDateSubtitle = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    return today.toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today</Text>
        <Text style={styles.subtitle}>{getDateSubtitle()}</Text>
      </View>

      <ProgressBar completed={completedCount} total={totalCount} />

      {todayTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle-outline" size={64} color="#34C759" />
          <Text style={styles.emptyTitle}>You're all caught up</Text>
          <Text style={styles.emptySubtitle}>Rest or Plan</Text>
        </View>
      ) : (
        <FlatList
          data={todayTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard task={item} onToggle={toggleTask} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {completedTasks.length > 0 && (
        <View style={styles.completedSection}>
          <Text style={styles.completedHeader}>
            Completed ({completedTasks.length})
          </Text>
          <FlatList
            data={completedTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskCard task={item} onToggle={toggleTask} />
            )}
            scrollEnabled={false}
          />
        </View>
      )}

      <FAB onPress={() => setIsAddModalVisible(true)} />

      <BottomSheet
        visible={isAddModalVisible}
        onClose={() => {
          setIsAddModalVisible(false);
          setNewTaskTitle('');
        }}
        height={300}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Task</Text>
          <TextInput
            style={styles.input}
            placeholder="What needs to be done?"
            placeholderTextColor="#8E8E93"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            autoFocus
            multiline
            maxLength={200}
          />
          <TouchableOpacity
            style={[
              styles.addButton,
              !newTaskTitle.trim() && styles.addButtonDisabled,
            ]}
            onPress={handleAddTask}
            disabled={!newTaskTitle.trim()}
          >
            <Text style={styles.addButtonText}>Add Task</Text>
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
    paddingBottom: 120,
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
  },
  emptyText: {
    fontSize: 17,
    color: '#8E8E93',
    marginTop: 16,
  },
  completedSection: {
    marginTop: 24,
    paddingBottom: 120,
  },
  completedHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    minHeight: 100,
    textAlignVertical: 'top',
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
