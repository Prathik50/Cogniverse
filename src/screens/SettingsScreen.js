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
import { useLanguage } from '../contexts/LanguageContext';
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

  const { t } = useLanguage();
  const { isEnabled, setIsEnabled, rate, setRate } = useTTS();

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
        <Text style={styles.title}>{t('settings')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Visual Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('visualSettings')}</Text>
          
          <View style={styles.option}>
            <Text style={styles.optionLabel}>{t('theme')}</Text>
            <Text style={styles.optionValue}>{t(`themes.${theme}`)}</Text>
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
              <Text style={styles.themeName}>{t(`themes.${key}`)}</Text>
              {theme === key && <Text style={styles.selectedIndicator}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Text Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('textSettings')}</Text>
          
          <View style={styles.option}>
            <Text style={styles.optionLabel}>{t('textSize')}</Text>
            <Text style={styles.optionValue}>{t(`textSizes.${textSize}`)}</Text>
          </View>
          
          {Object.entries(textSizes).map(([key, sizeData]) => (
            <TouchableOpacity
              key={key}
              style={styles.option}
              onPress={() => handleTextSizeChange(key)}
            >
              <Text style={styles.optionLabel}>{t(`textSizes.${key}`)}</Text>
              {textSize === key && <Text style={styles.selectedIndicator}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Spacing Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('spacingSettings')}</Text>
          
          <View style={styles.option}>
            <Text style={styles.optionLabel}>{t('spacing')}</Text>
            <Text style={styles.optionValue}>{t(`spacingOptions.${spacing}`)}</Text>
          </View>
          
          {Object.entries(spacingOptions).map(([key, spacingData]) => (
            <TouchableOpacity
              key={key}
              style={styles.option}
              onPress={() => handleSpacingChange(key)}
            >
              <Text style={styles.optionLabel}>{t(`spacingOptions.${key}`)}</Text>
              {spacing === key && <Text style={styles.selectedIndicator}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('languageSettings')}</Text>
          
          <View style={styles.option}>
            <Text style={styles.optionLabel}>{t('language')}</Text>
            <Text style={styles.optionValue}>{t(`languages.${language === 'en' ? 'english' : 'hindi'}`)}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleLanguageChange('en')}
          >
            <Text style={styles.optionLabel}>{t('languages.english')}</Text>
            {language === 'en' && <Text style={styles.selectedIndicator}>✓</Text>}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleLanguageChange('hi')}
          >
            <Text style={styles.optionLabel}>{t('languages.hindi')}</Text>
            {language === 'hi' && <Text style={styles.selectedIndicator}>✓</Text>}
          </TouchableOpacity>
        </View>

        {/* TTS Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('voiceSettings')}</Text>
          
          <View style={styles.option}>
            <Text style={styles.optionLabel}>{t('enableVoice')}</Text>
            <Switch
              value={isEnabled}
              onValueChange={handleTTSEnable}
              trackColor={{ false: currentTheme.colors.border, true: currentTheme.colors.primary }}
              thumbColor={isEnabled ? currentTheme.colors.surface : currentTheme.colors.textSecondary}
            />
          </View>
          
          <View style={styles.option}>
            <Text style={styles.optionLabel}>{t('speechRate')}</Text>
            <Text style={styles.optionValue}>{Math.round(rate * 100)}%</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;