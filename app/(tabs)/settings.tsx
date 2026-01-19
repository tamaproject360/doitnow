import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeAuto, setDarkModeAuto] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const haptics = await AsyncStorage.getItem('hapticsEnabled');
      const notifications = await AsyncStorage.getItem('notificationsEnabled');
      const darkMode = await AsyncStorage.getItem('darkModeAuto');

      if (haptics !== null) setHapticsEnabled(haptics === 'true');
      if (notifications !== null)
        setNotificationsEnabled(notifications === 'true');
      if (darkMode !== null) setDarkModeAuto(darkMode === 'true');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleToggleHaptics = async (value: boolean) => {
    setHapticsEnabled(value);
    await AsyncStorage.setItem('hapticsEnabled', value.toString());
  };

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem('notificationsEnabled', value.toString());
  };

  const handleToggleDarkMode = async (value: boolean) => {
    setDarkModeAuto(value);
    await AsyncStorage.setItem('darkModeAuto', value.toString());
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="phone-portrait-outline" size={24} color="#FF6B00" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Haptic Feedback</Text>
                <Text style={styles.settingDescription}>
                  Feel vibrations on interactions
                </Text>
              </View>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={handleToggleHaptics}
              trackColor={{ false: '#E5E5EA', true: '#FFD1B3' }}
              thumbColor={hapticsEnabled ? '#FF6B00' : '#F9F9F9'}
              ios_backgroundColor="#E5E5EA"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={24} color="#FF6B00" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive task reminders
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#E5E5EA', true: '#FFD1B3' }}
              thumbColor={notificationsEnabled ? '#FF6B00' : '#F9F9F9'}
              ios_backgroundColor="#E5E5EA"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={24} color="#FF6B00" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Auto Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  Follow system appearance
                </Text>
              </View>
            </View>
            <Switch
              value={darkModeAuto}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: '#E5E5EA', true: '#FFD1B3' }}
              thumbColor={darkModeAuto ? '#FF6B00' : '#F9F9F9'}
              ios_backgroundColor="#E5E5EA"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>

          <TouchableOpacity style={styles.actionRow}>
            <Ionicons name="star-outline" size={24} color="#8E8E93" />
            <Text style={styles.actionLabel}>Rate Doitnow</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow}>
            <Ionicons name="help-circle-outline" size={24} color="#8E8E93" />
            <Text style={styles.actionLabel}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow}>
            <Ionicons name="document-text-outline" size={24} color="#8E8E93" />
            <Text style={styles.actionLabel}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow}>
            <Ionicons name="information-circle-outline" size={24} color="#8E8E93" />
            <Text style={styles.actionLabel}>About</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Doitnow v1.0.0</Text>
          <Text style={styles.footerSubtext}>
            Kerjakan sekarang untuk hidup lebih baik
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
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    paddingHorizontal: 16,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    minHeight: 72,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  settingDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    minHeight: 56,
  },
  actionLabel: {
    fontSize: 17,
    color: '#1C1C1E',
    flex: 1,
    marginLeft: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
