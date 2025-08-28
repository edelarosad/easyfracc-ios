import { View, StyleSheet, Modal, ScrollView  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Button, Text, Icon, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import globalStyles from '../styles/globalStyles';

import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../componentes/SnackbarContext'; 

import { useQuery, useMutation } from '@apollo/client';
import { OBTENER_CONFIGURACION } from '../graphql/queries/configuracionQueries';
import { ABRIR_PUERTA_MUTATION, CERRAR_PUERTA_MUTATION } from '../graphql/mutations/usuariosMutations';

const VisitasMenu = () => {
  const { t, i18n } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const navigation = useNavigation();
  const [abrirPuertaMutation, { loading: abrirLoading }] = useMutation(ABRIR_PUERTA_MUTATION);

  const [fecha, setFecha] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [horaMaxProveedor, setHoraMaxProveedor] = useState('18:00');

  const { data: configData } = useQuery(OBTENER_CONFIGURACION, { fetchPolicy: 'network-only' });

  useEffect(() => {
    if (configData && configData.obtenerConfiguracion) {
      setHoraMaxProveedor(configData.obtenerConfiguracion.horaMaxProveedor || '18:00');
    }
  }, [configData]);

  const getLocalHour = () => {
    const date = new Date();
    const options = { hour: 'numeric', hour12: false, timeZone: 'America/Mexico_City' };
    const formattedTime = date.toLocaleTimeString('en-US', options); 
    return parseInt(formattedTime.split(':')[0], 10);
  };

  const horaActual = getLocalHour();
  const isDisabled = horaActual >= horaMaxProveedor;

  const guardarNombreTemp = async (nombre) => {
    try { await AsyncStorage.setItem('nombreTemp', nombre); } 
    catch (e) { console.error(e); }
  };

  const guardarVigenciaUnDia = async () => {
    try {
      const fechaVigencia = new Date();
      fechaVigencia.setDate(fechaVigencia.getDate() + 1);
      await AsyncStorage.setItem('vigencia', fechaVigencia.toISOString());
      await AsyncStorage.setItem('esProveedor', 'false');
      await guardarNombreTemp("UnDia");
      navigation.navigate('QRTemporal');
    } catch (e) { console.error(e); }
  };

  const guardarVigenciaUnaSemana = async () => {
    try {
      const fechaVigencia = new Date();
      fechaVigencia.setDate(fechaVigencia.getDate() + 7);
      await AsyncStorage.setItem('vigencia', fechaVigencia.toISOString());
      await AsyncStorage.setItem('esProveedor', 'false');
      await guardarNombreTemp("UnaSemana");
      navigation.navigate('QRTemporal');
    } catch (e) { console.error(e); }
  };

  const guardarVigencia = async () => {
    try {
      await AsyncStorage.setItem('vigencia', fecha.toISOString());
      await AsyncStorage.setItem('esProveedor', 'false');
      await guardarNombreTemp("Generico");
      navigation.navigate('QRTemporal');
    } catch (e) { console.error(e); }
  };

  const guardarProveedor = async () => {
    try {
      const fechaVigencia = new Date();
      fechaVigencia.setDate(fechaVigencia.getDate() + 1);
      await AsyncStorage.setItem('vigencia', fechaVigencia.toISOString());
      await AsyncStorage.setItem('esProveedor', 'true');
      await guardarNombreTemp("Proveedor");
      navigation.navigate('QRTemporal');
    } catch (e) { console.error(e); }
  };

  const guardarSalida = async () => {
    try {
      const fechaVigencia = new Date();
      fechaVigencia.setMinutes(fechaVigencia.getMinutes() + 15);
      await AsyncStorage.setItem('vigencia', fechaVigencia.toISOString());
      await AsyncStorage.setItem('esProveedor', 'false');
      await guardarNombreTemp("Salida");
      navigation.navigate('QRTemporal');
    } catch (e) { console.error(e); }
  };

  const ejecutaApertura = async () => {
  try {
    const response = await abrirPuertaMutation({
      variables: {
        nombrePuerta: null,
        intervaloPuerta: null,
      },
    });

    if (response?.data?.abrirPuerta?.message) {
      console.log(response.data.abrirPuerta.message);
    }

    await AsyncStorage.setItem('apertura', 'true');
    await guardarNombreTemp("Apertura");
    navigation.navigate('QRTemporal');

  } catch (error) {
    showSnackbar('Error al abrir la puerta. Intenta de nuevo.');
    console.error("Error al abrir la puerta:", error);    
  }
};

  const formatDate = (date, locale) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat(locale, options).format(date);
  };

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 1);

  return (
    <LinearGradient colors={['#74a2af', '#11505e']} style={styles.gradientContainer}>
      <View style={styles.container}>

        {/* Fila 1 */}
        <View style={styles.rowFixed}>
          <View style={[styles.col, globalStyles.cardShadow]}>
            <Button mode="contained" style={styles.button} onPress={guardarVigenciaUnDia}>
              <View style={styles.buttonContent}>
                <Icon source="numeric-1-box" size={60} color="#48c59c" />
                <Text style={styles.buttonText}>{t('oneday')}</Text>
              </View>
            </Button>
          </View>
          <View style={[styles.col, globalStyles.cardShadow]}>
            <Button mode="contained" style={styles.button} onPress={guardarVigenciaUnaSemana}>
              <View style={styles.buttonContent}>
                <Icon source="numeric-1-circle" size={60} color="#48c59c" />
                <Text style={styles.buttonText}>{t('oneweek')}</Text>
              </View>
            </Button>
          </View>
        </View>

        {/* Fila 2 */}
        <View style={styles.rowFixed}>
          <View style={[styles.col, globalStyles.cardShadow]}>
            <Button mode="contained" style={styles.button} onPress={guardarProveedor} disabled={isDisabled}>
              <View style={styles.buttonContent}>
                <Icon source="account-hard-hat" size={60} color={isDisabled ? 'lightgray' : '#48c59c'} />
                <Text style={styles.buttonText}>{t('serviceprovider')}</Text>
              </View>
            </Button>
          </View>
          <View style={[styles.col, globalStyles.cardShadow]}>
            <Button mode="contained" style={styles.button} onPress={guardarSalida}>
              <View style={styles.buttonContent}>
                <Icon source="exit-run" size={60} color="#48c59c" />
                <Text style={styles.buttonText}>{t('exitPass')}</Text>
              </View>
            </Button>
          </View>
        </View>

        {/* Nueva fila: Apertura */}
       <View style={styles.rowFixed}>
        <View style={[styles.col, globalStyles.cardShadow, { flex: 2 }]}>
          <Button mode="contained" style={styles.button} onPress={ejecutaApertura}>
            <View style={styles.buttonContent}>
              <Icon source="door-open" size={60} color="#48c59c" />
              <Text style={styles.buttonText}>Apertura rápida</Text>
            </View>
          </Button>
        </View>
      </View>

        {/* Cuadro grande */}
        <View style={[styles.bigContainerHalf, styles.colShadow]}>
          <Text variant="titleLarge" style={styles.label}>{t('limitedAccess')}</Text>

          <Button
            mode="outlined"
            onPress={() => setMostrarPicker(true)}
            style={styles.selector}
            labelStyle={styles.selectorText}
          >
            {formatDate(fecha, i18n.language)}
          </Button>

          {mostrarPicker && (
            <DateTimePicker
              value={fecha}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setMostrarPicker(false);
                if (selectedDate) setFecha(selectedDate);
              }}
              minimumDate={new Date()}
              maximumDate={maxDate}
              locale={t.language}
            />
          )}

          <Button mode="contained" onPress={guardarVigencia} style={globalStyles.boton}>
            <Text style={globalStyles.botonTexto}>{t('CreateAccess')}</Text>
          </Button>
        </View>

        {/* Modal de información */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView style={{ maxHeight: 300 }}>
                <Text style={styles.modalText}>
                  Estimado usuario a continuación se detallan las reglas del uso para cada pase de visita según sea la necesidad
                </Text>
                <Text style={styles.modalText}>
                  1.- Pase de un día{'\n'}
                  Este pase tiene una vigencia de 24hrs a partir de la creación del mismo, por ejemplo, de 5pm a 5pm del siguiente día.
                </Text>
                <Text style={styles.modalText}>
                  2.- Pase de una semana{'\n'}
                  Este pase tiene una vigencia de una semana a partir del horario en que se generó.
                </Text>
                <Text style={styles.modalText}>
                  3.- Pase de proveedor{'\n'}
                  Este pase solo tendrá un horario limitado para el día en que se genere, la salida sera a las {horaMaxProveedor}:00hrs del mismo día.
                </Text>
                <Text style={styles.modalText}>
                  4.- Pase de salida{'\n'}
                  Este pase solo tendrá una vigencia únicamente de 15 minutos para una salida rápida del fraccionamiento.
                </Text>
              </ScrollView>
              <Button onPress={() => setModalVisible(false)}>Cerrar</Button>
            </View>
          </View>
        </Modal>

        {/* Footer centrado */}
        {/* Footer */}
       <View style={[styles.footer, { backgroundColor: '#11505e', position: 'relative' }]}>
          <Text style={[styles.footerText, { color: 'white', textAlign: 'center', width: '100%' }]}>
            © {new Date().getFullYear()} EasyFracc
          </Text>
          <IconButton
            icon="information"
            size={30}
            iconColor="white"
            style={{ position: 'absolute', right: -10 }}
            onPress={() => setModalVisible(true)}
          />
        </View>

      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  container: { flex: 1, padding: 16 },
  rowFixed: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 8, height: 120 },
  col: { flex: 1, marginHorizontal: 8 },
  colShadow: { elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, backgroundColor: 'white', borderRadius: 5 },
  button: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
  buttonContent: { alignItems: 'center', justifyContent: 'center' },
  buttonText: { marginTop: 8, color: 'black', fontSize: 13, fontWeight: 'bold', textAlign: 'center' },
  bigContainerHalf: { flex: 1, marginTop: 8, justifyContent: 'center', padding: 16, backgroundColor: 'white', borderRadius: 5 },
  label: { textAlign: 'center', marginBottom: 16, fontWeight: 'bold' },
  selector: { marginVertical: 8, backgroundColor: '#F5F5F5', borderColor: '#CCC', borderWidth: 1, borderRadius: 5, padding: 10 },
  selectorText: { fontSize: 15, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: 350, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  modalText: { marginBottom: 5, fontSize: 14, textAlign: 'center' },
  footer: {
  padding: 16,
  alignItems: 'center',
  justifyContent: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default VisitasMenu;
