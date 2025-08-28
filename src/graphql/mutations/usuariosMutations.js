import { gql } from '@apollo/client';

export const NUEVA_CUENTA = gql`
  mutation CrearUsuario($input: UsuarioInput) {
  crearUsuario(input: $input)
}`; 

export const HABILITAR_USUARIO_MUTATION = gql`
 mutation HabilitarYRecrearUsuario($idUsuario: ID!) {
    habilitarYRecrearUsuario(idUsuario: $idUsuario) {
       id
      nombre
      email
      roles
      noTarjeta
      lote
      habilitado
      idZkteco
    }
  }`;

export const DESHABILITAR_USUARIO_MUTATION = gql`
 mutation DeshabilitarYRecrearUsuario($idUsuario: ID!) {
    deshabilitarYRecrearUsuario(idUsuario: $idUsuario) {
      id
      nombre
      email
      roles
      noTarjeta
      lote
      habilitado
      idZkteco
    }
  }`;
  
export const ABRIR_PUERTA_MUTATION = gql`
  mutation AbrirPuerta($nombrePuerta: String, $intervaloPuerta: Int) {
    abrirPuerta(nombrePuerta: $nombrePuerta, intervaloPuerta: $intervaloPuerta) {
      message
    }
  }
`;

export const CERRAR_PUERTA_MUTATION = gql`
  mutation CerrarPuerta($nombrePuerta: String) {
    cerrarPuerta(nombrePuerta: $nombrePuerta) {
      message
    }
  }
`;