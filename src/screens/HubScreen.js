import { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Animated,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import SettingsScreen from './SettingsScreen';
import AutismCommunicationSuite from '../suites/AutismCommunicationSuite';
import SocialSkillsSuite from '../suites/SocialSkillsSuite';
import LearningBasicsSuite from '../suites/LearningBasicsSuite';
import ChildDashboardScreen from './ChildDashboardScreen';
import ConditionsGuideScreen from './ConditionsGuideScreen';
import HelpModal from './HelpModal';
import SideMenu from '../components/SideMenu';
// 1. Import the new ChatbotScreen
import ChatbotScreen from './ChatbotScreen';
import {
  MenuIcon,
  ChatbotIcon,
  HelpIcon,
  CommunicationIcon,
  LearningIcon,
  SocialIcon,
  GamesIcon,
} from '../components/icons/ConditionIcons'; 

const HubScreen = () => {
  const { currentTheme, currentTextSize, currentSpacing } = useTheme();
  const { t } = useLanguage();
  const { speak } = useTTS();
  const [currentScreen, setCurrentScreen] = useState('hub');
  const [showHelp, setShowHelp] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation for buttons
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleSuitePress = (suiteId) => {
    const suiteName = t(`suites.${suiteId}.name`);
    const suiteDescription = t(`suites.${suiteId}.description`);
    speak(`${suiteName}. ${suiteDescription}`);
    if (suiteId === 'autismCommunication') {
      setCurrentScreen('autism-suite');
    }
    if (suiteId === 'learningBasics') {
      setCurrentScreen('learning-basics-suite');
    }
    if (suiteId === 'socialSkills') {
      setCurrentScreen('social-skills-suite');
    }
  };

  const handleMenuPress = () => {
    speak(t('openingMenu'));
    setShowMenu(true);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  const handleSettingsPress = () => {
    setCurrentScreen('settings');
  };

  const handleBackToHub = () => {
    speak(t('returningToMenu'));
    setCurrentScreen('hub');
  };

  const handleDashboardPress = () => {
    setCurrentScreen('dashboard');
  };

  const handleConditionsPress = () => {
    setCurrentScreen('conditions');
  };

  const handleChatbotPress = () => {
    speak(t('openingAIHelper'));
    setCurrentScreen('chatbot');
  };

  const handleHelpPress = () => {
    speak(t('openingHelp'));
    setShowHelp(true);
  };

  const handleCloseHelp = () => {
    setShowHelp(false);
  };

  if (currentScreen === 'autism-suite') {
    return <AutismCommunicationSuite onBack={handleBackToHub} />;
  }

  if (currentScreen === 'learning-basics-suite') {
    return <LearningBasicsSuite onBack={handleBackToHub} />;
  }

  if (currentScreen === 'social-skills-suite') {
    return <SocialSkillsSuite onBack={handleBackToHub} />;
  }

  if (currentScreen === 'settings') {
    return <SettingsScreen onBack={handleBackToHub} />;
  }

  if (currentScreen === 'dashboard') {
    return <ChildDashboardScreen onBack={handleBackToHub} />;
  }

  if (currentScreen === 'conditions') {
    return <ConditionsGuideScreen onBack={handleBackToHub} />;
  }

  // This 'if' block remains the same
  if (currentScreen === 'chatbot') {
    return <ChatbotScreen onBack={handleBackToHub} />;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
    header: {
      backgroundColor: currentTheme.colors.primary,
      padding: 16 * currentSpacing.scale,
      paddingTop: 50 * currentSpacing.scale,
      paddingBottom: 24 * currentSpacing.scale,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 12 * currentSpacing.scale,
    },
    title: {
      fontSize: 32 * currentTextSize.scale,
      fontWeight: '800',
      color: '#FFFFFF',
      position: 'absolute',
      left: 0,
      right: 0,
      textAlign: 'center',
      zIndex: -1,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: 15 * currentTextSize.scale,
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
      fontWeight: '500',
    },
    menuButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      borderRadius: 25 * currentSpacing.scale,
      width: 50 * currentSpacing.scale,
      height: 50 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    menuIcon: {
      fontSize: 24 * currentTextSize.scale,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
      padding: 20 * currentSpacing.scale,
    },
    suiteCard: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 24 * currentSpacing.scale,
      padding: 24 * currentSpacing.scale,
      marginBottom: 20 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: currentTheme.colors.border || 'rgba(0,0,0,0.05)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
      overflow: 'hidden',
    },
    suiteTitle: {
      fontSize: 24 * currentTextSize.scale,
      fontWeight: '700',
      color: currentTheme.colors.text,
      marginBottom: 12 * currentSpacing.scale,
      letterSpacing: 0.5,
    },
    suiteDescription: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      lineHeight: 24 * currentTextSize.scale,
      fontWeight: '400',
    },
    suiteIconContainer: {
      width: 80 * currentSpacing.scale,
      height: 80 * currentSpacing.scale,
      borderRadius: 24 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20 * currentSpacing.scale,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    chatbotButton: {
      position: 'absolute',
      bottom: 30 * currentSpacing.scale,
      left: 30 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.accent,
      borderRadius: 32 * currentSpacing.scale,
      width: 68 * currentSpacing.scale,
      height: 68 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: currentTheme.colors.accent,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 12,
    },
    chatbotIcon: {
      fontSize: 32 * currentTextSize.scale,
      color: '#FFFFFF',
    },
    helpButton: {
      position: 'absolute',
      bottom: 30 * currentSpacing.scale,
      right: 30 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.secondary,
      borderRadius: 32 * currentSpacing.scale,
      width: 68 * currentSpacing.scale,
      height: 68 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: currentTheme.colors.secondary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 12,
    },
    helpIcon: {
      fontSize: 32 * currentTextSize.scale,
      color: '#FFFFFF',
    },
  });

  const suites = [
    {
      id: 'autismCommunication',
      IconComponent: CommunicationIcon,
      color: '#6366F1',
      available: true,
    },
    {
      id: 'learningBasics',
      IconComponent: LearningIcon,
      color: '#10B981',
      available: true,
    },
    {
      id: 'socialSkills',
      IconComponent: SocialIcon,
      color: '#F59E0B',
      available: true,
    },
    {
      id: 'games',
      IconComponent: GamesIcon,
      color: '#8B5CF6',
      available: false,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={handleMenuPress}
            activeOpacity={0.7}
          >
            <MenuIcon size={24 * currentTextSize.scale} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>{t('appName')}</Text>
        </View>
        <Text style={styles.subtitle}>{t('appSubtitle')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {suites.map((suite, index) => (
          <Animated.View
            key={suite.id}
            style={{
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }}
          >
            <TouchableOpacity
              style={[
                styles.suiteCard,
                !suite.available && { opacity: 0.6 }
              ]}
              onPress={() => suite.available && handleSuitePress(suite.id)}
              disabled={!suite.available}
              activeOpacity={0.85}
            >
              <View style={[styles.suiteIconContainer, { backgroundColor: suite.color + '15' }]}>
                <suite.IconComponent size={50 * currentSpacing.scale} color={suite.color} />
              </View>
              <Text style={styles.suiteTitle}>{t(`suites.${suite.id}.name`)}</Text>
              <Text style={styles.suiteDescription}>{t(`suites.${suite.id}.description`)}</Text>
              {!suite.available && (
                <Text style={[styles.suiteDescription, { color: currentTheme.colors.primary, marginTop: 8 * currentSpacing.scale, fontWeight: '600' }]}>
                  {t('comingSoon')}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Floating Action Buttons */}
      <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
        <TouchableOpacity 
          style={styles.chatbotButton} 
          onPress={handleChatbotPress}
          activeOpacity={0.8}
        >
          <ChatbotIcon size={36 * currentTextSize.scale} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
        <TouchableOpacity 
          style={styles.helpButton} 
          onPress={handleHelpPress}
          activeOpacity={0.8}
        >
          <HelpIcon size={36 * currentTextSize.scale} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      <HelpModal visible={showHelp} onClose={handleCloseHelp} context="hub" />
      
      <SideMenu
        visible={showMenu}
        onClose={handleCloseMenu}
        onSettingsPress={handleSettingsPress}
        onDashboardPress={handleDashboardPress}
        onConditionsPress={handleConditionsPress}
      />
    </SafeAreaView>
  );
};

export default HubScreen;