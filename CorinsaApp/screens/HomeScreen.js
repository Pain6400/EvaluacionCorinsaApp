// screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSolicitudes, insertSolicitud } from '../database/database.js';
import { syncData } from '../controller/sync.Controller';
import { updateSolicitud } from '../controller/solicitudes.Controller';

const HomeScreen = ({ navigation }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchLocalSolicitudes = async () => {
    try {
      const localSolicitudes = await getSolicitudes();
      setSolicitudes(localSolicitudes);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las solicitudes locales.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    await syncData();
    await fetchLocalSolicitudes();
    setSyncing(false);
    Alert.alert('Sincronización', 'Sincronización completada.');
  };

  useEffect(() => {
    fetchLocalSolicitudes();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  const handleUpdateSolicitud = async (solicitud) => {
    // Modificar la solicitud según sea necesario. Aquí simplemente invertimos el estado de aprobación.
    const updatedSolicitud = { ...solicitud, aprobada: !solicitud.aprobada };
    await updateSolicitud(updatedSolicitud);
    fetchLocalSolicitudes();
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button mode="outlined" onPress={handleLogout} style={styles.logout}>
        Cerrar Sesión
      </Button>
      <Button mode="contained" onPress={handleSync} loading={syncing} style={styles.sync}>
        Sincronizar
      </Button>
      <FlatList
        data={solicitudes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Número: {item.id}</Text>
            <Text>Estado: {item.aprobada ? 'Aprobada' : 'No Aprobada'}</Text>
            <Text>Creada: {new Date(item.fechaCreacion).toLocaleString()}</Text>
            {item.fechaRespuesta && (
              <Text>Respondida: {new Date(item.fechaRespuesta).toLocaleString()}</Text>
            )}
            <Button mode="outlined" onPress={() => handleUpdateSolicitud(item)}>
              {item.aprobada ? 'Desaprobar' : 'Aprobar'}
            </Button>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  logout: {
    marginBottom: 10,
  },
  sync: {
    marginBottom: 10,
  },
  item: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f6f6f6',
    borderRadius: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default HomeScreen;
