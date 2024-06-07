import { RespuestaGeneral } from "./respuesta-general.interface";

export interface RespuestaGeneralData{
    generos?:RespuestaGeneral | null;
    estados?:RespuestaGeneral | null;
    carreras?:RespuestaGeneral | null;
}