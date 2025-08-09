import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

//###### Images
import logo from '../../assets/images/logoConinttec.png';

//Trnaslate
import { useTranslation } from 'react-i18next';


const Home = () => {
  
  const { t, i18n } = useTranslation();

  const navigation = useNavigation();
 
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.col, styles.colShadow]}>
          <Button mode="contained" style={styles.button} onPress={() =>  navigation.navigate('VisitasMenu')} disabled={false}>
            <View style={styles.buttonContent}>
              <Icon source="account-key" size={60} color="#48c59c" />
              
              <Text style={styles.buttonText}>{t('visitors')}</Text>
            </View>
          </Button>
        </View>
        <View style={[styles.col, styles.colShadow]}>
          <Button mode="contained" style={styles.button} onPress={() => navigation.navigate("QrGenerator")}>
            <View style={styles.buttonContent}>
              <Icon source="qrcode" size={60} color="#48c59c" />
              <Text style={styles.buttonText}>{t('VisitorAccess')}</Text>
            </View>
          </Button>
        </View>
      </View>
      
      
      <View style={styles.row}>
        <View style={[styles.col, styles.colShadow]}>
          <Button mode="contained" style={styles.button} onPress={() => navigation.navigate("CambioContraseña")} disabled={false}>
            <View style={styles.buttonContent}>
              <Icon source="form-textbox-password" size={60} color="#48c59c" />
              <Text style={styles.buttonText}>{t('changePassword')}</Text>
            </View>
          </Button>
        </View>
        <View style={[styles.col, styles.colShadow]}>
          <Button mode="contained" style={styles.button} onPress={() =>  navigation.navigate("ConsultarUsuario")} disabled={false}>
            <View style={styles.buttonContent}>
              <Icon source="calendar-clock" size={60} color="#48c59c" />
              <Text style={styles.buttonText}>{t('ConsultarUsuario')}</Text>
            </View>
          </Button>
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.col, styles.colShadow]}>
          <Button mode="contained" style={styles.button} onPress={() => navigation.navigate("VisitasMenu")} disabled={true}>
            <View style={styles.buttonContent}>
              <Icon source="home-account" size={60} color="lightgray" />
              <Text style={styles.buttonText}>{t('MyHouse')}</Text>
            </View>
          </Button>
        </View>
        <View style={[styles.col, styles.colShadow]}>
          <Button mode="contained" style={styles.button} onPress={() => console.log('Botón Phone presionado')} disabled={true}>
            <View style={styles.buttonContent}>
              <View style={{ position: 'relative' }}>
                <Icon source="bullhorn" size={70} color="lightgray"/>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>3</Text>
                  </View>
                <Text Text style={styles.buttonText}>{t('Notices')}</Text>
              </View>
            </View>
          </Button>
        </View>
      </View>
      <View style={styles.row}>
      <View style={[styles.col, styles.colShadow]}>
          <Button mode="contained" style={styles.button} onPress={() => navigation.navigate("Houses")} disabled={true}>
            <View style={styles.buttonContent}>
              <Icon source="cog" size={60} color="lightgray" />
              <Text style={styles.buttonText}>{t('Settings')}</Text>
            </View>
          </Button>
        </View>
          <View style={[styles.col, styles.colShadow]}>
          <Button mode="contained" style={styles.button} onPress={() => navigation.navigate("Reglamento")} disabled={true}>
            <View style={styles.buttonContent}>
              <Icon source="home-export-outline" size={60} color='lightgray'/>
              <Text style={styles.buttonText}>{t('SwitchHouse')}</Text>
            </View>
          </Button>
          </View>
      </View>
          
      <View style={styles.footer}>
        <Text style={styles.text}>© 2025 EasyFracc</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: 'white', // Importante para que se vea la sombra
    borderRadius: 5,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',    
    backgroundColor: '#FFF', // Color de fondo del botón
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    marginTop: 8,
    color: 'black', // Color del texto del botón
    fontSize: 13,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: 'black', // Cambia el color de fondo a negro
    padding: 16,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: 'white', // Cambia el color del texto a blanco
  },
  badge: {
    position: 'absolute',
    top: -1,
    right: 15,
    backgroundColor: 'red',
    borderRadius: 12,
    borderWidth: 2, // Borde blanco alrededor
    borderColor: '#e0e0e0',//'white', // Borde blanco
    minWidth: 24,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    
  },
  
  badgeText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },

 
});

export default Home;