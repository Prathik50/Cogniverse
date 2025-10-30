import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTTS } from '../contexts/TTSContext';

const FeelingsFinderScreen = ({ onBack }) => {
  const { currentTheme, currentTextSize, currentSpacing } = useTheme();
  const { speak } = useTTS();
  const [selectedFeeling, setSelectedFeeling] = useState(null);

  const feelings = [
    {
      id: 'happy',
      name: 'Happy',
      emoji: '😊',
      description: 'Feeling joyful and content',
      story: 'Someone might feel happy when they get a hug from their mom, when they play with their favorite toy, or when they eat their favorite ice cream.',
      color: '#4CAF50',
    },
    {
      id: 'sad',
      name: 'Sad',
      emoji: '😢',
      description: 'Feeling down or disappointed',
      story: 'Someone might feel sad when their pet is sick, when they miss their friend, or when they drop their ice cream on the ground.',
      color: '#2196F3',
    },
    {
      id: 'angry',
      name: 'Angry',
      emoji: '😠',
      description: 'Feeling mad or frustrated',
      story: 'Someone might feel angry when someone takes their toy without asking, when they have to stop playing, or when things don\'t go their way.',
      color: '#F44336',
    },
    {
      id: 'surprised',
      name: 'Surprised',
      emoji: '😲',
      description: 'Feeling shocked or amazed',
      story: 'Someone might feel surprised when they get a birthday present they didn\'t expect, when they see a rainbow, or when their friend shows up unexpectedly.',
      color: '#FF9800',
    },
    {
      id: 'confused',
      name: 'Confused',
      emoji: '😕',
      description: 'Feeling puzzled or unsure',
      story: 'Someone might feel confused when they don\'t understand the rules of a new game, when someone speaks in a different language, or when they can\'t find their way.',
      color: '#9C27B0',
    },
    {
      id: 'excited',
      name: 'Excited',
      emoji: '🤩',
      description: 'Feeling thrilled and energetic',
      story: 'Someone might feel excited when they are going to a party, when they get to ride a roller coaster, or when they see their favorite character.',
      color: '#E91E63',
    },
    {
      id: 'worried',
      name: 'Worried',
      emoji: '😟',
      description: 'Feeling anxious or concerned',
      story: 'Someone might feel worried when they have a test at school, when they can\'t find their mom in a store, or when they hear a loud noise.',
      color: '#795548',
    },
    {
      id: 'proud',
      name: 'Proud',
      emoji: '😌',
      description: 'Feeling accomplished and satisfied',
      story: 'Someone might feel proud when they finish a puzzle all by themselves, when they help their friend, or when they learn something new.',
      color: '#607D8B',
    },
  ];

  const handleFeelingPress = (feeling) => {
    setSelectedFeeling(feeling);
    speak(`${feeling.name}. ${feeling.description}`);
  };

  const handleStoryPress = () => {
    if (selectedFeeling) {
      speak(selectedFeeling.story);
    }
  };

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
      fontSize: 20 * currentTextSize.scale,
      fontWeight: '600',
      color: currentTheme.colors.text,
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 20 * currentSpacing.scale,
    },
    instructionText: {
      fontSize: 18 * currentTextSize.scale,
      color: currentTheme.colors.text,
      textAlign: 'center',
      marginBottom: 20 * currentSpacing.scale,
      fontWeight: '500',
    },
    feelingsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      marginBottom: 20 * currentSpacing.scale,
    },
    feelingCard: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 16 * currentSpacing.scale,
      padding: 20 * currentSpacing.scale,
      margin: 8 * currentSpacing.scale,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: currentTheme.colors.border,
      width: '45%',
      minHeight: 120 * currentSpacing.scale,
      justifyContent: 'center',
    },
    feelingCardSelected: {
      borderColor: '#4CAF50',
      backgroundColor: '#E8F5E8',
    },
    feelingEmoji: {
      fontSize: 40 * currentTextSize.scale,
      marginBottom: 8 * currentSpacing.scale,
    },
    feelingName: {
      fontSize: 16 * currentTextSize.scale,
      fontWeight: '600',
      color: currentTheme.colors.text,
      textAlign: 'center',
    },
    storyContainer: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 16 * currentSpacing.scale,
      padding: 20 * currentSpacing.scale,
      marginTop: 20 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
    },
    storyTitle: {
      fontSize: 20 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
      marginBottom: 12 * currentSpacing.scale,
      textAlign: 'center',
    },
    storyText: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      lineHeight: 24 * currentTextSize.scale,
      textAlign: 'center',
    },
    playStoryButton: {
      backgroundColor: currentTheme.colors.primary,
      paddingHorizontal: 24 * currentSpacing.scale,
      paddingVertical: 12 * currentSpacing.scale,
      borderRadius: 25 * currentSpacing.scale,
      marginTop: 16 * currentSpacing.scale,
      alignSelf: 'center',
    },
    playStoryButtonText: {
      color: currentTheme.colors.surface,
      fontSize: 16 * currentTextSize.scale,
      fontWeight: '600',
    },
    selectedFeelingInfo: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 12 * currentSpacing.scale,
      padding: 16 * currentSpacing.scale,
      marginBottom: 20 * currentSpacing.scale,
      borderLeftWidth: 4,
      borderLeftColor: selectedFeeling?.color || currentTheme.colors.primary,
    },
    selectedFeelingName: {
      fontSize: 18 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
      marginBottom: 4 * currentSpacing.scale,
    },
    selectedFeelingDescription: {
      fontSize: 14 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Feelings Finder</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.instructionText}>
          Tap on a feeling to learn about it and hear its story
        </Text>

        {selectedFeeling && (
          <View style={styles.selectedFeelingInfo}>
            <Text style={styles.selectedFeelingName}>
              {selectedFeeling.emoji} {selectedFeeling.name}
            </Text>
            <Text style={styles.selectedFeelingDescription}>
              {selectedFeeling.description}
            </Text>
          </View>
        )}

        <View style={styles.feelingsGrid}>
          {feelings.map((feeling) => (
            <TouchableOpacity
              key={feeling.id}
              style={[
                styles.feelingCard,
                selectedFeeling?.id === feeling.id && styles.feelingCardSelected,
              ]}
              onPress={() => handleFeelingPress(feeling)}
            >
              <Text style={styles.feelingEmoji}>{feeling.emoji}</Text>
              <Text style={styles.feelingName}>{feeling.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedFeeling && (
          <View style={styles.storyContainer}>
            <Text style={styles.storyTitle}>Story about {selectedFeeling.name}</Text>
            <Text style={styles.storyText}>{selectedFeeling.story}</Text>
            <TouchableOpacity style={styles.playStoryButton} onPress={handleStoryPress}>
              <Text style={styles.playStoryButtonText}>🔊 Play Story</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeelingsFinderScreen;
