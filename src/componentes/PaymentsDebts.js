import React , { useState }  from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, List } from 'react-native-paper';
import { gql, useMutation, useQuery } from '@apollo/client';

const PaymentsDebts = ({pago, onPress }) => {
    const [localPago, setLocalPago] = useState(pago);

    const cambiarEstado = async () =>{    
        
        setLocalPago(prev => ({ ...prev, pagado: !prev.pagado }));
       }
 
     //Dialogo para eliminar o no una tarea
     const mostraEliminar = () =>{
         Alert.alert('Eliminar Tarea', '¿Deseas elimnar esta tarea?',[
             {
                 text: 'Cancelar',
                 style: 'cancel'
             },
             {
                 text: 'Confirmar',
                 //onPress:() => elimnarTareaDB()
                 
             }
         ])
     }

  return (
    <List.Item 
    title={pago.mes}
    titleStyle={{ flex: 1 }}
    right={() => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ marginRight: 20, color: 'black', fontWeight: 'bold'  }}>
                ${pago.monto}
            </Text>
            {/* {pago.pagado
                ? (<List.Icon icon="check-circle" color="green" size={30} />)
                : (<List.Icon icon="check-circle" color="#E1E1E1" size={30} />)} */}
                <List.Icon
                    icon="check-circle"
                    color={pago.pagado ? "green" : "#E1E1E1"}
                    size={30}
                    />
         </View>
    )}
    onPress={ onPress }
    onLongPress={ () => mostraEliminar() }
    />
  );
};

const styles = StyleSheet.create({
    icono:{
        fontSize:30
    },
    completo:{
        color: 'green'
    },
    incompleto:{
        color: '#E1E1E1'
    },
})

export default PaymentsDebts
