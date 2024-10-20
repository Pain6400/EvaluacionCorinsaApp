import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import SolicitudesScreen from '../screens/SolicitudesScreen';
import ReporteScreen from '../screens/ReporteScreen';
import PerfilScreen from '../screens/PerfilScreen';
import SyncScreen from '../screens/SyncScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = ({ setIsLoggedIn }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Solicitudes') {
            iconName = 'list-outline';
          } else if (route.name === 'Reporte') {
            iconName = 'bar-chart-outline';
          } else if (route.name === 'Perfil') {
            iconName = 'person-outline';
          } else if (route.name === 'sync') {
            iconName = 'sync-circle-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Solicitudes" component={SolicitudesScreen} />
      <Tab.Screen name="Reporte" component={ReporteScreen} />
      <Tab.Screen name="sync" component={SyncScreen} />
      <Tab.Screen name="Perfil">
        {props => <PerfilScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabNavigator;
