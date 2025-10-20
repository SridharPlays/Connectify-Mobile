import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes } from '../theme/themes';

export const useThemeStore = create(
  persist(
    (set) => ({
      themeName: 'dark',
      setTheme: (newThemeName) => set({ themeName: newThemeName }),
    }),
    {
      name: 'app-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useTheme = () => {
  const themeName = useThemeStore((state) => state.themeName);
  const theme = themes.find((t) => t.name === themeName) || themes[1]; 
  return theme.colors;
};
