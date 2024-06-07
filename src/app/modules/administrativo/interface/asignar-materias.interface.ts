import { Docente } from "./docente.interface";
import { Materia } from "./materia.interface";
import { Semestre } from "./semestre.interface";

export interface AsignarMaterias{

    semestreDto?:Semestre,
    docenteDto?:Docente,
    materiasAsignar?:Materia[]

}