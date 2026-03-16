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
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import { useUser } from '../contexts/UserContext';
import { DashboardIcon, InfoIcon, SettingsIcon } from './icons/ConditionIcons';

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.75;

const SideMenu = ({ visible, onClose, onSettingsPress, onDashboardPress, onConditionsPress }) => {
  const { currentTheme, currentTextSize, currentSpacing } = useTheme();
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
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleSettingsPress = () => {
    speak(t('openingSettings'));
    onClose();
    setTimeout(() => onSettingsPress(), 300);
  };

  const handleDashboardPress = () => {
    speak(t('openingDashboard'));
    onClose();
    setTimeout(() => onDashboardPress(), 300);
  };

  const handleConditionsPress = () => {
    speak(t('learnAboutConditions'));
    onClose();
    setTimeout(() => onConditionsPress(), 300);
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menuContainer: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: MENU_WIDTH,
      backgroundColor: currentTheme.colors.surface,
      shadowColor: currentTheme.colors.text,
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 16,
    },
    menuHeader: {
      backgroundColor: currentTheme.colors.primary,
      padding: 28 * currentSpacing.scale,
      paddingTop: 60 * currentSpacing.scale,
      paddingBottom: 28 * currentSpacing.scale,
    },
    headerTitle: {
      fontSize: 24 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.surface,
      marginBottom: 8 * currentSpacing.scale,
    },
    headerSubtitle: {
      fontSize: 14 * currentTextSize.scale,
      color: currentTheme.colors.surface,
      opacity: 0.9,
    },
    menuContent: {
      flex: 1,
      paddingTop: 20 * currentSpacing.scale,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20 * currentSpacing.scale,
      paddingLeft: 24 * currentSpacing.scale,
      marginHorizontal: 12 * currentSpacing.scale,
      marginVertical: 6 * currentSpacing.scale,
      borderRadius: 12 * currentSpacing.scale,
      backgroundColor: 'transparent',
    },
    menuIcon: {
      fontSize: 28 * currentTextSize.scale,
      marginRight: 16 * currentSpacing.scale,
      width: 40 * currentSpacing.scale,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuItemText: {
      fontSize: 18 * currentTextSize.scale,
      color: currentTheme.colors.text,
      fontWeight: '500',
    },
    menuItemDescription: {
      fontSize: 12 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      marginTop: 4 * currentSpacing.scale,
    },
    menuFooter: {
      padding: 24 * currentSpacing.scale,
      borderTopWidth: 1,
      borderTopColor: currentTheme.colors.border,
    },
    appVersion: {
      fontSize: 12 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      textAlign: 'center',
    },
  });
  
  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
        
        <Animated.View
          style={[
            styles.menuContainer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
              {/* Header */}
              <View style={styles.menuHeader}>
                <Text style={styles.headerTitle}>{t('appName')}</Text>
                <Text style={styles.headerSubtitle}>
                  {userData?.name ? `${t('hiUser')} ${userData.name}!` : t('appSubtitle')}
                </Text>
              </View>

              {/* Menu Items */}
              <View style={styles.menuContent}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleDashboardPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIcon}>
                    <DashboardIcon size={28 * currentTextSize.scale} color={currentTheme.colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.menuItemText}>{t('myProgress')}</Text>
                    <Text style={styles.menuItemDescription}>
                      {t('viewProgressAndAchievements')}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleConditionsPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIcon}>
                    <InfoIcon size={28 * currentTextSize.scale} color={currentTheme.colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.menuItemText}>{t('conditionsGuide.title')}</Text>
                    <Text style={styles.menuItemDescription}>
                      {t('learnAboutConditions')}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleSettingsPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIcon}>
                    <SettingsIcon size={28 * currentTextSize.scale} color={currentTheme.colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.menuItemText}>{t('settings')}</Text>
                    <Text style={styles.menuItemDescription}>
                      {t('customizeAppExperience')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.menuFooter}>
                <Text style={styles.appVersion}>CogniVerse v1.0.0</Text>
              </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default SideMenu;

