import { Carrera } from "./carrera.interface";
import { Estado } from "./estado.interface";
import { EstadosUsuario } from "./estados-usuario.interface";

export interface Estudiante {

    codigoEstudiante?:string|null;

    correoUniversitario?:string|null;

    edad?:string|null;

    telefono?:string|null;

    apellidos?:string|null;

    nombres?:string|null;

    correoPersonal?:string|null;

    genero?:string|null;

    codigoImagen?:string|null;

    codigoCarreraEntityFk?:Carrera|null;

    estadoEntityFk?:Estado|null;

    cedulaEstudiante?:string|null;

}
