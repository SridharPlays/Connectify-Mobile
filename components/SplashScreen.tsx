import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../store/useThemeStore'; 

const SplashScreen = () => {
  const colors = useTheme();

  const containerStyle = {
    backgroundColor: colors['base-100'],
  };
  const textStyle = {
    color: colors['base-content'],
  };
  const subtitleStyle = {
    color: `${colors['base-content']}B3`,
  };

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <View style={styles.content}>
        <Text style={[styles.title, textStyle]}>Connectify</Text>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.subtitle, subtitleStyle]}>
          Loading your conversations...
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
  },
});

export default SplashScreen;

