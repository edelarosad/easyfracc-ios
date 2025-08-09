import { gql } from '@apollo/client';

export const OBTENER_FRACCIONAMIENTOS = gql`
  query fraccionamientos($estadoId: ID!) {
    fraccionamientos(estadoId: $estadoId) {
      id
      nombre
    }
  }
`;
