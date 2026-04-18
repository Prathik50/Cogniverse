import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FlashcardScreen from '../components/FlashcardScreen';

const colorCards = [
  { title: 'Red', color: '#EF4444', sentence: 'This is red.' },
  { title: 'Blue', color: '#3B82F6', sentence: 'This is blue.' },
  { title: 'Green', color: '#10B981', sentence: 'This is green.' },
  { title: 'Yellow', color: '#FBBF24', sentence: 'This is yellow.' },
  { title: 'Purple', color: '#8B5CF6', sentence: 'This is purple.' },
  { title: 'Orange', color: '#F97316', sentence: 'This is orange.' },
];

export const ColorsScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <FlashcardScreen
      title="Colors"
      items={colorCards}
      accentColor="#EC4899"
      onBack={onBack}
      getSpeakString={(item) => item.sentence}
      renderCard={(item) => (
        <View style={{ alignItems: 'center', paddingVertical: 10 }}>
          {/* Removed harsh shadow natively by explicitly stripping elevation/shadows and relying on flat design */}
          <View style={[styles.colorBlock, { backgroundColor: item.color }]} />
          <Text style={styles.colorText}>{item.title}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  colorBlock: { 
     width: 160, 
     height: 160, 
     borderRadius: 36, 
  },
  colorText: {
     fontSize: 32,
     fontWeight: '800',
     color: '#1E293B',
     marginTop: 36,
  }
});

export default ColorsScreen;
