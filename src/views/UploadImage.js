import React, { useState } from 'react';
import { View, Image, ActivityIndicator, Alert, StyleSheet, Text, Dimensions } from 'react-native';
import { TextInput, Button, List, Divider  } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import  globalStyles from '../styles/globalStyles'; 
import { useSnackbar } from '../componentes/SnackbarContext'; 

const { height: screenHeight } = Dimensions.get('window');

const UploadImage = () => {    
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();    
    const { showSnackbar } = useSnackbar();

    const [imageUri, setImageUri] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
  
    const pickImage = () => {
      launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, (response) => {
        if (response.didCancel || response.errorMessage) {
          console.log('Selección cancelada o error');
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[response.assets.length - 1].uri;
          setImageUri(uri);
          setUploadedUrl(null);
        }
      });
    };
  
    const uploadToCloudinary = async () => {
      if (!imageUri) return;
      setUploading(true);
  
      const data = new FormData();
      data.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });
      data.append('upload_preset', 'react_native_preset'); 
      data.append('cloud_name', 'dsvmxf8h7');   
  
      try {
        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/dsvmxf8h7/image/upload',
          data,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setUploadedUrl(res.data.secure_url);
        showSnackbar('Imagen subida correctamente', 'success');
        //console.log('Imagen subida:', res.data.secure_url);
        //console.log('Imagen uploadedUrl:', uploadedUrl);
        
        navigation.navigate('BalanceClient',{ imageUrl: res.data.secure_url })
      
    } catch (error) {
        Alert.alert('Error', 'No se pudo subir la imagen');
        showSnackbar(error.message);
        console.error(error);
      } finally {
        setUploading(false);
      }
    };
  
    return (
    <View style={[styles.container, globalStyles.contenedor]}>
      
        <Button mode="contained" onPress={pickImage} style={globalStyles.boton}>
            <Text style={globalStyles.botonTexto}>{t('SelectImage')}</Text>              
        </Button>
        {imageUri && 
            <Image source={{ uri: imageUri }} 
                    style={styles.ticket} 
                    resizeMode="contain" 
            />
            }
        {imageUri &&         
        <Button mode="contained" onPress={uploadToCloudinary} style={globalStyles.boton}>
            <Text style={globalStyles.botonTexto}>{t('UploadImage')}</Text>              
        </Button>
        
        }
        {uploading && <ActivityIndicator size="large" />}
        {uploadedUrl && (
          <>
            <Image source={{ uri: uploadedUrl }} style={{ width: 50, height: 50, marginTop: 10,}} />
          </>
        )}
      </View>    
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  ticket: {
    width: '100%',
    height: screenHeight * 0.70,
    marginVertical: 5
  },
  });

export default UploadImage
