# Theme Toggle Feature

## Overview
The Avenger Empire app now supports light and dark theme switching with a toggle button in the header.

## Location
The theme toggle button is located in the **top-right corner** of the header bar, next to the "Avenger Empire" title and the drawer menu icon.

## Features

### Theme Toggle Button
- **Icon**: Shows sun icon (light-mode) in dark theme, moon icon (dark-mode) in light theme
- **Location**: Header right side on all tab screens (Home, Explore, Cart)
- **Styling**: Rounded button with imperial gold accent in dark mode

### Theme Modes
1. **Dark Mode (Default)**: Imperial aesthetic with dark backgrounds and gold accents
2. **Light Mode**: Clean white backgrounds with darker gold and crimson accents

### Persistence
- Theme preference is saved using AsyncStorage
- Your selected theme persists across app restarts

## Implementation Details

### New Files Created
1. `context/ThemeContext.tsx` - Theme state management
2. `hooks/use-imperial-colors.ts` - Helper hook for theme-aware colors

### Modified Files
1. `app/_layout.tsx` - Added ThemeProvider wrapper
2. `app/(drawer)/(tabs)/_layout.tsx` - Added theme toggle button in headerRight
3. `hooks/use-color-scheme.ts` - Updated to use ThemeContext
4. `constants/theme.ts` - Added LightColors palette

### Usage in Components

```typescript
import { useTheme } from '@/context/ThemeContext';
import { useImperialColors } from '@/hooks/use-imperial-colors';

function MyComponent() {
  const { currentTheme, toggleTheme } = useTheme();
  const colors = useImperialColors();
  
  return (
    <View style={{ backgroundColor: colors.neutral.black }}>
      <Text style={{ color: colors.primary.gold }}>
        Current theme: {currentTheme}
      </Text>
    </View>
  );
}
```

### Automatic Theme Support
All existing components using `ThemedView` and `ThemedText` automatically support the theme toggle without any changes needed.

## Color Palettes

### Dark Mode (Imperial Theme)
- Background: `#0A0A0A` (Imperial Black)
- Primary: `#D4AF37` (Imperial Gold)
- Secondary: `#8B0000` (Imperial Crimson)
- Text: `#FFFFFF` (White)

### Light Mode
- Background: `#FFFFFF` (White)
- Primary: `#B8860B` (Darker Gold)
- Secondary: `#DC143C` (Brighter Crimson)
- Text: `#11181C` (Dark Gray)

## User Experience
- Smooth transition between themes
- Consistent styling across all screens
- Imperial aesthetic maintained in both themes
- Accessible color contrast in both modes
