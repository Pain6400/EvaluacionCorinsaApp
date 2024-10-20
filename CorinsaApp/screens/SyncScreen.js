import React, { useState } from 'react';
import { Button, ActivityIndicator, Text, View, StyleSheet, Alert } from 'react-native';
import axiosInstance from '../api/axiosInstance'; 
import { insertSolicitud, removeSolicitudes, getSolicitudes } from '../database/database';  // Asegúrate de que la ruta sea correcta

const SyncScreen = () => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleDownload  = async () => {
    setIsSyncing(true);

    try {
      // Realizar la petición para obtener los datos desde el servidor
      const response = await axiosInstance.get('Sync/DownloadData');

      if (response.status === 200) {
        const solicitudes = response.data;
``
        await removeSolicitudes();
        
        // Insertar cada solicitud en SQLite
        for (let solicitud of solicitudes) {
          await insertSolicitud(solicitud);
        }

        Alert.alert('Sincronización completada', 'Los datos se han sincronizado correctamente.');
      } else {
        Alert.alert('Error de sincronización', 'No se pudieron obtener los datos del servidor.');
      }
    } catch (error) {
      console.error('Error en la sincronización:', error);
      Alert.alert('Error de sincronización', 'Hubo un problema al sincronizar los datos.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpload = async () => {
    try {
      setIsSyncing(true); // Muestra el indicador de sincronización
  
      const solicitudes = await getSolicitudes(); // Obtener solicitudes de SQLite
  
      if (solicitudes.length === 0) {
        alert('No hay solicitudes para subir.');
        setIsSyncing(false);
        return;
      }
  
      // Enviar las solicitudes al servidor
      const response = await axiosInstance.post('Sync/UploadData', solicitudes);
  
      if (response.status === 200) {
        console.log('Datos subidos exitosamente', response.data);
  
        // Si la subida es exitosa, eliminar solicitudes de SQLite
        await removeSolicitudes(); 
        alert('Solicitudes subidas y eliminadas correctamente de la base de datos local.');
      } else {
        console.error('Error al subir los datos', response.data);
        alert('Error al subir los datos. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al subir los datos.');
    } finally {
      setIsSyncing(false); // Detiene el indicador de sincronización
    }
  };
  

  return (
    <View style={styles.container}>
    {isSyncing ? (
      <ActivityIndicator size="large" color="#6200ee" />
    ) : (
      <>
        <Text style={styles.text}>Sincroniza tus datos:</Text>
        <View style={styles.buttonContainer}>
          <Button title="Descarga" onPress={handleDownload} color="#6200ee" />
          <View style={styles.spacer} />
          <Button title="Subida" onPress={handleUpload} color="#6200ee" />
        </View>
      </>
    )}
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  spacer: {
    height: 20, // Espacio entre los botones
  },
});
export default SyncScreen;
