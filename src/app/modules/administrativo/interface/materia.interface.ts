import { Estado } from "./estado.interface";

export interface Materia {

    codigo?:string;

    nombre?:string;

    ncreditos?:string;

    estadoEntityFk?:Estado;

}
