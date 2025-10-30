import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('calm');
  const [textSize, setTextSize] = useState('medium');
  const [spacing, setSpacing] = useState('normal');
  const [language, setLanguage] = useState('en');

  // Load saved preferences
  useEffect(() => {
    // In a real app, you'd load from AsyncStorage
    const savedTheme = 'calm'; // Default
    const savedTextSize = 'medium';
    const savedSpacing = 'normal';
    const savedLanguage = 'en';
    
    setTheme(savedTheme);
    setTextSize(savedTextSize);
    setSpacing(savedSpacing);
    setLanguage(savedLanguage);
  }, []);

  const themes = {
    calm: {
      name: 'Calm',
      colors: {
        primary: '#4A90E2',
        secondary: '#7ED321',
        background: '#F8F9FA',
        surface: '#FFFFFF',
        text: '#2C3E50',
        textSecondary: '#7F8C8D',
        border: '#E1E8ED',
        success: '#27AE60',
        warning: '#F39C12',
        error: '#E74C3C',
        accent: '#9B59B6',
      },
      fonts: {
        regular: 'System',
        bold: 'System',
      },
    },
    highContrast: {
      name: 'High Contrast',
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        background: '#000000',
        surface: '#1A1A1A',
        text: '#FFFFFF',
        textSecondary: '#CCCCCC',
        border: '#333333',
        success: '#00FF00',
        warning: '#FFFF00',
        error: '#FF0000',
        accent: '#00FFFF',
      },
      fonts: {
        regular: 'System',
        bold: 'System',
      },
    },
    sepia: {
      name: 'Sepia',
      colors: {
        primary: '#8B4513',
        secondary: '#D2691E',
        background: '#F5F5DC',
        surface: '#FFF8DC',
        text: '#2F1B14',
        textSecondary: '#8B4513',
        border: '#D2B48C',
        success: '#228B22',
        warning: '#B8860B',
        error: '#8B0000',
        accent: '#A0522D',
      },
      fonts: {
        regular: 'System',
        bold: 'System',
      },
    },
  };

  const textSizes = {
    small: { scale: 0.8, name: 'Small' },
    medium: { scale: 1.0, name: 'Medium' },
    large: { scale: 1.2, name: 'Large' },
    extraLarge: { scale: 1.4, name: 'Extra Large' },
  };

  const spacingOptions = {
    compact: { scale: 0.8, name: 'Compact' },
    normal: { scale: 1.0, name: 'Normal' },
    spacious: { scale: 1.2, name: 'Spacious' },
    extraSpacious: { scale: 1.4, name: 'Extra Spacious' },
  };

  const currentTheme = themes[theme];
  const currentTextSize = textSizes[textSize];
  const currentSpacing = spacingOptions[spacing];

  const value = {
    theme,
    setTheme,
    textSize,
    setTextSize,
    spacing,
    setSpacing,
    language,
    setLanguage,
    themes,
    textSizes,
    spacingOptions,
    currentTheme,
    currentTextSize,
    currentSpacing,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};