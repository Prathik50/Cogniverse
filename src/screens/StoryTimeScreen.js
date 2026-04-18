import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { useTTS } from '../contexts/TTSContext';
import { BackArrowIcon } from '../components/icons/ConditionIcons';

const { width, height } = Dimensions.get('window');

// ----------------------------------------------------------------------------
// Reusable Premium Components (FloatingOrb, TouchCard)
// ----------------------------------------------------------------------------
const FloatingOrb = ({ size, color, top, left, delay = 0 }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(opacityAnim, { toValue: 1, duration: 1000, delay, useNativeDriver: true }).start();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 3000 + delay, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 3000 + delay, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
  return (
    <Animated.View
      style={{
        position: 'absolute', top, left, width: size, height: size,
        borderRadius: size / 2, backgroundColor: color,
        opacity: opacityAnim, transform: [{ translateY }],
        pointerEvents: 'none',
      }}
    />
  );
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const TouchCard = ({ children, onPress, style, disabled }) => {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <AnimatedTouchable
      style={[style, { transform: [{ scale }] }]}
      activeOpacity={0.9}
      disabled={disabled}
      onPressIn={() => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
      onPress={onPress}
    >
      {children}
    </AnimatedTouchable>
  );
};

// ----------------------------------------------------------------------------
// Main Screen
// ----------------------------------------------------------------------------
const StoryTimeScreen = ({ onBack }) => {
  const { currentTheme } = useTheme();
  const { speak, stop } = useTTS();
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStory, setCurrentStory] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Animations for screen transitions
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentFade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(contentSlide, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [currentStory]);

  const sampleStories = [
    {
      id: 'birthday-party', title: 'Going to a Birthday Party',
      prompt: "We are going to Prathik's birthday party",
      color: '#F59E0B', icon: '🎂',
      steps: [
        { image: '👕', text: 'We get ready to go to the party. We put on nice clothes.', audio: 'We get ready to go to the party.' },
        { image: '🚗', text: 'We drive to the house. The car ride is fun and we sing songs.', audio: 'We drive to the house.' },
        { image: '👋', text: 'We say hello to our friends. We give them a present.', audio: 'We say hello.' },
        { image: '🎮', text: 'We play games with other children. We have fun.', audio: 'We play games and have fun.' },
        { image: '🍰', text: 'We eat birthday cake and ice cream. Delicious!', audio: 'We eat cake.' },
      ]
    },
    {
      id: 'doctor-visit', title: 'Going to the Doctor',
      prompt: 'We are going to visit the doctor',
      color: '#10B981', icon: '🩺',
      steps: [
        { image: '🏥', text: "We arrive at the doctor's office. We check in at the front desk.", audio: 'We arrive at the doctors office.' },
        { image: '⏰', text: 'We wait in the waiting room. We can read books quietly.', audio: 'We wait in the waiting room.' },
        { image: '👩‍⚕️', text: 'The nurse calls our name. We follow her to the room.', audio: 'The nurse calls our name.' },
        { image: '🌡️', text: 'The doctor checks our temperature and listens to our heart.', audio: 'The doctor checks us.' },
        { image: '🍭', text: 'The doctor gives us a sticker for being brave. We did great!', audio: 'We did great and got a sticker!' },
      ]
    },
    {
      id: 'grocery-store', title: 'Going to the Grocery Store',
      prompt: 'We are going shopping at the grocery store',
      color: '#3B82F6', icon: '🛒',
      steps: [
        { image: '🛒', text: 'We get a shopping cart and make a list of things we need.', audio: 'We get a shopping cart.' },
        { image: '🥛', text: 'We walk through the aisles and find the milk and bread.', audio: 'We find the milk and bread.' },
        { image: '🍎', text: 'We pick out fresh fruits and vegetables. We choose the best ones.', audio: 'We pick out fresh food.' },
        { image: '💰', text: 'We go to the checkout counter and pay for our groceries.', audio: 'We pay for our groceries.' },
        { image: '🏠', text: 'We carry our bags to the car and drive home!', audio: 'We carry our bags and go home.' },
      ]
    }
  ];

  const handleStorySelect = (story) => {
    contentFade.setValue(0);
    contentSlide.setValue(40);
    setCurrentStory(story);
    setCurrentStep(0);
    speak(`Starting story: ${story.title}`);
  };

  const handleCustomStory = () => {
    if (!customPrompt.trim()) {
      Alert.alert('Error', 'Please enter a story prompt.');
      return;
    }
    setIsLoading(true);
    // Simulate generation...
    setTimeout(() => {
      contentFade.setValue(0);
      contentSlide.setValue(40);
      const generatedStory = {
        id: 'custom', title: 'Custom Story', prompt: customPrompt, color: '#8B5CF6', icon: '✨',
        steps: [
          { image: '📝', text: `We are preparing for: ${customPrompt}`, audio: `Preparing for ${customPrompt}` },
          { image: '🚶', text: 'We head to our destination calmly and focused.', audio: 'We stay calm.' },
          { image: '👀', text: 'We observe what is happening around us and pay attention.', audio: 'We pay attention.' },
          { image: '😊', text: 'We participate, have a good time, and remember to be polite.', audio: 'We have a good time.' },
          { image: '🌟', text: 'We finish our activity and did a fantastic job!', audio: 'We did a fantastic job!' }
        ]
      };
      setCurrentStory(generatedStory);
      setCurrentStep(0);
      setIsLoading(false);
      speak(`Starting custom story: ${customPrompt}`);
    }, 1500);
  };

  const nextStep = () => {
    if (currentStory && currentStep < currentStory.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      speak('The story is complete! Great job!');
    }
  };

  const previousStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const playCurrentStep = () => {
    if (currentStory) {
      stop();
      speak(currentStory.steps[currentStep].audio);
    }
  };

  const resetStory = () => {
    contentFade.setValue(0);
    contentSlide.setValue(40);
    setCurrentStory(null);
    setCurrentStep(0);
    setCustomPrompt('');
    stop();
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    waveContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 0 },
    headerTop: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginTop: 16, zIndex: 10 },
    backButton: {
      backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 20, width: 44, height: 44,
      justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
    },
    headerTitles: { flex: 1, alignItems: 'center', marginRight: 44 },
    title: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.3, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
    subtitleText: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginTop: 3, letterSpacing: 1, textTransform: 'uppercase' },
    
    scrollContent: { paddingHorizontal: 24, paddingBottom: 50, paddingTop: 30 },
    
    // Custom generator
    generatorCard: {
      backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, marginBottom: 28,
      shadowColor: '#4338CA', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 8,
      borderWidth: 1, borderColor: '#EEF2FF'
    },
    genTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 12 },
    input: {
      backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, fontSize: 16, color: '#334155',
      borderWidth: 1, borderColor: '#E2E8F0', height: 100, textAlignVertical: 'top', marginBottom: 16
    },
    genBtn: {
      backgroundColor: '#4338CA', borderRadius: 16, paddingVertical: 14, alignItems: 'center',
      shadowColor: '#4338CA', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4
    },
    genBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
    
    sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 16, marginLeft: 4 },
    
    // Story grid cards
    storyCard: {
      backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 16, flexDirection: 'row', alignItems: 'center',
      shadowColor: '#0F172A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 4,
    },
    storyIconWrapper: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    storyIcon: { fontSize: 26 },
    storyInfo: { flex: 1 },
    storyTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
    storyPrompt: { fontSize: 13, color: '#64748B', fontWeight: '500' },
    
    // Story Viewer
    viewerCard: {
      backgroundColor: '#FFFFFF', borderRadius: 32, padding: 24, alignItems: 'center',
      shadowColor: '#0F172A', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 12,
      borderWidth: 1, borderColor: '#F1F5F9'
    },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20, alignItems: 'center' },
    stepBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    stepBadgeText: { color: '#4338CA', fontWeight: '800', fontSize: 14 },
    closeBtn: { padding: 8, backgroundColor: '#F1F5F9', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    
    emojiBox: {
      width: 140, height: 140, borderRadius: 70, backgroundColor: '#F8FAFC',
      justifyContent: 'center', alignItems: 'center', marginBottom: 24,
      borderWidth: 4, borderColor: '#EEF2FF'
    },
    bigEmoji: { fontSize: 70 },
    contentText: { fontSize: 22, fontWeight: '700', color: '#1E293B', textAlign: 'center', lineHeight: 32, marginBottom: 32 },
    
    controlsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 12 },
    ctrlBtn: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#E2E8F0', paddingVertical: 16, borderRadius: 20, alignItems: 'center' },
    ctrlBtnText: { fontSize: 16, fontWeight: '800', color: '#64748B' },
    playBtn: { flex: 1.2, backgroundColor: '#10B981', paddingVertical: 16, borderRadius: 20, alignItems: 'center', shadowColor: '#10B981', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
    playBtnText: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' }
  });

  return (
    <View style={styles.container}>
      {/* Background Hero SVG */}
      <View style={styles.waveContainer}>
        <Svg height={450} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
            <LinearGradient id="stGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#4338CA" />
              <Stop offset="50%" stopColor="#6366F1" />
              <Stop offset="100%" stopColor="#818CF8" />
            </LinearGradient>
          </Defs>
          <Path 
            fill="url(#stGrad)" 
            d="M0,192L48,197.3C96,203,192,213,288,224C384,235,480,245,576,218.7C672,192,768,128,864,117.3C960,107,1056,149,1152,170.7C1248,192,1344,192,1392,192L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" 
          />
        </Svg>
      </View>

      <FloatingOrb size={100} color="rgba(255,255,255,0.06)" top={40} left={width - 80} delay={0} />
      <FloatingOrb size={60} color="rgba(255,255,255,0.1)" top={150} left={20} delay={400} />
      <FloatingOrb size={30} color="rgba(255,255,255,0.15)" top={220} left={width / 2} delay={800} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
            <BackArrowIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>Story Time</Text>
            <Text style={styles.subtitleText}>Visual Narrative Guides</Text>
          </View>
        </View>

        <Animated.ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          style={{ opacity: contentFade, transform: [{ translateY: contentSlide }] }}
        >
          {!currentStory ? (
            <>
              {/* Custom Generator */}
              <View style={styles.generatorCard}>
                <Text style={styles.genTitle}>Generate New Story ✨</Text>
                <TextInput
                  style={styles.input}
                  placeholder="E.g., We are going to the dentist today..."
                  placeholderTextColor="#94A3B8"
                  value={customPrompt}
                  onChangeText={setCustomPrompt}
                  multiline
                />
                <TouchCard onPress={handleCustomStory} disabled={isLoading}>
                  <View style={styles.genBtn}>
                    {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.genBtnText}>Create Story</Text>}
                  </View>
                </TouchCard>
              </View>

              <Text style={styles.sectionTitle}>Starter Stories</Text>
              
              {/* Sample list */}
              {sampleStories.map((story) => (
                <TouchCard key={story.id} onPress={() => handleStorySelect(story)}>
                  <View style={styles.storyCard}>
                    <View style={[styles.storyIconWrapper, { backgroundColor: story.color + '15' }]}>
                      <Text style={styles.storyIcon}>{story.icon}</Text>
                    </View>
                    <View style={styles.storyInfo}>
                      <Text style={styles.storyTitle}>{story.title}</Text>
                      <Text style={styles.storyPrompt} numberOfLines={1}>"{story.prompt}"</Text>
                    </View>
                    <Text style={{color: '#CBD5E1', fontSize: 20, fontWeight: '900'}}>→</Text>
                  </View>
                </TouchCard>
              ))}
            </>
          ) : (
            /* Viewer */
            <View style={styles.viewerCard}>
              <View style={styles.progressHeader}>
                <View style={[styles.stepBadge, { backgroundColor: currentStory.color + '15' }]}>
                  <Text style={[styles.stepBadgeText, { color: currentStory.color }]}>
                    Step {currentStep + 1} of {currentStory.steps.length}
                  </Text>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={resetStory}>
                  <Text style={{color: '#64748B', fontWeight: '900'}}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.emojiBox, { borderColor: currentStory.color + '20' }]}>
                <Text style={styles.bigEmoji}>{currentStory.steps[currentStep].image}</Text>
              </View>

              <Text style={styles.contentText}>{currentStory.steps[currentStep].text}</Text>

              <View style={styles.controlsRow}>
                <TouchCard 
                  style={[styles.ctrlBtn, currentStep === 0 && { opacity: 0.5 }]} 
                  onPress={previousStep} disabled={currentStep === 0}
                >
                  <Text style={styles.ctrlBtnText}>← Back</Text>
                </TouchCard>
                
                <TouchCard style={[styles.playBtn, { backgroundColor: currentStory.color, shadowColor: currentStory.color }]} onPress={playCurrentStep}>
                  <Text style={styles.playBtnText}>🔊 Play Audio</Text>
                </TouchCard>
                
                <TouchCard 
                  style={[styles.ctrlBtn, currentStep === currentStory.steps.length - 1 && { opacity: 0.5 }]} 
                  onPress={nextStep} disabled={currentStep === currentStory.steps.length - 1}
                >
                  <Text style={[styles.ctrlBtnText, { color: '#1E293B' }]}>Next →</Text>
                </TouchCard>
              </View>
            </View>
          )}
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default StoryTimeScreen;
