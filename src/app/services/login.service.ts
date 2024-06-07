import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RespuestaGeneral } from '../interface/respuesta-general.interface';
import { Observable } from 'rxjs';
import { ApiHttpConstants } from '../shared/api.constants';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  public loginUsuario(codigo:string, cedula:string):Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ADMINISTRATIVO}${ApiHttpConstants.URL_ADMINISTRATIVO}${ApiHttpConstants.LOGIN}`,
      {
        params: {
          codigo: codigo,
          cedula: cedula
        }
      }
    );
  }

}
