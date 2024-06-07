import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaGeneral } from 'src/app/interface/respuesta-general.interface';
import { ApiHttpConstants } from 'src/app/shared/api.constants';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {

  constructor(private http:HttpClient) { }

  public getAllEstudiantesDocenteMateria(codigoDocente:string, codigoMateria:string):Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_DOCENTE}${ApiHttpConstants.URL_DOCENTE}${ApiHttpConstants.ESTUDIANTES_DOCENTE}`,
      {
        params: {
          codigoDocente: codigoDocente,
          codigoMateria: codigoMateria
        }
      }
    )
  }

  public getAllMateriasDocente(codigoDocente:string){
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_DOCENTE}${ApiHttpConstants.URL_DOCENTE}${ApiHttpConstants.MATERIAS_ASIGNADAS_DOCENTE}`,
      {
        params: {
          codigoDocente: codigoDocente
        }
      }
    )
  }

}
