import { useNavigation, useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axiosInstance from "../../../config/axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import Navbar from "../../../components/Navbar";
import { useSelector } from "react-redux";


export default function ChatsScreen() {
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const {user} = useSelector(state => state.login)

  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/friendRequest/my-chats");
      setChats(res.data || []);
    } catch (err) {
      console.log("Error fetching chats:", err.response?.data || err.message);
      setChats([]);
    } finally {
      setLoading(false);
    }
  };
  // console.log("chats==>>" , chats)

  // ✅ Jab bhi Chats tab focus me aaye, API call ho
  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, [])
  );

  // Search filter
  const filteredChats = (chats || []).filter((chat) =>
    chat?.username?.toLowerCase().includes(search.toLowerCase())
  );
  
  // Render each chat item

const renderChatItem = ({ item }) => {
  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate("Chating", { user: item })}
    >
      {/* Avatar */}
      {item.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Text style={styles.avatarText}>
            {item.username.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      {/* Chat Info */}
      <View style={styles.chatInfo}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.username}</Text>
          <Text style={styles.time}>
            {item.lastMessage?.time || "Just now"}
          </Text>
        </View>
        <Text style={styles.message} numberOfLines={1}>
          {item.lastMessage?.text || "Start a conversation..."}
        </Text>
      </View>

      {/* Delete Icon */}
      <TouchableOpacity
        onPress={() => console.log("Delete pressed for:", item.id)} // yahan delete ka function lagao
        style={styles.deleteButton}
      >
        <Icon name="delete" size={24} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};


  return (
    <View style={styles.container}>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search chats"
        value={search}
        onChangeText={setSearch}
      />

      {/* Loading state */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="blue"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item._id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
              No chats found
            </Text>
          }
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchInput: {
    backgroundColor: "#f1f1f1",
    margin: 10,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  chatItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  avatarFallback: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  chatInfo: { flex: 1 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  name: { fontSize: 16, fontWeight: "600" },
  time: { fontSize: 12, color: "gray" },
  message: { fontSize: 14, color: "gray", marginTop: 4 },
});
