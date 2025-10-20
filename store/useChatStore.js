import { create } from "zustand";
import Toast from "react-native-toast-message";
import { axiosInstance } from "../lib/config.native.js";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching users',
        text2: error.response?.data?.message || 'An error occurred.',
      });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching messages',
        text2: error.response?.data?.message || 'An error occurred.',
      });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error sending message',
        text2: error.response?.data?.message || 'An error occurred.',
      });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage"); 
    socket.on("newMessage", (newMessage) => {
      const isMessageFromSelectedUser = newMessage.senderId === selectedUser._id;
      
      const isMessageFromAuthUser = newMessage.senderId === useAuthStore.getState().authUser._id;

      if (isMessageFromSelectedUser || isMessageFromAuthUser) {
          set({
            messages: [...get().messages, newMessage],
          });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
        socket.off("newMessage");
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/delete/${messageId}`);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error deleting message',
        text2: error.response?.data?.message || 'An error occurred.',
      });
    }
  },

  listenForDeletedMessages: () => {
    const socket = useAuthStore.getState().socket;

    if (!socket) {
      console.warn("Socket not found, can't listen for deleted messages.");
      return;
    }

    socket.off("messageDeleted");
    socket.on("messageDeleted", (deletedMessage) => {
      set((state) => ({
        messages: state.messages.map((message) =>
          message._id === deletedMessage._id
            ? deletedMessage 
            : message
        ),
      }));
    });
  },
}));