import { Carrera } from "./carrera.interface";
import { Materia } from "./materia.interface";

export interface CrearCarrera {

    carrera:Carrera | null;

    materias: Materia[] | null;

}
