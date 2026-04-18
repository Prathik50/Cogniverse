/**
 * ConditionsGuideScreen — Full Overhaul
 * =======================================
 * Includes a search bar, SVG wave header, condition cards
 * with inline accordion expansion (preview + Learn More),
 * and dynamic colors for each condition.
 * Preserves the existing Detail view and Chatbot views.
 */

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
  Dimensions,
  BackHandler,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import {
  AutismIcon,
  DownSyndromeIcon,
  DyslexiaIcon,
  IntellectualDisabilityIcon,
  BackArrowIcon,
  ChatbotIcon,
  SendIcon,
} from '../components/icons/ConditionIcons';
import ConditionCard from '../components/ConditionCard';
import { GEMINI_API_KEY } from '../config/apiKeys';
import { COLORS, SPACING, RADII, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

// ── Shared Card Touch Component for Details ──
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const TouchCard = ({ children, onPress, style }) => {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <AnimatedTouchable
      style={[style, { transform: [{ scale }] }]}
      activeOpacity={0.9}
      onPressIn={() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
      onPress={onPress}
    >
      {children}
    </AnimatedTouchable>
  );
};

// ── Conditions List ──
const CONDITIONS_DATA = [
  { id: 'asd', IconComponent: AutismIcon, color: '#A855F7' }, // Purple
  { id: 'downSyndrome', IconComponent: DownSyndromeIcon, color: '#14B8A6' }, // Teal
  { id: 'dyslexia', IconComponent: DyslexiaIcon, color: '#6366F1' }, // Indigo
  { id: 'intellectualDisability', IconComponent: IntellectualDisabilityIcon, color: '#10B981' }, // Green
];

// ════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════
const ConditionsGuideScreen = ({ onBack }) => {
  const { language } = useTheme();
  const { t } = useLanguage();
  const { speak } = useTTS();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState(null);
  
  // Chatbot State for details view
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const listFade = useRef(new Animated.Value(0)).current;

  // Initial animation
  useEffect(() => {
    Animated.timing(listFade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [listFade]);

  // Back handler logic
  useEffect(() => {
    const onHardwareBack = () => {
      if (showChatbot) { setShowChatbot(false); return true; }
      if (selectedCondition) { setSelectedCondition(null); return true; }
      onBack();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => BackHandler.removeEventListener('hardwareBackPress', onHardwareBack);
  }, [selectedCondition, showChatbot, onBack]);

  // Auto-scroll inside chatbot
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Navigate to Detail View
  const handleLearnMore = (condition) => {
    speak(t(`conditionsGuide.${condition.id}.name`));
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
    ]).start();
    setSelectedCondition(condition);
    setShowChatbot(false);
  };

  const handleBackToList = () => {
    speak(t('returningToList'));
    setSelectedCondition(null);
    setShowChatbot(false);
  };

  const handleChatbotPress = () => {
    speak(t('openingChatbot'));
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
    setShowChatbot(true);
    
    if (messages.length === 0) {
      const introMessage = language === 'hi' 
        ? `नमस्ते! मैं ${t(`conditionsGuide.${selectedCondition.id}.name`)} के बारे में आपके सवालों का जवाब देने के लिए यहां हूं। आप मुझसे कुछ भी पूछ सकते हैं।`
        : `Hello! I'm here to answer your questions about ${t(`conditionsGuide.${selectedCondition.id}.name`)}. Ask me anything!`;
      
      setMessages([{ id: '1', text: introMessage, sender: 'bot' }]);
    }
  };

  // Filter conditions
  const filteredConditions = CONDITIONS_DATA.filter((c) => {
    const name = t(`conditionsGuide.${c.id}.name`) || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Offline KB Logic (same as original)
  const getConditionResponse = (userInput, conditionId) => {
    const input = userInput.toLowerCase();
    const conditionName = t(`conditionsGuide.${conditionId}.name`);
    const isHindi = language === 'hi';
    
    const responses = {
      asd: {
        keywords: {
          'symptom|sign|diagnos|detect|identify': isHindi
            ? `ऑटिज्म के लक्षण:\n• सामाजिक संचार में कठिनाई\n• दोहराव वाले व्यवहार\n• संवेदी संवेदनशीलता\n• आंखों से संपर्क में कठिनाई\n• बदलाव के प्रति प्रतिरोध\n\nजल्दी पहचान और हस्तक्षेप बहुत महत्वपूर्ण है! 💙`
            : `Common signs of Autism include:\n• Difficulty with social communication\n• Repetitive behaviors or restricted interests\n• Sensory sensitivities\n• Difficulty with eye contact\n• Resistance to changes in routine\n\nEarly identification and intervention is key! 💙`,
          'therapy|treatment|help|support|intervention': isHindi
            ? `ऑटिज्म के लिए प्रभावी थेरेपी:\n• ABA (Applied Behavior Analysis)\n• स्पीच थेरेपी\n• ऑक्यूपेशनल थेरेपी\n• सोशल स्किल्स ट्रेनिंग\n• संवेदी एकीकरण थेरेपी\n\nहर बच्चा अलग है, इसलिए व्यक्तिगत योजना सबसे अच्छी है! 🌟`
            : `Effective therapies for Autism:\n• ABA (Applied Behavior Analysis)\n• Speech & Language Therapy\n• Occupational Therapy\n• Social Skills Training\n• Sensory Integration Therapy\n\nEvery child is different, so individualized plans work best! 🌟`,
          'cause|why|reason|genetic': isHindi
            ? `ऑटिज्म के कारण:\n• आनुवंशिक कारक (मुख्य)\n• मस्तिष्क के विकास में अंतर\n• यह किसी की गलती नहीं है\n• यह टीकों से नहीं होता\n\nऑटिज्म एक अलग सोचने का तरीका है, बीमारी नहीं! 🧠`
            : `Causes of Autism:\n• Genetic factors (primary cause)\n• Differences in brain development\n• It's nobody's fault\n• It is NOT caused by vaccines\n\nAutism is a different way of thinking, not a disease! 🧠`,
        },
        default: isHindi
          ? `${conditionName} के बारे में और जानने के लिए, आप मुझसे लक्षण, थेरेपी, कारण, रोजमर्रा की टिप्स, या स्कूल सहायता के बारे में पूछ सकते हैं! 🧩`
          : `I can help you learn more about ${conditionName}! Try asking about:\n• Signs & symptoms\n• Therapies & treatments\n• Causes\n• Daily living tips\n• School accommodations\n\nWhat would you like to know? 🧩`,
      },
      downSyndrome: {
        keywords: {
          'symptom|sign|diagnos|detect|feature': isHindi
            ? `डाउन सिंड्रोम की विशेषताएं:\n• विशिष्ट चेहरे की विशेषताएं\n• कम मांसपेशी टोन\n• विकासात्मक देरी\n• हल्की से मध्यम बौद्धिक अक्षमता\n• हृदय संबंधी समस्याएं हो सकती हैं\n\nनियमित स्वास्थ्य जांच महत्वपूर्ण है! 💛`
            : `Features of Down Syndrome:\n• Characteristic facial features\n• Low muscle tone (hypotonia)\n• Developmental delays\n• Mild to moderate intellectual disability\n• May have heart conditions\n\nRegular health checkups are important! 💛`,
          'therapy|treatment|help|support': isHindi
            ? `डाउन सिंड्रोम के लिए सहायता:\n• अर्ली इंटरवेंशन प्रोग्राम\n• स्पीच थेरेपी\n• फिजिकल थेरेपी\n• ऑक्यूपेशनल थेरेपी\n• समावेशी शिक्षा\n\nहर छोटी प्रगति का जश्न मनाएं! 🌟`
            : `Support for Down Syndrome:\n• Early Intervention Programs\n• Speech & Language Therapy\n• Physical Therapy\n• Occupational Therapy\n• Inclusive Education\n\nCelebrate every milestone! 🌟`,
          'life|expectancy|live|adult|future|independent': isHindi
            ? `डाउन सिंड्रोम वाले लोग पूर्ण जीवन जीते हैं!\n• जीवन प्रत्याशा 60+ वर्ष\n• कई स्वतंत्र रूप से रहते हैं\n• नौकरी कर सकते हैं\n• सार्थक रिश्ते बनाते हैं\n\nसंभावनाएं असीमित हैं! 💪`
            : `People with Down Syndrome live full, meaningful lives!\n• Life expectancy: 60+ years\n• Many live independently\n• Can hold meaningful jobs\n• Form wonderful relationships\n\nThe possibilities are unlimited! 💪`,
        },
        default: isHindi
          ? `${conditionName} के बारे में मुझसे पूछें: विशेषताएं, थेरेपी, भविष्य की संभावनाएं, या देखभाल टिप्स! 💛`
          : `I can help with ${conditionName}! Ask about:\n• Features & characteristics\n• Therapies & support\n• Life expectancy & future\n• Daily care tips\n\nWhat would you like to know? 💛`,
      },
      dyslexia: {
        keywords: {
          'symptom|sign|diagnos|detect|identify': isHindi
            ? `डिस्लेक्सिया के लक्षण:\n• पढ़ने में कठिनाई\n• वर्तनी की समस्याएं\n• अक्षरों को उलटना\n• धीमी पढ़ने की गति\n• पढ़ने से बचना\n\nयह बुद्धिमत्ता से जुड़ा नहीं है! 📖`
            : `Signs of Dyslexia:\n• Difficulty reading fluently\n• Spelling challenges\n• Reversing letters (b/d, p/q)\n• Slow reading speed\n• Avoidance of reading tasks\n\nIt has nothing to do with intelligence! 📖`,
          'therapy|treatment|help|support|teach|learn': isHindi
            ? `डिस्लेक्सिया सहायता:\n• ऑर्टन-गिलिंघम विधि\n• बहु-संवेदी शिक्षण\n• ऑडियोबुक\n• पढ़ने के लिए अतिरिक्त समय\n• सहायक तकनीक\n\nसही सहायता से बच्चे उत्कृष्ट हो सकते हैं! 🌟`
            : `Dyslexia Support:\n• Orton-Gillingham method\n• Multi-sensory learning\n• Audiobooks alongside reading\n• Extra time for reading tasks\n• Assistive technology (text-to-speech)\n\nWith the right support, children can excel! 🌟`,
        },
        default: isHindi
          ? `${conditionName} के बारे में पूछें: लक्षण, शिक्षण विधियां, या स्कूल सहायता! 📚`
          : `I can help with ${conditionName}! Ask about:\n• Signs & identification\n• Teaching strategies\n• School accommodations\n• Assistive tools\n\nWhat would you like to know? 📚`,
      },
      intellectualDisability: {
        keywords: {
          'symptom|sign|diagnos|detect': isHindi
            ? `बौद्धिक अक्षमता के लक्षण:\n• सीखने में देरी\n• दैनिक कौशल में कठिनाई\n• भाषा विकास में देरी\n• सामाजिक कौशल में चुनौतियां\n\nसही सहायता से बहुत प्रगति संभव है! 🧠`
            : `Signs of Intellectual Disability:\n• Delays in learning milestones\n• Difficulty with daily living skills\n• Delayed language development\n• Challenges with social skills\n\nWith proper support, great progress is possible! 🧠`,
          'therapy|treatment|help|support': isHindi
            ? `बौद्धिक अक्षमता सहायता:\n• विशेष शिक्षा\n• स्पीच थेरेपी\n• ऑक्यूपेशनल थेरेपी\n• जीवन कौशल प्रशिक्षण\n• व्यवहार सहायता\n\nहर व्यक्ति सीख और बढ़ सकता है! 💪`
            : `Intellectual Disability Support:\n• Special Education programs\n• Speech & Language Therapy\n• Occupational Therapy\n• Life skills training\n• Behavioral support\n\nEvery person can learn and grow! 💪`,
        },
        default: isHindi
          ? `${conditionName} के बारे में पूछें: लक्षण, सहायता, या दैनिक जीवन कौशल! 🧠`
          : `I can help with ${conditionName}! Ask about:\n• Signs & diagnosis\n• Support & therapies\n• Daily living skills\n• Education options\n\nWhat would you like to know? 🧠`,
      },
    };

    const conditionData = responses[conditionId];
    if (!conditionData) return isHindi ? 'मुझसे कोई भी सवाल पूछें!' : 'Feel free to ask me anything!';

    for (const [pattern, response] of Object.entries(conditionData.keywords)) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(input)) {
        return response;
      }
    }
    return conditionData.default;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setLoading(true);

    let botResponseText = null;

    if (GEMINI_API_KEY) {
      const chatHistory = messages
        .filter((msg) => msg.id !== '1')
        .map((msg) => ({
          role: msg.sender === 'bot' ? 'model' : 'user',
          parts: [{ text: msg.text }],
        }));

      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        const conditionName = t(`conditionsGuide.${selectedCondition.id}.name`);
        const systemPrompt = language === 'hi'
          ? `आप ${conditionName} के बारे में एक विशेषज्ञ सहायक हैं। हमेशा:\n1. सरल, स्पष्ट हिंदी में जवाब दें\n2. दयालु बनें\n3. व्यावहारिक सलाह दें`
          : `You are an expert assistant about ${conditionName}. Always:\n1. Respond in simple clear English\n2. Be kind\n3. Provide practical advice`;

        const payload = {
          contents: [
            { role: 'user', parts: [{ text: `System context: ${systemPrompt}` }] },
            { role: 'model', parts: [{ text: 'Understood! I will follow these guidelines.' }] },
            ...chatHistory,
            { role: 'user', parts: [{ text: userInput }] },
          ],
        };

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const result = await response.json();
          botResponseText = result.candidates?.[0]?.content?.parts?.[0]?.text || null;
        }
      } catch (err) {}
    }

    if (!botResponseText) {
      botResponseText = getConditionResponse(userInput, selectedCondition.id);
    }

    setMessages((prev) => [...prev, { id: Date.now().toString(), text: botResponseText, sender: 'bot' }]);
    speak(botResponseText);
    setLoading(false);
  };

  const renderPurpleWave = (invertColors = false) => {
    const stops = invertColors 
      ? [selectedCondition?.color, selectedCondition?.color, selectedCondition?.color]
      : ['#312E81', '#4338CA', '#6366F1'];
      
    return (
      <View style={styles.waveDivider}>
        <Svg width="100%" height="50" viewBox="0 0 1440 50" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="condWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={stops[0]} />
              <Stop offset="50%" stopColor={stops[1]} />
              <Stop offset="100%" stopColor={stops[2]} />
            </LinearGradient>
          </Defs>
          <Path
            fill="url(#condWaveGrad)"
            d="M0,0 L0,25 Q180,50 360,30 T720,35 T1080,25 T1440,30 L1440,0 Z"
          />
        </Svg>
      </View>
    );
  };

  // ── RENDER CHATBOT ──
  if (showChatbot && selectedCondition) {
    return (
      <View style={styles.container}>
        <View style={[styles.headerSection, { backgroundColor: selectedCondition.color }]}>
          <SafeAreaView>
            <View style={styles.headerTop}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setShowChatbot(false)}>
                <BackArrowIcon size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>{t('conditionsGuide.chatbot')}</Text>
                <Text style={styles.headerSub}>{t(`conditionsGuide.${selectedCondition.id}.name`)}</Text>
              </View>
              <View style={{ width: 44 }} />
            </View>
          </SafeAreaView>
          {renderPurpleWave(true)}
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Animated.View style={[
                styles.messageBubble,
                item.sender === 'user' ? styles.userBubble : styles.botBubble,
                { opacity: fadeAnim }
              ]}>
                <Text style={item.sender === 'user' ? styles.userText : styles.botText}>
                  {item.text}
                </Text>
              </Animated.View>
            )}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.chatInput}
              value={input}
              onChangeText={setInput}
              placeholder={t('typeYourQuestion') || 'Ask anything...'}
              placeholderTextColor="#94A3B8"
              onSubmitEditing={handleSend}
              editable={!loading}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <SendIcon size={20} color="#FFF" />}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // ── RENDER DETAILS VIEW ──
  if (selectedCondition) {
    return (
      <View style={styles.container}>
        <View style={[styles.headerSection, { backgroundColor: selectedCondition.color }]}>
          <SafeAreaView>
            <View style={styles.headerTop}>
              <TouchableOpacity style={styles.backBtn} onPress={handleBackToList}>
                <BackArrowIcon size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>{t(`conditionsGuide.${selectedCondition.id}.name`)}</Text>
              </View>
              <View style={{ width: 44 }} />
            </View>
          </SafeAreaView>
          {renderPurpleWave(true)}
        </View>

        <ScrollView contentContainerStyle={styles.detailsScrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.detailSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.sectionTitle}>{t('conditionsGuide.overview') || 'Overview'}</Text>
            <Text style={styles.sectionText}>{t(`conditionsGuide.${selectedCondition.id}.overview`)}</Text>
          </Animated.View>

          <Animated.View style={[styles.detailSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.sectionTitle}>{t('conditionsGuide.characteristics') || 'Key Characteristics'}</Text>
            <Text style={styles.sectionText}>{t(`conditionsGuide.${selectedCondition.id}.characteristics`)}</Text>
          </Animated.View>

          <Animated.View style={[styles.detailSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.sectionTitle}>{t('conditionsGuide.severityLevels') || 'Spectrum Levels'}</Text>
            <View style={{ marginTop: SPACING.md }}>
              {['mild', 'moderate', 'severe'].map((level, idx) => {
                const colors = ['#10B981', '#F59E0B', '#EF4444'];
                const titles = ['Mild', 'Moderate', 'Extensive'];
                return (
                  <View key={level} style={styles.severityLevel}>
                    <View style={[styles.severityDot, { backgroundColor: colors[idx] }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.severityTitle}>{t(`conditionsGuide.${level}`) || titles[idx]}</Text>
                      <Text style={styles.severityDescription}>{t(`conditionsGuide.${selectedCondition.id}.${level}`)}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim }}>
            <TouchCard style={styles.chatbotLaunchBtn} onPress={handleChatbotPress}>
              <ChatbotIcon size={28} color="#FFFFFF" />
              <Text style={styles.chatbotLaunchText}>{t('conditionsGuide.askQuestions') || 'Ask AI Assistant'}</Text>
            </TouchCard>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // ── RENDER MAIN OVERVIEW (Accordion List) ──
  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: COLORS.primary }]} />
        <SafeAreaView>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backBtn} onPress={onBack}>
              <BackArrowIcon size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>{t('conditionsGuide.title') || 'Conditions Guide'}</Text>
              <Text style={styles.headerSub}>{t('conditionsGuide.subtitle') || 'Learn and Understand'}</Text>
            </View>
            <View style={{ width: 44 }} />
          </View>

          <View style={styles.searchContainer}>
             <TextInput
               style={styles.searchInput}
               placeholder="Search conditions..."
               placeholderTextColor="rgba(255,255,255,0.7)"
               value={searchQuery}
               onChangeText={setSearchQuery}
             />
          </View>
        </SafeAreaView>
        {renderPurpleWave()}
      </View>
      
      <Animated.ScrollView 
        contentContainerStyle={styles.listScrollContent} 
        showsVerticalScrollIndicator={false}
        style={{ opacity: listFade }}
      >
        {filteredConditions.map((condition) => (
          <ConditionCard
            key={condition.id}
            title={t(`conditionsGuide.${condition.id}.name`)}
            subtitle={t(`conditionsGuide.${condition.id}.preview`)}
            description={t(`conditionsGuide.${condition.id}.overview`)}
            color={condition.color}
            IconComponent={condition.IconComponent}
            onLearnMore={() => handleLearnMore(condition)}
          />
        ))}
        {filteredConditions.length === 0 && (
          <Text style={styles.noResultsText}>No conditions found matching your search.</Text>
        )}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerSection: {
    zIndex: 2,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? SPACING.base : SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: RADII.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.title2,
    fontWeight: FONT_WEIGHTS.black,
    color: COLORS.textOnDark,
    letterSpacing: -0.2,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: FONT_WEIGHTS.semibold,
    marginTop: 2,
  },
  waveDivider: {
    height: 50,
    marginTop: -1,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  searchInput: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    color: COLORS.textOnDark,
    fontSize: FONT_SIZES.subhead,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  listScrollContent: {
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl * 2,
  },
  noResultsText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.body,
    marginTop: SPACING.xl,
  },

  // Details View Styles
  detailsScrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: 40,
  },
  detailSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.md,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.title3,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: '#1E293B',
    marginBottom: SPACING.md,
    letterSpacing: -0.2,
  },
  sectionText: {
    fontSize: FONT_SIZES.body,
    color: '#475569',
    lineHeight: 24,
    fontWeight: FONT_WEIGHTS.medium,
  },
  severityLevel: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    padding: SPACING.md,
    backgroundColor: '#F8FAFC',
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  severityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.md,
    marginTop: 5,
  },
  severityTitle: {
    fontSize: FONT_SIZES.subhead,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#1E293B',
    marginBottom: 4,
  },
  severityDescription: {
    fontSize: FONT_SIZES.small,
    color: '#64748B',
    lineHeight: 20,
  },
  chatbotLaunchBtn: {
    backgroundColor: '#F59E0B',
    borderRadius: RADII.xl,
    padding: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.colored('#F59E0B'),
    shadowOpacity: 0.4,
  },
  chatbotLaunchText: {
    fontSize: FONT_SIZES.headline,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textOnDark,
    marginLeft: SPACING.md,
    letterSpacing: 0.5,
  },

  // Chat View Styles
  messagesContainer: {
    padding: SPACING.lg,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: SPACING.md + 2,
    borderRadius: RADII.xl,
    marginBottom: SPACING.md,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: SPACING.xs,
    ...SHADOWS.md,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  userText: { color: COLORS.textOnDark, fontSize: FONT_SIZES.body, lineHeight: 24, fontWeight: FONT_WEIGHTS.semibold },
  botText: { color: COLORS.textPrimary, fontSize: FONT_SIZES.body, lineHeight: 24, fontWeight: FONT_WEIGHTS.medium },
  inputContainer: {
    flexDirection: 'row',
    padding: SPACING.base,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xxl : SPACING.base,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.pill,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 4,
    fontSize: FONT_SIZES.body,
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 21,
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.colored(COLORS.primary),
    shadowOpacity: 0.3,
  },
});

export default ConditionsGuideScreen;
