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

const SignupScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { signup, isSigningUp } = useAuthStore();
  const colors = useTheme();

  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      return Alert.alert('Error', 'Please fill in all fields.');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match.');
    }

    await signup({ fullName, email, password });
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
      <Text style={[styles.title, titleStyle]}>Create an Account</Text>
      <Text style={[styles.subtitle, subtitleStyle]}>Join Connectify today!</Text>

      <TextInput
        style={[styles.input, inputStyle]}
        placeholder="Full Name"
        placeholderTextColor={placeholderColor}
        value={fullName}
        onChangeText={setFullName}
      />

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

      <TextInput
        style={[styles.input, inputStyle]}
        placeholder="Confirm Password"
        placeholderTextColor={placeholderColor}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        onPress={handleSignup}
        disabled={isSigningUp}
      >
        {isSigningUp ? (
          <ActivityIndicator size="small" color={buttonTextStyle.color} />
        ) : (
          <Text style={[styles.buttonText, buttonTextStyle]}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerText, footerTextStyle]}>Already have an account? </Text>
        <Link href="/login" asChild>
          <TouchableOpacity>
            <Text style={[styles.linkText, linkTextStyle]}>Log In</Text>
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

export default SignupScreen;
