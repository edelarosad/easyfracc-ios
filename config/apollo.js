import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';


const httpLink = createHttpLink({
  uri: 'https://uptaskgraphqlbackend.onrender.com' //'https://uptaskgraphqlbackend.onrender.com' //'http://192.168.100.3:4000/' //'https://uptaskgraphqlbackend.onrender.com' //'http://127.0.0.1:4000'
});

const authLink = new ApolloLink(async (operation, forward) => {
  // Leer el token
  const token = await AsyncStorage.getItem('token');

  // Añadir el token al header de autorización
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });

  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([authLink, httpLink]), // Combina los links
});

  export default client;