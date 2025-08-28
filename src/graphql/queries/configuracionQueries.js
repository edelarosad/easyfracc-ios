import { gql } from '@apollo/client';

export const OBTENER_CONFIGURACION = gql`
  query ObtenerConfiguracion {
    obtenerConfiguracion {
      NomFraccionamiento
      DirFraccionamiento
      horaMaxProveedor
      # otros campos si quieres
    }
  }
`;
