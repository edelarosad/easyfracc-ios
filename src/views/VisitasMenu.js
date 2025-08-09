import { View, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, Text, TextInput, Icon } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import  globalStyles from '../styles/globalStyles'; 

//Trnaslate
import { useTranslation } from 'react-i18next';


const VisitasMenu = () => {
    
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();

    const [fecha, setFecha] = useState(new Date());
    const [mostrarPicker, setMostrarPicker] = useState(false);
     
    // Función para formatear la fecha a español
    const formatDate = (date) => {
      // Opciones para el formato de fecha, puedes cambiar 'full' por 'long', 'medium' o 'short'
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Intl.DateTimeFormat('es-ES', options).format(date);
    };

    // Función para guardar la fecha actual más un día     
    const guardarVigenciaUnDia = async () => {
      try {
        const fechaVigencia = new Date();
        fechaVigencia.setDate(fechaVigencia.getDate() + 1);
        await AsyncStorage.setItem('vigencia', fechaVigencia.toISOString());
        console.log('Vigencia guardada (1 día):', fechaVigencia.toISOString());
        navigation.navigate('QRTemporal');
      } catch (e) {
        console.error('Error al guardar la vigencia', e);
      }
    };
    
    // Función para guardar la fecha actual más una semana
    const guardarVigenciaUnaSemana = async () => {
        try {
            const fechaVigencia = new Date();
            fechaVigencia.setDate(fechaVigencia.getDate() + 7);
            await AsyncStorage.setItem('vigencia', fechaVigencia.toISOString());
            console.log('Vigencia guardada (1 semana):', fechaVigencia.toISOString());
            // Ahora navega a QRTemporal en lugar de QrGenerator
            navigation.navigate('QRTemporal');
        } catch (e) {
            console.error('Error al guardar la vigencia', e);
        }
    };

    const guardarVigencia = async () => {
        try {
            await AsyncStorage.setItem('vigencia', fecha.toISOString());
            console.log('Vigencia guardada:', fecha.toISOString());
            navigation.navigate('QRTemporal');
        } catch (e) {
            console.error('Error al guardar la vigencia', e);
        }
    };
    
    // Crear la fecha máxima (un mes a partir de hoy)
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);

    return (
        <LinearGradient
            // Se usa el mismo degradado que la pantalla de login
            // const displayGreen = ['#11505e', '#74a2af'];
            //colors={['#48c59c', '#00796B']}
            colors={['#74a2af', '#11505e']}
            style={styles.gradientContainer}
        >
            <View style={styles.container}>
                {/* Primer fila con 2 botones */}
                <View style={styles.row}>
                    {/* Contenedores con sombra para los botones */}
                     <View style={[styles.col, globalStyles.cardShadow]}>
                        <Button mode="contained" style={styles.button} onPress={guardarVigenciaUnDia} disabled={false}>
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

                {/* Segundo bloque: cuadro grande que ocupa todo lo demás */}
                {/* Contenedor grande con sombra */}
                <View style={[styles.bigContainer, styles.colShadow]}>
                    <Text variant="titleLarge" style={styles.label}>Generar acceso con vigencia</Text>
                    <Button
                        mode="outlined"
                        onPress={() => setMostrarPicker(true)}
                        style={styles.selector}
                        labelStyle={styles.selectorText}
                    >                        
                        {formatDate(fecha)}
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
                        />
                    )}
                    <Button
                        mode="contained"
                        onPress={guardarVigencia}
                        style={globalStyles.boton}
                    >
                        Generar QR
                    </Button>
                </View>

                {/* Footer, ahora con el mismo estilo del login */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2025 EasyFracc</Text>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 8,
    },
    col: {
        flex: 1,
        marginHorizontal: 8,
    },
    colShadow: {
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',      
        backgroundColor: '#FFF',
    },
    buttonContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        marginTop: 8,
        color: 'black',
        fontSize: 13,
        fontWeight: 'bold',
    },
    footer: {
        padding: 16,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        color: 'white',
    },
    bigContainer: {
        flex: 3,
        marginTop: 16,
        justifyContent: 'center',
        padding: 16,
    },
    label: {
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: 'bold',
    },
    selector: {
        marginVertical: 8,
        backgroundColor: '#F5F5F5',
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    boton: {
        marginTop: 16,
        backgroundColor: '#48c59c', // Verde del login
    },
    selectorText: {
      fontSize: 15,
      fontWeight: 'bold',
    },


});

export default VisitasMenu;
