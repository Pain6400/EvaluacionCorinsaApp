// api/solicitudes.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { insertSolicitud, addPendingOperation } from '../database/database';
import { Alert } from 'react-native';

// Configura tu instancia de axios
const axiosInstance = axios.create({
  baseURL: 'https://tu-api.com/api/', // Reemplaza con la URL de tu API
});

export const updateSolicitud = async (solicitud) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No estás autenticado.');
      return;
    }

    // Intentar actualizar en la API
    await axiosInstance.put(`Solicitudes/${solicitud.id}`, solicitud, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Actualizar localmente
    await insertSolicitud(solicitud);
  } catch (error) {
    if (!error.response) {
      // Error de red, guardar operación pendiente
      await addPendingOperation('UPDATE_SOLICITUD', solicitud);
      // Actualizar localmente
      await insertSolicitud(solicitud);
      Alert.alert('Offline', 'La solicitud se guardó localmente y se sincronizará cuando haya conexión.');
    } else {
      // Manejar otros errores
      Alert.alert('Error', 'No se pudo actualizar la solicitud.');
      console.error('Error en updateSolicitud:', error);
    }
  }
};
