import { useColorScheme } from './use-color-scheme';
import { ImperialColors, LightColors } from '@/constants/theme';

/**
 * Hook to get the appropriate imperial colors based on current theme
 */
export function useImperialColors() {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? ImperialColors : LightColors;
}
