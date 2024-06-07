import { Materia } from "../modules/administrativo/interface/materia.interface";

export interface MateriaDocente{
    materiasAsignadas:Materia[],
    materiasNoAsignadas:Materia[]
}