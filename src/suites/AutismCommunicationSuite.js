import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import CommunicationBoardScreen from '../screens/CommunicationBoardScreen';
import SentenceBuilderScreen from '../screens/SentenceBuilderScreen';
import FeelingsFinderScreen from '../screens/FeelingsFinderScreen';
import StoryTimeScreen from '../screens/StoryTimeScreen';
import HelpModal from '../screens/HelpModal';
import {
  BackArrowIcon,
  HelpIcon,
  MyVoiceIcon,
  LearnToBuildIcon,
  FeelingsFinderIcon,
  StoryTimeIcon,
} from '../components/icons/ConditionIcons';

const AutismCommunicationSuite = ({ onBack }) => {
  const { currentTheme, currentTextSize, currentSpacing } = useTheme();
  const { t } = useLanguage();
  const { speak } = useTTS();
  const [currentScreen, setCurrentScreen] = useState('main');
  const [showHelp, setShowHelp] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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
  }, []);

  const handleFeaturePress = (featureId, featureName, featureDescription) => {
    speak(`Opening ${featureName}. ${featureDescription}`);
    setCurrentScreen(featureId);
  };

  const handleBackToMain = () => {
    speak('Returning to main menu');
    setCurrentScreen('main');
  };

  const handleHelpPress = () => {
    speak(t('openingHelpForSuite'));
    setShowHelp(true);
  };

  const handleCloseHelp = () => {
    setShowHelp(false);
  };

  // Render different screens based on current selection
  if (currentScreen === 'my-voice') {
    return <CommunicationBoardScreen onBack={handleBackToMain} />;
  }
  if (currentScreen === 'learn-to-build') {
    return <SentenceBuilderScreen onBack={handleBackToMain} />;
  }
  if (currentScreen === 'feelings-finder') {
    return <FeelingsFinderScreen onBack={handleBackToMain} />;
  }
  if (currentScreen === 'story-time') {
    return <StoryTimeScreen onBack={handleBackToMain} />;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: currentTheme.colors.surface,
      padding: 16 * currentSpacing.scale,
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
      shadowColor: currentTheme.colors.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
    backIcon: {
      fontSize: 24 * currentTextSize.scale,
      color: currentTheme.colors.surface,
    },
    headerTitle: {
      fontSize: 24 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
      flex: 1,
    },
    subtitle: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 8 * currentSpacing.scale,
    },
    content: {
      flex: 1,
      padding: 20 * currentSpacing.scale,
    },
    featureCard: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 24 * currentSpacing.scale,
      padding: 28 * currentSpacing.scale,
      marginBottom: 20 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: currentTheme.colors.border || 'rgba(0,0,0,0.05)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
    },
    featureIconContainer: {
      alignItems: 'center',
      marginBottom: 20 * currentSpacing.scale,
    },
    featureIcon: {
      fontSize: 48 * currentTextSize.scale,
      textAlign: 'center',
      marginBottom: 16 * currentSpacing.scale,
    },
    featureTitle: {
      fontSize: 24 * currentTextSize.scale,
      fontWeight: '700',
      color: currentTheme.colors.text,
      textAlign: 'center',
      marginBottom: 12 * currentSpacing.scale,
      letterSpacing: 0.5,
    },
    featureDescription: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24 * currentTextSize.scale,
    },
    comingSoonBadge: {
      backgroundColor: currentTheme.colors.primary,
      paddingHorizontal: 12 * currentSpacing.scale,
      paddingVertical: 6 * currentSpacing.scale,
      borderRadius: 20 * currentSpacing.scale,
      alignSelf: 'center',
      marginTop: 12 * currentSpacing.scale,
    },
    comingSoonText: {
      color: currentTheme.colors.surface,
      fontSize: 12 * currentTextSize.scale,
      fontWeight: '600',
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
      fontSize: 28 * currentTextSize.scale,
      color: currentTheme.colors.surface,
    },
  });

  const features = [
    {
      id: 'my-voice',
      nameKey: 'autismFeatures.myVoice.name',
      descriptionKey: 'autismFeatures.myVoice.description',
      IconComponent: MyVoiceIcon,
      color: '#6366F1',
      available: true,
    },
    {
      id: 'learn-to-build',
      nameKey: 'autismFeatures.learnToBuild.name',
      descriptionKey: 'autismFeatures.learnToBuild.description',
      IconComponent: LearnToBuildIcon,
      color: '#10B981',
      available: true,
    },
    {
      id: 'feelings-finder',
      nameKey: 'autismFeatures.feelingsFinder.name',
      descriptionKey: 'autismFeatures.feelingsFinder.description',
      IconComponent: FeelingsFinderIcon,
      color: '#F59E0B',
      available: true,
    },
    {
      id: 'story-time',
      nameKey: 'autismFeatures.storyTime.name',
      descriptionKey: 'autismFeatures.storyTime.description',
      IconComponent: StoryTimeIcon,
      color: '#8B5CF6',
      available: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBack}
            activeOpacity={0.7}
          >
            <BackArrowIcon size={24 * currentTextSize.scale} color={currentTheme.colors.surface} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Autism & Communication</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {features.map((feature, index) => (
          <Animated.View
            key={feature.id}
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
                styles.featureCard,
                !feature.available && { opacity: 0.6 }
              ]}
              onPress={() => feature.available && handleFeaturePress(feature.id, t(feature.nameKey), t(feature.descriptionKey))}
              disabled={!feature.available}
              activeOpacity={0.85}
            >
              <View style={styles.featureIconContainer}>
                <feature.IconComponent size={56 * currentSpacing.scale} color={feature.color} />
              </View>
              <Text style={styles.featureTitle}>{t(feature.nameKey)}</Text>
              <Text style={styles.featureDescription}>{t(feature.descriptionKey)}</Text>
              {!feature.available && (
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Coming Soon</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.helpButton} 
        onPress={handleHelpPress}
        activeOpacity={0.8}
      >
        <HelpIcon size={36 * currentTextSize.scale} color="#FFFFFF" />
      </TouchableOpacity>

      <HelpModal visible={showHelp} onClose={handleCloseHelp} context="autismSuite" />
    </SafeAreaView>
  );
};

export default AutismCommunicationSuite;