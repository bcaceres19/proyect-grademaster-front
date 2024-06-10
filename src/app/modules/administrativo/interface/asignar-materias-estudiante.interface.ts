import { Estudiante } from "./estudiante.interface";
import { Materia } from "./materia.interface";

export interface AsignarMateriasEstudiante{

    estudianteDto:Estudiante

    materiasAsignar:Materia[]

    materiasNoAsignadas:Materia[]

}