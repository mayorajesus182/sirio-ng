import { HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";



@Injectable({
  providedIn: 'root'
})
export class RequestCacheService {

  api_chacheable=[
    '/api/public/assets/i18n',
    '/api/configuracion',
    '/api/session/permissions',
    '/api/preferencia'
]
  
  constructor() { }

  
  // Método para almacenar los datos de la petición
  public put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    sessionStorage.setItem(req.urlWithParams, JSON.stringify(response));
  }

  // Método para recuperar los datos de la petición
  public get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const res = sessionStorage.getItem(req.urlWithParams);
    return res ? JSON.parse(res) : undefined;
  }
  // Método para recuperar los datos de la petición
  public getByUrl(url:string): HttpResponse<any> | undefined {
    const res = sessionStorage.getItem(url);
    return res ? JSON.parse(res) : undefined;
  }
  // Método para recuperar los datos de la petición
  resetAll():void {
    for (let i = 0; i < sessionStorage.length; i++) {
      let key = sessionStorage.key(i);
      if(this.api_chacheable[1].indexOf(key)>=0){

        sessionStorage.removeItem(key);
      }
      // console.log(key, value);
    }
  }
}
