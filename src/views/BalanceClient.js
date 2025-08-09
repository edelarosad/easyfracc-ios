import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity   } from 'react-native';
import { TextInput, Button, List, Divider  } from 'react-native-paper'; // Importar IconButton
import Icon from 'react-native-vector-icons/FontAwesome';

import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import  globalStyles from '../styles/globalStyles'; 
import { useSnackbar } from '../componentes/SnackbarContext'; 

import PaymentsDebts from '../componentes/PaymentsDebts';

const { height: screenHeight } = Dimensions.get('window');

const BalanceClient = ({ route }) => {
  
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();    
    const { showSnackbar } = useSnackbar();

    const imageUrl = route?.params?.imageUrl; 
    console.log(route.params);
    
    const [pagos, setPagos] = useState([
        { idmes:1,   mes: 'Enero',      monto: 100, pagado: false },
        { idmes:2,   mes: 'Febrero',    monto: 150, pagado: false },
        { idmes:3,   mes: 'Marzo',      monto: 80,  pagado: false },
        { idmes:4,   mes: 'Abril',      monto: 80,  pagado: false },
        { idmes:5,   mes: 'Mayo',       monto: 80,  pagado: false },
        { idmes:6,   mes: 'Junio',      monto: 80,  pagado: false },
        { idmes:7,   mes: 'Julio',      monto: 80,  pagado: false },
        { idmes:8,   mes: 'Agosto',     monto: 80,  pagado: false },
        { idmes:9,   mes: 'Septiembre', monto: 80,  pagado: false },
        { idmes:10,  mes: 'Octubre',    monto: 80,  pagado: false },
        { idmes:11,  mes: 'Noviembre',  monto: 80,  pagado: false },
        { idmes:12,  mes: 'Diciembre',  monto: 80,  pagado: false },
      ]);
    
      const [totalAPagar, setTotalAPagar] = useState(0);

      useEffect(() => {
        const total = pagos
            .filter(p => p.pagado)
            .reduce((acc, curr) => acc + curr.monto, 0);
        setTotalAPagar(total);
    }, [pagos]); 

    const handleCambiarEstado = (pago) => {
      console.log('handleCambiarEstado');
        const nuevosPagos = pagos.map(p =>
            p.idmes === pago.idmes ? { ...p, pagado: !p.pagado } : p
        );
        setPagos(nuevosPagos);
        console.log('Nuevos pagos:', nuevosPagos);

    };
   
    
    const handleSubmit = async () => {
        showSnackbar('Le diste click');
        return;
    };

    return (
        <View style={[styles.container, globalStyles.contenedor]}>
    
        <Text style={styles.title}>{t('PaymentsDebt')}</Text>
        {imageUrl ? (
          <>
           <TouchableOpacity onLongPress={() => navigation.navigate('UploadImage')}>
            <Image
                style={styles.ticket}
                source={{ uri: imageUrl }}
                resizeMode="contain"             
            />
          </TouchableOpacity>
         </>
         ) : (
          <>
            <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center' }}>              
              {t('NotImageUploadOne')}
            </Text>
          
            <Button mode="contained" onPress={ () => navigation.navigate('UploadImage')} style={globalStyles.boton}>
              <Text style={globalStyles.botonTexto}>{t('UploadImage')}</Text>              
            </Button>

          </>
        )}
        
        <View style={styles.totalContainer}>                
          <Text style={styles.totalTexto}>{t('PaymentAmount')} 
            <Text style={{fontWeight: 'bold', color: 'yellow' }}> ${totalAPagar}</Text>
          </Text>   
        </View>
        <ScrollView style={styles.scrollContainer}>
          <List.Section style={styles.contenido}>
            {pagos.map((pago, index, array) => (
              <React.Fragment key={`${pago.idmes}-${pago.pagado}`}>
                <PaymentsDebts  pago={pago} 
                                onPress={() => handleCambiarEstado(pago)}
                />
                {index < array.length - 1 && <Divider />} 
              </React.Fragment>
            ))}
          </List.Section>
        </ScrollView>

        <Button mode="contained" onPress={handleSubmit} style={globalStyles.boton}>
          <Text style={globalStyles.botonTexto}>{t('RecordPayment')}</Text>              
        </Button>
        
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },  
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 32,
      textAlign: 'center',
      color: 'black', // Color blanco para el texto
    },
    totalTexto: {
      fontSize: 24,
      fontWeight: 'medium',
      textAlign: 'center',
      color: 'white',
    },  
    ticket: {
      width: '100%',
      height: screenHeight * 0.40,
      marginVertical: 5
    },
    totalContainer: {
      backgroundColor: '#11505e', //'#28303B',
      padding: 10,
      borderRadius: 5,
      marginVertical: 10,
    },
    contenido: {
      backgroundColor: '#FFF',
      marginHorizontal: '2.5%',
    },
  });

export default BalanceClient
