import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Semestre } from '../interface/semestre.interface';
import { RespuestaGeneral } from 'src/app/interface/respuesta-general.interface';
import { ApiHttpConstants } from 'src/app/shared/api.constants';

@Injectable({
  providedIn: 'root'
})
export class SemestreService {

  constructor(private http:HttpClient) { }

  public getUltimoSemestre():Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ADMINISTRATIVO}${ApiHttpConstants.URL_ADMINISTRATIVO}${ApiHttpConstants.SEMESTRE}${ApiHttpConstants.ULTIMO_SEMESTRE}`
    );
  }

  public semestreVencido():Observable<RespuestaGeneral>{
    return this.http.get<RespuestaGeneral>(
      `${ApiHttpConstants.API_BASE}${ApiHttpConstants.PORT_ADMINISTRATIVO}${ApiHttpConstants.URL_ADMINISTRATIVO}${ApiHttpConstants.SEMESTRE}${ApiHttpConstants.SEMESTRE_VENCIDO}`
    );
  }



}
