import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Image, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//###### Views
import Login from './src/views/Login';
import Home from './src/views/Home';
import QrGenerator from './src/views/QrGenerator';
import RegistroVisitante from './src/views/RegistroVisitante';
import BalanceClient from './src/views/BalanceClient';
import BalanceAdmin from './src/views/BalanceAdmin';
import UploadImage from './src/views/UploadImage';
import Houses from './src/views/Houses';
import CrearUsuario from './src/views/CrearUsuario';
import Reglamento from './src/views/Reglamento';
import CambioContraseña from './src/views/CambioContraseña';
import ConsultarUsuario from './src/views/ConsultarUsuario';
import QRTemporal from './src/views/QRTemporal';
import VisitasMenu from './src/views/VisitasMenu';

//###### Images
import logo from './assets/images/logoConinttec.png'; 
import logoEasy from './assets/brand/Variantes-03.png'; 


import theme from './src/styles/theme';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { SnackbarProvider } from './src/componentes/SnackbarContext';
import { SafeAreaProvider  } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

import i18n from './src/Translate/i18n'; 

const Stack = createStackNavigator();

const App = () => {
  const { t, i18n } = useTranslation();

  return (
    <SafeAreaProvider>
    <I18nextProvider i18n={i18n}>
      <SnackbarProvider >
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">

              <Stack.Screen 
                name="Login" 
                component={Login} 
                options={{
                          title: t('login'),
                          headerShown: false
                          }} />
                        
              <Stack.Screen
                  name="Home"
                  component={Home}
                  options={{                            
                            //title: t('nameApp'),   
                            headerTitle: () => null,
                            
                            headerStyle:{
                              backgroundColor:'#548795',
                              
                            },                                    
                            headerTintColor:'#FFF',
                            headerTitleStyle:{
                              fontWeight:'bold'
                            },
                            headerTitleAlign:'center',
                            headerRight: () => (                              
                              <Image
                                source={logoEasy}
                                style={{ width: 100, height: 50,  borderRadius: 25, marginRight: 15, resizeMode: 'contain' }} // Agregamos marginRight
                              />                              
                            )
                             
                                                       
                            }} />
              <Stack.Screen
                  name="QrGenerator"
                  component={QrGenerator}
                  options={{                  
                            //title: t('nameApp'),      
                            headerTitle: () => null,                        
                            
                            headerStyle:{
                              backgroundColor:'#548795',
                              
                            },                                    
                            headerTintColor:'#FFF',
                            headerTitleStyle:{
                              fontWeight:'bold'
                            },
                            headerTitleAlign:'center',
                            headerRight: () => (                              
                              <Image
                                source={logoEasy}
                                style={{ width: 100, height: 50,  borderRadius: 25, marginRight: 15, resizeMode: 'contain' }} // Agregamos marginRight
                              />                              
                            )
                            
                            }} />
              <Stack.Screen
                  name="BalanceClient"
                  component={BalanceClient}
                  options={{                            
                            title: t('nameApp'),   
                            
                            headerStyle:{
                              backgroundColor:'#548795',
                              
                            },                                    
                            headerTintColor:'#FFF',
                            headerTitleStyle:{
                              fontWeight:'bold'
                            },
                            headerTitleAlign:'center',
                            headerRight: () => (                              
                              <Image
                                source={logo}
                                style={{ width: 100, height: 50,  borderRadius: 25, marginRight: 15, resizeMode: 'contain' }} // Agregamos marginRight
                              />                              
                            )
                             
                                                       
                            }} />
              <Stack.Screen
                  name="BalanceAdmin"
                  component={BalanceAdmin}
                  options={{                            
                            title: 'Admin', //t('nameApp'),   
                            
                            headerStyle:{
                              backgroundColor: '#548743', //'#548795',
                              
                            },                                    
                            headerTintColor:'#FFF',
                            headerTitleStyle:{
                              fontWeight:'bold'
                            },
                            headerTitleAlign:'center',
                            headerRight: () => (                              
                              <Image
                                source={logo}
                                style={{ width: 100, height: 50,  borderRadius: 25, marginRight: 15, resizeMode: 'contain' }} // Agregamos marginRight
                              />                              
                            )
                             
                                                       
                            }} />
               <Stack.Screen
                  name="RegistroVisitante"
                  component={RegistroVisitante}
                  options={{                  
                            title: t('nameApp'),   
                            
                            headerStyle:{
                              backgroundColor:'#548795',
                              
                            },                                    
                            headerTintColor:'#FFF',
                            headerTitleStyle:{
                              fontWeight:'bold'
                            },
                            headerTitleAlign:'center',
                            headerRight: () => (
                              <Icon
                                  name="home" // Nombre del icono que quieres usar
                                  size={44} // Tamaño del icono
                                  color="#FFF" // Color del icono
                                  style={{ marginRight: 10 }} // Margen izquierdo para separarlo del borde
                                  onPress={() => console.log('Icono Home presionado')} // Acción al presionar el icono
                              />
                            )
                            
                            }} />
                <Stack.Screen
                  name="UploadImage"
                  component={UploadImage}
                  options={{                  
                            title: t('nameApp'),   
                            
                            headerStyle:{
                              backgroundColor:'#548795',
                              
                            },                                    
                            headerTintColor:'#FFF',
                            headerTitleStyle:{
                              fontWeight:'bold'
                            },
                            headerTitleAlign:'center',
                            headerRight: () => (                              
                              <Image
                                source={logo}
                                style={{ width: 100, height: 50,  borderRadius: 25, marginRight: 15, resizeMode: 'contain' }} // Agregamos marginRight
                              />  
                            )
                            
                            }} />
                <Stack.Screen
                  name="Houses"
                  component={Houses}
                  options={{                  
                            title: t('nameApp'),   
                            
                            headerStyle:{
                              backgroundColor:'#548795',
                              
                            },                                    
                            headerTintColor:'#FFF',
                            headerTitleStyle:{
                              fontWeight:'bold'
                            },
                            headerTitleAlign:'center',
                            headerRight: () => (                              
                              <Image
                                source={logo}
                                style={{ width: 100, height: 50,  borderRadius: 25, marginRight: 15, resizeMode: 'contain' }} // Agregamos marginRight
                              />  
                            )
                            
                            }} />
                  <Stack.Screen
                  name="CrearUsuario"
                  component={CrearUsuario}
                  options={{                  
                            title: t('nameApp'),   
                            
                            headerStyle:{
                              backgroundColor:'#548795',
                              
                            },                                    
                            headerTintColor:'#FFF',
                            headerTitleStyle:{
                              fontWeight:'bold'
                            },
                            headerTitleAlign:'center',
                            headerRight: () => (                              
                              <Image
                                source={logo}
                                style={{ width: 100, height: 50,  borderRadius: 25, marginRight: 15, resizeMode: 'contain' }} // Agregamos marginRight
                              />  
                            )
                            
                            }} />
                  
                  <Stack.Screen
                  name="Reglamento"
                  component={Reglamento}
                  options={{                  
                            title: t('nameApp'),   
                            
                            headerStyle:{
                              backgroundColor:'#548795',
                              
                            },                                    
                            headerTintColor:'#FFF',
                            headerTitleStyle:{
                              fontWeight:'bold'
                            },
                            headerTitleAlign:'center',
                            headerRight: () => (                              
                              <Image
                                source={logo}
                                style={{ width: 100, height: 50,  borderRadius: 25, marginRight: 15, resizeMode: 'contain' }} // Agregamos marginRight
                              />  
                            )
                            
                            }} />
                  
                  <Stack.Screen 
                name="CambioContraseña" 
                component={CambioContraseña} 
                options={{
                          title: t('changePassword'),
                          headerShown: false
                          }} />


                            <Stack.Screen
                  name="ConsultarUsuario"
                  component={ConsultarUsuario}
                  options={{                  
                            //title: t('ConsultarUsuario'),      
                            headerTitle: () => null,                        
                            
                            headerStyle:{
                              backgroundColor:'#548795',
                              
                            },                                    
                            headerTintColor:'#FFF',
                            headerTitleStyle:{
                              fontWeight:'bold'
                            },
                            headerTitleAlign:'center',
                            headerRight: () => (                              
                              <Image
                                source={logoEasy}
                                style={{ width: 100, height: 50,  borderRadius: 25, marginRight: 15, resizeMode: 'contain' }} // Agregamos marginRight
                              />                              
                            )
                            
                            }} />

                          <Stack.Screen
                  name="QRTemporal"
                  component={QRTemporal}
                  options={{                  
                            //title: t('QRTemporal'),      
                            headerTitle: () => null,                        
                            
                            headerStyle:{
                              backgroundColor:'#548795',
                              
                            },                                    
                            headerTintColor:'#FFF',
                            headerTitleStyle:{
                              fontWeight:'bold'
                            },
                            headerTitleAlign:'center',
                            headerRight: () => (                              
                              <Image
                                source={logoEasy}
                                style={{ width: 100, height: 50,  borderRadius: 25, marginRight: 15, resizeMode: 'contain' }} // Agregamos marginRight
                              />                              
                            )
                            
                            }} />
                          
                          <Stack.Screen
                  name="VisitasMenu"
                  component={VisitasMenu}
                  options={{                  
                            //title: t('VisitasMenu'),      
                            headerTitle: () => null,                        
                            
                            headerStyle:{
                              backgroundColor:'#548795',
                              
                            },                                    
                            headerTintColor:'#FFF',
                            headerTitleStyle:{
                              fontWeight:'bold'
                            },
                            headerTitleAlign:'center',
                            headerRight: () => (                              
                              <Image
                                source={logoEasy}
                                style={{ width: 100, height: 50,  borderRadius: 25, marginRight: 15, resizeMode: 'contain' }} // Agregamos marginRight
                              />                              
                            )
                            
                            }} />


                 </Stack.Navigator>
            </NavigationContainer>
          </PaperProvider>
        </SnackbarProvider>
      </I18nextProvider>
    </SafeAreaProvider>

    
  );
};

export default App;