import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FlashcardScreen from '../components/FlashcardScreen';

const alphabetCards = [
  { letter: 'A', title: 'A for Apple', emoji: '🍎', sentence: 'A for apple.' },
  { letter: 'B', title: 'B for Ball', emoji: '⚽', sentence: 'B for ball.' },
  { letter: 'C', title: 'C for Cat', emoji: '🐱', sentence: 'C for cat.' },
  { letter: 'D', title: 'D for Dog', emoji: '🐕', sentence: 'D for dog.' },
  { letter: 'E', title: 'E for Elephant', emoji: '🐘', sentence: 'E for elephant.' },
];

export const AlphabetScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <FlashcardScreen
      title="Alphabet"
      items={alphabetCards}
      accentColor="#14B8A6"
      onBack={onBack}
      getSpeakString={(item) => item.sentence}
      renderCard={(item) => (
        <View style={{ alignItems: 'center', paddingVertical: 10 }}>
          <View style={styles.emojiCircle}>
             <Text style={styles.emojiText}>{item.emoji}</Text>
          </View>
          <Text style={styles.phraseText}>{item.title}</Text>
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
     backgroundColor: '#F0FDFA', // Soft teal background
     justifyContent: 'center', 
     alignItems: 'center',
  },
  emojiText: { 
     fontSize: 72, 
  },
  phraseText: {
     fontSize: 32,
     fontWeight: '800',
     color: '#1E293B',
     marginTop: 32,
  }
});

export default AlphabetScreen;
