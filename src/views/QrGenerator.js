import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, Image, Dimensions } from 'react-native';
import { Button, IconButton  } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import RNFS from 'react-native-fs'; // Importación original, aunque no se usa en la lógica de compartir directamente
import LinearGradient from 'react-native-linear-gradient'; // Importación original, aunque no se usa
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Asegúrate de tener este import si usas el icono de llave
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation


//Trnaslate
import { useTranslation } from 'react-i18next';

import globalStyles from '../styles/globalStyles';
import { ScrollView } from 'react-native-gesture-handler';

const QrGenerator = () => {

  console.log("****** Generador de QR *******");
  const { t, i18n } = useTranslation();
  const displayGreen = ['#11505e', '#74a2af']; // Variable original, no usada en este snippet
  const [noTarjeta, setNoTarjeta] = useState(null);
  const [lote, setLote] = useState(null);
  const [storedEmail, setStoredEmail] = useState(null);
  const [storedNombre, setStoredNombre] = useState(null);
  const [storedHabilitado, setStoredHabilitado] = useState(null); // Ahora almacenará un booleano
  const [storedIdZkteco, setstoredIdZkteco] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const qrRef = useRef();
  const navigation = useNavigation(); 


  useEffect(() => {
    const getQrData = async () => {
      try {
        const storedNoTarjeta = await AsyncStorage.getItem('noTarjeta');
        const storedLote = await AsyncStorage.getItem('lote');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedNombre = await AsyncStorage.getItem('nombre');
        const storedHabilitadoRaw = await AsyncStorage.getItem('habilitado'); // Leer el valor crudo como string
        const storedIdZkteco = await AsyncStorage.getItem('idZkteco');

        if (storedNoTarjeta !== null) {
          setNoTarjeta(storedNoTarjeta);
        } else {
          setError('Número de tarjeta no encontrado. Por favor, inicia sesión de nuevo.');
        }
        if (storedIdZkteco !== null) {
          setstoredIdZkteco(storedIdZkteco);
        } else {
          setError('Número de tarjeta no encontrado. Por favor, inicia sesión de nuevo.');
        }

        if (storedLote !== null) {
          setLote(storedLote);
        } else {
          console.warn('Lote no encontrado en AsyncStorage para el usuario.');
        }

        if (storedEmail !== null) {
          setStoredEmail(storedEmail);
        } else {
          console.warn('Email no encontrado en AsyncStorage para el usuario.');
        }

        if (storedNombre !== null) {
          setStoredNombre(storedNombre);
        } else {
          console.warn('Nombre no encontrado en AsyncStorage para el usuario.');
        }

        // Convertir el string 'true'/'false' a booleano
        if (storedHabilitadoRaw !== null) {
          setStoredHabilitado(storedHabilitadoRaw === 'true'); // Esto convierte "true" a true, y cualquier otra cosa a false
        } else {
          setStoredHabilitado(false); // Por defecto, si no se encuentra, el usuario no está habilitado
          console.warn('Estado de habilitación no encontrado en AsyncStorage. Asumiendo deshabilitado.');
        }

      } catch (e) {
        console.error("Failed to fetch data from AsyncStorage:", e);
        setError('Error al cargar la información del usuario.');
      } finally {
        setLoading(false);
      }
    };

    getQrData();
  }, []);

  const compartirQR = async () => {
    console.log("Botón de compartir presionado");
    try {
      const uri = await qrRef.current.capture({ format: 'png', quality: 0.9 });
      console.log("URI de la imagen capturada:", uri);

      if (Share && Share.open) {
        let shareUri = uri;

        if (Platform.OS === 'android') {
          shareUri = `file://${uri}`;
        }

        const shareOptions = {
          message: 'Comparte tu QR',
          url: shareUri,
          type: 'image/png',
        };

        await Share.open(shareOptions);
      } else {
        console.error("Share o Share.open no están definidos. Verifica la instalación de react-native-share.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log("Número de tarjeta:", noTarjeta);
  console.log("Usuario habilitado:", storedHabilitado); // Para depuración
  console.log("ID Zkteco:", storedIdZkteco); // Para depuración

  // Construir el valor del QR
  const qrValue = `${storedIdZkteco || 'Androide'}${noTarjeta || ''}`;
  
  const navigateToChangePassword = () => {
    navigation.navigate('CambioContraseña'); // Asume que el nombre de la ruta es 'ActualizarPassword'
  };


  return (
    <View style={[styles.container, globalStyles.contenedor]}>
     

      {loading ? (
        <Text style={styles.loadingText}>{t('Cargando información del usuario...')}</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : storedHabilitado ? (
        // Contenido del QR si el usuario está habilitado
        <>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
             <ScrollView
            contentContainerStyle={styles.scrollViewContent} // Estilos para centrar el contenido
            showsVerticalScrollIndicator={false} // Opcional: oculta el indicador de scroll
          >
            <ViewShot ref={qrRef} options={{ format: 'png', quality: 0.9 }}>
              <View style={styles.qrContainer}>
                <Image source={require('../../assets/images/FondoQR.png')} style={styles.fondo} />
                <View style={styles.qrOverlay}>
                  <QRCode
                    value={qrValue}
                    size={200}
                    color="black"
                    backgroundColor="white"
                    errorCorrection="H"
                    style={{ marginTop: -100 }}
                  />
                  <Text style={styles.infoText}></Text>
                  
                  <Text style={styles.infoText}>QR DE ACCESO</Text>
                  <Image source={require('../../assets/brand/Variantes-03.png')} 
                  style={{ width: 200, height: 50, borderRadius: 25, resizeMode: 'contain' }}                
                  />
                  
                  <Text style={styles.infoText}>Numero de Lote: {lote}</Text>
                  <Text style={styles.infoText}>{storedNombre}</Text>
                  <Text style={styles.infoText}>{storedEmail}</Text>
                </View>
              </View>
            </ViewShot>
          <View style={styles.floatingButtonContainer}>
            <Button mode="contained" onPress={compartirQR} style={globalStyles.boton}>
              <Text style={globalStyles.botonTexto}>{t('shareQR')}</Text>
            </Button>
            </View>
            </ScrollView>
          </View>
          
        </>
      ) : (
        // Mensaje si el usuario está deshabilitado
        <View style={styles.disabledMessageContainer}>
          <Text style={styles.disabledMessageTitle}>{t('Acceso Denegado')}</Text>
          <Text style={styles.disabledMessageText}>
            {t('El usuario ha sido deshabilitado.')}
          </Text>
          <Text style={styles.disabledMessageText}>
            {t('Por favor, contacte con el administrador para más información.')}
          </Text>
          <Image
            source={{ uri: 'https://placehold.co/150x150/FF0000/FFFFFF?text=X' }} // Placeholder para un icono de "deshabilitado"
            style={styles.disabledIcon}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    flex: 1,
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center',     // Centra el contenido horizontalmente
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fondo: {
    width: 350,
    height: 650,//650
    resizeMode: 'contain',
  },
  qrOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    //paddingTop: 50,
  },
  infoText: {
    marginTop: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  titulo: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  qrBorder: {
    borderWidth: 5,
    borderColor: 'black',
    borderRadius: 8,
    padding: 10,
  },
  // Nuevos estilos para el mensaje de usuario deshabilitado
  loadingText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  disabledMessageContainer: {
    padding: 20,
    backgroundColor: '#ffe0e0', // Fondo suave para el mensaje de error
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledMessageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F', // Rojo oscuro
    marginBottom: 10,
    textAlign: 'center',
  },
  disabledMessageText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  disabledIcon: {
    width: 80,
    height: 80,
    marginTop: 20,
    tintColor: '#D32F2F', // Color del icono
  },
  floatingButtonContainer: {
    position: 'absolute', // Posicionamiento absoluto
    bottom: 30,           // A 30 unidades del borde inferior
    alignSelf: 'center',  // Centra el botón horizontalmente
    zIndex: 10,           // Asegura que esté por encima de otros elementos
    width: '80%',         // Opcional: Dale un ancho para que el botón se vea bien
  },
 changePasswordIcon: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20, 
    left: 2, 
    zIndex: 10, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    borderRadius: 30, 
  },
});

export default QrGenerator;
