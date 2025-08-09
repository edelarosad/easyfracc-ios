import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const StyleGreenGradient = () => {
  const { height } = Dimensions.get('window');
  const disneyPlusGreen = ['#11505e', '#74a2af'];

  const gradientStyle = StyleSheet.flatten([
    styles.gradient,
    { height: height },
  ]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={disneyPlusGreen}
        style={gradientStyle}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      >
        {/* Aquí puedes renderizar el resto del contenido de tu pantalla */}
        {/* Por ejemplo: <View style={styles.content}>...</View> */}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StyleGreenGradient;