// screens/CreateSolicitudScreen.js
import React, { useState, useCallback } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { insertSolicitud } from '../database/database'; // Asegúrate de que la ruta sea correcta
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateSolicitudScreen = ({ navigation }) => {
  const [observaciones, setObservaciones] = useState('');

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No se encontró el token');
        return;
      }

      const nuevaSolicitud = {
        id: Date.now(), 
        usuarioId: "",
        fechaCreacion: new Date().toISOString(),
        fechaRespuesta: null,
        aprobada: 0, // Inicialmente no aprobada
        zonaId: 0,
        tipoSolicitudId: 0,
        observaciones,
      };
      await insertSolicitud(nuevaSolicitud);
      navigation.goBack(); 
    } catch (error) {
      console.error('Error al insertar la solicitud:', error);
    }
  };



  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Observaciones"
        value={observaciones}
        onChangeText={setObservaciones}
        style={styles.input}
      />
      <Button title="Crear Solicitud" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default CreateSolicitudScreen;
