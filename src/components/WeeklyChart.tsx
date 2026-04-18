import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const WeeklyChart = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Simulated dynamic activity data strictly mirroring user logic constraints
  const activityData = [3, 5, 2, 8, 6, 4, 7];
  const maxActivity = Math.max(...activityData);
  
  // Dimensions 
  const chartHeight = 160;
  const barWidth = 24;
  const chartWidth = width - 88; // Accounting for paddings
  const gap = (chartWidth - (days.length * barWidth)) / (days.length - 1);

  // Growth animation
  const growAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(growAnim, {
      toValue: 1,
      tension: 40,
      friction: 8,
      delay: 600,
      useNativeDriver: false, // Animating SVG height logic
    }).start();
  }, [growAnim]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This Week</Text>
      
      <View style={styles.chartArea}>
        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
             <LinearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
               <Stop offset="0%" stopColor="#818CF8" />
               <Stop offset="100%" stopColor="#4B3FD8" />
             </LinearGradient>
          </Defs>
          {activityData.map((val, index) => {
             const finalHeight = (val / maxActivity) * chartHeight * 0.8; // Max 80% to leave room
             const animatedHeight = growAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, finalHeight]
             });
             const animatedY = growAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [chartHeight, chartHeight - finalHeight]
             });

             return (
                <React.Fragment key={index}>
                   {/* Background Track Bar */}
                   <Rect 
                      x={index * (barWidth + gap)} 
                      y={0}
                      width={barWidth}
                      height={chartHeight}
                      rx={12}
                      fill="#F1F5F9"
                   />
                   {/* Purple Animated Value Bar */}
                   <AnimatedRect 
                      x={index * (barWidth + gap)} 
                      y={animatedY}
                      width={barWidth}
                      height={animatedHeight}
                      rx={12}
                      fill="url(#barGrad)"
                   />
                </React.Fragment>
             );
          })}
        </Svg>
        
        {/* X-Axis Labels */}
        <View style={styles.xAxis}>
          {days.map((day, ix) => (
             <Text key={ix} style={styles.label}>{day}</Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 24,
    letterSpacing: -0.2,
  },
  chartArea: {
    alignItems: 'center',
  },
  xAxis: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    width: 24,
    textAlign: 'center',
  }
});

export default WeeklyChart;
