import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpConstants } from 'src/app/shared/api.constants';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  constructor(private http:HttpClient) { }

  public upload(data:any):Observable<any>{

    return this.http.post(
      `${ApiHttpConstants.API_BASE_CLOUDINARY}${ApiHttpConstants.API_CLOUDINARY}${ApiHttpConstants.CLOUD_NAME}${ApiHttpConstants.UPLOAD_IMAGE}`,
      data
    )

  }

}
