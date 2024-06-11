import { NotasEstudiante } from "./notasEstudianteDto.interface";

export interface NotasSemestreDto{
    notasEstudianteDtos:NotasEstudiante[];
    notaFinalSemestre:number;
    notaFinalSemestreImaginaria:number;
}