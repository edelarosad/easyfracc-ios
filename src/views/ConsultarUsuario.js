import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Text, Image, Alert, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper'; 
import LinearGradient from 'react-native-linear-gradient';

import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { useSnackbar } from '../componentes/SnackbarContext'; 

// Importa los estilos globales de tu proyecto
import globalStyles from '../styles/globalStyles'; 

// Importa las imágenes
import logoEasy from '../../assets/brand/Variantes-03.png';

// El componente de la nueva pantalla para crear un usuario
const CrearUsuario = () => {
  const { height } = Dimensions.get('window');
  const displayGreen = ['#11505e', '#74a2af'];
  
  const gradientStyle = StyleSheet.flatten([
    styles.gradient,
    { height: height },
  ]);

  // Definimos los estados para cada campo del formulario
  const [pin, setPin] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [cardNo, setCardNo] = useState('');

  const navigation = useNavigation();
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  // URL de la API para agregar personas
  const apiUrl = 'https://rancheria.easyfraccclient.com/api/v2/person/addPersons?access_token=FA98860583FD0A054CC5820727350E42';

  // Función para manejar la creación del usuario
  const handleCreateUser = async () => {
    // Validación básica de campos vacíos
    if (!pin || !deptCode || !name || !lastName || !gender || !cardNo) {
      showSnackbar('Por favor, complete todos los campos obligatorios.');
      return;
    }

    // Creación del objeto de datos para enviar en el cuerpo de la solicitud
    const userData = [{
      "pin": pin,
      "deptCode": deptCode,
      "name": name,
      "lastName": lastName,
      "gender": gender,
      "cardNo": cardNo,
      "accLevelIds": "402881de9847772801984d75dc2d03ae", // Valor fijo según tu ejemplo
      "accStartTime": "2025-08-04 15:45:00", // Valor fijo para simplificar
      "accEndTime": "2025-08-04 23:59:59" // Valor fijo para simplificar
    }];

    try {
      // Hacemos la llamada a la API usando fetch()
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), // Convertimos los datos a JSON string
      });

      // Verificamos si la respuesta de la red es exitosa (código 200)
      if (!response.ok) {
        throw new Error(`Error de red: ${response.statusText}`);
      }

      const result = await response.json();

      // Manejamos la respuesta de la API
      if (result.code === 0) {
        Alert.alert(
          "Usuario Creado",
          "El usuario ha sido registrado exitosamente.",
          [{ text: "OK", onPress: () => {
              // Navegar a la pantalla de listado o a otra
              navigation.goBack(); 
          }}]
        );
      } else {
        showSnackbar(result.message || 'Error al crear el usuario.');
      }
    } catch (error) {
      showSnackbar('Error de conexión. Intente de nuevo.');
      console.error('Error al crear el usuario:', error.message);
    }
  };

  // Función para volver a la pantalla anterior
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={displayGreen}
        style={gradientStyle}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.logoContainer}>
            <Image style={[globalStyles.titulo, styles.logo]} source={logoEasy} />
          </View>

          <Text style={globalStyles.titulo}>Crear Nuevo Usuario</Text>

          {/* Campos de texto para la información del usuario */}
          <View style={styles.formContainer}>
            {/* Agrupamos PIN y Código de Departamento en una fila */}
            <View style={styles.row}>
              <TextInput
                label="PIN"
                value={pin}
                onChangeText={setPin}
                style={[styles.inputRow, { backgroundColor: '#f1f1f1' }]}
                keyboardType="numeric"
              />
              <TextInput
                label="Código de Departamento"
                value={deptCode}
                onChangeText={setDeptCode}
                style={[styles.inputRow, { backgroundColor: '#f1f1f1' }]}
              />
            </View>

            {/* Agrupamos Nombre y Apellido en una fila */}
            <View style={styles.row}>
              <TextInput
                label="Nombre"
                value={name}
                onChangeText={setName}
                style={[styles.inputRow, { backgroundColor: '#f1f1f1' }]}
              />
              <TextInput
                label="Apellido"
                value={lastName}
                onChangeText={setLastName}
                style={[styles.inputRow, { backgroundColor: '#f1f1f1' }]}
              />
            </View>

            <TextInput
              label="Género (M/F)"
              value={gender}
              onChangeText={setGender}
              style={[globalStyles.input, { backgroundColor: '#f1f1f1' }]}
              maxLength={1}
              autoCapitalize="characters"
            />
            <TextInput
              label="Número de Tarjeta"
              value={cardNo}
              onChangeText={setCardNo}
              style={[globalStyles.input, { backgroundColor: '#f1f1f1' }]}
            />
          </View>

          {/* Botones de acción */}
          <Button
            mode="contained" 
            onPress={handleCreateUser} 
            style={globalStyles.boton}>
            <Text style={globalStyles.botonTexto}>Crear Usuario</Text> 
          </Button>

          <Button
            mode="outlined" 
            onPress={handleGoBack} 
            style={[globalStyles.boton, styles.backButton]}>
            <Text style={styles.backButtonText}>Cancelar</Text> 
          </Button>
        </ScrollView> 
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
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
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputRow: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#f1f1f1',
  },
  backButton: {
    marginTop: 10,
    backgroundColor: 'transparent',
    borderColor: '#FFF',
    borderWidth: 1,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default CrearUsuario;
