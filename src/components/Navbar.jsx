// src/components/CustomHeader.js
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function Navbar({ title, user, showBack = false }) {
  const navigation = useNavigation();
const canGoBack = navigation.canGoBack();
  return (
    <View style={styles.header}>

       {(showBack || canGoBack) && (
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Avatar + Username */}
      <TouchableOpacity onPress={() => navigation.openDrawer()}
 style={styles.userInfo}>
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarText}>
              {user?.username?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.username}>{user?.username || title}</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
 
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft : 10
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  avatarFallback: {
    backgroundColor: "#555",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  title :{
     fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});
