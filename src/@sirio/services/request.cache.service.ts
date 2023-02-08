import { HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";



@Injectable({
  providedIn: 'root'
})
export class RequestCacheService {
  
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
}