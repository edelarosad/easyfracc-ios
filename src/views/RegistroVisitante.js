import React from 'react'
import { View, StyleSheet, Image, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../styles/globalStyles';

const RegistroVisitante = () => {
     const navigation = useNavigation();



  return (
    
    <View style={styles.container}>
        <ScrollView>
            <Text style={styles.titulo}>Entrada</Text>

            <View
            style={styles.listado}
            >
                <View style={styles.listadoItem}>
                    <Text style={styles.buttonText}>Etrada Vehicular 1</Text>
                    <Image
                        style={styles.mejores}
                        source={ require('../../assets/images/hospedaje1.jpg') }
                    />
                    
                </View>
                <View style={styles.listadoItem}>
                    <Text style={styles.buttonText}>Etrada Vehicular 2</Text>
                    <Image
                        style={styles.mejores}
                        source={ require('../../assets/images/hospedaje2.jpg') }
                    />
                </View>
                <View style={styles.listadoItem}>
                    <Text style={styles.buttonText}>Etrada Vehicular 3</Text>  
                    <Image
                        style={styles.mejores}
                        source={ require('../../assets/images/hospedaje3.jpg') }
                    />
                </View>
                <View style={styles.listadoItem}>
                    <Text style={styles.buttonText}>Etrada Peatonal 1</Text>
                    <Image
                        style={styles.mejores}
                        source={ require('../../assets/images/hospedaje4.jpg') }
                    />
                </View>
            </View>    
            <Text style={styles.titulo}>Salida</Text>

            <View
            style={styles.listado}
            >
                <View style={styles.listadoItem}>
                    <Text style={styles.buttonText}>Salida Peatonal 2</Text>
                    <Image
                        style={styles.mejores}
                        source={ require('../../assets/images/actividad1.jpg') }
                    />
                </View>
                <View style={styles.listadoItem}>
                    <Text style={styles.buttonText}>Salida Vehicular 1</Text>  
                    <Image
                        style={styles.mejores}
                        source={ require('../../assets/images/actividad2.jpg') }
                    />
                </View>
                <View style={styles.listadoItem}>
                    <Text style={styles.buttonText}>Salida Vehicular 2</Text>
                    <Image
                        style={styles.mejores}
                        source={ require('../../assets/images/actividad3.jpg') }
                    />
                </View>
                <View style={styles.listadoItem}>
                    <Text style={styles.buttonText}>Camara 1</Text>
                    <Image
                        style={styles.mejores}
                        source={ require('../../assets/images/actividad4.jpg') }
                    />
                </View>
            </View>        
        </ScrollView>
    </View>
    
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
      },  
    titulo: {
      fontWeight: 'bold',
      fontSize: 24,
      marginVertical: 20
    },   
    mejores: {
      width: '100%',
      height: 100,
      marginVertical: 5
    },
    listado: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    },
    listadoItem: {
      flexBasis: '48%'
    },
    buttonText: {
        marginTop: 8,
        color: 'black', // Color del texto del botón
      },
  });

export default RegistroVisitante
