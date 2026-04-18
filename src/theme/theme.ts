export const COLORS = {
  // Primary (Deep Purple)
  primary: '#4338CA',
  primaryDeep: '#1E1B4B',
  primaryDark: '#312E81',
  primaryLight: '#818CF8',

  // Accents
  accentTeal: '#14B8A6',
  accentPink: '#EC4899',
  accentOrange: '#F59E0B',
  accentGreen: '#10B981',

  // Neutrals & Surface
  background: '#F8FAFC',
  surface: '#FFFFFF',
  
  // Text
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textOnDark: '#FFFFFF',
  
  // Border
  borderLight: '#F1F5F9',
} as const;

export const TYPOGRAPHY = {
  sizes: {
    caption: 12,
    label: 14,
    body: 16,
    h3: 18,
    h2: 24,
    h1: 32,
    hero: 40,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const RADII = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  full: 999,
} as const;

export const SHADOWS = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;
