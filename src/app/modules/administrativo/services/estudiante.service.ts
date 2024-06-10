import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaGeneral } from 'src/app/interface/respuesta-general.interface';
import { Estudiante } from '../interface/estudiante.interface';
import { ApiHttpConstants } from 'src/app/shared/api.constants';
import { AsignarMateriasEstudiante } from '../interface/asignar-materias-estudiante.interface';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  constructor(private http:HttpClient) { }

  public crearEstudiante(estudianteDto:Estudiante):Observable<RespuestaGeneral>{
    return this.http.post<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ESTUDIANTE}${ApiHttpConstants.URL_ESTUDIANTE}${ApiHttpConstants.CREAR_ESTUDIANTE}`,
      estudianteDto
    );
  }

  public generarCodigo(estudianteDto:Estudiante):Observable<RespuestaGeneral>{
    return this.http.post<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ESTUDIANTE}${ApiHttpConstants.URL_ESTUDIANTE}${ApiHttpConstants.GENERAR_CODIGO}`,
      estudianteDto
    );
  }

  public generarCorreo(estudianteDto:Estudiante):Observable<RespuestaGeneral>{
    return this.http.post<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ESTUDIANTE}${ApiHttpConstants.URL_ESTUDIANTE}${ApiHttpConstants.GENERAR_CORREO}`,
      estudianteDto
    );
  }

  public getAllEstudiantesActivos():Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ESTUDIANTE}${ApiHttpConstants.URL_ESTUDIANTE}${ApiHttpConstants.ALL_ESTUDIANTES}`
    )
  }

  public asignarMateriasEstudiante(materiasAsignar:AsignarMateriasEstudiante):Observable<RespuestaGeneral>{
    return this.http.post<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ESTUDIANTE}${ApiHttpConstants.URL_ESTUDIANTE}${ApiHttpConstants.ASIGNAR_MATERIAS_ESTUDIANTE}`,
      materiasAsignar
    )
  }

  public getAllEstudiantesActivosNombre(nombre:string):Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ESTUDIANTE}${ApiHttpConstants.URL_ESTUDIANTE}${ApiHttpConstants.ALL_ESTUDIANTES_NOMBRE}`,
      {
        params:{
          nombre: nombre
        }
      }
    )
  }


}
