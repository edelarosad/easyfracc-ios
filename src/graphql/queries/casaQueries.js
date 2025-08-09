import { gql } from '@apollo/client';

export const OBTENER_CASAS = gql`
  query obtenerCasas($fraccionamientoId: ID!) {
    obtenerCasas(fraccionamientoId: $fraccionamientoId) {
      id
      direccion
    }
  }
`;
