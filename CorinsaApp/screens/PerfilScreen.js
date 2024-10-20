// screens/PerfilScreen.js
import React from 'react';
import { View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PerfilScreen = ({ setIsLoggedIn }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setIsLoggedIn(false); // Cambiar a la pantalla de Login
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Cerrar Sesión" onPress={handleLogout} color="red" />
    </View>
  );
};

export default PerfilScreen;
