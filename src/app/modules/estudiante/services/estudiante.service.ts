import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RespuestaGeneral } from 'src/app/interface/respuesta-general.interface';
import { ApiHttpConstants } from 'src/app/shared/api.constants';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  constructor(private http:HttpClient) { }


  public getMateriasEstudiantes(codigoEstudiante:string){
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ESTUDIANTE}${ApiHttpConstants.URL_ESTUDIANTE}${ApiHttpConstants.MATERIAS_ESTUDIANTE}`,
      {
        params: {
          codigoEstudiante: codigoEstudiante
        }
      }
    )
  } 

  public getCortesEstudiante(codigoEstudiante:string, codigoMateria:string){
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ESTUDIANTE}${ApiHttpConstants.URL_ESTUDIANTE}${ApiHttpConstants.NOTAS}${ApiHttpConstants.CORTES_ESTUDIANTE}`,
      {
        params: {
          codigoEstudiante: codigoEstudiante,
          codigoMateria: codigoMateria
        }
      }
    )
  }

  public getNotasCortes(numeroCorte:number, codigoEstudiante:string, codigoMateria:string){
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ESTUDIANTE}${ApiHttpConstants.URL_ESTUDIANTE}${ApiHttpConstants.NOTAS}${ApiHttpConstants.NOTAS_CORTE}`,
      {
        params: {
          numeroCorte: numeroCorte,
          codigoEstudiante: codigoEstudiante,
          codigoMateria:codigoMateria
        }
      }
    )
  }

}
