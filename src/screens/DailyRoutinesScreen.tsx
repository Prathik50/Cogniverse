import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FlashcardScreen from '../components/FlashcardScreen';

const routineCards = [
  { title: 'Wake Up', emoji: '⏰', sentence: 'Time to wake up.', color: '#F59E0B' },
  { title: 'Brush Teeth', emoji: '🪥', sentence: 'Time to brush teeth.', color: '#10B981' },
  { title: 'Learning Time', emoji: '🏫', sentence: 'Time to learn.', color: '#6366F1' },
  { title: 'Sleep', emoji: '🛌', sentence: 'Time to sleep.', color: '#8B5CF6' },
];

export const DailyRoutinesScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <FlashcardScreen
      title="Daily Routines"
      items={routineCards}
      accentColor="#F59E0B"
      onBack={onBack}
      getSpeakString={(item) => item.sentence}
      renderCard={(item) => (
        <View style={{ alignItems: 'center', paddingVertical: 10 }}>
          <View style={[styles.emojiCircle, { backgroundColor: item.color + '15' }]}>
             <Text style={styles.emojiText}>{item.emoji}</Text>
          </View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSentence}>{item.sentence}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  emojiCircle: {
     width: 140, 
     height: 140, 
     borderRadius: 70, 
     justifyContent: 'center', 
     alignItems: 'center',
     marginBottom: 28,
  },
  emojiText: { 
     fontSize: 72, 
  },
  cardTitle: {
     fontSize: 28,
     fontWeight: '900',
     color: '#1E293B',
     marginBottom: 8,
  },
  cardSentence: {
     fontSize: 18,
     fontWeight: '600',
     color: '#64748B',
  }
});

export default DailyRoutinesScreen;
