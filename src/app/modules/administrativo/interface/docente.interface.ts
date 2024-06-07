import { Estado } from "./estado.interface";

export interface Docente {

    codigoDocente?:string|null;

    nombres?:string|null;

    apellidos?:string|null;

    edad?:string|null;

    correoPersonal?:string|null;

    correoUniversitario?:string|null;

    genero?:string|null;

    telefono?:string|null;

    urlImagen?:string|null;

    estadoEntityFk?:Estado|null;

    cedulaDocente?:string|null;

}
