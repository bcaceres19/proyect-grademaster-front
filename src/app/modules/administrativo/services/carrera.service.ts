import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Carrera } from '../interface/carrera.interface';
import { Materia } from '../interface/materia.interface';
import { Observable } from 'rxjs';
import { RespuestaGeneral } from 'src/app/interface/respuesta-general.interface';
import { ApiHttpConstants } from 'src/app/shared/api.constants';
import { CrearCarrera } from '../interface/crear-carrera.interface';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  constructor(private http:HttpClient) {
  }

  public crearCarrera(carrera:Carrera, materias:Materia[]):Observable<RespuestaGeneral>{
    const crearCarrera:CrearCarrera = {
      carrera: carrera,
      materias: materias
    }  
    return this.http.post<RespuestaGeneral>(
        `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ADMINISTRATIVO}${ApiHttpConstants.URL_ADMINISTRATIVO}${ApiHttpConstants.CARRERAS}${ApiHttpConstants.CREAR_CARRERA}`,
          crearCarrera
      );
  }

  public generarCodigo():Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ADMINISTRATIVO}${ApiHttpConstants.URL_ADMINISTRATIVO}${ApiHttpConstants.CARRERAS}${ApiHttpConstants.GENERAR_CODIGO}`,
    )
  }

  

}
