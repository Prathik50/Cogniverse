import React, { useState } from 'react';
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
import CommunicationBoardScreen from '../screens/CommunicationBoardScreen';
import SentenceBuilderScreen from '../screens/SentenceBuilderScreen';
import FeelingsFinderScreen from '../screens/FeelingsFinderScreen';
import StoryTimeScreen from '../screens/StoryTimeScreen';

const AutismCommunicationSuite = ({ onBack }) => {
  const { currentTheme, currentTextSize, currentSpacing } = useTheme();
  const { speak } = useTTS();
  const [currentScreen, setCurrentScreen] = useState('main');

  const handleFeaturePress = (featureName, featureDescription) => {
    speak(`Opening ${featureName}. ${featureDescription}`);
    setCurrentScreen(featureName.toLowerCase().replace(/\s+/g, '-'));
  };

  const handleBackToMain = () => {
    speak('Returning to main menu');
    setCurrentScreen('main');
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
      borderRadius: 20 * currentSpacing.scale,
      padding: 24 * currentSpacing.scale,
      marginBottom: 20 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
      shadowColor: currentTheme.colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 5,
    },
    featureIcon: {
      fontSize: 48 * currentTextSize.scale,
      textAlign: 'center',
      marginBottom: 16 * currentSpacing.scale,
    },
    featureTitle: {
      fontSize: 22 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
      textAlign: 'center',
      marginBottom: 12 * currentSpacing.scale,
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
  });

  const features = [
    {
      id: 'my-voice',
      name: 'My Voice',
      description: 'AI-powered communication board with unlimited vocabulary. Tap symbols or type any word to create custom symbols and voice instantly.',
      icon: '🗣️',
      available: true,
    },
    {
      id: 'learn-to-build',
      name: 'Learn to Build',
      description: 'Start with simple words and progress to building sentences. Interactive learning from single words to complete sentences with visual guidance.',
      icon: '🧩',
      available: true,
    },
    {
      id: 'feelings-finder',
      name: 'Feelings Finder',
      description: 'Develop emotional literacy by exploring different emotions. Tap faces to learn about feelings and their contexts.',
      icon: '😊',
      available: true,
    },
    {
      id: 'story-time',
      name: 'Story Time',
      description: 'AI-generated social stories to help understand new situations. Create personalized visual stories for any social scenario.',
      icon: '📚',
      available: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Autism & Communication</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={[
              styles.featureCard,
              !feature.available && { opacity: 0.6 }
            ]}
            onPress={() => feature.available && handleFeaturePress(feature.name, feature.description)}
            disabled={!feature.available}
          >
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <Text style={styles.featureTitle}>{feature.name}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
            {!feature.available && (
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Coming Soon</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AutismCommunicationSuite;