import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axiosInstance from "../../../config/axios";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function MyFriendsScreen({ navigation }) {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFriends = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/friendRequest/my-friends");
            setFriends(res.data);
        } catch (err) {
            console.log("Error fetching friends:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchFriends();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (friends.length === 0) {
        return (
            <View style={styles.center}>
                <Text>No friends found</Text>
            </View>
        );
    }


const handleAddToChats = async (friend) => {
    try {
        const res = await axiosInstance.post(`/friendRequest/add-chat/${friend._id}`);
        
        // Alert me message show karwa do
        Alert.alert("Success", res.data.message);

        // Ab Chats tab me navigate kar sakte ho
        // navigation.navigate("Chats");
    } catch (err) {
        console.log("Error adding to chats:", err.response?.data || err.message);
        Alert.alert("Error", err.response?.data?.error || err.message);
    }
};



    const renderFriend = ({ item }) => (
        <View style={styles.friendCard}>
            {item.avatar ? (
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
            ) : (
                <View style={styles.placeholderAvatar}>
                    <Text style={styles.placeholderText}>
                        {item.username?.charAt(0).toUpperCase() || "?"}
                    </Text>
                </View>
            )}
            <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.username}</Text>
                <Text style={styles.email}>{item.email}</Text>
            </View>

            {/* Chat Icon */}
            <TouchableOpacity onPress={() => handleAddToChats(item)}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={friends}
                keyExtractor={(item) => item._id}
                renderItem={renderFriend}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    friendCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        marginBottom: 8,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    placeholderAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        backgroundColor: "#007AFF",
        alignItems: "center",
        justifyContent: "center",
    },
    placeholderText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
    },
    email: {
        fontSize: 14,
        color: "gray",
    },
});
