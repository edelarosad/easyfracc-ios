import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, Image, ScrollView } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useSnackbar } from '../componentes/SnackbarContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import globalStyles from '../styles/globalStyles';
import { useQuery, useMutation } from '@apollo/client';
import { OBTENER_CONFIGURACION } from '../graphql/queries/configuracionQueries';
import { ABRIR_PUERTA_MUTATION, CERRAR_PUERTA_MUTATION } from '../graphql/mutations/usuariosMutations';


const QrGenerator = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [abrirPuertaMutation, { loading: abrirLoading }] = useMutation(ABRIR_PUERTA_MUTATION);

  const [noTarjeta, setNoTarjeta] = useState(null);
  const [lote, setLote] = useState(null);
  const [storedEmail, setStoredEmail] = useState(null);
  const [storedNombre, setStoredNombre] = useState(null);
  const [storedHabilitado, setStoredHabilitado] = useState(null);
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
        const storedHabilitadoRaw = await AsyncStorage.getItem('habilitado');
        const storedIdZkteco = await AsyncStorage.getItem('idZkteco');

        setNoTarjeta(storedNoTarjeta || null);
        setstoredIdZkteco(storedIdZkteco || null);
        setLote(storedLote || null);
        setStoredEmail(storedEmail || null);
        setStoredNombre(storedNombre || null);
        setStoredHabilitado(storedHabilitadoRaw === 'true');
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
    try {
      const uri = await qrRef.current.capture({ format: 'png', quality: 0.9 });
      let shareUri = Platform.OS === 'android' ? `file://${uri}` : uri;

      await Share.open({
        message: 'Comparte tu QR',
        url: shareUri,
        type: 'image/png',
      });
    } catch (err) {
      console.log(err);
    }
  };

  const aperturaRapida = async () => {
    try {
    // Llamar a la mutación
    const response = await abrirPuertaMutation({
      variables: {
        // Si quieres, puedes pasar nombrePuerta e intervaloPuerta
        // Si no los pasas, el resolver usará la configuración por defecto
        nombrePuerta: null,
        intervaloPuerta: null,
      },
    });

    if (response?.data?.abrirPuerta?.message) {
      console.log(response.data.abrirPuerta.message);
    }

    // Guardar temporal y navegar como ya tenías
    await AsyncStorage.setItem('apertura', 'true');
    await guardarNombreTemp("Apertura");
    navigation.navigate('QRTemporal');

  } catch (error) {
    showSnackbar('Error al abrir la puerta. Intenta de nuevo.');
    console.error("Error al abrir la puerta:", error);
  }
};

  const qrValue = `${storedIdZkteco || 'Androide'}${noTarjeta || ''}`;

  return (
    <View style={[styles.container, globalStyles.contenedor]}>
      {loading ? (
        <Text style={styles.loadingText}>{t('Cargando información del usuario...')}</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : storedHabilitado ? (
        <>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
              <ViewShot ref={qrRef} options={{ format: 'png', quality: 0.9 }}>
                <View style={styles.qrContainer}>
                  <Image source={require('../../assets/images/FondoQR.png')} style={styles.fondo} />
                  <View style={styles.qrOverlay}>
                    <QRCode value={qrValue} size={200} color="black" backgroundColor="white" errorCorrection="H" style={{ marginTop: -100 }} />
                    <Text style={styles.infoText}>
                      {"\n"}
                      {t('AccessQRcode')}
                    </Text>
                    <Image source={require('../../assets/brand/Variantes-03.png')} style={{ width: 200, height: 50, borderRadius: 25, resizeMode: 'contain' }} />
                    <Text style={styles.infoText}>{t('LotNumber')}: {lote}</Text>
                    <Text style={styles.infoText}>{storedNombre}</Text>
                    <Text style={styles.infoText}>{storedEmail}</Text>
                  </View>
                </View>
              </ViewShot>

              {/* Botón flotante de compartir */}
              <View style={styles.floatingButtonContainer}>
                <Button mode="contained" onPress={aperturaRapida} style={styles.boton} icon= "door-open" >
                  <Text style={globalStyles.botonTexto}>{t('Apertura rápida')}</Text>
                </Button>
              </View>
            </ScrollView>
          </View>
         
        </>
      ) : (
        <View style={styles.disabledMessageContainer}>
          <Text style={styles.disabledMessageTitle}>{t('Acceso Denegado')}</Text>
          <Text style={styles.disabledMessageText}>{t('El usuario ha sido deshabilitado.')}</Text>
          <Text style={styles.disabledMessageText}>{t('Por favor, contacte con el administrador para más información.')}</Text>
          <Image source={{ uri: 'https://placehold.co/150x150/FF0000/FFFFFF?text=X' }} style={styles.disabledIcon} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fondo: {
    width: 350,
    height: 650,
    resizeMode: 'contain',
  },
  qrOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    marginTop: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingText: { fontSize: 18, color: '#555', textAlign: 'center' },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center' },
  disabledMessageContainer: {
    padding: 20,
    backgroundColor: '#ffe0e0',
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
  disabledMessageTitle: { fontSize: 24, fontWeight: 'bold', color: '#D32F2F', marginBottom: 10, textAlign: 'center' },
  disabledMessageText: { fontSize: 16, color: '#333', textAlign: 'center', marginBottom: 5 },
  disabledIcon: { width: 80, height: 80, marginTop: 20, tintColor: '#D32F2F' },
  floatingButtonContainer: { position: 'absolute', bottom: 30, alignSelf: 'center', zIndex: 10, width: '80%' },
  topRightContainer: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 20, right: 10, alignItems: 'center', zIndex: 10 },
  topRightText: { color: 'black', fontWeight: 'bold', marginTop: -5, justifyContent: 'center', textAlign: 'center' },
  boton:{
    marginTop: 20,
    backgroundColor: 'seagreen',
  },
});

export default QrGenerator;
