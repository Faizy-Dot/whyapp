import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
import styles from './styles';
import Metrix from '../../../config/Metrix';
import axiosInstance from '../../../config/axios';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState(null); // 👈 image state

  // Pick image from gallery
  const pickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const source = response.assets[0]; // first selected image
        setAvatar(source); // 👈 update state
      }
    });
  };

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      return Alert.alert('All fields are required');
    }

    if (!email.endsWith('@whyapp.com')) {
      return Alert.alert('Email must be a @whyapp.com address');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Passwords do not match');
    }

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);

      if (avatar) {
        formData.append('avatar', {
          uri: avatar.uri,
          type: avatar.type || 'image/jpeg',
          name: avatar.fileName || 'avatar.jpg',
        });
      }

      const response = await axiosInstance.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        Alert.alert('Registration Successful', `Welcome ${username}!`);
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.log('Registration error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {/* 🔹 Avatar Picker UI */}
      <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center', marginBottom: 20 }}>
        {avatar ? (
          <Image
            source={{ uri: avatar.uri }}
            style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#ccc' }}
          />
        ) : (
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#ddd',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#aaa',
            }}
          >
            <Icon name="camera-plus" size={40} color="#555" />
            <Text style={{ fontSize: 12 }}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Name */}
      <View style={styles.inputContainer}>
        <Icon name="account" size={Metrix.FontLarge} color="#aaa" />
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Icon name="email" size={Metrix.FontLarge} color="#aaa" />
        <TextInput
          placeholder="Email (@whyapp.com)"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={Metrix.FontLarge} color="#aaa" />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
          <Icon name={showPassword ? 'eye' : 'eye-off'} size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View style={styles.inputContainer}>
        <Icon name="lock-check" size={Metrix.FontLarge} color="#aaa" />
        <TextInput
          placeholder="Confirm Password"
          style={styles.input}
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(prev => !prev)}>
          <Icon name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.registerText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
