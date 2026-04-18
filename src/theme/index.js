/**
 * CogniVerse — Shared Design System Constants
 * =============================================
 * Single source of truth for all visual tokens.
 * Import from here instead of hardcoding values.
 *
 * Usage:
 *   import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../theme';
 */

// ──────────────────────────────────────────────
// COLOR PALETTE
// ──────────────────────────────────────────────
export const COLORS = {
  // ── Primary (Deep Indigo) ──
  primary: '#4338CA',
  primaryDark: '#312E81',
  primaryDeep: '#1E1B4B',
  primaryLight: '#818CF8',
  primaryMuted: '#6366F1',

  // ── Accent ──
  accent: '#8B5CF6',
  accentPink: '#EC4899',
  accentAmber: '#F59E0B',
  accentTeal: '#14B8A6',
  accentCyan: '#06B6D4',

  // ── Semantic ──
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // ── Surface & Background ──
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F1F5F9',

  // ── Text ──
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',

  // ── Border ──
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // ── Overlay ──
  overlayLight: 'rgba(255, 255, 255, 0.25)',
  overlayDark: 'rgba(15, 23, 42, 0.08)',
  overlayWhite95: 'rgba(255, 255, 255, 0.95)',
  overlayWhite20: 'rgba(255, 255, 255, 0.2)',
  overlayWhite06: 'rgba(255, 255, 255, 0.06)',
  overlayWhite08: 'rgba(255, 255, 255, 0.08)',

  // ── Suite-specific accent colors ──
  suiteComm: '#6366F1',
  suiteLearning: '#10B981',
  suiteSocial: '#F59E0B',
  suiteGames: '#EC4899',
};

// ──────────────────────────────────────────────
// SPACING
// ──────────────────────────────────────────────
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 60,
};

// ──────────────────────────────────────────────
// BORDER RADII
// ──────────────────────────────────────────────
export const RADII = {
  sm: 10,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
  pill: 999,
};

// ──────────────────────────────────────────────
// TYPOGRAPHY — scalable with textSize factor
// ──────────────────────────────────────────────
export const FONT_SIZES = {
  caption: 11,
  footnote: 12,
  small: 13,
  body: 14,
  callout: 15,
  subhead: 16,
  headline: 17,
  title3: 18,
  title2: 20,
  title1: 22,
  largeTitle: 24,
  hero: 30,
  display: 34,
  superDisplay: 36,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

/**
 * Returns a scaled font size based on the user's textSize preference.
 * @param {number} baseSize - The base font size
 * @param {number} scale - Scale factor from ThemeContext (e.g., 1.0, 1.15, 1.3)
 * @returns {number} Scaled font size, rounded
 */
export const scaledFont = (baseSize, scale = 1.0) => Math.round(baseSize * scale);

// ──────────────────────────────────────────────
// SHADOWS
// ──────────────────────────────────────────────
export const SHADOWS = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  xl: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  colored: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  }),
  glow: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  }),
};

// ──────────────────────────────────────────────
// COMMON COMPONENT PRESETS
// ──────────────────────────────────────────────
export const COMPONENT = {
  // Standard back button
  backButton: {
    backgroundColor: COLORS.overlayWhite95,
    borderRadius: RADII.lg,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
    shadowColor: COLORS.primaryDeep,
    shadowOpacity: 0.15,
  },

  // FAB (floating action button)
  fab: {
    position: 'absolute',
    bottom: 30,
    right: SPACING.xl,
  },
  fabInner: {
    width: 60,
    height: 60,
    borderRadius: RADII.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Standard card
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    ...SHADOWS.lg,
    overflow: 'hidden',
  },

  // Card accent strip (top color bar)
  cardAccentStrip: {
    height: 4,
    borderTopLeftRadius: RADII.xl,
    borderTopRightRadius: RADII.xl,
  },

  // Feature card inner layout
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.lg - 2,
  },

  // Icon container inside cards
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: RADII.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.base,
  },

  // Arrow indicator on cards
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: RADII.sm + 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Section headers
  waveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.base,
    zIndex: 10,
  },
  headerTitles: {
    flex: 1,
    alignItems: 'center',
    marginRight: 44,
  },
};

// ──────────────────────────────────────────────
// HEADER TEXT STYLES
// ──────────────────────────────────────────────
export const HEADER_TEXT = {
  screenTitle: {
    fontSize: FONT_SIZES.largeTitle,
    fontWeight: FONT_WEIGHTS.black,
    color: COLORS.textOnDark,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  screenSubtitle: {
    fontSize: FONT_SIZES.footnote,
    color: 'rgba(224,231,255,0.9)',
    fontWeight: FONT_WEIGHTS.semibold,
    marginTop: 3,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: FONT_SIZES.hero,
    fontWeight: FONT_WEIGHTS.black,
    color: COLORS.textOnDark,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.callout,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: FONT_WEIGHTS.medium,
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
};
