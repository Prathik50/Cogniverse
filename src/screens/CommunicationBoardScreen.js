import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTTS } from '../contexts/TTSContext';
import { useApi } from '../contexts/ApiContext';
import HelpModal from './HelpModal';

// --- SymbolButton Component ---
// A reusable button for our grid
const SymbolButton = ({ symbol, onPress, theme, textSize, spacing }) => {
  const buttonStyles = StyleSheet.create({
    symbolButton: {
      width: 100 * spacing.scale,
      height: 100 * spacing.scale,
      backgroundColor: theme.colors.surface,
      borderRadius: 12 * spacing.scale,
      margin: 8 * spacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    symbolText: {
      fontSize: 18 * textSize.scale,
      color: theme.colors.text,
      fontWeight: '500',
    },
    symbolImage: {
      width: '90%',
      height: '90%',
      resizeMode: 'contain',
    },
  });

  return (
    <TouchableOpacity style={buttonStyles.symbolButton} onPress={() => onPress(symbol)}>
      {symbol.imageUrl ? (
        <Image source={{ uri: symbol.imageUrl }} style={buttonStyles.symbolImage} />
      ) : (
        <Text style={buttonStyles.symbolText}>{symbol.label}</Text>
      )}
    </TouchableOpacity>
  );
};

// --- Main Communication Board Screen ---
const CommunicationBoardScreen = ({ onBack }) => {
  const { currentTheme, currentTextSize, currentSpacing } = useTheme();
  const { speak } = useTTS();
  const { getApiKey, hasApiKey } = useApi();
  const [sentence, setSentence] = useState([]);
  const [customWord, setCustomWord] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const initialSymbols = [
    { id: '1', label: 'I', type: 'word' },
    { id: '2', label: 'want', type: 'word' },
    { id: '3', label: 'play', type: 'word' },
    { id: '4', label: 'eat', type: 'word' },
    { id: '5', label: 'help', type: 'word' },
    { id: '6', label: 'happy', type: 'word' },
  ];
  const [symbols, setSymbols] = useState(initialSymbols);

  // Function to add a symbol to the sentence strip
  const handleSymbolPress = symbol => {
    setSentence([...sentence, symbol.label]);
    speak(symbol.label);
  };

  // --- AI FUNCTION FOR SYMBOL GENERATION ---
  const handleGenerateSymbol = async () => {
    if (!customWord.trim()) return;
    
    if (!hasApiKey('imagen')) {
      Alert.alert(
        'API Key Required', 
        'Please configure your Imagen API key in Settings to generate custom symbols.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);

    const apiKey = getApiKey('imagen');
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
    
    const payload = {
        instances: [{ prompt: `a simple, clear, icon-style picture of: ${customWord}` }],
        parameters: { "sampleCount": 1 }
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.predictions && result.predictions[0] && result.predictions[0].bytesBase64Encoded) {
        const base64Data = result.predictions[0].bytesBase64Encoded;
        const newSymbol = {
          id: Date.now().toString(),
          label: customWord,
          type: 'word',
          imageUrl: `data:image/png;base64,${base64Data}`,
        };
        setSymbols(prevSymbols => [...prevSymbols, newSymbol]);
        setCustomWord(''); // Clear the input field
        speak(`Created symbol for ${customWord}`);
      } else {
        Alert.alert('Error', 'Could not generate image. Please try another word.');
        console.error('API Error:', result);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while connecting to the AI.');
      console.error('Network or Fetch Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border,
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
    headerTitle: {
      fontSize: 20 * currentTextSize.scale,
      fontWeight: '600',
      color: currentTheme.colors.text,
      flex: 1,
    },
    sentenceStrip: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15 * currentSpacing.scale,
      minHeight: 60 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.surface,
      margin: 10 * currentSpacing.scale,
      borderRadius: 12 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
    },
    sentenceText: {
      fontSize: 22 * currentTextSize.scale,
      color: currentTheme.colors.text,
      flex: 1,
    },
    clearButton: {
      padding: 10 * currentSpacing.scale,
    },
    clearButtonText: {
      fontSize: 20 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: 10 * currentSpacing.scale,
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 10 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: currentTheme.colors.border,
    },
    textInput: {
      flex: 1,
      height: 50 * currentSpacing.scale,
      borderColor: currentTheme.colors.border,
      borderWidth: 1,
      borderRadius: 12 * currentSpacing.scale,
      paddingHorizontal: 15 * currentSpacing.scale,
      fontSize: 16 * currentTextSize.scale,
      backgroundColor: currentTheme.colors.background,
      color: currentTheme.colors.text,
    },
    generateButton: {
      marginLeft: 10 * currentSpacing.scale,
      height: 50 * currentSpacing.scale,
      paddingHorizontal: 20 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.primary,
      borderRadius: 12 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
    },
    generateButtonText: {
      color: currentTheme.colors.surface,
      fontSize: 16 * currentTextSize.scale,
      fontWeight: '600',
    },
    helpButton: {
      position: 'absolute',
      bottom: 30 * currentSpacing.scale,
      right: 30 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.primary,
      borderRadius: 30 * currentSpacing.scale,
      width: 60 * currentSpacing.scale,
      height: 60 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: currentTheme.colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    helpIcon: {
      fontSize: 28 * currentTextSize.scale,
      color: currentTheme.colors.surface,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        {onBack && (
          <TouchableOpacity style={dynamicStyles.backButton} onPress={onBack}>
            <Text style={dynamicStyles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={dynamicStyles.headerTitle}>My Voice</Text>
      </View>

      {/* Sentence Strip */}
      <View style={dynamicStyles.sentenceStrip}>
        <Text style={dynamicStyles.sentenceText}>{sentence.join(' ')}</Text>
        {sentence.length > 0 && (
          <TouchableOpacity onPress={() => setSentence([])} style={dynamicStyles.clearButton}>
            <Text style={dynamicStyles.clearButtonText}>X</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Symbols Grid */}
      <ScrollView contentContainerStyle={dynamicStyles.gridContainer}>
        {symbols.map(symbol => (
          <SymbolButton 
            key={symbol.id} 
            symbol={symbol} 
            onPress={handleSymbolPress}
            theme={currentTheme}
            textSize={currentTextSize}
            spacing={currentSpacing}
          />
        ))}
      </ScrollView>

      {/* AI Input Bar */}
      <View style={dynamicStyles.inputContainer}>
        <TextInput
          style={dynamicStyles.textInput}
          placeholder="Type a word to create a symbol..."
          placeholderTextColor={currentTheme.colors.textSecondary}
          value={customWord}
          onChangeText={setCustomWord}
        />
        <TouchableOpacity style={dynamicStyles.generateButton} onPress={handleGenerateSymbol} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={currentTheme.colors.surface} />
          ) : (
            <Text style={dynamicStyles.generateButtonText}>Create</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={dynamicStyles.helpButton} onPress={() => setShowHelp(true)}>
        <Text style={dynamicStyles.helpIcon}>❓</Text>
      </TouchableOpacity>

      <HelpModal visible={showHelp} onClose={() => setShowHelp(false)} context="communicationBoard" />
    </SafeAreaView>
  );
};


export default CommunicationBoardScreen;