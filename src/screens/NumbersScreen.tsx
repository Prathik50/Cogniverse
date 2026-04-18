import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FlashcardScreen from '../components/FlashcardScreen';

const numberWords = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'];
const numberCards = Array.from({ length: 20 }, (_, i) => ({ label: String(i + 1), word: numberWords[i] }));

export const NumbersScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <FlashcardScreen
      title="Numbers"
      items={numberCards}
      accentColor="#3B82F6"
      onBack={onBack}
      getSpeakString={(item) => item.word}
      renderCard={(item) => (
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <View style={styles.numberCircle}>
             <Text style={styles.numberText}>{item.label}</Text>
          </View>
          <Text style={styles.wordText}>{item.word}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  numberCircle: {
     width: 140, 
     height: 140, 
     borderRadius: 70, 
     backgroundColor: '#EEF2FF', 
     justifyContent: 'center', 
     alignItems: 'center',
     shadowColor: '#3B82F6', 
     shadowOffset: { width: 0, height: 8 }, 
     shadowOpacity: 0.15, 
     shadowRadius: 16, 
     elevation: 6 
  },
  numberText: { 
     fontSize: 64, 
     fontWeight: '900', 
     color: '#3B82F6' 
  },
  wordText: {
     fontSize: 32,
     fontWeight: '800',
     color: '#1E293B',
     marginTop: 32,
  }
});

export default NumbersScreen;
