import { gql } from '@apollo/client';

export const NUEVA_TAREA = gql`
mutation NuevaTarea($input: TareaInput) {
  nuevaTarea(input: $input) {
    nombre
    id
    proyecto
    estado
  }
}  
`; 