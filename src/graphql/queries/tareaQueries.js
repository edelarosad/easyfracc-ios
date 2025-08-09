import { gql } from '@apollo/client';

export const OBTENER_TAREAS = gql`
query ObtenerTareas($input: ProyectoIDInput) {
  obtenerTareas(input: $input) {
    nombre
    id
    proyecto
    estado
  }
}
`; 