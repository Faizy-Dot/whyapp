import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function CustomDrawer({ navigation }) {

  const navigateTab = (screen) => {
    navigation.navigate("HomeTabs", { screen });
    navigation.closeDrawer();
  };

  return (
    <View style={styles.container}>

        <Image source={require("../assets/bg-remove.png")}  style={{ width: 60, height: 60 }}/>

      <TouchableOpacity onPress={() => navigateTab("Chats")}>
        <Text style={styles.item}>Chats</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigateTab("Find Friends")}>
        <Text style={styles.item}>Find Friends</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigateTab("Requests")}>
        <Text style={styles.item}>Requests</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigateTab("My Friends")}>
        <Text style={styles.item}>My Friends</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigateTab("Profile")}>
        <Text style={styles.item}>Profile</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingLeft: 20,
    backgroundColor:"#fffced"
  },
  item: {
    fontSize: 18,
    marginBottom: 20,
  },
  logout: {
    fontSize: 18,
    color: "red",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
});
