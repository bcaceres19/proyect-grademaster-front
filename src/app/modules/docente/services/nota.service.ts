import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaGeneral } from 'src/app/interface/respuesta-general.interface';
import { ApiHttpConstants } from 'src/app/shared/api.constants';
import { CrearNota } from '../interface/crearNota.interface';
import { NotaMateria } from '../interface/notaMateria.interface';

@Injectable({
  providedIn: 'root'
})
export class NotaService {

  constructor(private http:HttpClient) { }

  public existenciaNotas(codigoDocente:string, codigoMateria:string):Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_DOCENTE}${ApiHttpConstants.URL_DOCENTE}${ApiHttpConstants.NOTAS_DOCENTE}${ApiHttpConstants.VERIFICAR_EXISTENCIA_NOTAS}`,
      {
        params:{
          codigoDocente: codigoDocente,
          codigoMateria: codigoMateria
        }
      }
    
    )
  }

  public generarCodigo():Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_DOCENTE}${ApiHttpConstants.URL_DOCENTE}${ApiHttpConstants.NOTAS_DOCENTE}${ApiHttpConstants.GENERAR_CODIGO_NOTA}`
    )
  }

  public guaradarNotas(notas:CrearNota[]):Observable<RespuestaGeneral>{
    return this.http.post<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_DOCENTE}${ApiHttpConstants.URL_DOCENTE}${ApiHttpConstants.NOTAS_DOCENTE}${ApiHttpConstants.CREAR_NOTAS}`,
      notas
    )
  }

  public guardarNotasEstudiante(notas:NotaMateria[]):Observable<RespuestaGeneral>{
    return this.http.post<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_DOCENTE}${ApiHttpConstants.URL_DOCENTE}${ApiHttpConstants.NOTAS_DOCENTE}${ApiHttpConstants.CREAR_NOTAS_ESTUDIANTE}`,
      notas
    )
  }

}
