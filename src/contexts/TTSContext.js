import React, { createContext, useContext, useState, useEffect } from 'react';
import Tts from 'react-native-tts';
import { useTheme } from './ThemeContext';

const TTSContext = createContext();

export const useTTS = () => {
  const context = useContext(TTSContext);
  if (!context) {
    throw new Error('useTTS must be used within a TTSProvider');
  }
  return context;
};

export const TTSProvider = ({ children }) => {
  const { language: appLanguage } = useTheme();
  const [isEnabled, setIsEnabled] = useState(true);
  const [rate, setRate] = useState(0.5); // Speech rate (0.1 to 1.0)
  const [pitch, setPitch] = useState(1.0); // Speech pitch (0.5 to 2.0)
  const [volume, setVolume] = useState(1.0); // Speech volume (0.0 to 1.0)
  
  // Map app language codes to TTS language codes
  const getTTSLanguage = (lang) => {
    return lang === 'hi' ? 'hi-IN' : 'en-US';
  };
  
  const [language, setLanguage] = useState(getTTSLanguage(appLanguage));

  // Initialize the TTS engine once when the app loads
  useEffect(() => {
    const initializeTTS = async () => {
      try {
        // Set the default language. We can also check for Hindi availability.
        await Tts.setDefaultLanguage(language);
        await Tts.setDefaultRate(rate);
        await Tts.setDefaultPitch(pitch);

        // Check for available voices, especially for Hindi
        const voices = await Tts.voices();
        const hasHindi = voices.some(v => v.language.startsWith('hi'));
        console.log('TTS Voices Found:', voices.map(v => v.language));
        console.log('Does this device support Hindi?', hasHindi);

      } catch (err) {
        console.log('Error initializing TTS:', err);
      }
    };

    initializeTTS();

    // Add event listeners (optional but good for debugging)
    const startSub = Tts.addEventListener('tts-start', (event) => console.log('TTS Start', event));
    const finishSub = Tts.addEventListener('tts-finish', (event) => console.log('TTS Finish', event));
    const errorSub = Tts.addEventListener('tts-error', (event) => console.log('TTS Error', event));

    return () => {
      // Clean up listeners when component unmounts
      startSub?.remove?.();
      finishSub?.remove?.();
      errorSub?.remove?.();
    };
  }, []); // Empty array means this runs only once on mount

  // Sync TTS language with app language
  useEffect(() => {
    const ttsLang = getTTSLanguage(appLanguage);
    setLanguage(ttsLang);
    Tts.setDefaultLanguage(ttsLang);
  }, [appLanguage]);

  // Update TTS settings when state changes
  useEffect(() => { Tts.setDefaultRate(rate); }, [rate]);
  useEffect(() => { Tts.setDefaultPitch(pitch); }, [pitch]);
  useEffect(() => { Tts.setDefaultLanguage(language); }, [language]);
  // Volume is often controlled at the OS level, but we can set it
  // Note: Tts.setVolume(volume) is not a standard method, volume is part of speak options.

  const speak = (text, langCode = language) => {
    if (!isEnabled) return;
    
    stop(); // Stop any currently playing speech first

    Tts.speak(text, {
      language: langCode,
      rate: rate,
      pitch: pitch,
      volume: volume,
    });
  };

  const stop = () => {
    Tts.stop();
  };

  const getLanguageName = (langCode) => {
    const languages = {
      'en-US': 'English',
      'hi-IN': 'हिंदी (Hindi)',
    };
    return languages[langCode] || 'English';
  };
  
  // We'll update the language state to use standard codes
  const setAppLanguage = (langCode) => {
    setLanguage(langCode);
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
    setLanguage: setAppLanguage, // Use our new function
    speak,
    stop,
    getLanguageName,
  };

  return <TTSContext.Provider value={value}>{children}</TTSContext.Provider>;
};