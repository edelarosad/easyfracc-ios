import { DefaultTheme } from 'react-native-paper';

// Crear un tema personalizado
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3',  // Cambiar el color primario a azul
    accent: '#03A9F4',   // Cambiar el color de acento
    background: '#f1f1f1', // Fondo gris claro
    surface: '#ffffff',  // Color de la superficie
  },
};

export default theme;
