import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  Animated,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { useTTS } from '../contexts/TTSContext';
import { useUser } from '../contexts/UserContext';
import { BackArrowIcon } from '../components/icons/ConditionIcons';

import StatTile from '../components/StatTile';
import WeeklyChart from '../components/WeeklyChart';
import { SHADOWS } from '../theme';

const CONDITIONS = [
  'Autism Spectrum Disorder',
  'Down Syndrome',
  'Dyslexia',
  'Intellectual Disability',
  'Other',
];

const ChildDashboardScreen = ({ onBack }: { onBack: () => void }) => {
  const { currentTheme } = useTheme();
  const { speak } = useTTS();
  const { userData, updateUserData, logout, logActivity } = useUser();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editCondition, setEditCondition] = useState('');
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Pulse logic for streak
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 600, useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0, tension: 40, friction: 8, useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for the flame
    Animated.loop(
       Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
       ])
    ).start();
  }, []);

  useEffect(() => {
    if (userData) {
      setEditName(userData.name || '');
      setEditAge(userData.age?.toString() || '');
      setEditCondition(userData.condition || '');
    }
  }, [userData]);

  const handleBack = () => {
    speak('Returning to home');
    onBack();
  };

  const handleLogout = () => {
    speak('Logging out');
    logout(); 
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
  };

  const stats = userData?.activityStats || { 
    totalActivities: 312, 
    totalMinutes: 1450, 
    milestones: 12, 
    streak: 14 
  };

  // Extract initial for avatar
  const getInitial = () => {
     if (userData?.name && userData.name.trim().length > 0) {
        return userData.name.trim().charAt(0).toUpperCase();
     }
     return '👤';
  };

  const recentList = [
    { id: 1, name: 'Colors Quiz', date: 'Today, 2:30 PM', icon: '🎨', color: '#EC4899' },
    { id: 2, name: 'Morning Routine', date: 'Today, 8:00 AM', icon: '☀️', color: '#F59E0B' },
    { id: 3, name: 'Numbers 1-10', date: 'Yesterday', icon: '🔢', color: '#3B82F6' },
  ];

  return (
    <View style={styles.container}>
      {/* Dark Purple Native Wave */}
      <View style={styles.waveContainer}>
        <Svg height={300} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
            <LinearGradient id="condGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#4B3FD8" />
              <Stop offset="50%" stopColor="#312E81" />
              <Stop offset="100%" stopColor="#1E1B4B" />
            </LinearGradient>
          </Defs>
          <Path 
            fill="url(#condGrad)" 
            d="M0,224L48,202.7C96,181,192,139,288,138.7C384,139,480,181,576,192C672,203,768,181,864,154.7C960,128,1056,96,1152,90.7C1248,85,1344,107,1392,117.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" 
          />
        </Svg>
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
            <BackArrowIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>Analytics Hub</Text>
            <Text style={styles.subtitle}>Child Profile</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Profile Card Fixed */}
          <Animated.View style={[styles.glassCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.profileRow}>
              <View style={styles.avatarCircle}>
                 <Text style={styles.avatarInitial} allowFontScaling={false}>{getInitial()}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userData?.name || 'Child Name'}</Text>
                <Text style={styles.profileDetail}>{userData?.age || '5'} years old • {userData?.condition || 'Autism Spectrum'}</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={handleEdit} activeOpacity={0.8}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Celebratory Streak Banner */}
          <TouchableOpacity activeOpacity={0.9} onPress={() => logActivity('Demo', 5)}>
            <Animated.View style={[styles.streakBanner, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.streakTextContainer}>
                <Text style={styles.streakTitle}>Current Streak</Text>
                <Text style={styles.streakValue}>{stats.streak} Days</Text>
                <Text style={styles.streakSubtext}>Keep it up! Incredible work!</Text>
              </View>
              <Animated.Text style={[styles.streakIcon, { transform: [{ scale: pulseAnim }] }]} allowFontScaling={false}>
                 🔥
              </Animated.Text>
            </Animated.View>
          </TouchableOpacity>

          {/* Lifetime Analytics */}
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <Text style={styles.sectionHeader}>Lifetime Analytics</Text>
            <View style={styles.statsGrid}>
               <StatTile title="Activities Done" value={stats.totalActivities} color="#4B3FD8" icon="✅" index={0} />
               <StatTile title="Total Minutes" value={stats.totalMinutes} color="#14B8A6" icon="⏱️" index={1} />
               <StatTile title="Major Milestones" value={stats.milestones} color="#10B981" icon="🏆" index={2} />
               <StatTile title="Current Week" value={35} color="#F59E0B" icon="📈" index={3} />
            </View>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
             <WeeklyChart />
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
             <Text style={styles.sectionHeader}>Recent Activities</Text>
             <View style={styles.activityList}>
                {recentList.map((act) => (
                   <View key={act.id} style={styles.activityItem}>
                      <View style={[styles.activityIconWrap, { backgroundColor: act.color + '15' }]}>
                         <Text style={{fontSize: 22}}>{act.icon}</Text>
                      </View>
                      <View style={{flex: 1}}>
                         <Text style={styles.actName}>{act.name}</Text>
                         <Text style={styles.actDate}>{act.date}</Text>
                      </View>
                   </View>
                ))}
             </View>
          </Animated.View>

          <View style={{height: 60}}/>
        </ScrollView>

        {/* Modal Logic Inherited */}
        <Modal visible={editModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleCancelEdit}>
                  <Text style={{ fontSize: 24, color: '#94A3B8' }}>✕</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.modalInput}
                placeholder="Name"
                placeholderTextColor="#94A3B8"
                value={editName}
                onChangeText={setEditName}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Age"
                placeholderTextColor="#94A3B8"
                value={editAge}
                onChangeText={setEditAge}
                keyboardType="numeric"
              />

              <View style={{ zIndex: 100 }}>
                <TouchableOpacity
                  style={styles.modalDropdownButton}
                  onPress={() => setShowConditionDropdown(!showConditionDropdown)}
                >
                  <Text style={{ color: editCondition ? '#1E293B' : '#94A3B8', fontSize: 16 }}>
                    {editCondition || 'Select Condition'}
                  </Text>
                  <Text style={{ color: '#94A3B8' }}>{showConditionDropdown ? '▲' : '▼'}</Text>
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
                        <Text style={{ fontSize: 16, color: '#1E293B' }}>{condition}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>

              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={handleCancelEdit}>
                  <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.modalButtonSave]} onPress={handleSaveEdit}>
                  <Text style={styles.modalButtonTextSave}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Full bounding wrapper
    backgroundColor: '#F8F7FF',
  },
  waveContainer: { position: 'absolute', top: 0, left: 0, right: 0 },
  headerTop: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginTop: 20, zIndex: 10 },
  backButton: { backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: 16, width: 44, height: 44, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  headerTitles: { flex: 1, alignItems: 'center', marginRight: 48 },
  title: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.3, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 },
  subtitle: { fontSize: 13, color: 'rgba(255, 255, 255, 0.95)', fontWeight: '700', marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 },
  scrollContent: { paddingTop: 100, paddingHorizontal: 20, paddingBottom: 40 },
  
  // Custom Aesthetics Card Area
  glassCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, marginBottom: 20, ...SHADOWS.md, borderWidth: 1, borderColor: '#F1F5F9' },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatarCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 16, borderWidth: 2, borderColor: '#E0E7FF' },
  avatarInitial: { fontSize: 32, fontWeight: '900', color: '#4B3FD8' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 24, fontWeight: '900', color: '#1E293B', marginBottom: 6, letterSpacing: -0.2 },
  profileDetail: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  
  // Re-weighted Buttons Logic
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  logoutButton: { flex: 1, backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderWidth: 2, borderRadius: 16, paddingVertical: 14, marginRight: 8, alignItems: 'center' },
  logoutButtonText: { color: '#94A3B8', fontSize: 15, fontWeight: '800' },
  editButton: { flex: 2, backgroundColor: '#4B3FD8', borderRadius: 16, paddingVertical: 14, marginLeft: 8, alignItems: 'center', shadowColor: '#4B3FD8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  editButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  
  // Celebratory Streak Layout
  streakBanner: { backgroundColor: '#F59E0B', borderRadius: 24, padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, ...SHADOWS.colored('#F59E0B'), overflow: 'hidden' },
  streakTextContainer: { flex: 1 },
  streakTitle: { fontSize: 16, color: '#FFFBEB', fontWeight: '800', opacity: 0.9, textTransform: 'uppercase', letterSpacing: 0.5 },
  streakValue: { fontSize: 44, color: '#FFFFFF', fontWeight: '900', marginTop: 0, marginBottom: 4, letterSpacing: -1 },
  streakSubtext: { fontSize: 14, color: '#FEF3C7', fontWeight: '600' },
  streakIcon: { fontSize: 52 },
  
  sectionHeader: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 16, paddingHorizontal: 4, letterSpacing: -0.2 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },

  // Recent List Layout Native
  activityList: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 12, ...SHADOWS.sm, borderWidth: 1, borderColor: '#F1F5F9' },
  activityItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  activityIconWrap: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  actName: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  actDate: { fontSize: 13, color: '#94A3B8', fontWeight: '600' },

  // Edit Modals untouched layout bound to React logic
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 28, width: '90%', ...SHADOWS.xl },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#1E293B' },
  modalInput: { backgroundColor: '#F1F5F9', borderRadius: 16, padding: 16, fontSize: 16, color: '#1E293B', marginBottom: 16, fontWeight: '600' },
  modalDropdownButton: { backgroundColor: '#F1F5F9', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  modalDropdownList: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', maxHeight: 200, marginBottom: 16 },
  modalDropdownItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  modalButton: { flex: 1, padding: 16, borderRadius: 16, alignItems: 'center' },
  modalButtonCancel: { backgroundColor: '#F1F5F9', marginRight: 8 },
  modalButtonSave: { backgroundColor: '#4B3FD8', marginLeft: 8 },
  modalButtonTextSave: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  modalButtonTextCancel: { color: '#64748B', fontSize: 16, fontWeight: '800' },
});

export default ChildDashboardScreen;
