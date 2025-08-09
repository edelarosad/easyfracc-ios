import { gql } from '@apollo/client';

export const OBTENER_PROYECTOS = gql`
  query ObtenerProyectos {
    obtenerProyectos {
      id
      nombre
    }
  }
`;

