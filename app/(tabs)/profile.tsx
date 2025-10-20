import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Camera, LogOut } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/useAuthStore';
import { useTheme } from '../../store/useThemeStore';

const DEFAULT_AVATAR_IMAGE = require('../../assets/images/avatar.png');

type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  'base-100': string;
  'base-content': string;
};

type InfoFieldProps = {
  label: string;
  value: string | undefined | null;
  themeColors: ThemeColors;
};

const InfoField: React.FC<InfoFieldProps> = ({ label, value, themeColors }) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={[styles.label, { color: `${themeColors['base-content']}80` }]}>
        {label}
      </Text>
      <View
        style={[
          styles.input,
          {
            backgroundColor: `${themeColors.neutral}33`,
            borderColor: `${themeColors.neutral}55`,
          },
        ]}
      >
        <Text style={[styles.value, { color: themeColors['base-content'] }]}>
          {value || ''}
        </Text>
      </View>
    </View>
  );
};

export default function ProfileScreen() {
  const { authUser, logout, updateProfile, isUpdatingProfile } = useAuthStore();
  const colors: ThemeColors = useTheme();
  const [memberSince, setMemberSince] = useState('');

  useEffect(() => {
    if (authUser?.createdAt) {
      const date = new Date(authUser.createdAt);
      setMemberSince(date.toISOString().split('T')[0]);
    }
  }, [authUser]);

  const handleUpdateProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      await updateProfile({ profilePic: base64Image });
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const imageSource = authUser?.profilePic
    ? { uri: authUser.profilePic }
    : DEFAULT_AVATAR_IMAGE;

  const containerStyle = { backgroundColor: colors['base-100'] };
  const titleStyle = { color: colors['base-content'] };
  const subtitleStyle = { color: `${colors['base-content']}B3` };
  const cameraIconBg = { backgroundColor: `${colors.neutral}CC` };
  const sectionTitleStyle = { color: colors['base-content'] };
  const statusBadge = { backgroundColor: '#2ecc7133', borderColor: '#2ecc71' };
  const statusText = { color: '#2ecc71' };
  const logoutButton = { backgroundColor: colors.primary };
  const logoutButtonText = { color: colors['base-content'] || '#FFFFFF' };

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, titleStyle]}>Profile</Text>
        <Text style={[styles.subtitle, subtitleStyle]}>
          Your profile information
        </Text>

        <View style={styles.avatarWrapper}>
          <Image source={imageSource} style={styles.avatar} />
          {isUpdatingProfile ? (
            <View style={[styles.cameraIcon, styles.loadingOverlay]}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.cameraIcon, cameraIconBg]}
              onPress={handleUpdateProfileImage}
            >
              <Camera size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.subtitle, subtitleStyle, { fontSize: 14 }]}>
          Click the camera icon to update your photo
        </Text>

        <InfoField
          label="Full Name"
          value={authUser?.fullName}
          themeColors={colors}
        />
        <InfoField
          label="Email Address"
          value={authUser?.email}
          themeColors={colors}
        />

        <Text style={[styles.sectionTitle, sectionTitleStyle]}>
          Account Information
        </Text>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: `${colors['base-content']}80` }]}>
            Account Status
          </Text>
          <View style={[styles.badge, statusBadge]}>
            <Text style={[styles.badgeText, statusText]}>Active</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: `${colors['base-content']}80` }]}>
            Member Since
          </Text>
          <Text style={[styles.value, { color: colors['base-content'] }]}>
            {memberSince}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, logoutButton]}
          onPress={handleLogout}
        >
          <LogOut size={20} color={logoutButtonText.color} />
          <Text style={[styles.logoutButtonText, logoutButtonText]}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 4 },
  avatarWrapper: { marginTop: 30, position: 'relative' },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#555',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    padding: 8,
    borderRadius: 20,
  },
  loadingOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 36,
    height: 36,
  },
  fieldContainer: { width: '100%', marginTop: 20 },
  label: { fontSize: 14, marginBottom: 8, marginLeft: 4 },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  value: { fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginTop: 30, width: '100%' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: { fontSize: 14, fontWeight: '600' },
  logoutButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 40,
  },
  logoutButtonText: { fontSize: 16, fontWeight: 'bold' },
});