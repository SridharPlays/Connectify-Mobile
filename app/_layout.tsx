import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore.js';
import Toast from 'react-native-toast-message';
import { View, StyleSheet } from 'react-native';
import SplashScreen from '../components/SplashScreen';

export default function RootLayout() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isCheckingAuth) {
      return;
    }

    if (authUser) {
      router.replace('/');
    } else {
      router.replace('/login');
    }
  }, [authUser, isCheckingAuth]);

  if (isCheckingAuth) {
    return <SplashScreen />;
  }

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});