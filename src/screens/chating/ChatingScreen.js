import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axiosInstance from "../../config/axios";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SOCKET_URL = "http://192.168.1.101:5000"; // <-- change to your server

export default function ChatingScreen({ route }) {
  const { user: userChat } = route.params;
  const { user } = useSelector((state) => state.login);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);

  const socketRef = useRef(null);

  // Initialize chat (get chatId and initial messages), then connect socket and join room
  useEffect(() => {
    let mounted = true;

    const initChat = async () => {
      try {
        // 1) Get or create chatId from backend
        const chatRes = await axiosInstance.get(
          `/messageActions/getChatId/${user._id}/${userChat._id}`
        );
        const currentChatId = chatRes.data._id;
        if (!mounted) return;
        setChatId(currentChatId);

        // 2) Fetch existing messages for that chat
        const msgRes = await axiosInstance.get(
          `/messageActions/allMessages/${currentChatId}`
        );
        if (!mounted) return;
        setMessages(msgRes.data || []);

        // 3) Connect socket and join room
        socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });

        socketRef.current.on("connect", () => {
          console.log("Socket connected:", socketRef.current.id);
          socketRef.current.emit("joinChat", currentChatId);
        });

        // incoming messages for this chat
        socketRef.current.on("message", (msg) => {
          // ensure we append only messages for this chat
          if (msg.chatId && msg.chatId.toString() === currentChatId.toString()) {
            setMessages((prev) => [...prev, msg]);
          }
        });

        socketRef.current.on("connect_error", (err) => {
          console.log("Socket connect error:", err.message);
        });
      } catch (error) {
        console.log("Error initializing chat:", error.message);
      }
    };

    initChat();

    return () => {
      mounted = false;
      // cleanup socket
      if (socketRef.current) {
        if (chatId) socketRef.current.emit("leaveChat", chatId);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    // note: user._id and userChat._id are stable; chatId will be set inside
  }, [user._id, userChat._id]);

  // Send message: via socket (real-time). If socket is down fallback to REST post.
  const handleSend = async () => {
    if (!input.trim()) return;

    const payload = {
      chatId, // server prefers chatId (we already have it)
      senderId: user._id,
      receiverId: userChat._id,
      messageType: "text",
      text: input,
    };

    try {
      if (socketRef.current && socketRef.current.connected) {
        // send through socket — server will save and broadcast back to all room members
        socketRef.current.emit("sendMessage", payload);
        setInput("");
        // DO NOT append locally — wait for server to emit the saved message (keeps IDs consistent)
      } else {
        // fallback: REST call (keeps functionality if socket fails)
        const res = await axiosInstance.post(`/messageActions/sendMessage`, payload);
        // server returns saved message — append it
        setMessages((prev) => [...prev, res.data]);
        setInput("");
        // store chatId if server returned it (in case chat was new)
        if (!chatId && res.data.chatId) setChatId(res.data.chatId);
      }
    } catch (err) {
      console.log("Error sending message:", err.message || err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {userChat.avatar ? (
            <Image source={{ uri: userChat.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarText}>
                {userChat.username.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.headerName}>{userChat.username}</Text>
        </View>

        {/* Chat Area */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id || item.id}
          style={styles.chatArea}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.senderId === user._id ? styles.myMessage : styles.theirMessage,
              ]}
            >
              <Text style={[styles.messageText, item.senderId === user._id ? { color: "#fff" } : { color: "#000" }]}>
                {item.text}
              </Text>
            </View>
          )}
        />

        {/* Input Area */}
        <View style={styles.inputArea}>
          <TouchableOpacity>
            <Icon name="happy-outline" size={26} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="camera-outline" size={26} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="image-outline" size={26} color="gray" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Icon name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#007bff",
  },
  headerName: { fontSize: 18, color: "#fff", fontWeight: "600", marginLeft: 10 },
  chatArea: { flex: 1, padding: 10 },
  messageBubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  myMessage: { backgroundColor: "#007bff", alignSelf: "flex-end" },
  theirMessage: { backgroundColor: "#e5e5ea", alignSelf: "flex-start" },
  messageText: { color: "#fff" },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#007bff",
    borderRadius: 20,
    padding: 10,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  avatarFallback: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
});
