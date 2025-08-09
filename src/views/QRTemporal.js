import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, Image, Dimensions, Alert } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import globalStyles from '../styles/globalStyles';
import { ScrollView } from 'react-native-gesture-handler';

// Importa la mutación desde tu archivo.
import { useMutation } from '@apollo/client'
import { CREAR_USUARIO_TEMPORAL } from '../graphql/mutations/usuariostempMutations';

// ... imports iguales ...

const QRTemporal = () => {
    console.log("****** QR Temporal *******");

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

    const [crearUsuarioTemporal, { loading, error, data }] = useMutation(CREAR_USUARIO_TEMPORAL);

    // Esta función ya no es necesaria, ya que obtendremos la vigencia de AsyncStorage
    // const getDates = () => {
    //     const now = new Date();
    //     const endDate = new Date(now);
    //     endDate.setHours(endDate.getHours() + 2);
    //     const accEndTime = endDate.toISOString();
    //     return { accEndTime };
    // };

    const callGraphQlAndGenerateQr = async (nombre, lote, email, vigenciaAsyncStorage) => {
        try {
            console.log("Llamando a GraphQL con:", { nombre, lote, email, vigenciaAsyncStorage });
            console.log("Lote:", lote);

            await crearUsuarioTemporal({
                variables: {
                    nombre: "Usuario Temporal",
                    lote: lote,
                    creadoPor: email,
                    vigencia: vigenciaAsyncStorage, // Usar la vigencia obtenida de AsyncStorage
                }
            });
        } catch (err) {
            console.error('Error al llamar al servidor GraphQL:', err);
            // Ya no mostramos la alerta aquí, el renderContent se encargará de esto
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const storedHabilitadoRaw = await AsyncStorage.getItem('habilitado');
                const isHabilitado = storedHabilitadoRaw === 'true';
                setStoredHabilitado(isHabilitado);

                const loadedNombre = await AsyncStorage.getItem('nombre');
                const loadedLote = await AsyncStorage.getItem('lote');
                const loadedEmail = await AsyncStorage.getItem('email');
                // Obtener la vigencia de AsyncStorage
                const loadedVigencia = await AsyncStorage.getItem('vigencia');

                setStoredNombre(loadedNombre);
                setStoredLote(loadedLote);
                setStoredEmail(loadedEmail);
                setVigencia(loadedVigencia ? new Date(loadedVigencia).toLocaleString() : ''); // Formatear y establecer el estado de la vigencia

                if (isHabilitado && loadedNombre && loadedLote && loadedEmail && loadedVigencia) {
                    // Pasar la vigencia recuperada como argumento
                    await callGraphQlAndGenerateQr(loadedNombre, loadedLote, loadedEmail, loadedVigencia);
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
                vigencia: fechaVigencia
            } = data.crearUsuarioTemporal;

            console.log("➡️ Respuesta de GraphQL:", data.crearUsuarioTemporal);

            setPin(String(idZkteco));
            setCardNo(String(noTarjeta));
            setQrValue(QR);

            // FECHAS: convertir timestamps a string legible
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
                message: 'Comparte tu QR de acceso temporal.',
                url: Platform.OS === 'android' ? `file://${uri}` : uri,
                type: 'image/png',
            };
            await Share.open(shareOptions);
        } catch (err) {
            console.error(err);
            Alert.alert(t('Error'), t('No se pudo compartir el QR.'));
        }
    };

    const navigateToChangePassword = () => {
        navigation.navigate('CambioContraseña');
    };

    const renderContent = () => {
        if (loading) {
            return <Text style={styles.loadingText}>{t('Cargando información del usuario...')}</Text>;
        }
        if (error) {
            console.error("GraphQL error:", JSON.stringify(error, null, 2));

            return (
                <View style={styles.disabledMessageContainer}>
                    <Text style={styles.disabledMessageTitle}>Error en la Solicitud</Text>
                    <Text style={styles.disabledMessageText}>No fue posible realizar su solicitud, por favor intente más tarde.</Text>
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
                                <Text style={styles.infoText}>QR DE ACCESO TEMPORAL</Text>
                                <Text style={styles.infoText}>PIN: {pin}</Text>
                                <Text style={styles.infoText}>No. de Tarjeta: {cardNo}</Text>
                                <Text style={styles.infoText}>Vigencia: {vigencia}</Text>
                                <Text style={styles.infoText}>Creado: {fechaCreacion}</Text>
                                <Image source={require('../../assets/brand/Variantes-03.png')}
                                    style={{ width: 200, height: 50, borderRadius: 25, resizeMode: 'contain' }}
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
    infoText: {
        marginTop: 10,
        color: '#fff',
        fontWeight: 'bold',
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
    changePasswordIcon: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        left: 2,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 30,
    },
});
// export default sin cambios
export default QRTemporal;
