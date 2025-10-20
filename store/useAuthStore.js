import { create } from "zustand";
import { axiosInstance, SOCKET_URL } from "../lib/config.native.js";
import Toast from "react-native-toast-message";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("No active session found.");
      } else {
        console.log("Error in CheckAuth:", error.message);
      }
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  clearAuth: () => {
    get().disconnectSocket();
    set({ authUser: null });
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      Toast.show({
        type: 'success',
        text1: 'Account created successfully',
      });
      get().connectSocket();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: error.response?.data?.message || 'An unknown error occurred.',
      });
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      Toast.show({
        type: 'success',
        text1: 'Logged in successfully',
      });
      get().connectSocket();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.response?.data?.message || 'An unknown error occurred.',
      });
      console.error("Login API Error:", error.response?.data || error.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      Toast.show({
        type: 'success',
        text1: 'Logged out successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: error.response?.data?.message || 'An unknown error occurred.',
      });
    } finally {
      get().clearAuth();
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      Toast.show({
        type: 'success',
        text1: 'Profile updated successfully',
      });
    } catch (error) {
      console.log("error in update profile:", error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.response?.data?.message || 'An unknown error occurred.',
      });
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(SOCKET_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
    socket.on('connect_error', (err) => {
      console.log("Socket connection error:", err.message);
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
    set({ socket: null, onlineUsers: [] });
  },
}));

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { authUser } = useAuthStore.getState();
      if (authUser) {
        Toast.show({
          type: 'error',
          text1: 'Session Expired',
          text2: 'Please log in again.',
        });
      }
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);