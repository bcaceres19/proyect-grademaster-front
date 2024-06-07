import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, filter, forkJoin, map, of } from 'rxjs';
import { RespuestaGeneral } from '../interface/respuesta-general.interface';
import { ApiHttpConstants } from '../shared/api.constants';
import { RespuestaGeneralData } from '../interface/RespuestaDataGeneral.interface';

@Injectable({
  providedIn: 'root'
})
export class TransversalesService {

  constructor(private http:HttpClient) { }

  public getDataGeneral(carrera:boolean): Observable<RespuestaGeneralData>{
    return forkJoin({
      generos: this.getGeneros().pipe(
        catchError((e) => {
          console.log(e);
          return of(null); 
        })
      ),
      estados: this.getEstados().pipe(
        catchError((e) => {
          console.log(e);
          return of(null); 
        })
      ),
      carreras: this.getCarreras().pipe(
        catchError((e) => {
          console.log(e);
          return of(null); 
        }),
        map(carreras => (carrera ? carreras : null))
      )
    }
    );
  }

  public getGeneros():Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ADMINISTRATIVO}${ApiHttpConstants.URL_ADMINISTRATIVO}${ApiHttpConstants.GENEROS}${ApiHttpConstants.ALL_GENEROS}`
    )
  }

  public getEstados():Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ADMINISTRATIVO}${ApiHttpConstants.URL_ADMINISTRATIVO}${ApiHttpConstants.ESTADOS}${ApiHttpConstants.ALL_ESTADOS}`
    )
  }

  public getCarreras():Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ADMINISTRATIVO}${ApiHttpConstants.URL_ADMINISTRATIVO}${ApiHttpConstants.CARRERAS}${ApiHttpConstants.ALL_CARRERAS}`
    )
  }

  public getMaterias():Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ADMINISTRATIVO}${ApiHttpConstants.URL_ADMINISTRATIVO}${ApiHttpConstants.MATERIAS}${ApiHttpConstants.ALL_MATERIAS}`
    )
  }

  public getMateriasDocente(codigoDocente:string):Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_DOCENTE}${ApiHttpConstants.URL_DOCENTE}${ApiHttpConstants.ALL_MATERIAS_DOCENTES}`,
      {
        params:{
          "codigoDocente":codigoDocente
        }
      }
    )
  }

  public allNotasMateriaDocente(codigoDocente:string, codigoMateria:string,codigoEstudiante:string):Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_DOCENTE}${ApiHttpConstants.URL_DOCENTE}${ApiHttpConstants.NOTAS_DOCENTE}${ApiHttpConstants.ALL_NOTAS_MATERIA_DOCENTE}`,
      {
        params:{
          codigoDocente: codigoDocente,
          codigoMateria: codigoMateria,
          codigoEstudiante: codigoEstudiante
        }
      }
    )
  }

  public notaEstudiante(codigoEstudiante:string, codigoMateria:string, codigoNota:string):Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_DOCENTE}${ApiHttpConstants.URL_DOCENTE}${ApiHttpConstants.NOTAS_DOCENTE}${ApiHttpConstants.CONSEGUIR_NOTA_ESTUDIANTE}`,
      {
        params:{
          codigoEstudiante: codigoEstudiante,
          codigoMateria: codigoMateria,
          codigoNota:codigoNota
        }
      }
    )
  }

}
