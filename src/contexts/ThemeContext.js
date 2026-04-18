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
        primary: '#4338CA',        // Rich Indigo
        primaryDark: '#312E81',
        primaryLight: '#818CF8',
        secondary: '#0F172A',      // Deep Slate
        background: '#F8FAFC',     // Ultra light cool gray
        surface: '#FFFFFF',
        surfaceElevated: '#FFFFFF',
        text: '#0F172A',           // Slate 900
        textSecondary: '#64748B',  // Slate 500
        textMuted: '#94A3B8',      // Slate 400
        border: '#E2E8F0',         // Slate 200
        borderLight: '#F1F5F9',    // Slate 100
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        accent: '#8B5CF6',         // Vibrant Purple
        accentSecondary: '#EC4899', // Pink
        gradient1: '#4338CA',
        gradient2: '#8B5CF6',
        cardBg: '#FFFFFF',
        shadow: 'rgba(15, 23, 42, 0.08)', // Soft slate shadow
      },
      shadows: {
        sm: {
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
        },
        md: {
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 4,
        },
        lg: {
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.08,
          shadowRadius: 20,
          elevation: 8,
        },
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
      shadows: { sm: {}, md: {}, lg: {} },
      fonts: { regular: 'System', bold: 'System' },
    },
    sepia: {
      name: 'Sepia',
      colors: {
        primary: '#8B4513',
        secondary: '#D2691E',
        background: '#FAF0E6',
        surface: '#FFF8DC',
        text: '#2F1B14',
        textSecondary: '#8B4513',
        border: '#D2B48C',
        success: '#228B22',
        warning: '#B8860B',
        error: '#8B0000',
        accent: '#A0522D',
      },
      shadows: {
        md: {
          shadowColor: '#8B4513',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }
      },
      fonts: { regular: 'System', bold: 'System' },
    },
  };

  const textSizes = {
    small: { scale: 0.85, name: 'Small' },
    medium: { scale: 1.0, name: 'Medium' },
    large: { scale: 1.15, name: 'Large' },
    extraLarge: { scale: 1.3, name: 'Extra Large' },
  };

  const spacingOptions = {
    compact: { scale: 0.85, name: 'Compact' },
    normal: { scale: 1.0, name: 'Normal' },
    spacious: { scale: 1.15, name: 'Spacious' },
    extraSpacious: { scale: 1.3, name: 'Extra Spacious' },
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