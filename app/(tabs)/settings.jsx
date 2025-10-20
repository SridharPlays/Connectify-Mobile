import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { useThemeStore, useTheme } from '../../store/useThemeStore';
import { themes } from '../../theme/themes';
import { SafeAreaView } from 'react-native-safe-area-context';

const ThemeCard = ({ theme, isSelected, onSelect, themeColors }) => {
  const colors = Object.values(theme.colors);

  const cardStyle = {
    backgroundColor: `${themeColors.neutral}22`,
  };
  const themeNameStyle = {
    color: themeColors['base-content'],
  };
  const swatchStyle = {
    borderColor: themeColors['base-100'],
  };
  const selectedStyle = {
    borderColor: themeColors.primary,
  };
  const checkStyle = {
    backgroundColor: themeColors.primary,
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onSelect(theme.name)}>
      {isSelected && (
        <View style={[styles.checkContainer, checkStyle]}>
          <Check size={24} color="#fff" />
        </View>
      )}
      <View
        style={[
          styles.cardContent,
          cardStyle,
          isSelected && selectedStyle,
        ]}
      >
        <Text style={[styles.themeName, themeNameStyle]}>{theme.name}</Text>
        <View style={styles.swatchContainer}>
          {colors.map((color, index) => (
            <View
              key={index}
              style={[styles.swatch, swatchStyle, { backgroundColor: color }]}
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const { themeName, setTheme } = useThemeStore();
  const colors = useTheme();

  const containerStyle = {
    backgroundColor: colors['base-100'],
  };
  const headerStyle = {
    borderBottomColor: `${colors.neutral}33`,
  };
  const titleStyle = {
    color: colors['base-content'],
  };
  const subtitleStyle = {
    color: colors['base-content'],
    opacity: 0.7,
  };

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <View style={[styles.header, headerStyle]}>
        <Text style={[styles.title, titleStyle]}>Theme</Text>
        <Text style={[styles.subtitle, subtitleStyle]}>
          Choose a theme for your app interface.
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.grid}>
        {themes.map((theme) => (
          <ThemeCard
            key={theme.name}
            theme={theme}
            isSelected={theme.name === themeName}
            onSelect={setTheme}
            themeColors={colors}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  card: {
    width: '45%',
    margin: 8,
    position: 'relative',
  },
  checkContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 5,
  },
  cardContent: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#007BFF',
  },
  themeName: {
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  swatchContainer: {
    flexDirection: 'row',
  },
  swatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: -8,
    borderWidth: 1,
  },
});