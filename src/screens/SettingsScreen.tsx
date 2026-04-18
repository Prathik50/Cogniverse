import React, { useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Animated,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import { BackArrowIcon } from '../components/icons/ConditionIcons';

// Custom Native Selected Check (Solid Purple Circle)
const SelectedCheck = () => (
  <View style={styles.selectedCircle}>
    <Text style={styles.selectedCheckText}>✓</Text>
  </View>
);

const UnselectedCheck = () => (
  <View style={styles.unselectedCircle} />
);

// Map text keys to visual preview scale
const getPreviewFontSize = (key: string) => {
  if (key.includes('small') || key === 'sm') return 16;
  if (key.includes('medium') || key === 'md') return 22;
  if (key.includes('large') || key === 'lg') return 28;
  if (key.includes('extra') || key === 'xl') return 34;
  return 20; // safe fallback
};

const SettingsScreen = ({ onBack }: { onBack: () => void }) => {
  const {
    theme,
    setTheme,
    textSize,
    setTextSize,
    language,
    setLanguage,
    themes,
    textSizes,
  } = useTheme();

  const { t } = useLanguage();
  const { isEnabled, setIsEnabled, rate } = useTTS();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const resetDefaults = () => {
    setTheme('light');
    setTextSize('md');
    setLanguage('en');
    setIsEnabled(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.waveContainer}>
        <Svg height={300} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
            <LinearGradient id="settingsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              {/* Standardized Core Application Purple */}
              <Stop offset="0%" stopColor="#4B3FD8" />
              <Stop offset="100%" stopColor="#4135B3" />
            </LinearGradient>
          </Defs>
          <Path 
            fill="url(#settingsGrad)" 
            d="M0,224L48,202.7C96,181,192,139,288,138.7C384,139,480,181,576,192C672,203,768,181,864,154.7C960,128,1056,96,1152,90.7C1248,85,1344,107,1392,117.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" 
          />
        </Svg>
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8} accessibilityRole="button">
            <BackArrowIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>{t('settings') || 'Settings'}</Text>
            <Text style={styles.subtitle}>App Preferences</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Visual Settings */}
          <Animated.View style={[styles.cardSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.sectionTitle}>{t('visualSettings') || 'Visual Settings'}</Text>
            {Object.entries(themes || {}).map(([key, themeData]: [string, any], index, arr) => (
              <TouchableOpacity 
                 key={key} 
                 style={[styles.optionRow, index === arr.length - 1 && styles.lastRow]} 
                 onPress={() => setTheme(key)} 
                 activeOpacity={0.7}
              >
                <View style={styles.rowLeadContext}>
                  <View style={[styles.themePreview, { backgroundColor: themeData?.colors?.primary || '#CCC' }]} />
                  <Text style={styles.radioName}>{t(`themes.${key}`) || key}</Text>
                </View>
                {theme === key ? <SelectedCheck /> : <UnselectedCheck />}
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* Typography Scale Preview Row */}
          <Animated.View style={[styles.cardSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.sectionTitle}>Typography Size</Text>
            {Object.entries(textSizes || {}).map(([key], index, arr) => (
              <TouchableOpacity 
                 key={key} 
                 style={[styles.optionRow, index === arr.length - 1 && styles.lastRow]} 
                 onPress={() => setTextSize(key)} 
                 activeOpacity={0.7}
              >
                <View style={[styles.rowLeadContext, { flex: 1 }]}>
                   {/* Preview Icon actual scale visual */}
                   <Text style={[styles.typoPreviewText, { fontSize: getPreviewFontSize(key) }]} allowFontScaling={false}>
                     Aa
                   </Text>
                   <Text style={styles.radioName}>{t(`textSizes.${key}`) || key}</Text>
                </View>
                {textSize === key ? <SelectedCheck /> : <UnselectedCheck />}
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* Language Selection binding Flag Icons */}
          <Animated.View style={[styles.cardSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.sectionTitle}>{t('languageSettings') || 'Language'}</Text>
            <TouchableOpacity style={styles.optionRow} onPress={() => setLanguage('en')} activeOpacity={0.7}>
              <View style={styles.rowLeadContext}>
                <Text style={styles.flagIcon} allowFontScaling={false}>🇬🇧</Text>
                <Text style={styles.radioName}>{t('languages.english') || 'English'}</Text>
              </View>
              {language === 'en' ? <SelectedCheck /> : <UnselectedCheck />}
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.optionRow, styles.lastRow]} onPress={() => setLanguage('hi')} activeOpacity={0.7}>
              <View style={styles.rowLeadContext}>
                <Text style={styles.flagIcon} allowFontScaling={false}>🇮🇳</Text>
                <Text style={styles.radioName}>{t('languages.hindi') || 'हिंदी'}</Text>
              </View>
              {language === 'hi' ? <SelectedCheck /> : <UnselectedCheck />}
            </TouchableOpacity>
          </Animated.View>

          {/* Voice Settings Context Toggle Row Component */}
          <Animated.View style={[styles.cardSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.sectionTitle}>{t('voiceSettings') || 'Voice Features'}</Text>
            <View style={[styles.optionRow, { paddingVertical: 18 }]}>
              <View style={styles.toggleTextWrapper}>
                <Text style={styles.optionLabel}>{t('enableVoice') || 'Enable Text-To-Speech'}</Text>
                <Text style={styles.optionSubtitle}>Read content aloud automatically</Text>
              </View>
              <Switch
                value={isEnabled}
                onValueChange={setIsEnabled}
                trackColor={{ false: '#E2E8F0', true: '#4B3FD8' }} // Accent Purple toggle track
                thumbColor={'#FFFFFF'}
                ios_backgroundColor="#E2E8F0"
              />
            </View>
            <View style={[styles.optionRow, styles.lastRow]}>
              <Text style={styles.optionLabel}>{t('speechRate') || 'Speech Rate'}</Text>
              <View style={styles.ratePill}>
                <Text style={styles.optionValue}>{Math.round(rate * 100)}%</Text>
              </View>
            </View>
          </Animated.View>

          {/* Final Reset Defaults */}
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
             <TouchableOpacity style={styles.resetButton} onPress={resetDefaults} activeOpacity={0.7} accessibilityRole="button">
                <Text style={styles.resetButtonText}>Reset to Defaults</Text>
             </TouchableOpacity>
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FF', // Warmer off-white matching overarching ecosystem themes
  },
  waveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 20,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  headerTitles: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 20, // Ensure wide bounds natively checking edge margins
    paddingBottom: 60,
  },

  // Premium Section Card Wrapper
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    // Soft subtle native white card shadow bounds
    shadowColor: '#4B3FD8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: -0.2,
  },

  // Row Mapping Dynamics
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  lastRow: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },
  rowLeadContext: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Visual/Typography Mapping
  themePreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  typoPreviewText: {
    color: '#1E293B',
    fontWeight: '700',
    marginRight: 16,
    width: 36, // Ensure alignment lock identically
    textAlign: 'center',
  },
  flagIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  radioName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },

  // Toggles and Checks
  selectedCircle: {
     width: 26,
     height: 26,
     borderRadius: 13,
     backgroundColor: '#4B3FD8',
     justifyContent: 'center',
     alignItems: 'center',
     shadowColor: '#4B3FD8',
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.3,
     shadowRadius: 4,
     elevation: 2,
  },
  selectedCheckText: {
     color: '#FFFFFF',
     fontSize: 14,
     fontWeight: '900',
  },
  unselectedCircle: {
     width: 26,
     height: 26,
     borderRadius: 13,
     borderWidth: 2,
     borderColor: '#CBD5E1',
     backgroundColor: '#F8FAFC',
  },

  toggleTextWrapper: {
     flex: 1,
     paddingRight: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 4,
  },
  ratePill: {
     backgroundColor: '#F1F5F9',
     paddingHorizontal: 12,
     paddingVertical: 6,
     borderRadius: 12,
  },
  optionValue: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '800',
  },

  // Reset Standard
  resetButton: {
     marginTop: 16,
     backgroundColor: 'transparent',
     borderWidth: 2,
     borderColor: '#E2E8F0',
     paddingVertical: 16,
     borderRadius: 20,
     alignItems: 'center',
     justifyContent: 'center',
  },
  resetButtonText: {
     color: '#64748B',
     fontSize: 16,
     fontWeight: '800',
     letterSpacing: -0.2,
  }
});

export default SettingsScreen;
