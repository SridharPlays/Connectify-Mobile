import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { useTheme } from '../../store/useThemeStore';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, isLoggingIn } = useAuthStore();
  const colors = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Please fill in all fields.');
    }
    await login({ email, password });
  };

  const containerStyle = { backgroundColor: colors['base-100'] };
  const titleStyle = { color: colors['base-content'] };
  const subtitleStyle = { color: `${colors['base-content']}B3` };
  const inputStyle = {
    backgroundColor: `${colors.neutral}22`,
    borderColor: `${colors.neutral}55`,
    color: colors['base-content'],
  };
  const buttonStyle = { backgroundColor: colors.primary };
  const buttonTextStyle = { color: colors['base-content'] };
  const footerTextStyle = { color: `${colors['base-content']}B3` };
  const linkTextStyle = { color: colors.primary };
  const placeholderColor = `${colors['base-content']}80`;

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <Text style={[styles.title, titleStyle]}>Welcome Back!</Text>
      <Text style={[styles.subtitle, subtitleStyle]}>
        Log in to continue your conversations.
      </Text>

      <TextInput
        style={[styles.input, inputStyle]}
        placeholder="Email"
        placeholderTextColor={placeholderColor}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={[styles.input, inputStyle]}
        placeholder="Password"
        placeholderTextColor={placeholderColor}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        onPress={handleLogin}
        disabled={isLoggingIn}
      >
        {isLoggingIn ? (
          <ActivityIndicator size="small" color={buttonTextStyle.color} />
        ) : (
          <Text style={[styles.buttonText, buttonTextStyle]}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerText, footerTextStyle]}>
          Don't have an account?{' '}
        </Text>
        <Link href="/signup" asChild>
          <TouchableOpacity>
            <Text style={[styles.linkText, linkTextStyle]}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;

