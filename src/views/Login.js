import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions,Text, Image } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper'; 
import LinearGradient from 'react-native-linear-gradient';

import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';


import { useSnackbar } from '../componentes/SnackbarContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage';


import  globalStyles from '../styles/globalStyles'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//Imagenes
import logo from '../../assets/images/logoConinttec.png'; 
import logoEasy  from '../../assets/brand/Variantes-03.png';

//Apollo
import { useMutation } from '@apollo/client'
import { AUTENTICAR_USUARIO } from '../graphql/mutations/seguridadMutations'; 


const Login = () => {
  const { height } = Dimensions.get('window');
  const displayGreen = ['#11505e', '#74a2af'];
  
    const gradientStyle = StyleSheet.flatten([
      styles.gradient,
      { height: height },
    ]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const { showSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation();

  const [ autenticarUsuario ] = useMutation(AUTENTICAR_USUARIO);

  const obtenemosEmailStorage = async () => {
    try {
      const emailStorage = await AsyncStorage.getItem("email");
      const passStorage = await AsyncStorage.getItem("password");
      if (emailStorage !== null) {
        //console.log('Email recuperado de AsyncStorage:', emailStorage);
        setEmail(emailStorage);
        setPassword(passStorage);
      } else {
        console.log('No se encontró email en AsyncStorage');
      }
    } catch (error) {
      console.error('Error al recuperar el valor:', error);
    }
  };

  useEffect(() => {
    obtenemosEmailStorage();
  }, []);

  const handleLogin = async () => {
    console.log('Email:', email);
    console.log('Password:', password);
    
    if(email === '' || password === ''){
      //Mostrar un error
      showSnackbar('Todos los campos son obligatorios');
      return;
    }
    
    //Autenticar el usuario
     try {
       const { data } = await autenticarUsuario({
        variables:{
          input:{            
            email,
            password
          }
        }
      });

       console.log('Ya pasamos la mutación');
      //const { token } = data.autenticarUsuario;
      const { token, usuario } = data.autenticarUsuario;
      const { roles = [], noTarjeta, lote, nombre, habilitado, idZkteco, id } = usuario;
      

      await AsyncStorage.setItem('token', token)
      await AsyncStorage.setItem('email',email)
      await AsyncStorage.setItem('nombre',nombre)
      await AsyncStorage.setItem('password',password)
      await AsyncStorage.setItem('userRoles', JSON.stringify(roles));
      await AsyncStorage.setItem('noTarjeta',noTarjeta) 
      await AsyncStorage.setItem('lote',lote) 
      await AsyncStorage.setItem('habilitado',habilitado.toString()); // Guardar como string 'true'/'false'
      await AsyncStorage.setItem('idZkteco',idZkteco) 
      await AsyncStorage.setItem('userId', id); // Guardar el ID del usuario
      console.log('Authenticated User Data:', {  roles, noTarjeta, habilitado, idZkteco });
      
      if (password === '1111') {
        navigation.navigate('CambioContraseña'); // Navegar a la pantalla de cambio de contraseña 
        return;
      }
      //showSnackbar(data.token);
      console.log(data);
      console.log(token);  

    if (roles.includes('admin')) {
        navigation.navigate('Home');
      } else if (roles.includes('residente')) {
        navigation.navigate('Home');
      } else if (roles.includes('soporte')) {
        navigation.navigate('Home'); 
      } else {
        showSnackbar('No tienes permisos para acceder a esta aplicación');
        return;
      }


     } catch (error) {
      showSnackbar(error.message); //Aqui se le puede hacer un replace para cambiar el idioma desde el server      
      console.log(error.message);
    }
 
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en'; // Cambiar entre inglés y español
    i18n.changeLanguage(newLang);
  };

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={displayGreen}
          style={gradientStyle}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        >
           
            <View style={globalStyles.iconContainer}>
                <IconButton
                icon={() => <Icon name="earth" size={30} color={'white'} />}
                size={30} // Tamaño del ícono
                onPress={toggleLanguage}
                style={globalStyles.icon} // Agregamos estilo para posicionarlo
                />
                <Text style={globalStyles.languageText}>{i18n.language === 'en' ? 'English' : 'Español'}</Text>  
            </View> 
           

            <View style={[styles.container, globalStyles.contenedor]}>
            
            <View style={styles.logoContainer}>
              <Image  style={[globalStyles.titulo,styles.logo]} source={logoEasy}  />
            </View>

            {/* <Text style={globalStyles.titulo}>{t('welcome')}</Text> 
            <Text style={globalStyles.titulo}>{t('nameApp')}</Text>*/}
            
            {/*
            <View style={styles.logoContainer}>
              <Image  style={[globalStyles.titulo,styles.logo]} source={logo}  />
            </View>*/}
                
            <TextInput
                label={t('email')}
                value={email}
                onChangeText={setEmail}
                style={[globalStyles.input, { backgroundColor: '#f1f1f1' }]} // Fondo gris claro
            />

            <TextInput
                label={t('password')}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={[globalStyles.input, { backgroundColor: '#f1f1f1' }]} // Fondo gris claro
            />

            <Button mode="contained" 
            onPress={handleLogin} 
            style={globalStyles.boton}>
                <Text style={globalStyles.botonTexto}>{t('loginButton')}</Text>        
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
      alignItems: 'center', // Centra horizontalmente la imagen dentro de este contenedor
      marginBottom: 20, // Espacio debajo del logo
    },
    logo: {
      width: 250,//200,
      height: 80,//52,
      resizeMode: 'contain',
    },
  });
  

export default Login
