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
import { CategoryCard } from '../components/CategoryCard';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, RADII, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

// 2-column grid sizing logic
// Formula: (Total Width - Total Horizontal Padding - Gap between columns) / 2
// Total horizontal padding = SPACING.lg * 2 = 24 * 2 = 48
// Gap = SPACING.md = 16
const CARD_WIDTH = (width - 48 - 16) / 2;

// Decorative Floating ORB 
const FloatingOrb = ({ size, color, top, left, delay = 0 }: { size: number, color: string, top: number, left: number, delay?: number }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(opacityAnim, { toValue: 1, duration: 1000, delay, useNativeDriver: true }).start();
    const anim = Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, { toValue: 1, duration: 3000 + delay, useNativeDriver: true }),
      Animated.timing(floatAnim, { toValue: 0, duration: 3000 + delay, useNativeDriver: true }),
    ]));
    anim.start();

    return () => anim.stop();
  }, [delay, floatAnim, opacityAnim]);
  
  const translateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
  return (
    <Animated.View
      style={{ position: 'absolute', top, left, width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: opacityAnim, transform: [{ translateY }] }}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden={true}
    />
  );
};

// Mapped specific brand colors fixing visual bugs requested by user
const getCategoryColor = (categoryId: string) => {
   switch (categoryId) {
      case 'animals': return '#F59E0B'; // Amber
      case 'birds': return '#38BDF8'; // Sky Blue
      case 'objects': return '#64748B'; // Slate
      case 'time': return '#F97316'; // Orange
      case 'sentences': return '#10B981'; // Green
      default: return '#A855F7'; // Purple
   }
};

const getCategoryName = (categoryId: string) => {
   switch (categoryId) {
      case 'animals': return 'Animals';
      case 'birds': return 'Birds';
      case 'objects': return 'Objects';
      case 'time': return 'Time of Day';
      case 'sentences': return 'Sentences';
      default: return categoryId;
   }
};

interface VisualLearningGridScreenProps {
  categories: Array<{ id: string, icon: string }>;
  onBack: () => void;
  onSelectCategory: (id: string) => void;
}

export const VisualLearningGridScreen: React.FC<VisualLearningGridScreenProps> = ({ categories, onBack, onSelectCategory }) => {
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-30)).current;

  // Staggered array refs mapping categories natively
  const cardAnims = useRef(
    categories.map(() => ({
      fade: new Animated.Value(0),
      slide: new Animated.Value(50),
      scale: new Animated.Value(0.95),
    }))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true }),
    ]).start();

    cardAnims.forEach((anim, i) => {
      const delay = 100 + i * 80; // slightly faster stagger
      Animated.parallel([
        Animated.timing(anim.fade, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
        Animated.spring(anim.slide, { toValue: 0, tension: 50, friction: 8, delay, useNativeDriver: true }),
        Animated.spring(anim.scale, { toValue: 1, tension: 50, friction: 8, delay, useNativeDriver: true }),
      ]).start();
    });
  }, [cardAnims]);

  return (
    <View style={styles.container}>
      {/* Dynamic Header Flow - Standardized to Primary App Color #4B3FD8 */}
      <View style={styles.waveContainer}>
         <Svg height={450} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <Defs>
               <LinearGradient id="vlGridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#4B3FD8" />
                  <Stop offset="50%" stopColor="#4135B3" />
                  <Stop offset="100%" stopColor="#31268A" />
               </LinearGradient>
            </Defs>
            <Path fill="url(#vlGridGrad)" d="M0,250L48,230C96,210,192,170,288,160C384,150,480,170,576,190C672,210,768,230,864,220C960,210,1056,170,1152,150C1248,130,1344,130,1392,130L1440,130L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
         </Svg>
      </View>

      <FloatingOrb size={80} color="rgba(255,255,255,0.15)" top={70} left={width - 100} delay={0} />
      <FloatingOrb size={50} color="rgba(255,255,255,0.1)" top={140} left={30} delay={300} />

      <SafeAreaView style={styles.safeArea}>
         <Animated.View style={[styles.headerTop, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
            <TouchableOpacity 
               style={styles.backButton} 
               onPress={onBack} 
               activeOpacity={0.8}
               accessibilityRole="button"
               accessibilityLabel="Go back"
            >
               <BackArrowIcon size={22} color="#4B3FD8" />
            </TouchableOpacity>
            <View style={styles.headerTitles}>
               <Text style={styles.title} allowFontScaling={true} maxFontSizeMultiplier={1.3}>Visual Learning</Text>
               <Text style={styles.subtitle} allowFontScaling={true} maxFontSizeMultiplier={1.3}>Explore & Identify</Text>
            </View>
         </Animated.View>

         <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Animated.View style={[styles.heroBanner, { opacity: headerFade }]}>
               <Text style={styles.heroTitle} allowFontScaling={true} maxFontSizeMultiplier={1.3}>Visual Learning</Text>
               <Text style={styles.heroSubtitle} allowFontScaling={true} maxFontSizeMultiplier={1.3}>Choose a category to start your visual learning adventure!</Text>
            </Animated.View>
            
            <View style={styles.categoryGrid}>
               {categories.map((category, index) => (
                  <Animated.View
                     key={category.id}
                     style={{
                        opacity: cardAnims[index]?.fade || 1,
                        transform: [
                           { translateY: cardAnims[index]?.slide || 0 },
                           { scale: cardAnims[index]?.scale || 1 }
                        ]
                     }}
                  >
                     <CategoryCard
                        id={category.id}
                        name={getCategoryName(category.id)}
                        icon={category.icon}
                        color={getCategoryColor(category.id)}
                        width={CARD_WIDTH}
                        onPress={() => onSelectCategory(category.id)}
                     />
                  </Animated.View>
               ))}
            </View>
         </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FF', // Off-white theme consistency
  },
  safeArea: {
    flex: 1,
  },
  waveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg, // 24 ideally
    marginTop: SPACING.md,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: RADII.lg,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  headerTitles: {
    flex: 1,
    alignItems: 'center',
    marginRight: 44,
  },
  title: {
    fontSize: FONT_SIZES.largeTitle,
    fontWeight: FONT_WEIGHTS.black as any,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: FONT_SIZES.caption,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: FONT_WEIGHTS.bold as any,
    marginTop: 3,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.lg, // Total horizontal padding = SPACING.lg * 2
    paddingBottom: 100,
  },
  heroBanner: {
    marginBottom: SPACING.xl,
    paddingHorizontal: 4,
  },
  heroTitle: {
    fontSize: FONT_SIZES.hero,
    fontWeight: FONT_WEIGHTS.black as any,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.body,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: FONT_WEIGHTS.medium as any,
    marginTop: SPACING.xs,
    lineHeight: 22,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    columnGap: 16, // Enforced column gap
    rowGap: 16,    // Enforced row gap (helps with new lines)
  },
});

export default VisualLearningGridScreen;
