import { useTheme } from '@/context/ThemeContext';

export function useColorScheme() {
  try {
    const { currentTheme } = useTheme();
    return currentTheme;
  } catch {
    // Fallback if used outside ThemeProvider
    return 'dark';
  }
}
