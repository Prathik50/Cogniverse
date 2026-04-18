import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { BackArrowIcon } from '../components/icons/ConditionIcons';
import { PrintableCategories } from '../data/PrintableData';
import WorksheetViewerScreen from './WorksheetViewerScreen'; // Fallback logic maintaining path
import CollectionRow from '../components/CollectionRow';

const { width } = Dimensions.get('window');

// Floating decorative orb
const FloatingOrb = ({ size, color, top, left, delay = 0 }: any) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, { toValue: 1, duration: 1000, delay, useNativeDriver: true }).start();
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 3000 + delay, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 3000 + delay, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [delay, floatAnim, opacityAnim]);

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

export const OfflinePrintablesScreen = ({ onBack }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-30)).current;

  // Staggered animations for category list
  const cardAnims = useRef(
    PrintableCategories.map(() => ({
      fade: new Animated.Value(0),
      slide: new Animated.Value(40),
      scale: new Animated.Value(0.95),
    }))
  ).current;

  useEffect(() => {
    if (!selectedCategory) {
      Animated.parallel([
        Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(headerSlide, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true }),
      ]).start();

      cardAnims.forEach((anim, i) => {
        const delay = 100 + i * 80;
        Animated.parallel([
          Animated.timing(anim.fade, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
          Animated.spring(anim.slide, { toValue: 0, tension: 50, friction: 8, delay, useNativeDriver: true }),
          Animated.spring(anim.scale, { toValue: 1, tension: 50, friction: 7, delay, useNativeDriver: true }),
        ]).start();
      });
    } else {
      headerFade.setValue(0);
      headerSlide.setValue(-30);
      cardAnims.forEach((anim) => {
        anim.fade.setValue(0);
        anim.slide.setValue(40);
        anim.scale.setValue(0.95);
      });
    }
  }, [selectedCategory, cardAnims, headerFade, headerSlide]);

  if (selectedCategory) {
    return <WorksheetViewerScreen 
      category={selectedCategory} 
      onBack={() => setSelectedCategory(null)} 
    />;
  }

  // Map category data dynamically resolving requested icon colors directly referencing logic 
  // Coloring Pages -> Pencil (Pink), Number Fill -> Numbers (Blue), Line Tracing -> Tracing (Green)
  const mappedCategories = PrintableCategories.map(cat => {
     let newIcon = cat.iconName;
     let newColor = cat.color;
     if (cat.title.includes('Color')) { newIcon = 'Pencil'; newColor = '#EC4899'; }
     else if (cat.title.includes('Number')) { newIcon = 'Numbers'; newColor = '#3B82F6'; }
     else if (cat.title.includes('Tracing') || cat.title.includes('Line')) { newIcon = 'Tracing'; newColor = '#10B981'; }
     
     return { ...cat, iconName: newIcon, color: newColor };
  });

  return (
    <View style={styles.container}>
      <View style={styles.waveContainer}>
        <Svg height={350} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
            <LinearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              {/* Keeping a consistent, slightly softer deep purple base for the header */}
              <Stop offset="0%" stopColor="#4B3FD8" />
              <Stop offset="100%" stopColor="#5D4DF5" />
            </LinearGradient>
          </Defs>
          <Path 
            fill="url(#dashGrad)" 
            d="M0,224L48,202.7C96,181,192,139,288,138.7C384,139,480,181,576,192C672,203,768,181,864,154.7C960,128,1056,96,1152,90.7C1248,85,1344,107,1392,117.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" 
          />
        </Svg>
      </View>

      <FloatingOrb size={80} color="rgba(255,255,255,0.1)" top={60} left={width - 100} delay={0} />
      <FloatingOrb size={40} color="rgba(255,255,255,0.15)" top={140} left={30} delay={300} />

      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.8} accessibilityRole="button">
            <BackArrowIcon size={22} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>Offline Printables</Text>
            <Text style={styles.headerSubtitle}>Download & Print</Text>
          </View>

          {/* New Optional Secondary Action Download All Button */}
          <TouchableOpacity style={styles.downloadAllBtn} activeOpacity={0.8} accessibilityRole="button">
             <Text style={styles.downloadAllBtnText}>Download All</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Rewritten Commercial Grade Info Card holding amber highlight to feel warmer */}
          <Animated.View style={[styles.infoCard, { opacity: headerFade }]}>
            <View style={styles.infoIconWrapper}>
              <Text style={{fontSize: 26}} allowFontScaling={false}>✨</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.infoTitle}>Hands-On Learning</Text>
              <Text style={styles.infoText}>
                Printing worksheets is highly recommended to reduce screen time while providing tangible, effective activities.
              </Text>
            </View>
          </Animated.View>

          <Text style={styles.sectionHeader}>Select a Collection</Text>

          {/* Render Extracted UI Standard Rows */}
          {mappedCategories.map((category, index) => (
            <Animated.View
              key={category.id}
              style={{
                opacity: cardAnims[index]?.fade || 1,
                transform: [
                  { translateY: cardAnims[index]?.slide || 0 },
                  { scale: cardAnims[index]?.scale || 1 },
                ],
              }}
            >
              <CollectionRow 
                 category={category} 
                 onPress={() => setSelectedCategory(category)} 
              />
            </Animated.View>
          ))}
          
          <View style={{height: 40}} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7FF' },
  waveContainer: { position: 'absolute', top: 0, left: 0, right: 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16,
    zIndex: 10,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20, width: 44, height: 44,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  headerTitles: { flex: 1, alignItems: 'flex-start', marginLeft: 16 },
  headerTitle: {
    fontSize: 22, fontWeight: '900', color: '#FFFFFF',
    letterSpacing: 0.3, textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6,
  },
  headerSubtitle: {
    fontSize: 12, color: 'rgba(255,255,255,0.9)',
    fontWeight: '700', marginTop: 3, letterSpacing: 1, textTransform: 'uppercase',
  },
  downloadAllBtn: {
     backgroundColor: '#FFFFFF',
     paddingVertical: 8,
     paddingHorizontal: 14,
     borderRadius: 16,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.15,
     shadowRadius: 8,
     elevation: 4,
  },
  downloadAllBtnText: {
     color: '#4B3FD8',
     fontSize: 13,
     fontWeight: '800',
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB', // Warm Soft Amber/Yellow Tint as Requested
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  infoIconWrapper: {
    width: 60, height: 60,
    borderRadius: 20,
    backgroundColor: '#FEF3C7', // Darker complementary amber logic
    justifyContent: 'center', alignItems: 'center',
    marginRight: 16,
  },
  infoTitle: {
    fontSize: 18, fontWeight: '800', color: '#92400E', marginBottom: 6, letterSpacing: -0.2, // Dark amber text natively binding 
  },
  infoText: {
    fontSize: 14, color: '#B45309', fontWeight: '600', lineHeight: 22,
  },
  sectionHeader: {
    fontSize: 22, fontWeight: '900', color: '#0F172A',
    marginBottom: 20, letterSpacing: -0.3,
  },
});

export default OfflinePrintablesScreen;
