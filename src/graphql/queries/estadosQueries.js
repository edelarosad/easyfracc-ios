import { gql } from '@apollo/client';

export const OBTENER_ESTADOS = gql`
  query ObtenerEstados($paisId: ID!) {
    obtenerEstados(paisId: $paisId) {
      id
      nombre
    }
  }
`;
