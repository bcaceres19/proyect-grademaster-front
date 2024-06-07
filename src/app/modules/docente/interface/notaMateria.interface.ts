import { Materia } from "../../administrativo/interface/materia.interface";
import { Semestre } from "../../administrativo/interface/semestre.interface";
import { CrearNota } from "./crearNota.interface";
import { Estudiante } from "./estudiante.interface";
import { Notas } from "./notas.interface";

export interface NotaMateria{
    codigoSemestreEntityFk?:Semestre;
    codigoMateriaEntityFk?:Materia;
    codigoEstudianteEntityFk?:Estudiante;
    codigoNotaEntityFk?:CrearNota;
    valorNota?:number;
}