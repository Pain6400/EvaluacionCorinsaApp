// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import axiosInstance from '../api/axiosInstance'; // Importa tu instancia de axios
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState(''); // Nuevo estado para el código TOTP

  const handleLogin = async () => {
    try {
      // Primero intenta hacer el login
      const response = await axiosInstance.post('Auth/Login', {
        email,
        password,
        totpCode
      });

      const { token } = response.data;
      await AsyncStorage.setItem('token', token);
      navigation.replace('Home');

    } catch (error) {
      Alert.alert('Error', 'Credenciales inválidas.');
      console.error(error);
    }
  };


  return (
    <View style={styles.container}>
      <Title>Iniciar Sesión</Title>
      <TextInput
        label="Correo Electrónico"
        value={email}
        onChangeText={text => setEmail(text)}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />
        <TextInput
          label="Código TOTP"
          value={totpCode}
          onChangeText={text => setTotpCode(text)}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button mode="contained" onPress={handleLogin}>
          Login
        </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 10,
  },
});

export default LoginScreen;
