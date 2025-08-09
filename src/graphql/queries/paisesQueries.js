import { gql } from '@apollo/client';

export const OBTENER_PAISES = gql`
  query ObtenerPaises {
    obtenerPaises {
      id
      nombre
    }
  }
`;