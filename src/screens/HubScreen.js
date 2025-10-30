import { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTTS } from '../contexts/TTSContext';
import SettingsScreen from './SettingsScreen';
import AutismCommunicationSuite from '../suites/AutismCommunicationSuite';
import ChildDashboardScreen from './ChildDashboardScreen';
import HelpModal from './HelpModal';

const HubScreen = () => {
  const { currentTheme, currentTextSize, currentSpacing } = useTheme();
  const { speak } = useTTS();
  const [currentScreen, setCurrentScreen] = useState('hub');
  const [showHelp, setShowHelp] = useState(false);

  const handleSuitePress = (suiteName, suiteDescription) => {
    speak(`Opening ${suiteName}. ${suiteDescription}`);
    if (suiteName === 'Autism & Communication') {
      setCurrentScreen('autism-suite');
    }
  };

  const handleSettingsPress = () => {
    speak('Opening settings');
    setCurrentScreen('settings');
  };

  const handleBackToHub = () => {
    speak('Returning to main menu');
    setCurrentScreen('hub');
  };

  const handleProfilePress = () => {
    speak('Opening child dashboard');
    setCurrentScreen('dashboard');
  };

  const handleHelpPress = () => {
    speak('Opening help');
    setShowHelp(true);
  };

  const handleCloseHelp = () => {
    setShowHelp(false);
  };

  if (currentScreen === 'autism-suite') {
    return <AutismCommunicationSuite onBack={handleBackToHub} />;
  }

  if (currentScreen === 'settings') {
    return <SettingsScreen onBack={handleBackToHub} />;
  }

  if (currentScreen === 'dashboard') {
    return <ChildDashboardScreen onBack={handleBackToHub} />;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
    header: {
      backgroundColor: currentTheme.colors.surface,
      padding: 20 * currentSpacing.scale,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border,
      alignItems: 'center',
    },
    title: {
      fontSize: 28 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 8 * currentSpacing.scale,
    },
    profileButton: {
      position: 'absolute',
      top: 20 * currentSpacing.scale,
      left: 20 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.primary,
      borderRadius: 25 * currentSpacing.scale,
      width: 50 * currentSpacing.scale,
      height: 50 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileIcon: {
      fontSize: 24 * currentTextSize.scale,
      color: currentTheme.colors.surface,
    },
    content: {
      flex: 1,
      padding: 20 * currentSpacing.scale,
    },
    suiteCard: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 16 * currentSpacing.scale,
      padding: 24 * currentSpacing.scale,
      marginBottom: 16 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
      shadowColor: currentTheme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    suiteTitle: {
      fontSize: 20 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
      marginBottom: 8 * currentSpacing.scale,
    },
    suiteDescription: {
      fontSize: 14 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      lineHeight: 20 * currentTextSize.scale,
    },
    settingsButton: {
      position: 'absolute',
      top: 20 * currentSpacing.scale,
      right: 20 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.primary,
      borderRadius: 25 * currentSpacing.scale,
      width: 50 * currentSpacing.scale,
      height: 50 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
    },
    settingsIcon: {
      fontSize: 24 * currentTextSize.scale,
      color: currentTheme.colors.surface,
    },
    helpButton: {
      position: 'absolute',
      bottom: 30 * currentSpacing.scale,
      right: 30 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.primary,
      borderRadius: 30 * currentSpacing.scale,
      width: 60 * currentSpacing.scale,
      height: 60 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: currentTheme.colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    helpIcon: {
      fontSize: 28 * currentTextSize.scale,
      color: currentTheme.colors.surface,
    },
  });

  const suites = [
    {
      id: 'autism-communication',
      name: 'Autism & Communication',
      description: 'Symbol-based communication board with AI-powered symbol generation. Perfect for non-verbal communication and learning.',
      icon: '🗣️',
      available: true,
    },
    {
      id: 'learning-basics',
      name: 'Learning Basics',
      description: 'Coming soon - Interactive lessons for basic life skills, numbers, and letters.',
      icon: '📚',
      available: false,
    },
    {
      id: 'social-skills',
      name: 'Social Skills',
      description: 'Coming soon - Practice social interactions and emotional recognition.',
      icon: '👥',
      available: false,
    },
    {
      id: 'games',
      name: 'Games',
      description: 'Coming soon - Engaging educational games to make learning fun and interactive.',
      icon: '🎮',
      available: false,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
        <Text style={styles.title}>CogniVerse</Text>
        <Text style={styles.subtitle}>Your Learning Companion</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {suites.map((suite) => (
          <TouchableOpacity
            key={suite.id}
            style={[
              styles.suiteCard,
              !suite.available && { opacity: 0.6 }
            ]}
            onPress={() => suite.available && handleSuitePress(suite.name, suite.description)}
            disabled={!suite.available}
          >
            <Text style={{ fontSize: 32, marginBottom: 12 * currentSpacing.scale }}>
              {suite.icon}
            </Text>
            <Text style={styles.suiteTitle}>{suite.name}</Text>
            <Text style={styles.suiteDescription}>{suite.description}</Text>
            {!suite.available && (
              <Text style={[styles.suiteDescription, { color: currentTheme.colors.primary, marginTop: 8 * currentSpacing.scale }]}>
                Coming Soon
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.helpButton} onPress={handleHelpPress}>
        <Text style={styles.helpIcon}>❓</Text>
      </TouchableOpacity>

      <HelpModal visible={showHelp} onClose={handleCloseHelp} sections={suites} />
    </SafeAreaView>
  );
};

export default HubScreen;