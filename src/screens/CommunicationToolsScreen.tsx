import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  BackHandler,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';

import MyVoiceScreen from './MyVoiceScreen';
import SentenceBuilderScreen from './SentenceBuilderScreen';
import { BackArrowIcon, MyVoiceIcon, LearnToBuildIcon } from '../components/icons/ConditionIcons';
import { ToolCard } from '../components/ToolCard';

import { COLORS, TYPOGRAPHY, SPACING, RADII, SHADOWS } from '../theme/theme';

interface CommunicationToolsScreenProps {
  onBack: () => void;
}

const DecorativeDivider = () => (
  <View style={styles.dividerContainer}>
    <Svg width={40} height={20} viewBox="0 0 40 20">
      <Path
        d="M0,0 Q20,20 40,0"
        stroke={COLORS.borderLight}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  </View>
);

export const CommunicationToolsScreen: React.FC<CommunicationToolsScreenProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const { speak } = useTTS();
  const [currentScreen, setCurrentScreen] = useState<'main' | 'my-voice' | 'learn-to-build'>('main');

  // Entrance animations
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardsAnims = useRef(
    [0, 1].map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(50),
    }))
  ).current;

  useEffect(() => {
    // Fade in header quickly
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Stagger slide up for cards
    Animated.stagger(
      50,
      cardsAnims.map((anim) =>
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(anim.translateY, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
        ])
      )
    ).start();
  }, []);

  // Hardware Back Handler
  useEffect(() => {
    const onHardwareBack = () => {
      if (currentScreen !== 'main') {
        setCurrentScreen('main');
        return true;
      }
      onBack();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => BackHandler.removeEventListener('hardwareBackPress', onHardwareBack);
  }, [currentScreen, onBack]);

  const handleFeaturePress = (featureId: 'my-voice' | 'learn-to-build', name: string) => {
    speak(`Opening ${name}`);
    setCurrentScreen(featureId);
  };

  const handleBackToMain = () => {
    speak('Returning to tools menu');
    setCurrentScreen('main');
  };

  // Sub-routing
  if (currentScreen === 'my-voice') {
    return <MyVoiceScreen onBack={handleBackToMain} />;
  }
  if (currentScreen === 'learn-to-build') {
    return <SentenceBuilderScreen onBack={handleBackToMain} />;
  }

  // Tools mapping
  const tools = [
    {
      id: 'my-voice' as const,
      title: t('autismFeatures.myVoice.name') || 'My Voice',
      description: t('autismFeatures.myVoice.description') || 'Tap picture cards to say what you need, how you feel, or who you want. Builds sentences you can speak aloud.',
      accentColor: COLORS.primary,
      IconComponent: MyVoiceIcon,
    },
    {
      id: 'learn-to-build' as const,
      title: t('autismFeatures.learnToBuild.name') || 'Visual Learning',
      description: t('autismFeatures.learnToBuild.description') || 'Learn animals, objects, and words with pictures. See an image, pick the right word, and hear it spoken.',
      accentColor: COLORS.accentTeal,
      IconComponent: LearnToBuildIcon,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Solid Purple Background without gradients */}
      <View style={styles.headerBackground} />

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.navHeader, { opacity: headerOpacity }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.8}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <BackArrowIcon size={24} color={COLORS.textOnDark} />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.titleSection, { opacity: headerOpacity }]}>
            <Text style={styles.subtitle}>COMMUNICATION TOOLS</Text>
            <Text style={styles.title}>Your Voice Matters</Text>
          </Animated.View>

          <View style={styles.cardsContainer}>
            {tools.map((tool, index) => (
              <React.Fragment key={tool.id}>
                <Animated.View
                  style={{
                    opacity: cardsAnims[index].opacity,
                    transform: [{ translateY: cardsAnims[index].translateY }],
                    width: '100%',
                  }}
                >
                  <ToolCard
                    title={tool.title}
                    description={tool.description}
                    accentColor={tool.accentColor}
                    IconComponent={tool.IconComponent}
                    onPress={() => handleFeaturePress(tool.id, tool.title)}
                  />
                </Animated.View>

                {/* Separator between cards */}
                {index === 0 && (
                  <Animated.View
                    style={{
                      opacity: cardsAnims[1].opacity, // Show when bottom card shows
                      alignItems: 'center',
                    }}
                  >
                    <DecorativeDivider />
                  </Animated.View>
                )}
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: COLORS.primaryDark,
    borderBottomLeftRadius: RADII.xl * 2,
    borderBottomRightRadius: RADII.xl * 2,
  },
  navHeader: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: RADII.full,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl * 2,
  },
  titleSection: {
    marginBottom: SPACING.xxl,
    paddingHorizontal: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.caption,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.hero,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: COLORS.textOnDark,
    letterSpacing: -0.5,
  },
  cardsContainer: {
    paddingTop: SPACING.xs,
    alignItems: 'center',
  },
  dividerContainer: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CommunicationToolsScreen;
