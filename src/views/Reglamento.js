import React from 'react';
import { View, Text, Button, PermissionsAndroid, Platform, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import Share from 'react-native-share';

const Reglamento = () => {
  const pdfUrl = "https://www.orimi.com/pdf-test.pdf";
  const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;

  const descargarPDF = async () => {
    try {
     /*  if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Permiso denegado", "No se puede guardar el archivo sin permiso.");
          return;
        }
      } */

      await Share.open({
        title: 'Reglamento',
        url: pdfUrl,
        type: 'application/pdf',
        failOnCancel: false,
      });
    } catch (error) {
      console.log("Error al compartir:", error);
      Alert.alert("Error", "No se pudo compartir el archivo.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Reglamento de la comunidad
      </Text>

      {/* Limita la altura del visor PDF */}
      <WebView 
        source={{ uri: viewerUrl }}
        style={{ height: 400, borderRadius: 10 }}
        originWhitelist={['*']}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Descargar PDF" onPress={descargarPDF} />
      </View>
    </View>
  );
};

export default Reglamento;
