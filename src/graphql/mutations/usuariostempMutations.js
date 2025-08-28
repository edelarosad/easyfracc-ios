import { gql } from '@apollo/client';

export const CREAR_USUARIO_TEMPORAL = gql`
  mutation CrearUsuarioTemporal(
    $nombre: String!
    $lote: String!
    $creadoPor: String!
    $vigencia: String!
    $esProveedor: Boolean!
  ) {
    crearUsuarioTemporal(
      nombre: $nombre
      lote: $lote
      creadoPor: $creadoPor
      vigencia: $vigencia
       esProveedor: $esProveedor
    ) {
      id
      nombre
      lote
      creadoPor
      fechaDeCreacion
      vigencia
      idZkteco
      noTarjeta
      QR
      esProveedor
    }
  }
`;
