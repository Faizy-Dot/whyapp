import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../redux/actions/loginAction';
import axiosInstance from '../../../config/axios';
import Toast from 'react-native-toast-message';
import AntDesign from "react-native-vector-icons/AntDesign";
import { ActivityIndicator } from 'react-native-paper';


export default function LoginScreen() {
  const navigation = useNavigation();

  // 👇 Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassowrd, setShowPassword] = useState(false)
  const dispatch = useDispatch();

  const { user, loading } = useSelector(state => state.login);

  // 👇 API Call for Login

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter email and password',
      });
      return;
    }

    try {

      const response = await dispatch(loginUser(email, password));
      console.log("response==>>", response);

      if (response?.status === 200) {
        Toast.show({
          type: 'success',
          text1: response.data.message,
          text2: 'Welcome back 👋',
        });
      }

      if (response?.status === 400) {
        Toast.show({
          type: 'error',
          text1: response.data.message,
          text2: 'Something went wrong',
        });
      }

      if (response?.status === undefined && response?.data === undefined) {
        Toast.show({
          type: 'error',
          text1: "Network Problem Plz Try Again",
          text2: 'Something went wrong',
        });
      }


    } catch (err) {
      console.log("Err", err);

      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'Something went wrong',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color="#555" />
        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#555" />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry={!showPassowrd}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
          <Icon
            name={showPassowrd ? 'visibility' : 'visibility-off'}
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity
        onPress={handleLogin}
        style={[styles.button, loading && { opacity: 0.8 }]}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <View style={{display:"flex" , flexDirection : "row" , justifyContent:"center" , gap:15}}>
          <ActivityIndicator size="small" color="#fff" />
           <Text style={styles.buttonText}>Sign In...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>


      {/* Register Link */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}
