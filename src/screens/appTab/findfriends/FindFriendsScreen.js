import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import axiosInstance from '../../../config/axios';
import { useSelector } from 'react-redux';


export default function FindFriendsScreen() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([])

  const { user, token } = useSelector(state => state.login)

  const allUsers = async () => {
    try {
      const response = await axiosInstance.get("/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("Users =>", response.data.users);
      setUsers(response.data.users)
    } catch (error) {
      console.log("Error fetching users:", error.response?.data || error);
    }
  }

  useEffect(() => {
    allUsers()
  }, [])

  const sendFriendRequest = async (receiverId) => {
    try {
      const response = await axiosInstance.post(
        `/friendRequest/send/${receiverId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("sent request==>>" , response)
      return response.data; // { message: "Friend request sent" }
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Failed to send request");
      }
      throw new Error("Network error");
    }
  };



  const renderFriendItem = ({ item }) => (
    <View style={styles.friendItem} >
      <View style={{ flexDirection: "row", alignItems: "center" }}>

        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.username?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text>{item.username}</Text>
      </View>
      <TouchableOpacity
        style={[styles.addButton, item.isFriend && styles.addedButton]}
        onPress={() => sendFriendRequest(item._id)}
      >
        <Text style={styles.addButtonText}>
          {item.isFriend ? 'Added' : 'Add Friend'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search friends"
        value={search}
        onChangeText={setSearch}
      />

      {/* Friends List */}
      <FlatList
        data={users.filter(u =>
          u.username.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={item => item._id} // make sure id is string
        renderItem={renderFriendItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ fontSize: 16, color: 'gray' }}>No users found 😕</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchInput: {
    backgroundColor: '#f1f1f1',
    margin: 10,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  listContainer: { paddingHorizontal: 10 },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    paddingBottom: 10
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4a90e2', // fallback color
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#4a90e2',
  },
  addedButton: {
    backgroundColor: '#aaa',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
