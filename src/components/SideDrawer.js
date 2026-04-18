/**
 * SideDrawer — Premium Slide-in Navigation
 * ==========================================
 * Full-height left-side drawer with user profile header,
 * glassmorphic backdrop, spring-animated reveal, and
 * swipe-to-close support via PanResponder.
 */

import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  StatusBar,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Path } from 'react-native-svg';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import { useUser } from '../contexts/UserContext';
import {
  SettingsIcon,
  InfoIcon,
  DashboardIcon,
  BackArrowIcon,
} from './icons/ConditionIcons';
import { COLORS, SPACING, RADII, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 340);
const SWIPE_THRESHOLD = 60;

const SideDrawer = ({
  visible,
  onClose,
  onSettingsPress,
  onAboutPress,
  onDashboardPress,
}) => {
  const { t } = useLanguage();
  const { speak } = useTTS();
  const { userData } = useUser();

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const isOpen = useRef(false);

  // ── Swipe-to-close gesture ──
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        gestureState.dx < -10 && Math.abs(gestureState.dy) < 30,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          slideAnim.setValue(Math.max(gestureState.dx, -DRAWER_WIDTH));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -SWIPE_THRESHOLD) {
          onClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      isOpen.current = true;
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 9,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start(() => {
        isOpen.current = false;
      });
    }
  }, [visible]);

  const handleItemPress = (action, label) => {
    speak(label);
    onClose();
    setTimeout(() => action(), 320);
  };

  // Don't render if fully closed
  if (!visible && !isOpen.current) return null;

  const initials = userData?.name
    ? userData.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'CV';

  const MENU_ITEMS = [
    {
      id: 'dashboard',
      icon: DashboardIcon,
      label: 'Analytics',
      description: 'Activity dashboard & insights',
      color: '#4F46E5',
      action: onDashboardPress,
    },
    {
      id: 'settings',
      icon: SettingsIcon,
      label: t('settings') || 'Settings',
      description: 'Theme, language & preferences',
      color: '#8B5CF6',
      action: onSettingsPress,
    },
    {
      id: 'about',
      icon: InfoIcon,
      label: 'About CogniVerse',
      description: 'Our mission & platform details',
      color: '#14B8A6',
      action: onAboutPress,
    },
  ];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'box-none'}>
      {/* ── Dark overlay with tap-to-dismiss ── */}
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
          accessibilityLabel="Close menu"
          accessibilityRole="button"
        />
      </Animated.View>

      {/* ── Drawer Panel ── */}
      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
        {...panResponder.panHandlers}
      >
        {/* ── Premium Header with SVG gradient ── */}
        <View style={styles.headerSection}>
          <Svg
            height="100%"
            width="100%"
            style={StyleSheet.absoluteFill}
            preserveAspectRatio="none"
          >
            <Defs>
              <LinearGradient id="drawerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#312E81" />
                <Stop offset="60%" stopColor="#4338CA" />
                <Stop offset="100%" stopColor="#6366F1" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#drawerGrad)" />
          </Svg>

          {/* Decorative circles */}
          <View style={[styles.headerOrb, { top: -20, right: -30, width: 120, height: 120, opacity: 0.06 }]} />
          <View style={[styles.headerOrb, { bottom: 10, left: -15, width: 60, height: 60, opacity: 0.08 }]} />

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessibilityLabel="Close drawer"
            accessibilityRole="button"
          >
            <BackArrowIcon size={20} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>

          {/* User avatar & info */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>
          <Text style={styles.headerName}>{userData?.name || 'CogniVerse'}</Text>
          <Text style={styles.headerEmail}>
            {userData?.email || 'Every mind is a universe'}
          </Text>

          {/* Membership badge */}
          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>✦ PREMIUM</Text>
          </View>
        </View>

        {/* ── Menu Items ── */}
        <View style={styles.menuContent}>
          <Text style={styles.menuSectionLabel}>NAVIGATION</Text>

          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleItemPress(item.action, item.label)}
              activeOpacity={0.7}
              accessibilityLabel={item.label}
              accessibilityRole="button"
              accessibilityHint={item.description}
            >
              <View style={[styles.menuIconBox, { backgroundColor: item.color + '12' }]}>
                <item.icon size={22} color={item.color} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
                <Text style={styles.menuItemDesc}>{item.description}</Text>
              </View>
              <Text style={[styles.menuItemArrow, { color: item.color }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Text style={styles.footerVersion}>CogniVerse v1.0.0</Text>
          <Text style={styles.footerCopy}>Nurturing Cognitive Growth</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: COLORS.surface,
    ...SHADOWS.xl,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    borderTopRightRadius: RADII.xxl,
    borderBottomRightRadius: RADII.xxl,
    overflow: 'hidden',
  },

  // ── Header ──
  headerSection: {
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 40) + 20,
    paddingBottom: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    overflow: 'hidden',
  },
  headerOrb: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : (StatusBar.currentHeight || 40) + 12,
    right: SPACING.lg,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarContainer: {
    marginBottom: SPACING.base,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  avatarText: {
    fontSize: FONT_SIZES.largeTitle,
    fontWeight: FONT_WEIGHTS.black,
    color: COLORS.textOnDark,
    letterSpacing: 1,
  },
  headerName: {
    fontSize: FONT_SIZES.title1,
    fontWeight: FONT_WEIGHTS.black,
    color: COLORS.textOnDark,
    marginBottom: SPACING.xs,
    letterSpacing: -0.3,
  },
  headerEmail: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.medium,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: SPACING.md,
  },
  memberBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 1,
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  memberBadgeText: {
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textOnDark,
    letterSpacing: 1.5,
  },

  // ── Menu ──
  menuContent: {
    flex: 1,
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  menuSectionLabel: {
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: SPACING.base,
    paddingLeft: SPACING.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  menuIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADII.md - 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: FONT_SIZES.subhead,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  menuItemDesc: {
    fontSize: FONT_SIZES.small,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
  },
  menuItemArrow: {
    fontSize: 26,
    fontWeight: FONT_WEIGHTS.bold,
    marginLeft: SPACING.sm,
  },

  // ── Footer ──
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.xl,
    alignItems: 'center',
  },
  footerDivider: {
    width: 60,
    height: 3,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginBottom: SPACING.base,
  },
  footerVersion: {
    fontSize: FONT_SIZES.small,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  footerCopy: {
    fontSize: FONT_SIZES.footnote,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textMuted,
  },
});

export default SideDrawer;
