import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTTS } from '../contexts/TTSContext';
import { useUser } from '../contexts/UserContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CONDITIONS = [
  'Autism Spectrum Disorder',
  'Down Syndrome',
  'ADHD',
  'Dyslexia',
  'Cerebral Palsy',
  'Intellectual Disability',
  'Speech Delay',
  'Other',
];

const ChildDashboardScreen = ({ onBack }) => {
  const { currentTheme, currentTextSize, currentSpacing } = useTheme();
  const { speak } = useTTS();
  const { userData, updateUserData } = useUser();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editCondition, setEditCondition] = useState('');
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);

  // Daily login tracking - in a real app, this would be fetched from storage
  const [loginStreak, setLoginStreak] = useState(0);
  const [monthlyLogins, setMonthlyLogins] = useState([]);

  // Progress data - in a real app, this would be calculated from activity performance
  const [progressData] = useState([
    { week: 'Week 1', score: 45 },
    { week: 'Week 2', score: 52 },
    { week: 'Week 3', score: 58 },
    { week: 'Week 4', score: 65 },
  ]);

  useEffect(() => {
    // Simulate fetching login data
    const mockLogins = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
      loggedIn: Math.random() > 0.3, // Random data for demo
    }));
    setMonthlyLogins(mockLogins);
    setLoginStreak(calculateStreak(mockLogins));
  }, []);

  const calculateStreak = (logins) => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = logins.length - 1; i >= 0; i--) {
      const loginDate = new Date(logins[i].date);
      loginDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - loginDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak && logins[i].loggedIn) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }
    return streak;
  };

  useEffect(() => {
    if (userData) {
      setEditName(userData.name || '');
      setEditAge(userData.age?.toString() || '');
      setEditCondition(userData.condition || '');
    }
  }, [userData]);

  const handleBack = () => {
    speak('Returning to main menu');
    onBack();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editName || !editAge || !editCondition) {
      speak('Please fill in all fields');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const result = await updateUserData({
      name: editName,
      age: parseInt(editAge),
      condition: editCondition,
    });

    if (result.success) {
      setEditModalVisible(false);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setIsEditing(false);
    if (userData) {
      setEditName(userData.name || '');
      setEditAge(userData.age?.toString() || '');
      setEditCondition(userData.condition || '');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: currentTheme.colors.surface,
      padding: 20 * currentSpacing.scale,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border,
    },
    backButton: {
      backgroundColor: currentTheme.colors.primary,
      borderRadius: 25 * currentSpacing.scale,
      width: 50 * currentSpacing.scale,
      height: 50 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16 * currentSpacing.scale,
    },
    backIcon: {
      fontSize: 24 * currentTextSize.scale,
      color: currentTheme.colors.surface,
    },
    headerTitle: {
      fontSize: 24 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
    },
    content: {
      flex: 1,
      padding: 20 * currentSpacing.scale,
    },
    section: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 16 * currentSpacing.scale,
      padding: 24 * currentSpacing.scale,
      marginBottom: 20 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
      shadowColor: currentTheme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 20 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
      marginBottom: 16 * currentSpacing.scale,
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12 * currentSpacing.scale,
    },
    profileIcon: {
      fontSize: 48 * currentTextSize.scale,
      marginRight: 16 * currentSpacing.scale,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: 22 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
      marginBottom: 4 * currentSpacing.scale,
    },
    profileDetail: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      marginBottom: 2 * currentSpacing.scale,
    },
    streakContainer: {
      alignItems: 'center',
      marginVertical: 20 * currentSpacing.scale,
    },
    streakNumber: {
      fontSize: 48 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.primary,
      marginBottom: 8 * currentSpacing.scale,
    },
    streakLabel: {
      fontSize: 18 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
    },
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    calendarDay: {
      width: (SCREEN_WIDTH - 80) / 7 - 4,
      height: 32,
      borderRadius: 4,
      marginBottom: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    calendarDayActive: {
      backgroundColor: currentTheme.colors.primary,
    },
    calendarDayInactive: {
      backgroundColor: currentTheme.colors.border,
      opacity: 0.3,
    },
    graphContainer: {
      height: 200,
      marginTop: 10,
    },
    graphBar: {
      backgroundColor: currentTheme.colors.primary,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    weekLabel: {
      fontSize: 12 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 8 * currentSpacing.scale,
    },
    legend: {
      fontSize: 12 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 8 * currentSpacing.scale,
    },
    editButton: {
      backgroundColor: currentTheme.colors.primary,
      borderRadius: 8 * currentSpacing.scale,
      padding: 8 * currentSpacing.scale,
      marginTop: 12 * currentSpacing.scale,
      alignSelf: 'flex-end',
    },
    editButtonText: {
      color: currentTheme.colors.surface,
      fontSize: 14 * currentTextSize.scale,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 16 * currentSpacing.scale,
      padding: 24 * currentSpacing.scale,
      width: '90%',
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20 * currentSpacing.scale,
    },
    modalTitle: {
      fontSize: 22 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
    },
    modalInput: {
      backgroundColor: currentTheme.colors.background,
      borderRadius: 8 * currentSpacing.scale,
      padding: 12 * currentSpacing.scale,
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.text,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
      marginBottom: 16 * currentSpacing.scale,
    },
    modalDropdown: {
      marginBottom: 20 * currentSpacing.scale,
    },
    modalDropdownButton: {
      backgroundColor: currentTheme.colors.background,
      borderRadius: 8 * currentSpacing.scale,
      padding: 12 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalDropdownItem: {
      padding: 12 * currentSpacing.scale,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border,
    },
    modalDropdownList: {
      backgroundColor: currentTheme.colors.background,
      borderRadius: 8 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
      marginTop: 4 * currentSpacing.scale,
      maxHeight: 200,
    },
    modalButtonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20 * currentSpacing.scale,
    },
    modalButton: {
      flex: 1,
      padding: 12 * currentSpacing.scale,
      borderRadius: 8 * currentSpacing.scale,
      alignItems: 'center',
      marginHorizontal: 8 * currentSpacing.scale,
    },
    modalButtonCancel: {
      backgroundColor: currentTheme.colors.border,
    },
    modalButtonSave: {
      backgroundColor: currentTheme.colors.primary,
    },
    modalButtonText: {
      fontSize: 16 * currentTextSize.scale,
      fontWeight: 'bold',
    },
  });

  const maxScore = Math.max(...progressData.map(d => d.score), 100);
  const graphHeight = 150;
  const barWidth = (SCREEN_WIDTH - 80) / progressData.length - 16;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Child Dashboard</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.profileRow}>
            <Text style={styles.profileIcon}>👤</Text>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userData?.name || 'Not set'}</Text>
              <Text style={styles.profileDetail}>Age: {userData?.age || 'Not set'} years old</Text>
              <Text style={styles.profileDetail}>Condition: {userData?.condition || 'Not set'}</Text>
              <Text style={styles.profileDetail}>Email: {userData?.email || 'Not set'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Login Calendar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Login Streak</Text>
          <View style={styles.streakContainer}>
            <Text style={styles.streakNumber}>{loginStreak}</Text>
            <Text style={styles.streakLabel}>Day Streak 🔥</Text>
          </View>
          <View style={styles.calendarGrid}>
            {monthlyLogins.map((day, index) => (
              <View
                key={index}
                style={[
                  styles.calendarDay,
                  day.loggedIn ? styles.calendarDayActive : styles.calendarDayInactive,
                ]}
              />
            ))}
          </View>
          <Text style={styles.legend}>Last 30 days login history</Text>
        </View>

        {/* Progress Graph */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress Overview</Text>
          <View style={styles.graphContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', height: graphHeight, alignItems: 'flex-end' }}>
              {progressData.map((data, index) => {
                const barHeight = (data.score / maxScore) * graphHeight;
                return (
                  <View key={index} style={{ alignItems: 'center', flex: 1 }}>
                    <View
                      style={[
                        styles.graphBar,
                        {
                          width: barWidth,
                          height: barHeight,
                          backgroundColor: currentTheme.colors.primary,
                        },
                      ]}
                    />
                    <Text style={styles.weekLabel}>{data.week}</Text>
                    <Text style={styles.weekLabel}>{data.score}%</Text>
                  </View>
                );
              })}
            </View>
          </View>
          <Text style={styles.legend}>
            Improvement in cognitive thinking and activity engagement
          </Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={handleCancelEdit}>
                <Text style={{ fontSize: 24 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Name"
              value={editName}
              onChangeText={setEditName}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Age"
              value={editAge}
              onChangeText={setEditAge}
              keyboardType="numeric"
            />

            <View style={styles.modalDropdown}>
              <TouchableOpacity
                style={styles.modalDropdownButton}
                onPress={() => setShowConditionDropdown(!showConditionDropdown)}
              >
                <Text>{editCondition || 'Select Condition'}</Text>
                <Text>{showConditionDropdown ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {showConditionDropdown && (
                <ScrollView style={styles.modalDropdownList} nestedScrollEnabled={true}>
                  {CONDITIONS.map((condition, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.modalDropdownItem}
                      onPress={() => {
                        setEditCondition(condition);
                        setShowConditionDropdown(false);
                      }}
                    >
                      <Text>{condition}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={handleCancelEdit}
              >
                <Text style={[styles.modalButtonText, { color: currentTheme.colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleSaveEdit}
              >
                <Text style={[styles.modalButtonText, { color: currentTheme.colors.surface }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ChildDashboardScreen;

