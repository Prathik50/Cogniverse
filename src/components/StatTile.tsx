import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SHADOWS } from '../theme';

interface StatTileProps {
  title: string;
  value: string | number;
  color: string;
  icon: string;
  index: number;
}

const StatTile: React.FC<StatTileProps> = ({ title, value, color, icon, index }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100 + 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: index * 100 + 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacityAnim, scaleAnim, index]);

  return (
    <Animated.View style={[
      styles.statBox, 
      { 
        borderColor: color + '25', 
        backgroundColor: color + '08',
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }]
      }
    ]}>
      <View style={styles.iconRow}>
        <View style={[styles.iconWrapper, { backgroundColor: color + '15' }]}>
          <Text style={styles.iconText} allowFontScaling={false}>{icon}</Text>
        </View>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{title}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  statBox: {
    width: '48%',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    ...SHADOWS.sm,
  },
  iconRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 40,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    lineHeight: 18,
  },
});

export default StatTile;
