import React, { useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { BackArrowIcon } from '../components/icons/ConditionIcons';
import { useTTS } from '../contexts/TTSContext';

const { width } = Dimensions.get('window');

// Floating decorative orb
const FloatingOrb = ({ size, color, top, left, delay = 0 }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, { toValue: 1, duration: 1000, delay, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 3000 + delay, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 3000 + delay, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });

  return (
    <Animated.View
      style={{
        position: 'absolute', top, left, width: size, height: size,
        borderRadius: size / 2, backgroundColor: color,
        opacity: opacityAnim, transform: [{ translateY }],
      }}
    />
  );
};

const AboutScreen = ({ onBack }) => {
  const { speak } = useTTS();
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-30)).current;

  const contentAnims = useRef(
    [0, 1, 2, 3].map(() => ({
      fade: new Animated.Value(0),
      slide: new Animated.Value(40),
    }))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true }),
    ]).start();

    contentAnims.forEach((anim, i) => {
      const delay = 150 + i * 150;
      Animated.parallel([
        Animated.timing(anim.fade, { toValue: 1, duration: 600, delay, useNativeDriver: true }),
        Animated.spring(anim.slide, { toValue: 0, tension: 50, friction: 8, delay, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  const handleBack = () => {
    speak('Returning to menu');
    onBack();
  };

  const paragraphs = [
    "CogniVerse is a dedicated, commercial-grade digital learning platform engineered to radically support early cognitive development.",
    "Designed specifically with learning differences and neurodiversity in mind—including Autism Spectrum Disorder, Dyslexia, and Intellectual Disabilities—our platform builds bridges where traditional learning systems fall short.",
    "We believe that every child deserves a beautiful, intuitive, and responsive environment to nurture their growth. Through data-driven tracking, specialized communication tools, and a dynamic daily interface, CogniVerse is a comprehensive toolkit empowering parents, educators, and children alike."
  ];

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    waveContainer: { position: 'absolute', top: 0, left: 0, right: 0 },
    headerTop: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 24, marginTop: 16, zIndex: 10,
    },
    backButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      borderRadius: 20, width: 44, height: 44,
      justifyContent: 'center', alignItems: 'center',
      borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    headerTitles: { flex: 1, alignItems: 'center', marginRight: 44 },
    title: {
      fontSize: 24, fontWeight: '900', color: '#FFFFFF',
      letterSpacing: 0.3, textShadowColor: 'rgba(0,0,0,0.25)',
      textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8,
    },
    subtitle: {
      fontSize: 13, color: 'rgba(255,255,255,0.85)',
      fontWeight: '600', marginTop: 3, letterSpacing: 1, textTransform: 'uppercase',
    },
    scrollContent: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 40 },
    glassCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 28,
      padding: 32,
      marginBottom: 32,
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 8,
      borderWidth: 1,
      borderColor: '#F1F5F9',
    },
    welcomeText: {
      fontSize: 32, fontWeight: '900', color: '#1E293B',
      marginBottom: 24, lineHeight: 38, letterSpacing: -0.5,
    },
    brandHighlight: { color: '#4F46E5' },
    bodyText: {
      fontSize: 17, color: '#475569', lineHeight: 28,
      fontWeight: '500', marginBottom: 20,
    },
    footerContainer: { alignItems: 'center', marginTop: 10, marginBottom: 40 },
    footerText: { fontSize: 14, color: '#94A3B8', fontWeight: '700', letterSpacing: 0.5 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.waveContainer}>
        <Svg height={450} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
            <LinearGradient id="aboutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#818CF8" />
              <Stop offset="50%" stopColor="#4F46E5" />
              <Stop offset="100%" stopColor="#1E1B4B" />
            </LinearGradient>
          </Defs>
          <Path 
            fill="url(#aboutGrad)" 
            d="M0,256L48,229.3C96,203,192,149,288,149.3C384,149,480,203,576,213.3C672,224,768,192,864,170.7C960,149,1056,139,1152,144C1248,149,1344,171,1392,181.3L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" 
          />
        </Svg>
      </View>

      <FloatingOrb size={120} color="rgba(255,255,255,0.08)" top={-20} left={width - 80} delay={0} />
      <FloatingOrb size={50} color="rgba(255,255,255,0.12)" top={160} left={30} delay={400} />

      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View style={[styles.headerTop, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.8}>
            <BackArrowIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>About</Text>
            <Text style={styles.subtitle}>Our Mission</Text>
          </View>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.glassCard, { opacity: contentAnims[0].fade, transform: [{ translateY: contentAnims[0].slide }] }]}>
            <Text style={styles.welcomeText}>
              Welcome to <Text style={styles.brandHighlight}>CogniVerse</Text>
            </Text>
            
            {paragraphs.map((para, index) => (
              <Animated.View 
                key={index} 
                style={{ opacity: contentAnims[index + 1].fade, transform: [{ translateY: contentAnims[index + 1].slide }] }}
              >
                <Text style={styles.bodyText}>{para}</Text>
              </Animated.View>
            ))}
          </Animated.View>

          <Animated.View style={[styles.footerContainer, { opacity: contentAnims[3].fade }]}>
            <Text style={styles.footerText}>© 2026 CogniVerse. All Rights Reserved.</Text>
            <Text style={[styles.footerText, { marginTop: 6, color: '#CBD5E1' }]}>Version 1.0.0 — Premium Edition</Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AboutScreen;
