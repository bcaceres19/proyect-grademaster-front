import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrearMateria } from '../interface/crear-materia.interface';
import { RespuestaGeneral } from 'src/app/interface/respuesta-general.interface';
import { Observable } from 'rxjs';
import { ApiHttpConstants } from 'src/app/shared/api.constants';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {

  constructor(private http:HttpClient) { }

  public crearMateria(dataMateria:CrearMateria):Observable<RespuestaGeneral>{
    return this.http.post<RespuestaGeneral>(
        `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ADMINISTRATIVO}${ApiHttpConstants.URL_ADMINISTRATIVO}${ApiHttpConstants.MATERIAS}${ApiHttpConstants.CREAR_CARRERA}`,
        dataMateria
      );
  }
  public generarCodigo():Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ADMINISTRATIVO}${ApiHttpConstants.URL_ADMINISTRATIVO}${ApiHttpConstants.MATERIAS}${ApiHttpConstants.GENERAR_CODIGO}`,
    )
  }
}
