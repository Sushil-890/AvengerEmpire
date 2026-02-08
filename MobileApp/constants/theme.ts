/**
 * Imperial Style Theme for Avenger Empire
 * Inspired by royal and imperial aesthetics with dark, gold, and crimson colors
 */

import { Platform } from 'react-native';

// Imperial Color Palette
const imperialGold = '#D4AF37';
const imperialCrimson = '#8B0000';
const imperialBlack = '#0A0A0A';
const imperialSilver = '#C0C0C0';

const tintColorLight = imperialCrimson;
const tintColorDark = imperialGold;

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: imperialBlack,
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// Light Theme Colors (for when user switches to light mode)
export const LightColors = {
  primary: {
    gold: '#B8860B', // Darker gold for light mode
    darkGold: '#8B6914',
    lightGold: '#D4AF37',
  },
  secondary: {
    crimson: '#DC143C', // Brighter crimson for light mode
    darkCrimson: '#8B0000',
    lightCrimson: '#FF6B6B',
  },
  neutral: {
    black: '#F9FAFB', // Page background (light gray)
    darkGray: '#FFFFFF', // Cards (white)
    mediumGray: '#F3F4F6', // Secondary backgrounds
    lightGray: '#E5E7EB', // Borders
    silver: '#6B7280', // Secondary text
    white: '#1A1A1A', // Primary text (dark)
  },
  accent: {
    bronze: '#CD7F32',
    copper: '#B87333',
    pearl: '#F0F0F0',
  }
};

// Imperial Theme Colors
export const ImperialColors = {
  primary: {
    gold: imperialGold,
    darkGold: '#B8860B',
    lightGold: '#FFD700',
  },
  secondary: {
    crimson: imperialCrimson,
    darkCrimson: '#660000',
    lightCrimson: '#DC143C',
  },
  neutral: {
    black: imperialBlack,
    darkGray: '#1A1A1A',
    mediumGray: '#2D2D2D',
    lightGray: '#404040',
    silver: imperialSilver,
    white: '#FFFFFF',
  },
  accent: {
    bronze: '#CD7F32',
    copper: '#B87333',
    pearl: '#F8F8FF',
  }
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
