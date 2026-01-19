import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useStore } from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { tasks, userStats, fetchUserStats } = useStore();

  useEffect(() => {
    fetchUserStats(30);
  }, []);

  const thisWeekStats = useMemo(() => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const stats = userStats.filter((stat) => new Date(stat.date) >= weekAgo);
    return {
      completed: stats.reduce((sum, s) => sum + s.tasks_completed, 0),
      created: stats.reduce((sum, s) => sum + s.tasks_created, 0),
    };
  }, [userStats]);

  const totalCompleted = tasks.filter((t) => t.is_completed).length;
  const activeTasks = tasks.filter((t) => !t.is_completed).length;

  const getHeatmapColor = (count: number) => {
    if (count === 0) return '#F9F9F9';
    if (count <= 2) return '#FFE5D9';
    if (count <= 5) return '#FFCAB0';
    if (count <= 8) return '#FF9E66';
    return '#FF6B00';
  };

  const generateHeatmapData = () => {
    const data: any[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const stat = userStats.find((s) => s.date === dateStr);
      data.push({
        date: dateStr,
        count: stat?.tasks_completed || 0,
        day: date.getDate(),
      });
    }
    return data;
  };

  const heatmapData = generateHeatmapData();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Your productivity insights</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="checkmark-circle" size={28} color="#34C759" />
            </View>
            <Text style={styles.statValue}>{totalCompleted}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="time-outline" size={28} color="#FF6B00" />
            </View>
            <Text style={styles.statValue}>{activeTasks}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="flame" size={28} color="#FF3B30" />
            </View>
            <Text style={styles.statValue}>{thisWeekStats.completed}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="trophy" size={28} color="#FFD700" />
            </View>
            <Text style={styles.statValue}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productivity Heatmap</Text>
          <Text style={styles.sectionSubtitle}>Last 30 days</Text>

          <View style={styles.heatmap}>
            {heatmapData.map((item, index) => (
              <View key={index} style={styles.heatmapCell}>
                <View
                  style={[
                    styles.heatmapDot,
                    { backgroundColor: getHeatmapColor(item.count) },
                  ]}
                />
                {index % 7 === 0 && (
                  <Text style={styles.heatmapLabel}>{item.day}</Text>
                )}
              </View>
            ))}
          </View>

          <View style={styles.heatmapLegend}>
            <Text style={styles.legendText}>Less</Text>
            <View style={styles.legendDots}>
              {[0, 2, 5, 8, 10].map((count, i) => (
                <View
                  key={i}
                  style={[
                    styles.legendDot,
                    { backgroundColor: getHeatmapColor(count) },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.legendText}>More</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          <View style={styles.guestBadge}>
            <Ionicons name="phone-portrait-outline" size={20} color="#FF6B00" />
            <Text style={styles.guestBadgeText}>Local Storage</Text>
          </View>
          <Text style={styles.guestInfo}>
            Your data is stored locally on this device using SQLite database.
            All tasks and categories are available offline.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 120,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    margin: 8,
    padding: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
    marginBottom: 16,
  },
  heatmap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
  },
  heatmapCell: {
    alignItems: 'center',
    margin: 2,
  },
  heatmapDot: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  heatmapLabel: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 4,
  },
  heatmapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  legendDots: {
    flexDirection: 'row',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginTop: 12,
  },
  actionButtonText: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 17,
    color: '#8E8E93',
    marginTop: 16,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF5F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD1B3',
    marginTop: 12,
  },
  guestBadgeText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FF6B00',
    marginLeft: 8,
  },
  guestInfo: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginTop: 12,
    paddingHorizontal: 4,
  },
});
