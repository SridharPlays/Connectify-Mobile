import { Stack, router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import SplashScreen from '../components/SplashScreen';
import { useAuthStore } from '../store/useAuthStore.js';

type User = {
  _id: string;
  fullName: string;
  email: string;
};

interface AuthStoreState {
  authUser: User | null;
  isCheckingAuth: boolean;
  checkAuth: () => void;
}

export default function RootLayout() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore() as AuthStoreState;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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

