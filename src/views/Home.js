import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Icon } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Translate
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [roles, setRoles] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isResidente, setIsResidente] = useState(false);
  const [isSoporte, setIsSoporte] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [habilitado, setHabilitado] = useState(true);

  const fetchRoles = async () => {
    const rolesStorage = await AsyncStorage.getItem('userRoles');
    const parsedRoles = rolesStorage ? JSON.parse(rolesStorage) : [];
    setRoles(parsedRoles);
    setIsAdmin(parsedRoles.includes('admin'));
    setIsResidente(parsedRoles.includes('residente'));
    setIsSoporte(parsedRoles.includes('soporte'));

    // Leer habilitado desde AsyncStorage
    const habilitadoStorage = await AsyncStorage.getItem('habilitado');
    setHabilitado(habilitadoStorage !== 'false'); // true por defecto
    setLoadingRoles(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // 🔥 Esto refresca valores cada vez que entras a la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchRoles();
    }, [])
  );

  const showForRole = (allowedRoles = []) => {
    if (roles.length === 0) return false;
    if (isAdmin && allowedRoles.includes('admin')) return true;
    if (isResidente && allowedRoles.includes('residente')) return true;
    if (isSoporte && allowedRoles.includes('soporte')) return true;
    return false;
  };

  if (loadingRoles) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando roles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Primera fila */}
      <View style={styles.row}>
        {showForRole(['admin', 'residente', 'soporte']) && (
          <View style={[styles.col, styles.colShadow]}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => navigation.navigate('VisitasMenu')}
              disabled={!habilitado}
            >
              <View style={styles.buttonContent}>
                <Icon
                  source="account-key"
                  size={60}
                  color={habilitado ? '#48c59c' : 'gray'}
                />
                <Text style={styles.buttonText}>{t('visitors')}</Text>
              </View>
            </Button>
          </View>
        )}

        {showForRole(['admin', 'residente', 'soporte']) && (
          <View style={[styles.col, styles.colShadow]}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => navigation.navigate('QrGenerator')}
            >
              <View style={styles.buttonContent}>
                <Icon source="qrcode" size={60} color="#48c59c" />
                <Text style={styles.buttonText}>{t('VisitorAccess')}</Text>
              </View>
            </Button>
          </View>
        )}
      </View>

      {/* Segunda fila */}
      <View style={styles.row}>
        {showForRole(['admin', 'residente', 'soporte']) && (
          <View style={[styles.col, styles.colShadow]}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => navigation.navigate('CambioContraseña')}
            >
              <View style={styles.buttonContent}>
                <Icon source="form-textbox-password" size={60} color="#48c59c" />
                <Text style={styles.buttonText}>{t('changePassword')}</Text>
              </View>
            </Button>
          </View>
        )}

        {showForRole(['admin', 'soporte']) && (
          <View style={[styles.col, styles.colShadow]}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => navigation.navigate('DeshabilitaUsuarios')}
            >
              <View style={styles.buttonContent}>
                <Icon source="account-group" size={60} color="#48c59c" />
                <Text style={styles.buttonText}>{t('users')}</Text>
              </View>
            </Button>
          </View>
        )}
      </View>

      {/* Tercera fila */}
      <View style={styles.row}>
        {showForRole(['soporte']) && (
          <View style={[styles.col, styles.colShadow]}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => navigation.navigate('VisitasMenu')}
            >
              <View style={styles.buttonContent}>
                <Icon source="home-account" size={60} color="#48c59c" />
                <Text style={styles.buttonText}>{t('MyHouse')}</Text>
              </View>
            </Button>
          </View>
        )}

        {showForRole(['soporte']) && (
          <View style={[styles.col, styles.colShadow]}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => console.log('Botón Phone presionado')}
            >
              <View style={styles.buttonContent}>
                <View style={{ position: 'relative' }}>
                  <Icon source="bullhorn" size={70} color="#48c59c" />
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>3</Text>
                  </View>
                  <Text style={styles.buttonText}>{t('Notices')}</Text>
                </View>
              </View>
            </Button>
          </View>
        )}
      </View>

      {/* Cuarta fila */}
      <View style={styles.row}>
        {showForRole(['soporte']) && (
          <View style={[styles.col, styles.colShadow]}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => navigation.navigate('Houses')}
            >
              <View style={styles.buttonContent}>
                <Icon source="cog" size={60} color="#48c59c" />
                <Text style={styles.buttonText}>{t('Settings')}</Text>
              </View>
            </Button>
          </View>
        )}

        {showForRole(['soporte']) && (
          <View style={[styles.col, styles.colShadow]}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => navigation.navigate('Reglamento')}
            >
              <View style={styles.buttonContent}>
                <Icon source="home-export-outline" size={60} color="#48c59c" />
                <Text style={styles.buttonText}>{t('SwitchHouse')}</Text>
              </View>
            </Button>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.text}>© {new Date().getFullYear()} EasyFracc</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginVertical: 8 },
  col: { flex: 1, marginHorizontal: 8 },
  colShadow: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  button: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
  buttonContent: { alignItems: 'center', justifyContent: 'center' },
  buttonText: { marginTop: 8, color: 'black', fontSize: 13, fontWeight: 'bold', textAlign: 'center' },
  footer: { padding: 16, alignItems: 'center', backgroundColor: 'black' },
  text: { fontSize: 16, color: 'white' },
  badge: {
    position: 'absolute',
    top: -1,
    right: 15,
    backgroundColor: 'red',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    minWidth: 24,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: { color: 'white', fontSize: 15, fontWeight: 'bold' },
});

export default Home;
