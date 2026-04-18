import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import { useUser } from '../contexts/UserContext';
import { InfoIcon, SettingsIcon } from './icons/ConditionIcons';

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.75;

const SideMenu = ({ visible, onClose, onSettingsPress, onAboutPress }) => {
  const { t } = useLanguage();
  const { speak } = useTTS();
  const { userData } = useUser();
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -MENU_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleSettingsPress = () => {
    speak('Opening Settings');
    onClose();
    setTimeout(() => onSettingsPress(), 300);
  };

  const handleAboutPress = () => {
    speak('Learn about CogniVerse');
    onClose();
    setTimeout(() => onAboutPress(), 300);
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(15, 23, 42, 0.4)', // Darker premium frost
    },
    menuContainer: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: MENU_WIDTH,
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 10, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 30,
      elevation: 20,
      borderTopRightRadius: 32,
      borderBottomRightRadius: 32,
      overflow: 'hidden',
    },
    menuHeader: {
      backgroundColor: '#4338CA', // Brand Indigo
      padding: 32,
      paddingTop: 80, // Safe area accommodation
      paddingBottom: 40,
      borderBottomRightRadius: 32,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '900',
      color: '#FFFFFF',
      marginBottom: 8,
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: 15,
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
    },
    menuContent: {
      flex: 1,
      paddingTop: 30,
      paddingHorizontal: 16,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F8FAFC',
      padding: 20,
      marginBottom: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#F1F5F9',
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 2,
    },
    menuIconBox: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: '#EEF2FF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    menuItemText: {
      fontSize: 18,
      fontWeight: '800',
      color: '#1E293B',
      marginBottom: 4,
    },
    menuItemDescription: {
      fontSize: 13,
      fontWeight: '600',
      color: '#64748B',
    },
    menuFooter: {
      padding: 24,
      alignItems: 'center',
    },
    appVersion: {
      fontSize: 13,
      fontWeight: '700',
      color: '#94A3B8',
      letterSpacing: 0.5,
    },
  });
  
  if (!visible) {
    return null;
  }

  return (
    <Modal visible={true} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
        
        <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
          {/* Deep Indigo Header */}
          <View style={styles.menuHeader}>
            <Text style={styles.headerTitle}>{t('appName')}</Text>
            <Text style={styles.headerSubtitle}>
              {userData?.name ? `Welcome, ${userData.name}!` : 'Nurturing Cognitive Growth'}
            </Text>
          </View>

          {/* Core Settings Routing */}
          <View style={styles.menuContent}>
            <TouchableOpacity style={styles.menuItem} onPress={handleSettingsPress} activeOpacity={0.8}>
              <View style={styles.menuIconBox}>
                <SettingsIcon size={24} color="#4338CA" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuItemText}>{t('settings')}</Text>
                <Text style={styles.menuItemDescription}>Device & App Preferences</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleAboutPress} activeOpacity={0.8}>
              <View style={styles.menuIconBox}>
                <InfoIcon size={24} color="#4338CA" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuItemText}>About CogniVerse</Text>
                <Text style={styles.menuItemDescription}>Our mission & platform details</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.menuFooter}>
            <Text style={styles.appVersion}>V1.0.0 — PREMIUM EDT.</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default SideMenu;
