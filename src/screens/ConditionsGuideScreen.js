import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import {
  AutismIcon,
  DownSyndromeIcon,
  ADHDIcon,
  DyslexiaIcon,
  CerebralPalsyIcon,
  IntellectualDisabilityIcon,
  SpeechDelayIcon,
  BackArrowIcon,
  ChatbotIcon,
  SendIcon,
} from '../components/icons/ConditionIcons';

// --- !!! PASTE YOUR GEMINI API KEY HERE !!! ---
// Get your key from https://aistudio.google.com/
const YOUR_API_KEY_HERE = 'AIzaSyBSCUaw68g1maX7sXkkBT0_ZiVCgolYQtQ';
// -------------------------------------

const ConditionsGuideScreen = ({ onBack }) => {
  const { currentTheme, currentTextSize, currentSpacing, language } = useTheme();
  const { t } = useLanguage();
  const { speak } = useTTS();
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = React.useRef(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedCondition, showChatbot]);

  const conditions = [
    {
      id: 'asd',
      IconComponent: AutismIcon,
      color: '#6366F1',
      gradient: ['#6366F1', '#8B5CF6'],
    },
    {
      id: 'downSyndrome',
      IconComponent: DownSyndromeIcon,
      color: '#10B981',
      gradient: ['#10B981', '#14B8A6'],
    },
    {
      id: 'adhd',
      IconComponent: ADHDIcon,
      color: '#F59E0B',
      gradient: ['#F59E0B', '#F97316'],
    },
    {
      id: 'dyslexia',
      IconComponent: DyslexiaIcon,
      color: '#8B5CF6',
      gradient: ['#8B5CF6', '#A855F7'],
    },
    {
      id: 'cerebralPalsy',
      IconComponent: CerebralPalsyIcon,
      color: '#EC4899',
      gradient: ['#EC4899', '#F43F5E'],
    },
    {
      id: 'intellectualDisability',
      IconComponent: IntellectualDisabilityIcon,
      color: '#14B8A6',
      gradient: ['#14B8A6', '#06B6D4'],
    },
    {
      id: 'speechDelay',
      IconComponent: SpeechDelayIcon,
      color: '#F97316',
      gradient: ['#F97316', '#FB923C'],
    },
  ];

  const handleConditionPress = (condition) => {
    speak(t(`conditionsGuide.${condition.id}.name`));
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    scaleAnim.setValue(0.9);
    setSelectedCondition(condition);
    setShowChatbot(false);
  };

  const handleBackToList = () => {
    speak(t('returningToList'));
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    scaleAnim.setValue(0.9);
    setSelectedCondition(null);
    setShowChatbot(false);
  };

  const handleChatbotPress = () => {
    speak(t('openingChatbot'));
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    scaleAnim.setValue(0.9);
    setShowChatbot(true);
    if (messages.length === 0) {
      const introMessage = language === 'hi' 
        ? `नमस्ते! मैं ${t(`conditionsGuide.${selectedCondition.id}.name`)} के बारे में आपके सवालों का जवाब देने के लिए यहां हूं। आप मुझसे कुछ भी पूछ सकते हैं।`
        : `Hello! I'm here to answer your questions about ${t(`conditionsGuide.${selectedCondition.id}.name`)}. Ask me anything!`;
      
      setMessages([{
        id: '1',
        text: introMessage,
        sender: 'bot',
      }]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    if (!YOUR_API_KEY_HERE) {
      const errorMessage = {
        id: Date.now().toString(),
        text: language === 'hi' 
          ? 'कृपया Gemini API कुंजी जोड़ें। ConditionsGuideScreen.js में YOUR_API_KEY_HERE देखें।'
          : 'Please add your Gemini API key. See YOUR_API_KEY_HERE in ConditionsGuideScreen.js',
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setLoading(true);

    // Build chat history for context
    const chatHistory = messages
      .filter(msg => msg.id !== '1') // Exclude intro message
      .map(msg => ({
        role: msg.sender === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${YOUR_API_KEY_HERE}`;

      const conditionName = t(`conditionsGuide.${selectedCondition.id}.name`);
      const systemPrompt = language === 'hi'
        ? `आप ${conditionName} के बारे में एक विशेषज्ञ सहायक हैं। आप माता-पिता और देखभाल करने वालों को इस स्थिति को समझने में मदद करते हैं। हमेशा:\n1. सरल, स्पष्ट हिंदी में जवाब दें\n2. दयालु और प्रोत्साहक बनें\n3. व्यावहारिक सलाह दें\n4. चिकित्सा शब्दों को सरल बनाएं\n5. आशा और सकारात्मकता बनाए रखें\n6. यदि चिकित्सा सलाह की आवश्यकता है, तो पेशेवर से परामर्श करने की सलाह दें`
        : `You are an expert assistant about ${conditionName}. You help parents and caregivers understand this condition. Always:\n1. Respond in simple, clear English\n2. Be kind and encouraging\n3. Provide practical advice\n4. Simplify medical terms\n5. Maintain hope and positivity\n6. If medical advice is needed, recommend consulting a professional`;

      const payload = {
        contents: [
          ...chatHistory,
          {
            role: 'user',
            parts: [{ text: userInput }],
          },
        ],
        systemInstruction: {
          parts: [{ text: systemPrompt }],
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
        console.error('API Error:', errorBody);
        
        const errorMessage = {
          id: Date.now().toString(),
          text: language === 'hi'
            ? `क्षमा करें, मुझे एक त्रुटि हुई: ${errorBody.error?.message || response.statusText}`
            : `Sorry, I encountered an error: ${errorBody.error?.message || response.statusText}`,
          sender: 'bot',
        };
        setMessages(prev => [...prev, errorMessage]);
        setLoading(false);
        return;
      }

      const result = await response.json();
      const candidate = result.candidates?.[0];

      if (candidate && candidate.content?.parts?.[0]?.text) {
        const botResponseText = candidate.content.parts[0].text;
        const botMessage = {
          id: Date.now().toString(),
          text: botResponseText,
          sender: 'bot',
        };
        setMessages(prev => [...prev, botMessage]);
        speak(botResponseText);
      } else {
        const noContentMessage = {
          id: Date.now().toString(),
          text: language === 'hi'
            ? 'मुझे कोई उत्तर नहीं मिला। कृपया अपना प्रश्न फिर से लिखें।'
            : 'I received no response. Please rephrase your question.',
          sender: 'bot',
        };
        setMessages(prev => [...prev, noContentMessage]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      const errorMessage = {
        id: Date.now().toString(),
        text: language === 'hi'
          ? `नेटवर्क त्रुटि: ${error.message}`
          : `Network error: ${error.message}`,
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
    header: {
      backgroundColor: currentTheme.colors.primary,
      padding: 16 * currentSpacing.scale,
      paddingTop: 50 * currentSpacing.scale,
      paddingBottom: 24 * currentSpacing.scale,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8 * currentSpacing.scale,
    },
    backButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      borderRadius: 25 * currentSpacing.scale,
      width: 50 * currentSpacing.scale,
      height: 50 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16 * currentSpacing.scale,
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    backIcon: {
      fontSize: 24 * currentTextSize.scale,
      color: '#FFFFFF',
    },
    headerTitle: {
      fontSize: 28 * currentTextSize.scale,
      fontWeight: '800',
      color: '#FFFFFF',
      flex: 1,
    },
    headerSubtitle: {
      fontSize: 15 * currentTextSize.scale,
      color: 'rgba(255, 255, 255, 0.9)',
      marginTop: 4 * currentSpacing.scale,
      marginLeft: 66 * currentSpacing.scale,
    },
    content: {
      flex: 1,
      padding: 20 * currentSpacing.scale,
    },
    conditionCard: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 24 * currentSpacing.scale,
      padding: 20 * currentSpacing.scale,
      marginBottom: 16 * currentSpacing.scale,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: currentTheme.colors.border || 'rgba(0,0,0,0.05)',
    },
    conditionIconContainer: {
      width: 72 * currentSpacing.scale,
      height: 72 * currentSpacing.scale,
      borderRadius: 20 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16 * currentSpacing.scale,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    conditionIcon: {
      fontSize: 32 * currentTextSize.scale,
    },
    conditionInfo: {
      flex: 1,
    },
    conditionName: {
      fontSize: 22 * currentTextSize.scale,
      fontWeight: '700',
      color: currentTheme.colors.text,
      marginBottom: 6 * currentSpacing.scale,
      letterSpacing: 0.3,
    },
    conditionPreview: {
      fontSize: 15 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      lineHeight: 22 * currentTextSize.scale,
    },
    detailSection: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 20 * currentSpacing.scale,
      padding: 24 * currentSpacing.scale,
      marginBottom: 16 * currentSpacing.scale,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      borderWidth: 1,
      borderColor: currentTheme.colors.border || 'rgba(0,0,0,0.05)',
    },
    sectionTitle: {
      fontSize: 22 * currentTextSize.scale,
      fontWeight: '700',
      color: currentTheme.colors.text,
      marginBottom: 16 * currentSpacing.scale,
      letterSpacing: 0.3,
    },
    sectionText: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      lineHeight: 26 * currentTextSize.scale,
      marginBottom: 8 * currentSpacing.scale,
    },
    severityContainer: {
      marginTop: 12 * currentSpacing.scale,
    },
    severityLevel: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16 * currentSpacing.scale,
      padding: 16 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.background,
      borderRadius: 12 * currentSpacing.scale,
    },
    severityDot: {
      width: 12 * currentSpacing.scale,
      height: 12 * currentSpacing.scale,
      borderRadius: 6 * currentSpacing.scale,
      marginRight: 12 * currentSpacing.scale,
      marginTop: 4 * currentSpacing.scale,
    },
    severityContent: {
      flex: 1,
    },
    severityTitle: {
      fontSize: 17 * currentTextSize.scale,
      fontWeight: '600',
      color: currentTheme.colors.text,
      marginBottom: 6 * currentSpacing.scale,
    },
    severityDescription: {
      fontSize: 14 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      lineHeight: 20 * currentTextSize.scale,
    },
    chatbotButton: {
      backgroundColor: currentTheme.colors.accent,
      borderRadius: 20 * currentSpacing.scale,
      padding: 20 * currentSpacing.scale,
      marginTop: 16 * currentSpacing.scale,
      marginBottom: 20 * currentSpacing.scale,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: currentTheme.colors.accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
      minHeight: 60 * currentSpacing.scale,
    },
    chatbotButtonText: {
      fontSize: 19 * currentTextSize.scale,
      fontWeight: '700',
      color: '#FFFFFF',
      marginLeft: 12 * currentSpacing.scale,
      letterSpacing: 0.5,
    },
    chatContainer: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
    messagesContainer: {
      padding: 16 * currentSpacing.scale,
      paddingBottom: 8 * currentSpacing.scale,
      flexGrow: 1,
    },
    messageBubble: {
      maxWidth: '80%',
      padding: 18 * currentSpacing.scale,
      borderRadius: 24 * currentSpacing.scale,
      marginBottom: 12 * currentSpacing.scale,
    },
    userBubble: {
      alignSelf: 'flex-end',
      backgroundColor: currentTheme.colors.primary,
      shadowColor: currentTheme.colors.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
    },
    botBubble: {
      alignSelf: 'flex-start',
      backgroundColor: currentTheme.colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 4,
      borderWidth: 1,
      borderColor: currentTheme.colors.border || 'rgba(0,0,0,0.05)',
    },
    messageText: {
      fontSize: 16 * currentTextSize.scale,
      lineHeight: 24 * currentTextSize.scale,
    },
    userText: {
      color: '#FFFFFF',
    },
    botText: {
      color: currentTheme.colors.text,
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 16 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: currentTheme.colors.border,
    },
    input: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
      borderRadius: 28 * currentSpacing.scale,
      paddingHorizontal: 20 * currentSpacing.scale,
      paddingVertical: 14 * currentSpacing.scale,
      fontSize: 17 * currentTextSize.scale,
      color: currentTheme.colors.text,
      marginRight: 12 * currentSpacing.scale,
      borderWidth: 1.5,
      borderColor: currentTheme.colors.border || 'rgba(0,0,0,0.1)',
      minHeight: 52 * currentSpacing.scale,
    },
    sendButton: {
      backgroundColor: currentTheme.colors.primary,
      borderRadius: 26 * currentSpacing.scale,
      width: 52 * currentSpacing.scale,
      height: 52 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: currentTheme.colors.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
    sendButtonText: {
      fontSize: 20 * currentTextSize.scale,
      color: '#FFFFFF',
    },
  });

  if (showChatbot && selectedCondition) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => setShowChatbot(false)}
              activeOpacity={0.7}
            >
              <BackArrowIcon size={24 * currentTextSize.scale} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('conditionsGuide.chatbot')}</Text>
          </View>
          <Text style={styles.headerSubtitle}>{t(`conditionsGuide.${selectedCondition.id}.name`)}</Text>
        </View>

        <KeyboardAvoidingView 
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesContainer}
              showsVerticalScrollIndicator={true}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
              renderItem={({ item }) => (
                <View style={[
                  styles.messageBubble,
                  item.sender === 'user' ? styles.userBubble : styles.botBubble
                ]}>
                  <Text style={[
                    styles.messageText,
                    item.sender === 'user' ? styles.userText : styles.botText
                  ]}>
                    {item.text}
                  </Text>
                </View>
              )}
            />
          </Animated.View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder={t('typeYourQuestion')}
              placeholderTextColor={currentTheme.colors.textSecondary}
              onSubmitEditing={handleSend}
              editable={!loading}
            />
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={handleSend}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <SendIcon size={20 * currentTextSize.scale} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (selectedCondition) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBackToList}
              activeOpacity={0.7}
            >
              <BackArrowIcon size={24 * currentTextSize.scale} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t(`conditionsGuide.${selectedCondition.id}.name`)}</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Overview */}
          <Animated.View style={[
            styles.detailSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
            }
          ]}>
            <Text style={styles.sectionTitle}>{t('conditionsGuide.overview')}</Text>
            <Text style={styles.sectionText}>
              {t(`conditionsGuide.${selectedCondition.id}.overview`)}
            </Text>
          </Animated.View>

          {/* Characteristics */}
          <Animated.View style={[
            styles.detailSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
            }
          ]}>
            <Text style={styles.sectionTitle}>{t('conditionsGuide.characteristics')}</Text>
            <Text style={styles.sectionText}>
              {t(`conditionsGuide.${selectedCondition.id}.characteristics`)}
            </Text>
          </Animated.View>

          {/* Severity Levels */}
          <Animated.View style={[
            styles.detailSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
            }
          ]}>
            <Text style={styles.sectionTitle}>{t('conditionsGuide.severityLevels')}</Text>
            <View style={styles.severityContainer}>
              <View style={styles.severityLevel}>
                <View style={[styles.severityDot, { backgroundColor: '#10B981' }]} />
                <View style={styles.severityContent}>
                  <Text style={styles.severityTitle}>{t('conditionsGuide.mild')}</Text>
                  <Text style={styles.severityDescription}>
                    {t(`conditionsGuide.${selectedCondition.id}.mild`)}
                  </Text>
                </View>
              </View>

              <View style={styles.severityLevel}>
                <View style={[styles.severityDot, { backgroundColor: '#F59E0B' }]} />
                <View style={styles.severityContent}>
                  <Text style={styles.severityTitle}>{t('conditionsGuide.moderate')}</Text>
                  <Text style={styles.severityDescription}>
                    {t(`conditionsGuide.${selectedCondition.id}.moderate`)}
                  </Text>
                </View>
              </View>

              <View style={styles.severityLevel}>
                <View style={[styles.severityDot, { backgroundColor: '#EF4444' }]} />
                <View style={styles.severityContent}>
                  <Text style={styles.severityTitle}>{t('conditionsGuide.severe')}</Text>
                  <Text style={styles.severityDescription}>
                    {t(`conditionsGuide.${selectedCondition.id}.severe`)}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* How This App Helps */}
          <Animated.View style={[
            styles.detailSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
            }
          ]}>
            <Text style={styles.sectionTitle}>{t('conditionsGuide.howAppHelps')}</Text>
            <Text style={styles.sectionText}>
              {t(`conditionsGuide.${selectedCondition.id}.howAppHelps`)}
            </Text>
          </Animated.View>

          {/* Chatbot Button */}
          <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }}>
            <TouchableOpacity 
              style={styles.chatbotButton} 
              onPress={handleChatbotPress}
              activeOpacity={0.8}
            >
              <ChatbotIcon size={28 * currentTextSize.scale} color="#FFFFFF" />
              <Text style={styles.chatbotButtonText}>{t('conditionsGuide.askQuestions')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBack}
            activeOpacity={0.7}
          >
            <BackArrowIcon size={24 * currentTextSize.scale} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('conditionsGuide.title')}</Text>
        </View>
        <Text style={styles.headerSubtitle}>{t('conditionsGuide.subtitle')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {conditions.map((condition, index) => (
          <Animated.View
            key={condition.id}
            style={{
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }}
          >
            <TouchableOpacity
              style={styles.conditionCard}
              onPress={() => handleConditionPress(condition)}
              activeOpacity={0.85}
            >
              <View style={[styles.conditionIconContainer, { backgroundColor: condition.color + '20' }]}>
                <condition.IconComponent size={48 * currentSpacing.scale} color={condition.color} />
              </View>
              <View style={styles.conditionInfo}>
                <Text style={styles.conditionName}>
                  {t(`conditionsGuide.${condition.id}.name`)}
                </Text>
                <Text style={styles.conditionPreview}>
                  {t(`conditionsGuide.${condition.id}.preview`)}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConditionsGuideScreen;
