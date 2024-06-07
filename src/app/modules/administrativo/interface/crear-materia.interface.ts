import { HorarioMaterias } from "./horario-materias.interface";
import { Materia } from "./materia.interface";
import { Semestre } from "./semestre.interface";

export interface CrearMateria{
    materia?:Materia,
    horarios?:HorarioMaterias[],
    semestre?:Semestre
}