/**
 * AutismCommunicationSuite — Communication Tools Hub
 * ====================================================
 * Lists My Voice and Sentence Builder features.
 *
 * Changes: theme tokens, a11y props, BackHandler.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  BackHandler,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import CommunicationBoardScreen from '../screens/CommunicationBoardScreen';
import SentenceBuilderScreen from '../screens/SentenceBuilderScreen';
import HelpModal from '../screens/HelpModal';
import {
  BackArrowIcon, HelpIcon, MyVoiceIcon, LearnToBuildIcon,
} from '../components/icons/ConditionIcons';
import { COLORS, SPACING, RADII, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

// ── Decorative orb ──
const FloatingOrb = ({ size, color, top, left, delay = 0 }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacityAnim, { toValue: 1, duration: 1000, delay, useNativeDriver: true }).start();
    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, { toValue: 1, duration: 3000 + delay, useNativeDriver: true }),
      Animated.timing(floatAnim, { toValue: 0, duration: 3000 + delay, useNativeDriver: true }),
    ])).start();
  }, []);
  const translateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
  return (
    <Animated.View
      style={{ position: 'absolute', top, left, width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: opacityAnim, transform: [{ translateY }] }}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden={true}
    />
  );
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const TouchCard = ({ children, onPress, style, accessibilityLabel, accessibilityHint }) => {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <AnimatedTouchable
      style={[style, { transform: [{ scale }] }]}
      activeOpacity={0.9}
      onPressIn={() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
      onPress={onPress}
      disabled={!onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
    >
      {children}
    </AnimatedTouchable>
  );
};

const AutismCommunicationSuite = ({ onBack }) => {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const { speak } = useTTS();
  const [currentScreen, setCurrentScreen] = useState('main');
  const [showHelp, setShowHelp] = useState(false);

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const cardAnims = useRef(
    Array.from({ length: 3 }, () => ({ fade: new Animated.Value(0), slide: new Animated.Value(60), scale: new Animated.Value(0.92) }))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true }),
    ]).start();
    cardAnims.forEach((anim, i) => {
      const delay = 200 + i * 120;
      Animated.parallel([
        Animated.timing(anim.fade, { toValue: 1, duration: 600, delay, useNativeDriver: true }),
        Animated.spring(anim.slide, { toValue: 0, tension: 50, friction: 8, delay, useNativeDriver: true }),
        Animated.spring(anim.scale, { toValue: 1, tension: 50, friction: 7, delay, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  // ── Android back ──
  useEffect(() => {
    const onHardwareBack = () => {
      if (showHelp) { setShowHelp(false); return true; }
      if (currentScreen !== 'main') { setCurrentScreen('main'); return true; }
      onBack();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => BackHandler.removeEventListener('hardwareBackPress', onHardwareBack);
  }, [currentScreen, showHelp, onBack]);

  const handleFeaturePress = (featureId, featureName, featureDescription) => {
    speak(`Opening ${featureName}. ${featureDescription}`);
    setCurrentScreen(featureId);
  };

  const handleBackToMain = () => { speak('Returning to main menu'); setCurrentScreen('main'); };
  const handleHelpPress = () => { speak(t('openingHelpForSuite')); setShowHelp(true); };

  if (currentScreen === 'my-voice') return <CommunicationBoardScreen onBack={handleBackToMain} />;
  if (currentScreen === 'learn-to-build') return <SentenceBuilderScreen onBack={handleBackToMain} />;

  const features = [
    { id: 'my-voice', nameKey: 'autismFeatures.myVoice.name', descriptionKey: 'autismFeatures.myVoice.description', IconComponent: MyVoiceIcon, color: COLORS.suiteComm, available: true },
    { id: 'learn-to-build', nameKey: 'autismFeatures.learnToBuild.name', descriptionKey: 'autismFeatures.learnToBuild.description', IconComponent: LearnToBuildIcon, color: COLORS.success, available: true },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.waveContainer}>
        <Svg height={520} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
            <LinearGradient id="commGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={COLORS.primaryDeep} />
              <Stop offset="40%" stopColor={COLORS.primaryDark} />
              <Stop offset="70%" stopColor="#4F46E5" />
              <Stop offset="100%" stopColor={COLORS.suiteComm} />
            </LinearGradient>
          </Defs>
          <Path fill="url(#commGrad)" d="M0,294L48,272.7C96,251,192,209,288,208.7C384,209,480,251,576,262C672,273,768,251,864,224.7C960,198,1056,166,1152,160.7C1248,155,1344,177,1392,187.3L1440,198L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </Svg>
      </View>

      <FloatingOrb size={70} color="rgba(99, 102, 241, 0.12)" top={70} left={width - 90} delay={0} />
      <FloatingOrb size={45} color="rgba(139, 92, 246, 0.14)" top={130} left={20} delay={300} />
      <FloatingOrb size={30} color="rgba(245, 158, 11, 0.12)" top={100} left={width / 2} delay={500} />

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.headerTop, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.8}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            accessibilityHint="Returns to Learning Center"
          >
            <BackArrowIcon size={22} color="#4F46E5" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title} accessibilityRole="header">Express & Understand</Text>
            <Text style={styles.subtitle}>Communication Tools</Text>
          </View>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.heroBanner, { opacity: headerFade }]}>
            <Text style={styles.heroTitle}>Your Voice Matters</Text>
            <Text style={styles.heroSubtitle}>Tools to help express needs, learn words, and understand feelings.</Text>
          </Animated.View>

          {features.map((feature, index) => (
            <Animated.View key={feature.id} style={{ opacity: cardAnims[index].fade, transform: [{ translateY: cardAnims[index].slide }, { scale: cardAnims[index].scale }] }}>
              <TouchCard
                style={[styles.featureCard, !feature.available && { opacity: 0.55 }]}
                onPress={feature.available ? () => handleFeaturePress(feature.id, t(feature.nameKey), t(feature.descriptionKey)) : null}
                accessibilityLabel={t(feature.nameKey)}
                accessibilityHint={feature.available ? t(feature.descriptionKey) : 'Coming soon'}
              >
                <View style={[styles.cardAccentStrip, { backgroundColor: feature.color }]} />
                <View style={styles.cardInner}>
                  <View style={[styles.featureIconBox, { backgroundColor: feature.color + '15' }]}>
                    <View style={[styles.iconGlow, { backgroundColor: feature.color + '20' }]}>
                      <feature.IconComponent size={30} color={feature.color} />
                    </View>
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{t(feature.nameKey)}</Text>
                    <Text style={styles.featureDescription}>{t(feature.descriptionKey)}</Text>
                    {!feature.available && (
                      <View style={[styles.comingSoonBadge, { backgroundColor: feature.color + '15' }]}>
                        <Text style={[styles.comingSoonText, { color: feature.color }]}>Coming Soon</Text>
                      </View>
                    )}
                  </View>
                  {feature.available && (
                    <View style={[styles.arrowContainer, { backgroundColor: feature.color + '12' }]}>
                      <Text style={[styles.arrowText, { color: feature.color }]}>→</Text>
                    </View>
                  )}
                </View>
              </TouchCard>
            </Animated.View>
          ))}
        </ScrollView>

        <TouchCard
          style={styles.helpFab}
          onPress={handleHelpPress}
          accessibilityLabel="Help"
          accessibilityHint="Opens the help guide for communication tools"
        >
          <View style={styles.helpFabInner}>
            <HelpIcon size={28} color={COLORS.textOnDark} />
          </View>
        </TouchCard>

        <HelpModal visible={showHelp} onClose={() => setShowHelp(false)} context="autismSuite" />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  safeArea: { flex: 1 },
  waveContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 0 },
  headerTop: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.xl, marginTop: SPACING.base, zIndex: 10 },
  backButton: {
    backgroundColor: COLORS.overlayWhite95, borderRadius: RADII.lg, width: 44, height: 44,
    justifyContent: 'center', alignItems: 'center',
    ...SHADOWS.lg, shadowColor: COLORS.primaryDeep, shadowOpacity: 0.15,
  },
  headerTitles: { flex: 1, alignItems: 'center', marginRight: 44 },
  title: { fontSize: FONT_SIZES.title1, fontWeight: FONT_WEIGHTS.black, color: COLORS.textOnDark, letterSpacing: 0.3, textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  subtitle: { fontSize: FONT_SIZES.footnote, color: 'rgba(224,231,255,0.9)', fontWeight: FONT_WEIGHTS.semibold, marginTop: 3, letterSpacing: 1, textTransform: 'uppercase' },
  scrollContent: { paddingTop: SPACING.xl, paddingHorizontal: SPACING.lg, paddingBottom: 100 },
  heroBanner: { marginBottom: SPACING.xxl - 4, paddingHorizontal: SPACING.xs },
  heroTitle: { fontSize: FONT_SIZES.hero, fontWeight: FONT_WEIGHTS.black, color: COLORS.textOnDark, letterSpacing: -0.5, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  heroSubtitle: { fontSize: FONT_SIZES.callout, color: 'rgba(255,255,255,0.85)', fontWeight: FONT_WEIGHTS.medium, marginTop: SPACING.sm, lineHeight: 22 },
  featureCard: { backgroundColor: COLORS.surface, borderRadius: RADII.xl, marginBottom: SPACING.lg - 2, ...SHADOWS.lg, overflow: 'hidden' },
  cardAccentStrip: { height: 4, borderTopLeftRadius: RADII.xl, borderTopRightRadius: RADII.xl },
  cardInner: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, paddingTop: SPACING.lg - 2 },
  featureIconBox: { width: 64, height: 64, borderRadius: RADII.lg, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.base },
  iconGlow: { width: 50, height: 50, borderRadius: RADII.md, justifyContent: 'center', alignItems: 'center' },
  featureContent: { flex: 1, paddingRight: SPACING.xs },
  featureTitle: { fontSize: FONT_SIZES.headline, fontWeight: FONT_WEIGHTS.extrabold, color: COLORS.textPrimary, letterSpacing: -0.2, marginBottom: 5 },
  featureDescription: { fontSize: FONT_SIZES.small, color: COLORS.textSecondary, lineHeight: 20, fontWeight: FONT_WEIGHTS.medium },
  comingSoonBadge: { alignSelf: 'flex-start', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADII.sm, marginTop: SPACING.sm },
  comingSoonText: { fontSize: FONT_SIZES.footnote, fontWeight: FONT_WEIGHTS.extrabold, letterSpacing: 0.5 },
  arrowContainer: { width: 36, height: 36, borderRadius: RADII.sm + 2, justifyContent: 'center', alignItems: 'center' },
  arrowText: { fontSize: FONT_SIZES.title2, fontWeight: FONT_WEIGHTS.black },
  helpFab: { position: 'absolute', bottom: 30, right: SPACING.xl, ...SHADOWS.glow('#4F46E5') },
  helpFabInner: { width: 60, height: 60, borderRadius: RADII.lg, backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center' },
});

export default AutismCommunicationSuite;