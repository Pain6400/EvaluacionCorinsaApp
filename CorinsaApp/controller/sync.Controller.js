// sync.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSolicitudes, insertSolicitud, getPendingOperations, removePendingOperation } from '../database/database';
import { Alert } from 'react-native';

// Configura tu instancia de axios
const axiosInstance = axios.create({
  baseURL: 'https://tu-api.com/api/', // Reemplaza con la URL de tu API
});

// Función para descargar datos de la API y almacenarlos localmente
export const syncData = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No estás autenticado.');
      return;
    }

    // Descargar solicitudes desde la API
    const response = await axiosInstance.get('Solicitudes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const solicitudes = response.data;

    // Almacenar cada solicitud en SQLite
    for (const solicitud of solicitudes) {
      await insertSolicitud(solicitud);
    }

    // Opcional: Manejar otras entidades

    // Subir operaciones pendientes
    await uploadPendingOperations(token);

    Alert.alert('Sincronización', 'Sincronización completada exitosamente.');
  } catch (error) {
    Alert.alert('Error', 'Ocurrió un error durante la sincronización.');
    console.error('Error en syncData:', error);
  }
};

// Función para subir operaciones pendientes
const uploadPendingOperations = async (token) => {
  try {
    const operations = await getPendingOperations();

    for (const operation of operations) {
      const { id, type, data } = operation;
      const solicitud = JSON.parse(data);

      if (type === 'UPDATE_SOLICITUD') {
        // Reemplaza con la ruta correcta de tu API
        await axiosInstance.put(`Solicitudes/${solicitud.id}`, solicitud, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Reemplaza con otros tipos de operaciones si las hay

      // Eliminar la operación de la cola
      await removePendingOperation(id);
    }
  } catch (error) {
    Alert.alert('Error', 'Ocurrió un error al subir operaciones pendientes.');
    console.error('Error en uploadPendingOperations:', error);
  }
};
