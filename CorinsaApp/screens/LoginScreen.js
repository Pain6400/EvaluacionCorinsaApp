// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, ActivityIndicator } from 'react-native-paper';
import axiosInstance from '../api/axiosInstance'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation, setIsLoggedIn }) => { // recibir setIsLoggedIn
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('Auth/Login', {
        email,
        password,
        totpCode,
      });
      const { token } = response.data;
      await AsyncStorage.setItem('token', token);
      setLoading(false);
      setIsLoggedIn(true); // Cambiar el estado de autenticación
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Credenciales inválidas o error en el servidor.');
      console.error('Detalles del Error:', error);
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
      <Button
        mode="contained"
        onPress={handleLogin}
        disabled={loading}
        style={styles.button}
      >
        {loading ? 'Cargando...' : 'Login'}
      </Button>
      {loading && <ActivityIndicator animating={true} size="small" style={styles.loading} />}
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
  button: {
    marginTop: 10,
  },
  loading: {
    marginTop: 10,
  },
});

export default LoginScreen;
