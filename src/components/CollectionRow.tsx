import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface Category {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  iconName: string;
  items: any[];
}

interface CollectionRowProps {
  category: Category;
  onPress: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const PencilIcon = ({ color }: { color: string }) => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </Svg>
);

const NumbersIcon = ({ color }: { color: string }) => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 19V5l-3 3" />
    <Path d="M6 14 A2 2 0 1 0 6 10 A2 2 0 1 0 6 6 A2 2 0 1 0 6 14" />
    <Path d="M6 14h6" />
    <Path d="M6 20h6" />
  </Svg>
);

const TracingIcon = ({ color }: { color: string }) => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path strokeDasharray="5 5" d="M3 12c3-4 6-4 9 0s6 4 9 0" />
    <Path d="M21 12l-2-2" />
    <Path d="M21 12l-2 2" />
  </Svg>
);

export const CollectionRow: React.FC<CollectionRowProps> = ({ category, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const getIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'Shapes': 
      case 'Pencil': return <PencilIcon color={color} />; // Coloring Pages
      case 'Numbers': return <NumbersIcon color={color} />; // Number Fill-In
      case 'Tracing': return <TracingIcon color={color} />; // Line Tracing
      default: return <PencilIcon color={color} />;
    }
  };

  return (
    <AnimatedTouchable
      style={[
        styles.card,
        { 
          borderLeftColor: category.color,
          transform: [{ scale }] 
        }
      ]}
      activeOpacity={0.9}
      onPressIn={() => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={styles.cardInner}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: category.color + '15' }]}>
            {getIcon(category.iconName, category.color)}
          </View>
          {/* Badge moved tight to the bottom left under the icon */}
          <View style={[styles.tagWrapper, { backgroundColor: category.color + '0C', borderColor: category.color + '25' }]}>
            <Text style={[styles.itemCount, { color: category.color }]}>{category.items.length} Sheets</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{category.title}</Text>
          <Text style={styles.cardSubtitle} numberOfLines={2}>{category.subtitle}</Text>
        </View>

        <View style={[styles.cardArrow, { backgroundColor: category.color + '12' }]}>
          <Text style={{ color: category.color, fontSize: 18, fontWeight: '900' }}>→</Text>
        </View>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 20,
    borderLeftWidth: 8, // Subtly colored left border accent
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  cardInner: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    minHeight: 124 
  },
  leftSection: {
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainer: {
    width: 56, 
    height: 56,
    borderRadius: 18,
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 10,
  },
  cardContent: { 
    flex: 1, 
    justifyContent: 'center',
    paddingRight: 8 
  },
  cardTitle: {
    fontSize: 18, 
    fontWeight: '800', 
    color: '#1E293B', 
    marginBottom: 6, 
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 14, 
    color: '#64748B', 
    fontWeight: '500', 
    lineHeight: 20,
  },
  tagWrapper: {
    paddingHorizontal: 10, 
    paddingVertical: 4,
    borderRadius: 10, 
    borderWidth: 1,
  },
  itemCount: { 
    fontSize: 11, 
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  cardArrow: {
    width: 34, 
    height: 34, 
    borderRadius: 12,
    justifyContent: 'center', 
    alignItems: 'center',
  }
});

export default CollectionRow;
