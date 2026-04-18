import React, { useState } from 'react';
import { View } from 'react-native';
import { useTTS } from '../contexts/TTSContext';
import { categories } from '../data/visualLearningDataLocal';
import VisualLearningGridScreen from './VisualLearningGridScreen';
import VisualLearningQuizScreen from './VisualLearningQuizScreen';

const VisualLearningScreen = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { speak } = useTTS();

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    // Dynamic speak fallback optional based on user needs, handled internally usually
  };

  const handleQuizComplete = () => {
    setSelectedCategory(null);
  };

  if (!selectedCategory) {
    return (
      <VisualLearningGridScreen 
         categories={categories} 
         onBack={onBack} 
         onSelectCategory={handleCategorySelect} 
      />
    );
  }

  return (
    <VisualLearningQuizScreen
       selectedCategory={selectedCategory}
       onBack={() => setSelectedCategory(null)}
       onComplete={handleQuizComplete}
    />
  );
};

export default VisualLearningScreen;

