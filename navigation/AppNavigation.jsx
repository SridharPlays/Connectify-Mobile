// navigation/AppNavigator.js (Example)
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/useAuthStore';

import LoginScreen from '../app/Auth/LoginScreen';
import SignupScreen from '../app/Auth/SignupScreen';
import HomeScreen from '../app/Main/HomeScreen'; 

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return null;
  }

  return (
    <Stack.Navigator>
      {authUser ? (
        <Stack.Screen name="Home" component={HomeScreen} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;