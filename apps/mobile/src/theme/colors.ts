export const Colors = {
  primary: '#c9a96e',
  primaryDark: '#a67c52',
  primaryLight: '#e8d5b7',
  accent: '#8b4a6b',

  background: '#fafaf8',
  surface: '#ffffff',
  surfaceElevated: '#f5f5f0',
  card: '#ffffff',

  textPrimary: '#1a1a1a',
  textSecondary: '#6b6b6b',
  textMuted: '#a0a0a0',
  textInverse: '#ffffff',

  success: '#2e7d32',
  error: '#c62828',
  warning: '#e65100',
  info: '#1565c0',

  border: '#e0ddd8',
  borderLight: '#f0eee9',

  skeletonBase: '#e8e8e8',
  skeletonHighlight: '#f5f5f5',

  tabActive: '#c9a96e',
  tabInactive: '#a0a0a0',
  tabBackground: '#ffffff',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodySmall: { fontSize: 13, fontWeight: '400' as const },
  caption: { fontSize: 11, fontWeight: '400' as const },
  button: { fontSize: 15, fontWeight: '600' as const, letterSpacing: 0.2 },
} as const;

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;
