import { gql } from '@apollo/client';

export const AUTENTICAR_USUARIO = gql`
  mutation AutenticarUsuario($input: AutenticarInput) {
  autenticarUsuario(input: $input) {
    token
    usuario {    
        id,
        nombre,    
        roles,
        noTarjeta,
        lote,
        habilitado,
        idZkteco
      }
  }
}`; 

export const ACTUALIZAR_CONTRASENA = gql` # Nombre de la constante más acorde
  mutation ActualizarContrasena($id: ID!, $nuevoPassword: String!) { # Nombres de variables y tipos acordes al backend
    actualizarPassword(id: $id, nuevoPassword: $nuevoPassword) {
      id # Puedes pedir el ID si lo necesitas
      email # Puedes pedir el email si lo necesitas
      message # El mensaje de confirmación
      success # Indicador de éxito
    }
  }
`;