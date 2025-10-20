import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Switch,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  Alert,
} from 'react-native';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useTheme } from '../../store/useThemeStore';
import { Users, ArrowLeft, Send } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DEFAULT_AVATAR_IMAGE = require('../../assets/images/avatar.png');

const UserListView = () => {
  const colors = useTheme();
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const otherUsers = users.filter((user) => user._id !== authUser?._id);
  const filteredUsers = showOnlineOnly
    ? otherUsers.filter((user) => onlineUsers.includes(user._id))
    : otherUsers;
  const onlineCount = onlineUsers.filter((id) => id !== authUser?._id).length;

  if (isUsersLoading) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          { backgroundColor: colors['base-100'] },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors['base-100'] }]}
    >
      <View
        style={[styles.header, { borderBottomColor: `${colors.neutral}22` }]}
      >
        <View style={styles.titleContainer}>
          <Users size={28} color={colors['base-content']} />
          <Text style={[styles.title, { color: colors['base-content'] }]}>
            Contacts
          </Text>
        </View>
        <View style={styles.filterContainer}>
          <Text
            style={[
              styles.filterText,
              { color: colors['base-content'], opacity: 0.7 },
            ]}
          >
            Show online only ({onlineCount})
          </Text>
          <Switch
            value={showOnlineOnly}
            onValueChange={setShowOnlineOnly}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={showOnlineOnly ? colors.primary : '#f4f3f4'}
          />
        </View>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <UserItem
            user={item}
            onSelect={setSelectedUser}
            isSelected={selectedUser?._id === item._id}
            isOnline={onlineUsers.includes(item._id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                { color: colors['base-content'], opacity: 0.5 },
              ]}
            >
              {showOnlineOnly ? 'No online users' : 'No users found'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const UserItem = ({ user, onSelect, isSelected, isOnline }) => {
  const colors = useTheme();
  const imageSource = user.profilePic
    ? { uri: user.profilePic }
    : DEFAULT_AVATAR_IMAGE;

  const selectedStyle = {
    backgroundColor: colors.accent ? `${colors.accent}33` : '#f0f0f0',
  };
  const onlineIndicatorBorder = {
    borderColor: colors['base-100'],
  };
  const userNameStyle = {
    color: colors['base-content'],
  };
  const userStatusStyle = {
    color: colors['base-content'],
    opacity: 0.7,
  };

  return (
    <TouchableOpacity
      style={[styles.userButton, isSelected && selectedStyle]}
      onPress={() => onSelect(user)}
    >
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={imageSource} />
        {isOnline && (
          <View style={[styles.onlineIndicator, onlineIndicatorBorder]} />
        )}
      </View>
      <View style={styles.userInfo}>
        <Text style={[styles.userName, userNameStyle]}>{user.fullName}</Text>
        <Text style={[styles.userStatus, userStatusStyle]}>
          {isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const ChatView = () => {
    const colors = useTheme();
    const {
      selectedUser,
      setSelectedUser,
      messages,
      getMessages,
      sendMessage,
      isMessagesLoading,
      subscribeToMessages,
      unsubscribeFromMessages,
      deleteMessage,
      listenForDeletedMessages,
    } = useChatStore();
    const { authUser } = useAuthStore();
    const [text, setText] = useState('');
    const flatListRef = useRef(null);

    useEffect(() => {
      if (selectedUser) {
        getMessages(selectedUser._id);
        subscribeToMessages();
        listenForDeletedMessages();
      }
      const backAction = () => {
        setSelectedUser(null);
        return true;
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => {
        unsubscribeFromMessages();
        backHandler.remove();
      };
    }, [
        selectedUser,
        getMessages,
        subscribeToMessages,
        unsubscribeFromMessages,
        setSelectedUser,
        listenForDeletedMessages
    ]);

    const handleDelete = (messageId) => {
        Alert.alert(
            "Delete Message",
            "Are you sure you want to delete this message?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteMessage(messageId) }
            ]
        );
    };

    const handleSend = async () => {
      if (text.trim().length === 0) return;
      await sendMessage({ text });
      setText('');
    };

    const imageSource = selectedUser?.profilePic
      ? { uri: selectedUser.profilePic }
      : DEFAULT_AVATAR_IMAGE;

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors['base-100'] }]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
        >
          <View style={[styles.header, { borderBottomColor: `${colors.neutral}22` }]}>
            <TouchableOpacity onPress={() => setSelectedUser(null)}>
              <ArrowLeft size={24} color={colors['base-content']} />
            </TouchableOpacity>
            <Image source={imageSource} style={styles.chatHeaderAvatar} />
            <Text style={[styles.chatHeaderName, { color: colors['base-content'] }]}>
              {selectedUser.fullName}
            </Text>
          </View>

          {isMessagesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={[...messages].reverse()}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <MessageBubble
                  message={item}
                  isOwnMessage={item.senderId === authUser._id}
                  onDelete={handleDelete}
                />
              )}
              contentContainerStyle={styles.messageList}
              inverted
            />
          )}

          <View style={[styles.inputContainer, { borderTopColor: `${colors.neutral}22` }]}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: `${colors.neutral}22`,
                  color: colors['base-content'],
                },
              ]}
              placeholder="Type a message..."
              placeholderTextColor={`${colors['base-content']}80`}
              value={text}
              onChangeText={setText}
            />
            <TouchableOpacity style={[styles.sendButton, { backgroundColor: colors.primary }]} onPress={handleSend}>
              <Send size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
};

const MessageBubble = ({ message, isOwnMessage, onDelete }) => {
    const colors = useTheme();
    const bubbleStyle = isOwnMessage
      ? [styles.messageBubble, styles.ownMessage, { backgroundColor: colors.primary }]
      : [styles.messageBubble, styles.otherMessage, { backgroundColor: `${colors.neutral}4D` }];
    const textStyle = isOwnMessage
      ? [styles.messageText, styles.ownMessageText]
      : [styles.messageText, { color: colors['base-content'] }];

    if (message.isDeleted) {
        return (
          <View style={[styles.messageContainer, isOwnMessage ? styles.ownMessageContainer : {}]}>
            <View style={[bubbleStyle, styles.deletedBubble]}>
              <Text style={[textStyle, styles.deletedText]}>This message was deleted</Text>
            </View>
          </View>
        );
    }
    const handleLongPress = () => {
        if (isOwnMessage && onDelete) {
            onDelete(message._id);
        }
    };
    return (
      <TouchableOpacity
        style={[styles.messageContainer, isOwnMessage ? styles.ownMessageContainer : {}]}
        onLongPress={handleLongPress}
        delayLongPress={500}
        activeOpacity={0.7}
      >
        <View style={bubbleStyle}>
          <Text style={textStyle}>{message.text}</Text>
        </View>
      </TouchableOpacity>
    );
};

export default function HomeScreen() {
  const { selectedUser } = useChatStore();
  return selectedUser ? <ChatView /> : <UserListView />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  filterText: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  selectedUser: {
    backgroundColor: '#f0f0f0',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2ecc71',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  userStatus: {
    fontSize: 14,
  },
  chatHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageList: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messageContainer: {
    marginVertical: 5,
    flexDirection: 'row',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    maxWidth: '80%',
  },
  ownMessage: {
    borderBottomRightRadius: 5,
  },
  otherMessage: {
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  ownMessageText: {
    color: '#fff',
  },
  deletedBubble: {
    opacity: 0.7,
  },
  deletedText: {
      fontStyle: 'italic',
      fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});