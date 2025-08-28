import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, Image } from 'react-native';
import { Button } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import globalStyles from '../styles/globalStyles';
import { ScrollView } from 'react-native-gesture-handler';

import { useSnackbar } from '../componentes/SnackbarContext'; 

// Importa hooks de Apollo y queries/mutations
import { useMutation, useQuery  } from '@apollo/client';
import { CREAR_USUARIO_TEMPORAL } from '../graphql/mutations/usuariostempMutations';
import { OBTENER_CONFIGURACION } from  '../graphql/queries/configuracionQueries';

const QRTemporal = () => {
    console.log("****** QR Temporal *******");

    const { showSnackbar } = useSnackbar();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const qrRef = useRef();

    const [storedEmail, setStoredEmail] = useState(null);
    const [storedNombre, setStoredNombre] = useState(null);
    const [storedLote, setStoredLote] = useState(null);
    const [storedHabilitado, setStoredHabilitado] = useState(null);

    const [pin, setPin] = useState(null);
    const [cardNo, setCardNo] = useState(null);
    const [qrValue, setQrValue] = useState('');

    // NUEVOS ESTADOS PARA FECHAS
    const [vigencia, setVigencia] = useState('');
    const [fechaCreacion, setFechaCreacion] = useState('');

    // NUEVOS ESTADOS PARA CONFIGURACION
    const [nomFraccionamiento, setNomFraccionamiento] = useState('');
    const [dirFraccionamiento, setDirFraccionamiento] = useState('');
    const [horaMaxProveedor, setHoraMaxProveedor] = useState('18:00');
    const [esProveedorH, setEsProveedorH] = useState(false);

    // Query para obtener la configuración
    const { data: configData, loading: configLoading, error: configError } = useQuery(OBTENER_CONFIGURACION, { fetchPolicy: 'network-only', });

    const [crearUsuarioTemporal, { loading, error, data }] = useMutation(CREAR_USUARIO_TEMPORAL);

    useEffect(() => {
      if (configData && configData.obtenerConfiguracion) {
        setNomFraccionamiento(configData.obtenerConfiguracion.NomFraccionamiento);
        setDirFraccionamiento(configData.obtenerConfiguracion.DirFraccionamiento);
        setHoraMaxProveedor(configData.obtenerConfiguracion.horaMaxProveedor || '18:00');
      }
    }, [configData]);

    const callGraphQlAndGenerateQr = async (nombre, lote, email, vigenciaAsyncStorage, esProveedor) => {
        try {
            console.log("Llamando a GraphQL con:", { nombre, lote, email, vigenciaAsyncStorage, esProveedor });

            await crearUsuarioTemporal({
                variables: {
                    nombre: nombre, // nombre ya viene concatenado
                    lote: lote,
                    creadoPor: email,
                    vigencia: vigenciaAsyncStorage,
                    esProveedor: esProveedor
                }
            });
        } catch (err) {
            //showSnackbar(t('Error al llamar al servidor GraphQL.'));
            console.error('Error al llamar al servidor GraphQL:', err);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const storedHabilitadoRaw = await AsyncStorage.getItem('habilitado');
                const isHabilitado = storedHabilitadoRaw === 'true';
                setStoredHabilitado(isHabilitado);

                const loadedNombre = await AsyncStorage.getItem('nombre') || '';
                const loadedNombreTemp = await AsyncStorage.getItem('nombreTemp') || '';
                const loadedLote = await AsyncStorage.getItem('lote');                
                const loadedEmail = await AsyncStorage.getItem('email');                
                const loadedVigencia = await AsyncStorage.getItem('vigencia');
                const loadedEsProveedor = await AsyncStorage.getItem('esProveedor') === 'true'; 

                const nombreConcatenado = loadedNombreTemp; // + '-' + loadedNombre;
                setStoredNombre(nombreConcatenado);
                setStoredLote(loadedLote);
                setStoredEmail(loadedEmail);
                setVigencia(loadedVigencia ? new Date(loadedVigencia).toLocaleString() : '');
                setEsProveedorH(loadedEsProveedor);

                if (isHabilitado && loadedNombre && loadedLote && loadedEmail && loadedVigencia) {
                    await callGraphQlAndGenerateQr(nombreConcatenado, loadedLote, loadedEmail, loadedVigencia, loadedEsProveedor);
                }
            } catch (e) {
                console.error("Failed to load initial data:", e);
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        if (data && data.crearUsuarioTemporal) {
            const {
                idZkteco,
                noTarjeta,
                QR,
                fechaDeCreacion,
                vigencia: fechaVigencia,
                esProveedor
            } = data.crearUsuarioTemporal;

            console.log("➡️ Respuesta de GraphQL:", data.crearUsuarioTemporal);

            setPin(String(idZkteco));
            setCardNo(String(noTarjeta));
            setQrValue(QR);

            const fechaCreacionLegible = new Date(parseInt(fechaDeCreacion)).toLocaleString();
            const vigenciaLegible = new Date(parseInt(fechaVigencia)).toLocaleString();
            setFechaCreacion(fechaCreacionLegible);
            setVigencia(vigenciaLegible);
        }
    }, [data]);

    const compartirQR = async () => {
        try {
            const uri = await qrRef.current.capture({ format: 'png', quality: 0.9 });            
            const shareOptions = {
                //message: 'Comparte tu QR de acceso temporal.',
                //message: `Usted puede acceder a esta ubicación:\n${dirFraccionamiento}`,
                message: `Invitación para ${nomFraccionamiento}, más información en el siguiente link :\n${dirFraccionamiento}`,

                
                url: Platform.OS === 'android' ? `file://${uri}` : uri,
                type: 'image/png',
            };
            await Share.open(shareOptions);
        } catch (err) {
            console.error(err);
        }
    };

    const renderContent = () => {
        if (loading || configLoading) {
            return <Text style={styles.loadingText}>{t('LoadingUserData')}</Text>;
        }
        if (error || configError) {             
            console.error("GraphQL error:", JSON.stringify(error || configError, null, 2));

            return (
                <View style={styles.disabledMessageContainer}>
                    <Text style={styles.disabledMessageTitle}>{t('RequestFailed')}</Text>
                    <Text style={styles.disabledMessageText}>{t('RequestFailedTextLarge')}</Text>
                    <Text style={styles.disabledMessageTextError}>{`Error: ${(error?.graphQLErrors?.[0]?.message) || (configError?.graphQLErrors?.[0]?.message)}`}</Text>
                    <Image
                        source={{ uri: 'https://placehold.co/150x150/FF0000/FFFFFF?text=!' }}
                        style={styles.disabledIcon}
                    />
                </View>
            );
        }

        if (storedHabilitado && qrValue) {
            return (
                <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
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
                                {/* Aquí muestras NomFraccionamiento */}
                                
                                <Text style={styles.infoTextBajoQR}>{nomFraccionamiento}</Text>                                                                
                                <Text Text style={styles.infoText}>PIN: {pin}   |   {t('LotNumber')}: {storedLote}</Text>
                               <Text style={styles.infoText}>{t('CreationDate')}: {fechaCreacion}</Text>
                              {(() => {
                                    if (esProveedorH) {
                                        // Extraemos solo la parte de fecha (YYYY-MM-DD) de fechaCreacion
                                      /*  const fechaStr = fechaCreacion.split(' ')[0] || ''; // Si es "2025-08-12 13:45", toma "2025-08-12"
                                        const horaStr = horaMaxProveedor.toString().padStart(2, '0'); // Ejemplo: "17"
                                        console.log("Hora máxima del proveedor:", horaMaxProveedor);
                                        console.log("Fecha de creación:", horaStr);
                                        const fechaConHora = `${fechaStr} ${horaStr}:00:00`; // "2025-08-12 17:00"*/
                                        const fechaStr = fechaCreacion.split(' ')[0] || '';
                                        let horaNum = parseInt(horaMaxProveedor, 10);

                                        // Convertimos a formato 12h
                                        const ampm = horaNum >= 12 ? 'PM' : 'AM';
                                        horaNum = horaNum % 12 || 12; // 0 → 12

                                        const horaStr = horaNum.toString().padStart(2, '0'); // ej. "05"
                                        const fechaConHora = `${fechaStr} ${horaStr}:00:00 ${ampm}`;

                                        console.log("Hora máxima del proveedor:", horaMaxProveedor);
                                        console.log("Fecha con hora AM/PM:", fechaConHora);


                                        return (
                                        <Text style={styles.infoTextResaltado}>
                                            {t('Validity')}: {fechaConHora}
                                        </Text>
                                        );
                                    } else {
                                        return (
                                        <Text style={styles.infoTextResaltado}>
                                            {t('Validity')}: {vigencia}
                                        </Text>
                                        );
                                    }
                                    })()}


                              
                                <Image source={require('../../assets/brand/Variantes-03.png')}
                                    style={{ width: 200, height: 70, borderRadius: 25, resizeMode: 'contain' }}
                                />
                            </View>
                        </View>
                    </ViewShot>
                    <View style={styles.floatingButtonContainer}>
                        <Button mode="contained" onPress={compartirQR} style={globalStyles.boton}>
                            <Text style={globalStyles.botonTexto}>{t('shareQR')}</Text>                            
                        </Button>
                    </View>
                </ScrollView>
            );
        }

        if (!storedHabilitado) {
            return (
                <View style={styles.disabledMessageContainer}>
                    <Text style={styles.disabledMessageTitle}>{t('Acceso Denegado')}</Text>
                    <Text style={styles.disabledMessageText}>{t('El usuario ha sido deshabilitado.')}</Text>
                    <Text style={styles.disabledMessageText}>{t('Por favor, contacte con el administrador para más información.')}</Text>
                    <Image
                        source={{ uri: 'https://placehold.co/150x150/FF0000/FFFFFF?text=X' }}
                        style={styles.disabledIcon}
                    />
                </View>
            );
        }

        return null;
    };

    return (
        <View style={[styles.container, globalStyles.contenedor]}>
            {renderContent()}
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
    disabledMessageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#D32F2F',
        marginBottom: 10,
        textAlign: 'center',
    },
    disabledMessageText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    disabledMessageTextError: {
        fontSize: 12,
        color: '#D32F2F',
        textAlign: 'center',
        marginBottom: 5,
    },
    disabledIcon: {
        width: 80,
        height: 80,
        marginTop: 20,
        tintColor: '#D32F2F',
    },
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        zIndex: 10,
        width: '80%',
    },
    infoTextBajoQR: {
        marginTop: 50,   // o el valor que necesites para separar bien el texto de la imagen
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    infoText: {
        marginTop: 5,
        color: 'lightgray',
        fontWeight: 'bold',
    },
    infoTextResaltado: {
        marginTop: 5,                
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default QRTemporal;
