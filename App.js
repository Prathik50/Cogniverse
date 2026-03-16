import React, { useState } from 'react';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { TTSProvider } from './src/contexts/TTSContext';
import { ApiProvider } from './src/contexts/ApiContext';
import { UserProvider, useUser } from './src/contexts/UserContext';
import HubScreen from './src/screens/HubScreen';
import LoginScreen from './src/screens/LoginScreen';

const AppContent = () => {
  const { isAuthenticated, isLoading } = useUser();
  const [key, setKey] = useState(0);

  const handleLoginSuccess = () => {
    setKey(prev => prev + 1);
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return isAuthenticated ? (
    <HubScreen key={key} />
  ) : (
    <LoginScreen onLoginSuccess={handleLoginSuccess} />
  );
};

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
