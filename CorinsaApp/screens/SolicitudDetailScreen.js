// screens/SolicitudDetailScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';

const SolicitudDetailScreen = () => {
  const route = useRoute();
  const { solicitud } = route.params;


  return (
    <View style={{ padding: 20 }}>
      <Text>Solicitud ID: {solicitud.id}</Text>
      <Text>Usuario ID: {solicitud.usuarioId}</Text>
      <Text>Fecha de Creación: {solicitud.fechaCreacion}</Text>
      <Text>Fecha de Respuesta: {solicitud.fechaRespuesta}</Text>
      <Text>Aprobada: {solicitud.aprobada ? 'Sí' : 'No'}</Text>
      <Text>Observaciones: {solicitud.observaciones}</Text>
    </View>
  );
};

export default SolicitudDetailScreen;
