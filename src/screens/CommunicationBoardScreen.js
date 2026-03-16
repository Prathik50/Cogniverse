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
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import HelpModal from './HelpModal';
import { BackArrowIcon, PlayIcon, HelpIcon } from '../components/icons/ConditionIcons';
import {
  EatingIcon,
  DrinkingIcon,
  BathingIcon,
  BrushingTeethIcon,
  SleepingIcon,
  DressingIcon,
  PlayingIcon,
  ReadingIcon,
  WalkingIcon,
  SittingIcon,
  HelpSOSIcon,
  ToiletIcon,
  HappyIcon,
  SadIcon,
  TiredIcon,
  HungryIcon,
  ThirstyIcon,
  HotIcon,
  ColdIcon,
  SickIcon,
  WashingHandsIcon,
  CookingIcon,
  CleaningIcon,
  WatchingTVIcon,
} from '../components/icons/ActivityIcons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

// --- Action Card Component ---
const ActionCard = ({ action, onPress, onSpeak, theme, textSize, spacing, index, t }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 50,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        delay: index * 50,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const cardStyles = StyleSheet.create({
    card: {
      width: CARD_WIDTH,
      backgroundColor: theme.colors.surface,
      borderRadius: 20 * spacing.scale,
      margin: 8 * spacing.scale,
      padding: 16 * spacing.scale,
      borderWidth: 2,
      borderColor: action.color || theme.colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 10,
      overflow: 'hidden',
    },
    imageContainer: {
      width: '100%',
      height: 120 * spacing.scale,
      backgroundColor: action.bgColor || '#F3F4F6',
      borderRadius: 16 * spacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12 * spacing.scale,
      overflow: 'hidden',
    },
    emoji: {
      fontSize: 64 * textSize.scale,
    },
    label: {
      fontSize: 18 * textSize.scale,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 12 * spacing.scale,
      letterSpacing: 0.3,
    },
    soundButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: action.color || theme.colors.primary,
      paddingVertical: 10 * spacing.scale,
      paddingHorizontal: 16 * spacing.scale,
      borderRadius: 12 * spacing.scale,
      shadowColor: action.color || theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    soundButtonText: {
      color: '#FFFFFF',
      fontSize: 14 * textSize.scale,
      fontWeight: '600',
      marginLeft: 8 * spacing.scale,
    },
  });

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={cardStyles.card} 
        onPress={() => onPress(action)}
        activeOpacity={0.85}
      >
        <View style={cardStyles.imageContainer}>
          {action.IconComponent ? (
            <action.IconComponent size={72 * spacing.scale} color={action.color} />
          ) : (
            <Text style={cardStyles.emoji}>{action.emoji}</Text>
          )}
        </View>
        <Text style={cardStyles.label}>{t(action.labelKey)}</Text>
        <TouchableOpacity 
          style={cardStyles.soundButton} 
          onPress={(e) => {
            e.stopPropagation();
            onSpeak(action.labelKey);
          }}
          activeOpacity={0.8}
        >
          <PlayIcon size={20} color="#FFFFFF" />
          <Text style={cardStyles.soundButtonText}>{t('speak')}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// --- Main Communication Board Screen ---
const CommunicationBoardScreen = ({ onBack }) => {
  const { currentTheme, currentTextSize, currentSpacing } = useTheme();
  const { t } = useLanguage();
  const { speak } = useTTS();
  const [showHelp, setShowHelp] = useState(false);

  // Daily activity actions with mix of SVG icons and emojis
  const dailyActions = [
    { id: '1', labelKey: 'actions.eating', emoji: '🍽️', color: '#F59E0B', bgColor: '#FEF3C7', category: 'daily' },
    { id: '2', labelKey: 'actions.drinking', emoji: '🥤', color: '#3B82F6', bgColor: '#DBEAFE', category: 'daily' },
    { id: '3', labelKey: 'actions.bathing', emoji: '🛁', color: '#06B6D4', bgColor: '#CFFAFE', category: 'daily' },
    { id: '4', labelKey: 'actions.brushingTeeth', emoji: '🪥', color: '#10B981', bgColor: '#D1FAE5', category: 'daily' },
    { id: '5', labelKey: 'actions.sleeping', emoji: '😴', color: '#8B5CF6', bgColor: '#EDE9FE', category: 'daily' },
    { id: '6', labelKey: 'actions.gettingDressed', emoji: '👕', color: '#EC4899', bgColor: '#FCE7F3', category: 'daily' },
    { id: '7', labelKey: 'actions.playing', emoji: '🎮', color: '#F59E0B', bgColor: '#FEF3C7', category: 'activity' },
    { id: '8', labelKey: 'actions.reading', emoji: '📚', color: '#6366F1', bgColor: '#E0E7FF', category: 'activity' },
    { id: '9', labelKey: 'actions.walking', emoji: '🚶', color: '#10B981', bgColor: '#D1FAE5', category: 'activity' },
    { id: '10', labelKey: 'actions.sitting', emoji: '🪑', color: '#8B5CF6', bgColor: '#EDE9FE', category: 'activity' },
    { id: '11', labelKey: 'actions.help', emoji: '🆘', color: '#EF4444', bgColor: '#FEE2E2', category: 'need' },
    { id: '12', labelKey: 'actions.toilet', emoji: '🚽', color: '#06B6D4', bgColor: '#CFFAFE', category: 'need' },
    { id: '13', labelKey: 'actions.happy', IconComponent: HappyIcon, color: '#FBBF24', bgColor: '#FEF3C7', category: 'emotion' },
    { id: '14', labelKey: 'actions.sad', IconComponent: SadIcon, color: '#3B82F6', bgColor: '#DBEAFE', category: 'emotion' },
    { id: '15', labelKey: 'actions.tired', IconComponent: TiredIcon, color: '#8B5CF6', bgColor: '#EDE9FE', category: 'emotion' },
    { id: '16', labelKey: 'actions.hungry', IconComponent: HungryIcon, color: '#F59E0B', bgColor: '#FEF3C7', category: 'need' },
    { id: '17', labelKey: 'actions.thirsty', IconComponent: ThirstyIcon, color: '#3B82F6', bgColor: '#DBEAFE', category: 'need' },
    { id: '18', labelKey: 'actions.hot', IconComponent: HotIcon, color: '#EF4444', bgColor: '#FEE2E2', category: 'feeling' },
    { id: '19', labelKey: 'actions.cold', IconComponent: ColdIcon, color: '#06B6D4', bgColor: '#CFFAFE', category: 'feeling' },
    { id: '20', labelKey: 'actions.sick', IconComponent: SickIcon, color: '#EF4444', bgColor: '#FEE2E2', category: 'feeling' },
    { id: '21', labelKey: 'actions.washingHands', emoji: '🧼', color: '#10B981', bgColor: '#D1FAE5', category: 'daily' },
    { id: '22', labelKey: 'actions.cooking', emoji: '🍳', color: '#F59E0B', bgColor: '#FEF3C7', category: 'activity' },
    { id: '23', labelKey: 'actions.cleaning', emoji: '🧹', color: '#06B6D4', bgColor: '#CFFAFE', category: 'activity' },
    { id: '24', labelKey: 'actions.watchingTV', emoji: '📺', color: '#8B5CF6', bgColor: '#EDE9FE', category: 'activity' },
  ];
  
  const [sentence, setSentence] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Function to add action to sentence strip
  const handleActionPress = (action) => {
    const label = t(action.labelKey);
    setSentence([...sentence, label]);
    speak(label);
  };
  
  // Function to speak action
  const handleSpeak = (labelKey) => {
    speak(t(labelKey));
  };
  
  // Speak full sentence
  const handleSpeakSentence = () => {
    if (sentence.length > 0) {
      speak(sentence.join(' '));
    }
  };
  
  // Filter actions by category
  const filteredActions = selectedCategory === 'all' 
    ? dailyActions 
    : dailyActions.filter(action => action.category === selectedCategory);
  
  const categories = [
    { id: 'all', labelKey: 'categories.all', color: '#6366F1' },
    { id: 'daily', labelKey: 'categories.daily', color: '#10B981' },
    { id: 'activity', labelKey: 'categories.activity', color: '#F59E0B' },
    { id: 'need', labelKey: 'categories.need', color: '#EF4444' },
    { id: 'emotion', labelKey: 'categories.emotion', color: '#8B5CF6' },
    { id: 'feeling', labelKey: 'categories.feeling', color: '#06B6D4' },
  ];

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.surface,
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
    headerTitle: {
      fontSize: 24 * currentTextSize.scale,
      fontWeight: '700',
      color: currentTheme.colors.text,
      flex: 1,
    },
    sentenceStrip: {
      backgroundColor: currentTheme.colors.surface,
      margin: 12 * currentSpacing.scale,
      borderRadius: 16 * currentSpacing.scale,
      borderWidth: 2,
      borderColor: currentTheme.colors.primary,
      padding: 16 * currentSpacing.scale,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
    },
    sentenceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8 * currentSpacing.scale,
    },
    sentenceTitle: {
      fontSize: 14 * currentTextSize.scale,
      fontWeight: '600',
      color: currentTheme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    sentenceContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 50 * currentSpacing.scale,
    },
    sentenceText: {
      fontSize: 20 * currentTextSize.scale,
      color: currentTheme.colors.text,
      flex: 1,
      fontWeight: '500',
    },
    sentenceActions: {
      flexDirection: 'row',
      gap: 8 * currentSpacing.scale,
    },
    speakButton: {
      backgroundColor: currentTheme.colors.primary,
      paddingHorizontal: 16 * currentSpacing.scale,
      paddingVertical: 10 * currentSpacing.scale,
      borderRadius: 12 * currentSpacing.scale,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: currentTheme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    speakButtonText: {
      color: '#FFFFFF',
      fontSize: 14 * currentTextSize.scale,
      fontWeight: '600',
      marginLeft: 6 * currentSpacing.scale,
    },
    clearButton: {
      backgroundColor: '#EF4444',
      paddingHorizontal: 16 * currentSpacing.scale,
      paddingVertical: 10 * currentSpacing.scale,
      borderRadius: 12 * currentSpacing.scale,
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    clearButtonText: {
      color: '#FFFFFF',
      fontSize: 14 * currentTextSize.scale,
      fontWeight: '600',
    },
    categoryContainer: {
      paddingHorizontal: 12 * currentSpacing.scale,
      paddingVertical: 12 * currentSpacing.scale,
    },
    categoryScroll: {
      flexDirection: 'row',
    },
    categoryButton: {
      paddingHorizontal: 20 * currentSpacing.scale,
      paddingVertical: 10 * currentSpacing.scale,
      borderRadius: 20 * currentSpacing.scale,
      marginRight: 10 * currentSpacing.scale,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    categoryButtonActive: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    categoryButtonText: {
      fontSize: 14 * currentTextSize.scale,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      padding: 12 * currentSpacing.scale,
      paddingBottom: 100 * currentSpacing.scale,
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
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        {onBack && (
          <TouchableOpacity 
            style={dynamicStyles.backButton} 
            onPress={onBack}
            activeOpacity={0.7}
          >
            <BackArrowIcon size={24 * currentTextSize.scale} color={currentTheme.colors.surface} />
          </TouchableOpacity>
        )}
        <Text style={dynamicStyles.headerTitle}>{t('myVoice')}</Text>
      </View>

      {/* Sentence Strip */}
      <View style={dynamicStyles.sentenceStrip}>
        <View style={dynamicStyles.sentenceHeader}>
          <Text style={dynamicStyles.sentenceTitle}>{t('myMessage')}</Text>
        </View>
        <View style={dynamicStyles.sentenceContent}>
          <Text style={dynamicStyles.sentenceText}>
            {sentence.length > 0 ? sentence.join(' ') : t('tapActionsBelow')}
          </Text>
          {sentence.length > 0 && (
            <View style={dynamicStyles.sentenceActions}>
              <TouchableOpacity 
                onPress={handleSpeakSentence} 
                style={dynamicStyles.speakButton}
                activeOpacity={0.8}
              >
                <PlayIcon size={18} color="#FFFFFF" />
                <Text style={dynamicStyles.speakButtonText}>{t('speak')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSentence([])} 
                style={dynamicStyles.clearButton}
                activeOpacity={0.8}
              >
                <Text style={dynamicStyles.clearButtonText}>{t('clear')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <View style={dynamicStyles.categoryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={dynamicStyles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                dynamicStyles.categoryButton,
                { backgroundColor: category.color },
                selectedCategory === category.id && dynamicStyles.categoryButtonActive,
                selectedCategory === category.id && { borderColor: category.color }
              ]}
              onPress={() => setSelectedCategory(category.id)}
              activeOpacity={0.8}
            >
              <Text style={dynamicStyles.categoryButtonText}>{t(category.labelKey)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Actions Grid */}
      <ScrollView contentContainerStyle={dynamicStyles.gridContainer}>
        {filteredActions.map((action, index) => (
          <ActionCard 
            key={action.id} 
            action={action} 
            onPress={handleActionPress}
            onSpeak={handleSpeak}
            theme={currentTheme}
            textSize={currentTextSize}
            spacing={currentSpacing}
            index={index}
            t={t}
          />
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={dynamicStyles.helpButton} 
        onPress={() => setShowHelp(true)}
        activeOpacity={0.8}
      >
        <HelpIcon size={36 * currentTextSize.scale} color="#FFFFFF" />
      </TouchableOpacity>

      <HelpModal visible={showHelp} onClose={() => setShowHelp(false)} context="communicationBoard" />
    </SafeAreaView>
  );
};

export default CommunicationBoardScreen;
