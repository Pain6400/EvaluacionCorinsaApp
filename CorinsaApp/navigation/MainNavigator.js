import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../screens/LoginScreen';
import SolicitudDetailScreen from '../screens/SolicitudDetailScreen';
import CreateSolicitudScreen from '../screens/CreateSolicitudScreen';
import TabNavigator from './TabNavigator'; // Importamos el TabNavigator

const Stack = createStackNavigator();

export default function MainNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verificar si el usuario está autenticado al iniciar la app
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Solicitudes" options={{ headerShown: false }}>
              {(props) => (
                <TabNavigator {...props} setIsLoggedIn={setIsLoggedIn} />
              )}
            </Stack.Screen>
            <Stack.Screen name="SolicitudDetail" component={SolicitudDetailScreen} />
            <Stack.Screen name="CreateSolicitud" component={CreateSolicitudScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => (
              <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
