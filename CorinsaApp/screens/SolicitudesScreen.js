import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { List, Snackbar, FAB } from 'react-native-paper';
import { getSolicitudes } from '../database/database'; 
import { useFocusEffect } from '@react-navigation/native';

const SolicitudesScreen = ({ navigation }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const fetchSolicitudes = async () => {
    try {
      const fetchedSolicitudes = await getSolicitudes();
      setSolicitudes(fetchedSolicitudes);
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
      setSnackbarVisible(true); // Mostrar Snackbar en caso de error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSolicitudes();
    }, [])
  );

  const handleCreateSolicitud = () => {
    navigation.navigate('CreateSolicitud')
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <List.Section>
          {solicitudes.length === 0 ? (
            <List.Item title="No hay solicitudes disponibles" />
          ) : (
            solicitudes.map((solicitud) => (
              <List.Item
                key={solicitud.id}
                title={`Solicitud ID: ${solicitud.id}`}
                description={`Descripcion: ${solicitud.observaciones},           Fecha: ${solicitud.fechaCreacion}`}
                left={props => <List.Icon {...props} icon={solicitud.aprobada ? "check-circle" : "close-circle"} />}
                onPress={() => navigation.navigate('SolicitudDetail', { solicitud })}
              />
            ))
          )}
        </List.Section>
      )}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        Hubo un problema al cargar las solicitudes.
      </Snackbar>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleCreateSolicitud}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default SolicitudesScreen;
