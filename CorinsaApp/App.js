// App.js
import React, { useEffect } from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import MainNavigator from './navigation/MainNavigator';
import { initDB } from './database/database'; // Asegúrate de que la ruta es correcta

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
  },
};

export default function App() {
  useEffect(() => {
    if (initDB) {
      initDB()
        .then(() => {
          console.log('Base de datos inicializada');
        })
        .catch(err => {
          console.log('Error al inicializar la base de datos:', err);
        });
    } else {
      console.log('initDB es undefined');
    }
  }, []);

  return (
    <PaperProvider theme={theme}>
      <MainNavigator />
    </PaperProvider>
  );
}
