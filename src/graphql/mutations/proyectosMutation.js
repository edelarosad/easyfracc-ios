import gql from 'graphql-tag';

export const NUEVO_PROYECTO = gql`
  mutation NuevoProyecto($input: ProyectoInput) {
  nuevoProyecto(input: $input) {
    nombre
    id
  }
}`; 