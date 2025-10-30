import React, { createContext, useContext, useState } from 'react';
import { Platform } from 'react-native';

const TTSContext = createContext();

export const useTTS = () => {
  const context = useContext(TTSContext);
  if (!context) {
    throw new Error('useTTS must be used within a TTSProvider');
  }
  return context;
};

export const TTSProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [rate, setRate] = useState(0.5); // Speech rate (0.1 to 1.0)
  const [pitch, setPitch] = useState(1.0); // Speech pitch (0.5 to 2.0)
  const [volume, setVolume] = useState(1.0); // Speech volume (0.0 to 1.0)
  const [language, setLanguage] = useState('en');

  const speak = async (text, options = {}) => {
    if (!isEnabled) return;

    try {
      // For now, we'll use a simple implementation
      // In a real app, you'd integrate with react-native-tts or expo-speech
      console.log(`Speaking: ${text} in ${language}`);
      
      // This is a placeholder - you'll need to implement actual TTS
      // For iOS: You can use AVSpeechSynthesizer
      // For Android: You can use TextToSpeech
      
      if (Platform.OS === 'ios') {
        // iOS TTS implementation would go here
        console.log('iOS TTS:', text);
      } else if (Platform.OS === 'android') {
        // Android TTS implementation would go here
        console.log('Android TTS:', text);
      }
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  const stop = () => {
    // Stop current speech
    console.log('Stopping TTS');
  };

  const getLanguageName = (langCode) => {
    const languages = {
      en: 'English',
      hi: 'हिंदी (Hindi)',
    };
    return languages[langCode] || 'English';
  };

  const value = {
    isEnabled,
    setIsEnabled,
    rate,
    setRate,
    pitch,
    setPitch,
    volume,
    setVolume,
    language,
    setLanguage,
    speak,
    stop,
    getLanguageName,
  };

  return <TTSContext.Provider value={value}>{children}</TTSContext.Provider>;
};