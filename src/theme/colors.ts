// Modern, elegant color theme for Shift app
export const colors = {
  // Background colors
  background: '#0F1419', // Deep dark blue-gray
  backgroundSecondary: '#1A1F2E', // Slightly lighter dark
  surface: '#1E2330', // Card/surface color
  surfaceElevated: '#252A37', // Elevated surfaces

  // Primary colors
  primary: '#00D4AA', // Vibrant teal/cyan
  primaryDark: '#00B894', // Darker teal
  primaryLight: '#00E5CC', // Lighter teal

  // Secondary colors
  secondary: '#8B7EC8', // Soft purple
  accent: '#FF6B9D', // Coral/pink accent

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#B8BCC8',
  textTertiary: '#8A8D99',

  // Status colors
  success: '#00D4AA',
  error: '#FF6B9D',
  warning: '#FFB84D',
  info: '#4A90E2',

  // Border colors
  border: '#2A2D3A',
  borderLight: '#3A3D4A',

  // Input colors
  inputBackground: '#252A37',
  inputBorder: '#3A3D4A',
  inputFocus: '#00D4AA',

  // Button colors
  buttonPrimary: '#00D4AA',
  buttonPrimaryPressed: '#00B894',
  buttonSecondary: '#8B7EC8',
  buttonSecondaryPressed: '#7A6DB8',

  // Overlay
  overlay: 'rgba(15, 20, 25, 0.9)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: colors.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.text,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
};
