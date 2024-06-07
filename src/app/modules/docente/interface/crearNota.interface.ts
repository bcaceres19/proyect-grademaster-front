import { Docente } from "../../administrativo/interface/docente.interface";
import { Materia } from "../../administrativo/interface/materia.interface";

export interface CrearNota{
    codigoNota?:string;
    porcentajeNota?:number;
    nrNota?:number;
    materiaEntityFk?:Materia;
    docenteEntityFk?:Docente;
}