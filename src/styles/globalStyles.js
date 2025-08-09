import { StyleSheet } from "react-native";
  
const globalStyles = StyleSheet.create({
  contenedor:{
    flex:1,
    justifyContent: 'center',
    //marginHorizontal: '2.5%',
    padding: 16,

  },
  contenido:{
    flexDirection:'column',
    justifyContent: 'center',
    marginHorizontal:'2.5%',
    flex: 1
  },
  titulo: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF'
  },
  subtitulo:{
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF',
    marginTop:20,

  },
  input: {
    backgroundColor:'#FFF',
    marginBottom: 12,
  },
  boton:{
    marginTop: 20,
    backgroundColor: '#28303B'
  },
  botonTexto:{
    textTransform:'uppercase',
    fontWeight:'bold',
    color:'#FFF'
  },
  enlace:{
    color:'#FFF',
    marginTop:60,
    textAlign:'center',
    fontWeight:'bold',
    fontSize:18,
    textTransform:'uppercase'
  },
  iconContainer: {
    alignItems: 'center', // Centrar el contenido
    position: 'absolute', // Posicionar de forma absoluta
    top: 10, // Espacio superior
    right: 10, // Espacio derecho
    flexDirection: 'column', // Aseguramos que el texto esté debajo del ícono
    justifyContent: 'center', // Centrado vertical
  },
  icon: {
    marginBottom: 2, // Espacio entre el ícono y el texto
  },
  languageText: {
    fontSize: 10, // Texto aún más pequeño
    color: '#fff', // Color blanco
    marginTop: -2, // Ajuste para pegar más el texto al ícono
  },
  

});

export default globalStyles;