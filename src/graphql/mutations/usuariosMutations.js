import { gql } from '@apollo/client';

export const NUEVA_CUENTA = gql`
  mutation CrearUsuario($input: UsuarioInput) {
  crearUsuario(input: $input)
}`; 

