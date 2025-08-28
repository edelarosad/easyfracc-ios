import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, Image, Alert } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper'; 
import LinearGradient from 'react-native-linear-gradient';

import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { useSnackbar } from '../componentes/SnackbarContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

import globalStyles from '../styles/globalStyles'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//Imagenes
import logo from '../../assets/images/logoConinttec.png'; 
import logoEasy from '../../assets/brand/Variantes-03.png';

//Apollo
import { useMutation, gql } from '@apollo/client';

import { ACTUALIZAR_CONTRASENA } from '../graphql/mutations/seguridadMutations'; 

const ActualizarPassword = () => {
  const { height } = Dimensions.get('window');
  const displayGreen = ['#11505e', '#74a2af'];
  
  const gradientStyle = StyleSheet.flatten([
    styles.gradient,
    { height: height },
  ]);

  const [userId, setUserId] = useState(null); // Para almacenar el ID del usuario
  const [userEmail, setUserEmail] = useState(''); 
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevoPassword, setNuevoPassword] = useState('');
  const [confirmarNuevoPassword, setConfirmarNuevoPassword] = useState('');
  const navigation = useNavigation();

  const { showSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation();

  // Usa la mutación para actualizar la contraseña
  const [ actualizarPasswordMutation ] = useMutation(ACTUALIZAR_CONTRASENA);

  // Efecto para cargar el ID del usuario desde AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId'); 
        const storedUserEmail = await AsyncStorage.getItem('email'); // Cargar el email
        
        if (storedUserId && storedUserEmail) {
          setUserId(storedUserId);
          setUserEmail(storedUserEmail); // Establecer el email
        } else {
          showSnackbar('No se pudo obtener la información del usuario. Por favor, inicie sesión de nuevo.');
          navigation.navigate('Login'); 
        }
      } catch (error) {
        console.error('Error al cargar los datos de usuario desde AsyncStorage:', error);
        showSnackbar('Error al cargar datos de usuario.');
      }
    };
    loadUserData();
  }, []);

  const handleLogin = async () => {    
     navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
    //navigation.navigate('Login'); 
  };
  const handlePasswordUpdate = async () => {
    // Validar campos vacíos
    if ( nuevoPassword === '' || confirmarNuevoPassword === '') {
      showSnackbar('Todos los campos de contraseña son obligatorios.');
      return;
    }

    // Validar que las nuevas contraseñas coincidan
    if (nuevoPassword !== confirmarNuevoPassword) {
      showSnackbar('La nueva contraseña y la confirmación no coinciden.');
      return;
    }

    if (nuevoPassword.length < 6) { // Ejemplo de validación de longitud mínima
      showSnackbar('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (!userId) {
      showSnackbar('Error: ID de usuario no disponible.');
      return;
    }

    try {
      const { data } = await actualizarPasswordMutation({
        variables: {
          id: userId,
          passwordActual: passwordActual,
          nuevoPassword: nuevoPassword,
        },
      });

      // Manejar la respuesta de la mutación
      if (data.actualizarPassword.success) {
        showSnackbar(data.actualizarPassword.message || 'Contraseña actualizada exitosamente.');
        // Opcional: limpiar campos o navegar a otra pantalla
        setPasswordActual('');
        setNuevoPassword('');
        setConfirmarNuevoPassword('');
        // Podrías redirigir al usuario al login para que inicie sesión con la nueva contraseña
        Alert.alert(
          "Contraseña Actualizada",
          "Su contraseña ha sido cambiada exitosamente. Por favor, inicie sesión de nuevo.",
          [
            { text: "OK", onPress: () => navigation.navigate('Login') }
          ]
        );
      } else {
        // Si el backend devuelve success: false pero no lanza un error
        showSnackbar(data.actualizarPassword.message || 'No se pudo actualizar la contraseña.');
      }
    } catch (error) {
      // Manejar errores de Apollo/GraphQL (ej. errores de red, errores lanzados por el resolver)
      showSnackbar(error.message);
      console.error('Error al actualizar la contraseña:', error.message);
    }
  };


  return (
    <View style={styles.container}>
      <LinearGradient
        colors={displayGreen}
        style={gradientStyle}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      >                
        <View style={[styles.container, globalStyles.contenedor]}>
          <View style={styles.logoContainer}>
            <Image style={[globalStyles.titulo, styles.logo]} source={logoEasy} />
          </View>

          <Text style={globalStyles.titulo}>{t('ChangePassword')}</Text>

           <View style={styles.emailContainer}>
            <Text style={styles.emailLabel}>{t('user')}</Text>
            <Text style={styles.emailText}>{userEmail}</Text>
          </View>

          <TextInput
            label={t('nuevoPassword')} // Nueva traducción para "Nueva Contraseña"
            secureTextEntry
            value={nuevoPassword}
            onChangeText={setNuevoPassword}
            style={[globalStyles.input, { backgroundColor: '#f1f1f1' }]}
          />

          <TextInput
            label={t('confirmarNuevoPassword')} // Nueva traducción para "Confirmar Nueva Contraseña"
            secureTextEntry
            value={confirmarNuevoPassword}
            onChangeText={setConfirmarNuevoPassword}
            style={[globalStyles.input, { backgroundColor: '#f1f1f1' }]}
          />

          <Button mode="contained" 
            onPress={handlePasswordUpdate} 
            style={globalStyles.boton}>
            <Text style={globalStyles.botonTexto}>{t('ChangePassword')}</Text> 
          </Button>
          
          <Button mode="contained" 
            onPress={handleLogin} 
            style={globalStyles.boton}>
            <Text style={globalStyles.botonTexto}>{t('login')}</Text> 
          </Button>
        </View> 
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 80,
    resizeMode: 'contain',
  },
    emailContainer: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 30, // ¡Aumentado el margen inferior para más espacio!
    borderRadius: 4,
    backgroundColor: '#eeeee4',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center', 
    justifyContent: 'center', 
  },
    emailLabel: {
    fontSize: 14, // Un poco más grande para la etiqueta
    color: '#555',
    marginBottom: 4,
    textAlign: 'center', // Asegura que la etiqueta también esté centrada
  },
  emailText: {
    fontSize: 20, // ¡Más grande!
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center', // Centra el texto del email
  },
});

export default ActualizarPassword;