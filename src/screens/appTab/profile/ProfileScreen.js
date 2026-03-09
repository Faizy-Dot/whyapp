import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

export default function ProfileScreen() {
  const [username, setUsername] = useState('John Doe');
  const [email] = useState('john@example.com'); // read-only
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSave = () => {
    // later: call API for updating username/password
    console.log('Updated:', { username, oldPassword, newPassword });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Image */}
      <Image
        source={{
          uri: 'https://randomuser.me/api/portraits/men/10.jpg',
        }}
        style={styles.avatar}
      />

      {/* Email (read-only) */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={email}
        editable={false}
      />

      {/* Username (editable) */}
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      {/* Change Password */}
      <Text style={styles.label}>Old Password</Text>
      <TextInput
        style={styles.input}
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  label: {
    alignSelf: 'flex-start',
    marginTop: 15,
    marginBottom: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  disabledInput: {
    backgroundColor: '#eee',
    color: '#666',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 30,
    width: '100%',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
