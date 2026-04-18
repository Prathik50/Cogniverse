/**
 * App.js — Root Application Entry
 * =================================
 * Context providers wrapper + authentication routing.
 *
 * Note: GestureHandlerRootView is used inside LearningCenterScreen
 * rather than here, so the app works even if the native module
 * hasn't been rebuilt yet — it only crashes when you navigate
 * to Therapy Suites.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { TTSProvider } from './src/contexts/TTSContext';
import { ApiProvider } from './src/contexts/ApiContext';
import { UserProvider, useUser } from './src/contexts/UserContext';
import HubScreen from './src/screens/HubScreen';
import LoginScreen from './src/screens/LoginScreen';

// ── Branded Loading Screen ──
const LoadingScreen = () => (
  <View style={loadingStyles.container} accessibilityLabel="Loading CogniVerse">
    <Text style={loadingStyles.logo}>✦</Text>
    <Text style={loadingStyles.title}>CogniVerse</Text>
    <Text style={loadingStyles.subtitle}>Every mind is a universe</Text>
    <ActivityIndicator
      size="small"
      color="rgba(255,255,255,0.6)"
      style={loadingStyles.spinner}
    />
  </View>
);

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1B4B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    color: '#818CF8',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
  },
  spinner: {
    marginTop: 40,
  },
});

// ── Main app content with auth routing ──
const AppContent = () => {
  const { isAuthenticated, isLoading } = useUser();
  const [key, setKey] = useState(0);

  const handleLoginSuccess = () => {
    setKey(prev => prev + 1);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? (
    <HubScreen key={key} />
  ) : (
    <LoginScreen onLoginSuccess={handleLoginSuccess} />
  );
};

// ── Root with all context providers ──
const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TTSProvider>
          <ApiProvider>
            <UserProvider>
              <AppContent />
            </UserProvider>
          </ApiProvider>
        </TTSProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
