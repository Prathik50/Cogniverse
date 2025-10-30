import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTTS } from '../contexts/TTSContext';

const SettingsScreen = ({ onBack }) => {
  const {
    theme,
    setTheme,
    textSize,
    setTextSize,
    spacing,
    setSpacing,
    language,
    setLanguage,
    currentTheme,
    currentTextSize,
    currentSpacing,
    themes,
    textSizes,
    spacingOptions,
  } = useTheme();

  const { isEnabled, setIsEnabled, rate, setRate, getLanguageName } = useTTS();

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleTextSizeChange = (newSize) => {
    setTextSize(newSize);
  };

  const handleSpacingChange = (newSpacing) => {
    setSpacing(newSpacing);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const handleTTSEnable = (enabled) => {
    setIsEnabled(enabled);
  };

  const handleRateChange = (newRate) => {
    setRate(newRate);
  };


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
    header: {
      backgroundColor: currentTheme.colors.surface,
      padding: 20 * currentSpacing.scale,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      backgroundColor: currentTheme.colors.primary,
      borderRadius: 25 * currentSpacing.scale,
      width: 50 * currentSpacing.scale,
      height: 50 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16 * currentSpacing.scale,
    },
    backIcon: {
      fontSize: 24 * currentTextSize.scale,
      color: currentTheme.colors.surface,
    },
    title: {
      fontSize: 24 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 20 * currentSpacing.scale,
    },
    section: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 16 * currentSpacing.scale,
      padding: 20 * currentSpacing.scale,
      marginBottom: 20 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
    },
    sectionTitle: {
      fontSize: 18 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
      marginBottom: 16 * currentSpacing.scale,
    },
    option: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12 * currentSpacing.scale,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border,
    },
    optionLabel: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.text,
      flex: 1,
    },
    optionValue: {
      fontSize: 14 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
    },
    themeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12 * currentSpacing.scale,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border,
    },
    themePreview: {
      width: 30 * currentSpacing.scale,
      height: 30 * currentSpacing.scale,
      borderRadius: 15 * currentSpacing.scale,
      marginRight: 12 * currentSpacing.scale,
    },
    themeName: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.text,
      flex: 1,
    },
    selectedIndicator: {
      fontSize: 20 * currentTextSize.scale,
      color: currentTheme.colors.primary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Visual Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visual Settings</Text>
          
          <View style={styles.option}>
            <Text style={styles.optionLabel}>Theme</Text>
            <Text style={styles.optionValue}>{themes[theme].name}</Text>
          </View>
          
          {Object.entries(themes).map(([key, themeData]) => (
            <TouchableOpacity
              key={key}
              style={styles.themeOption}
              onPress={() => handleThemeChange(key)}
            >
              <View
                style={[
                  styles.themePreview,
                  { backgroundColor: themeData.colors.primary }
                ]}
              />
              <Text style={styles.themeName}>{themeData.name}</Text>
              {theme === key && <Text style={styles.selectedIndicator}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Text Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Text Settings</Text>
          
          <View style={styles.option}>
            <Text style={styles.optionLabel}>Text Size</Text>
            <Text style={styles.optionValue}>{textSizes[textSize].name}</Text>
          </View>
          
          {Object.entries(textSizes).map(([key, sizeData]) => (
            <TouchableOpacity
              key={key}
              style={styles.option}
              onPress={() => handleTextSizeChange(key)}
            >
              <Text style={styles.optionLabel}>{sizeData.name}</Text>
              {textSize === key && <Text style={styles.selectedIndicator}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Spacing Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spacing Settings</Text>
          
          <View style={styles.option}>
            <Text style={styles.optionLabel}>Spacing</Text>
            <Text style={styles.optionValue}>{spacingOptions[spacing].name}</Text>
          </View>
          
          {Object.entries(spacingOptions).map(([key, spacingData]) => (
            <TouchableOpacity
              key={key}
              style={styles.option}
              onPress={() => handleSpacingChange(key)}
            >
              <Text style={styles.optionLabel}>{spacingData.name}</Text>
              {spacing === key && <Text style={styles.selectedIndicator}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language Settings</Text>
          
          <View style={styles.option}>
            <Text style={styles.optionLabel}>Language</Text>
            <Text style={styles.optionValue}>{getLanguageName(language)}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleLanguageChange('en')}
          >
            <Text style={styles.optionLabel}>English</Text>
            {language === 'en' && <Text style={styles.selectedIndicator}>✓</Text>}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleLanguageChange('hi')}
          >
            <Text style={styles.optionLabel}>हिंदी (Hindi)</Text>
            {language === 'hi' && <Text style={styles.selectedIndicator}>✓</Text>}
          </TouchableOpacity>
        </View>

        {/* TTS Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voice Settings</Text>
          
          <View style={styles.option}>
            <Text style={styles.optionLabel}>Enable Voice</Text>
            <Switch
              value={isEnabled}
              onValueChange={handleTTSEnable}
              trackColor={{ false: currentTheme.colors.border, true: currentTheme.colors.primary }}
              thumbColor={isEnabled ? currentTheme.colors.surface : currentTheme.colors.textSecondary}
            />
          </View>
          
          <View style={styles.option}>
            <Text style={styles.optionLabel}>Speech Rate</Text>
            <Text style={styles.optionValue}>{Math.round(rate * 100)}%</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;