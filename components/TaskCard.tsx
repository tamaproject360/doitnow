import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeOut,
} from 'react-native-reanimated';
import { Task } from '@/lib/database';

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 20, stiffness: 90 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 90 });
  };

  const handleToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(
        task.is_completed
          ? Haptics.ImpactFeedbackStyle.Light
          : Haptics.ImpactFeedbackStyle.Medium
      );
    }
    onToggle(task.id);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: task.is_completed ? 0.5 : 1,
    textDecorationLine: task.is_completed ? 'line-through' : 'none',
  }));

  return (
    <AnimatedTouchable
      style={[styles.container, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handleToggle}
      activeOpacity={0.9}
    >
      <View style={styles.checkbox}>
        {task.is_completed ? (
          <View style={styles.checkboxChecked}>
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          </View>
        ) : (
          <View style={styles.checkboxUnchecked} />
        )}
      </View>
      <Animated.Text style={[styles.title, textAnimatedStyle]}>
        {task.title}
      </Animated.Text>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  checkbox: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxUnchecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8E8E93',
  },
  checkboxChecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
    color: '#1C1C1E',
    fontWeight: '400',
  },
});
