import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, ActivityIndicator, TextInput, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, List, Avatar, Icon } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Se asume que estos queries y mutaciones existen
import { OBTENER_USUARIOS } from '../graphql/queries/usuarioQueries';
import { HABILITAR_USUARIO_MUTATION, DESHABILITAR_USUARIO_MUTATION } from '../graphql/mutations/usuariosMutations';

const DeshabilitaUsuarios = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { data: usuariosData, loading: usuariosLoading, error: usuariosError, refetch } =
    useQuery(OBTENER_USUARIOS);

  const [deshabilitarUsuario] = useMutation(DESHABILITAR_USUARIO_MUTATION, {
    refetchQueries: [{ query: OBTENER_USUARIOS }],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.log("Error deshabilitar:", error.message, error.graphQLErrors, error.networkError);
      Alert.alert('Error', 'No se pudo deshabilitar el usuario.');
    }
  });

  const [habilitarUsuario] = useMutation(HABILITAR_USUARIO_MUTATION, {
    refetchQueries: [{ query: OBTENER_USUARIOS }],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.log("Error habilitar:", error.message, error.graphQLErrors, error.networkError);
      Alert.alert('Error', 'No se pudo habilitar el usuario.');
    }
  });

  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState({});
  const [filtroNombre, setFiltroNombre] = useState('');

  useEffect(() => {
    if (usuariosData && usuariosData.obtenerUsuarios) {
      setUsuarios(usuariosData.obtenerUsuarios);
    }
  }, [usuariosData]);

  const handleToggleUsuario = async (usuario) => {
    const id = usuario.id;
    if (loadingUsuarios[id]) return;

    setLoadingUsuarios(prev => ({ ...prev, [id]: true }));

    try {
      let nuevoEstadoHabilitado;
      if (usuario.habilitado) {
        await deshabilitarUsuario({ variables: { idUsuario: id } });
        nuevoEstadoHabilitado = false;
      } else {
        await habilitarUsuario({ variables: { idUsuario: id } });
        nuevoEstadoHabilitado = true;
      }

      // Actualizar estado local de usuarios
      setUsuarios(prevUsuarios =>
        prevUsuarios.map(u =>
          u.id === id ? { ...u, habilitado: nuevoEstadoHabilitado } : u
        )
      );

      // Actualizar AsyncStorage del usuario actual si aplica
      const usuarioActualJSON = await AsyncStorage.getItem('usuarioActual');
      if (usuarioActualJSON) {
        const usuarioActual = JSON.parse(usuarioActualJSON);
        if (usuarioActual.id === id) {
          usuarioActual.habilitado = nuevoEstadoHabilitado;
          await AsyncStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
        }
      }

      // Guardar también la clave global "habilitado" para la Home
      await AsyncStorage.setItem('habilitado', nuevoEstadoHabilitado.toString());

      // Refrescar la lista desde el servidor
      await refetch();

    } catch (e) {
      console.error("Error toggle:", e.message);
      Alert.alert('Error', 'No se pudo actualizar el usuario.');
    } finally {
      setLoadingUsuarios(prev => ({ ...prev, [id]: false }));
    }
  };

  if (usuariosLoading) {
    return <Text style={styles.loadingText}>Cargando usuarios...</Text>;
  }

  if (usuariosError) {
    return <Text style={styles.errorText}>Error al cargar usuarios: {usuariosError.message}</Text>;
  }

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  return (
    <LinearGradient colors={['#74a2af', '#11505e']} style={styles.gradientContainer}>
      <View style={styles.container}>

        {/* Input para filtrar */}
        <TextInput
          placeholder="Buscar por nombre"
          value={filtroNombre}
          onChangeText={setFiltroNombre}
          style={styles.inputFiltro}
        />

        <View style={{ flex: 1, marginTop: 16 }}>
          {usuariosFiltrados && (
            <FlatList
              data={usuariosFiltrados}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <List.Item
                  title={item.nombre}
                  description={`${item.email}\nLote: ${item.lote ?? 'No asignado'}`}
                  left={() =>
                    <Avatar.Icon
                      size={40}
                      icon={item.habilitado ? "check-circle" : "close-circle"}
                      color={item.habilitado ? "green" : "red"}
                      style={{ backgroundColor: 'transparent' }}
                    />
                  }
                  right={() => (
                    <Button
                      mode="contained"
                      compact
                      onPress={() => handleToggleUsuario(item)}
                      disabled={loadingUsuarios[item.id]}
                      style={{
                        marginRight: 3,
                        width: 45,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 8,
                        backgroundColor: item.habilitado ? '#d9534f' : '#5cb85c',
                        opacity: loadingUsuarios[item.id] ? 0.6 : 1,
                      }}
                    >
                      {loadingUsuarios[item.id] ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Icon
                          source={item.habilitado ? 'account-cancel' : 'account-check'}
                          size={20}
                          color="white"
                        />
                      )}
                    </Button>
                  )}
                  style={{
                    marginBottom: 5,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 5,
                  }}
                />
              )}
            />
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© {new Date().getFullYear()} EasyFracc</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  container: { flex: 1, padding: 16 },
  footer: { padding: 16, alignItems: 'center' },
  footerText: { fontSize: 16, color: 'white' },
  loadingText: { flex: 1, textAlign: 'center', marginTop: 20, color: 'white' },
  errorText: { flex: 1, textAlign: 'center', marginTop: 20, color: 'red' },
  inputFiltro: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
});

export default DeshabilitaUsuarios;
