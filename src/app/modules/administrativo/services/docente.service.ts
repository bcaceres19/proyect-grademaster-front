import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RespuestaGeneral } from 'src/app/interface/respuesta-general.interface';
import { ApiHttpConstants } from 'src/app/shared/api.constants';
import { Docente } from '../interface/docente.interface';
import { Observable } from 'rxjs';
import { AsignarMaterias } from '../interface/asignar-materias.interface';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {

  constructor(private http:HttpClient) { }


  public crearDocente(docente:Docente){
    return this.http.post<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_DOCENTE}${ApiHttpConstants.URL_DOCENTE}${ApiHttpConstants.CREAR_DOCENTE}`,
      docente  
    );
  }

  public generarCodigo(docente:Docente){
    return this.http.post<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_DOCENTE}${ApiHttpConstants.URL_DOCENTE}${ApiHttpConstants.GENERAR_CODIGO}`,
      docente
    )
  }

  public generarCorreo(docente:Docente){
    return this.http.post<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_DOCENTE}${ApiHttpConstants.URL_DOCENTE}${ApiHttpConstants.GENERAR_CORREO}`,
      docente
    )
  }
  
  public buscarDocentesAtivosSistema():Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_DOCENTE}${ApiHttpConstants.URL_DOCENTE}${ApiHttpConstants.ALL_DOCENTES_ACTIVOS}`
    )
  }


  public asignarMateriasDocente(materiasAsignar:AsignarMaterias):Observable<RespuestaGeneral>{
    return this.http.post<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_DOCENTE}${ApiHttpConstants.URL_DOCENTE}${ApiHttpConstants.ASIGNAR_MATERIAS}`,
      materiasAsignar
    )
  }

  public buscarDocenteNombre(nombreDocente:string):Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_DOCENTE}${ApiHttpConstants.URL_DOCENTE}${ApiHttpConstants.BUSCAR_DOCENTE_NOMBRE}`,
        {
          params: {
            nombre: nombreDocente
          }
        }
    )
  }

}
