import { Materia } from "../modules/administrativo/interface/materia.interface";

export interface EstudianteMateria{
    materiasAsignadas:Materia[],
    materiasNoAsignadas:Materia[]
}