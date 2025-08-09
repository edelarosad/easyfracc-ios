import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions,Text, Image } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper'; 
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';


import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';


import { useSnackbar } from '../componentes/SnackbarContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage';


import  globalStyles from '../styles/globalStyles'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//Apollo
import { useQuery , useMutation, useLazyQuery } from '@apollo/client'
import { OBTENER_PAISES } from '../graphql/queries/paisesQueries';
import { OBTENER_ESTADOS } from '../graphql/queries/estadosQueries';
import { OBTENER_FRACCIONAMIENTOS } from '../graphql/queries/fraccionamientoQueries';
import { OBTENER_CASAS } from '../graphql/queries/casaQueries';


const CrearUsuario = () => {

  const { height } = Dimensions.get('window');
  const displayGreen = ['#11505e', '#74a2af'];
  
    const gradientStyle = StyleSheet.flatten([
      styles.gradient,
      { height: height },
    ]);

  const navigation = useNavigation();
  const { showSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation();
  

  const [nombre, guardarNombre] = useState('');
  const [email, guardarEmail] = useState('');
  const [password, guardarPassword] = useState('');
  const [paisSeleccionado, setPaisSeleccionado] = useState('');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
  const [fraccionamientos, setFraccionamientos] = useState([]);
  const [fraccionamientoSeleccionado, setFraccionamientoSeleccionado] = useState('');
  const [casas, setCasas] = useState([]);
  const [casaSeleccionada, setCasaSeleccionada] = useState('');

  const [obtenerFraccionamientos, { data: fraccionamientosData }] = useLazyQuery(OBTENER_FRACCIONAMIENTOS);
  const [getCasas, { data: casasData }] = useLazyQuery(OBTENER_CASAS);


  const { data: paisesData, loading: loadingPaises } = useQuery(OBTENER_PAISES);
  const { data: estadosData, loading: loadingEstados, refetch: refetchEstados } = useQuery(OBTENER_ESTADOS, {
    variables: { paisId: paisSeleccionado },
    skip: !paisSeleccionado,
  });

 useEffect(() => {
    if (paisSeleccionado) {
      refetchEstados();
      setEstadoSeleccionado(''); // Reiniciar estado cuando cambia el país
      /* setFraccionamientoSeleccionado('');
      setCasas([]);
      setCasaSeleccionada(''); */
    }
  }, [paisSeleccionado]);   
  
  useEffect(() => {
  if (estadoSeleccionado) {
    obtenerFraccionamientos({ variables: { estadoId: estadoSeleccionado } });
    setFraccionamientoSeleccionado('');
    /* setCasas([]);
    setCasaSeleccionada(''); */
  }
}, [estadoSeleccionado]);

useEffect(() => {
  if (fraccionamientosData?.fraccionamientos) {
    setFraccionamientos(fraccionamientosData.fraccionamientos);
  }
}, [fraccionamientosData]);

useEffect(() => {
  //console.log("Fraccionamiento seleccionado:", fraccionamientoSeleccionado);
  if (fraccionamientoSeleccionado) {
    getCasas({ variables: { fraccionamientoId: fraccionamientoSeleccionado } });
    /* setCasas([]);
    setCasaSeleccionada(''); */
  }
}, [fraccionamientoSeleccionado]);

useEffect(() => {
  if (casasData?.obtenerCasas) {    
    console.log("Casas recibidas:", casasData.obtenerCasas);
    setCasas(casasData.obtenerCasas);
  }
}, [casasData]);


  const Guardar = async () => {

    //Validar
    if(nombre === '' || email === '' || password === ''){
      //Mostrar un error
      showSnackbar('Todos los campos son obligatorios');
      return;
    }
  }

  return (
    <View style={styles.container}>
        <LinearGradient
          colors={displayGreen}
          style={gradientStyle}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        >
            <View style={[styles.container, globalStyles.contenedor]}>
            
            <Text style={globalStyles.titulo}>{t('createAccount')}</Text>
            
            <Text style={styles.label}>Selecciona un país:</Text>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={paisSeleccionado}
                onValueChange={(value) => setPaisSeleccionado(value)}
                style={styles.picker}
              >
                <Picker.Item label="-- Selecciona un país --" value="" />
                {!loadingPaises && paisesData?.obtenerPaises.map((pais) => (
                  <Picker.Item key={pais.id} label={pais.nombre} value={pais.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Selecciona un estado:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={estadoSeleccionado}
                onValueChange={(value) => setEstadoSeleccionado(value)}
                style={styles.picker}
                enabled={!!paisSeleccionado}
              >
                <Picker.Item label="-- Selecciona un estado --" value="" />
                {!loadingEstados && estadosData?.obtenerEstados.map((estado) => (
                  <Picker.Item key={estado.id} label={estado.nombre} value={estado.id} />
                ))}
              </Picker>
            </View>

            {estadoSeleccionado !== '' && (
              <Text style={styles.resultado}>
                Estado seleccionado: {estadoSeleccionado}
              </Text>
            )}

            <Text style={styles.label}>Fraccionamiento</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={fraccionamientoSeleccionado}
                onValueChange={(value) => setFraccionamientoSeleccionado(value)}
                style={styles.picker}
              >
                <Picker.Item label="-- Selecciona un fraccionamiento --" value="" />
                {fraccionamientos.map(f => (
                  <Picker.Item key={f.id} label={f.nombre} value={f.id} />
                ))}
              </Picker>
            </View>
            
            <Text style={styles.label}>Casa</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={casaSeleccionada}
                onValueChange={(value) => setCasaSeleccionada(value)}
                style={styles.picker}
                enabled={!!fraccionamientoSeleccionado}
              >
                <Picker.Item label="-- Selecciona una casa --" value="" />
                {casas.map(casa => (
                  <Picker.Item key={casa.id} label={casa.direccion} value={casa.id} />
                ))}
              </Picker>
            </View>


            <TextInput
                label= {t('name')}
                value={nombre}
                onChangeText={guardarNombre}
                style={[globalStyles.input, { backgroundColor: '#f1f1f1' }]} // Fondo gris claro
            />

            <TextInput
                label={t('email')}
                value={email}
                onChangeText={guardarEmail}
                style={[globalStyles.input, { backgroundColor: '#f1f1f1' }]} // Fondo gris claro
            />

            <TextInput
                label={t('password')}
                secureTextEntry
                value={password}
                onChangeText={guardarPassword}
                style={[globalStyles.input, { backgroundColor: '#f1f1f1' }]} // Fondo gris claro
            />

            <Button   mode="contained" 
                        onPress={Guardar} 
                        style={globalStyles.boton}>
                <Text style={globalStyles.botonTexto}>{t('createAccount')}</Text>        
            </Button>
            
            </View>
        </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  label: {
    marginTop: 10,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    backgroundColor: '#f1f1f1',    
    marginBottom: 10,
     marginTop: Platform.OS === 'android' ? 5 : 0,
  },
  resultado: {
    marginTop: 20,
    fontWeight: 'bold',
  },
   
  });

export default CrearUsuario
