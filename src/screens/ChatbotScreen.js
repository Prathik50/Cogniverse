import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import { useUser } from '../contexts/UserContext';

// --- !!! PASTE YOUR KEY HERE !!! ---
// 1. Get your key from https://aistudio.google.com/
// 2. Paste it here to enable the REAL AI.
const YOUR_API_KEY_HERE = 'AIzaSyBSCUaw68g1maX7sXkkBT0_ZiVCgolYQtQ';
// -------------------------------------

const ChatbotScreen = ({ onBack }) => {
  const { currentTheme, currentTextSize, currentSpacing, language } = useTheme();
  const { t } = useLanguage();
  const { speak, stop } = useTTS();
  const { userData } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    const systemMessage = {
      id: 'system-intro',
      text: `${t('hiUser')} ${userData?.name || t('friend')}${t('chatbotIntro')}`,
      sender: 'bot',
    };
    setMessages([systemMessage]);
  }, [userData, t]);

  const handleSend = async () => {
    if (input.trim() === '' || loading) return;

    if (!YOUR_API_KEY_HERE) {
      const errorBotMessage = {
        id: Math.random().toString(),
        text: t('apiKeyMissing'),
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorBotMessage]);
      speak(errorBotMessage.text);
      return;
    }

    const userMessage = {
      id: Math.random().toString(),
      text: input,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Stop any currently playing speech
    stop();

    const chatHistory = messages.map(msg => ({
      role: msg.sender === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }],
    }));

    try {
      const apiKey = YOUR_API_KEY_HERE; // Use your real key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

      const payload = {
        contents: [
          ...chatHistory,
          {
            role: 'user',
            parts: [{ text: input }],
          },
        ],
        systemInstruction: {
          parts: [
            {
              text: language === 'hi' 
                ? 'आप CogniBot हैं, CogniVerse ऐप के लिए एक मित्रवत और सहायक AI सहायक। आपके प्राथमिक उपयोगकर्ता बच्चे और ऑटिज़्म सहित सीखने के अंतर वाले व्यक्ति हैं। आपको हमेशा इन नियमों का पालन करना चाहिए:\n1. धैर्यवान, दयालु और अत्यंत प्रोत्साहक बनें।\n2. सरल, स्पष्ट और प्रत्यक्ष भाषा का उपयोग करें। कठिन शब्दों और जटिल रूपकों से बचें।\n3. उत्तरों को संक्षिप्त रखें, उन्हें छोटे पैराग्राफ या सरल चरणों में तोड़ें।\n4. यदि कोई जटिल विषय पूछा जाए, तो इसे बच्चे के स्तर तक सरल बनाएं।\n5. यदि उपयोगकर्ता का संदेश अस्पष्ट है, तो धीरे से स्पष्टीकरण मांगें।\n6. आपका उद्देश्य मदद करना और शिक्षित करना है।\n7. हमेशा हिंदी में जवाब दें।'
                : 'You are CogniBot, a friendly and helpful AI assistant for the CogniVerse app. Your primary users are children and individuals with learning differences, including autism. You must ALWAYS follow these rules:\n1. Be patient, kind, and extremely encouraging.\n2. Use simple, clear, and direct language. Avoid slang, idioms, and complex metaphors.\n3. Keep answers concise, breaking them into short paragraphs or simple steps.\n4. If asked a complex topic, simplify it to a child\'s level.\n5. If the user\'s message is unclear, gently ask for clarification. Do not be condescending.\n6. Your purpose is to help and educate.\n7. Always respond in English.',
            },
          ],
        },
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        console.error('--- DETAILED API ERROR ---');
        console.error('API Error Status:', response.status);
        console.error('API Error Body:', JSON.stringify(errorBody, null, 2));
        console.error('--- END OF ERROR ---');
        
        const errorMessage = `Oops! I'm having trouble. Error: ${errorBody.error?.message || response.statusText}`;
        const errorBotMessage = {
          id: Math.random().toString(),
          text: errorMessage,
          sender: 'bot',
        };
        setMessages(prev => [...prev, errorBotMessage]);
        setLoading(false);
        return; 
      }

      // If the response IS successful
      const result = await response.json();
      const candidate = result.candidates?.[0];

      if (candidate && candidate.content?.parts?.[0]?.text) {
        const botResponseText = candidate.content.parts[0].text;
        const botMessage = {
          id: Math.random().toString(),
          text: botResponseText,
          sender: 'bot',
        };
        setMessages(prev => [...prev, botMessage]);
        speak(botResponseText); // Speak the response
      } else {
        console.warn('API Response was OK but had no content:', result);
        const noTextError = {
          id: Math.random().toString(),
          text: "I received a response, but it was empty. Maybe try rephrasing your question?",
          sender: 'bot',
        };
        setMessages(prev => [...prev, noTextError]);
      }
    } catch (error) {
      console.error('Network or fetch error:', error.toString());
      const networkErrorMessage = {
        id: Math.random().toString(),
        text: "Oops! I couldn't connect. Please check your internet connection.",
        sender: 'bot',
      };
      setMessages(prev => [...prev, networkErrorMessage]);
    } finally {
      setLoading(false);
    }
  };
  // --- END OF UPDATED HANDLE_SEND FUNCTION ---

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: currentTheme.colors.surface,
      padding: 20 * currentSpacing.scale,
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
      fontSize: 24 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
    },
    chatContainer: {
      flex: 1,
      padding: 10 * currentSpacing.scale,
    },
    messageRow: {
      flexDirection: 'row',
      marginVertical: 8 * currentSpacing.scale,
    },
    botBubble: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 20 * currentSpacing.scale,
      padding: 14 * currentSpacing.scale,
      maxWidth: '80%',
      alignSelf: 'flex-start',
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
    },
    userBubble: {
      backgroundColor: currentTheme.colors.primary,
      borderRadius: 20 * currentSpacing.scale,
      padding: 14 * currentSpacing.scale,
      maxWidth: '80%',
      alignSelf: 'flex-end',
    },
    botText: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.text,
      lineHeight: 24 * currentTextSize.scale,
    },
    userText: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.surface,
      lineHeight: 24 * currentTextSize.scale,
    },
    botIcon: {
      fontSize: 24,
      marginRight: 8 * currentSpacing.scale,
      color: currentTheme.colors.textSecondary,
    },
    userIcon: {
      fontSize: 24,
      marginLeft: 8 * currentSpacing.scale,
      color: currentTheme.colors.textSecondary,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10 * currentSpacing.scale,
      marginVertical: 8 * currentSpacing.scale,
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 10 * currentSpacing.scale,
      borderTopWidth: 1,
      borderTopColor: currentTheme.colors.border,
      backgroundColor: currentTheme.colors.surface,
      alignItems: 'center',
    },
    input: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
      borderRadius: 25 * currentSpacing.scale,
      paddingHorizontal: 20 * currentSpacing.scale,
      paddingVertical: 12 * currentSpacing.scale,
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.text,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
      marginRight: 10 * currentSpacing.scale,
    },
    sendButton: {
      backgroundColor: currentTheme.colors.primary,
      borderRadius: 25 * currentSpacing.scale,
      width: 50 * currentSpacing.scale,
      height: 50 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonText: {
      fontSize: 20,
      color: currentTheme.colors.surface,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('chatbot')}</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          style={styles.chatContainer}
          data={[...messages, ...(loading ? [{ id: 'loading', type: 'loading' }] : [])]}
          keyExtractor={item => item.id}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            if (item.type === 'loading') {
              return (
                <View style={styles.loadingContainer}>
                  <Text style={styles.botIcon}>🤖</Text>
                  <ActivityIndicator size="small" color={currentTheme.colors.primary} />
                </View>
              );
            }
            const isBot = item.sender === 'bot';
            return (
              <View style={[styles.messageRow, { justifyContent: isBot ? 'flex-start' : 'flex-end' }]}>
                {isBot && <Text style={styles.botIcon}>🤖</Text>}
                <View style={isBot ? styles.botBubble : styles.userBubble}>
                  <Text style={isBot ? styles.botText : styles.userText}>{item.text}</Text>
                </View>
                {!isBot && <Text style={styles.userIcon}>👤</Text>}
              </View>
            );
          }}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder={t('typeMessage')}
            placeholderTextColor={currentTheme.colors.textSecondary}
            onSubmitEditing={handleSend}
            editable={!loading}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
            <Text style={styles.sendButtonText}>▲</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatbotScreen;