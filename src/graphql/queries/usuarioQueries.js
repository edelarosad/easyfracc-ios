import { gql } from '@apollo/client';

export const OBTENER_USUARIOS = gql`
query {
  obtenerUsuarios {
    id
    nombre
    email
    roles
    noTarjeta
    lote
    habilitado
    idZkteco
  }
}

`;
